/*eslint-env node, mocha*/
const http   = require('http')
const demand = require('must')
const Client = require('../../lib/client.js')


const PORT   = 6767


describe('lib/client.js', function() {

  let server = null


  before(function startTestServer() {

    server = http.createServer((req, res) => res.end())

    server.listen(PORT)

  })


  after(function stopTestServer() {

    server.close()

  })


  describe('::fromAppConfig', function() {


    it('should create a configured client given an application config ' +
    'object', function(done) {

      const test_config = {
        my: {
          fancy: {
            path: {
              url: `http://127.0.0.1:${PORT}`
            , username: 'boo'
            , password: 'foobar'
            }
          }
        }
      }


      const client = Client.fromAppConfig('/my/fancy/path', test_config)

      server.once('request', (request) => {

        const [ type, auth ]     = request.headers.authorization.split(' ')
        const decoded            = Buffer.from(auth, 'base64')
        const [ user, password ] = decoded.toString().split(':')


        demand(request.url).eql('/foo')
        demand(request.headers.host).eql(`127.0.0.1:${PORT}`)
        demand(request.method).eql('GET')

        demand(type).eql('Basic')
        demand(user).eql('boo')
        demand(password).eql('foobar')

        done()

      })

      client.get('/foo')

    })


  })


})
