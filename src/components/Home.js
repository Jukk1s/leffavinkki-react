import React, {useEffect, useState} from 'react';
import MoviesContainer from "./MoviesContainer";
import '../index.css'

const MOVIE_STORAGE_KEY = "lastSearch"

const Home = () => {
    const [movies, setMovies] = useState([])

    useEffect(()=>{
        const storedMovies = JSON.parse(localStorage.getItem(MOVIE_STORAGE_KEY))
        if(storedMovies) setMovies(storedMovies)
    }, [])

    useEffect(()=>{
        localStorage.setItem(MOVIE_STORAGE_KEY, JSON.stringify(movies))
    }, [movies])


    return (
        <div className="container">

            <MoviesContainer movies={movies}/>
        </div>
    );
}

export default Home