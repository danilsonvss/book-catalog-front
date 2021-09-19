import { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import * as moment from 'moment';
import api from "../api";
import { useHistory, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPen } from "@fortawesome/free-solid-svg-icons";

export default function BookView(props) {
    const { id } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [pages, setPages] = useState();
    const [registrationDate, setRegistrationDate] = useState('');

    function handleEdit() {
        history.push(`/books/${id}/edit`);
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
                    throw new Error(res.data.message);
                }
            } catch (err) {
                Swal.fire('Atenção', err, 'error');
            }
        }

        if (id !== undefined) getBook();
    }, [id]);

    return (
        <Form>
            <Card className="bg-dark border-0 text-white">
                <Card.Header className="bg-dark p-0">
                    <div className="navbar h-auto p-0">
                        <div>
                            <h5 className="m-0">{title}</h5>
                            <div>
                                <small>{author}</small>
                            </div>
                        </div>
                        <div>
                            <Button variant="dark"
                                className="me-3"
                                onClick={handleBack}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                            </Button>
                            <Button variant="dark"
                                onClick={handleEdit}
                            >
                                <FontAwesomeIcon icon={faPen} /> Alterar livro
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="mt-3 mb-5 p-0 bg-dark border-0">
                    <p>{description}</p>
                </Card.Body>
                <Card.Footer className="p-0 bg-dark border-0">
                    <div>
                        <small>Data de cadastro: {moment(registrationDate).format('DD/MM/YYYY')}</small>
                    </div>
                    <div>
                        <small>Número de páginas: {pages}</small>
                    </div>
                </Card.Footer>
            </Card>
        </Form>
    );
}