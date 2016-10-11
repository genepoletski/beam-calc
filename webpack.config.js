const path = require('path');
const parts = require('./libs/parts');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const pkg = require('./package.json');
const stylelint = require('stylelint');

const PATHS = {
  build: path.join(__dirname, 'build'),
  libs: path.join(__dirname, 'libs'),
  src: path.join(__dirname, 'src'),
  style: [
    path.join(__dirname, 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
    path.join(__dirname, 'src', 'styles', 'main.css')
  ]
}

const ENV = process.env;
const TARGET = ENV.npm_lifecycle_event;

ENV.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: PATHS.src,
    style: PATHS.style,
    vendor: Object.keys(pkg.dependencies)
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  module: {
    preLoaders: [
      {
        test: /\.css$/,
        loaders: ['postcss'],
        include: PATHS.src
      },
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: PATHS.src
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.src
      },
      {
        test: /\.png$/,
        loader: "url-loader?limit=100000"
      },
      {
        test: /\.jpg$/,
        loader: "file-loader"
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  postcss: function () {
    return [
      stylelint({
        rules: {
          'color-hex-case': 'lower'
        }
      })
    ];
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PATHS.src, 'index.template.ejs'),
      inject: 'body'
    })
  ],
  resolve: {
    alias: {
      libs: PATHS.libs,
      components: path.join(PATHS.src, 'components'),
      models: path.join(PATHS.src, 'models')
    },
    extensions: ['', '.js', '.jsx']
  }
};

var config;

switch (TARGET) {
  case 'build':
  case 'stats':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.src])
    );
    break;
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map'
      },
      parts.devServer({
        host: ENV.HOST,
        port: ENV.PORT
      }),
      parts.setupCSS(PATHS.style)
    );
}

module.exports = validate(config, {
  quiet: true
});
