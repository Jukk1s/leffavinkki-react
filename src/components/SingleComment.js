import React from 'react'
import '../comments.css'

const SingleComment = (data) => {
    const href = "/user?id="+data.data.users_id;
    const hrefMovie = "/movie?id="+data.data.movie_id;
    return(
        <div className='comment'>
            <a href={hrefMovie}>
                <h3 className="movieTitleText">
                    {data.data.movie_title}
                </h3>
            </a>

            <h4 className="commentHeaderText">
                {data.data.header}
            </h4>
            <p className="commentText">
                {data.data.comment}
            </p>
            <a className="authorText" href={href}>
                <h3>{data.data.name}</h3>
            </a>
            <h5 className="dateText">
                {data.data.date}
            </h5>
            <h3 className="ratingStars">
                * * * * *
            </h3>
        </div>
    )
}

export default SingleComment;