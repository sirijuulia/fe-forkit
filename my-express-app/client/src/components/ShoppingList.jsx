import React from 'react'
import "./ShoppingList.css";
import { useRef } from 'react';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';

export default function ShoppingList({ ingredients = [], onToggleComplete, onHideItem, onClose, unresolvedChanges, onReset}) {
  const targetRef = useRef();
  const options = {
    method: 'open',
    page: {
      margin: Margin.SMALL
    },
    filename: 'shopping_list.pdf'
  }
  
  if (!Array.isArray(ingredients)) {
    console.error("GroceryList received a non-array value:", ingredients);
    return <p>Error loading grocery list. Please try again.</p>;
}

const uniqueIngredients = ingredients.filter((obj, index, self) => {
  return index === self.findIndex((i) => i.item_name === obj.item_name);})

const writeToClipboard = async () => {
  const ingredientList = ingredients.filter((ingredient) => {return !ingredient.completed && !ingredient.hide}).map((ingredient) =>  `- ${ingredient.item_name} ${ingredient.quantity}\n`)
  const ingredientString = ingredientList.sort().join("")
  try {
    await navigator.clipboard.writeText(ingredientString);
    alert("Shopping list copied to clipboard!")
  } catch (error) {
    console.error(error.message)
  }
}

  return (
        <div className="popup-overlay">
          <div className="popup">
            <div className='shopping-list-header'>
            <button className='list-btn download-btn' title="download" aria-label="download" onClick={() => generatePDF(targetRef, options)}> </button>
            <button className='list-btn clipboard-btn' title="copy to clipboard" aria-label="copy to clipboard" onClick={writeToClipboard}></button>
            <button title="reset" aria-label="reset shopping list" onClick={onReset}  className={`list-btn reset-list-btn ${unresolvedChanges ? "prompt-reset" : ""}`}></button>
            <button className="close-btn" title="close" aria-label='close' onClick={onClose}>×</button>
            </div>
          <div ref={targetRef}>
          <h2 className='shoppinglist-title'>Time to go shopping!</h2>
            <ul className="shopping-list" >
              {uniqueIngredients.sort(function (a, b) {
                    if (a.item_name <= b.item_name) {
                        return -1
                    } else {
                        return 1
                    }}
                ).filter((ingredient) => {return !ingredient.hide}).map((ingredient) => (
                <div key={ingredient.item_name} className='shopping-list-section'>
                  <li   className={`shopping-list-ingredient ${ingredient.completed ? "completed" : ""}`}>
                  <div className='list-bundle'>
                        {/* toggle completion */}
                        <input 
                            type="checkbox" 
                            checked={ingredient.completed} 
                            aria-label={`check ${ingredient.item_name} as complete`}
                            onChange={() => onToggleComplete(ingredient.item_name)}
                        />
                        {/* show name*/}
                        <span>{ingredient.item_name}</span>                        

                        </div>
                        {/* delete button */}
                        <button 
                            onClick={() => onHideItem(ingredient.item_name)}
                            aria-label={`remove ${ingredient.item_name}`}
                            className="delete-btn"
                        >
                            ·
                        </button>
                        
                      </li> 
                      {ingredients.filter((item) => item.item_name === ingredient.item_name).map((item) =>(
                                  <li key={item.groceryID} className={`shopping-item ${ingredient.completed ? "completed" : "" }`}>
                                    <h4 className='gr-col2'>{item.quantity}</h4>    
                                    <h4 className='gr-col3'>{`${item.day} (${item.meal_name})`}</h4>                                
                                  </li>)

                      )}
                      </div>
                  ))}
            </ul>
            </div>
          </div>
        </div>
      );
    };
