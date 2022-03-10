import React, {useEffect,useState} from 'react'
import {useLocation} from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import CommentField from "./CommentField";

const server = "http://localhost:8081";
const movieSearchUrl = "/movies";
const movieCommentsUrl = "/movies/getcomments?id=";
const movieReviewsUrl = "/movies/getreviews?id=";

const Movie = () => {

    const [isLoading, setLoading] = useState(true);
    const [movieComments, setMovieComments] = useState();
    const [movieData, setMovieData] = useState();
    const [isSignedIn, setIsSignedIn] = useState(false);

    const search = useLocation().search;
    const movieId = new URLSearchParams(search).get('id');

    useEffect(()=>{
        if (localStorage.getItem('accessToken') !== null) {
            setIsSignedIn(true);
        }

        if(movieId!==undefined){

            (async() => {
                try{

                    await axios.post(server+movieSearchUrl, {
                        plot: "full",
                        i: movieId
                    }).then(resp => {
                        if(resp.status === 200){
                            const data = resp.data
                            console.log(data)
                            localStorage.setItem("movieData", JSON.stringify(data))
                            setMovieData(data)
                        } else {
                            console.log("Virhe elokuvien hakemisessa.")
                        }
                    });
                    setLoading(false)
                    const comments = await axios.get(server+movieCommentsUrl+movieId)
                    console.log(server+movieCommentsUrl+movieId)
                    if(comments.data){
                        console.log(comments.data)
                        setMovieComments(comments.data)
                    }
                } catch (error){
                    console.log("error")
                }
            })()
        }
    }, []);

    if(isLoading){
        return <div className="profile">Ladataan...</div>
    }

    return (
        isSignedIn? (
                <div className="profile">
                    <h1>Nimi: {movieData.Title}</h1>
                    <h1>IMDB-arvostelu: {movieData.imdbRating}/10</h1>
                    <h1>Pituus: {movieData.Runtime}</h1>
                    <h1>Genre: {movieData.Genre}</h1>
                    <h1>Ohjaaja: {movieData.Director}</h1>
                    <h1>Kirjoittaja: {movieData.Writer}</h1>
                    <h1>Näyttelijät: {movieData.Actors}</h1>
                    <h1>Metascore: {movieData.Metascore}</h1>
                    <img src={movieData.Poster}/>
                    <h1>Juoni: {movieData.Plot}</h1>
                    <Comments data={movieComments}/>
                    <CommentField data={movieData}/>
                </div>

        ) : (
                <div className="movieOwnDiv">
                    <h1 className="movieTitle">{movieData.Title}</h1>


                    <div className="movieDisplay">
                        <div className="movieDisplayLeft">
                            <h3 className="movieDetailsText">Ohjaaja: {movieData.Director}</h3>
                            <h3 className="movieDetailsText">Kirjoittaja: {movieData.Writer}</h3>
                            <h3 className="movieDetailsText">Näyttelijät: {movieData.Actors}</h3>
                            <h3 className="movieDetailsText">Metascore: {movieData.Metascore}</h3>
                        </div>
                        <div className="movieDisplayRight">
                            <img className="moviePagePoster" src={movieData.Poster}/>
                        </div>
                    </div>

                    <div className="movieInfo">
                        <h3 className="movieInfoText">IMDB-arvostelu: {movieData.imdbRating}/10</h3>
                        <h3 className="movieInfoText">Pituus: {movieData.Runtime}</h3>
                        <h3 className="movieInfoText">Genre: {movieData.Genre}</h3>
                    </div>

                    <div className="movieDescription">
                        <p className="movieDescriptionText">Juoni: {movieData.Plot}</p>
                    </div>

                    <Comments data={movieComments}/>
                </div>
        )

    )

}

export default Movie;