import { useState,useEffect } from 'react'
import { useAuth } from '../components/Auth'
import UploadedRecipes from '../components/UploadedRecipes'
import FavouriteRecipes from '../components/FavouriteRecipes';
import ChangeUserInfoForm from '../components/ChangeUserInfoForm'

const AccountPage = () => {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState("uploaded");

  const changeActiveTab = (tab) =>{
    setActiveTab(tab);
    sessionStorage.setItem("activeTab", tab);
  }

  useEffect(()=>{
    const savedTab = sessionStorage.getItem("activeTab");
    if(savedTab){
      setActiveTab(savedTab);
    } 
  },[])

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Welcome, {auth.user.username}</h2>

      <nav className='account_navbar'>
        <ul>
          <li onClick={() => changeActiveTab("uploaded")}
            className={activeTab === 'uploaded' ? 'active' : ''}>Uploaded recipes</li>
          <li onClick={() => changeActiveTab("favourites")}
            className={activeTab === 'favourites' ? 'active' : ''}>Favourite recipes</li>
          <li onClick={() => changeActiveTab("userInfo")}
            className={activeTab === 'userInfo' ? 'active' : ''}>Change user information</li>
        </ul>
      </nav>

      <div className="account_content">
        <div style={{ display: activeTab === 'uploaded' ? 'block' : 'none' }}>
          <UploadedRecipes />
        </div>
        <div style={{ display: activeTab === 'favourites' ? 'block' : 'none' }}>
          <FavouriteRecipes />
        </div>
        <div style={{ display: activeTab === 'userInfo' ? 'block' : 'none' }}>
          <ChangeUserInfoForm />
        </div>
      </div>
    </>
  )
}

export default AccountPage;