import React, {useState} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import {useLocation} from "react-router-dom";
import '../css/comments.css'


const CommentField = (movieData) => {
    const commentUrl = 'http://localhost:8081/movies/addcomment'
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})

    const search = useLocation().search;
    let movieId = '';

    const handleSubmit = async(event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        const newErrors = findFormErrors();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else return;

        const token = localStorage.getItem("accessToken");
        try {
            movieId = new URLSearchParams(search).get('id')
            await axios.post(commentUrl, {
                header: form.formHeader.value,
                content: form.formComment.value,
                movieId: movieId,
                movieTitle: movieData.data.Title
            },{ headers: {'Authorization': 'Bearer: ' + token}
                }).then((response) => {
                if(response.status === 200){
                    console.log("Comment successfully posted");
                } else {
                    console.log("Error with posting comment")
                }
                window.location.reload();
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

    const findFormErrors = () => {
        const {header, comment} = form
        const newErrors = {}
        if ( !header || header === '' ) newErrors.header = 'Anna otsikko'
        else if ( !comment || comment === '' ) newErrors.password = 'Anna kommentti'

        return newErrors;
    }

    return (
        /*
        <body>
        <div id="commentsection">
            <h2>Arvostele</h2>
            <div id="giveReview">
                <span id="starR1" className="fa fa-star"></span>
                <span id="starR2" className="fa fa-star"></span>
                <span id="starR3" className="fa fa-star"></span>
                <span id="starR4" className="fa fa-star"></span>
                <span id="starR5" className="fa fa-star"></span>
            </div>
            <h3>Kirjoita kommentti</h3>
            <div className="comment">
                <form align="center" id="commentForm" action="/movies/addcomment" method="post">
                    <input type="text" placeholder="Otsikko" id="newHeading">
                        <input type="text" placeholder="Kommentti" id="newComment">
                            <br>
                                <input className="commentBtn" type="submit" value="Lähetä"/>
                </form>
            </div>
        </body>*/

        <body>
        <div className="comment newCommentField">
            <Form
                id="commentForm"
                noValidate
                onSubmit={handleSubmit}>
                <Form.Group className="mb-3 newCommentFieldInput" controlId="formHeader">
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            cols="50"
                            type="text"
                            class="input"
                            placeholder="Otsikko"
                            onChange={e => setField('header',e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3 newCommentFieldInput" controlId="formComment">
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            rows="10"
                            cols="50"
                            required
                            class="input"
                            type="text"
                            placeholder="Kommentti"
                            onChange={e => setField('comment',e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Button id="commentBtn" type="submit">
                    Lähetä
                </Button>
            </Form>

        </div>
        </body>
    )
}

export default CommentField