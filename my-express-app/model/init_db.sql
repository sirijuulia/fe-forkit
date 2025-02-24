--
-- Drop old tables (if exist)
--

SET foreign_key_checks = 0;
DROP TABLE IF EXISTS meal_calendar;
DROP TABLE IF EXISTS grocery_list;
SET foreign_key_checks = 1;

--
-- Create meal calendar table
--
CREATE TABLE meal_calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    meal_type ENUM('Breakfast', 'Lunch', 'Dinner') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Create grocery list table
--
CREATE TABLE grocery_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(255) NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 1,
    completed BOOLEAN DEFAULT FALSE
);
