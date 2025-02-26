import React from 'react'
import "./ShoppingList.css";

export default function ShoppingList({ ingredients = [], onToggleComplete, onDeleteItem, onClose}) {
  if (!Array.isArray(ingredients)) {
    console.error("GroceryList received a non-array value:", ingredients);
    return <p>Error loading grocery list. Please try again.</p>;
}
  return (
        <div className="popup-overlay">
          <div className="popup">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>Time to go shopping!</h2>
            <h3>All ingredients</h3>
            <ul className="grocery-list">
                {ingredients.sort(function (a, b) {
                    if (a.item_name <= b.item_name) {
                        return -1
                    } else {
                        return 1
                    }}
                ).map((item, index, array) => (
                    <li key={item.groceryID} className={`grocery-item ${index > 0 && (item.item_name === array[index-1].item_name) ? "duplicate " : ""}${item.completed ? "completed" : ""}}`}>
                        {index > 0 && (item.item_name === array[index-1].item_name) 
                        ? 
                        <>
                        <div></div>
                        {/* show name*/}
                        <span>{item.item_name}</span>
                        {/* show recipe */}
                        <span>{item.meal_name}</span>
                        {/* show amount */}
                        <span>{item.quantity}</span>
                        {/* delete button */}
                        <div></div>

                        </>
                        :
                        <>
                        {/* toggle completion */}
                        <input 
                            type="checkbox" 
                            checked={item.completed} 
                            onChange={() => onToggleComplete(item.groceryID)}
                        />
                        {/* show name*/}
                        <span>{item.item_name}</span>
                        {/* show recipe */}
                        <span>{item.meal_name}</span>
                        {/* show amount */}
                        <span>{item.quantity}</span>
                        {/* delete button */}
                        <button 
                            onClick={() => onDeleteItem(item.groceryID)}
                            className="delete-btn"
                        >
                            ·
                        </button>
                        </>
                        }
                    </li>
                ))}
            </ul>

          </div>
        </div>
      );
    };