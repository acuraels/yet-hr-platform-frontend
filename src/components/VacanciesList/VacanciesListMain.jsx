// src/components/VacanciesListMain/VacanciesListMain.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./VacanciesListMain.css";

/** Человечные подписи для work_format, приходящего из бэка */
const WORK_FORMAT_LABELS = {
    ON_SITE: "В офисе",
    REMOTE: "Удаленно",
    HYBRID: "Гибрид",
    FIELD_WORK: "Разъездная работа",
};

const VacanciesListMain = () => {
    /** --------------------------- базовые стейты --------------------------- */
    const [isArchive, setIsArchive] = useState(false);
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);

    /** ------ пагинация ------ */
    const [currentPage, setCurrentPage] = useState(1);
    const vacanciesPerPage = 4;

    /** -------------------- модалки и формы (не меняем вёрстку) ------------- */
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
    const [currentVacancy, setCurrentVacancy] = useState(null);
    const [applyStep, setApplyStep] = useState(1);
    const [suggestStep, setSuggestStep] = useState(1);
    const [fileUploaded, setFileUploaded] = useState(false);

    const [applyFormData, setApplyFormData] = useState({
        fullName: "",
        birthDate: "",
        phone: "",
        email: "",
        experience: "",
        resumeLink: "",
        additionalInfo: "",
    });

    const [suggestFormData, setSuggestFormData] = useState({
        fullName: "",
        birthDate: "",
        phone: "",
        email: "",
        desiredRole: "",
        experience: "",
        resumeLink: "",
        additionalInfo: "",
    });

    /** ------------------- загрузка вакансий с бэка ------------------------- */
    useEffect(() => {
        const fetchVacancies = async () => {
            setLoading(true);
            try {
                // /api/v1/vacancies/?archived=true|false
                const { data } = await axiosInstance.get(
                    `vacancies/?archived=${isArchive}`
                );

                const mapped = data.map((v) => {
                    const salaryMid =
                        v.salary_from && v.salary_to
                            ? Math.floor((v.salary_from + v.salary_to) / 2)
                            : v.salary_from || v.salary_to || null;

                    return {
                        id: v.id,
                        title: v.title,
                        description: v.short_description,
                        location: v.area, // бэкенд присылает имя региона
                        format: WORK_FORMAT_LABELS[v.work_format] || "",
                        salary: salaryMid ? salaryMid.toLocaleString("ru-RU") : null,
                    };
                });

                setVacancies(mapped);
            } catch (err) {
                console.error("Ошибка загрузки вакансий:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVacancies();
        setCurrentPage(1); // сброс страницы при переключении режима
    }, [isArchive]);

    /** ------------------------ пагинация ---------------------------------- */
    const indexOfLastVacancy = currentPage * vacanciesPerPage;
    const indexOfFirstVacancy = indexOfLastVacancy - vacanciesPerPage;
    const currentVacancies = vacancies.slice(
        indexOfFirstVacancy,
        indexOfLastVacancy
    );
    const totalPages = Math.max(1, Math.ceil(vacancies.length / vacanciesPerPage));

    const handlePageChange = (page) => setCurrentPage(page);
    const toggleArchive = () => setIsArchive((prev) => !prev);

    /** ------------------ модальные обработчики (как раньше) ---------------- */
    const openApplyModal = (vacancy) => {
        setCurrentVacancy(vacancy);
        setApplyStep(1);
        setIsApplyModalOpen(true);
        setFileUploaded(false);
    };

    const openSuggestModal = () => {
        setSuggestStep(1);
        setIsSuggestModalOpen(true);
        setFileUploaded(false);
    };

    const closeApplyModal = () => {
        setIsApplyModalOpen(false);
        setApplyFormData({
            fullName: "",
            birthDate: "",
            phone: "",
            email: "",
            experience: "",
            resumeLink: "",
            additionalInfo: "",
        });
    };

    const closeSuggestModal = () => {
        setIsSuggestModalOpen(false);
        setSuggestFormData({
            fullName: "",
            birthDate: "",
            phone: "",
            email: "",
            desiredRole: "",
            experience: "",
            resumeLink: "",
            additionalInfo: "",
        });
    };

    const handleApplyFormChange = (e) =>
        setApplyFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSuggestFormChange = (e) =>
        setSuggestFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleApplySubmit = (e) => {
        e.preventDefault();
        setApplyStep(3);
        // TODO: здесь POST отклика
    };

    const handleSuggestSubmit = (e) => {
        e.preventDefault();
        setSuggestStep(4);
        // TODO: здесь POST предложения
    };

    const handleFileUpload = () => setFileUploaded(true);

    /** ----------------------------- рендер ------------------------------- */
    return (
        <main className="vacancies-page__main">
            <div className="vacancies-page__main-container">
                {/* ------------------ заголовок ------------------ */}
                <div className="hr-vacancies-header">
                    <div className="hr-vacancies-header__top-row">
                        <h1 className="hr-vacancies-header__heading">Вакансии</h1>

                        {isArchive ? (
                            <span className="hr-vacancies-header__archive-label">в архиве</span>
                        ) : (
                            <Link to="/vacancy-create" className="hr-vacancies-header__create-btn">
                                Создать
                            </Link>
                        )}

                        <div className="hr-vacancies-header__bottom-row">
                            <button
                                className="hr-vacancies-header__archive-btn"
                                onClick={toggleArchive}
                            >
                                {isArchive ? "вернуться к вакансиям" : "архив вакансий"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ------------------ контент ------------------ */}
                <div className="vacancies-page__content">
                    {/* --------- список --------- */}
                    <div className="vacancies-page__list">
                        {loading && <p className="vacancies-loading">Загрузка...</p>}

                        {!loading &&
                            currentVacancies.map((vacancy) => (
                                <Link
                                    to={`/vacancy-edit/${vacancy.id}`}
                                    key={vacancy.id}
                                    className="vacancy-card"
                                >
                                    <div className="vacancy-card__tags">
                                        {vacancy.location && (
                                            <span className="vacancy-card__tag">
                                                {`г. ${vacancy.location}`}
                                            </span>
                                        )}
                                        {vacancy.format && (
                                            <span className="vacancy-card__tag">{vacancy.format}</span>
                                        )}
                                    </div>

                                    <h2 className="vacancy-card__title">{vacancy.title}</h2>
                                    <p className="vacancy-card__description">
                                        {vacancy.description}
                                    </p>

                                    <div className="vacancy-card__footer">
                                        {vacancy.salary && (
                                            <span className="vacancy-card__salary">
                                                В среднем {vacancy.salary} ₽
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}

                        {!loading && (
                            <div className="pagination">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="pagination__button"
                                >
                                    &lt;
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`pagination__button ${currentPage === page ? "pagination__button--active" : ""
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={() =>
                                        handlePageChange(Math.min(totalPages, currentPage + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="pagination__button"
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --------- сайдбар с фильтрами (как был) --------- */}
                    <div className="vacancies-page__sidebar">
                        <div className="filters">
                            <h2 className="filters__title">Фильтры</h2>

                            <div className="filters__group">
                                <h3 className="filters__group-title">Местоположение</h3>
                                <div className="filters__options">
                                    <label className="filters__option">
                                        <input type="checkbox" defaultChecked />
                                        <span>Любой город</span>
                                    </label>
                                    <label className="filters__option">
                                        <input type="checkbox" />
                                        <span>Москва</span>
                                    </label>
                                    <label className="filters__option">
                                        <input type="checkbox" />
                                        <span>Екатеринбург</span>
                                    </label>
                                    <label className="filters__option">
                                        <input type="checkbox" />
                                        <span>Сыктывкар</span>
                                    </label>
                                </div>
                            </div>

                            <div className="filters__group">
                                <h3 className="filters__group-title">Формат работы</h3>
                                <div className="filters__options">
                                    <label className="filters__option">
                                        <input type="checkbox" defaultChecked />
                                        <span>Любой</span>
                                    </label>
                                    <label className="filters__option">
                                        <input type="checkbox" />
                                        <span>Офис</span>
                                    </label>
                                    <label className="filters__option">
                                        <input type="checkbox" />
                                        <span>Гибрид</span>
                                    </label>
                                    <label className="filters__option">
                                        <input type="checkbox" />
                                        <span>Удаленка</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- модальное окно отклика ---------------- */}
            {isApplyModalOpen && (
                <div className="modal">
                    <div className="modal__overlay" onClick={closeApplyModal}></div>
                    <div className="modal__content">
                        {applyStep === 1 && (
                            <div className="modal__step">
                                <h2 className="modal__title">Откликнуться на вакансию</h2>
                                {currentVacancy && (
                                    <p className="modal__vacancy-title">{currentVacancy.title}</p>
                                )}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setApplyStep(2);
                                    }}
                                >
                                    <div className="modal__form-container">
                                        <h3 className="modal__form-title">Заполните информацию</h3>
                                        <div className="modal__form-fields">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={applyFormData.fullName}
                                                onChange={handleApplyFormChange}
                                                placeholder="Фамилия, имя и отчество"
                                                className="modal__input"
                                                required
                                            />
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={applyFormData.birthDate}
                                                onChange={handleApplyFormChange}
                                                placeholder="Дата рождения"
                                                className="modal__input"
                                                required
                                            />
                                            <div className="modal__input-row">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={applyFormData.phone}
                                                    onChange={handleApplyFormChange}
                                                    placeholder="Номер телефона"
                                                    className="modal__input"
                                                    required
                                                />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={applyFormData.email}
                                                    onChange={handleApplyFormChange}
                                                    placeholder="Электронная почта"
                                                    className="modal__input"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="modal__button">
                                            Далее
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {applyStep === 2 && (
                            <div className="modal__step">
                                <h2 className="modal__title">Заявка – шаг 2</h2>
                                <form onSubmit={handleApplySubmit}>
                                    <div className="modal__form-container">
                                        <h3 className="modal__form-title">Заполните информацию</h3>
                                        <div className="modal__form-fields">
                                            <input
                                                type="text"
                                                name="experience"
                                                value={applyFormData.experience}
                                                onChange={handleApplyFormChange}
                                                placeholder="Сколько опыта на этой или подобной вакансии"
                                                className="modal__input"
                                                required
                                            />
                                            <div className="modal__upload-container">
                                                <div className="modal__upload-options">
                                                    <label
                                                        className={`modal__upload-button ${fileUploaded
                                                            ? "modal__upload-button--uploaded"
                                                            : ""
                                                            }`}
                                                    >
                                                        <input
                                                            type="file"
                                                            onChange={handleFileUpload}
                                                            style={{ display: "none" }}
                                                        />
                                                        <span>Загрузить резюме</span>
                                                        {fileUploaded && (
                                                            <span className="modal__upload-icon">✓</span>
                                                        )}
                                                    </label>
                                                    <span className="modal__upload-or">или</span>
                                                    <input
                                                        type="url"
                                                        name="resumeLink"
                                                        value={applyFormData.resumeLink}
                                                        onChange={handleApplyFormChange}
                                                        placeholder="Ссылка на резюме"
                                                        className="modal__input modal__input--link"
                                                    />
                                                </div>
                                                <textarea
                                                    name="additionalInfo"
                                                    value={applyFormData.additionalInfo}
                                                    onChange={handleApplyFormChange}
                                                    placeholder="Можете уточнить информацию о себе или, например, рассказать, почему вас заинтересовала вакансия"
                                                    className="modal__textarea"
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="modal__buttons">
                                            <button
                                                type="button"
                                                className="modal__button modal__button--back"
                                                onClick={() => setApplyStep(1)}
                                            >
                                                Назад
                                            </button>
                                            <button
                                                type="submit"
                                                className="modal__button modal__button--submit"
                                            >
                                                Отправить
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {applyStep === 3 && (
                            <div className="modal__step modal__step--success">
                                <h2 className="modal__title">Заявка отправлена</h2>
                                <p className="modal__success-message">
                                    Скоро вас рассмотрит наш нанимающий менеджер
                                </p>
                                <button
                                    className="modal__button modal__button--close"
                                    onClick={closeApplyModal}
                                >
                                    Закрыть
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ---------------- модальное окно «предложить кандидатуру» -------- */}
            {isSuggestModalOpen && (
                <div className="modal">
                    <div className="modal__overlay" onClick={closeSuggestModal}></div>
                    <div className="modal__content">
                        {suggestStep === 1 && (
                            <div className="modal__step">
                                <h2 className="modal__title">Предложить кандидатуру</h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setSuggestStep(2);
                                    }}
                                >
                                    <div className="modal__form-container">
                                        <h3 className="modal__form-title">Заполните информацию</h3>
                                        <div className="modal__form-fields">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={suggestFormData.fullName}
                                                onChange={handleSuggestFormChange}
                                                placeholder="Фамилия, имя и отчество"
                                                className="modal__input"
                                                required
                                            />
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={suggestFormData.birthDate}
                                                onChange={handleSuggestFormChange}
                                                placeholder="Дата рождения"
                                                className="modal__input"
                                                required
                                            />
                                            <div className="modal__input-row">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={suggestFormData.phone}
                                                    onChange={handleSuggestFormChange}
                                                    placeholder="Номер телефона"
                                                    className="modal__input"
                                                    required
                                                />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={suggestFormData.email}
                                                    onChange={handleSuggestFormChange}
                                                    placeholder="Электронная почта"
                                                    className="modal__input"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="modal__button">
                                            Далее
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {suggestStep === 2 && (
                            <div className="modal__step">
                                <h2 className="modal__title">Заявка – шаг 2</h2>
                                <form onSubmit={handleSuggestSubmit}>
                                    <div className="modal__form-container">
                                        <h3 className="modal__form-title">Заполните информацию</h3>
                                        <div className="modal__form-fields">
                                            <input
                                                type="text"
                                                name="desiredRole"
                                                value={suggestFormData.desiredRole}
                                                onChange={handleSuggestFormChange}
                                                placeholder="Чем бы Вы хотели заниматься? На какую роль претендуете?"
                                                className="modal__input"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="experience"
                                                value={suggestFormData.experience}
                                                onChange={handleSuggestFormChange}
                                                placeholder="Сколько опыта на этой или подобной роли"
                                                className="modal__input"
                                                required
                                            />
                                            <div className="modal__upload-container">
                                                <div className="modal__upload-options">
                                                    <label
                                                        className={`modal__upload-button ${fileUploaded
                                                            ? "modal__upload-button--uploaded"
                                                            : ""
                                                            }`}
                                                    >
                                                        <input
                                                            type="file"
                                                            onChange={handleFileUpload}
                                                            style={{ display: "none" }}
                                                        />
                                                        <span>Загрузить резюме</span>
                                                        {fileUploaded && (
                                                            <span className="modal__upload-icon">✓</span>
                                                        )}
                                                    </label>
                                                    <span className="modal__upload-or">или</span>
                                                    <input
                                                        type="url"
                                                        name="resumeLink"
                                                        value={suggestFormData.resumeLink}
                                                        onChange={handleSuggestFormChange}
                                                        placeholder="Ссылка на резюме"
                                                        className="modal__input modal__input--link"
                                                    />
                                                </div>
                                                <textarea
                                                    name="additionalInfo"
                                                    value={suggestFormData.additionalInfo}
                                                    onChange={handleSuggestFormChange}
                                                    placeholder="Можете уточнить информацию о себе или, например, рассказать, почему вас заинтересовала вакансия"
                                                    className="modal__textarea"
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="modal__buttons">
                                            <button
                                                type="button"
                                                className="modal__button modal__button--back"
                                                onClick={() => setSuggestStep(1)}
                                            >
                                                Назад
                                            </button>
                                            <button
                                                type="submit"
                                                className="modal__button modal__button--submit"
                                            >
                                                Отправить
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {suggestStep === 4 && (
                            <div className="modal__step modal__step--success">
                                <h2 className="modal__title">Заявка отправлена</h2>
                                <p className="modal__success-message">
                                    Скоро вас рассмотрит наш нанимающий менеджер
                                </p>
                                <button
                                    className="modal__button modal__button--close"
                                    onClick={closeSuggestModal}
                                >
                                    Закрыть
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default VacanciesListMain;
