import React from 'react'
import axios from "axios";
import {useLocation} from "react-router-dom";

let review = 0;
let starArray = [];



const ReviewField = () => {
    const search = useLocation().search;

    const selectRating = (givenReview) => {
        try{
            checkArray();
            starArray.forEach(s => {
                s.classList.remove('starHighlight')
            })
            console.log('VALITTIIN JOKU')
            for(let i = givenReview-1; i>=0; i--){
                starArray[i].classList.add('starHighlight')
            }
            review = givenReview
        } catch (e) {

        }
    }

    const hoverRating = (givenReview) => {
        try{
            checkArray();
            for(let i = givenReview -1; i>=0; i--){
                starArray[i].classList.add('starHighlight')
            }
        } catch(e) {

        }
    }

    const back = () => {
        try{
            checkArray();
            starArray.forEach(s => {
                s.classList.remove('starHighlight')
            })
            for(let i = 0; i < review; i++){
                starArray[i].classList.add('starHighlight')
            }
        } catch(e){

        }
    }

    const checkArray = () => {
        if(starArray.length<1 || starArray[0] === null){
            starArray = [
                document.getElementById('rStar1'),
                document.getElementById('rStar2'),
                document.getElementById('rStar3'),
                document.getElementById('rStar4'),
                document.getElementById('rStar5')
            ]
        }
    }

    const giveReview = async() => {
        let movieId;
        const url = "http://localhost:8081/movies/addrating";
        const userId = localStorage.getItem('user_id')
        const token = localStorage.getItem("accessToken");
        try {
            movieId = new URLSearchParams(search).get('id')
            await axios.post(url, {
                rating: review,
                movie_id: movieId
            },{ headers: {'Authorization': 'Bearer: ' + token}
            }).then((response) => {
                if(response.status === 200){
                    console.log("Comment successfully posted");
                } else {
                    console.log("Error with posting comment")
                }
                window.location.reload();
            });
        } catch (e){
            console.error(e);
        }
    }

    return(
        <div id="reviewField">
            <h2>Anna elokuvalle arvosana</h2>
            <div id="reviewStarField">
                <button onClick={() => selectRating(1)} onMouseEnter={() => hoverRating(1)} onMouseLeave={back} id="rStar1">*</button>
                <button onClick={() => selectRating(2)} onMouseEnter={() => hoverRating(2)} onMouseLeave={back} id="rStar2">*</button>
                <button onClick={() => selectRating(3)} onMouseEnter={() => hoverRating(3)} onMouseLeave={back} id="rStar3">*</button>
                <button onClick={() => selectRating(4)} onMouseEnter={() => hoverRating(4)} onMouseLeave={back} id="rStar4">*</button>
                <button onClick={() => selectRating(5)} onMouseEnter={() => hoverRating(5)} onMouseLeave={back} id="rStar5">*</button>
            </div>
            <button onClick={giveReview} id="reviewButton">Arvostele</button>
        </div>
    )

}

export default ReviewField;