import {React} from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './Auth';
import axios from 'axios';


const Navbar = () => {
	const auth = useAuth();
	const navigate = useNavigate();
	
	const handleLogout = async() =>{
		await axios.post("/api/v1/auth/logout",{},
			{withCredentials:true})
		
		auth.logout()
		navigate("/",{replace:true})
	}

  return (
    <nav>
		<div className="navbar">
			<ul>
			<li><Link to="/"> Home</Link></li>
			<li><Link to="/account"> Account</Link></li>
			<li><Link to="/recipes_page"> Recipes </Link></li>
			{!auth.user ? (<li><Link to="/login"> Login </Link></li>) :
			              (<li><Link to="/" onClick={handleLogout}>Logout</Link></li>)}
			</ul>
		</div>
	</nav>
  )
}

export default Navbar;