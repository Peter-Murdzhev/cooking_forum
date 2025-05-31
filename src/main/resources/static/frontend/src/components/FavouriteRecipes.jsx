import React, { useEffect, useState } from 'react'
import { useAuth } from './Auth';
import axios from 'axios';
import Recipe from './Recipe';

const FavouriteRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const auth = useAuth();
    
    useEffect(() =>{
        axios.get(`/api/v1/user/${auth.user.id}/get/favouritedishes`,
            {withCredentials: true}
        ).then(response => setRecipes(response.data)
        ).catch(error => console.log(error));
    },[])

  return (
    <div className="recipes_render">
        {recipes.length > 0 ? recipes.map((recipe) =>(<Recipe key={recipe.id} recipe={recipe}/>))
          : <h3>You don't have favourite recipes yet!</h3>}
    </div>
  )
}

export default FavouriteRecipes;