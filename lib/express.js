
const R      = require('ramda')
const Client = require('./client.js')
const Config = require('./config.js')
const assert = require('assert')


const ExpressMiddleware = R.curry((base_path, config) => {

  const getConfigItem = Config.getAppConfigItem(base_path)
  const namespace     = getConfigItem('namespace')(config)
  const client_config = getConfigItem('client')(config)

  assert(namespace, 'namespace option is required')
  assert(client_config, 'client option is required')

  const client    = Client.fromAppConfig([], client_config)

  return (req, res, next) => {

    if (!req[namespace]) req[namespace] = client

    return next()

  }

})


module.exports = ExpressMiddleware
