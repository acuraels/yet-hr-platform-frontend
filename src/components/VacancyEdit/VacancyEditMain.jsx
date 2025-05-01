import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'

import './VacancyEditMain.css'

const statusOptions = [
    { label: 'Сохранить', value: 'save', bg: '#1BE145', color: '#fff' },
    { label: 'Опубликовать', value: 'publish', bg: '#196529', color: '#fff' },
    { label: 'Архивировать', value: 'archive', bg: '#0f3e1a', color: '#fff' },
    { label: 'Удалить', value: 'delete', bg: '#a52a2a', color: '#fff' },
]

const VacancyEditMain = () => {
    const [step, setStep] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0])

    // Шаг 1: базовые данные
    const [vacancyName, setVacancyName] = useState('')
    const [shortDescription, setShortDescription] = useState('')
    const availableLocations = ['Любой город', 'Москва', 'Екатеринбург', 'Сыктывкар']
    const availableFormats = ['Любой', 'Офис', 'Гибрид', 'Удаленка']
    const [locations, setLocations] = useState([availableLocations[0]])
    const [formats, setFormats] = useState([availableFormats[0]])
    const [minExperience, setMinExperience] = useState('')
    const [schedule, setSchedule] = useState('')
    const [workingHours, setWorkingHours] = useState('')
    const [income, setIncome] = useState('')

    // Шаг 2: детальное описание
    const [detailedDescription, setDetailedDescription] = useState(
        '<p>Опишите вакансию подробно...</p>'
    )
    const editor = useEditor({
        extensions: [
            StarterKit,
            LinkExtension.configure({ openOnClick: false }),
        ],
        content: detailedDescription,
        onUpdate: ({ editor }) => setDetailedDescription(editor.getHTML()),
    })

    useEffect(() => {
        return () => editor && editor.destroy()
    }, [editor])

    const toggleItem = (value, list, setList) => {
        setList(
            list.includes(value)
                ? list.filter(i => i !== value)
                : [...list, value]
        )
    }

    const handlePublish = () => {
        const payload = {
            vacancyName,
            shortDescription,
            locations,
            formats,
            minExperience,
            schedule,
            workingHours,
            income,
            detailedDescription,
        }
        console.log('Публикуем вакансию:', payload)
        // TODO: здесь отправка данных на сервер
        setShowModal(true)
    }

    const handleStatusSelect = opt => {
        setSelectedStatus(opt)
        setDropdownOpen(false)
        console.log('Выбрано действие:', opt.value)
        // TODO: перелогика save/publish/archive/delete
    }

    return (
        <main className="vacancy-create__main">
            <div className="vacancy-create__container">

                {/* Заголовок + дропдаун статуса */}
                <div className="header-row">
                    <h2 className="title">Вакансия</h2>
                    <div className="status-dropdown">
                        <button
                            className="btn-status"
                            style={{ background: selectedStatus.bg, color: selectedStatus.color }}
                            onClick={() => setDropdownOpen(o => !o)}
                        >
                            {selectedStatus.label} <span className="arrow">{dropdownOpen ? '▲' : '▼'}</span>
                        </button>
                        {dropdownOpen && (
                            <ul className="status-list">
                                {statusOptions.map(opt => (
                                    <li
                                        key={opt.value}
                                        className="status-item"
                                        style={{ background: opt.bg, color: opt.color }}
                                        onClick={() => handleStatusSelect(opt)}
                                    >
                                        {opt.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {step === 1 && (
                    <>
                        {/* Шаг 1: краткие данные */}
                        <div className="form-group">
                            <label>Название вакансии</label>
                            <input
                                type="text"
                                value={vacancyName}
                                onChange={e => setVacancyName(e.target.value)}
                                placeholder="Название вакансии"
                            />
                        </div>

                        <div className="form-group">
                            <label>Краткое описание</label>
                            <input
                                type="text"
                                value={shortDescription}
                                onChange={e => setShortDescription(e.target.value)}
                                placeholder="Краткое описание"
                            />
                        </div>

                        <div className="form-group">
                            <span className="subtitle">Фильтры</span>
                            <div className="filters-grid">
                                <div>
                                    <h3 className="filters-grid-name">Местоположение</h3>
                                    {availableLocations.map(loc => (
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

                                <div>
                                    <h3 className="filters-grid-name">Формат работы</h3>
                                    {availableFormats.map(fmt => (
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

                                <div className="small-inputs">
                                    <label>Минимум опыта, лет</label>
                                    <input
                                        type="number"
                                        value={minExperience}
                                        onChange={e => setMinExperience(e.target.value)}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="small-inputs">
                                    <label>График (например, 5/2)</label>
                                    <input
                                        type="text"
                                        value={schedule}
                                        onChange={e => setSchedule(e.target.value)}
                                        placeholder="5/2"
                                    />
                                </div>

                                <div className="small-inputs">
                                    <label>Рабочих часов в день</label>
                                    <input
                                        type="number"
                                        value={workingHours}
                                        onChange={e => setWorkingHours(e.target.value)}
                                        placeholder="8"
                                    />
                                </div>

                                <div className="small-inputs">
                                    <label>Уровень дохода, руб.</label>
                                    <input
                                        type="text"
                                        value={income}
                                        onChange={e => setIncome(e.target.value)}
                                        placeholder="От 100 000"
                                    />
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

                {step === 2 && (
                    <>
                        {/* Шаг 2: подробное описание */}
                        <div className="form-group">
                            <span className="subtitle">Подробно о вакансии</span>
                        </div>

                        <div className="editor-toolbar">
                            <button onClick={() => editor.chain().focus().toggleBold().run()}>Жирный</button>
                            <button onClick={() => editor.chain().focus().toggleItalic().run()}>Курсив</button>
                            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>Заголовок</button>
                            <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Список</button>
                            <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Нумерован. список</button>
                            <button
                                onClick={() => {
                                    const url = prompt('Введите URL ссылки')
                                    url && editor.chain().focus().setLink({ href: url }).run()
                                }}
                            >
                                Ссылка
                            </button>
                        </div>

                        <EditorContent editor={editor} className="editor-content" />

                        <div className="buttons">
                            <button className="btn btn-back" onClick={() => setStep(1)}>
                                Назад
                            </button>
                        </div>
                    </>
                )}

                {/* Модальное окно после публикации */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-window">
                            <p>Вакансия опубликована</p>
                            <Link
                                to="/vacancies-list"
                                className="btn btn-next"
                                onClick={() => setShowModal(false)}
                            >
                                Окей
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
export default VacancyEditMain;
