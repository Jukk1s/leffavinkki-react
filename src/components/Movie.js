import React, {useEffect,useState} from 'react'
import {useLocation} from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import CommentField from "./CommentField";
import ReviewField from "./ReviewField"
import place_holder from '../img/poster_holder.jpg'

const server = "http://localhost:8081";
const movieSearchUrl = "/movies";
const movieCommentsUrl = "/movies/getcomments?id=";
const movieReviewsUrl = "/movies/getreviews?id=";

const Movie = () => {

    const [isLoading, setLoading] = useState(true);
    const [movieComments, setMovieComments] = useState();
    const [movieRatings, setMovieRatings] = useState([]);
    const [movieAverage, setMovieAverage] = useState();
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
                            document.title = 'LeffaVinkki - '+resp.data.Title

                            setMovieData(data)
                        } else {
                            console.log("Virhe elokuvien hakemisessa.")

                            document.title = 'LeffaVinkki'
                        }
                    });
                    setLoading(false)
                    const comments = await axios.get(server+movieCommentsUrl+movieId)
                    console.log(server+movieCommentsUrl+movieId)
                    if(comments.data){
                        console.log(comments.data)
                        setMovieComments(comments.data)
                    }
                    await axios.get(server+movieReviewsUrl+movieId).then(resp => {
                        console.log('REVIEWS: ', resp.data)
                        setMovieRatings(resp.data)
                        let sum = 0;
                        for(let i = 0; i < resp.data.length; i++){

                            sum += resp.data[i].review
                        }
                        setMovieAverage(sum/resp.data.length)
                    })

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
                            <img className="moviePagePoster" src={movieData.Poster} onError={(e)=>{e.target.onerror = null; e.target.src=place_holder}} />
                        </div>
                    </div>

                    <div className="movieInfo">
                        <h3 className="movieInfoText">LeffaVinkki: {movieAverage}/5 ({movieRatings.length} ääntä)</h3>
                        <h3 className="movieInfoText">IMDB-arvostelu: {movieData.imdbRating}/10</h3>
                        <h3 className="movieInfoText">Pituus: {movieData.Runtime}</h3>
                        <h3 className="movieInfoText">Genre: {movieData.Genre}</h3>
                    </div>

                    <div className="movieDescription">
                        <p className="movieDescriptionText">{movieData.Plot}</p>
                    </div>
                    {
                        isSignedIn ? <>
                            <ReviewField></ReviewField>
                            <CommentField className="newCommentField" data={movieData}/>
                        </>:<></>
                    }

                    <Comments data={movieComments}/>
                </div>
    )

}

export default Movie;