
import './App.css';
import React from 'react'

import {
    BrowserRouter as Router,
    Routes, Route, Link
} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'

const App = () => {

  const padding = {
    padding: 5
  }

  return (

      <div className="navbar">

          <Router>
              <div>
                  <Link style={padding} to="/login">Kirjaudu sisään</Link>
                  <Link style={padding} to="/register">Rekisteröinti</Link>
                  <Link style={padding} to="/">Koti</Link>
                  <h3 style={padding}>Perse</h3>
              </div>

              <Routes>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/" element={<Home/>}/>
              </Routes>
          </Router>

      </div>

  )
}

export default App
