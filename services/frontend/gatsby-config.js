/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
    plugins: [
        'gatsby-plugin-sass',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-plugin-alias-imports',
            options: {
                alias: {
                    packages: '../../packages',
                    services: '../',
                },
                extensions: ['js', 'jsx'],
            },
        },
    ],
};
