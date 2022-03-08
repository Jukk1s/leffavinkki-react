import React from 'react'
import MovieDisplay from "./MovieDisplay";

export default function MoviesContainer({movies}) {
    if(movies!= null)
        return(
            <div id="resultField">{
                movies.map(movie => {
                return <MovieDisplay movieData={movie}/>
            })}
            </div>

        )
    else
        return(
            <div>
                <h1>Ei valitettavasti löytynyt elokuvia</h1>
            </div>
        )
}