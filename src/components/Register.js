import React, {useState} from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import '../LogReg.css'

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
                    console.log("Rekisteröinti onnistui!");
                } else {
                    console.log("Virhe rekisteröinnissä.")
                }
            });
        } catch (e){
            console.error(e);
        }
        form.reset()
    }

    return (
        <body>
        <div  id="logregdiv" class="logreg_text">

            <div>
                <Form id="logform" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName" >
                        <Form.Label class="label">Käyttäjänimi</Form.Label>
                        <InputGroup>
                            <Form.Control
                                required
                                class="input"
                                type="text"
                                placeholder="matti69"
                            />
                            <Form.Control.Feedback type="invalid">
                                Syötä käyttäjänimi
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label class="label">Sähköpostiosoite</Form.Label>
                        <InputGroup>
                            <Form.Control
                                required
                                class="input"
                                type="email"
                                placeholder="esimerkki@sposti.fi"
                            />
                            <Form.Control.Feedback type="invalid">
                                Syötä sähköpostiosoite
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label class="label">Salasana</Form.Label>
                        <InputGroup>
                            <Form.Control
                                required
                                class="input"
                                type="password"
                                placeholder=""
                            />
                            <Form.Control.Feedback type="invalid">
                                Syötä salasana
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Button id="regbutton" type="submit">
                        Rekisteröidy
                    </Button>
                </Form>

            </div>
        </div>
        </body>
    )
}

export default Register