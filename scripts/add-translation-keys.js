import fs from "fs";
import path from "path";

const LOCALES_DIR = "C:/Users/vishw/Music/Learnify AI/public/locales";

const translations = {
  en: "Projects",
  de: "Projekte",
  es: "Proyectos",
  fr: "Projets",
  hi: "परियोजनाएं",
  bn: "প্রকল্প",
  gu: "પ્રોજેક્ટ્સ",
  kn: "ಯೋಜನೆಗಳು",
  mr: "प्रकल्प",
  ta: "திட்டங்கள்",
  te: "ప్రాజెక్ట్స్",
};

function main() {
  console.log("Updating translation keys in all translation.json files...");

  if (!fs.existsSync(LOCALES_DIR)) {
    console.error(`Locales directory not found at: ${LOCALES_DIR}`);
    process.exit(1);
  }

  const langs = fs.readdirSync(LOCALES_DIR);

  for (const lang of langs) {
    const filePath = path.join(LOCALES_DIR, lang, "translation.json");
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(content);

        if (json.nav) {
          const val = translations[lang] || translations.en;
          json.nav.projects = val;
          fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8");
          console.log(`Updated translation for [${lang}]: "${val}"`);
        }
      } catch (err) {
        console.error(`Error parsing translation for ${lang}:`, err);
      }
    }
  }

  console.log("Done updating translation keys!");
}

main();
