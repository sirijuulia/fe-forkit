import React, { useState, useContext } from "react";
import "./RecipeSearch.css";
import AuthContext from "../context/AuthContext";

const RecipeSearch = ({ onClose, onSelectRecipe }) => {
    const [query, setQuery] = useState(""); // Search input
    const [recipes, setRecipes] = useState([]); // Store API results
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const auth = useContext(AuthContext);

    // Fetch recipes from TheMealDB via our backend
    const fetchRecipes = async () => {
        if (!query.trim()) return; // Prevents empty searches

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3001/api/recipes?query=${query}`);
            if (!response.ok) throw new Error("Failed to fetch recipes");

            const data = await response.json();
            setRecipes(data || []);

        } catch (err) {
            setError("Error fetching recipes");
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Search Recipes</h2>

                <div className="search-container">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter a dish name..."
                        className="search-input"
                    />
                    <button onClick={fetchRecipes} className="search-btn" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                {error && <p className="error">{error}</p>}

                <div className="recipe-list">
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="recipe-card"
                                onClick={() => onSelectRecipe(recipe)}
                            >
                                <h3>{recipe.title}</h3>
                                <img 
                                    src={recipe.image || "https://via.placeholder.com/150"} 
                                    alt={recipe.title} 
                                    className="recipe-image"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="placeholder-text">Eat like if it was your last day 🍽️</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeSearch;
