import React from 'react'
import place_holder from '../img/poster_holder.jpg'

const MovieDisplay = ({movieData}) => {
    let image = movieData.Poster
    if(image==null || image == undefined || image == 'N/A')
        image=place_holder

    const href="/movie?id="+movieData.imdbID;

    return(
        <div className='movieDiv'>
            <a href={href}>
                <h3 className="movieDisplayName">
                    {movieData.Title}
                </h3>
                <img className="poster" src={image}/>
            </a>
        </div>
    )
}

export default MovieDisplay