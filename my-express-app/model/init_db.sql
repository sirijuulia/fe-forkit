--
-- Drop old tables (if exist)
--

SET foreign_key_checks = 0;
DROP TABLE IF EXISTS grocery_list;
DROP TABLE IF EXISTS instructions;
DROP TABLE IF EXISTS meals;
DROP TABLE IF EXISTS auth;
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
CREATE TABLE meals (
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
    hide BOOLEAN DEFAULT false, 
    mealID INT NOT NULL,
    FOREIGN KEY (mealID) REFERENCES meals(mealID) ON DELETE cascade
);

--
-- Create instruction table
-- 

CREATE TABLE instructions (
    instructionID INT AUTO_INCREMENT PRIMARY KEY,
    step INT NOT NULL,
    instruction_text VARCHAR(500) NOT NULL,                  
    mealID INT NOT NULL,
    FOREIGN KEY (mealID) REFERENCES meals(mealID) ON DELETE cascade
);