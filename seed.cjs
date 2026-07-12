const { Client } = require("pg");
const fs = require("fs");

async function run() {
  const client = new Client({
    connectionString:
      "postgresql://postgres:%23KingKhan15112003@db.gnvsqwyexjuuwkjibxrr.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to DB.");

    // 1. Create the table
    await client.query(`DROP TABLE IF EXISTS public.design_projects CASCADE;`);
    await client.query(`
      CREATE TABLE public.design_projects (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          path TEXT,
          color TEXT,
          course_modules JSONB DEFAULT '[]'::jsonb,
          architecture_nodes JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Setup RLS
    await client.query(`ALTER TABLE public.design_projects ENABLE ROW LEVEL SECURITY;`);
    try {
      await client.query(`
        CREATE POLICY "Allow public read access to design_projects"
        ON public.design_projects FOR SELECT TO public USING (true);
      `);
    } catch (e) {
      /* ignore if exists */
    }

    try {
      await client.query(`
        CREATE POLICY "Allow admin full access to design_projects"
        ON public.design_projects FOR ALL TO authenticated
        USING (
          (auth.jwt() ->> 'role') = 'admin' OR 
          (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true OR
          (SELECT email FROM public.profiles WHERE id = auth.uid()) = 'vishwajeetsrk@gmail.com'
        );
      `);
    } catch (e) {
      /* ignore if exists */
    }

    // 3. Read projects.json
    const data = JSON.parse(fs.readFileSync("./src/data/projects.json", "utf8"));

    // 4. Insert data
    let inserted = 0;
    for (const p of data) {
      const res = await client.query(
        "SELECT id FROM public.design_projects WHERE id = $1 OR slug = $2",
        [p.id, p.id],
      );
      if (res.rows.length === 0) {
        await client.query(
          `
          INSERT INTO public.design_projects (id, slug, title, description, path, color, course_modules, architecture_nodes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
          [
            p.id,
            p.id, // using id as slug since it's already a slug like "acreage-nike"
            p.name || p.title || p.id,
            p.description || "",
            p.path || "",
            "#2563EB",
            JSON.stringify(p.course_modules || []),
            JSON.stringify(p.architecture_nodes || []),
          ],
        );
        inserted++;
      }
    }
    console.log(`Successfully migrated table and inserted ${inserted} projects.`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

run();
