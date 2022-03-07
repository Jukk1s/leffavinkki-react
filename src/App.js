
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
          <Link style={padding} to="/" className="active home">Koti</Link>
          <Link style={padding} to="/login">Kirjautuminen</Link>
          <Link style={padding} to="/register">Rekisteröinti</Link>
        </Router>

      </div>

  )
}

export default App
