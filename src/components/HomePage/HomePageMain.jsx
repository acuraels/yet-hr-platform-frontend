import { Link } from "react-router-dom"
import "./HomePageMain.css"

const HomePageMain = () => {
    return (
        <main className="home-page__main">
            <div className="home-page__hero">
                <div className="home-page__hero-content">
                    <h1 className="home-page__title">Вместе с нами к успеху</h1>
                    <Link to="/vacancies" className="home-page__cta-button">
                        Смотреть все вакансии
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 10H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                                d="M10 5L15 10L10 15"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="home-page__stats-container">
                <div className="home-page__company-info">
                    <p className="home-page__company-description">
                        ТД УЭТ — сервис поставок инженерного
                        <br />
                        оборудования для промышленных
                        <br />
                        предприятий России.
                    </p>
                    <p className="home-page__company-description">
                        Эти предприятия основаны на базе
                        <br />
                        инжиниринговой компании, опыт работы
                        <br />
                        которой в этой отрасли составляет более 15 лет.
                    </p>
                </div>

                <div className="home-page__stats">
                    <div className="home-page__stats-row">
                        <div className="home-page__stat-item">
                            <h3 className="home-page__stat-number">1000+</h3>
                            <p className="home-page__stat-description">
                                заказов
                                <br />
                                ежемесячно
                            </p>
                        </div>

                        <div className="home-page__stat-item">
                            <h3 className="home-page__stat-number">40 000</h3>
                            <p className="home-page__stat-description">
                                посетителей
                                <br />
                                ежедневно заходят на сайт
                            </p>
                        </div>
                    </div>

                    <div className="home-page__stats-row">
                        <div className="home-page__stat-item">
                            <h3 className="home-page__stat-number">319</h3>
                            <p className="home-page__stat-description">
                                городов
                                <br />
                                куда мы возим товары
                            </p>
                        </div>

                        <div className="home-page__stat-item">
                            <h3 className="home-page__stat-number">35 000+</h3>
                            <p className="home-page__stat-description">
                                клиентов
                                <br />
                                предприятий России и ближнего рубежа
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default HomePageMain;
