import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import "./VacanciesResponsesMain.css"

const VacanciesResponsesMain = () => {
    // конфига для табов
    const TAB_CONFIG = {
        "not-sorted": { label: "не разобраны", apiStatus: "NOT_VIEWED", cardClassSuffix: "" },
        rejected: { label: "отклонены", apiStatus: "REJECTED", cardClassSuffix: "--rejected" },
        approved: { label: "одобрены", apiStatus: "APPROVED", cardClassSuffix: "--approved" },
        "meeting-scheduled": { label: "назначена встреча", apiStatus: "INTERVIEW_CONFIRMED", cardClassSuffix: "--meeting" },
        archived: { label: "архив откликов", apiStatus: "CLOSED", cardClassSuffix: "--archived" },
    }

    // список городов и мапа для форматов
    const cityOptions = ["Москва", "Екатеринбург", "Сыктывкар"]

    // перевод кодов форматов → русский
    const workFormatLabels = {
        ON_SITE: "Офис",
        REMOTE: "Удалённо",
        HYBRID: "Гибрид",
        FIELD_WORK: "Разъездная работа",
    }

    const workOptions = [
        { label: workFormatLabels.ON_SITE, code: "ON_SITE" },
        { label: workFormatLabels.HYBRID, code: "HYBRID" },
        { label: workFormatLabels.REMOTE, code: "REMOTE" },
        { label: workFormatLabels.FIELD_WORK, code: "FIELD_WORK" },
    ]

    const expMap = {
        noExperience: 0,
        between1and3: 1,
        between3and6: 3,
        moreThan6: 6,
    }

    const [activeTab, setActiveTab] = useState("not-sorted")
    const [candidates, setCandidates] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // фильтры фронтенд
    const [cityFilter, setCityFilter] = useState({
        any: true,
        Москва: false,
        Екатеринбург: false,
        Сыктывкар: false,
    })
    const [workFilter, setWorkFilter] = useState({
        any: true,
        ON_SITE: false,
        HYBRID: false,
        REMOTE: false,
        FIELD_WORK: false,
    })
    const [experienceOnly, setExperienceOnly] = useState(false)

    // загрузка данных при смене таба
    useEffect(() => {
        const cfg = TAB_CONFIG[activeTab]
        if (!cfg) return

        setLoading(true)
        setError(null)

        axiosInstance
            .get("/candidate/responses/", { params: { status: cfg.apiStatus } })
            .then(res => {
                // приводим статус из API в наш UI‑ключ
                const uiData = res.data.map(item => {
                    const uiKey = Object.entries(TAB_CONFIG).find(
                        ([ui, info]) => info.apiStatus === item.status
                    )?.[0]
                    return { ...item, status: uiKey || item.status }
                })
                setCandidates(uiData)
            })
            .catch(err => {
                setError(err.response?.statusText || err.message)
            })
            .finally(() => setLoading(false))
    }, [activeTab])

    // хэндлеры фильтров
    const handleCityChange = e => {
        const { name, checked } = e.target
        if (name === "any") {
            setCityFilter({ any: checked, Москва: false, Екатеринбург: false, Сыктывкар: false })
        } else {
            setCityFilter(prev => {
                const next = { ...prev, [name]: checked }
                if (checked) next.any = false
                // если ни один город не выбран — включаем any
                const anySpec = cityOptions.some(city => next[city])
                if (!anySpec) next.any = true
                return next
            })
        }
    }

    const handleWorkChange = e => {
        const { name, checked } = e.target
        if (name === "any") {
            setWorkFilter({ any: checked, ON_SITE: false, HYBRID: false, REMOTE: false, FIELD_WORK: false })
        } else {
            setWorkFilter(prev => {
                const next = { ...prev, [name]: checked }
                if (checked) next.any = false
                const anySpec = workOptions.some(opt => next[opt.code])
                if (!anySpec) next.any = true
                return next
            })
        }
    }

    // основной фильтр на отображение
    const filtered = candidates
        .filter(c => c.status === activeTab)
        .filter(c => {
            // 1) город
            const areas = c.vacancy?.areas ?? []
            if (!cityFilter.any) {
                const okCity = areas.some(area =>
                    cityOptions.some(city => cityFilter[city] && area.includes(city))
                )
                if (!okCity) return false
            }
            // 2) формат работы
            const fmts = c.vacancy?.work_formats ?? []
            if (!workFilter.any) {
                const okFmt = fmts.some(fmt => workFilter[fmt])
                if (!okFmt) return false
            }
            // 3) опыт
            if (experienceOnly) {
                const req = c.vacancy?.required_experience
                const min = expMap[req] ?? 0
                if (c.experience < min) return false
            }
            return true
        })

    const getCardClass = status => {
        const suffix = TAB_CONFIG[status]?.cardClassSuffix || ""
        return `candidate-card${suffix}`
    }

    return (
        <main className="vacancies-responses__main">
            <div className="vacancies-responses__main-container">
                {/* Архив */}
                <div className="vacancies-responses__archive-link-container">
                    <button
                        className={`vacancies-responses__archive-link ${activeTab === "archived"
                            ? "vacancies-responses__archive-link--active"
                            : ""
                            }`}
                        onClick={() => setActiveTab("archived")}
                    >
                        {TAB_CONFIG.archived.label}
                    </button>
                </div>

                {/* Таб‑бар */}
                <div className="vacancies-responses__tabs">
                    {Object.entries(TAB_CONFIG)
                        .filter(([key]) => key !== "archived")
                        .map(([key, info]) => (
                            <button
                                key={key}
                                className={`vacancies-responses__tab ${activeTab === key
                                    ? `vacancies-responses__tab--active vacancies-responses__tab${info.cardClassSuffix}-active`
                                    : ""
                                    }`}
                                onClick={() => setActiveTab(key)}
                            >
                                {info.label}
                            </button>
                        ))}
                </div>

                {/* Контент */}
                <div className="vacancies-responses__content">
                    {/* Список откликов */}
                    <div className="vacancies-responses__candidates-list">
                        {loading && <p>Загрузка...</p>}
                        {error && <p className="error">Ошибка: {error}</p>}
                        {!loading &&
                            !error &&
                            filtered.map(c => (
                                <Link
                                    key={c.id}
                                    to={`/vacancies-responses/${c.id}?tab=${activeTab}`}
                                    className="candidate-card-link"
                                >
                                    <div className={`candidate-card ${getCardClass(c.status)}`}>
                                        <div className="candidate-card__left">
                                            <p className="candidate-card__experience hero">{c.vacancy?.title}</p>
                                            <div className="candidate-card__tags">
                                                {(c.vacancy?.areas ?? []).map((area, i) => (
                                                    <span key={`${area}-${i}`} className="candidate-card__tag">
                                                        {area}
                                                    </span>
                                                ))}
                                                {(c.vacancy?.work_formats ?? []).map((fmt, j) => (
                                                    <span key={`${fmt}-${j}`} className="candidate-card__tag">
                                                        {workFormatLabels[fmt] || fmt}
                                                    </span>
                                                ))}
                                            </div>

                                            <p className="candidate-card__experience">{c.name}</p>
                                            {c.notes && (
                                                <p className="candidate-card__additional-info">{c.notes}</p>
                                            )}
                                        </div>
                                        <div className="candidate-card__right">
                                            <div className="candidate-card__response-info">
                                                <p className="candidate-card__response-label">Отклик в</p>
                                                <div className="candidate-card__created">
                                                    {new Date(c.created_at).toLocaleString("ru-RU", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                                <div className="candidate-card__response-datetime">
                                                    <span className="candidate-card__response-time">{c.time}</span>
                                                    <span className="candidate-card__response-date">{c.date}</span>
                                                </div>
                                            </div>
                                            <div className="candidate-card__candidate-info">
                                                <p className="candidate-card__candidate-name">
                                                    {c.experience}, {c.age} лет
                                                </p>
                                                <p className="candidate-card__candidate-email">{c.email}</p>
                                                <p className="candidate-card__candidate-phone">{c.phone}</p>
                                                <p
                                                    className={`candidate-card__candidate-experience ${c.candidateExperience === "Без опыта"
                                                        ? "candidate-card__candidate-experience--none"
                                                        : ""
                                                        }`}
                                                >
                                                    {c.candidateExperience}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>

                    {/* Фильтры */}
                    <div className="vacancies-responses__filters">
                        <h3 className="vacancies-responses__filters-title">Фильтры</h3>

                        {/* По городу */}
                        <div className="vacancies-responses__filter-group">
                            <h4 className="vacancies-responses__filter-group-title">Местоположение</h4>
                            <div className="vacancies-responses__filter-options">
                                <label className="vacancies-responses__filter-option">
                                    <input
                                        type="checkbox"
                                        name="any"
                                        checked={cityFilter.any}
                                        onChange={handleCityChange}
                                    />
                                    <span>Любой город</span>
                                </label>
                                {cityOptions.map(city => (
                                    <label key={city} className="vacancies-responses__filter-option">
                                        <input
                                            type="checkbox"
                                            name={city}
                                            checked={cityFilter[city]}
                                            onChange={handleCityChange}
                                        />
                                        <span>{city}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* По формату работы */}
                        <div className="vacancies-responses__filter-group">
                            <h4 className="vacancies-responses__filter-group-title">Формат работы</h4>
                            <div className="vacancies-responses__filter-options">
                                <label className="vacancies-responses__filter-option">
                                    <input
                                        type="checkbox"
                                        name="any"
                                        checked={workFilter.any}
                                        onChange={handleWorkChange}
                                    />
                                    <span>Любой</span>
                                </label>
                                {workOptions.map(opt => (
                                    <label key={opt.code} className="vacancies-responses__filter-option">
                                        <input
                                            type="checkbox"
                                            name={opt.code}
                                            checked={workFilter[opt.code]}
                                            onChange={handleWorkChange}
                                        />
                                        <span>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* По опыту */}
                        <div className="vacancies-responses__filter-group">
                            <h4 className="vacancies-responses__filter-group-title">
                                Соответствие опыту
                            </h4>
                            <div className="vacancies-responses__filter-toggle">
                                <label className="toggle">
                                    <input type="checkbox" />
                                    <span className="toggle__slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default VacanciesResponsesMain;