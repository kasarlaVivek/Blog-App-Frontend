import { useNavigate, NavLink, Outlet } from "react-router-dom"; 
import { pageWrapper, navLinkClass, navLinkActiveClass, divider } from "../styles/common";
import toast from "react-hot-toast";
import axios from "axios"; 
import { useAuth } from "../store/globalStore";

function AuthorDashboard() {
  const navigate = useNavigate(); 
  let {logout} = useAuth();


  return (
    <div className={pageWrapper}>
      <div className="flex gap-6 mb-6">
        <NavLink 
          to="articles" 
          className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
        >
          Articles
        </NavLink>
        
        <NavLink 
          to="write-article" 
          className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
        >
          Write Article
        </NavLink>
      </div>

      <div className={divider}></div>
      <Outlet />
    </div>
  );
}

export default AuthorDashboard;
