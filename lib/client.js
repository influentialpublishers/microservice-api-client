
const R       = require('ramda')
const request = require('request')
const Config  = require('./config.js')


const fromAppConfig = R.curry((base_path, config) => R.compose(
  request.defaults.bind(request)
, Config.fromAppConfig(base_path)
)(config))


module.exports = {
  fromAppConfig
}
