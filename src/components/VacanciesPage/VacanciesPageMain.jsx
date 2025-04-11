import { useState } from "react"
import { Link } from "react-router-dom"
import "./VacanciesPageMain.css"

const VacanciesPageMain = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const vacanciesPerPage = 4

    // Состояния для модальных окон
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
    const [currentVacancy, setCurrentVacancy] = useState(null)
    const [applyStep, setApplyStep] = useState(1)
    const [suggestStep, setSuggestStep] = useState(1)
    const [fileUploaded, setFileUploaded] = useState(false)

    // Данные форм
    const [applyFormData, setApplyFormData] = useState({
        fullName: '',
        birthDate: '',
        phone: '',
        email: '',
        experience: '',
        resumeLink: '',
        additionalInfo: ''
    })

    const [suggestFormData, setSuggestFormData] = useState({
        fullName: '',
        birthDate: '',
        phone: '',
        email: '',
        desiredRole: '',
        experience: '',
        resumeLink: '',
        additionalInfo: ''
    })

    // Данные о вакансиях
    const vacancies = [
        {
            id: 1,
            title: "Название вакансии",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            location: "Екатеринбург",
            format: "В офисе",
            salary: "87 000",
        },
        {
            id: 2,
            title: "Название вакансии",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            location: "Калининград",
            format: "Удаленно",
        },
        {
            id: 3,
            title: "Название вакансии",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            location: "Любой город",
            format: "Удаленно",
            salary: "87 000",
        },
        {
            id: 4,
            title: "Название вакансии",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            location: "Любой город",
            format: "Удаленно",
            salary: "87 000",
        },
        {
            id: 5,
            title: "Название вакансии",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            location: "Москва",
            format: "Гибрид",
            salary: "95 000",
        },
        {
            id: 6,
            title: "Название вакансии",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            location: "Сыктывкар",
            format: "В офисе",
            salary: "75 000",
        },
    ]

    // Расчет пагинации
    const indexOfLastVacancy = currentPage * vacanciesPerPage
    const indexOfFirstVacancy = indexOfLastVacancy - vacanciesPerPage
    const currentVacancies = vacancies.slice(indexOfFirstVacancy, indexOfLastVacancy)
    const totalPages = Math.ceil(vacancies.length / vacanciesPerPage)

    // Функция для изменения страницы
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    // Функции для модальных окон
    const openApplyModal = (vacancy) => {
        setCurrentVacancy(vacancy)
        setApplyStep(1)
        setIsApplyModalOpen(true)
        setFileUploaded(false)
    }

    const openSuggestModal = () => {
        setSuggestStep(1)
        setIsSuggestModalOpen(true)
        setFileUploaded(false)
    }

    const closeApplyModal = () => {
        setIsApplyModalOpen(false)
        setApplyFormData({
            fullName: '',
            birthDate: '',
            phone: '',
            email: '',
            experience: '',
            resumeLink: '',
            additionalInfo: ''
        })
    }

    const closeSuggestModal = () => {
        setIsSuggestModalOpen(false)
        setSuggestFormData({
            fullName: '',
            birthDate: '',
            phone: '',
            email: '',
            desiredRole: '',
            experience: '',
            resumeLink: '',
            additionalInfo: ''
        })
    }

    // Обработчики изменения полей форм
    const handleApplyFormChange = (e) => {
        const { name, value } = e.target
        setApplyFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSuggestFormChange = (e) => {
        const { name, value } = e.target
        setSuggestFormData(prev => ({ ...prev, [name]: value }))
    }

    // Обработчики отправки форм
    const handleApplySubmit = (e) => {
        e.preventDefault()
        setApplyStep(3) // Переход к шагу "Заявка отправлена"
        // Здесь можно добавить логику отправки данных на сервер
    }

    const handleSuggestSubmit = (e) => {
        e.preventDefault()
        setSuggestStep(4) // Переход к шагу "Заявка отправлена"
        // Здесь можно добавить логику отправки данных на сервер
    }

    // Обработчик загрузки файла
    const handleFileUpload = () => {
        setFileUploaded(true)
    }

    return (
        <main className="vacancies-page__main">
            <div className="vacancies-page__main-container">
                <h1 className="vacancies-page__title">Вакансии</h1>

                <div className="vacancies-page__content">
                    <div className="vacancies-page__list">
                        {currentVacancies.map((vacancy) => (
                            <div key={vacancy.id} className="vacancy-card">
                                <div className="vacancy-card__tags">
                                    {vacancy.location && (
                                        <span className="vacancy-card__tag">{`г. ${vacancy.location}`}</span>
                                    )}
                                    {vacancy.format && (
                                        <span className="vacancy-card__tag">{vacancy.format}</span>
                                    )}
                                </div>

                                <h2 className="vacancy-card__title">{vacancy.title}</h2>
                                <p className="vacancy-card__description">{vacancy.description}</p>

                                <div className="vacancy-card__footer">
                                    <button
                                        className="vacancy-card__button"
                                        onClick={() => openApplyModal(vacancy)}
                                    >
                                        Откликнуться
                                    </button>
                                    {vacancy.salary && (
                                        <span className="vacancy-card__salary">В среднем {vacancy.salary} ₽</span>
                                    )}
                                </div>
                            </div>
                        ))}

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
                                    className={`pagination__button ${currentPage === page ? "pagination__button--active" : ""
                                        }`}
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
                    </div>

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

                        <div className="cta-block">
                            <p className="cta-block__text">Не нашли подходящей <br /> вакансии?</p>
                            <button
                                className="cta-block__button"
                                onClick={openSuggestModal}
                            >
                                Рассказать о себе
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно для отклика на вакансию */}
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
                                <form onSubmit={(e) => { e.preventDefault(); setApplyStep(2); }}>
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
                                        <button type="submit" className="modal__button">Далее</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {applyStep === 2 && (
                            <div className="modal__step">
                                <h2 className="modal__title">Заявка - шаг 2</h2>
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
                                                    <label className={`modal__upload-button ${fileUploaded ? 'modal__upload-button--uploaded' : ''}`}>
                                                        <input
                                                            type="file"
                                                            onChange={handleFileUpload}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <span>Загрузить резюме</span>
                                                        {fileUploaded && <span className="modal__upload-icon">✓</span>}
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
                                            <button type="submit" className="modal__button modal__button--submit">Отправить</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {applyStep === 3 && (
                            <div className="modal__step modal__step--success">
                                <h2 className="modal__title">Заявка отправлена</h2>
                                <p className="modal__success-message">Скоро вас рассмотрит наш нанимающий менеджер</p>
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

            {/* Модальное окно для предложения кандидатуры */}
            {isSuggestModalOpen && (
                <div className="modal">
                    <div className="modal__overlay" onClick={closeSuggestModal}></div>
                    <div className="modal__content">
                        {suggestStep === 1 && (
                            <div className="modal__step">
                                <h2 className="modal__title">Предложить кандидатуру</h2>
                                <form onSubmit={(e) => { e.preventDefault(); setSuggestStep(2); }}>
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
                                        <button type="submit" className="modal__button">Далее</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {suggestStep === 2 && (
                            <div className="modal__step">
                                <h2 className="modal__title">Заявка - шаг 2</h2>
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
                                                    <label className={`modal__upload-button ${fileUploaded ? 'modal__upload-button--uploaded' : ''}`}>
                                                        <input
                                                            type="file"
                                                            onChange={handleFileUpload}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <span>Загрузить резюме</span>
                                                        {fileUploaded && <span className="modal__upload-icon">✓</span>}
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
                                            <button type="submit" className="modal__button modal__button--submit">Отправить</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {suggestStep === 4 && (
                            <div className="modal__step modal__step--success">
                                <h2 className="modal__title">Заявка отправлена</h2>
                                <p className="modal__success-message">Скоро вас рассмотрит наш нанимающий менеджер</p>
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
    )
}

export default VacanciesPageMain;
