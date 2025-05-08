// src/components/VacancyCreateMain/VacancyCreateMain.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import axiosInstance from "../../utils/axiosInstance";
import "./VacancyCreateMain.css";

/* enum‑метки ↔︎ код бэка */
const WORK_FORMAT_LABELS = { ON_SITE: "Офис", REMOTE: "Удаленка", HYBRID: "Гибрид" };
const EXPERIENCE_OPTIONS = [
    { label: "Нет опыта", value: "noExperience" },
    { label: "1‑3 года", value: "between1and3" },
    { label: "3‑6 лет", value: "between3and6" },
    { label: "6+ лет", value: "moreThan6" },          // отправим как between3and6
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

const VacancyCreateMain = () => {
    const [step, setStep] = useState(1);
    const [showModal, setShowModal] = useState(false);

    /* Шаг 1: базовые данные */
    const [vacancyName, setVacancyName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const availableLocations = ["Любой город", "Москва", "Екатеринбург", "Сыктывкар"];
    const availableFormats = ["Любой", "Офис", "Гибрид", "Удаленка"];
    const [locations, setLocations] = useState(["Любой город"]);
    const [formats, setFormats] = useState(["Любой"]);

    const [experience, setExperience] = useState("noExperience");
    const [workSchedule, setWorkSchedule] = useState("SEVEN_ON_ZERO_OFF");
    const [workHours, setWorkHours] = useState("HOURS_8");

    const [salaryFrom, setSalaryFrom] = useState("");
    const [salaryTo, setSalaryTo] = useState("");

    /* Шаг 2: описание */
    const [descrHTML, setDescrHTML] = useState("<p>Опишите вакансию подробно...</p>");
    const editor = useEditor({
        extensions: [StarterKit, LinkExtension.configure({ openOnClick: false })],
        content: descrHTML,
        onUpdate: ({ editor }) => setDescrHTML(editor.getHTML()),
    });
    useEffect(() => () => editor?.destroy(), [editor]);

    /* helpers */
    const toggle = (v, list, setList) =>
        setList(list.includes(v) ? list.filter(i => i !== v) : [...list, v]);

    const buildPayload = () => {
        const work_formats = formats
            .filter(f => f !== "Любой")
            .map(f => {
                if (f === "Офис") return "ON_SITE";
                if (f === "Удаленка") return "REMOTE";
                if (f === "Гибрид") return "HYBRID";
                return null;
            }).filter(Boolean);

        return {
            title: vacancyName,
            short_description: shortDescription,
            description: descrHTML,
            areas: locations.filter(l => l !== "Любой город"),
            salary_from: salaryFrom ? parseInt(salaryFrom, 10) : null,
            salary_to: salaryTo ? parseInt(salaryTo, 10) : null,
            address_raw: locations[0],
            archived: false,
            work_formats,
            work_time: workHours,
            work_schedule: workSchedule,
            required_experience: experience,
        };
    };

    const handlePublish = async () => {
        try {
            await axiosInstance.post("manager/vacancies/create", buildPayload());
            setShowModal(true);
        } catch (e) { console.error("Ошибка публикации:", e); }
    };

    /* ───────────── JSX ───────────── */
    return (
        <main className="vacancy-create__main">
            <div className="vacancy-create__container">
                <h2 className="title">Вакансия</h2>

                {/* -------- Шаг 1 -------- */}
                {step === 1 && (
                    <>
                        <div className="form-group">
                            <label>Название вакансии</label>
                            <input type="text" value={vacancyName}
                                onChange={e => setVacancyName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Краткое описание</label>
                            <input type="text" value={shortDescription}
                                onChange={e => setShortDescription(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <span className="subtitle">Фильтры</span>
                            <div className="filters-grid">
                                {/* location */}
                                <div>
                                    <h3 className="filters-grid-name">Местоположение</h3>
                                    {availableLocations.map(loc => (
                                        <label key={loc} className="checkbox-label">
                                            <input type="checkbox"
                                                checked={locations.includes(loc)}
                                                onChange={() => toggle(loc, locations, setLocations)} />
                                            {loc}
                                        </label>
                                    ))}
                                </div>
                                {/* format */}
                                <div>
                                    <h3 className="filters-grid-name">Формат работы</h3>
                                    {availableFormats.map(fmt => (
                                        <label key={fmt} className="checkbox-label">
                                            <input type="checkbox"
                                                checked={formats.includes(fmt)}
                                                onChange={() => toggle(fmt, formats, setFormats)} />
                                            {fmt}
                                        </label>
                                    ))}
                                </div>
                                {/* experience */}
                                <div className="small-inputs">
                                    <label>Опыт</label>
                                    <select value={experience}
                                        onChange={e => setExperience(e.target.value)}
                                        className="select-input">
                                        {EXPERIENCE_OPTIONS.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* schedule */}
                                <div className="small-inputs">
                                    <label>График</label>
                                    <select value={workSchedule}
                                        onChange={e => setWorkSchedule(e.target.value)}
                                        className="select-input">
                                        {SCHEDULE_OPTIONS.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* hours */}
                                <div className="small-inputs">
                                    <label>Часов в день</label>
                                    <select value={workHours}
                                        onChange={e => setWorkHours(e.target.value)}
                                        className="select-input">
                                        {HOURS_OPTIONS.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* salary */}
                                <div className="small-inputs salary-inputs">
                                    <label>Доход, руб.</label>
                                    <div className="salary-pair">
                                        <input type="number" min="0"
                                            value={salaryFrom}
                                            onChange={e => setSalaryFrom(e.target.value)}
                                            placeholder="от"
                                            className="salary-field" />
                                        <span className="salary-dash">—</span>
                                        <input type="number" min="0"
                                            value={salaryTo}
                                            onChange={e => setSalaryTo(e.target.value)}
                                            placeholder="до"
                                            className="salary-field" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="buttons">
                            <button className="btn btn-next" onClick={() => setStep(2)}>
                                Далее
                            </button>
                        </div>
                    </>
                )}

                {/* -------- Шаг 2 -------- */}
                {step === 2 && (
                    <>
                        <div className="form-group">
                            <span className="subtitle">Подробно о вакансии</span>
                        </div>
                        <div className="editor-toolbar">
                            <button onClick={() => editor.chain().focus().toggleBold().run()}>Жирный</button>
                            <button onClick={() => editor.chain().focus().toggleItalic().run()}>Курсив</button>
                            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>Заголовок</button>
                            <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Список</button>
                            <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Нумерован. список</button>
                            <button onClick={() => {
                                const url = prompt("Введите URL ссылки");
                                url && editor.chain().focus().setLink({ href: url }).run();
                            }}>Ссылка</button>
                        </div>
                        <EditorContent editor={editor} className="editor-content" />

                        <div className="buttons">
                            <button className="btn btn-back" onClick={() => setStep(1)}>
                                Назад
                            </button>
                            <button className="btn btn-publish" onClick={handlePublish}>
                                Публиковать
                            </button>
                        </div>
                    </>
                )}

                {/* модалка */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-window">
                            <p>Вакансия опубликована</p>
                            <Link to="/vacancies-list" className="btn btn-next"
                                onClick={() => setShowModal(false)}>
                                Окей
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default VacancyCreateMain;
