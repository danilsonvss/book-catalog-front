import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import './bible.jpg';
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import api from "./api";
import Login from './components/Login';
import Books from './components/Books';
import { useHistory } from 'react-router';

function App() {
    const history = useHistory();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUser() {
            try {
                const res = await api.get('/user');

                if (res.data.email !== undefined) {
                    setUser(res.data);
                }
            } catch (err) {
                
            }
        }

        getUser();
    }, [history]);

    return (
        <Router>
            <div className="scroll-y position-absolute h-100 w-100 bg-dark">
                <Switch>
                    <Route exact path="/">
                        <Login />
                    </Route>
                    {user !== null ? (
                        <Route path="/books">
                            <Books />
                        </Route>
                    ):(
                        <Login />
                    )}
                </Switch>
            </div>
        </Router>
    );
}

export default App;
