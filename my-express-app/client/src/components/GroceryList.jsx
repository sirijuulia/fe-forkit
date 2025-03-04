import React from "react";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import "./GroceryList.css"

const GroceryList = ({ ingredients = [], onToggleComplete, onHideItem, onShowShoppingList, unresolvedChanges, onReset }) => {
    if (!Array.isArray(ingredients)) {
        console.error("GroceryList received a non-array value:", ingredients);
        return <p>Error loading grocery list. Please try again.</p>;
    }

    const auth = useContext(AuthContext)

    const uniqueIngredients = ingredients.filter((obj, index, self) => {
        return index === self.findIndex((i) => i.item_name === obj.item_name);})

    return (
        <div className="grocery-list-container">
            <div className="top-buttons">
            <button title="reset" aria-label="reset shopping list" onClick={onReset}  className={`reset-btn ${unresolvedChanges ? "prompt-reset" : ""}`}></button>
            <button title="expand" aria-label="expand shopping list" onClick={onShowShoppingList} className="shopping-list-button"></button>
            </div>
            <h2>Grocery List</h2>
            <ul className="grocery-list">
                {uniqueIngredients.sort(function (a, b) {
                    if (a.item_name <= b.item_name) {
                        return -1
                    } else {
                        return 1
                    }}
                ).filter((ingredient) => {return !ingredient.hide}).map((item) => (
                    <li key={item.item_name} className={`grocery-item ${item.completed ? "completed" : ""}`}>
                        {/* toggle completion */}
                        <input 
                            type="checkbox" 
                            aria-label={`check ${item.item_name} as complete`}
                            checked={item.completed} 
                            onChange={() => onToggleComplete(item.item_name)}
                        />
                        {/* show name*/}
                        <span>{item.item_name}</span>
                        {/* delete button */}
                        <button 
                            onClick={() => onHideItem(item.item_name)}
                            aria-label={`remove ${item.item_name}`}
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
