import { React, useState, useEffect } from 'react'
import axios from 'axios'
import Recipe from '../components/Recipe'
import { useNavigate } from 'react-router-dom';
import ScrollRestoration from '../components/ScrollRestoration';

const RecipesPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  //prevents realtime change in no recipes message
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = event => {
    setInputValue(event.target.value.toLowerCase());
  }

  useEffect(() => {
    axios.get("/api/v1/dish/find/all")
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.log("Error fetching recipes:", error);
      });
  }, []);

  const filterRecipesByName = () => {
    const matchedRecipes = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(inputValue)
    );

    setFilteredRecipes(matchedRecipes);
    setIsSearchTriggered(true)
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      filterRecipesByName();
    }
  };

  const renderRecipes = () => {
    if (filteredRecipes.length > 0) {
      return filteredRecipes.map((recipe) => (<Recipe key={recipe.id} recipe={recipe} />));
    } else if (isSearchTriggered) {
      return <p style={{ position: "absolute", left: "45%", top: "70%" }}>No recipes found</p>
    } else {
      return recipes.map((recipe) => (<Recipe key={recipe.id} recipe={recipe} />))
    }
  }

  return (
    <div>
      <form className="search_recipes_bar" action="/search" method="GET">
        <label>Search recipes:</label>
        <input type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown}
          placeholder="Enter name"></input>
        <button id="main_search_button" type="button" onClick={filterRecipesByName}>Search</button>
      </form>
      <br /> <br />

      <button className="call_to_action" onClick={() => navigate("/upload_recipe")}>
        <strong>Upload new recipe</strong></button>
      <br /><br />

      <ul className="recipes_render">
        {renderRecipes()}
      </ul>

    </div>
  )
}

export default RecipesPage;