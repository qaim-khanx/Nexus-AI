import psycopg2
import os
import time

# Connection params (internal docker network)
DB_PARAMS = {
    "host": "ai_market_postgres",
    "port": 5432,
    "database": "ai_market_system",
    "user": "postgres",
    "password": "password"
}

SQL_FILE = "config/init.sql"

ENSEMBLE_SIGNALS_SQL = """
CREATE TABLE IF NOT EXISTS ensemble_signals (
    signal_id VARCHAR(100) PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    signal_type VARCHAR(20) NOT NULL,
    blended_confidence DECIMAL(5,4) NOT NULL,
    regime VARCHAR(50),
    blend_mode VARCHAR(50),
    quality_score DECIMAL(5,4),
    contributors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ensemble_signals_symbol
        FOREIGN KEY (symbol) REFERENCES symbols (symbol) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ensemble_signals_created_at ON ensemble_signals(created_at);
CREATE INDEX IF NOT EXISTS idx_ensemble_signals_symbol ON ensemble_signals(symbol);
"""

def wait_for_db():
    retries = 5
    while retries > 0:
        try:
            conn = psycopg2.connect(**DB_PARAMS)
            conn.close()
            return True
        except Exception:
            print("Waiting for database...")
            time.sleep(2)
            retries -= 1
    return False

def init_db():
    if not wait_for_db():
        print("Could not connect to database.")
        return

    try:
        print("Connecting to database...")
        conn = psycopg2.connect(**DB_PARAMS)
        conn.autocommit = True
        cur = conn.cursor()

        # 1. Run init.sql
        print(f"Reading {SQL_FILE}...")
        try:
            with open(SQL_FILE, 'r') as f:
                lines = f.readlines()
                # Filter out psql commands like \c
                sql_content = "".join([l for l in lines if not l.strip().startswith('\\')])

            print("Executing init.sql...")
            cur.execute(sql_content)
            print("init.sql executed successfully.")
        except Exception as e:
            print(f"Warning running init.sql: {e}")
            # Continue anyway as some tables might exist

        # 2. Create ensemble_signals
        print("Creating ensemble_signals table...")
        cur.execute(ENSEMBLE_SIGNALS_SQL)
        print("ensemble_signals table created.")

        cur.close()
        conn.close()
        print("Database initialization complete!")

    except Exception as e:
        print(f"Error initializing database: {e}")

if __name__ == "__main__":
    init_db()
