import React from 'react'

const MovieDisplay = ({movieData}) => {
    let image = movieData.Poster
    if(image==null || image == undefined || image == 'N/A')
        image="../img/poster_holder.jpg"
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