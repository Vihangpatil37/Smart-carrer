import * as fs from 'fs';
import * as path from 'path';
import { parseCatalogFile } from '../src/careers/import/tree-parser.service';

const root = path.resolve(__dirname, '../../');
const phases = [
  { part: 'part_1_science', file: `${root}/SCPR_Master_Career_Catalog_Part_1_Science_v2.md` },
  { part: 'part_2_commerce', file: `${root}/SCPR_Master_Career_Catalog_Part_2_Commerce.md` },
  { part: 'part_3_arts_humanities', file: `${root}/SCPR_Master_Career_Catalog_Part_3_Arts_Humanities.md` },
  { part: 'part_4_diploma', file: `${root}/SCPR_Master_Career_Catalog_Part_4_Diploma.md` },
  { part: 'part_5_iti_polytechnic', file: `${root}/SCPR_Master_Career_Catalog_Part_5_ITI_Polytechnic.md` },
  { part: 'part_6_vocational', file: `${root}/SCPR_Master_Career_Catalog_Part_6_Vocational_Skill_Development.md` },
  { part: 'part_7_government_defence', file: `${root}/SCPR_Master_Career_Catalog_Part_7_Government_Defence.md` },
  { part: 'part_8_emerging_future', file: `${root}/SCPR_Master_Career_Catalog_Part_8_Emerging_Future_Careers.md` },
];

for (const p of phases) {
  const content = fs.readFileSync(p.file, 'utf-8');
  const res = parseCatalogFile(content, p.part);
  console.log(`${p.part}: ${res.leaves.length} leaves, ${res.anomalies.length} anomalies`);
}
