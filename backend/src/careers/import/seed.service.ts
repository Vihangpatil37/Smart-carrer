import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Career, CareerDocument } from '../schemas/career.schema';
import { computeTraitWeights, TraitProfile } from './default-weights.config';
import {
  computeEligibility,
  EligibilityConstraints,
} from './default-eligibility.config';
import { CATALOG_TO_CATEGORY, isValidSubDomain } from './taxonomy.config';
import {
  parseCatalogFile,
  ParsedCareerLeaf,
  computeSubDomainCode,
  slugify,
} from './tree-parser.service';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface SeedPhaseResult {
  catalogPart: string;
  categoryCode: string;
  total_leaves_found: number;
  new_inserts: number;
  merged_duplicates: number;
  needs_enrichment_flagged: number;
  overview_skipped: number;
  anomalies: string[];
  timestamp: string;
}

function inferMetadata(
  categoryCode: string,
  name: string,
  pathwayTags: string[],
  eligibility: any,
) {
  const categoryLabels: Record<string, string> = {
    science: 'Science & Technology',
    commerce: 'Commerce & Finance',
    arts_humanities: 'Arts & Humanities',
    diploma: 'Engineering & Polytechnic Diploma',
    iti_polytechnic: 'ITI Technical Trades',
    vocational: 'Vocational Skill Development',
    government_defence: 'Government & Defence Services',
    emerging_future: 'Emerging & Future Technologies',
  };

  const domainLabel = categoryLabels[categoryCode] || categoryCode;
  const pathwayText = pathwayTags.length > 0 ? ` (Pathways: ${pathwayTags.slice(0, 3).join(' > ')})` : '';
  const description = `Professional career in ${name}${pathwayText}. Requires domain competency, practical skills, and structured education in the ${domainLabel} sector.`;

  const skillsMap: Record<string, string[]> = {
    science: ['Analytical Thinking', 'Problem Solving', 'Data Analysis', 'Technical Proficiency'],
    commerce: ['Financial Analysis', 'Strategic Management', 'Business Analytics', 'Communication'],
    arts_humanities: ['Critical Analysis', 'Creative Design', 'Communication', 'Research Methodology'],
    diploma: ['Technical Operations', 'Equipment Maintenance', 'CAD/Technical Drafting', 'Safety Protocols'],
    iti_polytechnic: ['Practical Tool Handling', 'System Installation', 'Component Repair', 'Industrial Safety'],
    vocational: ['Applied Domain Skills', 'Customer Engagement', 'Operational Workflow', 'Quality Standards'],
    government_defence: ['Public Administration', 'Strategic Planning', 'Leadership', 'Discipline & Ethics'],
    emerging_future: ['Next-Gen Tech Innovation', 'AI & Digital Systems', 'Complex Problem Solving', 'Adaptability'],
  };

  const baseSkills = skillsMap[categoryCode] || ['Critical Thinking', 'Problem Solving', 'Teamwork'];
  const skills = [...baseSkills];
  const nameLower = name.toLowerCase();
  if (nameLower.includes('software') || nameLower.includes('data') || nameLower.includes('developer') || nameLower.includes('engineer')) {
    skills.push('Technical Engineering');
  }
  if (nameLower.includes('design')) {
    skills.push('Visual Design');
  }
  if (nameLower.includes('manager') || nameLower.includes('officer')) {
    skills.push('Team Leadership');
  }

  const salaries: Record<string, string> = {
    science: '₹6.0 - 18.0 LPA',
    commerce: '₹5.0 - 15.0 LPA',
    arts_humanities: '₹4.5 - 12.0 LPA',
    diploma: '₹3.5 - 7.5 LPA',
    iti_polytechnic: '₹2.5 - 5.5 LPA',
    vocational: '₹3.5 - 8.0 LPA',
    government_defence: '₹45,000 - ₹1,25,000 / month (Pay Level 6-10)',
    emerging_future: '₹8.0 - 25.0 LPA',
  };

  const growths: Record<string, string> = {
    science: 'High (+18% YoY)',
    commerce: 'Strong (+14% YoY)',
    arts_humanities: 'Steady (+10% YoY)',
    diploma: 'Steady Demand (+12% YoY)',
    iti_polytechnic: 'High Demand (+15% YoY)',
    vocational: 'Rapid Growth (+22% YoY)',
    government_defence: 'High Stability & Security',
    emerging_future: 'Exponential (+35% YoY)',
  };

  const streamReq = eligibility.required_stream && eligibility.required_stream !== 'any'
    ? `${eligibility.required_stream} stream`
    : 'Any recognized stream';
  const duration = eligibility.min_study_duration_years
    ? `minimum ${eligibility.min_study_duration_years} years program`
    : 'standard certification/degree';

  const entry = `Eligibility: 10th/12th qualification with ${streamReq}, followed by ${duration}.`;

  return {
    description,
    skills,
    average_salary: salaries[categoryCode] || '₹4.0 - 10.0 LPA',
    growth_rate: growths[categoryCode] || 'Stable (+10% YoY)',
    entry_requirements: entry,
  };
}

@Injectable()
export class CareerSeedService {
  private readonly logger = new Logger(CareerSeedService.name);

  constructor(
    @InjectModel(Career.name)
    private readonly careerModel: Model<CareerDocument>,
  ) {}

  /**
   * Seed a single catalog file, returning stats for the import.
   *
   * @param filePath - Absolute or relative path to the catalog markdown file
   * @param catalogPart - Catalog identifier e.g. "part_1_science"
   */
  async seedFromCatalog(
    filePath: string,
    catalogPart: string,
  ): Promise<SeedPhaseResult> {
    const categoryCode = CATALOG_TO_CATEGORY[catalogPart];
    if (!categoryCode) {
      throw new Error(
        `Unknown catalog part: ${catalogPart}. Must be one of: ${Object.keys(CATALOG_TO_CATEGORY).join(', ')}`,
      );
    }

    // Read file
    let content: string;
    try {
      const resolvedPath = path.resolve(filePath);
      content = await fs.readFile(resolvedPath, 'utf-8');
    } catch (err: any) {
      throw new Error(
        `Failed to read catalog file at ${filePath}: ${err.message}`,
      );
    }

    // Parse the ASCII tree
    const { leaves, anomalies, overview_skipped } = parseCatalogFile(
      content,
      catalogPart,
    );

    if (leaves.length === 0) {
      return {
        catalogPart,
        categoryCode,
        total_leaves_found: 0,
        new_inserts: 0,
        merged_duplicates: 0,
        needs_enrichment_flagged: 0,
        overview_skipped,
        anomalies:
          anomalies.length > 0
            ? anomalies
            : ['No career leaves found in catalog'],
        timestamp: new Date().toISOString(),
      };
    }

    this.logger.log(
      `Parsed ${leaves.length} career leaves from ${catalogPart}`,
    );

    // Process each leaf: dedup, apply rules, upsert
    let newInserts = 0;
    let mergedDuplicates = 0;
    let enrichmentFlagged = 0;
    const phaseAnomalies: string[] = [...anomalies];

    // Handle Part 5 (ITI/Polytechnic) cross-linking: Polytechnic subtree has degree names only
    // We skip creating careers from these and instead cross-link pathway_tags
    const polytechnicLeaves = leaves.filter(
      (l) => l.sub_domain_source === 'Polytechnic',
    );
    if (polytechnicLeaves.length > 0) {
      this.logger.log(
        `Cross-linking ${polytechnicLeaves.length} Polytechnic branches with Diploma careers...`,
      );
      for (const pLeaf of polytechnicLeaves) {
        // Map Polytechnic branch name to sub_domain_code (e.g. "Computer Engineering" → "computer_engineering")
        const polySubDomain = slugify(pLeaf.name);
        const count = await this.careerModel
          .countDocuments({
            category_code: 'diploma',
            sub_domain_code: polySubDomain,
          })
          .exec();
        if (count > 0) {
          await this.careerModel
            .updateMany(
              { category_code: 'diploma', sub_domain_code: polySubDomain },
              { $addToSet: { pathway_tags: 'polytechnic' } },
            )
            .exec();
        }
      }
      this.logger.log(
        `Cross-linking complete for ${polytechnicLeaves.length} Polytechnic branches`,
      );
    }

    // Filter out Polytechnic leaves from regular processing
    const careerLeaves = leaves.filter(
      (l) => l.sub_domain_source !== 'Polytechnic',
    );

    for (const leaf of careerLeaves) {
      // Compute sub_domain_code from the depth-1 ancestor
      const rawSubDomain = computeSubDomainCode(leaf.sub_domain_source);
      const prefixedSubDomain = `${categoryCode}_${rawSubDomain}`;
      // For parenthetical codes like "Company Secretary (CS)", also try the inner code "cs"
      const parenMatch = leaf.sub_domain_source.match(/\(([^)]+)\)/);
      const innerCode = parenMatch
        ? slugify(parenMatch[1].trim().replace(/\./g, '_'))
        : null;
      // Resolve: try raw, inner code, prefixed, then fallback
      const subDomainCode = isValidSubDomain(categoryCode, rawSubDomain)
        ? rawSubDomain
        : innerCode && isValidSubDomain(categoryCode, innerCode)
          ? innerCode
          : isValidSubDomain(categoryCode, prefixedSubDomain)
            ? prefixedSubDomain
            : rawSubDomain;

      // Check if the career already exists (by career_code)
      const existing = await this.careerModel
        .findOne({ career_code: leaf.career_code })
        .exec();

      if (existing) {
        // Dedup: merge pathway_tags and source_catalog_parts
        const update: any = {
          $addToSet: {
            source_catalog_parts: catalogPart,
          },
        };

        // Merge pathway tags using $addToSet with $each (avoids overwrite in loop)
        if (leaf.pathway_tags.length > 0) {
          update.$addToSet.pathway_tags = { $each: leaf.pathway_tags };
        }

        await this.careerModel.updateOne(
          { career_code: leaf.career_code },
          update,
        );

        mergedDuplicates++;
      } else {
        // New career — compute weights and eligibility from rules
        const traitWeights = computeTraitWeights(categoryCode, leaf.name);
        const { eligibility, needs_enrichment: enrichmentFlag } =
          computeEligibility(categoryCode, subDomainCode);

        // Detect broad-degree leaves (Section 3.2 heuristic)
        const broadDegreeKeywords = [
          'engineering',
          'bachelor',
          'master',
          'b.sc',
          'b.com',
          'b.a',
          'm.sc',
          'm.com',
          'm.a',
          'b.tech',
          'm.tech',
          'b.e',
          'm.e',
          'm.b.a',
          'b.b.a',
          'b.c.a',
          'm.c.a',
          'b.pharma',
          'b.arch',
          'b.des',
          'b.f.a',
          'b.p.ed',
          'b.ed',
          'm.ed',
        ];
        const nameLower = leaf.name.toLowerCase();
        const isBroadDegree = broadDegreeKeywords.some((kw) =>
          nameLower.includes(kw),
        );

        if (enrichmentFlag) {
          enrichmentFlagged++;
        }
        if (isBroadDegree) {
          enrichmentFlagged++;
        }

        const meta = inferMetadata(categoryCode, leaf.name, leaf.pathway_tags, eligibility);

        const newCareer = new this.careerModel({
          career_code: leaf.career_code,
          category_code: categoryCode,
          name: leaf.name,
          description: meta.description,
          required_skills: meta.skills,
          skills_required: meta.skills,
          technical_skills: meta.skills.slice(0, 2),
          soft_skills: meta.skills.slice(2),
          market_demand: categoryCode === 'emerging_future' ? 'High' : 'Medium',
          future_scope: categoryCode === 'emerging_future' ? 'Growing' : 'Stable',
          career_progression: 'Standard professional progression path',
          average_salary: meta.average_salary,
          growth_rate: meta.growth_rate,
          entry_requirements: meta.entry_requirements,
          trait_weights: traitWeights,
          eligibility: {
            min_maths: eligibility.min_maths,
            min_science: eligibility.min_science,
            min_biology: eligibility.min_biology,
            min_english: 0,
            min_study_duration_years: eligibility.min_study_duration_years,
            max_study_duration_years: eligibility.max_study_duration_years,
            required_stream: eligibility.required_stream || 'any',
            abroad_required: false,
          },
          sub_domain_code: subDomainCode,
          pathway_tags: leaf.pathway_tags,
          source_catalog_parts: [catalogPart],
          backfill_status: 'rule_based',
          needs_enrichment: enrichmentFlag || isBroadDegree,
          is_active: true,
          imported_at: new Date(),
        });

        await newCareer.save();
        newInserts++;
      }
    }


    if (newInserts > 0) {
      this.logger.log(`Inserted ${newInserts} new careers from ${catalogPart}`);
    }
    if (mergedDuplicates > 0) {
      this.logger.log(
        `Merged ${mergedDuplicates} duplicates from ${catalogPart}`,
      );
    }

    return {
      catalogPart,
      categoryCode,
      total_leaves_found: leaves.length,
      new_inserts: newInserts,
      merged_duplicates: mergedDuplicates,
      needs_enrichment_flagged: enrichmentFlagged,
      overview_skipped,
      anomalies: phaseAnomalies,
      timestamp: new Date().toISOString(),
    };
  }
}
