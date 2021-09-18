import { useEffect, useState } from "react";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import * as moment from 'moment';
import api from "../api";
import { useHistory, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function BookForm() {
    const { id } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [pages, setPages] = useState();
    const [registrationDate, setRegistrationDate] = useState('');

    function handleChangeTitle(e) {
        setTitle(e.target.value);
    }

    function handleChangeAuthor(e) {
        setAuthor(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }

    function handleChangePages(e) {
        setPages(e.target.value);
    }

    function handleChangeRegistrationDate(e) {
        setRegistrationDate(e.target.value);
    }

    async function handleSave() {
        try {
            handleValidate();

            const data = {
                title,
                author,
                description,
                pages,
                registration_at: registrationDate
            };

            let res;

            if (id !== undefined) {
                res = await api.put(`books/${id}`, data);
            } else {
                res = await api.post('books', data);
            }

            if (res.data.success === true) {
                history.push("/books");
                Swal.fire(res.data.message, '', 'success');
            } else {
                Swal.fire(res.data.message, '', 'error');
            }
        } catch (e) {
            Swal.fire(e.message, '', 'error');
        }
    }

    function handleValidate() {
        if (title.length < 1 || description.length > 255) {
            throw new Error('Informe o título (1 a 255 caracteres)');
        }

        if (author.length < 1 || description.length > 255) {
            throw new Error('Informe o autor (1 a 255 caracteres)');
        }

        if (description.length < 1 || description.length > 500) {
            throw new Error('Informe o descrição (1 a 500 caracteres)');
        }

        if (parseInt(pages) < 1) {
            throw new Error('Informe o número de páginas');
        }

        if (!moment(registrationDate).isValid()
            || !moment(registrationDate).isValid()) {
            throw new Error('Informe uma data válida');
        }
    }

    function handleBack() {
        history.push(`/books`);
    }

    useEffect(() => {
        async function getBook() {
            try {
                const res = await api.get(`books/${id}`);

                if (res.data.author) {
                    setTitle(res.data.title);
                    setAuthor(res.data.author);
                    setDescription(res.data.description);
                    setPages(res.data.pages);
                    setRegistrationDate(res.data.registration_at);
                } else {
                    Swal.fire(res.data.message, '', 'error');
                }
            } catch (err) {
                Swal.fire(err, '', 'error');
            }
        }

        if (id !== undefined) getBook();
    }, [id]);

    return (
        <Form>
            <Card className="bg-dark-2 text-white">
                <Card.Header className="p-3">
                    <div className="navbar h-auto p-0">
                        <div>
                            <h5 className="m-0">Cadastrar livro</h5>
                        </div>
                        <div>
                            <Button variant="dark"
                                onClick={handleBack}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Título</Form.Label>
                                <Form.Control
                                    defaultValue={title}
                                    className="p-2"
                                    type="text"
                                    placeholder="Título do livro"
                                    onChange={handleChangeTitle} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Autor</Form.Label>
                                <Form.Control
                                    defaultValue={author}
                                    className="p-2"
                                    type="text"
                                    placeholder="Autor do livro"
                                    onChange={handleChangeAuthor} />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control as="textarea"
                                    defaultValue={description}
                                    className="p-2"
                                    type="text"
                                    placeholder="Descrição do livro"
                                    onChange={handleChangeDescription} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Número de páginas</Form.Label>
                                <Form.Control
                                    defaultValue={pages}
                                    className="p-2"
                                    type="number"
                                    placeholder="Número de páginas"
                                    onChange={handleChangePages} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Data de cadastro</Form.Label>
                                <Form.Control
                                    defaultValue={registrationDate}
                                    className="p-2"
                                    type="date"
                                    placeholder="Data de cadastro"
                                    onChange={handleChangeRegistrationDate} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer className="p-3">
                    <Button variant="primary"
                        className="text-uppercase"
                        type="button" onClick={handleSave}>
                        Salvar
                    </Button>
                </Card.Footer>
            </Card>
        </Form>
    );
}