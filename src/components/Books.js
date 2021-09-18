import React, { useCallback, useEffect, useState } from 'react';
import { Container, Button, Col, Card, Navbar, Nav, ButtonGroup, Row, FormControl, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import api from '../api';
import { getUrlParam } from '../utils';
import { Route, Switch, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { faArrowLeft, faArrowRight, faBookOpen, faHome, faPen, faPlusCircle, faPowerOff, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BookForm from './BookForm';
import Weather from './Weather';
import BookView from './BookView';
import bible from '../bible.jpg';

export default function Books() {
    const history = useHistory();

    async function handleLogout() {
        try {
            const res = await api.get('/logout');

            if (res.data.success === true) {
                localStorage.removeItem('token');
                localStorage.removeItem('weather');
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
        <React.Fragment>
            <Navbar variant="dark" bg="dark" className="shadow">
                <Container>
                    <Navbar.Brand>
                        <img
                            src={bible}
                            width="40"
                            height="40"
                            className="d-inline-block align-top me-3 rounded-circle"
                            alt="React Bootstrap logo"
                        />
                        <Link to="/books" className="text-white align-middle">
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
                    <Route path="/books/new">
                        <BookForm />
                    </Route>
                    <Route path="/books/:id/edit">
                        <BookForm />
                    </Route>
                    <Route path="/books/:id">
                        <BookView />
                    </Route>
                    <Route path="/books">
                        <BookList />
                    </Route>
                </Switch>
            </Container>
        </React.Fragment>
    );
}

function BookList() {
    const history = useHistory();
    const [bookList, setBookList] = useState([]);
    const [prevPageUrl, setPrevPageUrl] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [params, setParams] = useState(false);

    const getBookList = useCallback(async () => {
        try {
            const res = await api.get('/books', {
                params
            });

            const {
                data,
                prev_page_url,
                next_page_url
            } = res.data;

            if (data !== undefined) {
                setBookList(data);
                setPrevPageUrl(prev_page_url);
                setNextPageUrl(next_page_url);
            } else {
                Swal.fire(res.data.message, '', 'error');
            }
        } catch (err) {
            Swal.fire(err, '', 'error');
        }
    }, [params]);

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
            icon: 'question',
            text: 'Após a exclusão não será mais possível recuperar este livro.',
            showDenyButton: true,
            confirmButtonText: 'Confirmar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
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
                }
            }
        });
    }

    function BookFilter() {
        return (
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Informe o Título, Descrição, Autor ou Data de Cadastro"
                    aria-label="Filtrar livros"
                />
                <Button variant="light" className="text-primary">
                    <FontAwesomeIcon icon={faSearch} />
                </Button>
            </InputGroup>
        );
    }

    function Pagination() {

        function handleFirstPage() {
            setParams({
                ...params,
                page: 1
            });

            getBookList();
        }

        function handlePrevPage() {
            setParams({
                ...params,
                page: getUrlParam(prevPageUrl, 'page')
            });

            getBookList();
        }

        function handleNextPage() {
            setParams({
                ...params,
                page: getUrlParam(nextPageUrl, 'page')
            });

            getBookList();
        }

        return (
            <React.Fragment>
                {nextPageUrl || prevPageUrl ? (
                    <div className="d-flex bg-dark-2 rounded p-2">
                        <Button onClick={handleFirstPage} className="me-3">
                            <FontAwesomeIcon icon={faHome} />
                        </Button>
                        <ButtonGroup className="ms-auto">
                            {prevPageUrl ? (
                                <Button onClick={handlePrevPage}>
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </Button>
                            ) : null}
                            {nextPageUrl ? (
                                <Button onClick={handleNextPage}>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                            ) : null}
                        </ButtonGroup>
                    </div>
                )
                    : null
                }
            </React.Fragment>
        );
    }

    return (
        bookList.length > 0 ? (
            <Row>
                <Col md={12}>
                    <Weather />
                    <div className="text-white align-space-beetwen">
                        <BookFilter />
                    </div>
                </Col>
                {nextPageUrl || prevPageUrl ? (
                    <Col md={12} className="mb-3">
                        <Pagination />
                    </Col>
                ) : null}
                {bookList.map((book) => (
                    <Col md={6} xl={4} key={book.id} className="d-flex mb-3 align-self-stretch">
                        <Card className="h-100 d-flex justify-content-end border-0 shadow-sm bg-dark-2 text-white w-100">
                            <Card.Header className="h-100">
                                <div><strong>{book.title}</strong></div>
                                <small>Autor: {book.author}</small>
                            </Card.Header>
                            <Card.Footer className="p-2">
                                <div className="w-100 d-flex">
                                    <ButtonGroup className="ms-auto">
                                        <Button variant="primary"
                                            onClick={() => handleView(book.id)}>
                                            <FontAwesomeIcon icon={faBookOpen} />
                                        </Button>
                                        <Button className="btn btn-dark"
                                            onClick={() => handleEdit(book.id)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </Button>
                                        <Button className="btn btn-dark"
                                            onClick={() => handleDelete(book.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </ButtonGroup>
                                </div>
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
    );
}
