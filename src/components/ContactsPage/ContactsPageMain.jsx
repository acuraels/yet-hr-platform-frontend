import { useState } from "react"
import "./ContactsPageMain.css"

const ContactsPageMain = () => {
    const [suggestStep, setSuggestStep] = useState(1)
    const [fileUploaded, setFileUploaded] = useState(false)

    // Form data state
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

    // Handle form input changes
    const handleSuggestFormChange = (e) => {
        const { name, value } = e.target
        setSuggestFormData(prev => ({ ...prev, [name]: value }))
    }

    // Handle form submission
    const handleSuggestSubmit = (e) => {
        e.preventDefault()
        setSuggestStep(3) // Skip to success step
        // Here you would typically send the data to a server
    }

    // Handle file upload
    const handleFileUpload = () => {
        setFileUploaded(true)
    }

    return (
        <main className="contacts-page__main">
            <div className="contacts-page__container">
                <h1 className="contacts-page__title">Контакты</h1>

                <div className="contacts-page__offices">
                    {/* Екатеринбург Office */}
                    <section className="office-section">
                        <h2 className="office-section__city">Екатеринбург</h2>

                        <div className="office-section__content">
                            <div className="office-section__info">
                                <div className="office-info">
                                    <h3 className="office-info__title">Офис</h3>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Адрес:</span>
                                        <span className="office-info__value">г. Екатеринбург, ул. Малышева, стр. 164, оф.406</span>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Время работы:</span>
                                        <span className="office-info__value">
                                            Пн. - Пт. 9:00 - 18:00<br />
                                            Сб. 10:00 - 17:00<br />
                                            Выходной день - Вс.
                                        </span>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Телефон:</span>
                                        <a href="tel:+73432281642" className="office-info__value office-info__link">+7 343 228-16-42</a>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Почта:</span>
                                        <a href="mailto:hiring@uetplant.com" className="office-info__value office-info__link">hiring@uetplant.com</a>
                                    </div>

                                    <button className="office-info__button">Написать нам</button>
                                </div>
                            </div>

                            <div className="office-section__map">
                                <div style={{ position: "relative", overflow: "hidden" }} className="office-map">
                                    <a href="https://yandex.ru/maps/org/uralenergotel/111731727573/?utm_medium=mapframe&utm_source=maps" style={{ color: "#eee", fontSize: "12px", position: "absolute", top: "0px" }}>Уралэнерготел</a>
                                    <a href="https://yandex.ru/maps/54/yekaterinburg/category/engineering/184107459/?utm_medium=mapframe&utm_source=maps" style={{ color: "#eee", fontSize: "12px", position: "absolute", top: "14px" }}>Инжиниринг в Екатеринбурге</a>
                                    <a href="https://yandex.ru/maps/54/yekaterinburg/category/design_institute/184107419/?utm_medium=mapframe&utm_source=maps" style={{ color: "#eee", fontSize: "12px", position: "absolute", top: "28px" }}>Проектная организация в Екатеринбурге</a>
                                    <iframe src="https://yandex.ru/map-widget/v1/org/uralenergotel/111731727573/gallery/?ll=60.666708%2C56.841330&z=16" width="100%" height="400" frameBorder="1" allowFullScreen={true} style={{ position: "relative" }}></iframe>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Москва Office */}
                    <section className="office-section">
                        <h2 className="office-section__city">Москва</h2>

                        <div className="office-section__content">
                            <div className="office-section__info">
                                <div className="office-info">
                                    <h3 className="office-info__title">Офис</h3>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Адрес:</span>
                                        <span className="office-info__value">г. Москва, ул. Жебрунова, 6/1, оф.</span>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Время работы:</span>
                                        <span className="office-info__value">
                                            Пн. - Пт. 9:00 - 18:00<br />
                                            Сб. 10:00 - 17:00<br />
                                            Выходной день - Вс.
                                        </span>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Телефон:</span>
                                        <a href="tel:+74952281642" className="office-info__value office-info__link">+7 495 228-16-42</a>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Почта:</span>
                                        <a href="mailto:hiring@uetplant.com" className="office-info__value office-info__link">hiring@uetplant.com</a>
                                    </div>

                                    <button className="office-info__button">Написать нам</button>
                                </div>
                            </div>

                            <div className="office-section__map">
                                <div style={{ position: "relative", overflow: "hidden" }} className="office-map">
                                    <a href="https://yandex.ru/maps/213/moscow/?utm_medium=mapframe&utm_source=maps" style={{ color: "#eee", fontSize: "12px", position: "absolute", top: "0px" }}>Москва</a>
                                    <a href="https://yandex.ru/maps/213/moscow/house/ulitsa_zhebrunova_6s1/Z04YcA9hTkUEQFtvfXt5dXhhYQ==/?ll=37.681703%2C55.784425&utm_medium=mapframe&utm_source=maps&z=16" style={{ color: "#eee", fontSize: "12px", position: "absolute", top: "14px" }}>Улица Жебрунова, 6с1 на карте Москвы, ближайшее метро Сокольники — Яндекс Карты</a>
                                    <iframe src="https://yandex.ru/map-widget/v1/?ll=37.681703%2C55.784425&mode=whatshere&whatshere%5Bpoint%5D=37.681703%2C55.784425&whatshere%5Bzoom%5D=17&z=16" width="100%" height="400" frameBorder="1" allowFullScreen={true} style={{ position: "relative" }}></iframe>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Candidate Application Form */}
                <section className="candidate-form-section">
                    <div className="candidate-form">
                        {suggestStep === 1 && (
                            <div className="candidate-form__step">
                                <h2 className="candidate-form__title">Предложить кандидатуру</h2>
                                <form onSubmit={(e) => { e.preventDefault(); setSuggestStep(2); }}>
                                    <div className="candidate-form__container">
                                        <div className="candidate-form__fields">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={suggestFormData.fullName}
                                                onChange={handleSuggestFormChange}
                                                placeholder="Фамилия, имя и отчество"
                                                className="candidate-form__input"
                                                required
                                            />
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={suggestFormData.birthDate}
                                                onChange={handleSuggestFormChange}
                                                placeholder="Дата рождения"
                                                className="candidate-form__input"
                                                required
                                            />
                                            <div className="candidate-form__input-row">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={suggestFormData.phone}
                                                    onChange={handleSuggestFormChange}
                                                    placeholder="Номер телефона"
                                                    className="candidate-form__input"
                                                    required
                                                />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={suggestFormData.email}
                                                    onChange={handleSuggestFormChange}
                                                    placeholder="Электронная почта"
                                                    className="candidate-form__input"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="candidate-form__button">Далее</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {suggestStep === 2 && (
                            <div className="candidate-form__step">
                                <h2 className="candidate-form__title">Заявка - шаг 2</h2>
                                <form onSubmit={handleSuggestSubmit}>
                                    <div className="candidate-form__container">
                                        <div className="candidate-form__fields">
                                            <input
                                                type="text"
                                                name="desiredRole"
                                                value={suggestFormData.desiredRole}
                                                onChange={handleSuggestFormChange}
                                                placeholder="Чем бы Вы хотели заниматься? На какую роль претендуете?"
                                                className="candidate-form__input"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="experience"
                                                value={suggestFormData.experience}
                                                onChange={handleSuggestFormChange}
                                                placeholder="Сколько опыта на этой или подобной роли"
                                                className="candidate-form__input"
                                                required
                                            />
                                            <div className="candidate-form__upload-container">
                                                <div className="candidate-form__upload-options">
                                                    <label className={`candidate-form__upload-button ${fileUploaded ? 'candidate-form__upload-button--uploaded' : ''}`}>
                                                        <input
                                                            type="file"
                                                            onChange={handleFileUpload}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <span>Загрузить резюме</span>
                                                        {fileUploaded && <span className="candidate-form__upload-icon">✓</span>}
                                                    </label>
                                                    <span className="candidate-form__upload-or">или</span>
                                                    <input
                                                        type="url"
                                                        name="resumeLink"
                                                        value={suggestFormData.resumeLink}
                                                        onChange={handleSuggestFormChange}
                                                        placeholder="Ссылка на резюме"
                                                        className="candidate-form__input candidate-form__input--link"
                                                    />
                                                </div>
                                                <textarea
                                                    name="additionalInfo"
                                                    value={suggestFormData.additionalInfo}
                                                    onChange={handleSuggestFormChange}
                                                    placeholder="Можете уточнить информацию о себе или, например, рассказать, почему вас заинтересовала вакансия"
                                                    className="candidate-form__textarea"
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="candidate-form__buttons">
                                            <button
                                                type="button"
                                                className="candidate-form__button candidate-form__button--back"
                                                onClick={() => setSuggestStep(1)}
                                            >
                                                Назад
                                            </button>
                                            <button type="submit" className="candidate-form__button candidate-form__button--submit">Отправить</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {suggestStep === 3 && (
                            <div className="candidate-form__step candidate-form__step--success">
                                <h2 className="candidate-form__title">Заявка отправлена</h2>
                                <p className="candidate-form__success-message">Скоро вас рассмотрит наш нанимающий менеджер</p>
                                <button
                                    className="candidate-form__button"
                                    onClick={() => setSuggestStep(1)}
                                >
                                    Отправить еще одну заявку
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default ContactsPageMain;