import { Link } from "react-router-dom"
import logo from "../../assets/logo.svg";
import "./Footer.css"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__top">
                    <div className="footer__logo">
                        <img src={logo} alt="Логотип компании" className="footer__logo-img" />
                        <span className="footer__logo-text">ТОРГОВЫЙ ДОМ УЭТ</span>
                    </div>
                    <Link to="/vacancy-search" className="footer__vacancy-link">
                        Не нашли вакансию?
                    </Link>
                </div>

                <div className="footer__content">
                    <div className="footer__column">
                        <h3 className="footer__heading">Главный офис</h3>
                        <p className="footer__text">г. Екатеринбург, <br /> ул. Малышева, 164, оф. 406</p>

                        <h3 className="footer__heading footer__heading-contact">Мы на связи</h3>
                        <div className="footer__contact-icons">
                            <a href="https://wa.me/79999999999" className="footer__icon-link" aria-label="WhatsApp">
                                <svg className="footer__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.4539 3.55636C18.2166 1.31909 15.2101 0.0534229 12.0348 0.0534229C5.4602 0.0534229 0.114246 5.39938 0.114246 11.974C0.114246 14.0935 0.648246 16.1595 1.65625 18.0134L0 24.0534L6.1935 22.4307C7.98216 23.3502 9.98716 23.8377 12.0302 23.8377H12.0348C18.6048 23.8377 24 18.4917 24 11.9177C24 8.74238 22.6912 5.79363 20.4539 3.55636ZM12.0348 21.8365C10.2461 21.8365 8.49341 21.3671 6.97716 20.4857L6.61591 20.2725L2.86591 21.2455L3.85591 17.5865L3.62466 17.2115C2.65341 15.6415 2.13841 13.8347 2.13841 11.974C2.13841 6.50363 6.56341 2.07863 12.0394 2.07863C14.6889 2.07863 17.1784 3.13363 19.0371 4.99238C20.8957 6.85113 21.9816 9.34063 21.9762 11.9177C21.9762 17.3927 17.5057 21.8365 12.0348 21.8365ZM17.4834 14.4872C17.1834 14.3372 15.7032 13.6072 15.4264 13.5047C15.1496 13.4022 14.9464 13.3535 14.7432 13.6535C14.54 13.9535 13.9641 14.6372 13.7841 14.8404C13.6041 15.0437 13.4241 15.068 13.1241 14.918C12.8241 14.768 11.8641 14.4547 10.7341 13.4447C9.85341 12.6597 9.26841 11.6997 9.08841 11.3997C8.90841 11.0997 9.06841 10.9347 9.22091 10.7822C9.35841 10.6447 9.52591 10.4235 9.67591 10.2435C9.82591 10.0635 9.87466 9.93475 9.97716 9.73175C10.0797 9.52875 10.0309 9.34875 9.95716 9.19875C9.88341 9.04875 9.29841 7.56851 9.04716 6.96851C8.80216 6.38851 8.55091 6.46851 8.36216 6.45851C8.18216 6.44851 7.97916 6.44851 7.77616 6.44851C7.57316 6.44851 7.24716 6.52226 6.97041 6.82226C6.69366 7.12226 5.91716 7.85226 5.91716 9.33251C5.91716 10.8127 7.00216 12.2465 7.15216 12.4495C7.30216 12.6525 9.26216 15.6742 12.2641 16.9597C13.0407 17.2957 13.6441 17.4997 14.1134 17.6502C14.8764 17.9022 15.5702 17.8652 16.1191 17.7897C16.7271 17.7052 17.9334 17.0597 18.1846 16.3597C18.4359 15.6597 18.4359 15.0597 18.3621 14.9397C18.2884 14.8197 18.0852 14.7435 17.4834 14.4872Z" fill="black" />
                                </svg>
                            </a>
                            <a href="mailto:uet.hiring@test.com" className="footer__icon-link" aria-label="Email">
                                <svg className="footer__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="black" />
                                </svg>
                            </a>
                            <a href="tel:+79999999999" className="footer__icon-link" aria-label="Телефон">
                                <svg className="footer__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="black" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer__column">
                        <h3 className="footer__heading">Телефон</h3>
                        <p className="footer__text">+7 (999) 999-99-99</p>
                        <p className="footer__text footer__text-small">Звоните с 9:00 до 18:00</p>

                        <h3 className="footer__heading footer__heading-email">Почта</h3>
                        <a href="mailto:uet.hiring@test.com" className="footer__email">uet.hiring@test.com</a>
                    </div>

                    <div className="footer__column">
                        <h3 className="footer__heading">Навигация</h3>
                        <nav className="footer__nav">
                            <Link to="/about" className="footer__nav-link">О нас</Link>
                            <Link to="/vacancies" className="footer__nav-link">Вакансии</Link>
                            <Link to="/blog" className="footer__nav-link">Блог</Link>
                            <Link to="/contacts" className="footer__nav-link">Контакты</Link>
                        </nav>
                    </div>

                    <div className="footer__column">
                        <h3 className="footer__heading">Также мы</h3>
                        <nav className="footer__nav">
                            <Link to="/here" className="footer__nav-link">вот тут</Link>
                            <Link to="/more" className="footer__nav-link">еще тут</Link>
                            <Link to="/there" className="footer__nav-link">тама</Link>
                            <Link to="/somewhere" className="footer__nav-link">тута</Link>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
