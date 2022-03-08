import React from 'react'
import '../comments.css'

const SingleComment = (data) => {
    const href = "/user?id="+data.data.users_id;
    return(
        <div className='comment'>
            <a href={href}>
                <h3>{data.data.name}</h3>
            </a>
            <h3>
                {data.data.movie_title}
            </h3>

            <h3>
                {data.data.header}
            </h3>
            <h3>
                {data.data.comment}
            </h3>
            <h3>
                {data.data.date}
            </h3>
            <h3 className="ratingStars">
                * * * * *
            </h3>
        </div>
    )
}

export default SingleComment;