ALTER TABLE med_entries DROP CONSTRAINT med_entries_type_check;
ALTER TABLE med_entries ADD CONSTRAINT med_entries_type_check CHECK (type IN ('morning', 'evening', 'iv'));
