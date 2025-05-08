// src/components/VacanciesListMain/VacanciesListMain.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./VacanciesListMain.css";

const WORK_FORMAT_LABELS = {
    ON_SITE: "В офисе",
    REMOTE: "Удаленно",
    HYBRID: "Гибрид",
    FIELD_WORK: "Разъездная работа",
};

const LOCATION_OPTIONS = ["Москва", "Екатеринбург", "Сыктывкар"];
const FORMAT_OPTIONS = [
    { code: "ON_SITE", label: "Офис" },
    { code: "HYBRID", label: "Гибрид" },
    { code: "REMOTE", label: "Удалёнка" },
];

const VacanciesListMain = () => {
    /* -------- стейты -------- */
    const [isArchive, setIsArchive] = useState(false);
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [locFilter, setLocFilter] = useState({ any: true, selected: [] });
    const [fmtFilter, setFmtFilter] = useState({ any: true, selected: [] });

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 4;

    /* ===== загрузка ===== */
    useEffect(() => {
        console.group("fetchVacancies");
        setLoading(true);

        axiosInstance
            .get(`vacancies/?archived=${isArchive}`)
            .then(({ data }) => {
                const mapped = data.map((v, i) => {
                    /* --- разруливаем массивы --- */
                    const locArr =
                        Array.isArray(v.areas)
                            ? v.areas.map((a) =>
                                typeof a === "string" ? a : a?.name ?? a?.title ?? ""
                            )
                            : [];

                    const fmtArr = Array.isArray(v.work_formats) ? v.work_formats : [];

                    /* --- превью для отладки --- */
                    console.groupCollapsed(`vacancy[${i}] keys`);
                    console.groupEnd();
                    if (!locArr.length) console.warn(`❌ vacancy id=${v.id} no areas`, v);
                    if (!fmtArr.length) console.warn(`❌ vacancy id=${v.id} no work_formats`, v);

                    /* --- маппинг --- */
                    const salaryMid =
                        v.salary_from && v.salary_to
                            ? Math.floor((v.salary_from + v.salary_to) / 2)
                            : v.salary_from || v.salary_to || null;

                    return {
                        id: v.id,
                        title: v.title,
                        description: v.short_description,
                        locations: locArr,       // массив городов
                        work_formats: fmtArr,    // массив кодов
                        salary: salaryMid ? salaryMid.toLocaleString("ru-RU") : null,
                    };
                });

                setVacancies(mapped);
            })
            .catch((err) => console.error("Ошибка загрузки:", err))
            .finally(() => {
                setLoading(false);
                console.groupEnd();
            });

        setCurrentPage(1);
    }, [isArchive]);

    /* ===== фильтр ===== */
    const filteredVacancies = vacancies.filter((v, i) => {
        const okLoc =
            locFilter.any ||
            v.locations?.some((c) => locFilter.selected.includes(c));

        const okFmt =
            fmtFilter.any ||
            v.work_formats?.some((f) => fmtFilter.selected.includes(f));

        return okLoc && okFmt;
    });

    /* ===== пагинация ===== */
    const totalPages = Math.max(1, Math.ceil(filteredVacancies.length / perPage));
    const idxLast = currentPage * perPage;
    const idxFirst = idxLast - perPage;
    const current = filteredVacancies.slice(idxFirst, idxLast);

    /* ====== ui helpers ====== */
    const handlePageChange = (p) => {
        setCurrentPage(p);
    };
    const toggleArchive = () => {
        setIsArchive((v) => !v);
    };

    const toggleLoc = (city) => {
        let next;
        if (city === "any") {
            next = { any: true, selected: [] };
        } else {
            const sel = locFilter.selected.includes(city)
                ? locFilter.selected.filter((c) => c !== city)
                : [...locFilter.selected, city];
            next = { any: sel.length === 0, selected: sel };
        }
        setLocFilter(next);
        setCurrentPage(1);
        console.groupEnd();
    };

    const toggleFmt = (code) => {
        console.group("toggleFmt");
        let next;
        if (code === "any") {
            next = { any: true, selected: [] };
        } else {
            const sel = fmtFilter.selected.includes(code)
                ? fmtFilter.selected.filter((c) => c !== code)
                : [...fmtFilter.selected, code];
            next = { any: sel.length === 0, selected: sel };
        }
        setFmtFilter(next);
        setCurrentPage(1);
        console.groupEnd();
    };

    /* ===== render ===== */
    return (
        <main className="vacancies-page__main">
            <div className="vacancies-page__main-container">
                {/* header */}
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
                            <button className="hr-vacancies-header__archive-btn" onClick={toggleArchive}>
                                {isArchive ? "вернуться к вакансиям" : "архив вакансий"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* content */}
                <div className="vacancies-page__content">
                    {/* list */}
                    <div className="vacancies-page__list">
                        {loading && <p className="vacancies-loading">Загрузка...</p>}

                        {!loading &&
                            current.map((vac) => (
                                <Link key={vac.id} to={`/vacancy-edit/${vac.id}`} className="vacancy-card">
                                    <div className="vacancy-card__tags">
                                        {vac.locations?.[0] && (
                                            <span className="vacancy-card__tag">г. {vac.locations[0]}</span>
                                        )}
                                        {vac.work_formats.map((c) => (
                                            <span key={c} className="vacancy-card__tag">
                                                {WORK_FORMAT_LABELS[c] ?? c}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="vacancy-card__title">{vac.title}</h2>
                                    <p className="vacancy-card__description">{vac.description}</p>
                                    {vac.salary && (
                                        <div className="vacancy-card__footer">
                                            <span className="vacancy-card__salary">В среднем {vac.salary} ₽</span>
                                        </div>
                                    )}
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
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        className={`pagination__button ${currentPage === p ? "pagination__button--active" : ""
                                            }`}
                                    >
                                        {p}
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
                        )}
                    </div>

                    {/* sidebar */}
                    <div className="vacancies-page__sidebar">
                        <div className="filters">
                            <h2 className="filters__title">Фильтры</h2>

                            {/* место */}
                            <div className="filters__group">
                                <h3 className="filters__group-title">Местоположение</h3>
                                <div className="filters__options">
                                    <label className="filters__option">
                                        <input type="checkbox" checked={locFilter.any} onChange={() => toggleLoc("any")} />
                                        <span>Любой город</span>
                                    </label>
                                    {LOCATION_OPTIONS.map((c) => (
                                        <label key={c} className="filters__option">
                                            <input
                                                type="checkbox"
                                                checked={!locFilter.any && locFilter.selected.includes(c)}
                                                onChange={() => toggleLoc(c)}
                                            />
                                            <span>{c}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* формат */}
                            <div className="filters__group">
                                <h3 className="filters__group-title">Формат работы</h3>
                                <div className="filters__options">
                                    <label className="filters__option">
                                        <input type="checkbox" checked={fmtFilter.any} onChange={() => toggleFmt("any")} />
                                        <span>Любой</span>
                                    </label>
                                    {FORMAT_OPTIONS.map(({ code, label }) => (
                                        <label key={code} className="filters__option">
                                            <input
                                                type="checkbox"
                                                checked={!fmtFilter.any && fmtFilter.selected.includes(code)}
                                                onChange={() => toggleFmt(code)}
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VacanciesListMain;

