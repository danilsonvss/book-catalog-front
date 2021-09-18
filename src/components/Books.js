import React, { useCallback, useEffect, useState } from 'react';
import { Container, Button, Col, Card, Navbar, Nav, Spinner, ButtonGroup, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';
import api from '../api';
import { Redirect, Route, Switch, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { faEdit, faEye, faPlusCircle, faPowerOff, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BookForm from './BookForm';
import { UserContext } from '../App';

export default function Books({ user }) {
    const history = useHistory();

    async function handleLogout() {
        try {
            const res = await api.get('/logout');

            if (res.data.success === true) {
                localStorage.removeItem('token');
                history.push('/');
            }
        } catch (err) {
            Swal.fire(err, '', 'error');
        }
    }

    function handleNew() {
        history.push(`/books/new`);
    }

    return (
        <UserContext.Consumer>
            {user => (
                <React.Fragment>
                    <Navbar variant="dark" bg="dark" className="shadow">
                        <Container>
                            <Navbar.Brand>
                                <Link to="/books" className="text-white">
                                    Catálogo de livros
                                </Link>
                            </Navbar.Brand>
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="ms-auto">
                                    <Button variant="dark"
                                        className="text-white appbar-action"
                                        onClick={handleNew}>
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                    </Button>
                                    <Button variant="dark"
                                        className="text-white appbar-action"
                                        onClick={handleLogout}>
                                        <FontAwesomeIcon icon={faPowerOff} />
                                    </Button>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    <Container className="mt-3">

                        <Switch>
                            <Route path="/books/:id/edit">
                                <BookForm />
                            </Route>
                            <Route path="/books/new">
                                <BookForm />
                            </Route>
                            <Route path="/books">
                                <BookList />
                            </Route>
                        </Switch>
                    </Container>
                </React.Fragment>
            )}
        </UserContext.Consumer>
    );
}

function BookList() {
    const history = useHistory();
    const [bookList, setBookList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getBookList = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/books');

            const {
                data,
                prev_page_url,
                next_page_url,
                per_page
            } = res.data;

            if (data !== undefined) {
                setBookList(data);
            } else {
                Swal.fire(res.data.message, '', 'error');
            }
        } catch (err) {
            Swal.fire(err, '', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getBookList();
    }, [getBookList]);

    function handleView(bookId) {
        history.push(`/books/${bookId}`);
    }

    function handleEdit(bookId) {
        history.push(`/books/${bookId}/edit`);
    }

    function handleDelete(bookId) {
        Swal.fire({
            title: 'Você tem certeza?',
            text: 'Após a exclusão não será mais possível recuperar este livro.',
            showDenyButton: true,
            confirmButtonText: 'Confirmar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    (async () => {
                        const res = await api.delete(`/books/${bookId}`);
                        if (res.data.success) {
                            Swal.fire(res.data.message, '', 'success');
                        } else {
                            Swal.fire(res.data.message, '', 'error');
                        }

                    })();

                    getBookList();
                } catch (err) {
                    Swal.fire(err, '', 'error');
                } finally {
                    setLoading(false);
                }
            }
        });
    }

    useEffect(() => {
        setLoading(false);
    }, [])

    return (
        <React.Fragment>
            {loading ?
                <div className="d-flex justify-content-center scroll-off">
                    <Spinner animation="border" variant="primary" />
                </div>
                : (
                    bookList.length > 0 ? (
                        <Row>
                            {bookList.map((book) => (
                                <Col md={4} lg={3} key={book.id} className="d-flex mb-3 align-self-stretch">
                                    <Card className="h-100 d-flex justify-content-end border-0 shadow-sm bg-dark-2 text-white w-100">
                                        <Card.Header className="h-100">
                                            <div><strong>{book.title}</strong></div>
                                            <small>Autor: {book.author}</small>
                                        </Card.Header>
                                        <Card.Footer>
                                            <ButtonGroup className="w-100">
                                                <Button className="btn btn-dark text-white"
                                                    onClick={() => handleView(book.id)}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Button>
                                                <Button className="btn btn-dark text-white"
                                                    onClick={() => handleEdit(book.id)}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Button>
                                                <Button className="btn btn-dark text-white"
                                                    onClick={() => handleDelete(book.id)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </ButtonGroup>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-white text-center p-3">
                            <div className="p-3">Nenhum livro cadastrado</div>
                            <Button variant="primary"
                                onClick={() => history.push("/books/new")}>Cadastrar um livro</Button>
                        </div>
                    )
                )
            }
        </React.Fragment>
    );
}
