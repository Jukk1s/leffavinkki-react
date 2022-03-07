import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'


const Login = () => {
    const loginUrl = 'http://localhost:8081/users/login'
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
/*
const Login = () => {
    const [new]

    $('#logform').submit(function(e){
        e.preventDefault();

        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        var formData =  '{"email":"' + email + '", "password":"' + password + '"}';
        var jsonFormData = JSON.parse(formData);

        var xhr=$.ajax({
            url: nodeServer + '/users/login',
            type: 'post',
            data: jsonFormData,
            success:function(){
                saveLoginInfo(xhr.getResponseHeader("auth-token"),xhr.getResponseHeader("username"),xhr.getResponseHeader("email"),xhr.getResponseHeader("id"));

            }
        });
    });
*/ /*
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

    const logOut = (event) => {
        localStorage.setItem("auth-token", null);
        localStorage.setItem("logged-user", null);
        localStorage.setItem("logged-email", null);
        localStorage.setItem("logged-id", null);

        document.getElementById("logform").style.visibility = "visible";
        document.getElementById("logOutBtn").style.visibility = "hidden";
    }

    return (
        <div id="logregdiv">
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
                    Kirjaudu
                </Button>
            </Form>

            <button id="logOutBtn" onClick={logOut} value="Kirjaudu ulos">Kirjaudu ulos</button>
        </div>
    )
}

export default Login