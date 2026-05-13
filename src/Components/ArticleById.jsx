import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/globalStore";
import { toast } from "react-hot-toast";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
} from "../styles/common.js";
import { useForm } from "react-hook-form";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    // We fetch the article every time to ensure we get the populated author details,
    // because location.state might only have the unpopulated author ID from the dashboard.
    const getArticle = async () => {
      // Only show loading if we don't have initial state
      if (!article) setLoading(true);

      try {
        // Use the correct backend path (articles instead of article)
        // If the user is an author, they should hit author-api, else user-api
        const roleApi = user?.role?.toLowerCase() === "author" ? "author-api" : "user-api";
        const res = await axios.get(`https://blog-app-backend-1-ry1p.onrender.com/${roleApi}/articles/${id}`, { withCredentials: true });

        // Update the article state with the fully populated document
        if(res.data.payload) {
            setArticle(res.data.payload);
        }
      } catch (err) {
        setErr(err.response?.data?.error || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id, user?.role]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // delete & restore article
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        `https://blog-app-backend-1-ry1p.onrender.com/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true },
      );

      console.log("SUCCESS:", res.data);

      setArticle(res.data.payload);

      toast.success(res.data.message);
    } catch (err) {
      console.log("ERROR:", err.response);

      const msg = err.response?.data?.message;

      if (err.response?.status === 400) {
        toast(msg); // already deleted/active case
      } else {
        setErr(msg || "Operation failed");
      }
    }
  };

  //edit article
  const editArticle = (articleObj) => {
    navigate(`/edit-article/${articleObj._id}`, { state: articleObj });
  };

  //post comment by user
  const addComment = async (commentObj) => {
    //add artcileId
    console.log(commentObj);
    let res = await axios.put(`https://blog-app-backend-1-ry1p.onrender.com/user-api/article/${article._id}`, commentObj, { withCredentials: true });
    if (res.status === 201) {
      toast.success(res.data.message);
      setArticle(res.data.payload);
    }
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (err) return <p className={errorClass}>{err}</p>;
  if (!article) return null;

  const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const authorImg = article.author?.profileImageUrl || defaultImage;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>
            <img src={authorImg} alt="Author" className="w-6 h-6 rounded-full object-cover border border-[#d2d2d7]" />
            {article.author?.firstName || "Author"}
          </div>

          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}
      {/* form to add comment if role is USER */}
      {/* USER actions */}
      {user?.role === "USER" && (
        <div className={articleActions}>
          <form onSubmit={handleSubmit(addComment)}>
            <input
              type="text"
              {...register("comment")}
              className={inputClass}
              placeholder="Write your comment here..."
            />
            <button type="submit" className="bg-amber-600 text-white px-5 py-2 rounded-2xl mt-5">
              Add comment
            </button>
          </form>
        </div>
      )}

      {/* comments */}
      {user?.role === "USER" && article.comments.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-[#1d1d1f] mb-6">Comments</h3>
          <div className="flex flex-col gap-4">
            {article.comments.map((comment, index) => (
              <div key={comment._id || index} className="bg-[#f5f5f7] p-5 rounded-2xl border border-[#e8e8ed]">
                <div className="flex items-center gap-2 mb-2">
                  <img src={defaultImage} className="w-6 h-6 rounded-full object-cover border border-[#d2d2d7]" alt="User" />
                  <p className="text-sm font-semibold text-[#1d1d1f]">
                    {comment.user?.email || "Anonymous User"}
                  </p>
                </div>
                <p className="text-[#6e6e73] text-sm leading-relaxed">{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Footer */}
      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
    </div>
  );
}

export default ArticleByID;

