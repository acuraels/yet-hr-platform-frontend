import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./BlogPostPageMain.css";

const BlogPostPageMain = () => {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axiosInstance.get("blog/blog-list/");
                const numericId = Number(id);
                const found = data.find((p) => p.id === numericId);

                if (!found) {
                    setError("Пост не найден");
                } else {
                    setPost(found);
                }
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить данные");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <main className="blog-post-page__main">
                <div className="blog-post-page__container">
                    <p>Загрузка…</p>
                </div>
            </main>
        );
    }

    if (error || !post) {
        return (
            <main className="blog-post-page__main">
                <div className="blog-post-page__container">
                    <h1>{error || "Пост не найден"}</h1>
                    <Link to="/blog">← Вернуться к блогу</Link>
                </div>
            </main>
        );
    }

    const paragraphs = post.text
        ? post.text.split(/\r?\n\r?\n/).filter(Boolean)
        : [];
    const formattedDate = post.date
        ? new Date(post.date).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
        : "";

    return (
        <main className="blog-post-page__main">
            <div className="blog-post-page__container">
                <header className="blog-post-page__header">
                    <h1 className="blog-post-page__blog-title">Блог</h1>
                    <Link to="/blog" className="blog-post-page__back-link">
                        <span className="blog-post-page__back-arrow">←</span> К блогу
                    </Link>
                </header>

                <article className="blog-post-page__article">
                    {formattedDate && (
                        <div className="blog-post-page__meta">
                            <time className="blog-post-page__date">{formattedDate}</time>
                        </div>
                    )}

                    <h2 className="blog-post-page__title">{post.title}</h2>

                    <div className="blog-post-page__content">
                        {paragraphs.length > 0
                            ? paragraphs.map((p, i) => (
                                <p key={i} className="blog-post-page__paragraph">
                                    {p}
                                </p>
                            ))
                            : post.text && (
                                <p className="blog-post-page__paragraph">{post.text}</p>
                            )}
                    </div>

                    {post.image && (
                        <div className="blog-post-page__image-container">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="blog-post-page__image"
                            />
                        </div>
                    )}
                </article>

                <div className="blog-post-page__footer">
                    <Link to="/blog" className="blog-post-page__back-link">
                        <span className="blog-post-page__back-arrow">←</span> К блогу
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default BlogPostPageMain;
