import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Recipe = ({ recipe }) => {
	const [imagePath, setImagePath] = useState("/images/recipes_pics/default_image.jpg")
	const [description, setDescription] = useState("");

	useEffect(() =>{
		if(recipe.imageSource){
			setImagePath(recipe.imageSource);
		}

		console.log(recipe.imageSource)
	},[recipe.imageSource])

	useEffect(() =>{
		const renderDescription = () =>{
		if(recipe.description.length > 60){
			setDescription(`${recipe.description.substring(0, 60)}...`);
		}else{
			setDescription(recipe.description);
		}
	}

	renderDescription();
	},[recipe.description])
	
	
  return (
	<li className='recipe'>
		<Link to={`/recipe/${recipe.id}`} >
			<ul>
				<li><img className="image" src = {`${imagePath}`} /></li>
				<li style={{textAlign:"center", fontSize: "20px"}}><strong>
					 {recipe.name}</strong></li>
				<li style={{maxWidth:"200px", maxHeight:"200px", overflow:"hidden"}}>Description:<br />
			 		{description} </li>
				<li style={{fontSize:"12px", textAlign: "right"}}>
			 		{recipe.publishedDateTime} </li>
			</ul>
		</Link>
	</li>	


  )
}

export default Recipe;