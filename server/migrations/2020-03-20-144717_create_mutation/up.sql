CREATE TABLE IF NOT EXISTS find_replace_commands (
  id INTEGER NOT NULL PRIMARY KEY,
  find VARCHAR NOT NULL,
  replace VARCHAR NOT NULL,
  command VARCHAR NOT NULL,
  is_global BOOLEAN NOT NULL,
  is_inplace BOOLEAN NOT NULL,
  shortcode VARCHAR NOT NULL UNIQUE
);