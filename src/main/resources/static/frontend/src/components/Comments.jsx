import { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from './Auth';
import { FiX } from "react-icons/fi";


const Comments = ({ recipe, setRecipe }) => {
    const auth = useAuth();
    const [newCommentMessage, setNewCommentMessage] = useState("");
    const [userExistsMap, setUserExistsMap] = useState({});

    const addComment = async (e) => {
        e.preventDefault()

        axios.put(`/api/v1/dish/add/comment/${recipe.id}`,
            newCommentMessage, {
            headers: {
                "Content-Type": "text/plain"
            },
            withCredentials: true
        }).then(response => {
            setRecipe(response.data);
            setNewCommentMessage("");
        }
        ).catch(error => console.log(error));
    }

    const deleteComment = async (index) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this comment?")

        if(isConfirmed){
            axios.delete(`/api/v1/dish/${recipe.id}/remove/comment/${index}`,
            {withCredentials: true})
            .then(response => {
                setRecipe(response.data);
            }
            ).catch(error => console.log(error));
        }  
    }

    useEffect(() => {
        const userIds = recipe.dishComments.map(comment => comment.userId);

        axios.post("/api/v1/user/many/existsbyid",
            userIds, { withCredentials: true }
        ).then(response => {
            setUserExistsMap(response.data);
        }
        ).catch(error => console.log(error));
    }, [recipe.dishComments])

    const renderCommentUsername = (comment) => {
        if (userExistsMap[comment.userId]) {
            return <Link to={`/user_info/${comment.userId}`}>{comment.username}</Link>;
        } else {
            return <p>{comment.username} (deleted)</p>;
        }
    }

    const renderDeleteIcon = (comment) => {
        if (auth.user) {
            return auth.user.role === "ADMIN" || auth.user.id === comment.userId;
        }
    }

    return (
        <div>
            <h3 style={{ marginLeft: "20px" }}>Comments:</h3>
            <ul style={{ borderWidth: "0px" }}>
                {recipe.dishComments.length == 0 ? <p>No Comments yet</p> :
                    recipe.dishComments.map((comment, index) => (
                        <li key={index} className="comment">
                            <ul style={{ borderRadius: "15%" }}>
                                <li>{renderDeleteIcon(comment) && <FiX style={{ float: "right", cursor:"pointer" }}
                                    onClick={() => deleteComment(index)} />}
                                </li>
                                <li className="username" style={{ paddingBottom: "10px" }}>
                                    {renderCommentUsername(comment)}
                                </li>
                                <li style={{ paddingBottom: "5px" }}>{comment.message}</li>
                                <li className="time_stamp">{comment.postDateTime}</li>
                            </ul>
                        </li>
                    ))}
            </ul>

            {auth.user &&
                <div id="comment_form">
                    <textarea value={newCommentMessage}
                        onChange={(e) => setNewCommentMessage(e.target.value)}
                        placeholder="Write comment"></textarea>
                    <button onClick={addComment}>Add comment</button>
                </div>
            }
        </div>
    )
}

export default Comments;