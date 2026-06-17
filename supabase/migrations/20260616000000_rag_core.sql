-- Phase 1: Database Infrastructure & RAG Core
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Course Materials (Files, Transcripts, PDFs)
CREATE TABLE IF NOT EXISTS course_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    material_type TEXT NOT NULL CHECK (material_type IN ('pdf', 'transcript', 'note')),
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material Chunks (Embeddings for RAG)
CREATE TABLE IF NOT EXISTS material_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES course_materials(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(768), -- Gemini text-embedding-004 outputs 768 dimensions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster semantic search using HNSW
CREATE INDEX IF NOT EXISTS material_chunks_embedding_idx 
ON material_chunks 
USING hnsw (embedding vector_cosine_ops);

-- RLS Policies
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_chunks ENABLE ROW LEVEL SECURITY;

-- Allow public reads for course materials and chunks
CREATE POLICY "Public profiles are viewable by everyone" ON course_materials FOR SELECT USING (true);
CREATE POLICY "Public chunks are viewable by everyone" ON material_chunks FOR SELECT USING (true);

-- Allow creators to insert materials
CREATE POLICY "Creators can insert materials" ON course_materials FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Creators can insert chunks" ON material_chunks FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);

-- Postgres Function for Semantic Similarity Search
CREATE OR REPLACE FUNCTION match_material_chunks (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT,
  filter_course_id UUID
)
RETURNS TABLE (
  id UUID,
  material_id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mc.id,
    mc.material_id,
    mc.content,
    1 - (mc.embedding <=> query_embedding) AS similarity
  FROM material_chunks mc
  WHERE mc.course_id = filter_course_id
    AND 1 - (mc.embedding <=> query_embedding) > match_threshold
  ORDER BY mc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
