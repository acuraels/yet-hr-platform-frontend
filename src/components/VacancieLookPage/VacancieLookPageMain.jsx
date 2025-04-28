import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import "./VacancieLookPageMain.css"

const VacancieLookPageMain = () => {
    const { id } = useParams()
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
    const [applyStep, setApplyStep] = useState(1)
    const [fileUploaded, setFileUploaded] = useState(false)

    // Form data state
    const [applyFormData, setApplyFormData] = useState({
        fullName: '',
        birthDate: '',
        phone: '',
        email: '',
        experience: '',
        resumeLink: '',
        additionalInfo: ''
    })

    // Mock data for the vacancy (in a real app, you would fetch this based on the id)
    const vacancy = {
        id: id,
        title: "Название вакансии",
        date: "26 апреля 2025",
        description: "Описание вакансии Описание вакансии Описание вакансии Описание вакансии Описание вакансии Описание вакансии Описание вакансии.",
        location: "Екатеринбург",
        format: "Офис",
        schedule: "5/2",
        hours: "8 часов/день",
        salary: "87 000",
        sections: [
            {
                title: "Подзаголовок",
                content: "В далёком лесу, где ветер играет с листьями деревьев, а облака плывут по небу как пушистые кораблики, жил-был маленький оранжевый гриб. Этот гриб был необычным: он умел петь песни на языке, который никто не понимал, но все равно любили слушать. Его голос звучал так мягко и приятно, что даже птицы переставали щебетать, чтобы насладиться этим чудесным звуком."
            },
            {
                title: "Подзаголовок",
                content: "В далёком лесу, где ветер играет с листьями деревьев, а облака плывут по небу как пушистые кораблики, жил-был маленький оранжевый гриб. Этот гриб был необычным: он умел петь песни на языке, который никто не понимал, но все равно любили слушать. Его голос звучал так мягко и приятно, что даже птицы переставали щебетать, чтобы насладиться этим чудесным звуком."
            },
            {
                title: "Подзаголовок",
                content: "В далёком лесу, где ветер играет с листьями деревьев, а облака плывут по небу как пушистые кораблики, жил-был маленький оранжевый гриб. Этот гриб был необычным: он умел петь песни на языке, который никто не понимал, но все равно любили слушать. Его голос звучал так мягко и приятно, что даже птицы переставали щебетать, чтобы насладиться этим чудесным звуком."
            }
        ]
    }

    // Handle form input changes
    const handleApplyFormChange = (e) => {
        const { name, value } = e.target
        setApplyFormData(prev => ({ ...prev, [name]: value }))
    }

    // Handle form submission
    const handleApplySubmit = (e) => {
        e.preventDefault()
        setApplyStep(3) // Skip to success step
        // Here you would typically send the data to a server
    }

    // Handle file upload
    const handleFileUpload = () => {
        setFileUploaded(true)
    }

    // Open and close modal functions
    const openApplyModal = () => {
        setApplyStep(1)
        setIsApplyModalOpen(true)
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

    return (
        <main className="vacancy-look-page__main">
            <div className="vacancy-look-page__container">
                <header className="vacancy-look-page__header">
                    <h1 className="vacancy-look-page__title">Вакансия</h1>
                    <Link to="/vacancies" className="vacancy-look-page__back-link">
                        <span className="vacancy-look-page__back-arrow">←</span> К вакансиям
                    </Link>
                </header>

                <article className="vacancy-look-page__article">
                    <div className="vacancy-look-page__meta">
                        <time className="vacancy-look-page__date">{vacancy.date}</time>
                    </div>

                    <h2 className="vacancy-look-page__vacancy-title">{vacancy.title}</h2>

                    <div className="vacancy-look-page__details">
                        <p className="vacancy-look-page__salary">В среднем {vacancy.salary} ₽</p>
                        <ul className="vacancy-look-page__info-list">
                            <li className="vacancy-look-page__info-item">— Место: г. {vacancy.location}</li>
                            <li className="vacancy-look-page__info-item">— Формат: {vacancy.format}</li>
                            <li className="vacancy-look-page__info-item">— Расписание: {vacancy.schedule}</li>
                            <li className="vacancy-look-page__info-item">— Время: {vacancy.hours}</li>
                        </ul>

                        <button
                            className="vacancy-look-page__apply-button"
                            onClick={openApplyModal}
                        >
                            Откликнуться
                        </button>
                    </div>

                    <div className="vacancy-look-page__content">
                        <p className="vacancy-look-page__description">{vacancy.description}</p>

                        {vacancy.sections.map((section, index) => (
                            <section key={index} className="vacancy-look-page__section">
                                <h3 className="vacancy-look-page__section-title">{section.title}</h3>
                                <p className="vacancy-look-page__section-content">{section.content}</p>
                            </section>
                        ))}
                    </div>
                </article>

                <div className="vacancy-look-page__footer">
                    <Link to="/vacancies" className="vacancy-look-page__back-link">
                        <span className="vacancy-look-page__back-arrow">←</span> К вакансиям
                    </Link>
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
                                <p className="modal__vacancy-title">{vacancy.title}</p>
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
        </main>
    )
}

export default VacancieLookPageMain;