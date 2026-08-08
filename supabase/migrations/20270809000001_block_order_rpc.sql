-- Helper RPC function for incrementing block order_index
-- Used when inserting a new block at a specific position
CREATE OR REPLACE FUNCTION increment_block_order(
  p_lesson_id UUID,
  p_from_index INT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE lesson_content_blocks
  SET order_index = order_index + 1
  WHERE lesson_id = p_lesson_id
    AND order_index >= p_from_index;
END;
$$;
