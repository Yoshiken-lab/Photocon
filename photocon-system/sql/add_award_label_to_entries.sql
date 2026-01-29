-- Add award_label column to entries table for storing 'gold', 'silver', 'bronze'
ALTER TABLE entries ADD COLUMN IF NOT EXISTS award_label text;

-- Add check constraint to ensure valid values (optional but good practice)
-- If you want to allow other awards later, you can remove or update this check.
ALTER TABLE entries ADD CONSTRAINT entries_award_label_check CHECK (award_label IN ('gold', 'silver', 'bronze'));

-- Create an index for faster filtering by award
CREATE INDEX IF NOT EXISTS idx_entries_award_label ON entries(award_label);
