import { useState, useEffect } from 'react'
import axios from 'axios'
import Recipe from '../components/Recipe'
import { useNavigate } from 'react-router-dom';

const RecipesPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  //prevents realtime change in no recipes message
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const navigate = useNavigate();

  const storedPage = parseInt(sessionStorage.getItem("currentPage")) || 1;
  const [currentPage, setCurrentPage] = useState(storedPage);
  const recipesPerPage = 18;

  useEffect(() => {
    sessionStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    const pageQuery = parseInt(params.get("page")) || 1;
    setCurrentPage(pageQuery);

    if (recipes.length > 0 && searchQuery) {
      setInputValue(searchQuery);
      const filtered = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
      setIsSearchTriggered(true);
    }
  }, [location.search, recipes]);

  const filterRecipesByName = () => {
    const matchedRecipes = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(inputValue)
    );

    setFilteredRecipes(matchedRecipes);
    setIsSearchTriggered(true);

    const params = new URLSearchParams();
    params.set("search", inputValue);
    params.set("page", currentPage);
    navigate(`?${params.toString()}`);
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      filterRecipesByName();
    }
  };

  const getPaginatedRecipes = (recipesArray) => {
    const startIndex = (currentPage - 1) * recipesPerPage;
    return recipesArray.slice(startIndex, startIndex + recipesPerPage);
  };

  const isUsingFiltered = isSearchTriggered && filteredRecipes.length > 0;
  const totalRecipes = isUsingFiltered ? filteredRecipes : (isSearchTriggered ? [] : recipes);
  const totalPages = Math.ceil(totalRecipes.length / recipesPerPage);

  const renderRecipes = () => {
    if (filteredRecipes.length > 0) {
      return getPaginatedRecipes(filteredRecipes).map((recipe) =>
        (<Recipe key={recipe.id} recipe={recipe} />));
    } else if (isSearchTriggered) {
      return <p style={{ fontSize: "18px"}}>No recipes found</p>
    } else {
      return getPaginatedRecipes(recipes).map((recipe) =>
        (<Recipe key={recipe.id} recipe={recipe} />))
    }
  }


  return (
    <div>
      <form className="search_recipes_bar" action="/search" method="GET">
        <label>Search recipes:</label>
        <input type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown}
          placeholder="Enter name"></input>
        <button id="main_search_button" type="button" onClick={() => {
          filterRecipesByName();
          setCurrentPage(1);
        }}>Search</button>
      </form>
      <br /> <br />

      <button className="call_to_action" onClick={() => navigate("/upload_recipe")}>
        <strong>Upload new recipe</strong></button>
      <br /><br />

      <ul className="recipes_render">
        {renderRecipes()}
      </ul>

      {totalPages > 1 && totalRecipes.length > 0 && (
        <div className="pagination-controls">
          <button
            onClick={() => { setCurrentPage(currentPage - 1); window.scrollTo(0, 50) }}
            disabled={currentPage === 1}
            style={{ margin: "0 5px" }}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter(page =>
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .reduce((acc, page, idx, arr) => {
              if (idx > 0 && page - arr[idx - 1] > 1) {
                acc.push("ellipsis");
              }
              acc.push(page);
              return acc;
            }, [])
            .map((item, index) => {
              if (item === "ellipsis") {
                return (
                  <span key={`ellipsis-${index}`} style={{ margin: "0 5px" }}>
                    ...
                  </span>
                );
              } else {
                return (
                  <button
                    key={item}
                    onClick={() => { setCurrentPage(item); window.scrollTo(0, 50) }}
                    style={{
                      margin: "0 5px",
                      padding: "5px 10px",
                      backgroundColor: currentPage === item ? "darkcyan" : "whitesmoke",
                      color: currentPage === item ? "#fff" : "#000",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </button>
                );
              }
            })}

          <button
            onClick={() => { setCurrentPage(currentPage + 1); window.scrollTo(0, 50) }}
            disabled={currentPage === totalPages}
            style={{ margin: "0 5px" }}
          >
            Next
          </button>
        </div>
      )}

    </div>
  )
}

export default RecipesPage;