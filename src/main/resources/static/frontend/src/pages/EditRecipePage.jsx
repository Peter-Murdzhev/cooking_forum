import React, { useState, useEffect } from 'react'
import RecipeForm from '../components/RecipeForm'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../components/Auth';
import axios from 'axios';

const EditRecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [image, setImage] = useState(null)
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/v1/dish/find/id/${id}`, { withCredentials: true })
      .then(response => setRecipe(response.data))
      .catch(() => navigate("/recipes_page"));
  }, [id])

  useEffect(() => {
    let imageName;
    if (recipe?.imageSource) {
      imageName = recipe.imageSource.substring(recipe.imageSource.lastIndexOf("/") + 1);

      axios.get(`/api/v1/image/download/${imageName}`, {
        responseType: "blob",
        withCredentials: true
      })

        .then(response => {
          setImage(response.data);
        })
        .catch(error => console.log(error));
    }
  }, [recipe])


  if (!recipe) {
    return <h2 style={{ textAlign: "center" }}>Loading recipe...</h2>
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;

    if (recipe?.imageSource) {
      const currentImageName = recipe.imageSource.
        substring(recipe.imageSource.lastIndexOf("/") + 1);

      if (image?.name && currentImageName !== image.name) {
        const formData = new FormData();
        formData.append("image", image);

        try {
          response = await axios.post(`/api/v1/image/replace/${currentImageName}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true
            }
          )
        } catch (error) {
          console.log(error);
        }

      }
    } else {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        try {
          response = await axios.post("/api/v1/image/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
          })
        } catch (error) {
          console.log(error)
        }
      }
    }

    let imagePath = recipe.imageSource;
    if (response?.data) {
      imagePath = response.data;
    }

    const payload = {
      ...recipe,
      imageSource: imagePath
    }

    try {
      const result = await axios.put(`/api/v1/dish/alter/${recipe.id}`, payload, {
        withCredentials: true
      })

      if (result.data?.id) {
        navigate(`/recipe/${result.data.id}`);
      }
    } catch (error) {
      if (error?.response) {
        setErrors(error.response.data);
      }
    }
  }

  return (
    <RecipeForm image={image} setImage={setImage} recipeData={recipe} setRecipeData={setRecipe}
      onSubmit={handleSubmit} mode="edit" errors={errors} />
  )
}

export default EditRecipePage;