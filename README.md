# LeffaVinkki

Projekti toteutettiin front puolella React.js:llä ja back-end Noje.js:llä

##Tekijät:
####-Jukka Hallikainen
####-Eljas Hirvelä
####-Arttu Pösö

## Kehitysympäristön toimintakuntoon laittaminen

Jotta palvelin saadaan toimintaan tarvitset src hakemistoon '.env' tiedoston, joka ei löydy GitLab:sta.

Projektin hakemistossa suorita komento:

### `npm start`

LeffaVinkki pyörii komennon jälkeen osoitteessa: [http://localhost:3000](http://localhost:3000)


### Suorita src hakemistosta server.js

Projektin hakemiston src (source) kansiosta löytyy palvelin server.js, jonka täytyy pyöriä taustalla.
Palvelin pyörii portissa 8081

<br>

# Rest-api kutsut ja JSON palautukset

## Käyttäjiin liittyvät:

### GET /users
#### -Palauttaa kaikki käyttäjät tietokannasta JSON muodossa

<br>

### GET /user
#### -Palauttaa tietyn käyttäjän tiedot käyttäen parametrina käyttäjän ID:tö.<br>Käyttäjän ID annetaan URL parametrina muotoa: /user?id=4

<br>

### GET /users/edit
#### -Kutsulla täytyy olla ennen varsinaista lähetystä lähtevä header 'Authorization'
#### -Kutsun yhteydessä lähetetään palvelimelle JSON, joka sisältää arvot 'description' ja 'token' arvot.
#### -Esimerkki kutsu Axios:lla
    await axios.post('http://localhost:8081/users/edit', {
                    description: 'uusi profiili teksti',
                    token: localStorage.getItem('accessToken')
                }, { headers: {'Authorization': 'Bearer: ' + localStorage.getItem('accessToken')}}).then((response)=>{
                    ...
                })

<br>

### POST /users/register
#### -Kutsussa lähetetään JSON parametrein:
1.  password
2.  email
3.  name
#### -Palautuksena tulee header 'register', joka sisältää tekstin siitä onnistuiko vai epäonnistuiko rekisteröinti

<br>

### POST /users/login
#### -Kutsun yhteydessä lähetetään JSON parametrein:
1.  password
2.  name
#### -Jos kirjautuminen onnistuu vastaa palvelin statuksella 200 ja palauttaa JSON tiedoston, joka sisältää arvot:
1.  accessToken -*käyttäjän pääsytunnut*
2.  username -*käyttäjän nimi*
3.  email -*käyttäjän sähköpostiosoite*
4.  id -*käyttäjän id*
5.  login -*teksti kirjautumisen onnistumisesta*
6.  status -*teksti onnistumisesta*

<br>

## Elokuviin liittyvät:

### POST /movies/addcomment
#### -Kutsulla täytyy olla ennen varsinaista lähetystä lähtevä header 'Authorization'
#### -Kutsun yhteydessä lähetetään palvelimelle JSON, joka sisältää arvot 'header', 'content', 'movieId' ja 'movieTitle' arvot.
#### -Esimerkki kutsu Axios:lla
    await axios.post('http://localhost:8081/movies/addcomment', {
        header: form.formHeader.value,
        content: form.formComment.value,
        movieId: movieId,
        movieTitle: movieData.data.Title
    },{ headers: {'Authorization': 'Bearer: ' + token}
    }).then((response) => {
        if(response.status === 200){
            //mitä tehdään kun onnistui
        } else {
            //jos ei onnistunut
        }
        ...
    });

<br>

### POST /movies/addrating
#### -Kutsulla täytyy olla ennen varsinaista lähetystä lähtevä header 'Authorization'
#### -Kutsun yhteydessä lähetetään palvelimelle JSON, joka sisältää arvot 'rating' ja 'movie_id' arvot.
#### -Esimerkki kutsu Axios:lla
    await axios.post("http://localhost:8081/movies/addrating", {
            rating: review,
            movie_id: movieId
        }, { headers: {'Authorization': 'Bearer: ' + token}
        }).then((response) => {
            if(response.status === 200){
                //Arvostelu onnistui
            } else {
                //Arvostelu ei onnistunut
            }
            ...
    });

<br>

### GET /movies/recommended
#### -Palvelin palauttaa tietokannasta admin käyttäjien 'suosituksia'. Tätä ominaisuutta ei käytetty tässä versiossa.

<br>

### POST /movies
#### -Käytetään elokuvien hakuun omdbapi-apista.
#### -Kutsun yhteydessä täytyy URL:n sisältää vähintään yksi näistä parametreista:
1.  s -*elokuvan nimi*
2.  y -*elokuvan valmistus vuosi*
3.  i -*omdbapi:n oma parametri, ei käytetty tässä toteutuksessa*
4.  plot -*omdbapi:n oma parametri, ei käytetty tässä toteutuksessa*
5.  page -*Kuinka monta sivullista haetaan elokuvia (1 sivu = 10 elokuvaa) MAX 3*
#### -Palvelin palauttaa JSON-tiedoston haettuaan omdbapi:sta parametreilla elokuvan/elokuvat

<br>

### GET /movies/getreviews
#### -Käytetään elokuva kohtaisten arviointien hakemiseen
#### -Pyynnön mukana täytyy URL:n sisältää parametri id:
    http://localhost:8081/getreviews?id=elokuvanid
#### -Palvelimen palauttama JSON sisältää kaikki tälle elokuvalle annetut arvioinnit

<br>

### GET /movies/getcomments
#### -Käytetään elokuva kohtaisten kommentien hakemiseen
#### -Pyynnön mukana täytyy URL:n sisältää parametri id
    http://localhost:8081/getcomments?id=elokuvanid
#### -Palvelimen palauttama JSON sisältää kaikki tälle elokuvalle annetut kommentit

<br>

### GET /usercomments
#### -Käytetään tietyn käyttäjä tekemien kommentien hakemiseen
#### -Pyynnön mukana täytyy URL:n sisältää parametri id:
    http://localhost:8081/usercomments?id=käyttäjänid
#### -Palvelin palauttaa JSON:in mikä sisältää käyttäjän tekemät kommentit

<br>

### GET /userreviews
#### -Käytetään tietyn käyttäjän tekemien arviointien hakemiseen
#### -Pyynnön mukana täytyy URL:n sisältää parametri id:
    http://localhost:8081/userreviews?id=käyttäjänid
#### -Palvelin palauttaa JSON:in mikä sisältää käyttäjän tekemät arvioinnit

<br>

### GET /getusername
#### -Käytetään käyttäjänimen hakemiseen ID:llä
#### -Pyynnön mukana täytyy URL:n sisältää parametri id:
    http://localhost:8081/getusername/?id=käyttäjänid
#### -Palvelin palauttaa JSON:in mikä sisältää pelkästään käyttäjän nimen