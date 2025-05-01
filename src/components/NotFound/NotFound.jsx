import React from 'react';
import { Link } from "react-router-dom";

const NotFound = () => {
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
            >ERROR 404</h1>
            <h3>Эта страница не существует.</h3>
            <Link to="/home" className="login-form__submit">
                Вернуться на главную
            </Link>
        </div>
    );
};

export default NotFound;
