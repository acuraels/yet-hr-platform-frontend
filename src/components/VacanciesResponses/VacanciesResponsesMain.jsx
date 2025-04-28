import { useState } from "react"
import { Link } from "react-router-dom"
import "./VacanciesResponsesMain.css"

const VacanciesResponsesMain = () => {
    // Состояние для отслеживания активной вкладки
    const [activeTab, setActiveTab] = useState("not-sorted")

    // Данные о кандидатах (в реальном приложении будут загружаться с сервера)
    const [candidates, setCandidates] = useState([
        {
            id: 1,
            position: "Продуктовый аналитик",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            tags: ["г.Екатеринбург", "Офис"],
            experience: "Опыт от 1 года",
            name: "Шаматов Рафаэль Рафитович",
            age: 20,
            email: "shamatovrafa@gmail.com",
            phone: "+7 (999) 387-05-56",
            candidateExperience: "Опыт 1.5 года",
            date: "26.09.2024",
            time: "19:15",
            status: "not-sorted",
            additionalInfo: "",
        },
        {
            id: 2,
            position: "Продуктовый аналитик",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            tags: ["г.Екатеринбург", "Офис"],
            experience: "Опыт от 1 года",
            name: "Иванов Иван Иванович",
            age: 25,
            email: "test@test.com",
            phone: "+7 (999) 999-99-99",
            candidateExperience: "Опыт 3 месяца",
            date: "26.09.2024",
            time: "19:15",
            status: "rejected",
            additionalInfo: "",
        },
        {
            id: 3,
            position: "Продуктовый аналитик",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            tags: ["г.Екатеринбург", "Офис", "Свой кандидат"],
            experience: "Опыт от 1 года",
            name: "Машина Маша Машиновна",
            age: 17,
            email: "test@test.com",
            phone: "+7 (999) 999-99-99",
            candidateExperience: "Без опыта",
            date: "26.09.2024",
            time: "19:15",
            status: "approved",
            additionalInfo: 'То, что написал кандидат в поле "Чем бы Вы хотели заниматься? На какую роль претендуете?"',
        },
        {
            id: 4,
            position: "Продуктовый аналитик",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            tags: ["г.Екатеринбург", "Офис"],
            experience: "Опыт от 1 года",
            name: "Машина Маша Машиновна",
            age: 17,
            email: "test@test.com",
            phone: "+7 (999) 999-99-99",
            candidateExperience: "Без опыта",
            date: "26.09.2024",
            time: "19:15",
            status: "meeting-scheduled",
            additionalInfo: "",
        },
        {
            id: 5,
            position: "Продуктовый аналитик",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            tags: ["г.Екатеринбург", "Офис"],
            experience: "Опыт от 1 года",
            name: "Иванов Иван Иванович",
            age: 25,
            email: "test@test.com",
            phone: "+7 (999) 999-99-99",
            candidateExperience: "Опыт 3 месяца",
            date: "26.09.2024",
            time: "19:15",
            status: "archived",
            additionalInfo: "",
        },
    ])

    // Фильтрация кандидатов по активной вкладке
    const filteredCandidates = candidates.filter((candidate) => candidate.status === activeTab)

    // Функция для изменения статуса кандидата
    const changeStatus = (id, newStatus) => {
        setCandidates(
            candidates.map((candidate) => (candidate.id === id ? { ...candidate, status: newStatus } : candidate)),
        )
    }

    // Функция для получения класса карточки в зависимости от статуса
    const getCardClass = (status) => {
        switch (status) {
            case "rejected":
                return "candidate-card--rejected"
            case "approved":
                return "candidate-card--approved"
            case "meeting-scheduled":
                return "candidate-card--meeting"
            case "archived":
                return "candidate-card--archived"
            default:
                return ""
        }
    }

    return (
        <main className="vacancies-responses__main">
            <div className="vacancies-responses__main-container">
                {/* Ссылка на архив */}
                <div className="vacancies-responses__archive-link-container">
                    <button
                        className={`vacancies-responses__archive-link ${activeTab === "archived" ? "vacancies-responses__archive-link--active" : ""}`}
                        onClick={() => setActiveTab("archived")}
                    >
                        архив откликов
                    </button>
                </div>

                {/* Вкладки статусов */}
                <div className="vacancies-responses__tabs">
                    <button
                        className={`vacancies-responses__tab ${activeTab === "not-sorted" ? "vacancies-responses__tab--active vacancies-responses__tab--not-sorted-active" : ""}`}
                        onClick={() => setActiveTab("not-sorted")}
                    >
                        не разобраны
                    </button>
                    <button
                        className={`vacancies-responses__tab ${activeTab === "rejected" ? "vacancies-responses__tab--active vacancies-responses__tab--rejected-active" : ""}`}
                        onClick={() => setActiveTab("rejected")}
                    >
                        отклонены
                    </button>
                    <button
                        className={`vacancies-responses__tab ${activeTab === "approved" ? "vacancies-responses__tab--active vacancies-responses__tab--approved-active" : ""}`}
                        onClick={() => setActiveTab("approved")}
                    >
                        одобрены
                    </button>
                    <button
                        className={`vacancies-responses__tab ${activeTab === "meeting-scheduled" ? "vacancies-responses__tab--active vacancies-responses__tab--meeting-active" : ""}`}
                        onClick={() => setActiveTab("meeting-scheduled")}
                    >
                        назначена встреча
                    </button>
                </div>

                {/* Основной контент */}
                <div className="vacancies-responses__content">
                    {/* Список кандидатов */}
                    <div className="vacancies-responses__candidates-list">
                        {filteredCandidates.map((candidate) => (
                            <Link
                                key={candidate.id}
                                to={`/vacancies-responses/${candidate.id}?tab=${activeTab}`}
                                className="candidate-card-link"
                            >
                                <div className={`candidate-card ${getCardClass(candidate.status)}`}>
                                    <div className="candidate-card__left">
                                        <div className="candidate-card__tags">
                                            {candidate.tags.map((tag, index) => (
                                                <span key={index} className="candidate-card__tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="candidate-card__position">{candidate.position}</h3>
                                        <p className="candidate-card__description">{candidate.description}</p>
                                        <p className="candidate-card__experience">{candidate.experience}</p>
                                        {candidate.additionalInfo && (
                                            <p className="candidate-card__additional-info">{candidate.additionalInfo}</p>
                                        )}
                                    </div>
                                    <div className="candidate-card__right">
                                        <div className="candidate-card__response-info">
                                            <p className="candidate-card__response-label">Отклик в</p>
                                            <div className="candidate-card__response-datetime">
                                                <span className="candidate-card__response-time">{candidate.time}</span>
                                                <span className="candidate-card__response-date">{candidate.date}</span>
                                            </div>
                                        </div>
                                        <div className="candidate-card__candidate-info">
                                            <p className="candidate-card__candidate-name">
                                                {candidate.name}, {candidate.age} лет
                                            </p>
                                            <p className="candidate-card__candidate-email">{candidate.email}</p>
                                            <p className="candidate-card__candidate-phone">{candidate.phone}</p>
                                            <p
                                                className={`candidate-card__candidate-experience ${candidate.candidateExperience === "Без опыта" ? "candidate-card__candidate-experience--none" : ""}`}
                                            >
                                                {candidate.candidateExperience}
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

                        <div className="vacancies-responses__filter-group">
                            <h4 className="vacancies-responses__filter-group-title">Местоположение</h4>
                            <div className="vacancies-responses__filter-options">
                                <label className="vacancies-responses__filter-option">
                                    <input type="checkbox" defaultChecked />
                                    <span>Любой город</span>
                                </label>
                                <label className="vacancies-responses__filter-option">
                                    <input type="checkbox" />
                                    <span>Москва</span>
                                </label>
                                <label className="vacancies-responses__filter-option">
                                    <input type="checkbox" />
                                    <span>Екатеринбург</span>
                                </label>
                                <label className="vacancies-responses__filter-option">
                                    <input type="checkbox" />
                                    <span>Сыктывкар</span>
                                </label>
                            </div>
                        </div>

                        <div className="vacancies-responses__filter-group">
                            <h4 className="vacancies-responses__filter-group-title">Формат работы</h4>
                            <div className="vacancies-responses__filter-options">
                                <label className="vacancies-responses__filter-option">
                                    <input type="checkbox" defaultChecked />
                                    <span>Любой</span>
                                </label>
                                <label className="vacancies-responses__filter-option">
                                    <input type="checkbox" />
                                    <span>Офис</span>
                                </label>
                                <label className="vacancies-responses__filter-option">
                                    <input type="checkbox" />
                                    <span>Гибрид</span>
                                </label>
                                <label className="vacancies-responses__filter-option">
                                    <input type="checkbox" />
                                    <span>Удаленка</span>
                                </label>
                            </div>
                        </div>

                        <div className="vacancies-responses__filter-group">
                            <h4 className="vacancies-responses__filter-group-title">Соответствие опыту</h4>
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

export default VacanciesResponsesMain