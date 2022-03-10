import './css/navbar.css'
import React, {useState, useEffect} from 'react'

import logo from './img/leffavinkki.png'

import {
    BrowserRouter as Router,
    Routes, Route, Link, BrowserRouter
} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import User from './components/User'
import Movie from './components/Movie'
import {getMovies, removeAekkoset} from "./scripts/movie-functions";
import axios from "axios";

const MOVIE_STORAGE_KEY = "lastSearch"

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [profile, setProfile] = useState(null)
    const [username, setUsername] = useState('');


    const logOut = (event) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user_id");
        setIsSignedIn(false);
        window.location.reload(false);
        window.open("/","_self")
    }

    useEffect(()=>{
        const token = localStorage.getItem('accessToken')
        const userId = localStorage.getItem('user_id')
        const username = localStorage.getItem('username')
        if(token&&userId) {
            setProfile("/user?id="+userId)
            setUsername(username);
            setIsSignedIn(true)
        }
    })

    const padding = {
        padding: 5
    }

  const searchMovie = async(event) => {
      event.preventDefault()
      event.stopPropagation()
      const searchField = document.getElementById("movieSearch");
      const search = searchField.value
      const testSearch = search.replace(/\s/g, '');
      if(testSearch=="")
          return
      searchField.value = "";
      try {
          let name = removeAekkoset(search.toLowerCase().replace(/  +/g, '%20').replace(/[\-[\]\\'/"]/g, "\\$&"));
          let movieYear = null;

          console.log(name, movieYear)

          const result = await getMovies(name,null,null).then(resp=>{
              localStorage.setItem(MOVIE_STORAGE_KEY, JSON.stringify(resp))
              window.open("/","_self");
          })

      } catch (e){
          console.error(e);
      }
  }

  return (

      <div>
          <Router>
              <ul>
                  <li><Link style={padding} to="/"><a>Koti</a></Link></li>
                  <li>
                      <input
                      id="movieSearch"
                      placeholder="Elokuvan nimi"
                      type="text"
                      onKeyPress={(e)=>{
                          if(e.key==="Enter"){
                              document.getElementById('searchButton').click();
                          }
                      }}
                      />
                  </li>
                  <li><button id="searchButton" onClick={searchMovie}>Etsi</button></li>
                  {
                      isSignedIn ? (
                          <>
                              <li><Link style={padding} to="/login"><a>Kirjaudu ulos</a></Link></li>
                              <li><Link style={padding} to={profile}><a>Profiili</a></Link></li>
                              <li id="welcomeText">Tervetuloa {username}!</li>
                          </>

                      ) : (
                          <>
                              <li><Link style={padding} to="/login"><a>Kirjaudu sisään</a></Link></li>
                              <li><Link style={padding} to="/register"><a>Rekisteröinti</a></Link></li>
                          </>

                      )
                  }
              </ul>


              <Routes>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/user" element={<User/>}/>
                  <Route path="/movie" element={<Movie/>}/>
              </Routes>
          </Router>
          <footer>
              <div id="footer-1">
                  <h4>Ryhmä ykkönen (1, eka)</h4>
                  <h5>Jukka Hallikainen</h5>
                  <h5>Eljas Hirvelä</h5>
                  <h5>Arttu Pösö</h5>
                  <img src={logo}/>
              </div>
              <div id="footer-2">
                  <h4>Leffavinkit jo vuodesta 2021!</h4>
              </div>
          </footer>

      </div>

  )
}

export default App
