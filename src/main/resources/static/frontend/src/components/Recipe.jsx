import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Recipe = ({ recipe }) => {
	const [imagePath, setImagePath] = useState("/images/recipes_pics/default_image.jpg")

	useEffect(() =>{
		if(recipe.imageSource){
			setImagePath(recipe.imageSource);
		}
	},[recipe.imageSource])
	
  return (
	
	<li className='recipe'>
		<Link to={`/recipe/${recipe.id}`} >
			<ul>
				<li><img className="image" src = {`${imagePath}`} /></li>
				<li style={{textAlign:"center", fontSize: "20px"}}><strong>
					 {recipe.name}</strong></li>
				<li style={{maxWidth:"200px", maxHeight:"200px", overflow:"hidden"}}>Description:<br />
			 		{recipe.description} </li>
				<li style={{fontSize:"12px", textAlign: "right"}}>
			 		{recipe.publishedDateTime} </li>
			</ul>
		</Link>
	</li>	


  )
}

export default Recipe;