import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Recipe from '../components/Recipe'

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/v1/user/findbyid/${id}`)
      .then(response => {
        setUser(response.data);
      }).catch(error => {
        console.log("Error fetching user", error);
      })
  }, [id])

  if (!user) {
    return <h3 style={{ textAlign: "center" }}>Loading user...</h3>
  }

  if (user.publishedDishes.length === 0) {
    return <h2 style={{ textAlign: "center" }}>{user.username} haven't posted any recipes yet.</h2>
  }

  return (
    <div>
      <ul className="user_info">
        <li style={{ fontSize: "30px", textAlign: "center" }}>{user.username}'s posted recipes:</li>
        <li>
          <ul className="recipes_render">
            {user.publishedDishes.map(recipe => (
              <Recipe key={recipe.id} recipe={recipe} />
            ))}
          </ul>
        </li>
      </ul>
    </div>
  )

}

export default UserPage;