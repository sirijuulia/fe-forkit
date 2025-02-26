import React from 'react'
import "./ShoppingList.css";
import { useRef } from 'react';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';

export default function ShoppingList({ ingredients = [], onToggleComplete, onDeleteItem, onClose}) {
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

  return (
        <div className="popup-overlay">
          <div className="popup">
            <div className='shopping-list-header'>
            <button className="close-btn" onClick={onClose}>×</button>
            <button className='download-btn' onClick={() => generatePDF(targetRef, options)}></button>
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
                ).map((ingredient) => (
                <div key={ingredient.item_name}>
                  <li   className={`shopping-list-ingredient ${ingredient.completed ? "completed" : ""}`}>
                        {/* toggle completion */}
                        <input 
                            type="checkbox" 
                            checked={ingredient.completed} 
                            onChange={() => onToggleComplete(ingredient.item_name)}
                        />
                        {/* show name*/}
                        <span>{ingredient.item_name}</span>
                        {/* delete button */}
                        <button 
                            onClick={() => onDeleteItem(ingredient.item_name)}
                            className="delete-btn"
                        >
                            ·
                        </button>
                      </li> 
                      {ingredients.filter((item) => item.item_name === ingredient.item_name).map((item) =>(
                                  <li key={item.groceryID} className={`shopping-item ${ingredient.completed ? "completed" : "" }`}>
                                    <h4>{item.day}</h4>
                                    {/* show recipe */}
                                    <div ><span>{item.meal_name}</span></div>                                    
                                    {/* show amount */}
                                    <div >{item.quantity}</div>                                 
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


    // <ul className="shopping-list">
    //             {ingredients.sort(function (a, b) {
    //                 if (a.item_name <= b.item_name) {
    //                     return -1
    //                 } else {
    //                     return 1
    //                 }}
    //             ).map((item, index, array) => (
    //                 <li key={item.groceryID} 
    //                 className={`shopping-item 
    //                 ${index > 0 && (item.item_name === array[index-1].item_name) ? "duplicate " : ""}
    //                 ${item.completed ? "completed" : ""}`}>
    //                     {index > 0 && (item.item_name === array[index-1].item_name) 
    //                     ? 
    //                     <>
    //                     <div></div>
    //                     {/* show name*/}
    //                     <div></div>
    //                     {/* show recipe */}
    //                     <span>{item.meal_name}</span>
    //                     {/* show amount */}
    //                     <span>{item.quantity}</span>
    //                     {/* delete button */}
    //                     <div></div>

    //                     </>
    //                     :
                        // <>
                        // {/* toggle completion */}
                        // <input 
                        //     type="checkbox" 
                        //     checked={item.completed} 
                        //     onChange={() => onToggleComplete(item.groceryID)}
                        // />
                        // {/* show name*/}
                        // <span>{item.item_name}</span>
                        // {/* show recipe */}
                        // <span>{item.meal_name}</span>
                        // {/* show amount */}
                        // <span>{item.quantity}</span>
                        // {/* delete button */}
                        // <button 
                        //     onClick={() => onDeleteItem(item.groceryID)}
                        //     className="delete-btn"
                        // >
                        //     ·
                        // </button>
                        // </>
    //                     }
    //                 </li>
    //             ))}
    //         </ul>