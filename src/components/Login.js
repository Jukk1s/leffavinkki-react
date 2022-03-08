import React, {useState} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import {render} from "react-dom";

const Login = () => {
    const loginUrl = 'http://localhost:8081/users/login'
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})

    const handleSubmit = async(event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        const newErrors = findFormErrors();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else return;

        try {
            await axios.post(loginUrl, {
                name: form.formName.value,
                password: form.formPassword.value
            }).then((response) => {
                if(response.status === 200){
                    localStorage.setItem('accessToken', response.data.accesstoken);
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

    const setField = (field, value) => {
        setForm({
            [field]: value
        })
    }

/*
    function saveLoginInfo(token, username, email, id) {
        if (token != null) {
            console.log(token+username+email);
            localStorage.setItem("auth-token",token);
            localStorage.setItem("logged-user",username);
            localStorage.setItem("logged-email",email);
            localStorage.setItem("logged-id", id);
            window.open(nodeServer+"?welcome=true","_self");

        } else {
            errorField.innerHTML = "Väärä käyttäjätunnus tai salasana.";
        }

    } */

    const findFormErrors = () => {
        const {name, password} = form
        const newErrors = {}
        if ( !name || name === '' ) newErrors.name = 'Anna käyttäjänimi'
        else if ( !password || password === '' ) newErrors.password = 'Anna salasana'

        return newErrors;
    }

    const logOut = (event) => {
        localStorage.setItem("auth-token", null);
        localStorage.setItem("logged-user", null);
        localStorage.setItem("logged-email", null);
        localStorage.setItem("logged-id", null);

        document.getElementById("logform").style.visibility = "visible";
        document.getElementById("logOutBtn").style.visibility = "hidden";
    }

    return (
        <body>
        <div id="logregdiv" class="logreg_text">
            <Form id="logform"
                  noValidate
                  onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label class="label">Käyttäjänimi</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            class="input"
                            onChange={e => setField('username',e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
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
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Button id="logInBtn"type="submit">
                    Kirjaudu
                </Button>

                <div id="errorMessage"></div>
            </Form>

            <button id="logOutBtn" onClick={logOut} value="Kirjaudu ulos">Kirjaudu ulos</button>
        </div>
        </body>
    )
    render(<Login />)
}

export default Login