import React from 'react'
import '../comments.css'
import {useNavigate} from "react-router-dom";

const SingleComment = (data) => {
    const navigate = useNavigate();

    const goToProfile = () => {
        navigate("/user?id="+data.data.id);
    }

    return(
        <div className='comment'>
            <h3 onClick={goToProfile}>
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