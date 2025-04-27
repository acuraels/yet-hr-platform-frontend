import { useParams, Link } from "react-router-dom";
import "./BlogPostPageMain.css";

// Пример данных о постах
const blogPosts = [
    { id: 1, title: "Как повысить продажи в B2B-сегменте", date: "01 мая 2023", slug: "b2b-sales-boost", content: ["Контент первой новости."] },
    { id: 2, title: "Эффективные методы управления командой", date: "05 мая 2023", slug: "team-management-methods", content: ["Контент второй новости."] },
    { id: 3, title: "Разработка мобильных приложений в 2025 году", date: "10 мая 2023", slug: "mobile-apps-2025", content: ["Контент третьей новости."] },
    { id: 4, title: "Тренды в веб-разработке", date: "15 мая 2023", slug: "web-development-trends", content: ["Контент четвёртой новости."] },
    { id: 5, title: "Автоматизация бизнес-процессов", date: "20 мая 2023", slug: "business-process-automation", content: ["Контент пятой новости."] },
    { id: 6, title: "Маркетинг в социальных сетях: что работает", date: "25 мая 2023", slug: "social-media-marketing", content: ["Контент шестой новости."] },
    { id: 7, title: "Как построить сильный личный бренд", date: "30 мая 2023", slug: "personal-brand-building", content: ["Контент седьмой новости."] },
    { id: 8, title: "Аналитика данных: основы для бизнеса", date: "04 июня 2023", slug: "data-analytics-basics", content: ["Контент восьмой новости."] },
    { id: 9, title: "Эффективные переговоры в бизнесе", date: "08 июня 2023", slug: "business-negotiations", content: ["Контент девятой новости."] },
    { id: 10, title: "Как выстроить систему продаж", date: "12 июня 2023", slug: "sales-system-building", content: ["Контент десятой новости."] },
];


const BlogPostPageMain = () => {
    const { slug } = useParams();
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return (
            <main className="blog-post-page__main">
                <div className="blog-post-page__container">
                    <h1>Новость не найдена</h1>
                    <Link to="/blog">← Вернуться к блогу</Link>
                </div>
            </main>
        );
    }

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
                    <div className="blog-post-page__meta">
                        <time className="blog-post-page__date">{post.date}</time>
                    </div>

                    <h2 className="blog-post-page__title">{post.title}</h2>

                    <div className="blog-post-page__content">
                        {post.content.map((paragraph, index) => (
                            <p key={index} className="blog-post-page__paragraph">
                                {paragraph}
                            </p>

                        ))}
                    </div>
                    <div className="post__image-container">
                        <img src="../frame.png" alt="" />
                    </div>
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
