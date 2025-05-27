import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
		<ul id="foot_list">
			<li><Link to="/aboutme">About me</Link></li>
			<li><Link to="/terms_of_use">Terms of use</Link></li>
		</ul>
	</footer>
  )
}

export default Footer