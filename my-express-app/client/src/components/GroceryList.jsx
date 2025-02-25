import React from "react";
import "./GroceryList.css"

const GroceryList = ({ ingredients = [], onToggleComplete, onDeleteItem }) => {
    if (!Array.isArray(ingredients)) {
        console.error("GroceryList received a non-array value:", ingredients);
        return <p>Error loading grocery list. Please try again.</p>;
    }

    return (
        <div className="grocery-list-container">
            <h2>Grocery List</h2>
            <ul className="grocery-list">
                {ingredients.map((item) => (
                    <li key={item.groceryID} className={`grocery-item ${item.completed ? "completed" : ""}`}>
                        {/* toggle completion */}
                        <input 
                            type="checkbox" 
                            checked={item.completed} 
                            onChange={() => onToggleComplete(item.groceryID)}
                        />
                        {/* show name*/}
                        <span>{item.item_name}</span>
                        {/* delete button */}
                        <button 
                            onClick={() => onDeleteItem(item.groceryID)}
                            className="delete-btn"
                        >
                            ·
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroceryList;
