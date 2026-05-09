import React, { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import { useAuth } from '../store/globalStore'


function RootLayout() {

  return (
    <div>
        <Header />
        <div className='min-h-screen'>
            <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default RootLayout