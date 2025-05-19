import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./BlogPageMain.css";

const BlogPageMain = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axiosInstance.get("blog/blog-list/");
                setPosts(data);
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить посты");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <main className="blog-page__main">
                <div className="blog-page__container">
                    <p className="blog-page__status">Загрузка…</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="blog-page__main">
                <div className="blog-page__container">
                    <p className="blog-page__status blog-page__status--error">{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="blog-page__main">
            <div className="blog-page__container">
                <h1 className="blog-page__title">Блог</h1>

                {posts.length === 0 ? (
                    <p className="blog-page__status">Записей пока нет.</p>
                ) : (
                    <div className="blog-page__grid">
                        {posts.map((post) => {
                            const formattedDate = post.date
                                ? new Date(post.date).toLocaleDateString("ru-RU", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })
                                : "";

                            return (
                                <Link
                                    to={`/blog/${post.id}`}
                                    className="blog-post"
                                    key={post.id}
                                >
                                    <div className="blog-post__image-container">
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="blog-post__image"
                                            />
                                        ) : (
                                            <div className="blog-post__image-placeholder" />
                                        )}
                                    </div>
                                    <div className="blog-post__content">
                                        <span className="blog-post__date">{formattedDate}</span>
                                        <h2 className="blog-post__title">{post.title}</h2>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};

export default BlogPageMain;
