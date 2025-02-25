import React, { useState, useEffect } from "react";
import "./MealForm.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

const MealForm = ({ selectedRecipe, onClose, onAddMeal }) => {
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]); // Monday
  const [selectedMealType, setSelectedMealType] = useState(mealTypes[0]); //Breakfast
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedRecipe) return;

    const fetchRecipeDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/recipes/${selectedRecipe.id}`);
        const data = await response.json();
        console.log(data)

        if (data) {
          setIngredients(data.ingredients || []);
          setInstructions(data.instructions || []);
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
      setLoading(false);
    };

    fetchRecipeDetails();
  }, [selectedRecipe]);

  const handleSubmit = () => {
    if (!selectedRecipe) return;

    // Add meal to calendar
    //to add to calendar, need day, meal_type, meal_name & meal_img_url
    onAddMeal(selectedDay, selectedMealType, selectedRecipe, ingredients);

    // Save to database
    // fetch("http://localhost:3001/api/calendar", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     day: selectedDay,
    //     meal_type: selectedMealType,
    //     meal_name: selectedRecipe.title,
    //     meal_img_url: selectedRecipe.image
    //   }),
    // })
    // .then(response => response.json())
    // .then(data => console.log("Meal saved:", data))
    // .catch(error => console.error("Error saving meal:", error));

    // onClose(); // Close the popup after saving
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
      <button className="close-btn" onClick={onClose}>×</button>
        <h2>Assign Recipe</h2>
        <h3>{selectedRecipe.title}</h3>
        <img 
            src={selectedRecipe.image} 
            alt={selectedRecipe.title} 
            style={{ width: "200px" }} 
        />

        {loading ? (
          <p>Loading recipe details...</p>
        ) : (
          <>
          <div className="details-container">
            <div className="ingredients-container">
              <h4>Ingredients:</h4>
                <ul>
                  {ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.quantity} {ingredient.name}
                    </li>
                  ))}
                </ul>
            </div>
            
            <div className="instructions-container">
              <h4>Instructions:</h4>
              <ol>
                  {instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
              </ol>
            </div>
          </div>
          
          <div className="select-container">
            <label>Day:</label>
            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <label>Meal Type:</label>
            <select value={selectedMealType} onChange={(e) => setSelectedMealType(e.target.value)}>
              {mealTypes.map((meal) => (
                <option key={meal} value={meal}>{meal}</option>
            ))}
            </select>
          </div>
          
          <div className="button-container">
            <button className="add-btn"  onClick={handleSubmit}>Add to Calendar</button>
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MealForm;

