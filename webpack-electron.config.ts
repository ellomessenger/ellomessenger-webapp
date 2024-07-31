const path = require('path');
const { EnvironmentPlugin } = require('webpack');

// GitHub workflow uses an empty string as the default value if it's not in repository variables, so we cannot define a default value here
process.env.BASE_URL = process.env.BASE_URL || 'https://web.ellomessenger.com';

const { APP_ENV = 'production', BASE_URL } = process.env;

module.exports = (_env, { mode = 'production' }) => {
  return {
    mode,
    target: 'node',

    entry: {
      electron: './src/electron/main.ts',
      preload: './src/electron/preload.ts',
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },

    resolve: {
      extensions: ['.ts', '.js'],
    },

    plugins: [
      new EnvironmentPlugin({
        APP_ENV,
        BASE_URL,
        IS_PREVIEW: false,
      }),
    ],

    module: {
      rules: [
        {
          test: /\.(ts|tsx|js)$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },

    externals: {
      electron: 'require("electron")',
    },
  };
};
