import axios from 'axios'

const movieUrl = 'http://localhost:8081/movies'

export function removeAekkoset(str){
    str = str.replace(/ä/g, 'a');
    str = str.replace(/ö/g, 'o');
    return str;
}

export function getMovies (sname, syear, spages) {
    return new Promise(json => {
        let pages = 3;
        if(spages!=undefined)
            pages=spages;
        if(pages>3)
            pages=3;
        let year = Number(syear);
        let movieYear = null;
        if(year > 1800 && Number.isInteger(year)){
            movieYear = year;
        }
        let name = removeAekkoset(sname.toLowerCase().replace(/  +/g, '%20').replace(/[\-[\]\\'/"]/g, "\\$&"));
        axios.post(movieUrl, {
            s: name,
            y: movieYear,
            page: pages
        }).then(resp => {
            if(resp.status === 200){
                console.log("Elokuvien haku onnistui!");
                const perse = resp.data
                console.log(perse.Search)
                json(perse.Search)
            } else {
                console.log("Virhe elokuvien hakemisessa.")
                return null;
            }
        });
    })

}