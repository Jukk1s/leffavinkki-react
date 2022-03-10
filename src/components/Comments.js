import React, {useState,useEffect} from 'react';
import SingleComment from "./SingleComment";

const server = "http://localhost:8081";

export default function Comments ({data}) {
    //data.map(comment=>{
    if(data!==undefined)
        return(
            <div className="comments">
                {
                    data.map(comment=>{
                        return <SingleComment data={comment}/>
                    }).reverse()
                }
            </div>
        )
    else
        return(
            <div>

            </div>
        )
}