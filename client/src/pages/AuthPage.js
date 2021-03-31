import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/httpHook';
import { useMessage } from '../hooks/messageHook';

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const { loading, error, request, clearError } = useHttp();
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    useEffect( () => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    }, [])

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form});
            message(data.message);
        } catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form});
            auth.login(data.token, data.userId)
        } catch (e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1 className="center">Shorten the link</h1>
                <div className="card">
                    <div className="card-content">
                        <h3 className="card-title">Login for start!</h3>
                        <p><i>This application will allow you to create and store your shortened links</i></p>
                    </div>
                    <div className="card-content">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input placeholder="Enter email"
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={changeHandler}/>
                    </div>
                    <div className="card-content">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input placeholder="Enter password"
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={changeHandler}/>
                    </div>
                    <div className="card-action">
                        <button type="button" className="waves-effect btn green" style={{marginRight:10}} onClick={loginHandler} disabled={loading}>Sign-in</button>
                        <button type="button" className="waves-effect btn brown" onClick={registerHandler} disabled={loading}>Sign-up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}