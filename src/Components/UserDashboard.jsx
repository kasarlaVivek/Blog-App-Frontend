import React, { useEffect, useState } from 'react'
import { useAuth } from "../store/globalStore";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  pageWrapper,
  pageTitleClass,
  bodyText,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
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

  useEffect(() => {
    if (!isAuthenticated) return;
    const getArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://blog-app-backend-1-ry1p.onrender.com/user-api/articles", { 
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

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className={pageWrapper}>
      <div className="mb-12">
        <h1 className={pageTitleClass}>Hello, {currentUser?.firstName}</h1>
        <p className={bodyText}>Catch up on the latest insights and stories.</p>
      </div>

      {loading && <p className={loadingClass}>Loading articles...</p>}

      {!loading && articles.length > 0 ? (
        <div className={articleGrid}>
          {articles.map((articleObj) => {
            const authorImg = articleObj.author?.profileImageUrl || defaultImage;
            return (
              <div className={articleCardClass} key={articleObj._id} onClick={() => navigateToArticleByID(articleObj)}>
                <div className="flex items-center gap-3 mb-3 border-b border-[#e8e8ed] pb-3">
                  <img src={authorImg} alt="Author" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#1d1d1f]">{articleObj.author?.firstName || "Unknown"}</span>
                    <span className={timestampClass}>{new Date(articleObj.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className={articleMeta}>{articleObj.category}</p>
                <h3 className={articleTitle}>{articleObj.title}</h3>
                <p className={articleExcerpt}>{articleObj.content.substring(0, 100)}...</p>
                <button className={`${ghostBtn} mt-auto pt-4 flex items-center gap-1`}>
                  Read More <span className="text-lg leading-none">→</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <div className="text-center mt-10 text-gray-500">
            <p>No articles available yet.</p>
          </div>
        )
      )}
    </div>
  )
}

export default UserDashboard