const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");
const config = require('./src/config.json')

module.exports = (env, argv) => ({
  entry: './src/app/app.ts',
  output: {
    path: __dirname + '/dist',
    filename: 'js/bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/styles', to: 'styles' },
        { from: 'src/sitemap.txt', to: 'sitemap.txt' }
      ]
    }),
    new MergeJsonWebpackPlugin({
      output: {
        groupBy: config.languages.map(lang => ({
          pattern: `{./src/locales/${lang.code}.json,./node_modules/@mcschema/locales/src/${lang.code}.json}`,
          fileName: `./locales/${lang.code}.json`
        }))
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Data Pack Generators Minecraft 1.16',
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Data Pack Generators Minecraft 1.16',
      filename: '404.html',
      template: 'src/index.html'
    }),
    ...config.models.flatMap(buildModel)
  ]
})

function buildModel(model) {
  const page = new HtmlWebpackPlugin({
    title: `${model.name} Generator Minecraft 1.16`,
    filename: `${model.id}/index.html`,
    template: 'src/index.html'
  })
  if (model.schema) {
    return page
  } else if (model.children) {
    return [page, ...model.children.flatMap(buildModel)]
  }
  return []
}
