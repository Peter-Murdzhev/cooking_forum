import axios from 'axios';
import { React, useState, useEffect } from 'react'
import Recipe from '../components/Recipe';
import { useAuth } from '../components/Auth';
import { useNavigate } from 'react-router-dom';

const UploadedRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState();
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/api/v1/dish/find/userid/${auth.user.id}`)
            .then(response => {
                setRecipes(response.data);
            }
            ).catch(error => {
                if (error.response) {
                    setError(error.response.data);
                }
            });
    }, [auth])

    return (
        <>
            <button className="call_to_action" onClick={() => navigate("/upload_recipe")}
                style={{ marginTop: "20px" }}>
                <strong>Upload new recipe</strong></button>
            <br /><br /><br />

            <ul className="recipes_render">
                {recipes.length > 0 ?
                    recipes.map(currentRecipe => (<Recipe key={currentRecipe.id} recipe={currentRecipe} />)) :
                    <h3>You haven't posted any recipes yet!</h3>}
            </ul>
        </>
    )
}

export default UploadedRecipes;