import React, {useEffect, useState} from 'react';
import MoviesContainer from "./MoviesContainer";
import '../css/profile.css'
import '../index.css'
import notFoundImage from '../img/poster_holder.jpg'

const MOVIE_STORAGE_KEY = "lastSearch"

const Home = () => {
    const [movies, setMovies] = useState([])
    const [moviesFound, setMoviesFound] = useState(false)



    useEffect(()=>{
        try{
            const storedMovies = JSON.parse(localStorage.getItem(MOVIE_STORAGE_KEY))
            if(storedMovies) {
                setMovies(storedMovies)
                if(storedMovies.length>0)
                    setMoviesFound(true)
            }
        } catch (error){

        }


    }, [])

    useEffect(()=>{
        localStorage.setItem(MOVIE_STORAGE_KEY, JSON.stringify(movies))
    }, [movies])




    return (
        moviesFound?
        <div className="container">

            <MoviesContainer movies={movies}/>
        </div> :
            <div>
                <h2 className="centerText">Tervetuloa LeffaVinkkiin!</h2>
                <h3 className="centerText">Suorita ensimmäinen hakusi kiitos :)</h3>
                <img id="noFoundMovie" src={notFoundImage}/>
            </div>
    );
}

export default Home