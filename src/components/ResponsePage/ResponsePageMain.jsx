// frontend/src/pages/ResponsePageMain.jsx
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import fileDownload from "js-file-download";
import { toast } from "react-hot-toast";
import "./ResponsePageMain.css";

// label maps --------------------------------------------------
const workFormatLabels = {
    ON_SITE: "Офис",
    REMOTE: "Удалённо",
    HYBRID: "Гибрид",
    FIELD_WORK: "Разъездная работа",
};

const statusOptions = [
    { value: "NOT_VIEWED", label: "не разобран", className: "response-page__status-option--not-sorted" },
    { value: "REJECTED", label: "отклонён", className: "response-page__status-option--rejected" },
    { value: "APPROVED", label: "одобрен", className: "response-page__status-option--approved" },
    { value: "INTERVIEW_CONFIRMED", label: "назначена встреча", className: "response-page__status-option--meeting" },
    { value: "CLOSED", label: "архивировано", className: "response-page__status-option--archived" },
];

// helpers -----------------------------------------------------
const calcAge = (d) => {
    const bd = new Date(d);
    const now = new Date();
    let a = now.getFullYear() - bd.getFullYear();
    const m = now.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) a--;
    return a;
};

const clean = (val) => (val ? val.trim() : "");

const ResponsePageMain = () => {
    // ---------- routing ----------
    const { id } = useParams();
    const navigate = useNavigate();
    const { search } = useLocation();
    const returnTab = new URLSearchParams(search).get("tab") || "not-sorted";

    // ---------- state ----------
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusOpen, setStatusOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [originalStatus, setOriginalStatus] = useState("");

    // ---------- adapt dto → ui ----------
    const adapt = (data) => {
        const position = clean(data.desired_role) || clean(data.vacancy?.title) || "Не указана должность";
        const description = clean(data.letter);
        const tags = [
            ...(data.vacancy?.areas || []),
            ...(data.vacancy?.work_formats?.map((w) => workFormatLabels[w] || w) || []),
        ];
        return {
            ...data,
            position,
            description,
            resumeLink: data.resume_file || data.resume_url || "#", // file has приоритет
            tags,
            candidateExperience: data.experience === 0 ? "Без опыта" : `${data.experience} лет`,
            time: new Date(data.created_at).toLocaleTimeString(),
            date: new Date(data.created_at).toLocaleDateString(),
            age: calcAge(data.birth_date),
        };
    };

    // ---------- fetch ----------
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get(`candidate/response/${id}`);
                const c = adapt(data);
                setCandidate(c);
                setSelectedStatus(data.status);
                setOriginalStatus(data.status);
                setNotes(data.notes || "");
            } catch (e) {
                toast.error("Не удалось загрузить отклик");
                setCandidate(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // ---------- actions ----------
    const save = async () => {
        try {
            await axiosInstance.patch(`candidate/response/${id}`, { status: selectedStatus, notes });
            toast.success("Сохранено 👍");
            const backTab = selectedStatus !== originalStatus ? selectedStatus : returnTab;
            navigate(`/vacancies-responses?tab=${backTab}`);
        } catch (e) {
            toast.error("Ошибка сохранения");
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(candidate.resumeLink);
            toast.success("Ссылка скопирована в буфер📋");
        } catch {
            toast.error("Не удалось скопировать ссылку");
        }
    };

    const downloadResume = async () => {
        try {
            const res = await axiosInstance.get(candidate.resumeLink, { responseType: "blob" });
            const filename = decodeURIComponent(candidate.resumeLink.split("/").pop());
            fileDownload(res.data, filename);
            toast.success("Резюме скачано⬇️");
        } catch (e) {
            toast.error("Ошибка скачивания резюме");
        }
    };

    // ---------- ui helpers ----------
    const statusName = (v) => statusOptions.find((o) => o.value === v)?.label || "не разобран";
    const statusClass = (v) => statusOptions.find((o) => o.value === v)?.className || "";

    // ---------- render ----------
    if (loading) return <div className="response-page__loading">Загрузка…</div>;
    if (!candidate) return <div className="response-page__error">Отклик не найден</div>;

    return (
        <main className="response-page__main">
            <div className="response-page__container">
                <Link to={`/vacancies-responses?tab=${returnTab}`} className="response-page__back-link">
                    ←
                </Link>

                {/* header */}
                <div className="response-page__header">
                    <div className="response-page__meta">
                        <div className="response-page__tags">
                            {candidate.tags.map((t, i) => (
                                <span key={i} className="response-page__tag">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <h1 className="response-page__title">{candidate.position}</h1>
                        <p className="response-page__description">{candidate.description}</p>
                    </div>

                    <div className="response-page__datetime">
                        <span>Отклик в</span>
                        <div className="response-page__time-date">
                            <span className="response-page__time">{candidate.time}</span>
                            <span className="response-page__date">{candidate.date}</span>
                        </div>
                    </div>
                </div>

                {/* content */}
                <div className="response-page__content">
                    {/* left column */}
                    <div className="response-page__left-column">
                        <div className="response-page__candidate-info">
                            <h2 className="response-page__candidate-name">
                                {candidate.name}, {candidate.age} лет
                            </h2>
                            <p className="response-page__candidate-email">{candidate.email}</p>
                            <p className="response-page__candidate-phone">{candidate.phone}</p>
                            <p
                                className={`response-page__candidate-experience ${candidate.candidateExperience === "Без опыта" ? "response-page__candidate-experience--none" : ""
                                    }`}
                            >
                                {candidate.candidateExperience}
                            </p>
                        </div>

                        <div className="response-page__resume-actions">
                            <button onClick={downloadResume} className="response-page__download-button">
                                Скачать резюме
                            </button>
                            <button onClick={copyLink} className="response-page__resume-link">
                                Копировать ссылку
                            </button>
                        </div>

                        {!!candidate.additionalInfo && (
                            <div className="response-page__additional-info">
                                <h3 className="response-page__section-title">Дополнение</h3>
                                <p className="response-page__additional-text">{candidate.additionalInfo}</p>
                            </div>
                        )}
                    </div>

                    {/* right column */}
                    <div className="response-page__right-column">
                        {/* status */}
                        <div className="response-page__status-section">
                            <h3 className="response-page__section-title">Статус</h3>
                            <div className="response-page__status-dropdown">
                                <button
                                    className={`response-page__status-button ${statusClass(selectedStatus)}`}
                                    onClick={() => setStatusOpen((o) => !o)}
                                >
                                    {statusName(selectedStatus)} <span className="response-page__dropdown-arrow">▼</span>
                                </button>

                                {statusOpen && (
                                    <div className="response-page__status-options">
                                        {statusOptions.map((o) => (
                                            <button
                                                key={o.value}
                                                className={`response-page__status-option ${o.className}`}
                                                onClick={() => {
                                                    setSelectedStatus(o.value);
                                                    setStatusOpen(false);
                                                }}
                                            >
                                                {o.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* notes */}
                        <div className="response-page__notes-section">
                            <h3 className="response-page__section-title">Заметка</h3>
                            <textarea
                                className="response-page__notes-textarea"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Добавьте заметку о кандидате…"
                            />
                        </div>

                        <button className="response-page__save-button" onClick={save}>
                            сохранить
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ResponsePageMain;