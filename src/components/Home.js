import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import MoviesContainer from "./MoviesContainer";

const MOVIE_STORAGE_KEY = "lastSearch"
const pagesToLoad = 3;

function removeAekkoset(str){
    console.log(str);
    str = str.replace(/ä/g, 'a');
    console.log("-->"+str);
    str = str.replace(/ö/g, 'o');
    console.log("-->"+str);
    return str;
}

const Home = () => {
    const [movies, setMovies] = useState([])

    useEffect(()=>{
        const storedMovies = JSON.parse(localStorage.getItem(MOVIE_STORAGE_KEY))
        if(storedMovies) setMovies(storedMovies)
    }, [])

    useEffect(()=>{
        localStorage.setItem(MOVIE_STORAGE_KEY, JSON.stringify(movies))
    }, [movies])

    const movieUrl = 'http://localhost:8081/movies'
    const [validated, setValidated] = useState(false)

    const getMovies = async(event) => {
        event.preventDefault()
        event.stopPropagation()
        const form = event.currentTarget;
        if(form.checkValidity() === false){
            setValidated(true);
            return
        }
        try {
            let year = Number(form.formYear.value);
            let movieYear = null;
            if(year > 1800 && Number.isInteger(year)){
                movieYear = year;
            }

            let name = removeAekkoset(form.formName.value.toLowerCase().replace(/  +/g, '%20').replace(/[\-[\]\\'/"]/g, "\\$&"));

            console.log(name, movieYear)

            await axios.post(movieUrl, {
                s: name,
                y: movieYear,
                page: pagesToLoad
            }).then(resp => {
                if(resp.status === 200){
                    console.log("Elokuvien haku onnistui!");
                    const perse = resp.data
                    console.log(perse.Search)
                    setMovies(perse.Search)
                } else {
                    console.log("Virhe elokuvien hakemisessa.")
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
                <p>Elokuvien haku</p>
            </div>
            <div>
                <Form noValidate validated={validated} onSubmit={getMovies}>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Elokuvan nimi</Form.Label>
                        <InputGroup>
                            <Form.Control
                                required
                                type="text"
                                placeholder="elokuva"
                            />
                            <Form.Control.Feedback type="invalid">
                                Syötä elokuvan nimi
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formYear">
                        <Form.Label>Vuosi</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                placeholder="2021"
                            />
                        </InputGroup>
                    </Form.Group>

                    <Button type="submit">
                        Hae
                    </Button>
                </Form>

            </div>

            <MoviesContainer movies={movies}/>
        </div>
    );
}

export default Home