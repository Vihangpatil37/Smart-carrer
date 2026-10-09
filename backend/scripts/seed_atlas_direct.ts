import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CareerSeedService } from '../src/careers/import/seed.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Career, CareerDocument } from '../src/careers/schemas/career.schema';
import * as path from 'path';
import * as fs from 'fs';

interface PhaseConfig {
  part: string;
  fileName: string;
  label: string;
}

const phases: PhaseConfig[] = [
  {
    part: 'part_1_science',
    fileName: 'SCPR_Master_Career_Catalog_Part_1_Science_v2.md',
    label: 'Phase 1 — Science',
  },
  {
    part: 'part_2_commerce',
    fileName: 'SCPR_Master_Career_Catalog_Part_2_Commerce.md',
    label: 'Phase 2 — Commerce',
  },
  {
    part: 'part_3_arts_humanities',
    fileName: 'SCPR_Master_Career_Catalog_Part_3_Arts_Humanities.md',
    label: 'Phase 3 — Arts & Humanities',
  },
  {
    part: 'part_4_diploma',
    fileName: 'SCPR_Master_Career_Catalog_Part_4_Diploma.md',
    label: 'Phase 4 — Diploma',
  },
  {
    part: 'part_5_iti_polytechnic',
    fileName: 'SCPR_Master_Career_Catalog_Part_5_ITI_Polytechnic.md',
    label: 'Phase 5 — ITI & Polytechnic',
  },
  {
    part: 'part_6_vocational',
    fileName: 'SCPR_Master_Career_Catalog_Part_6_Vocational_Skill_Development.md',
    label: 'Phase 6 — Vocational',
  },
  {
    part: 'part_7_government_defence',
    fileName: 'SCPR_Master_Career_Catalog_Part_7_Government_Defence.md',
    label: 'Phase 7 — Government & Defence',
  },
  {
    part: 'part_8_emerging_future',
    fileName: 'SCPR_Master_Career_Catalog_Part_8_Emerging_Future_Careers.md',
    label: 'Phase 8 — Emerging & Future',
  },
];

async function run() {
  console.log('\n======================================================');
  console.log('   PERMANENT MONGODB ATLAS CAREER CATALOG SEEDER');
  console.log('======================================================\n');

  const candidateRoots = [
    '/app/catalogs',
    path.resolve(__dirname, '../../'),
    path.resolve(process.cwd(), '../'),
    path.resolve(process.cwd(), '.'),
    path.resolve(__dirname, '../../../'),
  ];

  const projectRoot =
    candidateRoots.find((dir) =>
      fs.existsSync(
        path.join(dir, 'SCPR_Master_Career_Catalog_Part_1_Science_v2.md'),
      ),
    ) || path.resolve(__dirname, '../../');

  console.log(`Resolved Catalog Root: ${projectRoot}`);

  for (const phase of phases) {
    const filePath = path.join(projectRoot, phase.fileName);
    if (!fs.existsSync(filePath)) {
      console.error(`ERROR: ${phase.fileName} not found at ${filePath}`);
      process.exit(1);
    }
  }

  console.log('All 8 catalog markdown files located.\nInitializing NestJS Application context...');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const careerModel = app.get<Model<CareerDocument>>(getModelToken(Career.name));
  const seedService = app.get(CareerSeedService);

  const initialCount = await careerModel.countDocuments();
  console.log(`Current career count in Atlas: ${initialCount}`);

  let totalNew = 0;
  let totalMerged = 0;

  for (const phase of phases) {
    console.log(`\nImporting ${phase.label}...`);
    const filePath = path.join(projectRoot, phase.fileName);
    const result = await seedService.seedFromCatalog(filePath, phase.part);

    console.log(`  Leaves parsed:      ${result.total_leaves_found}`);
    console.log(`  New careers added:  ${result.new_inserts}`);
    console.log(`  Duplicates merged:  ${result.merged_duplicates}`);
    totalNew += result.new_inserts;
    totalMerged += result.merged_duplicates;
  }

  const finalCount = await careerModel.countDocuments();
  const categories = await careerModel.distinct('category_code');

  console.log('\n======================================================');
  console.log('   SEEDING REPORT');
  console.log('======================================================');
  console.log(`Total new careers inserted: ${totalNew}`);
  console.log(`Total duplicates merged:     ${totalMerged}`);
  console.log(`Final careers in Atlas:      ${finalCount}`);
  console.log(`Categories present in Atlas: ${categories.join(', ')}`);
  console.log('======================================================\n');

  await app.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
