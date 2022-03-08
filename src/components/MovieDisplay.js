import React from 'react'
import place_holder from '../img/poster_holder.jpg'
import { useNavigate } from "react-router-dom";
const movieUrl = "http://localhost:3000/movie?id=";

const MovieDisplay = ({movieData}) => {
    const navigate = useNavigate();
    let image = movieData.Poster
    const link = movieUrl+movieData.imdbID;
    if(image==null || image == undefined || image == 'N/A')
        image=place_holder

    const goToMovie = () => {
        navigate("/movie?id="+movieData.imdbID);
    }

    return(
        <div className='movieDiv'>
            <div onClick={goToMovie}>
                <h3>
                    {movieData.Title}
                </h3>
                <img className="poster" src={image}/>
            </div>
        </div>
    )
}

export default MovieDisplay