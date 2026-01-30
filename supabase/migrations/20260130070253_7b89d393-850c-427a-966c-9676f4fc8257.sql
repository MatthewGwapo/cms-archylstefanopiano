-- Create units table for standardized units of measurement
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    abbreviation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- RLS Policies for units
CREATE POLICY "Public read access for units" ON public.units FOR SELECT USING (true);
CREATE POLICY "Public insert access for units" ON public.units FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for units" ON public.units FOR UPDATE USING (true);
CREATE POLICY "Public delete access for units" ON public.units FOR DELETE USING (true);

-- Insert common construction units
INSERT INTO public.units (name, abbreviation) VALUES
    ('Bag (40kg)', 'bag'),
    ('Bag (50kg)', 'bag'),
    ('Piece', 'pc'),
    ('Kilogram', 'kg'),
    ('Cubic Meter', 'cu.m'),
    ('Square Meter', 'sq.m'),
    ('Linear Meter', 'l.m'),
    ('Roll', 'roll'),
    ('Box', 'box'),
    ('Gallon', 'gal'),
    ('Liter', 'L'),
    ('Set', 'set'),
    ('Bundle', 'bdl'),
    ('Length', 'len'),
    ('Sheet', 'sht')
ON CONFLICT (name) DO NOTHING;