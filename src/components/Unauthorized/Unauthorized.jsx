import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
    return (
        <div
            className="notfound"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                gap: '15px',
            }}
        >
            <h1
                style={{
                    color: '#eee600'
                }}
            >ERROR 401</h1>
            <h3>Доступ запрещён! <br /> Вы не авторизованы для просмотра этой страницы.</h3>
            <Link to="/login" className="login-form__submit">
                Вернуться ко входу
            </Link>
        </div >
    )
}

export default Unauthorized
