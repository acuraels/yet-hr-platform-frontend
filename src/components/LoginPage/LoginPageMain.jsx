import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import './LoginPageMain.css';

const LoginPageMain = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const { username, password } = formData;
        if (!username || !password) {
            toast.error('Пожалуйста, заполните все поля!');
            return;
        }

        try {
            // 1) Получаем токены
            const { data } = await axiosInstance.post(
                'accounts/token/',
                { username, password }
            );
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            // 2) Устанавливаем заголовок по умолчанию
            axiosInstance.defaults.headers.Authorization = 'Bearer ' + data.access;

            // 3) Получаем информацию о пользователе
            const res = await axiosInstance.get('accounts/user-info/');
            const { role, id } = res.data;
            localStorage.setItem('user_role', role);
            if (role === 'manager') {
                localStorage.setItem('user_id', id);
            }

            toast.success('Вход выполнен успешно!');

            // 4) Редирект по роли
            if (role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/vacancies-responses');
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error('Ошибка входа. Проверьте логин или пароль.');
        }
    };

    return (
        <main className="login-page__main">
            <div className="login-page__container">
                <div className="login-form">
                    <h1 className="login-form__title">Вход</h1>
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
    );
};

export default LoginPageMain;

