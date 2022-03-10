const apiUrl = "http://www.omdbapi.com/?r=json&type=movie&";

const verify = require('./verifyToken');
const readToken = require('./readToken');
const bodyParser = require("body-parser");
const axios = require('axios').default;

//Käytetään arraytä, sillä rajapinta rajoittaa 1000-hakemusta
//per päivä/avain niin on helppo implementoida jos avain vaihtuisi
//päivän aikana
const apiKeys = ["&apikey=bfbd237f"];

module.exports = function(app, cors, url, query, fetch, bodyParser) {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json('application/json'));
    app.use(cors({credentials: true, origin: true}));

    //Lisää kommentin elokuvaan. POST pyynnön täytyy sisältää auth-token, jolla
    //palvelin varmentaa, että käyttäjä on kirjautunut ja mikä on käyttäjän ID.
    //Tämän lisäksi tulisi pyynnön sisätlää kaikki kommenttiin liittyvät tiedot
    //JSON-muodossa.
    app.post('/movies/addcomment', verify, (req, res, next) => {
        //console.log(readToken.readId(req.header('auth-token')));

        let commentHeader = req.body.header.replace(/[^\x20-\x7E]+/g, '');
        let comment = req.body.content.replace(/[^\x20-\x7E]+/g, '');
        let movieId = req.body.movieId.replace(/[^\x20-\x7E]+/g, '');
        let movieTitle = req.body.movieTitle.replace(/[^\x20-\x7E]+/g, '');
        let userId = req.user.id;

        console.log(commentHeader,comment,movieId,movieTitle,userId);

        if(commentHeader && comment && movieId && userId && movieTitle)
            try {
                (async () => {

                    let sql = "INSERT INTO comments (users_id, movie_id, movie_title, header, comment) VALUES (?, ?, ?, ?, ?)";
                    const rows = await query(sql, [userId, movieId, movieTitle, commentHeader, comment]);
                    let string = JSON.stringify(rows);

                    sql = "UPDATE profiles SET reviews = reviews + 1 WHERE id = ?";
                    const rows2 = await query(sql, [userId]);

                    res.send(string);

                })()

            } catch (err) {
                console.log("Database error! " + err);
            }
        else {
            res.send('Comment lacks elements.');
        }

    })

    //Lisää arvostelun elokuvaan. Yksi arvostelu / käyttäjä.
    //Middleware "verify" varmentaa POST pyynnön mukana lähetettävän
    //auth-token headerin ja varmistaa käyttäjän kirjautumisen.
    //Tämän lisäksi tulisi pyynnön sisältää arvosteluun tarvittavat tiedot
    //JSON-muodossa.
    app.post('/movies/addrating', verify, (req, res) => {
        //console.log(readToken.readId(req.header('auth-token')));
        let rating = req.body.rating;
        //console.log(req.body);
        let movieId = req.body.movie_id;
        let userId = req.user.id;

        if (rating && movieId && userId) {
            (async () => {
                try {
                    let sql = "SELECT * FROM reviews WHERE users_id = ? AND movie_id = ?";
                    const rows = await query(sql, [userId, movieId]);

                    if (rows.length > 0) {
                        let sql2 = "UPDATE reviews SET review = ? WHERE users_id = ? AND movie_id = ?";
                        await query(sql2, [rating, userId, movieId]);
                    } else {
                        let sql3 = "INSERT INTO reviews (users_id, movie_id, review) VALUES (?, ?, ?)";
                        await query(sql3, [userId, movieId, rating]);
                    }
                } catch (err){
                    console.log(err);
                }

            })();
        }
    });

    //Palauttaa elokuvat tietokannan "recommended" taulusta.
    app.get('/movies/recommended', cors(), (req, res) => {
        let sql = "SELECT * FROM recommended";

        (async () => {
            try {
                const movies = await query(sql);
                res.json(movies);

            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })();
    });

    //Palauttaa omdbapi-apista haettavat elokuvat.
    //Pyynnön tulee sisältää vähintään vähintään
    //yksi parametri jolloin palvelin lähettää pyynnön
    //eteen päin ja palauttaa apin JSON palautuksen
    //käyttäjälle.
    app.post('/movies', cors(), function (req, res) {

        const jsonObject = req.body;
        console.log('yritys', jsonObject)

        let pagecount = 1;
        let parameters = "";
        let paramCount = 0;
        let separators = 0;

        //Katsotaan lähetetyt parametrit ja lisätään ne muuttujaan
        if (jsonObject.hasOwnProperty('s')) {
            //Jos on jo parametri eikä välissä ole & merkkiä
            if (paramCount > separators) {
                separators++;
                parameters += "&";
            }

            parameters += "s=" + jsonObject.s;
            paramCount++;
        }
        if (jsonObject.hasOwnProperty('y') && jsonObject.y != null) {
            //Jos on jo parametri eikä välissä ole & merkkiä
            if (paramCount > separators) {
                separators++;
                parameters += "&";
            }

            parameters += "y=" + jsonObject.y;
            paramCount++;
        }
        if (jsonObject.hasOwnProperty('i')) {
            //Jos on jo parametri eikä välissä ole & merkkiä
            if (paramCount > separators) {
                separators++;
                parameters += "&";
            }

            parameters += "i=" + jsonObject.i;
            paramCount++;
        }
        if (jsonObject.hasOwnProperty('plot')) {
            //Jos on jo parametri eikä välissä ole & merkkiä
            if (paramCount > separators) {
                separators++;
                parameters += "&";
            }

            parameters += "plot=" + jsonObject.plot;
            paramCount++;
        }
        if (jsonObject.hasOwnProperty('page')) {
            if (jsonObject.page > 1) {
                pagecount = jsonObject.page;
                if (pagecount > 3)
                    pagecount = 3;
            }
        }
        if (paramCount > 0 && pagecount > 1) {
            console.log('Täällä?');
            const page = "&page=";
            (async () => {
                console.log("Search request: " + apiUrl + parameters + apiKeys[0] + " pages " + pagecount);
                try {
                    //Etistään ensiksi yhden sivun verran elokuva "10" (page=1)
                    let movies = await axios.get(apiUrl + parameters + page + "1" + apiKeys[0]);
                    //let jsonResponse = await movies.json();
                    let jsonResponse = movies.data;
                    console.log(jsonResponse)

                    //Tämän jälkeen lisätään vielä niin monta sivua elokuva kuin kysytään (max 3)
                    for (let i = 2; i <= pagecount; i++) {

                        let response = await axios.get(apiUrl + parameters + page + i + apiKeys[0]);
                        let reponseJSON = response.data;
                        //let reponseJSON = await response.json();
                        // console.log(JSON.stringify(reponseJSON));
                        if (reponseJSON.Search) {
                            for (let i = 0; i < Object.keys(reponseJSON.Search).length; i++) {
                                jsonResponse.Search.push(reponseJSON.Search[i]);
                                console.log(JSON.stringify(jsonResponse));
                            }
                        }
                    }
                    if (movies) {
                        res.status(200).json(jsonResponse);
                    }
                } catch (error) {
                    console.log(error);
                }
            })();
        } else if (paramCount > 0) {
            (async () => {
                console.log("Search request: " + apiUrl + parameters + apiKeys[0]);
                try {
                    const response = await axios.get(apiUrl + parameters + apiKeys[0]);
                    if (response.data) {
                        res.status(200).json(response.data);
                    }
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    });

    //Palauttaa kaikki tietyn elokuvan arvostelut
    //movies/getreviews?id=elokuvanid
    app.get('/movies/getreviews', cors(), (req,res)=>{
        let q = url.parse(req.url, true).query;
        const movieId = q.id;
        let sql;
        sql = "SELECT * FROM reviews WHERE movie_id = ?";
        //console.log(movieId);

        (async () => {
            try {
                const reviews = await query(sql, [movieId]);
                res.json(reviews);
            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })();
    })

    //Palauttaa kaikki tietyn elokuvan kommentit
    //movies/getcomments?id=elokuvanid
    app.get('/movies/getcomments', cors(), (req,res)=>{
        let q = url.parse(req.url, true).query;
        const movieId = q.id;
        let sql;
        sql = "SELECT * FROM comments WHERE movie_id = ?";

        (async () => {
            try {
                const commentRows = await query(sql, [movieId]);

                var returnArray = [];

                //Käydään läpi jokaisen kommentin käyttäjä-id
                //ja lisätään palautettavaan JSONiin jokaista id:tä vastaava käyttäjänimi
                for(var i = 0; i < commentRows.length; i++){

                    if(commentRows[i].hasOwnProperty('movie_id')) {
                        let userId = commentRows[i].users_id;
                        sql = "SELECT name FROM users WHERE id = ?";
                        const nameRow = await query(sql, [userId]);
                        let name = nameRow[0].name;
                        commentRows[i].name = name; //Tällä lisätään uusi sarake JSONiin

                        returnArray.push(commentRows[i]);
                    }
                }
                res.json(returnArray);

            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })();
    })

    //Palauttaa kaikki tietyn käyttäjän kirjoittamat kommentit
    //usercomments?id=käyttäjänid
    app.get('/usercomments', cors(), (req,res)=>{
        var q = url.parse(req.url, true).query;
        const profileId = q.id;
        console.log(profileId);

        var string;
        (async () => {
            try {
                let sql = "SELECT * FROM comments WHERE users_id = ? ORDER by movie_id";
                let returnArray = [];
                const rows = await query(sql, [profileId]);

                for (let i = 0; i < rows.length; i++) {
                    returnArray.push(rows[i]);
                }
                string = JSON.stringify(returnArray);
                res.json(returnArray);


                /*

                for(var i = 0; i < rows.length; i++){
                    if(rows[i].hasOwnProperty('id')) {
                        const rows2 = await query(sql, profileId);
                        for(var l = 0; l < rows2.length; l++){
                            returnArray.push(rows2[l]);
                        }

                        /*
                        if(JSON.stringify(returnArray) === "{}")
                            returnArray = rows2;
                        else
                            returnArray.push(rows2);

                         */

                /*
                                        string = JSON.stringify(rows2);
                                        //console.log(string);
                                    }
                                }
                                res.json(returnArray, rows);
                */
            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })();
    })

    //Palauttaa kaikki käyttäjän antamat arvostelut ilman kommentteja
    //userreviews?id=käyttäjänid
    app.get('/userreviews', cors(), (req, res) => {
        let q = url.parse(req.url, true).query;
        let userId = q.id;
        let sql = "SELECT review, movie_id FROM reviews WHERE users_id = ?";
        let returnArray = [];

        (async () => {
            try {
                const rows = await query(sql, [userId]);
                for (let i = 0; i < rows.length; i++) {
                    returnArray.push(rows[i]);
                }
                res.json(returnArray);

            } catch (error) {
                console.log(error);
            }
        })();
    })

    //Jotta saadaan kommentin kirjoittajan nimimerkki näkyviin
    //getusername/?id=käyttäjänid
    app.get('/getusername', cors(), (req, res) => {
        let q = url.parse(req.url, true).query;
        let userId = q.id;
        let sql = "SELECT name FROM users WHERE id = ?";

        (async () => {
            try {
                const name = await query(sql, [userId]);
                res.json(name);

            } catch (err) {
                console.log(err);
            }
        })();
    })
}