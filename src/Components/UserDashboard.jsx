import React, { useEffect, useState } from 'react'
import { useAuth } from "../store/globalStore";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  articleBody,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common.js";


function UserDashboard() {
  const articles = useAuth((state) => state.articles);
  const setArticles = useAuth((state) => state.setArticles);
  const setErr = useAuth((state) => state.setErr);
  const logout = useAuth((state) => state.logout);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const onLogOut = async () => {
    await logout();
    toast.success("logout success")
    navigate('/login')
  }



useEffect(() => {
  if (!isAuthenticated) return;
  const getArticles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/user-api/articles", { 
        withCredentials: true 
      });
      setArticles(res.data.payload);
    } catch (err) {
      setErr(err.response?.data?.error || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };
  getArticles();
}, [isAuthenticated]); 



  // convert UTC → IST
  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };



  return (
    <div>
      <button onClick={onLogOut}>Logout</button>
      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">All Articles</h1>
        <div className={articleGrid}>
          {articles.map((articleObj) => (
            <div className={articleCardClass} key={articleObj._id}>
              <div className="flex flex-col h-full">
                {/* Top Content */}
                <div>
                  <p className={articleTitle}>{articleObj.title}</p>

                  <p>{articleObj.content.slice(0, 10)}...</p>

                  <p className={timestampClass}>{formatDateIST(articleObj.createdAt)}</p>
                </div>

                {/* Button at bottom */}
                <button className={`${ghostBtn} mt-auto pt-4`} onClick={() => navigateToArticleByID(articleObj)}>
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard