import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/Auth';
import { MdFavorite } from 'react-icons/md';
import Comments from '../components/Comments';

const RecipeFullVersionPage = () => {
  const { id } = useParams();
  const auth = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [user, setUser] = useState(null);
  const [imagePath, setImagePath] = useState("/images/recipes_pics/default_image.jpg")
  const [isFavourite, setIsFavourite] = useState(false);
 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const result = await axios.get(`/api/v1/dish/find/id/${id}`);
        setRecipe(result.data);

        if (result.data && result.data?.ownerOfDishId) {
          fetchUser(result.data.ownerOfDishId);
        } else {
          console.log("Recipe is not set")
        }

        if (result.data?.imageSource) {
          setImagePath(result.data.imageSource);
        }
      } catch (error) {
        console.log("Error fetching recipe", error);
      }
    }

    const fetchUser = async (id) => {
      try {
        const result2 = await axios.get
          (`/api/v1/user/findbyid/${id}`)
        setUser(result2.data);
      } catch (error) {
        console.log("Error fetching user");
      }
    }

    fetchRecipe();
  }, [id])

  useEffect(() => {
    const checkFavourite = async () => {
      try {
        if (recipe && auth.user) {
          const result = await
            axios.get(`/api/v1/user/${auth.user.id}/dish/isfavourite/${recipe.id}`, {
              withCredentials: true
            });
          //this could be one line setIsFavourite(result.data)
          //but the code below looks a bit more readable
          if (result.data === true) {
            setIsFavourite(true);
          } else {
            setIsFavourite(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    checkFavourite();
  }, [user, recipe?.id])

  if (!recipe) {
    return <h2 style={{ textAlign: "center" }}>Loading recipe...</h2>;
  }

  const showActionButtons = () => {
    if (auth.user) {
      return auth.user.role === "ADMIN" || auth.user.id === recipe.ownerOfDishId;
    }
  }

  const editFavouriteStatus = async () => {
    if (auth.user) {
      try {
        if (isFavourite) {
          const result = await
            axios.delete
              (`/api/v1/user/${auth.user.id}/delete/favouriteDish/${recipe.id}`, {
                withCredentials: true
              });

          setIsFavourite(false);
        } else {
          const result = await
            axios.post(`/api/v1/user/${auth.user.id}/add/favouritedish/${recipe.id}`, {},
              { withCredentials: true })

          setIsFavourite(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login", { state: { path: location.pathname } });
    }
  }

  const deleteRecipe = async () => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete this recipe?");
      if (isConfirmed) {
        await axios.delete(`/api/v1/dish/delete/${recipe.id}`,
          { withCredentials: true });
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="recipe_full_version">
      <ul>
        <li id="favourites_icon"><MdFavorite color={isFavourite ? "red" : "white"}
          onClick={editFavouriteStatus} /></li>
        <li><img src={`${imagePath}`} /></li>
        <li style={{ textAlign: "center", fontSize: "30px", marginTop: "20px" }}><strong>
          {recipe.name}</strong></li>
        <li style={{ alignContent: "center", fontSize: "20px", paddingTop: "30px" }}>Description:<br />
          {recipe.description} </li>
        <li style={{ fontSize: "20px", marginTop: "20px" }}>Ingredients:<br />
          <ul style={{ border: "none", padding: "0px" }}>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} style={{ listStyleType: "decimal", marginLeft: "20px" }}>{ingredient}</li>
            ))}
          </ul>
        </li>
        <br />
        <li style={{ fontSize: "20px" }}>How to prepare:<br />{recipe.howToPrepare}</li>

        <li className="username" style={{ paddingTop: "15px" }}>
          {user ? <Link to={`/user_info/${user.id}`}>Published by: {user.username}</Link> :
            "Published by: Unknown"}
        </li>
        <li className="time_stamp" style={{ paddingTop: "40px" }}>
          {recipe.publishedDateTime} </li>
      </ul>

      {showActionButtons() &&
        <div className="action_buttons">
          <button onClick={() => navigate(`/edit_recipe/${recipe.id}`)}>Edit recipe</button>
          <button onClick={deleteRecipe}>Delete recipe</button>
        </div>
      }

      <Comments recipe={recipe} setRecipe={setRecipe}/>
    </div>
  )
}

export default RecipeFullVersionPage;