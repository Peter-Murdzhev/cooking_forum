import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  matchPath
} from 'react-router-dom'
import React from 'react'
import AuthProvider from './components/Auth'
import HomePage from './pages/HomePage'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import RecipesPage from './pages/RecipesPage'
import AddRecipePage from './pages/AddRecipePage'
import EditRecipePage from './pages/EditRecipePage';
import RecipeFullVersionPage from './pages/RecipeFullVersionPage'
import UserPage from './pages/UserPage'
import NotFoundPage from './pages/NotFoundPage'
import RequireAuth from './components/RequireAuth'
import UploadedRecipes from './components/UploadedRecipes'
import AboutMe from './components/AboutMe'
import TermsOfUse from './components/TermsOfUse'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/account" element={<RequireAuth><AccountPage /></RequireAuth>} />
      <Route path="/recipes_page" element={<RecipesPage />} />
      <Route path="/upload_recipe" element={<RequireAuth><AddRecipePage /></RequireAuth>} />
      <Route path="/edit_recipe/:id" element={<RequireAuth><EditRecipePage /></RequireAuth>} />
      <Route path="/uploaded_recipes" element={<UploadedRecipes />} />
      <Route path="/recipe/:id" element={<RecipeFullVersionPage />} />
      <Route path="/user_info/:id" element={<UserPage />} />
      <Route path='/aboutme' element={<AboutMe />}/>
      <Route path='/terms_of_use' element={<TermsOfUse />}/>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);


const App = () => {
  return <AuthProvider>
             <RouterProvider router={router} />
         </AuthProvider>
}

export default App;