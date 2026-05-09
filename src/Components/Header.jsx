import React from 'react';
import { NavLink } from 'react-router-dom';
// Import the shared styles
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass
} from '../styles/common.js';
import { useAuth } from '../store/globalStore.js';



function Header() {
  let { isAuthenticated, currentUser,logout } = useAuth();
  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        {/* Brand/Logo Section */}
        <div className={navBrandClass}>
          <img
            className='rounded-full'
            width="65px"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO0QBMhdvy8Fsl40OmNhbNwJLxS-TiLHKETA&s"
            alt="Logo"
          />
        </div>

        {/* Navigation Links */}
        <ul className={navLinksClass}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
            >
              Home
            </NavLink>
          </li>
          {!isAuthenticated && (
            <><li>
              <NavLink
                to="/login"
                className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
              >
                Login
              </NavLink>
            </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
                >
                  Register
                </NavLink>
              </li></>
          )}
          {isAuthenticated && (<>
          
          <li>
              <NavLink to="/" className={navLinkClass}>
                <img
                  src={currentUser.profileImageUrl || ""}
                  alt="Profile"
                  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                />
              </NavLink>
            </li>
            <li>
              <button onClick={logout}>logout</button>
            </li></>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
