var DomParser = require('dom-parser');
var parser = new DomParser();

const { foursquare } = require('./foursquare.js');
const { places } = require('./googlePlaces.js');


//Helper function to find a meta tag with given name attribute
function getMeta(doc, metaName) {
    const metas = doc.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === metaName) {
            return (metas[i].getAttribute('content'));
        }
    }
    return '';
}

//Scrapes given site for a description meta tag
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


//Originally pulling data from Places API

// const loadVenuesByCategory = async function(category, numVenues, callback) {
//     getByKeyword('', category, async (places) => {

//         //Filter by Operational Status
//         operationalPlaces = places.filter(place => place.business_status === "OPERATIONAL");

//         //Slice to proper number of Venues
//         if(operationalPlaces.length > numVenues) {
//             operationalPlaces = operationalPlaces.slice(0, numVenues);
//         }

//         place_ids = operationalPlaces.map(x => x.place_id);
//         //Get Detailed Place Object for each Venue
//         places.getPlacesById(place_ids, (detailedPlaces) => {

//             let descriptions = [];
//             detailedPlaces = detailedPlaces.map(x => x.result);
//             detailedPlaces = detailedPlaces.filter(x => x.website != undefined);
//             let fetches = [];
//             for (const place of detailedPlaces) {
//                 fetches.push(getDescriptionByURL(place.website, (desc) => {
//                     descriptions.push(desc);
//                 }));
//             }

//             Promise.all(fetches).then(function() {
//                 console.log(descriptions);
//             })
//             callback("Done");
//         })


//     })
// }

// foursquare.detailedVenue('5209469f11d2d4f85e5b7427', (res) => {
//     console.log(res);
// })

// places.getByKeyword('gym','Fotografiska', (res) => {
//     console.log(res);
// })

