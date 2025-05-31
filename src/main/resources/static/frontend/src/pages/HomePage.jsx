import axios from 'axios'
import React from 'react'
import { useState, useEffect } from "react";
import Recipe from '../components/Recipe'


const HomePage = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/dish/find/all")
      .then((response) => {
        setRecipes(response.data.slice(-3));
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, []);

  return (
    <div>
        <h3 id="latest_recipes">Latest Recipes</h3>

        <ul id="recipes_list">
         {recipes.map((recipe) =>(
           <Recipe key={recipe.id} recipe={recipe}/>
         ))}
        </ul>
    </div>
   
  )
}

export default HomePage;