# Setup Project

# Data Storage - MySQL
To build a local instance of the database, copy and run the following commands:
```shell
CREATE DATABASE meldcx;
USE meldcx
```

# Create files table
```shell
DROP TABLE IF EXISTS meldcx.files;

CREATE TABLE IF NOT EXISTS meldcx.files (
  public_key VARCHAR(36) PRIMARY KEY,
  private_key VARCHAR(36) UNIQUE,
  file_path TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```