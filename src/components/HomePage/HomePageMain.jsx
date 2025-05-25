import { Link } from "react-router-dom"
import "./HomePageMain.css"
import one from "../../assets/1.png";
import two from "../../assets/2.png";
import three from "../../assets/3.png";
import four from "../../assets/4.png";
import five from "../../assets/5.png";
import six from "../../assets/6.png";
import people from "../../assets/people.png";

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
                        ООО «Торговый дом УЭТ» — комплексный поставщик инженерного оборудования для промышленных и энергетических
                        предприятий России, основанный на базе инжиниринговой компании, опыт работы которой в этой отрасли составляет
                        более 15 лет.
                    </p>
                    <p className="home-page__company-description">
                        Мы не только развиваем промышленный сектор страны, но и создаем команду единомышленников. Присоединяйся к нам!
                    </p>
                </div>

                <div className="home-page__stats">
                    <div className="home-page__stats-row">
                        <div className="home-page__stat-item">
                            <img src={one} alt="Логотип компании" className="logoo" />
                            <h3 className="home-page__stat-number">40 000</h3>
                            <p className="home-page__stat-description">
                                посетителей
                                <br />
                                ежедневно заходят на сайт
                            </p>
                        </div>

                        <div className="home-page__stat-item">
                            <img src={two} alt="Логотип компании" className="logoo" />
                            <h3 className="home-page__stat-number">319</h3>
                            <p className="home-page__stat-description">
                                городов
                                <br />
                                куда мы возим товары
                            </p>
                        </div>

                        <div className="home-page__stat-item">
                            <img src={three} alt="Логотип компании" className="logoo" />
                            <h3 className="home-page__stat-number">1000+</h3>
                            <p className="home-page__stat-description">
                                заказов
                                <br />
                                ежемесячно
                            </p>
                        </div>
                        <div className="home-page__stat-item">
                            <img src={four} alt="Логотип компании" className="logoo" />
                            <h3 className="home-page__stat-number">3 года <br /> развития</h3>
                            <p className="home-page__stat-description">
                                на рынке инженерного
                                <br />
                                оборудования
                            </p>
                        </div>

                        <div className="home-page__stat-item">
                            <img src={five} alt="Логотип компании" className="logoo" />
                            <h3 className="home-page__stat-number">3 офиса</h3>
                            <p className="home-page__stat-description">
                                В Екатеринбурге и Москве
                            </p>
                        </div>

                        <div className="home-page__stat-item">
                            <img src={six} alt="Логотип компании" className="logoo" />
                            <h3 className="home-page__stat-number">35 000+</h3>
                            <p className="home-page__stat-description">
                                клиентов
                                <br />
                                предприятий России и ближнего рубежа
                            </p>
                        </div>
                    </div>
                </div>

                <section className="benefits-section">
                    <div className="benefits-container">
                        <h2 className="benefits-title">У нас ты найдешь</h2>

                        <div className="benefits-grid">
                            <div className="benefit-card benefit-card--dark">
                                <h3 className="benefit-card__title">Развитие и поддержка</h3>
                                <p className="benefit-card__description">
                                    В нашей компании вы найдете продвинутое обучение, заботу кураторов и дружную команду единомышленников.
                                    Развивайтесь вместе с нами — здесь каждый день приносит радость и новые возможности!
                                </p>
                            </div>

                            <div className="benefit-card benefit-card--yellow">
                                <h3 className="benefit-card__title">Атмосфера и мотивация</h3>
                                <p className="benefit-card__description">
                                    У нас всегда жарко: соревнуемся в креативе, побеждаем в масштабных челленджах и зажигаем на корпоративах!
                                    Присоединяйтесь к тусовке, где каждый день яркий и дружеская атмосфера в приоритете.
                                </p>
                            </div>

                            <div className="benefit-card benefit-card--image">
                                <img src={people} alt="Команда в офисе" className="benefit-card__image" />
                            </div>

                            <div className="benefit-card benefit-card--gray">
                                <h3 className="benefit-card__title">Комфорт и забота</h3>
                                <p className="benefit-card__description">
                                    Работайте в удобном пространстве: отдельное здание с наземной парковкой, современные рабочие места и
                                    уютная кухня с ароматным кофе всегда рядом. Мы создали условия, где комфорт сочетается с продуктивностью!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default HomePageMain;
