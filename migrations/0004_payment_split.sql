-- Keep legacy `amount` as the calculated total while adding separate payment channels.
ALTER TABLE donations ADD COLUMN cash_amount REAL NOT NULL DEFAULT 0;
ALTER TABLE donations ADD COLUMN transfer_amount REAL NOT NULL DEFAULT 0;

-- Existing records were entered as one undifferentiated total; preserve them as cash.
UPDATE donations
SET cash_amount = amount,
    transfer_amount = 0
WHERE cash_amount = 0 AND transfer_amount = 0;
