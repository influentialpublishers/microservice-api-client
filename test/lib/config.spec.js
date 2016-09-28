/*eslint-env node, mocha*/

const demand = require('must')
const Config = require('../../lib/config.js')


describe('lib/config.js', function() {


  describe('::getAppConfigItem', function() {


    it('should return a function that will retrieve a specified ' +
    'configuration path', function() {

      const test_fn    = Config.getAppConfigItem('/test/path/')('test')
      const test_input = {
        test: {
          path: { test: 'foo' }
        }
      }


      const actual = test_fn(test_input)

      demand(actual).eql('foo')

    })


    it('should allow use of the "." (dot) as a path separator',
    function() {

      const test_fn = Config.getAppConfigItem('test.path')('thing')
      const test_input = {
        test: {
          path: { thing: 'bar' }
        }
      }


      const actual = test_fn(test_input)
      
      demand(actual).eql('bar')

    })


  })


  describe('::fromAppConfig', function() {


    const test_config = {
      my: {
        path: {
          some_namespace: {
            url: 'http://foo.com'
          , username: 'boo'
          , password: 'foobar'
          }
        }
      }
    }


    it('should create a configuration from the given app configuration',
    function() {

      const base_path = '/my/path/some_namespace'
      const actual = Config.fromAppConfig(base_path)(test_config)

      demand(actual.baseUrl).eql('http://foo.com')
      demand(actual.auth.user).eql('boo')
      demand(actual.auth.password).eql('foobar')

    })


  })


})
