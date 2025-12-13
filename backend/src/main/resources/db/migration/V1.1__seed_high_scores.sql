-- =================================================================================
-- MEDIUM DIFFICULTY
-- =================================================================================
INSERT INTO scores (player_name, difficulty, time_seconds, played_at)
VALUES ('Sweeper Pro Plus', 'MEDIUM', 69, NOW() - INTERVAL '45 days'),

       ('xX_GridMaster_Xx', 'MEDIUM', 75, NOW() - INTERVAL '12 days'),

       ('coffee_break', 'MEDIUM', 90, NOW() - INTERVAL '2 days'),

       ('sudo_win', 'MEDIUM', 105, NOW() - INTERVAL '60 days'),

       ('Guest_9921', 'MEDIUM', 125, NOW() - INTERVAL '5 hours');


-- =================================================================================
-- HARD DIFFICULTY
-- Detailed long games. 
-- =================================================================================

INSERT INTO scores (player_name, difficulty, time_seconds, played_at)
VALUES ('*Him*', 'HARD', 230, NOW() - INTERVAL '21 days'),

       ('404_Mine_NotFound', 'HARD', 243, NOW() - INTERVAL '21 days'),

       ('ClickAndPray', 'HARD', 252, NOW() - INTERVAL '3 days'),

       ('Dave', 'HARD', 270, NOW() - INTERVAL '90 days'),

       ('Sweeping Enjoyer', 'HARD', 305, NOW() - INTERVAL '6 days'),

       ('SlowNSteady', 'HARD', 400, NOW() - INTERVAL '1 month');

-- EASY is left empty