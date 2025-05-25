import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./ContactsPageMain.css";

const ContactsPageMain = () => {
    /* ───────── состояния формы ───────── */
    const [suggestStep, setSuggestStep] = useState(1);   // 1 → 2 → 4 (успех)
    const [resumeFile, setResumeFile] = useState(null);
    const [fileUploaded, setFileUploaded] = useState(false);

    /* ───────── данные формы ───────── */
    const blankSuggest = {
        fullName: "",
        birthDate: "",
        phone: "",
        email: "",
        desiredRole: "",
        experience: "",
        resumeLink: "",
        additionalInfo: "",
    };
    const [suggestFormData, setSuggestFormData] = useState(blankSuggest);

    /* ───────── helpers ───────── */
    const handleSuggestFormChange = ({ target: { name, value } }) =>
        setSuggestFormData((prev) => ({ ...prev, [name]: value }));

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0] || null;
        setResumeFile(file);
        setFileUploaded(!!file);
    };

    const sendResponse = async (form) => {
        const fd = new FormData();
        fd.append("name", form.fullName);
        fd.append("birth_date", form.birthDate);
        fd.append("phone", form.phone);
        fd.append("email", form.email);
        fd.append("experience", form.experience);
        fd.append("letter", form.additionalInfo);

        if (resumeFile) fd.append("resume_file", resumeFile);
        else if (form.resumeLink) fd.append("resume_url", form.resumeLink);

        if (form.desiredRole) fd.append("desired_role", form.desiredRole);

        return axiosInstance.post(
            "candidate/response/create/",
            fd,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    };

    const handleSuggestSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendResponse(suggestFormData);
            setSuggestStep(4);                    // успех
        } catch (err) {
            console.error(err);
            alert("Не удалось отправить заявку");
        }
    };

    const resetForm = () => {
        setSuggestFormData(blankSuggest);
        setResumeFile(null);
        setFileUploaded(false);
    };

    return (
        <main className="contacts-page__main">
            <div className="contacts-page__container">
                <h1 className="contacts-page__title">Контакты</h1>

                {/* ───────── офис: Екатеринбург ───────── */}
                <div className="contacts-page__offices">
                    <section className="office-section">
                        <h2 className="office-section__city">Екатеринбург</h2>

                        <div className="office-section__content">
                            <div className="office-section__info">
                                <div className="office-info">
                                    <h3 className="office-info__title">Офис</h3>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Адрес:</span>
                                        <span className="office-info__value">
                                            г.&nbsp;Екатеринбург, ул.&nbsp;Малышева, стр.&nbsp;164, оф.&nbsp;406
                                        </span>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Время работы:</span>
                                        <span className="office-info__value">
                                            Пн.&nbsp;-&nbsp;Пт.&nbsp;9:00&nbsp;-&nbsp;18:00<br />
                                            Сб.&nbsp;10:00&nbsp;-&nbsp;17:00<br />
                                            Выходной&nbsp;— Вс.
                                        </span>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Телефон:</span>
                                        <a
                                            href="tel:+73432281642"
                                            className="office-info__value office-info__link"
                                        >
                                            +7&nbsp;343&nbsp;228-16-42
                                        </a>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Почта:</span>
                                        <a
                                            href="mailto:hiring@uetplant.com"
                                            className="office-info__value office-info__link"
                                        >
                                            hiring@uetplant.com
                                        </a>
                                    </div>

                                    <a href="mailto:uet.hiring@test.com" className="office-info__button">Написать нам</a>
                                </div>
                            </div>

                            <div className="office-section__map">
                                <div style={{ position: "relative", overflow: "hidden" }} className="office-map">
                                    <a
                                        href="https://yandex.ru/maps/org/uralenergotel/111731727573/?utm_medium=mapframe&utm_source=maps"
                                        style={{ color: "#eee", fontSize: "12px", position: "absolute", top: 0 }}
                                    >
                                        Уралэнерготел
                                    </a>
                                    <a
                                        href="https://yandex.ru/maps/54/yekaterinburg/category/engineering/184107459/?utm_medium=mapframe&utm_source=maps"
                                        style={{ color: "#eee", fontSize: "12px", position: "absolute", top: 14 }}
                                    >
                                        Инжиниринг в&nbsp;Екатеринбурге
                                    </a>
                                    <a
                                        href="https://yandex.ru/maps/54/yekaterinburg/category/design_institute/184107419/?utm_medium=mapframe&utm_source=maps"
                                        style={{ color: "#eee", fontSize: "12px", position: "absolute", top: 28 }}
                                    >
                                        Проектная организация
                                    </a>
                                    <iframe
                                        src="https://yandex.ru/map-widget/v1/org/uralenergotel/111731727573/gallery/?ll=60.666708%2C56.841330&z=16"
                                        width="100%"
                                        height="400"
                                        frameBorder="1"
                                        allowFullScreen
                                        style={{ position: "relative" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ───────── офис: Москва ───────── */}
                    <section className="office-section">
                        <h2 className="office-section__city">Москва</h2>

                        <div className="office-section__content">
                            <div className="office-section__info">
                                <div className="office-info">
                                    <h3 className="office-info__title">Офис</h3>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Адрес:</span>
                                        <span className="office-info__value">
                                            г.&nbsp;Москва, ул.&nbsp;Жебрунова, 6/1
                                        </span>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Время работы:</span>
                                        <span className="office-info__value">
                                            Пн.&nbsp;-&nbsp;Пт.&nbsp;9:00&nbsp;-&nbsp;18:00<br />
                                            Сб.&nbsp;10:00&nbsp;-&nbsp;17:00<br />
                                            Выходной&nbsp;— Вс.
                                        </span>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Телефон:</span>
                                        <a
                                            href="tel:+74952281642"
                                            className="office-info__value office-info__link"
                                        >
                                            +7&nbsp;495&nbsp;228-16-42
                                        </a>
                                    </div>

                                    <div className="office-info__item">
                                        <span className="office-info__label">Почта:</span>
                                        <a
                                            href="mailto:hiring@uetplant.com"
                                            className="office-info__value office-info__link"
                                        >
                                            hiring@uetplant.com
                                        </a>
                                    </div>

                                    <a href="mailto:uet.hiring@test.com" className="office-info__button">Написать нам</a>
                                </div>
                            </div>

                            <div className="office-section__map">
                                <div style={{ position: "relative", overflow: "hidden" }} className="office-map">
                                    <a
                                        href="https://yandex.ru/maps/213/moscow/?utm_medium=mapframe&utm_source=maps"
                                        style={{ color: "#eee", fontSize: "12px", position: "absolute", top: 0 }}
                                    >
                                        Москва
                                    </a>
                                    <a
                                        href="https://yandex.ru/maps/213/moscow/house/ulitsa_zhebrunova_6s1/Z04YcA9hTkUEQFtvfXt5dXhhYQ==/?ll=37.681703%2C55.784425&utm_medium=mapframe&utm_source=maps&z=16"
                                        style={{ color: "#eee", fontSize: "12px", position: "absolute", top: 14 }}
                                    >
                                        Ул.&nbsp;Жебрунова, 6с1
                                    </a>
                                    <iframe
                                        src="https://yandex.ru/map-widget/v1/?ll=37.681703%2C55.784425&mode=whatshere&whatshere%5Bpoint%5D=37.681703%2C55.784425&whatshere%5Bzoom%5D=17&z=16"
                                        width="100%"
                                        height="400"
                                        frameBorder="1"
                                        allowFullScreen
                                        style={{ position: "relative" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ───────── форма «Предложить кандидатуру» ───────── */}
                <section className="candidate-form-section">
                    <div className="candidate-form">
                        {/* ШАГ 1 */}
                        {suggestStep === 1 && (
                            <div className="candidate-form__step">
                                <h2 className="candidate-form__title">
                                    Предложить кандидатуру
                                </h2>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setSuggestStep(2);
                                    }}
                                >
                                    <div className="candidate-form__container">
                                        <div className="candidate-form__fields">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={suggestFormData.fullName}
                                                onChange={
                                                    handleSuggestFormChange
                                                }
                                                placeholder="Фамилия, имя и отчество"
                                                className="candidate-form__input"
                                                required
                                                maxLength="100"
                                            />
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={suggestFormData.birthDate}
                                                onChange={
                                                    handleSuggestFormChange
                                                }
                                                className="candidate-form__input"
                                                required
                                            />
                                            <div className="candidate-form__input-row">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={suggestFormData.phone}
                                                    onChange={
                                                        handleSuggestFormChange
                                                    }
                                                    placeholder="Номер телефона"
                                                    className="candidate-form__input"
                                                    required
                                                    maxLength="20"
                                                />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={suggestFormData.email}
                                                    onChange={
                                                        handleSuggestFormChange
                                                    }
                                                    placeholder="Электронная почта"
                                                    className="candidate-form__input"
                                                    required
                                                    maxLength="50"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="candidate-form__button"
                                        >
                                            Далее
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ШАГ 2 */}
                        {suggestStep === 2 && (
                            <div className="candidate-form__step">
                                <h2 className="candidate-form__title">
                                    Заявка&nbsp;— шаг&nbsp;2
                                </h2>

                                <form onSubmit={handleSuggestSubmit}>
                                    <div className="candidate-form__container">
                                        <div className="candidate-form__fields">
                                            <input
                                                type="text"
                                                name="desiredRole"
                                                value={
                                                    suggestFormData.desiredRole
                                                }
                                                onChange={
                                                    handleSuggestFormChange
                                                }
                                                placeholder="Желаемая роль"
                                                className="candidate-form__input"
                                                required
                                                maxLength="100"
                                            />
                                            <input
                                                type="text"
                                                name="experience"
                                                value={
                                                    suggestFormData.experience
                                                }
                                                onChange={
                                                    handleSuggestFormChange
                                                }
                                                placeholder="Опыт (лет)"
                                                className="candidate-form__input"
                                                required
                                                maxLength="3"
                                            />

                                            {/* файл / ссылка */}
                                            <div className="candidate-form__upload-container">
                                                <div className="candidate-form__upload-options">
                                                    <label
                                                        className={`candidate-form__upload-button ${fileUploaded
                                                            ? "candidate-form__upload-button--uploaded"
                                                            : ""
                                                            }`}
                                                    >
                                                        <input
                                                            type="file"
                                                            onChange={
                                                                handleFileUpload
                                                            }
                                                            style={{
                                                                display: "none",
                                                            }}
                                                        />
                                                        <span>
                                                            Загрузить резюме
                                                        </span>
                                                        {fileUploaded && (
                                                            <span className="candidate-form__upload-icon">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </label>
                                                    <span className="candidate-form__upload-or">
                                                        или
                                                    </span>
                                                    <input
                                                        type="url"
                                                        name="resumeLink"
                                                        value={
                                                            suggestFormData.resumeLink
                                                        }
                                                        onChange={
                                                            handleSuggestFormChange
                                                        }
                                                        placeholder="Ссылка на резюме"
                                                        className="candidate-form__input candidate-form__input--link"
                                                        maxLength="200"
                                                    />
                                                </div>

                                                <textarea
                                                    name="additionalInfo"
                                                    value={
                                                        suggestFormData.additionalInfo
                                                    }
                                                    onChange={
                                                        handleSuggestFormChange
                                                    }
                                                    placeholder="Дополнительная информация"
                                                    className="candidate-form__textarea"
                                                    maxLength="200"
                                                />
                                            </div>
                                        </div>

                                        <div className="candidate-form__buttons">
                                            <button
                                                type="button"
                                                className="candidate-form__button candidate-form__button--back"
                                                onClick={() =>
                                                    setSuggestStep(1)
                                                }
                                            >
                                                Назад
                                            </button>
                                            <button
                                                type="submit"
                                                className="candidate-form__button candidate-form__button--submit"
                                            >
                                                Отправить
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ШАГ 4 — успех */}
                        {suggestStep === 4 && (
                            <div className="candidate-form__step candidate-form__step--success">
                                <h2 className="candidate-form__title">
                                    Заявка отправлена
                                </h2>
                                <p className="candidate-form__success-message">
                                    Скоро с&nbsp;вами свяжется менеджер
                                </p>
                                <button
                                    className="candidate-form__button"
                                    onClick={() => {
                                        setSuggestStep(1);
                                        resetForm();
                                    }}
                                >
                                    Отправить ещё одну заявку
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ContactsPageMain;
