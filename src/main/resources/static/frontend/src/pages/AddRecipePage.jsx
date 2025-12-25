import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import axios from 'axios';

const AddRecipePage = () => {
  const [image, setImage] = useState(null);
  const [recipeData, setRecipeData] = useState({
    name: "",
    description: "",
    ingredients: [],
    howToPrepare: "",
    imageSource: "",
    imagePublicId: ""
  })
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const result = await axios.post("/api/v1/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      })

      return result.data;
    } catch (error) {
      console.log("error uploading file")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imagePath = recipeData.imageSource;
    let imageId = recipeData.imagePublicId;

    if (image) {
      try {
        const response = await uploadImage();

        imagePath = response.imagePath;
        imageId = response.imagePublicId;
      } catch (error) {
        console.log("Error uploading image");
      }
    }

    //Don't set the state directly when assigning imagePath
    //it doesn't receive it on time and it's not included in the RequestBody
    //of the api call. Instead use the payload below.
    const payload = {
      ...recipeData,
      imageSource: imagePath,
      imagePublicId: imageId,
    };

    try {
      const result = await axios.post("/api/v1/dish/add", payload, {
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
    <RecipeForm image={image} setImage={setImage} recipeData={recipeData} setRecipeData={setRecipeData}
      onSubmit={handleSubmit} mode="add" errors={errors} />
  )
}

export default AddRecipePage;