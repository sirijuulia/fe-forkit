import React from 'react'
import { useState, useEffect, useRef } from 'react'
import "./RecipeBook.css";
import generatePDF, { Resolution, Margin } from 'react-to-pdf';


export default function RecipeBook({recipeID, onClose, recipeList}) {
      const targetRef = useRef();
      const options = {
        method: 'open',
        page: {
          margin: Margin.SMALL
        },
        filename: 'recipe.pdf'
      }

    useEffect(() => {
            if (!recipeID) return;
            fetchMeal(recipeID);
            fetchIngredients(recipeID);
            fetchInstructions(recipeID);
          }, []);

    const [meal, setMeal] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([])
    const fetchMeal = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/meals/${id}`, {
                headers: {"authorization": `Bearer ${localStorage.getItem("token")}`}
            })
            const data = await response.json();
            setMeal(data[0]);
        } catch (err) {
            console.error("Error fetching meal data", err)
        }
    }

    const fetchIngredients = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/grocery-list/${id}`, {
                headers: {"authorization": `Bearer ${localStorage.getItem("token")}`}
            })
            const data = await response.json();
            setIngredients(data)

        } catch (err) {
            console.error("Error fetching ingredients", err)
        }
    }

    const fetchInstructions = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/instructions/${id}`, {
                headers: {"authorization": `Bearer ${localStorage.getItem("token")}`}
            })
            const data = await response.json();
            console.log(data)
            setInstructions(data)

        } catch (err) {
            console.error("Error fetching instructions", err)
        }
    }

    const nextRecipe = () => {
      console.log("Recipe ID", recipeID)
      console.log(recipeList)
      const currentIndex = recipeList.findIndex((recipe) => {return recipe.mealID === recipeID}); 
      const newID = recipeList[currentIndex+1].mealID;
      console.log("current index", currentIndex);
      console.log("new entry", recipeList[currentIndex+1]);
      console.log("new entry ID", newID)
      return newID;

    }

    const writeToClipboard = async () => {
        const ingredientList = ingredients.map((ingredient) =>  `- ${ingredient.quantity} ${ingredient.item_name}\n`)
        const ingredientString = ingredientList.join("")
        const instructionList = instructions.map((instruction) => `${instruction.step}: ${instruction.instruction_text}\n`)
        const instructionString = instructionList.join("")

        try {
          await navigator.clipboard.writeText(`Ingredients:\n ${ingredientString}\n\n Instructions:\n${instructionString}`);
        } catch (error) {
          console.error(error.message)
        }
      }

  return (
        <div className="popup-overlay">
          <div className="popup">
          <div className='recipe-book-header'>
            <button className='list-btn download-btn' title="download" onClick={() => generatePDF(targetRef, options)}></button>
            <button className='list-btn clipboard-btn' title="copy to clipboard" onClick={writeToClipboard}></button>
            <button onClick={nextRecipe}>Next recipe</button>
            <button className="close-btn" title="close" onClick={onClose}>×</button>
            </div>
            <div className='recipe' ref={targetRef}>
                <div className='img-container'>
            <img className='recipe-cover-img' src={meal?.meal_img_url} alt={`photo of ${meal?.meal_name}`}  />
            </div>
          <div className='recipe-title-section'>
          <h2 className='recipe-title'>{meal?.meal_name}</h2>
          <h3 className='recipe-subtitle'>{meal?.day} {meal?.meal_type}</h3>
          </div>
            <div className='recipe-details'>
            <div className='ingredients-div'>
            <h3>Ingredients</h3>
            <ul>
                {ingredients?.map((item) => (
                    <li key={item.groceryID} >
                        <span>{item.quantity} {item.item_name}</span>
                    </li>))} 
            </ul>
            </div>
            
            <div className='instructions-div'>
            <h3>Instructions</h3>
            <ol>
            {instructions?.map((item) => (
                    <li key={item.instructionID} >
                        <span>{item.instruction_text}</span>
                    </li>))} 
            </ol>
            </div>
            </div>
            </div>
          </div>
    </div> 
  )
}
