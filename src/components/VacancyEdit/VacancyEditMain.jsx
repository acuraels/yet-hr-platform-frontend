// src/components/VacancyEditMain/VacancyEditMain.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import axiosInstance from "../../utils/axiosInstance";
import "./VacancyEditMain.css";

/* ──────────────────── константы ──────────────────── */
const ANY_CITY = "Любой город";

const WORK_FORMAT_LABELS = {
    ON_SITE: "Офис",
    REMOTE: "Удалёнка",
    HYBRID: "Гибрид",
    FIELD_WORK: "Разъездная работа",
};
const LABELS_TO_FORMAT = Object.fromEntries(
    Object.entries(WORK_FORMAT_LABELS).map(([k, v]) => [v, k])
);

const EXPERIENCE_OPTIONS = [
    { label: "Нет опыта", value: "noExperience" },
    { label: "1‑3 года", value: "between1and3" },
    { label: "3‑6 лет", value: "between3and6" },
    { label: "6+ лет", value: "moreThan6" }, // будет отправлено как between3and6
];

const SCHEDULE_OPTIONS = [
    { label: "7/0", value: "SEVEN_ON_ZERO_OFF" },
    { label: "5/2", value: "FIVE_ON_TWO_OFF" },
    { label: "2/2", value: "TWO_ON_TWO_OFF" },
];

const HOURS_OPTIONS = [
    { label: "2", value: "HOURS_2" },
    { label: "4", value: "HOURS_4" },
    { label: "6", value: "HOURS_6" },
    { label: "8", value: "HOURS_8" },
];

const STATUS_OPTIONS = [
    { label: "Сохранить", value: "save", bg: "#1BE145", color: "#fff" },
    { label: "Опубликовать", value: "publish", bg: "#196529", color: "#fff" },
    { label: "Архивировать", value: "archive", bg: "#0f3e1a", color: "#fff" },
    { label: "Удалить", value: "delete", bg: "#a52a2a", color: "#fff" },
];

/* ──────────────────── компонент ──────────────────── */
const VacancyEditMain = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    /* ui‑state */
    const [step, setStep] = useState(1);
    const [dropdownOpen, setDrop] = useState(false);
    const [selectedStatus, setStatus] = useState(STATUS_OPTIONS[0]);
    const [loading, setLoading] = useState(true);

    /* поля вакансии */
    const [vacancyName, setVacancyName] = useState("");
    const [shortDescription, setShort] = useState("");
    const [availableLocations, setAvailableLocations] = useState([
        ANY_CITY,
        "Москва",
        "Екатеринбург",
        "Сыктывкар",
    ]);
    const availableFormats = ["Любой", "Офис", "Гибрид", "Удалёнка"];

    const [locations, setLocations] = useState([ANY_CITY]);
    const [formats, setFormats] = useState(["Любой"]);
    const [experience, setExperience] = useState("noExperience");
    const [workSchedule, setWorkSchedule] = useState("SEVEN_ON_ZERO_OFF");
    const [workHours, setWorkHours] = useState("HOURS_8");
    const [salaryFrom, setSalaryFrom] = useState(""); // числа строкой
    const [salaryTo, setSalaryTo] = useState("");

    /* editor */
    const [descrHTML, setDescrHTML] = useState(
        "<p>Опишите вакансию подробно...</p>"
    );
    const editor = useEditor({
        extensions: [StarterKit, LinkExtension.configure({ openOnClick: false })],
        content: descrHTML,
        onUpdate: ({ editor }) => setDescrHTML(editor.getHTML()),
    });
    useEffect(() => () => editor?.destroy(), [editor]);

    /* ───────── загрузка текущих данных ───────── */
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get(`vacancies/${id}`);

                setVacancyName(data.title ?? "");
                setShort(data.short_description ?? "");

                /* areas могут прийти массивом или строкой.
                   убираем undefined/null, если поле отсутствует. */
                let incomingAreas = [];
                if (Array.isArray(data.areas)) incomingAreas = data.areas;
                else if (data.area) incomingAreas = [data.area];

                setLocations(
                    incomingAreas.length ? incomingAreas : [ANY_CITY]
                );

                /* work format */
                setFormats(
                    data.work_formats?.length
                        ? data.work_formats.map((f) => WORK_FORMAT_LABELS[f] || "Любой")
                        : ["Любой"]
                );

                setExperience(data.required_experience || "noExperience");
                setWorkSchedule(data.work_schedule || "SEVEN_ON_ZERO_OFF");
                setWorkHours(data.work_time || "HOURS_8");

                setSalaryFrom(data.salary_from ? String(data.salary_from) : "");
                setSalaryTo(data.salary_to ? String(data.salary_to) : "");

                setDescrHTML(data.description);
                editor?.commands.setContent(data.description);
            } catch (e) {
                console.error("Ошибка загрузки данных:", e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, editor]);

    const buildPayload = () => {
        /* areas: если выбран «Любой город» → backend ждёт пустой массив.
           также удаляем пустые/undefined значения */
        const selectedAreas =
            locations.includes(ANY_CITY) || !locations.length
                ? []
                : locations.filter(Boolean);

        /* work formats: убираем «Любой», мапим в enum */
        const selectedWorkFormats = formats
            .filter((f) => f !== "Любой")
            .map((f) => LABELS_TO_FORMAT[f])
            .filter(Boolean);

        return {
            title: vacancyName,
            short_description: shortDescription,
            description: descrHTML,

            salary_from: salaryFrom ? parseInt(salaryFrom, 10) : null,
            salary_to: salaryTo ? parseInt(salaryTo, 10) : null,

            archived: selectedStatus.value === "archive",

            /* поля, ожидаемые DRF‑серилезатором */
            areas: selectedAreas,
            work_formats: selectedWorkFormats,

            work_time: workHours,
            work_schedule: workSchedule,
            required_experience: experience,
        };
    };

    /* ───────── запросы ───────── */
    const patchVacancy = async (payload) => {
        try {
            await axiosInstance.patch(`manager/vacancies/${id}`, payload);
            navigate("/vacancies-list");
        } catch (e) {
            console.error("PATCH error:", e);
        }
    };

    const deleteVacancy = async () => {
        try {
            await axiosInstance.delete(`manager/vacancies/${id}`);
            navigate("/vacancies-list");
        } catch (e) {
            console.error("DELETE error:", e);
        }
    };

    /* ───────── UI handlers ───────── */
    const chooseStatus = (opt) => {
        setStatus(opt);
        setDrop(false);

        if (opt.value === "save") patchVacancy(buildPayload());
        if (opt.value === "publish") patchVacancy({ archived: false });
        if (opt.value === "archive") patchVacancy({ archived: true });
        if (opt.value === "delete") deleteVacancy();
    };

    const toggleItem = (value, list, setter) =>
        setter(
            list.includes(value) ? list.filter((i) => i !== value) : [...list, value]
        );

    /* ───────── render ───────── */
    if (loading) return <p className="vacancies-loading">Загрузка...</p>;

    return (
        <main className="vacancy-create__main">
            <div className="vacancy-create__container">
                {/* header */}
                <div className="header-row">
                    <h2 className="title">Вакансия</h2>

                    <div className="status-dropdown">
                        <button
                            className="btn-status"
                            style={{
                                background: selectedStatus.bg,
                                color: selectedStatus.color,
                            }}
                            onClick={() => setDrop((o) => !o)}
                        >
                            {selectedStatus.label}{" "}
                            <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
                        </button>

                        {dropdownOpen && (
                            <ul className="status-list">
                                {STATUS_OPTIONS.map((opt) => (
                                    <li
                                        key={opt.value}
                                        className="status-item"
                                        style={{ background: opt.bg, color: opt.color }}
                                        onClick={() => chooseStatus(opt)}
                                    >
                                        {opt.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* ───────── STEP 1 ───────── */}
                {step === 1 && (
                    <>
                        <div className="form-group">
                            <label>Название вакансии</label>
                            <input
                                type="text"
                                value={vacancyName}
                                onChange={(e) => setVacancyName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Краткое описание</label>
                            <input
                                type="text"
                                value={shortDescription}
                                onChange={(e) => setShort(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <span className="subtitle">Фильтры</span>

                            <div className="filters-grid">
                                {/* location */}
                                <div>
                                    <h3 className="filters-grid-name">Местоположение</h3>
                                    {availableLocations.map((loc) => (
                                        <label key={loc} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={locations.includes(loc)}
                                                onChange={() => toggleItem(loc, locations, setLocations)}
                                            />
                                            {loc}
                                        </label>
                                    ))}
                                </div>

                                {/* format */}
                                <div>
                                    <h3 className="filters-grid-name">Формат работы</h3>
                                    {availableFormats.map((fmt) => (
                                        <label key={fmt} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formats.includes(fmt)}
                                                onChange={() => toggleItem(fmt, formats, setFormats)}
                                            />
                                            {fmt}
                                        </label>
                                    ))}
                                </div>

                                {/* experience */}
                                <div className="small-inputs">
                                    <label>Опыт</label>
                                    <select
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        className="select-input"
                                    >
                                        {EXPERIENCE_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* schedule */}
                                <div className="small-inputs">
                                    <label>График</label>
                                    <select
                                        value={workSchedule}
                                        onChange={(e) => setWorkSchedule(e.target.value)}
                                        className="select-input"
                                    >
                                        {SCHEDULE_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* hours */}
                                <div className="small-inputs">
                                    <label>Часов в день</label>
                                    <select
                                        value={workHours}
                                        onChange={(e) => setWorkHours(e.target.value)}
                                        className="select-input"
                                    >
                                        {HOURS_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* salary */}
                                <div className="small-inputs salary-inputs">
                                    <label>Доход, руб.</label>
                                    <div className="salary-pair">
                                        <input
                                            type="number"
                                            min="0"
                                            value={salaryFrom}
                                            onChange={(e) => setSalaryFrom(e.target.value)}
                                            placeholder="от"
                                            className="salary-field"
                                        />
                                        <span className="salary-dash">—</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={salaryTo}
                                            onChange={(e) => setSalaryTo(e.target.value)}
                                            placeholder="до"
                                            className="salary-field"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="buttons">
                            <button
                                className="btn btn-next"
                                onClick={() => setStep(2)}
                            >
                                Далее
                            </button>
                        </div>
                    </>
                )}

                {/* ───────── STEP 2 ───────── */}
                {step === 2 && (
                    <>
                        <div className="form-group">
                            <span className="subtitle">Подробно о вакансии</span>
                        </div>

                        <div className="editor-toolbar">
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                            >
                                Жирный
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                            >
                                Курсив
                            </button>
                            <button
                                onClick={() =>
                                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                                }
                            >
                                Заголовок
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                            >
                                Список
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            >
                                Нумер. список
                            </button>
                            <button
                                onClick={() => {
                                    const url = prompt("Введите URL ссылки");
                                    url &&
                                        editor
                                            .chain()
                                            .focus()
                                            .setLink({ href: url })
                                            .run();
                                }}
                            >
                                Ссылка
                            </button>
                        </div>

                        <EditorContent editor={editor} className="editor-content" />

                        <div className="buttons">
                            <button
                                className="btn btn-back"
                                onClick={() => setStep(1)}
                            >
                                Назад
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default VacancyEditMain;
