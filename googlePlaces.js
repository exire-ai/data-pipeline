const fetch = require('node-fetch');
const { PLACES_KEY } = require('./config.js');

const placesKey = process.env.PLACES_KEY;

const places = {
    getByKeyword: async function (type, keyword, callback) {
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
    },
    getByPlaceID: async function(place_id, callback) {
        fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&key=' + placesKey)
        .then((result) => result.json())
        .then((place) => {
            callback(place);
        })
        .catch((err) => {
            console.log(err);
        })
    },
    getPlacesById: async function(place_ids, callback) {
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
};

module.exports.places = places;




