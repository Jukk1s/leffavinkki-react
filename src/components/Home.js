import React from 'react';

const Home = () => {

    const getMovies = (event) => {

    }

    return (
        <div>
            <label>Elokuvan nimi</label>
            <input type="text" id="movie_name"/>
            <label>Vuosi (valinnainen)</label>
            <input type="number" id="movie_year"/>
            <button onClick={getMovies}>Search</button>
        </div>
    );
}

export default Home