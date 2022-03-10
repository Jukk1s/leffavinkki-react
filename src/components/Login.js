import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

const Login = () => {
    document.title = 'LeffaVinkki - Kirjaudu'
    const loginUrl = 'http://localhost:8081/users/login'
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})
    const [isSignedIn, setIsSignedIn] = useState(false)

    const handleSubmit = async(event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        const newErrors = findFormErrors();
        console.log(newErrors)
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            await axios.post(loginUrl, {
                name: form.formName.value,
                password: form.formPassword.value
            }).then((response) => {
                console.log(response.data)
                if(response.status === 200){
                    localStorage.setItem('accessToken', response.data.accesstoken);
                    localStorage.setItem('user_id', response.data.id);
                    localStorage.setItem('username', response.data.username);
                    console.log("Kirjautuminen onnistui");
                    setIsSignedIn(true);
                    window.open("/","_self")
                } else {
                    console.log("Virhe kirjautumisessa")
                }
            });
        } catch (e){
            console.error(e);
        }
        form.reset()
    }

    useEffect(()=>{
        const token = localStorage.getItem('accessToken')
        const userId = localStorage.getItem('user_id')
        if(token&&userId)
            setIsSignedIn(true)
    })

    const setField = (field, value) => {
        setForm({
            ...form,
            [field]: value
        })
        console.log(form)
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
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        setIsSignedIn(false);
        window.location.reload(false);
    }

    return (
        isSignedIn? (
            <body>
            <div id="logregdiv" className="logreg_text">
                <button id="logOutBtn" onClick={logOut} value="Kirjaudu ulos">Kirjaudu ulos</button>
            </div>
            </body>
        ) : (
            <body>
            <div id="logregdiv" className="logreg_text">
            <Form id="logform"
                  noValidate
                  onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label class="label">Käyttäjänimi</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            class="input"
                            onChange={e => setField('name', e.target.value)}
                        />
                        <Form.Control.Feedback style={{ color: 'red' }} type="invalid">
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
                            onChange={e => setField('password', e.target.value)}
                        />
                        <Form.Control.Feedback style={{ color: 'red' }} type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Button id="logInBtn" type="submit">
                    Kirjaudu
                </Button>

                <div id="errorMessage"></div>
            </Form>
        </div>
        </body>
        )

    )
}

export default Login