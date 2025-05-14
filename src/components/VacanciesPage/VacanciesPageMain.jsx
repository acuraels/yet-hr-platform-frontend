// src/components/VacanciesPageMain/VacanciesPageMain.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./VacanciesPageMain.css";

const WORK_FORMAT_LABELS = {
    ON_SITE: "В офисе",
    REMOTE: "Удалённо",
    HYBRID: "Гибрид",
    FIELD_WORK: "Разъездная работа",
};

const LOCATION_OPTIONS = ["Москва", "Екатеринбург", "Сыктывкар"];
const FORMAT_OPTIONS = [
    { code: "ON_SITE", label: "Офис" },
    { code: "HYBRID", label: "Гибрид" },
    { code: "REMOTE", label: "Удалёнка" },
];

const VacanciesPageMain = () => {
    /* ---------- state ---------- */
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [locFilter, setLocFilter] = useState({ any: true, selected: [] });
    const [fmtFilter, setFmtFilter] = useState({ any: true, selected: [] });

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 4;

    /* ---------- модалки ---------- */
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
    const [applyStep, setApplyStep] = useState(1);
    const [suggestStep, setSuggestStep] = useState(1);
    const [currentVacancy, setCurrentVacancy] = useState(null);

    /* ---------- файл ---------- */
    const [resumeFile, setResumeFile] = useState(null);
    const [fileUploaded, setFileUploaded] = useState(false);

    /* ---------- формы ---------- */
    const blankApply = {
        fullName: "",
        birthDate: "",
        phone: "",
        email: "",
        experience: "",
        resumeLink: "",
        additionalInfo: "",
    };
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

    const [applyForm, setApplyForm] = useState(blankApply);
    const [suggestForm, setSuggestForm] = useState(blankSuggest);

    /* ---------- вакансии ---------- */
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axiosInstance.get("vacancies/?archived=false");
                setVacancies(
                    data.map((v) => ({
                        id: v.id,
                        title: v.title,
                        description: v.short_description,
                        locations: (v.areas || []).map((a) =>
                            typeof a === "string" ? a : a?.name || a?.title || ""
                        ),
                        work_formats: v.work_formats || [],
                        salary:
                            v.salary_from && v.salary_to
                                ? Math.floor((v.salary_from + v.salary_to) / 2).toLocaleString("ru-RU")
                                : (v.salary_from || v.salary_to || null)?.toLocaleString("ru-RU"),
                    }))
                );
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* ---------- фильтры ---------- */
    const toggleLoc = (city) => {
        if (city === "any") {
            setLocFilter({ any: true, selected: [] });
        } else {
            const sel = locFilter.selected.includes(city)
                ? locFilter.selected.filter((c) => c !== city)
                : [...locFilter.selected, city];
            setLocFilter({ any: sel.length === 0, selected: sel });
        }
        setCurrentPage(1);
    };

    const toggleFmt = (code) => {
        if (code === "any") {
            setFmtFilter({ any: true, selected: [] });
        } else {
            const sel = fmtFilter.selected.includes(code)
                ? fmtFilter.selected.filter((c) => c !== code)
                : [...fmtFilter.selected, code];
            setFmtFilter({ any: sel.length === 0, selected: sel });
        }
        setCurrentPage(1);
    };

    const filteredVacancies = vacancies.filter((v) => {
        const okLoc =
            locFilter.any || v.locations.some((c) => locFilter.selected.includes(c));
        const okFmt =
            fmtFilter.any || v.work_formats.some((f) => fmtFilter.selected.includes(f));
        return okLoc && okFmt;
    });

    const totalPages = Math.max(1, Math.ceil(filteredVacancies.length / perPage));
    const shownVacancies = filteredVacancies.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    /* ---------- файл ---------- */
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0] || null;
        setResumeFile(file);
        setFileUploaded(!!file);
    };

    /* ---------- helpers ---------- */
    const sendResponse = async (form, vacancyId = null) => {
        const fd = new FormData();
        fd.append("name", form.fullName);
        fd.append("birth_date", form.birthDate);
        fd.append("phone", form.phone);
        fd.append("email", form.email);
        fd.append("experience", form.experience);
        fd.append("letter", form.additionalInfo);
        if (vacancyId) fd.append("vacancy_id", vacancyId);
        if (resumeFile) fd.append("resume_file", resumeFile);
        else if (form.resumeLink) fd.append("resume_url", form.resumeLink);
        if (form.desiredRole) fd.append("desired_role", form.desiredRole);

        return axiosInstance.post(
            "candidate/response/create/",
            fd,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    };

    /* ---------- submit ---------- */
    const handleApplySubmit = async (e) => {
        e.preventDefault();
        try {
            await sendResponse(applyForm, currentVacancy.id);
            setApplyStep(3);
        } catch (e) {
            console.error(e);
            alert("Не удалось отправить заявку");
        }
    };

    const handleSuggestSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendResponse(suggestForm);
            setSuggestStep(4);
        } catch (e) {
            console.error(e);
            alert("Не удалось отправить заявку");
        }
    };

    /* ---------- onChange helpers ---------- */
    const onApplyChange = ({ target: { name, value } }) =>
        setApplyForm((prev) => ({ ...prev, [name]: value }));

    const onSuggestChange = ({ target: { name, value } }) =>
        setSuggestForm((prev) => ({ ...prev, [name]: value }));

    /* ---------- open / close ---------- */
    const openApplyModal = (v) => {
        setCurrentVacancy(v);
        setApplyStep(1);
        setIsApplyModalOpen(true);
        setResumeFile(null);
        setFileUploaded(false);
    };
    const closeApplyModal = () => {
        setIsApplyModalOpen(false);
        setApplyForm(blankApply);
        setResumeFile(null);
        setFileUploaded(false);
    };

    const openSuggestModal = () => {
        setSuggestStep(1);
        setIsSuggestModalOpen(true);
        setResumeFile(null);
        setFileUploaded(false);
    };
    const closeSuggestModal = () => {
        setIsSuggestModalOpen(false);
        setSuggestForm(blankSuggest);
        setResumeFile(null);
        setFileUploaded(false);
    };

    /* ---------- JSX ---------- */
    return (
        <main className="vacancies-page__main">
            <div className="vacancies-page__main-container">
                <h1 className="vacancies-page__title">Вакансии</h1>
                <div className="vacancies-page__content">
                    {/* ---------- список вакансий ---------- */}
                    <div className="vacancies-page__list">
                        {loading && <p className="vacancies-loading">Загрузка…</p>}

                        {!loading &&
                            shownVacancies.map((vacancy) => (
                                <Link
                                    key={vacancy.id}
                                    to={`/vacancies/${vacancy.id}`}
                                    className="vacancy-card"
                                >
                                    <div className="vacancy-card__content">
                                        <div className="vacancy-card__tags">
                                            {vacancy.locations[0] && (
                                                <span className="vacancy-card__tag">
                                                    г.&nbsp;{vacancy.locations[0]}
                                                </span>
                                            )}
                                            {vacancy.work_formats.map((c) => (
                                                <span key={c} className="vacancy-card__tag">
                                                    {WORK_FORMAT_LABELS[c] ?? c}
                                                </span>
                                            ))}
                                        </div>
                                        <h2 className="vacancy-card__title">{vacancy.title}</h2>
                                        <p className="vacancy-card__description">
                                            {vacancy.description}
                                        </p>
                                        <div className="vacancy-card__footer">
                                            <button
                                                className="vacancy-card__button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    openApplyModal(vacancy);
                                                }}
                                            >
                                                Откликнуться
                                            </button>
                                            {vacancy.salary && (
                                                <span className="vacancy-card__salary">
                                                    В среднем {vacancy.salary}&nbsp;₽
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}

                        {/* ---------- пагинация ---------- */}
                        {!loading && (
                            <div className="pagination">
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={currentPage === 1}
                                    className="pagination__button"
                                >
                                    &lt;
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (p) => (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`pagination__button ${currentPage === p ? "pagination__button--active" : ""
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="pagination__button"
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ---------- сайдбар ---------- */}
                    <div className="vacancies-page__sidebar">
                        {/* фильтры */}
                        <div className="filters">
                            <h2 className="filters__title">Фильтры</h2>

                            <div className="filters__group">
                                <h3 className="filters__group-title">Местоположение</h3>
                                <div className="filters__options">
                                    <label className="filters__option">
                                        <input
                                            type="checkbox"
                                            checked={locFilter.any}
                                            onChange={() => toggleLoc("any")}
                                        />
                                        <span>Любой город</span>
                                    </label>
                                    {LOCATION_OPTIONS.map((city) => (
                                        <label key={city} className="filters__option">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    !locFilter.any && locFilter.selected.includes(city)
                                                }
                                                onChange={() => toggleLoc(city)}
                                            />
                                            <span>{city}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filters__group">
                                <h3 className="filters__group-title">Формат работы</h3>
                                <div className="filters__options">
                                    <label className="filters__option">
                                        <input
                                            type="checkbox"
                                            checked={fmtFilter.any}
                                            onChange={() => toggleFmt("any")}
                                        />
                                        <span>Любой</span>
                                    </label>
                                    {FORMAT_OPTIONS.map(({ code, label }) => (
                                        <label key={code} className="filters__option">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    !fmtFilter.any && fmtFilter.selected.includes(code)
                                                }
                                                onChange={() => toggleFmt(code)}
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="cta-block">
                            <p className="cta-block__text">
                                Не нашли подходящей <br /> вакансии?
                            </p>
                            <button className="cta-block__button" onClick={openSuggestModal}>
                                Рассказать о себе
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- модалка Откликнуться ---------- */}
            {isApplyModalOpen && (
                <div className="modal">
                    <div className="modal__overlay" onClick={closeApplyModal} />
                    <div className="modal__content">
                        {applyStep === 1 && (
                            <div className="modal__step">
                                <h2 className="modal__title">Откликнуться на вакансию</h2>
                                <p className="modal__vacancy-title">
                                    {currentVacancy?.title}
                                </p>
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
                                                value={applyForm.fullName}
                                                onChange={onApplyChange}
                                                placeholder="Фамилия, имя и отчество"
                                                className="modal__input"
                                                required
                                            />
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={applyForm.birthDate}
                                                onChange={onApplyChange}
                                                className="modal__input"
                                                required
                                            />
                                            <div className="modal__input-row">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={applyForm.phone}
                                                    onChange={onApplyChange}
                                                    placeholder="Номер телефона"
                                                    className="modal__input"
                                                    required
                                                />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={applyForm.email}
                                                    onChange={onApplyChange}
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
                                <h2 className="modal__title">Заявка — шаг 2</h2>
                                <form onSubmit={handleApplySubmit}>
                                    <div className="modal__form-container">
                                        <h3 className="modal__form-title">Заполните информацию</h3>
                                        <div className="modal__form-fields">
                                            <input
                                                type="text"
                                                name="experience"
                                                value={applyForm.experience}
                                                onChange={onApplyChange}
                                                placeholder="Опыт (лет)"
                                                className="modal__input"
                                                required
                                            />

                                            {/* файл / ссылка */}
                                            <div className="modal__upload-container">
                                                <div className="modal__upload-options">
                                                    <label
                                                        className={`modal__upload-button ${fileUploaded ? "modal__upload-button--uploaded" : ""
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
                                                        value={applyForm.resumeLink}
                                                        onChange={onApplyChange}
                                                        placeholder="Ссылка на резюме"
                                                        className="modal__input modal__input--link"
                                                    />
                                                </div>
                                                <textarea
                                                    name="additionalInfo"
                                                    value={applyForm.additionalInfo}
                                                    onChange={onApplyChange}
                                                    placeholder="Дополнительная информация"
                                                    className="modal__textarea"
                                                />
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
                                    Скоро с вами свяжется менеджер
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

            {/* ---------- модалка Рассказать о себе ---------- */}
            {isSuggestModalOpen && (
                <div className="modal">
                    <div className="modal__overlay" onClick={closeSuggestModal} />
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
                                                value={suggestForm.fullName}
                                                onChange={onSuggestChange}
                                                placeholder="Фамилия, имя и отчество"
                                                className="modal__input"
                                                required
                                            />
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={suggestForm.birthDate}
                                                onChange={onSuggestChange}
                                                className="modal__input"
                                                required
                                            />
                                            <div className="modal__input-row">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={suggestForm.phone}
                                                    onChange={onSuggestChange}
                                                    placeholder="Номер телефона"
                                                    className="modal__input"
                                                    required
                                                />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={suggestForm.email}
                                                    onChange={onSuggestChange}
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
                                <h2 className="modal__title">Заявка — шаг 2</h2>
                                <form onSubmit={handleSuggestSubmit}>
                                    <div className="modal__form-container">
                                        <h3 className="modal__form-title">Заполните информацию</h3>
                                        <div className="modal__form-fields">
                                            <input
                                                type="text"
                                                name="desiredRole"
                                                value={suggestForm.desiredRole}
                                                onChange={onSuggestChange}
                                                placeholder="Желаемая роль"
                                                className="modal__input"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="experience"
                                                value={suggestForm.experience}
                                                onChange={onSuggestChange}
                                                placeholder="Опыт (лет)"
                                                className="modal__input"
                                                required
                                            />

                                            {/* файл / ссылка */}
                                            <div className="modal__upload-container">
                                                <div className="modal__upload-options">
                                                    <label
                                                        className={`modal__upload-button ${fileUploaded ? "modal__upload-button--uploaded" : ""
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
                                                        value={suggestForm.resumeLink}
                                                        onChange={onSuggestChange}
                                                        placeholder="Ссылка на резюме"
                                                        className="modal__input modal__input--link"
                                                    />
                                                </div>
                                                <textarea
                                                    name="additionalInfo"
                                                    value={suggestForm.additionalInfo}
                                                    onChange={onSuggestChange}
                                                    placeholder="Дополнительная информация"
                                                    className="modal__textarea"
                                                />
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
                                    Скоро с вами свяжется менеджер
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

export default VacanciesPageMain;

