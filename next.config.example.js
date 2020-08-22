const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')
const withImages = require('next-images');

module.exports = withCss(withSass(withImages({
    env: {
        GOOGLE_MAPS_KEY: "AIza...",
        GOOGLE_MAPS_MAP_URL: "https://maps.googleapis.com/maps/api/js?",
        GOOGLE_MAPS_DIRECTIONS_URL: "https://www.google.com/maps/dir/",
        GOOGLE_MAPS_GEOCODE_URL: "https://maps.googleapis.com/maps/api/geocode/json?",
        FEASTEY_API_URL: "https://example.feastey.com/api",
        STRIPE_PUBLIC_KEY: "pk_...",
        NODE_DEV: "production"

    },
    webpack: config => {
        config.module.rules.push(
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // optional, just to prettify file names
                            outputPath: 'static/webfonts/',
                            publicPath: '../webfonts/',
                            name: '[name].[ext]',
                            esModule: false
                        }
                    },
                ],
            },
        );
        return config;
    },
})))
