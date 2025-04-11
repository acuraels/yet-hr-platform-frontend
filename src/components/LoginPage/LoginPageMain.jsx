import { useState } from "react"
import "./LoginPageMain.css"

const LoginPageMain = () => {
    const [userType, setUserType] = useState("hr")
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const handleUserTypeChange = (type) => {
        setUserType(type)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Здесь будет логика авторизации
        console.log("Авторизация:", userType, formData)
    }

    return (
        <main className="login-page__main">
            <div className="login-page__container">
                <div className="login-form">
                    <h1 className="login-form__title">Вход</h1>

                    <div className="login-form__tabs">
                        <button
                            className={`login-form__tab ${userType === "hr" ? "login-form__tab--active" : ""}`}
                            onClick={() => handleUserTypeChange("hr")}
                        >
                            HR-сотрудник
                        </button>
                        <button
                            className={`login-form__tab ${userType === "admin" ? "login-form__tab--active" : ""}`}
                            onClick={() => handleUserTypeChange("admin")}
                        >
                            Администратор
                        </button>
                    </div>

                    <form className="login-form__form" onSubmit={handleSubmit}>
                        <div className="login-form__field">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="login-form__input"
                                placeholder="Логин"
                                required
                            />
                        </div>

                        <div className="login-form__field">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="login-form__input"
                                placeholder="Пароль"
                                required
                            />
                        </div>

                        <button type="submit" className="login-form__submit">
                            Войти
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default LoginPageMain
