import React, {useState} from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import '../LogReg.css'

const Register = () => {
    const loginUrl = 'http://localhost:8081/users/register'
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})

    const handleSubmit = async(event) => {
        const form = event.currentTarget;
        event.preventDefault()
        event.stopPropagation()

        const newErrors = findFormErrors();
        console.log(newErrors)
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
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
        setErrors(newErrors)
    }

    const setField = (field, value) => {
        setForm({
            ...form,
            [field]: value
        })
        console.log(form)
    }

    const findFormErrors = () => {
        const {name, email, password} = form
        let newErrors = {}
        if ( !name || name === '' ) newErrors.name = 'Anna käyttäjänimi'
        else if ( !email || email === '' ) newErrors.email = 'Anna sähköposti'
        else if ( !password || password === '' ) newErrors.password = 'Anna salasana'

        return newErrors;
    }

    return (
        <body>
        <div  id="logregdiv" class="logreg_text">

            <div>
                <Form id="logform" noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName" >
                        <Form.Label class="label">Käyttäjänimi</Form.Label>
                        <InputGroup>
                            <Form.Control
                                required
                                class="input"
                                type="text"
                                onChange={e => setField('name',e.target.value)}
                            />
                            <Form.Control.Feedback style={{ color: 'red' }} type="invalid">
                                {errors.name}
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
                                onChange={e => setField('email',e.target.value)}
                            />
                            <Form.Control.Feedback style={{ color: 'red' }} type="invalid">
                                {errors.email}
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
                                onChange={e => setField('password',e.target.value)}
                            />
                            <Form.Control.Feedback style={{ color: 'red' }} type="invalid">
                                {errors.password}
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