"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import "./ResponsePageMain.css"

const ResponsePageMain = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const returnTab = queryParams.get('tab') || 'not-sorted'

    // State for the candidate data
    const [candidate, setCandidate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("")
    const [notes, setNotes] = useState("")
    const [originalStatus, setOriginalStatus] = useState("")

    // Mock data - in a real app, you would fetch this from an API
    const candidatesData = [
        {
            id: 1,
            position: "Продуктовый аналитик",
            description: "Короткое описание вакансии. Короткое описание вакансии.",
            tags: ["г.Екатеринбург", "Офис"],
            experience: "Опыт от 1 года",
            name: "Шаматов Рафаэль Рафитович",
            age: 20,
            email: "shamatovrafa@gmail.com",
            phone: "+7 (919) 387-05-56",
            candidateExperience: "Опыт 1.5 года",
            date: "26.09.2024",
            time: "19:15",
            status: "not-sorted",
            additionalInfo: "Комментарий соискателя (сопроводительное письмо)\nКомментарий соискателя (сопроводительное письмо)\nКомментарий соискателя (сопроводительное письмо)\nКомментарий соискателя (сопроводительное письмо)",
            notes: "",
            resumeLink: "#",
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
            notes: "Не подходит по опыту",
            resumeLink: "#",
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
            notes: "Перспективный кандидат",
            resumeLink: "#",
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
            notes: "Встреча назначена на 30.09.2024",
            resumeLink: "#",
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
            notes: "Архивировано 25.09.2024",
            resumeLink: "#",
        },
    ]

    // Status options with their display names and classes
    const statusOptions = [
        { value: "not-sorted", label: "не разобран", className: "response-page__status-option--not-sorted" },
        { value: "rejected", label: "отклонен", className: "response-page__status-option--rejected" },
        { value: "approved", label: "одобрен", className: "response-page__status-option--approved" },
        { value: "meeting-scheduled", label: "назначена встреча", className: "response-page__status-option--meeting" },
        { value: "archived", label: "архивировано", className: "response-page__status-option--archived" },
    ]

    // Load candidate data
    useEffect(() => {
        // Simulate API call
        const fetchCandidate = () => {
            setLoading(true)
            // Find candidate by ID
            const foundCandidate = candidatesData.find(c => c.id === parseInt(id))

            if (foundCandidate) {
                setCandidate(foundCandidate)
                setSelectedStatus(foundCandidate.status)
                setOriginalStatus(foundCandidate.status)
                setNotes(foundCandidate.notes || "")
            }

            setLoading(false)
        }

        fetchCandidate()
    }, [id])

    // Handle status change
    const handleStatusChange = (status) => {
        setSelectedStatus(status)
        setStatusDropdownOpen(false)
    }

    // Handle save
    const handleSave = () => {
        // In a real app, you would send this data to your API
        console.log("Saving changes:", {
            id,
            status: selectedStatus,
            notes
        })

        // Navigate back to the responses page with the appropriate tab selected
        // If the status has changed, navigate to the new status tab
        const tabToReturn = selectedStatus !== originalStatus ? selectedStatus : returnTab
        navigate(`/vacancies-responses?tab=${tabToReturn}`)
    }

    // Get status display name
    const getStatusDisplayName = (statusValue) => {
        const option = statusOptions.find(opt => opt.value === statusValue)
        return option ? option.label : "не разобран"
    }

    // Get status class
    const getStatusClass = (statusValue) => {
        const option = statusOptions.find(opt => opt.value === statusValue)
        return option ? option.className : ""
    }

    if (loading) {
        return <div className="response-page__loading">Загрузка...</div>
    }

    if (!candidate) {
        return <div className="response-page__error">Отклик не найден</div>
    }

    return (
        <main className="response-page__main">
            <div className="response-page__container">
                <Link
                    to={`/vacancies-responses?tab=${returnTab}`}
                    className="response-page__back-link"
                >
                    ←
                </Link>
                <div className="response-page__header">
                    <div className="response-page__meta">
                        <div className="response-page__tags">
                            {candidate.tags.map((tag, index) => (
                                <span key={index} className="response-page__tag">
                                    {tag}
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

                <div className="response-page__content">
                    <div className="response-page__left-column">
                        <div className="response-page__candidate-info">
                            <h2 className="response-page__candidate-name">
                                {candidate.name}, {candidate.age} лет
                            </h2>
                            <p className="response-page__candidate-email">{candidate.email}</p>
                            <p className="response-page__candidate-phone">{candidate.phone}</p>
                            <p className={`response-page__candidate-experience ${candidate.candidateExperience === "Без опыта"
                                ? "response-page__candidate-experience--none"
                                : ""
                                }`}>
                                {candidate.candidateExperience}
                            </p>
                        </div>

                        <div className="response-page__resume-actions">
                            <button className="response-page__download-button">
                                Скачать резюме
                            </button>
                            <a href={candidate.resumeLink} className="response-page__resume-link">
                                Ссылка на резюме
                            </a>
                        </div>

                        {candidate.additionalInfo && (
                            <div className="response-page__additional-info">
                                <h3 className="response-page__section-title">Дополнение</h3>
                                <p className="response-page__additional-text">
                                    {candidate.additionalInfo}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="response-page__right-column">
                        <div className="response-page__status-section">
                            <h3 className="response-page__section-title">Статус</h3>
                            <div className="response-page__status-dropdown">
                                <button
                                    className={`response-page__status-button ${getStatusClass(selectedStatus)}`}
                                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                >
                                    {getStatusDisplayName(selectedStatus)}
                                    <span className="response-page__dropdown-arrow">▼</span>
                                </button>

                                {statusDropdownOpen && (
                                    <div className="response-page__status-options">
                                        {statusOptions.map(option => (
                                            <button
                                                key={option.value}
                                                className={`response-page__status-option ${option.className}`}
                                                onClick={() => handleStatusChange(option.value)}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="response-page__notes-section">
                            <h3 className="response-page__section-title">Заметка</h3>
                            <textarea
                                className="response-page__notes-textarea"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Добавьте заметку о кандидате..."
                            />
                        </div>

                        <button
                            className="response-page__save-button"
                            onClick={handleSave}
                        >
                            сохранить
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ResponsePageMain;