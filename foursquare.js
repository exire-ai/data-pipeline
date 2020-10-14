const fetch = require('node-fetch');
const _ = require('lodash');

const { FOURSQUARE_CLIENT_ID ,FOURSQUARE_CLIENT_SECRET } = require('./config.js');

const FoursquareCategories = {
    Mexican: 'mexican'
}

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
    },
    // CONVERTER OBJECT FOR FOURSQUARE
    FoursquareConversionSchema: {
        placeID: ['id'],
        title: ['name'],
        description: ['description'],
        tips: ['default', ''],
        category: ['default', 'food'],
        subcategory: ['categories', categories => {
            for (category in categories) {
                if (_.has(FoursquareCategories, categories[category].shortName)) {
                    return FoursquareCategories[categories[category].shortName]
                }
            }
            return ''
        }],
        type: ['default', 'venue'],
        imgURL: ['bestPhoto', data => data.prefix + data.suffix.substring(1)],
        region: ['location.city'],
        open: [ 'default', 0 ],
        closed: [ 'default', 0 ],
        closed_days: ['default', []],
        latitude: ['location.lat'],
        longitude: ['location.lng'],
        address: ['location.formattedAddress'],
        cost: ['price.tier'],
        rank: ['rating', val => val / 2],
        peopleWatching: ['default', 0],
        linkClicks: ['default', 0],
        tag: [''],
        accessURL: ['url'],
        deliveryURL: ['delivery.url'],
        menuURL: ['menu.url'],
        businessID: ['id'],
        times: ['default', {}],
        valid: ['default', false]
    },
};

module.exports.foursquare = foursquare;