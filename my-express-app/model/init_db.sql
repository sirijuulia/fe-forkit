--
-- Drop old tables (if exist)
--

SET foreign_key_checks = 0;
DROP TABLE IF EXISTS calendar;
DROP TABLE IF EXISTS grocery_list;
SET foreign_key_checks = 1;

--
-- Create authentication table
--

CREATE TABLE auth (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL

);

--
-- Create meal calendar table
--
CREATE TABLE calendar (
    mealID INT AUTO_INCREMENT PRIMARY KEY,
    dbID INT NOT NULL,  -- Unique ID for each meal entry
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    meal_type ENUM('Breakfast', 'Lunch', 'Dinner') NOT NULL,
    meal_img_url VARCHAR(255),
    meal_name VARCHAR(255) NOT NULL,
    userID INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES auth(userID) ON DELETE cascade
);

--
-- Create grocery list table
-- 
CREATE TABLE grocery_list (
    groceryID INT AUTO_INCREMENT PRIMARY KEY,    
    item_name VARCHAR(255) NOT NULL,     
    quantity VARCHAR(255) DEFAULT "1",              
    completed BOOLEAN DEFAULT false, 
    mealID INT NOT NULL,
    userID INT NOT NULL,
    FOREIGN KEY (mealID) REFERENCES calendar(mealID) ON DELETE cascade,
    FOREIGN KEY (userID) REFERENCES auth(userID) ON DELETE cascade     
);
