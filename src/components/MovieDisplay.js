import React from 'react'
import place_holder from '../img/poster_holder.jpg'
const movieUrl = "http://localhost:3000/movie?id=";

const MovieDisplay = ({movieData}) => {
    let image = movieData.Poster
    const link = movieUrl+movieData.imdbID;
    if(image==null || image == undefined || image == 'N/A')
        image=place_holder
    return(
        <div class='movieDiv'>
            <a href={link}>
                <h3>
                    {movieData.Title}
                </h3>
                <img src={image}/>
            </a>
        </div>
    )
}

export default MovieDisplay