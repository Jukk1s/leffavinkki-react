import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useLocation} from "react-router-dom";

import Comments from './Comments'

const server = "http://localhost:8081";

function calculateStatus(data){
    let r = Number(data[1].reviews);
    if(r > 10)
        return "Tunnustelija";
    if(r > 25)
        return "Herkistelijä";
    if(r > 50)
        return "Nautiskelija";
    if(r > 100)
        return "Minä tiedän elokuvista";
    if(r > 200)
        return "Poppari mies";
    if(r > 500)
        return "Leffanörtti, mestari";
    return "Amatööri";
}

const User = () => {
    const [isLoading, setLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [userComments, setUserComments] = useState();

    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');

    useEffect(()=>{
        if(id!==null&&id!==undefined){
            (async() => {
                try{
                    const response = await axios.get(server+"/user?id="+id)
                    if(response.data){
                        setUserData(response.data);
                        setLoading(false);
                    }
                    const comments = await axios.get(server+"/usercomments?id="+id)
                    if(comments.data){
                        setUserComments(comments.data)
                    }
                } catch (error){

                }
            })()
        }
    }, []);

    if(isLoading){
        return <div className="profile">Ladataan...</div>
    }

    return (
        <div className="profile">
            <h1>Nimi: {userData[0].name}</h1>
            <h1>Titteli: {userData[0].status}</h1>
            <h1>Kuvaus: {userData[1].description}</h1>
            <h1>Arvostelut: {userData[1].reviews}</h1>
            <h1>Status: {calculateStatus(userData)}</h1>
            <Comments data={userComments}/>
        </div>
    )

}

export default User;