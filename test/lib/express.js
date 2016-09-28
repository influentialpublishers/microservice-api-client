/*eslint-env node, mocha*/
const http       = require('http')
const demand     = require('must')
const Middleware = require('../../lib/express.js')


const PORT       = 6768


describe('lib/express.js', function() {

  let server = null


  before(function startTestServer() {

    server = http.createServer((req, res) => res.end())

    server.listen(PORT)

  })


  after(function stopTestServer() {

    server.close()

  })


  it('should create a client and then attach it to the given namespace',
  function(done) {

    const test_config = {
      my: {
        fancy: {
          path: {
            namespace: 'my_client'
          , client: {
              url: `http://127.0.0.1:${PORT}`
            , username: 'boo'
            , password: 'foobar'
            }
          }
        }
      }
    }


    const middleware = Middleware('/my/fancy/path', test_config)

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

    let req = {}
    let res = {}

    middleware(req, res, () => { req.my_client.get('/foo') })

  })

})
