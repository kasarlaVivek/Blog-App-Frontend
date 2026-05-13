import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  pageWrapper, 
  pageTitleClass, 
  bodyText, 
  articleGrid, 
  articleCardClass, 
  articleTitle, 
  articleExcerpt, 
  articleMeta,
  timestampClass,
  ghostBtn,
  loadingClass,
  errorClass
} from "../styles/common";

function Home() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // Fetch from common-api so it's public
                const res = await axios.get("https://blog-app-backend-1-ry1p.onrender.com/common-api/articles");
                if(res.data.payload) {
                    setArticles(res.data.payload);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch articles. The new public API must be deployed to Render first.");
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    // Get latest 3 for the top section
    const latestArticles = articles.slice(0, 3);
    const remainingArticles = articles.slice(3);

    const openArticle = (article) => {
        navigate(`/article/${article._id}`, { state: article });
    };

    return (
        <div className={pageWrapper}>
            <div className="text-center mb-16">
                <h1 className={pageTitleClass}>Welcome to the Blog</h1>
                <p className={bodyText}>Discover stories, thinking, and expertise from writers on any topic.</p>
            </div>

            {loading && <p className={loadingClass}>Loading articles...</p>}
            
            {error && !loading && (
                <div className="text-center mt-10">
                    <p className={errorClass}>{error}</p>
                </div>
            )}

            {!loading && !error && articles.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold mb-6 text-[#1d1d1f]">Latest Articles</h2>
                    <div className={articleGrid}>
                        {latestArticles.map(article => (
                            <ArticleCard key={article._id} article={article} onClick={() => openArticle(article)} />
                        ))}
                    </div>

                    {remainingArticles.length > 0 && (
                        <>
                            <h2 className="text-2xl font-bold mb-6 mt-16 text-[#1d1d1f]">All Articles</h2>
                            <div className={articleGrid}>
                                {remainingArticles.map(article => (
                                    <ArticleCard key={article._id} article={article} onClick={() => openArticle(article)} />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
            
            {!loading && !error && articles.length === 0 && (
                <div className="text-center mt-10 text-gray-500">
                    <p>No articles found.</p>
                </div>
            )}
        </div>
    );
}

function ArticleCard({ article, onClick }) {
    const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const authorImg = article.author?.profileImageUrl || defaultImage;

    return (
        <div className={articleCardClass} onClick={onClick}>
            <div className="flex items-center gap-3 mb-3 border-b border-[#e8e8ed] pb-3">
                <img src={authorImg} alt="Author" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#1d1d1f]">{article.author?.firstName || "Unknown"}</span>
                    <span className={timestampClass}>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <p className={articleMeta}>{article.category}</p>
            <h3 className={articleTitle}>{article.title}</h3>
            <p className={articleExcerpt}>{article.content.substring(0, 100)}...</p>
            <button className={`${ghostBtn} mt-auto pt-4 flex items-center gap-1`}>
                Read More <span className="text-lg leading-none">→</span>
            </button>
        </div>
    );
}

export default Home;
