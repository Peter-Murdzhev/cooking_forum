import { useState, useRef, useEffect } from 'react'
import { FiX } from "react-icons/fi";

const RecipeForm = ({ image, setImage, recipeData, setRecipeData, onSubmit, mode, errors }) => {
    const [newIngredient, setNewIngredient] = useState("");
    const inputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            setImage(file);
        }
    }

    const handleIngredientInput = (e) => {
        setNewIngredient(e.target.value);
    }

    const handleAddIngredient = (e) => {
        if (newIngredient.trim() !== "") {
            setRecipeData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, newIngredient.trim()]
            }))
        }

        setNewIngredient("");
        //returns the cursor to the field immediately after submitting ingredient
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    const handleRemoveIngredient = (index) => {
        setRecipeData(prevData => ({
            ...prevData,
            ingredients: prevData.ingredients.filter((_, i) => i !== index),
        }))
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setRecipeData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    return (
        <div className="recipe_form">
            <h2>{mode === "edit" ? "Edit Recipe" : "Add recipe"}</h2>

            <form onSubmit={onSubmit}>
                <label className="image_upload">Upload image
                    <input name="image" type="file" accept="/image/*"
                        onChange={handleImageChange}></input>
                </label>
                <br /><br />

                {
                    (image || recipeData?.imageSource) && (
                        <img
                            src={image ? URL.createObjectURL(image) : recipeData?.imageSource}
                            alt="Preview"
                            style={{ maxWidth: '250px', maxHeight: "200px", marginTop: '5px' }}
                        />
                    )
                }

                <br /><br />

                <input name="name" type="text" value={recipeData.name}
                    onChange={handleInputChange} placeholder="Recipe name"></input>
                <br />
                {errors.name ? <>{errors.name}<br /><br /></> : <br />}
                <textarea name="description" value={recipeData.description}
                    onChange={handleInputChange} placeholder="Description"></textarea>
                <br />
                {errors.description ? <>{errors.description}<br /><br /></> : <br />}
                <label>Ingredients:</label>
                <ol>
                    {recipeData.ingredients.map((ingredient, index) =>
                        <li key={index}>{ingredient}
                            <FiX
                                onClick={() => handleRemoveIngredient(index)}
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                            />
                        </li>)}
                </ol>
                <br />
                <input value={newIngredient} onChange={handleIngredientInput} ref={inputRef}
                    placeholder="Add ingredient"></input>
                <input type="button" value="Add" onClick={handleAddIngredient}
                    style={{ width: "100px", height: "32px", marginLeft: "5px" }}></input>
                <br />
                {errors.ingredients ? <>{errors.ingredients}<br /><br /></> : <br />}
                <textarea name="howToPrepare" value={recipeData.howToPrepare}
                    onChange={handleInputChange} placeholder="How to prepare" ></textarea>
                <br />
                {errors.howToPrepare ? <>{errors.howToPrepare}<br /><br /></> : <br />}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default RecipeForm;