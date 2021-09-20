import { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Container, Card, Spinner } from 'react-bootstrap';
import api from '../api';
import Swal from 'sweetalert2'
import { useHistory } from 'react-router';

export default function Login() {
    const history = useHistory();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const handleSaveToken = (token) => {
        localStorage.setItem('token', token);
    }

    async function handleLogin() {
        try {
            setLoading(true);
            const res = await api.post('/auth', {
                email,
                password,
            });

            if (res.data.success === true) {
                handleSaveToken(res.data.access_token);
                window.location.reload();
            } else {
                Swal.fire('Atenção', res.data.message, 'error');
            }
        } catch (err) {
            Swal.fire('Atenção', 'Autenticação falhou', 'error');
        } finally {
            setLoading(false);
        }
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    useEffect(() => {
        async function getUser() {
            try {
                const token = localStorage.getItem('token');
    
                if (token !== null) {
                    history.replace('/books');
                }
            } catch (err) {
                
            }
        }

        getUser();

        setLoading(false);
    }, [history]);

    return (
        <Container className="h-100">
            <Row className="h-100 justify-content-center align-items-center">
                <Col md={8} lg={5}>
                    <Form>
                        <Card className="shadow-sm bg-dark-2 rounded text-white">
                            <Card.Body>
                                <h1 className="display-6 p-3 text-center m-0">Login</h1>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control 
                                        className="p-3"
                                        type="email"
                                        placeholder="Seu e-mail"
                                        onChange={handleChangeEmail} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control 
                                        className="p-3"
                                        type="password"
                                        placeholder="Sua senha"
                                        onChange={handleChangePassword} />
                                </Form.Group>
                                <div className="d-flex justify-content-center">
                                    {loading ? (
                                        <Spinner animation="border" variant="primary" />
                                    ) : (
                                        <Button variant="primary" 
                                            className="w-100 p-3 text-uppercase" 
                                            type="button" onClick={handleLogin}>
                                            Entrar
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}