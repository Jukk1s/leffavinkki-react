import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useLocation} from "react-router-dom";

import Comments from './Comments'

import "../css/profile.css"

import profilePicture from "../img/profile.png"

const server = "http://localhost:8081";

const profileUpdateUrl = "http://localhost:8081/users/edit";

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
    const [isOwnProfile, setIsOwnProfile] = useState(false)

    const [profileFound, setProfileFound] = useState(false);

    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');

    useEffect(()=>{
        if(id!==null&&id!==undefined){
            (async() => {
                try{
                    const response = await axios.get(server+"/user?id="+id)
                    if(response.data){
                        if (response.data[0].name) {
                            setUserData(response.data);
                            setProfileFound(true);
                            const comments = await axios.get(server+"/usercomments?id="+id)
                            if(comments.data){
                                setUserComments(comments.data)
                            }
                        }
                    }

                } catch (error){

                }
            })()
        }

        setLoading(false);
    }, []);

    useEffect(()=>{
        const token = localStorage.getItem('accessToken')
        const userId = localStorage.getItem('user_id')
        if(token&&userId && id === userId)
                setIsOwnProfile(true)

    })

    if(isLoading){
        return <div className="profile">Ladataan...</div>
    }

    const updateProfile = async() => {
        console.log(document.getElementById('statusTextArea').value.replace(/[\-[\]\\'/"]/g, "\\$&"))
        try {
            await axios.post(profileUpdateUrl, {
                description: document.getElementById('statusTextArea').value.replace(/[\-[\]\\'/"]/g, "\\$&"),
                token: localStorage.getItem('accessToken')
            }, { headers: {'Authorization': 'Bearer: ' + localStorage.getItem('accessToken')}}).then((response)=>{
                document.location.reload()
            })
        } catch (e){
            console.log(e)
        }
    }

    return (
        profileFound? (
            <div>
                <div className="profile" id="top">
                    <div id="profiilitekstit">
                        <h1 id="name">Nimi: {userData[0].name}</h1>
                        <h3 id="title">Titteli: {userData[0].status}</h3>

                    </div>
                    <img id="profilePicture" src={profilePicture}/>
                </div>
                <div id="middle">

                    <div className="sideL">
                        <h1/>
                    </div>

                    <div className="middle">

                        <h2 className="silver textCenter">Minusta</h2>
                        <h4 id="description" className="textCenter, white">{userData[1].description}</h4>

                        {
                            isOwnProfile?<><textarea id="statusTextArea" placeholder={userData[1].description}></textarea><button onClick={updateProfile} id="editButton">Päivitä</button></>:<></>
                        }


                        <h2 id="reviewsCount" className="reviewsCount">Kommentit</h2>
                        <Comments data={userComments}/>
                    </div>


                    <div className="sideR">
                        <div id="info">
                            <h3>Status</h3>
                            <h5 id="status">{calculateStatus(userData)}</h5>
                            <h3>Katsotuimmat genret</h3>
                            <h5 id="mostViewed">Genret joita käyttäjä eniten arvostellut (ei implementoitu)</h5>
                            <h3>Arvostelut</h3>
                            <h5 id="reviewsC">{userData[1].reviews}</h5>
                            <h3>Kommentit</h3>
                            <h5 id="commentCount" className="reviewsCount">Kommenttien lukumäärä</h5>
                        </div>
                    </div>

                </div>
            </div>

        ) : (
            <div>
                <h1 className="white textCenter">Profiilia ei löytynyt</h1>
            </div>
        )
    )

}

export default User;