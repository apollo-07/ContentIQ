-- =============================================================================
-- ContentIQ – PostgreSQL Schema
-- Run: psql -U postgres -d contentiq -f database/schema.sql
-- =============================================================================

-- Drop tables in reverse dependency order (for clean resets)
DROP TABLE IF EXISTS model_runs CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS predictions CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS datasets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================================================
-- users
-- =============================================================================
CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    email            VARCHAR(255) NOT NULL UNIQUE,
    username         VARCHAR(100) NOT NULL UNIQUE,
    hashed_password  VARCHAR(255) NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- =============================================================================
-- datasets
-- =============================================================================
CREATE TABLE datasets (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    file_path   VARCHAR(512) NOT NULL,
    row_count   INTEGER      NOT NULL DEFAULT 0,
    status      VARCHAR(50)  NOT NULL DEFAULT 'pending',  -- pending | ready | error
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_datasets_user_id ON datasets(user_id);

-- =============================================================================
-- posts
-- =============================================================================
CREATE TABLE posts (
    id               SERIAL PRIMARY KEY,
    dataset_id       INTEGER      NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    user_id          INTEGER      NOT NULL REFERENCES users(id)    ON DELETE CASCADE,

    -- Original CSV columns
    post_id          VARCHAR(100),
    date             DATE,
    content_type     VARCHAR(100),
    topic            VARCHAR(100),
    posting_time     VARCHAR(50),
    day_of_week      VARCHAR(20),
    caption_length   INTEGER,
    hashtag_count    INTEGER,
    followers        INTEGER,

    -- Engagement metrics
    impressions      INTEGER,
    reach            INTEGER,
    views            INTEGER,
    likes            INTEGER,
    comments         INTEGER,
    shares           INTEGER,
    saves            INTEGER,

    -- Derived
    engagement_rate  NUMERIC(8, 4),
    posting_hour     INTEGER,

    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id    ON posts(user_id);
CREATE INDEX idx_posts_dataset_id ON posts(dataset_id);
CREATE INDEX idx_posts_content_type ON posts(content_type);
CREATE INDEX idx_posts_topic ON posts(topic);

-- =============================================================================
-- predictions
-- =============================================================================
CREATE TABLE predictions (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Input features (NO engagement metrics – avoids target leakage)
    content_type     VARCHAR(100),
    topic            VARCHAR(100),
    day_of_week      VARCHAR(20),
    posting_hour     INTEGER,
    caption_length   INTEGER,
    hashtag_count    INTEGER,
    followers        INTEGER,

    -- Output
    prediction       VARCHAR(20)  NOT NULL,   -- LOW | MEDIUM | HIGH
    probability      NUMERIC(6,4),
    model_name       VARCHAR(100),

    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_predictions_user_id ON predictions(user_id);

-- =============================================================================
-- recommendations
-- =============================================================================
CREATE TABLE recommendations (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER      NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    dataset_id   INTEGER               REFERENCES datasets(id) ON DELETE CASCADE,
    rank         INTEGER      NOT NULL,
    content_type VARCHAR(100),
    topic        VARCHAR(100),
    day          VARCHAR(20),
    time_range   VARCHAR(50),
    score        NUMERIC(6,2),
    reasons      TEXT,                 -- JSON-serialised list of strings
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);

-- =============================================================================
-- model_runs
-- =============================================================================
CREATE TABLE model_runs (
    id             SERIAL PRIMARY KEY,
    model_name     VARCHAR(100) NOT NULL,
    accuracy       NUMERIC(6,4),
    precision      NUMERIC(6,4),
    recall         NUMERIC(6,4),
    f1_score       NUMERIC(6,4),
    is_best        BOOLEAN      NOT NULL DEFAULT FALSE,
    artifact_path  VARCHAR(512),
    notes          TEXT,
    trained_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
