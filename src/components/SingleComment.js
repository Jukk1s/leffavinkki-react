import React from 'react'
import '../comments.css'

const SingleComment = (data) => {
    return(
        <div className='comment'>
            <h3>
                {data.data.name}
            </h3>
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
        </div>
    )
}

export default SingleComment;