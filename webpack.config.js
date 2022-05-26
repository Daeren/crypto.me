const path = require('path');

//---]>

const TerserPlugin = require('terser-webpack-plugin');

//-----------------------------------------------------

module.exports = (env, argv) => {
    let name = 'cryptoMe';
    let dir = 'dist';
    let devtool = undefined;

    //---]>

    const options = {
        output: {
            library: {
                name: 'cryptoMe',
                type: 'umd'
            }
        },
    };

    //---]>

    if(argv.env.min) {
        name += '.min';

        Object.assign(options, {
            optimization: {
                minimize: true,
                minimizer: [new TerserPlugin()],
            }
        });
    }

    if(argv.env.es) {
        name = 'index';
        dir = 'lib';

        options.output.library = {
            type: 'module'
        };

        Object.assign(options, {
            experiments: {
                outputModule: true,
            }
        });
    }

    if(argv.mode === 'production') {
        if(!argv.env.es) {
            devtool = 'source-map';
        }

        Object.assign(options, {
            mode: 'production'
        });
    }

    if(argv.mode === 'development') {
        name += '.dev';
        devtool = 'source-map';

        Object.assign(options, {
            mode: 'development'
        });
    }

    //---]>

    options.output.filename = name + '.js';
    options.output.path = path.resolve(__dirname, dir);
    options.devtool = devtool;

    //---]>

    return {
        entry: path.resolve(__dirname, 'src/index.js'),
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
            ],
        },

        ...options
    };
}
