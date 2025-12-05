CREATE TABLE scores
(
    id           BIGSERIAL PRIMARY KEY,
    player_name  VARCHAR(255) NOT NULL,
    difficulty   VARCHAR(50)  NOT NULL,
    time_seconds BIGINT       NOT NULL,
    played_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scores_difficulty_time ON scores (difficulty, time_seconds);