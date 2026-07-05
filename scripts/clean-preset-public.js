import fs from 'fs';
import path from 'path';

const presetSitesDir = path.join(process.cwd(), 'public', 'preset-sites');

if (fs.existsSync(presetSitesDir)) {
  const sites = fs.readdirSync(presetSitesDir);
  for (const site of sites) {
    const sitePath = path.join(presetSitesDir, site);
    if (fs.statSync(sitePath).isDirectory()) {
      const nestedPublic = path.join(sitePath, 'public');
      if (fs.existsSync(nestedPublic) && fs.statSync(nestedPublic).isDirectory()) {
        console.log(`Found nested public folder in ${site}: moving contents up and removing nested folder`);
        const files = fs.readdirSync(nestedPublic);
        for (const file of files) {
          const src = path.join(nestedPublic, file);
          const dest = path.join(sitePath, file);
          if (!fs.existsSync(dest)) {
            fs.renameSync(src, dest);
          } else {
            fs.rmSync(src, { recursive: true, force: true });
          }
        }
        fs.rmdirSync(nestedPublic, { recursive: true });
      }
    }
  }
}
console.log('Nested public folders check complete.');
