import React from 'react'
import place_holder from '../img/poster_holder.jpg'

const MovieDisplay = ({movieData}) => {
    let image = movieData.Poster
    if(image==null || image == undefined || image == 'N/A')
        image=place_holder
    return(
        <div class='movieDiv'>
            <h3>
                {movieData.Title}
            </h3>
            <img src={image}/>
        </div>
    )
}

export default MovieDisplay