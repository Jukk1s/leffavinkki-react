import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import MoviesContainer from "./MoviesContainer";
import {removeAekkoset, getMovies} from "../scripts/movie-functions"

const MOVIE_STORAGE_KEY = "lastSearch"
const pagesToLoad = 3;

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

    const searchMovie = async(event) => {
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

            const result = await getMovies(name,movieYear,pagesToLoad).then(resp=>{
                setMovies(resp)
            })
            console.log(result)

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
                <Form noValidate validated={validated} onSubmit={searchMovie}>
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