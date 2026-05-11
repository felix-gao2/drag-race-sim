package db

const schema = `
CREATE TABLE IF NOT EXISTS cars (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    make          TEXT    NOT NULL,
    model         TEXT    NOT NULL,
    year          INTEGER NOT NULL,
    trim          TEXT    NOT NULL,
    horsepower    INTEGER NOT NULL,
    torque        INTEGER NOT NULL,
    weight_lbs    INTEGER NOT NULL,
    drivetrain    TEXT    NOT NULL,
    zero_to_sixty REAL    NOT NULL,
    quarter_mile  REAL    NOT NULL,
    trap_mph      REAL,
    UNIQUE(make, model, year, trim)
);

CREATE TABLE IF NOT EXISTS races (
    slug       TEXT PRIMARY KEY,
    car_a_id   INTEGER NOT NULL REFERENCES cars(id),
    car_b_id   INTEGER NOT NULL REFERENCES cars(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
