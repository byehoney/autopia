const { injectBabelPlugin } = require('react-app-rewired');
const rewirePostcss = require('react-app-rewire-postcss');
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');
module.exports = function override(config, env) {
    config = injectBabelPlugin(['import',{ libraryName: 'antd-mobile',style:'css'}],config);
    config.module.rules[2].oneOf.unshift(
        {
            test: /\.scss$/,
            use: [
                require.resolve('style-loader'),
                require.resolve('css-loader'),
                require.resolve('sass-loader'),
                {
                    loader: require.resolve('postcss-loader'),
                    options: {
                        // Necessary for external CSS imports to work
                        // https://github.com/facebookincubator/create-react-app/issues/2677
                        ident: 'postcss',
                        plugins: () => [
                            require('postcss-flexbugs-fixes'),
                            autoprefixer({
                                browsers: [
                                    '>1%',
                                    'last 4 versions',
                                    'Firefox ESR',
                                    'not ie < 9', // React doesn't support IE8 anyway
                                ],
                                flexbox: 'no-2009',
                            })
                        ],
                    },
                }
            ]
        }
    );
    config = rewirePostcss(config,{
        plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
                autoprefixer: {
                    flexbox: 'no-2009',
                },
                stage: 3,
            }),
            pxtorem({
                rootValue: 100,    //以100px为准，不同方案修改这里
                propWhiteList: [],
            })
        ],
    });
    return config;
}