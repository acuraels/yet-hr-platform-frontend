import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import DOMPurify from 'dompurify';
import './VacancieLookPageMain.css';

// Мапы для нормальных подписей
const workFormatLabels = {
    ON_SITE: "Офис",
    REMOTE: "Удалённо",
    HYBRID: "Гибрид",
    FIELD_WORK: "Разъездная работа",
};

const expLabels = {
    noExperience: "Без опыта",
    between1and3: "От 1 до 3 лет",
    between3and6: "От 3 до 6 лет",
    moreThan6: "Более 6 лет",
};

const scheduleLabels = {
    FIVE_ON_TWO_OFF: "Пятидневка (5/2)",
    TWO_ON_TWO_OFF: "Два через два (2/2)",
    SHIFT: "Сменный график",
    FLEXIBLE: "Гибкий график",
};

const VacancieLookPageMain = () => {
    const { id } = useParams();

    // ================= vacancy =================
    const [currentVacancy, setCurrentVacancy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get(
                    `user/vacancy/${id}/`,
                    { signal: controller.signal },
                );
                setCurrentVacancy(data);
                setError(null);
            } catch (err) {
                if (axiosInstance.isCancel?.(err)) return;
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [id]);

    // ================= modal =================
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [applyStep, setApplyStep] = useState(1);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);

    const [applyForm, setApplyForm] = useState({
        name: '',
        birth_date: '',
        phone: '',
        email: '',
        experience: '',
        resume_url: '',
        notes: '',
    });

    // ---------- helpers ----------
    const formatSalary = (from, to) => {
        if (from && to) return `${Math.round((from + to) / 2).toLocaleString('ru-RU')} ₽`;
        if (from) return `от ${from.toLocaleString('ru-RU')} ₽`;
        if (to) return `до ${to.toLocaleString('ru-RU')} ₽`;
        return 'не указана';
    };

    // ---------- handlers ----------
    const onApplyChange = (e) => {
        const { name, value } = e.target;
        setApplyForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e) => {
        if (e.target.files?.length) {
            setResumeFile(e.target.files[0]);
            setFileUploaded(true);
        }
    };

    const openApplyModal = () => {
        setApplyStep(1);
        setIsApplyModalOpen(true);
        setFileUploaded(false);
        setResumeFile(null);
    };

    const closeApplyModal = () => {
        setIsApplyModalOpen(false);
        setApplyForm({
            name: '',
            birth_date: '',
            phone: '',
            email: '',
            experience: '',
            resume_url: '',
            notes: '',
        });
    };

    const handleApplySubmit = useCallback(
        async (e) => {
            e.preventDefault();

            const formData = new FormData();
            Object.entries(applyForm).forEach(([k, v]) => formData.append(k, v));
            if (resumeFile) formData.append('resume_file', resumeFile);
            // Прокидываем id вакансии
            formData.append('vacancy_id', id);

            try {
                await axiosInstance.post(
                    `candidate/response/create/`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } },
                );
                setApplyStep(3);
            } catch (err) {
                alert(err.response?.data?.detail || err.message);
            }
        },
        [applyForm, resumeFile, id],
    );

    // ================= render =================
    if (loading) return <p className="vacancy-look-page__loading">Загружаем…</p>;
    if (error) return <p className="vacancy-look-page__error">{error}</p>;
    if (!currentVacancy) return null;

    const {
        title,
        description,
        published_at,
        address_raw,
        work_formats,
        work_schedule,
        work_time,
        required_experience,
        salary_from,
        salary_to,
    } = currentVacancy;

    return (
        <main className="vacancy-look-page__main">
            <div className="vacancy-look-page__container">
                {/* ---------- header ---------- */}
                <header className="vacancy-look-page__header">
                    <h1 className="vacancy-look-page__title">Вакансия</h1>
                    <Link to="/vacancies" className="vacancy-look-page__back-link">
                        <span className="vacancy-look-page__back-arrow">←</span> К вакансиям
                    </Link>
                </header>

                {/* ---------- vacancy ---------- */}
                <article className="vacancy-look-page__article">
                    <div className="vacancy-look-page__meta">
                        <time className="vacancy-look-page__date">
                            {new Date(published_at).toLocaleDateString('ru-RU', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </time>
                    </div>

                    <h2 className="vacancy-look-page__vacancy-title">{title}</h2>

                    <div className="vacancy-look-page__details">
                        <p className="vacancy-look-page__salary">
                            В среднем {formatSalary(salary_from, salary_to)}
                        </p>
                        <ul className="vacancy-look-page__info-list">
                            <li className="vacancy-look-page__info-item">— Место: {address_raw}</li>
                            {work_formats?.length > 0 && (
                                <li className="vacancy-look-page__info-item">
                                    — Формат: {work_formats.map(wf => workFormatLabels[wf] || wf).join(', ')}
                                </li>
                            )}
                            {work_schedule && (
                                <li className="vacancy-look-page__info-item">
                                    — Расписание: {scheduleLabels[work_schedule] || work_schedule}
                                </li>
                            )}
                            {work_time && (
                                <li className="vacancy-look-page__info-item">
                                    — Время: {work_time}
                                </li>
                            )}
                            {required_experience && (
                                <li className="vacancy-look-page__info-item">
                                    — Опыт: {expLabels[required_experience] || required_experience}
                                </li>
                            )}
                        </ul>

                        <button
                            className="vacancy-look-page__apply-button"
                            onClick={openApplyModal}
                        >
                            Откликнуться
                        </button>
                    </div>

                    <div className="vacancy-look-page__content">
                        <div
                            className="vacancy-look-page__description"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
                        />
                    </div>
                </article>

                {/* ---------- footer ---------- */}
                <div className="vacancy-look-page__footer">
                    <Link to="/vacancies" className="vacancy-look-page__back-link">
                        <span className="vacancy-look-page__back-arrow">←</span> К вакансиям
                    </Link>
                </div>
            </div>

            {/* ================= modal ================= */}
            {isApplyModalOpen && (
                <div className="modal">
                    <div className="modal__overlay" onClick={closeApplyModal} />
                    <div className="modal__content">
                        {/* ---------- step 1 ---------- */}
                        {applyStep === 1 && (
                            <div className="modal__step">
                                <h2 className="modal__title">Откликнуться на вакансию</h2>
                                <p className="modal__vacancy-title">{currentVacancy.title}</p>
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
                                                name="name"
                                                value={applyForm.name}
                                                onChange={onApplyChange}
                                                placeholder="Фамилия, имя и отчество"
                                                className="modal__input"
                                                required
                                            />
                                            <input
                                                type="date"
                                                name="birth_date"
                                                value={applyForm.birth_date}
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

                        {/* ---------- step 2 ---------- */}
                        {applyStep === 2 && (
                            <div className="modal__step">
                                <h2 className="modal__title">Заявка — шаг 2</h2>
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
                                            <div className="modal__upload-container">
                                                <div className="modal__upload-options">
                                                    <label
                                                        className={`modal__upload-button ${fileUploaded
                                                            ? 'modal__upload-button--uploaded'
                                                            : ''
                                                            }`}
                                                    >
                                                        <input
                                                            type="file"
                                                            onChange={handleFileUpload}
                                                            style={{ display: 'none' }}
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
                                                        value={applyForm.resume_url}
                                                        onChange={onApplyChange}
                                                        placeholder="Ссылка на резюме"
                                                        className="modal__input modal__input--link"
                                                    />
                                                </div>
                                                <textarea
                                                    name="notes"
                                                    value={applyForm.notes}
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

                        {/* ---------- success ---------- */}
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
        </main>
    );
};

export default VacancieLookPageMain;
