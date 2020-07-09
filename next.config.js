const withSass = require('@zeit/next-sass')
const withImages = require('next-images');

module.exports = withSass(withImages({
    env: {
        GOOGLE_MAPS_KEY: "AIzaSyDCL0Ym4mgltetgeA91KCtQ4ZPH62zdq - 8",
        GOOGLE_MAPS_MAP_URL:"https://maps.googleapis.com/maps/api/js?",
        GOOGLE_MAPS_DIRECTIONS_URL:"https://www.google.com/maps/dir/",
        GOOGLE_MAPS_GEOCODE_URL:"https://maps.googleapis.com/maps/api/geocode/json?",
        FEASTEY_API_URL : "http://localhost:3000/api"
    }
}))
