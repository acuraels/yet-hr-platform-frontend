import { useState } from "react";
import { Link } from "react-router-dom";
import "./BlogPageMain.css";

const BlogPageMain = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    // 10 постов
    const blogPosts = [
        { id: 1, title: "Как повысить продажи в B2B-сегменте", date: "01 мая 2023", imageUrl: "/news.png", slug: "b2b-sales-boost" },
        { id: 2, title: "Эффективные методы управления командой", date: "05 мая 2023", imageUrl: "/news.png", slug: "team-management-methods" },
        { id: 3, title: "Разработка мобильных приложений в 2025 году", date: "10 мая 2023", imageUrl: "/news.png", slug: "mobile-apps-2025" },
        { id: 4, title: "Тренды в веб-разработке", date: "15 мая 2023", imageUrl: "/news.png", slug: "web-development-trends" },
        { id: 5, title: "Автоматизация бизнес-процессов", date: "20 мая 2023", imageUrl: "/news.png", slug: "business-process-automation" },
        { id: 6, title: "Маркетинг в социальных сетях: что работает", date: "25 мая 2023", imageUrl: "/news.png", slug: "social-media-marketing" },
        { id: 7, title: "Как построить сильный личный бренд", date: "30 мая 2023", imageUrl: "/news.png", slug: "personal-brand-building" },
        { id: 8, title: "Аналитика данных: основы для бизнеса", date: "04 июня 2023", imageUrl: "/news.png", slug: "data-analytics-basics" },
        { id: 9, title: "Эффективные переговоры в бизнесе", date: "08 июня 2023", imageUrl: "/news.png", slug: "business-negotiations" },
        { id: 10, title: "Как выстроить систему продаж", date: "12 июня 2023", imageUrl: "/news.png", slug: "sales-system-building" },
    ];

    // Логика пагинации
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(blogPosts.length / postsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="blog-page__main">
            <div className="blog-page__container">
                <h1 className="blog-page__title">Блог</h1>

                <div className="blog-page__grid">
                    {currentPosts.map((post) => (
                        <Link to={`/blog/${post.slug}`} className="blog-post" key={post.id}>
                            <div className="blog-post__image-container">
                                <div className="blog-post__image-placeholder"></div>
                            </div>
                            <div className="blog-post__content">
                                <span className="blog-post__date">{post.date}</span>
                                <h2 className="blog-post__title">{post.title}</h2>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Пагинация — ТОЧНО КАК БЫЛО */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="pagination__button"
                        >
                            &lt;
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`pagination__button ${currentPage === page ? "pagination__button--active" : ""}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="pagination__button"
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default BlogPageMain;
