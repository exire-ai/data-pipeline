const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PLACES_KEY: process.env.PLACES_KEY,
    FOURSQUARE_CLIENT_ID: process.env.FOURSQUARE_CLIENT_ID,
    FOURSQUARE_CLIENT_SECRET: process.env.FOURSQUARE_CLIENT_SECRET
};