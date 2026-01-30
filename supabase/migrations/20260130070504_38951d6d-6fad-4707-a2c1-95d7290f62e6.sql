-- Add threshold column to materials table
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS threshold INTEGER DEFAULT 10;