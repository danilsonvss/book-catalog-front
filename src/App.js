import React, { useEffect } from 'react';
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

    useEffect(() => {
        async function getUser() {
            try {
                const res = await api.get('/user');

                if (res.data.email !== undefined) {
                    history.push('/books');
                } else {
                    history.push('/');
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
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/books">
                        <Books />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
