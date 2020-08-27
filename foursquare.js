const fetch = require('node-fetch');
const { FOURSQUARE_CLIENT_ID ,FOURSQUARE_CLIENT_SECRET } = require('./config.js');

const foursquare = {

    //SEARCH BY QUERY -- NY, NY ONLY
    searchVenues: async function(query, callback) {
        fetch('https://api.foursquare.com/v2/venues/search?near=New York, New York&query=' + query + '&client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET + '&v=20200601')
        .then((result) => result.json())
        .then((responses) => {
            callback(responses.response.venues);
        })
        .catch((err) => {
            console.log(err);
            callback(null);
        })
    },
    //RETURNS DETAILED VENUE OBJ
    detailedVenue: async function(id, callback) {
        fetch('https://api.foursquare.com/v2/venues/' + id + '?&client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET + '&v=20200601')
        .then((result) => result.json())
        .then((res) => {
            callback(res.response.venue);
        })
        .catch((err) => {
            console.log(err);
            callback(null);
        })
    }

};

module.exports.foursquare = foursquare;