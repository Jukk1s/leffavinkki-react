import React from 'react'
import MovieDisplay from "./MovieDisplay";

export default function MoviesContainer({movies}) {
    if(movies!= null || movies!= undefined)
        return(
            <div class="movies">{
                movies.map(movie => {
                return <MovieDisplay movieData={movie}/>
            })}
            </div>

        )
    else
        return(
            <div>
                <h1>VITTU</h1>
            </div>
        )
}