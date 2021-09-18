import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'sweetalert2/dist/sweetalert2.min.css'
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import api from "./api";
import Login from './components/Login';
import Books from './components/Books';
import {useHistory} from 'react-router';

const UserContext = React.createContext({
    id: 0,
    name: 'Guest',
    email: 'guest@example.com'
});

function App() {
    const history = useHistory();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUser() {
            try {
                const res = await api.get('/user');
    
                if (res.data.email !== undefined) {
                    setUser(res.data);
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
                <UserContext.Provider value={user}>
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
                </UserContext.Provider>
            </div>
        </Router>
    );
}

export {UserContext};
export default App;
