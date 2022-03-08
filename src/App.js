import './css/navbar.css'
import React from 'react'

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

const MOVIE_STORAGE_KEY = "lastSearch"

const App = () => {

    const padding = {
        padding: 5
    }

  const searchMovie = async(event) => {
      event.preventDefault()
      event.stopPropagation()
      const searchField = document.getElementById('movieSearch');
      const search = searchField.value
      searchField.value = "";
      try {
          let name = removeAekkoset(search.toLowerCase().replace(/  +/g, '%20').replace(/[\-[\]\\'/"]/g, "\\$&"));
          let movieYear = null;

          console.log(name, movieYear)

          const result = await getMovies(name,null,null).then(resp=>{
              localStorage.setItem(MOVIE_STORAGE_KEY, JSON.stringify(resp))
              window.open("/");
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
                  <li><input id="movieSearch" placeholder="Elokuvan nimi" type="text"/></li>
                  <li><button onClick={searchMovie}>Etsi</button></li>
                  <li><Link style={padding} to="/login"><a>Kirjaudu sisään</a></Link></li>
                  <li><Link style={padding} to="/register"><a>Rekisteröinti</a></Link></li>
              </ul>

              <Routes>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/user" element={<User/>}/>
                  <Route path="/movie" element={<Movie/>}/>
              </Routes>
          </Router>

      </div>

  )
}

export default App
