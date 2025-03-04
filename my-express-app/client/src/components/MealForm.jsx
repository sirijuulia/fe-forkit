import React, { useState, useEffect, useContext } from "react";
import "./MealForm.css";
import AuthContext from "../context/AuthContext";
import API from "../interceptors/AxiosInstance";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

const MealForm = ({ selectedRecipe, onClose, onAddMeal }) => {
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]); // Monday
  const [selectedMealType, setSelectedMealType] = useState(mealTypes[0]); //Breakfast
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext)

  useEffect(() => {
    if (!selectedRecipe) return;

    const fetchRecipeDetails = async () => {
      setLoading(true);
      try {
        const data = await API.get(`http://localhost:3001/api/recipes/${selectedRecipe.id}`);
        console.log(data)

        if (data) {
          setIngredients(data.data.ingredients || []);
          setInstructions(data.data.instructions || []);
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
    onAddMeal(selectedDay, selectedMealType, selectedRecipe, ingredients, instructions);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
      <button className="close-btn" onClick={onClose}>×</button>
        <h2 >Assign Recipe</h2>
        <div className="img-container">
        <img 
            src={selectedRecipe.image} 
            alt={selectedRecipe.title} 
            className="recipe-cover-img"
        />
        </div>
        <div className='recipe-title-section'>
        <h2 className="recipe-title">{selectedRecipe.title}</h2>
        </div>


        {loading ? (
          <p>Loading recipe details...</p>
        ) : (
          <>
          <div className="recipe-details">
            <div className="ingredients-div">
              <h3>Ingredients:</h3>
                <ul>
                  {ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.quantity} {ingredient.name}
                    </li>
                  ))}
                </ul>
            </div>
            
            <div className="instructions-div">
              <h3>Instructions:</h3>
              <ol>
                  {instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
              </ol>
            </div>
          </div>
          
          <div className="select-container">
            <label htmlFor="select-day">Day:</label>
            <select id="select-day" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <label htmlFor="select-meal-type">Meal Type:</label>
            <select id="select-meal-type" value={selectedMealType} onChange={(e) => setSelectedMealType(e.target.value)}>
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
