const fetch = require('node-fetch');
var DomParser = require('dom-parser');
var parser = new DomParser();
const { PLACES_KEY } = require('./config.js');

const placesKey = process.env.PLACES_KEY;

var getByKeyword = async function (type, keyword, callback) {
    fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.730610,-73.935242&radius=15000&&keyword=' + keyword + '&key=' + placesKey)
    .then((result) => result.json())
    .then((places) => {
        // console.log(places['results'][0]);
        callback(places['results']);
    })
    .catch((err) => {
        console.log(err);
        callback(null);
    })
}

var getByPlaceID = async function(place_id, callback) {
    fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&key=' + placesKey)
    .then((result) => result.json())
    .then((place) => {
        callback(place);
    })
    .catch((err) => {
        console.log(err);
    })
}

// getByKeyword('gym','Fotografiska', (res) => {
//     console.log(res.place_id);
//     getByPlaceID(res.place_id, (place) => {
//         console.log(place.result);
//         console.log("Done");
//     })
// })

function getMeta(doc, metaName) {
    const metas = doc.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === metaName) {
            return (metas[i].getAttribute('content'));
        }
    }
    return '';
}

const getDescriptionByURL = async function(url, callback) {
    return fetch(url)
    .then((result) => result.text())
    .then((html) => {
        var doc = parser.parseFromString(html, 'text/html');
        const metas = doc.getElementsByTagName('meta');
        let description = getMeta(doc, 'description');
        callback(description);    
    })
    .catch((err) => {
        console.log(err);
        callback('ERROR');
    })
}


// getDescriptionByURL('http://www.havenspa.nyc/', (res) => {
//     console.log(res);
// })

const getPlacesById = async function(place_ids, callback) {
    detailedPlaces = [];
    fetches = [];
    for (const item of place_ids) {
        fetches.push(
            fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + item + '&key=' + placesKey)
            .then((res) => res.json())
            .then((place) => {
                detailedPlaces.push(place);
            })
            .catch((err) => {
                console.log(err);
            })
        )
    }
    Promise.all(fetches).then(function() {
        callback(detailedPlaces);
    })
}


const loadVenuesByCategory = async function(category, numVenues, callback) {
    getByKeyword('', category, async (places) => {

        //Filter by Operational Status
        operationalPlaces = places.filter(place => place.business_status === "OPERATIONAL");

        //Slice to proper number of Venues
        if(operationalPlaces.length > numVenues) {
            operationalPlaces = operationalPlaces.slice(0, numVenues);
        }

        place_ids = operationalPlaces.map(x => x.place_id);
        //Get Detailed Place Object for each Venue
        getPlacesById(place_ids, (detailedPlaces) => {

            let descriptions = [];
            detailedPlaces = detailedPlaces.map(x => x.result);
            detailedPlaces = detailedPlaces.filter(x => x.website != undefined);
            let fetches = [];
            for (const place of detailedPlaces) {
                fetches.push(getDescriptionByURL(place.website, (desc) => {
                    descriptions.push(desc);
                }));
            }

            Promise.all(fetches).then(function() {
                console.log(descriptions);
            })
            callback("Done");


        })


    })
}

loadVenuesByCategory('spa', 4, (res) => {
    console.log(res);
})

// getPlacesById(['ChIJq_BiKaJZwokRnj6wBp-SN7Y', 'ChIJ9z5s7LOKwokR7QoN7ANnoHU'], (res) => {
//     console.log("PLACES: ");
//     console.log(res);
// })
