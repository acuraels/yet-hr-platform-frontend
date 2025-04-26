import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import "./HeaderHR.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Функция для проверки размера экрана
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Проверяем размер при загрузке
        checkScreenSize();

        // Добавляем слушатель изменения размера окна
        window.addEventListener("resize", checkScreenSize);

        // Очищаем слушатель при размонтировании компонента
        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    // Закрываем меню при клике на ссылку на мобильных устройствах
    const handleLinkClick = () => {
        if (isMobile) {
            setIsMenuOpen(false);
        }
    };

    // Переключение состояния меню
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header__container">
                <Link to="/home" className="header__logo">
                    <div className="logo__container">
                        <img src={logo} alt="Логотип компании" className="logo" />
                        <p className="logo__text"><span className="logo__span">УЭТ</span> | Работа у нас</p>
                    </div>
                </Link>

                {/* Бургер-кнопка для мобильных устройств */}
                <div className={`burger-menu ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* Навигация */}
                <nav className={`header__nav ${isMenuOpen ? "open" : ""}`}>
                    <Link to="/vacancies-responses" onClick={handleLinkClick}>
                        Отклики
                    </Link>
                    <Link to="/vacancies-list" onClick={handleLinkClick}>
                        Вакансии
                    </Link>
                    <Link to="/logout" onClick={handleLinkClick}>
                        Выход
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
