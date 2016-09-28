
const R = require('ramda')


const splitPath = R.ifElse(
  R.test(/(\w\.)+/)
, R.split('.')
, R.split('/')
)



const parseBasePath = R.compose(
  R.when(R.compose(R.equals(''), R.last), R.init)
, R.when(R.propEq(0, ''), R.tail)
, R.when(R.is(String), splitPath)
)


const getAppConfigItem = (base_path = []) => R.compose(
  R.path
, R.append(R.__, parseBasePath(base_path))
)


function fromAppConfig(base_path) {

  const get = getAppConfigItem(base_path)

  return R.applySpec({

    baseUrl: get('url')
  , auth: {
      user: get('username')
    , password: get('password')
    , token: get('token')
    }

  })

}


module.exports = {
  getAppConfigItem
, fromAppConfig
}
