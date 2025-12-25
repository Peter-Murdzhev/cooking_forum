import { useState, useEffect } from 'react'
import RecipeForm from '../components/RecipeForm'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

const EditRecipePage = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null)
  const [recipe, setRecipe] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/v1/dish/find/id/${id}`, { withCredentials: true })
      .then(response => setRecipe(response.data))
      .catch(() => navigate("/recipes_page"));
  }, [id])

  if (!recipe) {
    return <h2 style={{ textAlign: "center" }}>Loading recipe...</h2>
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;

    if (recipe?.imageSource) {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("oldImageId", recipe.imagePublicId);

        try {
          response = await axios.post("/api/v1/image/replace",
            formData,
            {
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
    let imageId = recipe.imagePublicId;

    if (response?.data) {
      imagePath = response.data.imagePath;
      imageId = response.data.imagePublicId;
    }

    const payload = {
      ...recipe,
      imageSource: imagePath,
      imagePublicId: imageId,
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