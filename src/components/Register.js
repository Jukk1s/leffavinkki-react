import React, {useState} from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

const Register = () => {
    const loginUrl = 'http://localhost:8081/users/register'
    const [validated, setValidated] = useState(false)

    const handleSubmit = async(login) => {
        login.preventDefault()
        login.stopPropagation()
        const form = login.currentTarget;
        if(form.checkValidity() === false){
            setValidated(true);
            return
        }
        try {
            await axios.post(loginUrl, {
                email: form.formEmail.value,
                name: form.formName.value,
                password: form.formPassword.value
            }).then(resp => {
                if(resp.status === 200){
                    localStorage.setItem('accessToken', resp.data.accessToken);
                    console.log("Successful login attempt");
                } else {
                    console.log("Error with login")
                }
            });
        } catch (e){
            console.error(e);
        }
        form.reset()
    }

    return (
        <div className="container">
            <div>
                <p>Rekisteröidy</p>
            </div>
            <div>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Käyttäjänimi</Form.Label>
                        <InputGroup>
                            <Form.Control
                                required
                                type="text"
                                placeholder="matti69"
                            />
                            <Form.Control.Feedback type="invalid">
                                Syötä käyttäjänimi
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Sähköpostiosoite</Form.Label>
                        <InputGroup>
                            <Form.Control
                                required
                                type="email"
                                placeholder="esimerkki@sposti.fi"
                            />
                            <Form.Control.Feedback type="invalid">
                                Syötä sähköpostiosoite
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Salasana</Form.Label>
                        <InputGroup>
                            <Form.Control
                                required
                                type="password"
                                placeholder=""
                            />
                            <Form.Control.Feedback type="invalid">
                                Syötä salasana
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Button type="submit">
                        Rekisteröidy
                    </Button>
                </Form>

            </div>
        </div>
    )
}

export default Register