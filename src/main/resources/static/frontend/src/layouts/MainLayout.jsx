import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollRestoration from '../components/ScrollRestoration';

const MainLayout = () => {
  return (
    <div>
        <ScrollRestoration />
        <Header />
        <Navbar />
        <Outlet />
        <Footer />
    </div>
  )
}

export default MainLayout;