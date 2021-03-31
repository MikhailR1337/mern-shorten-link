import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/httpHook';

export const CreatePage = () => {
    const history = useHistory();

    const auth = useContext(AuthContext);
    const { request } = useHttp();
    const [link, setLink] = useState('');

    useEffect(() => {
        window.M.updateTextFields();
    }, [])

    const pressHandler = async (e) => {
        if (e.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', { from: link }, {
                    Authorization: `Bearer ${auth.token}`
                }); 
                history.push(`/detail/${data.link._id}`)
            } catch (e) {}
        }
    }

    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <div className="card-content">
                        <label htmlFor="link" className="form-label">Paste the link</label>
                        <input placeholder="Paste the link"
                        type="text"
                        className="form-control"
                        id="link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        onKeyPress={pressHandler}/>
                </div>
            </div>
        </div>
    )
}