var oauth = require('oauth');
var json2xml = require('json2xml');
var querystring = require('querystring');

var Xero = (function () {
  function Xero(config) {
    this.privateKey            = config.privateKey;
    this.consumerKey           = config.ConsumerKey;
    this.consumerSecret        = config.ConsumerSecret;
    this.baseURL               = config.APIEndpointURL;
    this.oa                    = new oauth.OAuth(null, null, this.consumerKey, this.consumerSecret, '1.0a', null,  "RSA-SHA1");
    
    // oauth module doesn't have an interface for specifying an RSA privatekey
    this.oa._privateKey        = this.privateKey;
    
    // oauth module doesn't have an interface for specifying custom headers
    this.oa._headers['Accept'] = 'application/json';
  }

  Xero.prototype.get = function(action, requestData, callback) {
    this.oa.get(
      this.baseURL + action + querystring.stringify(requestData)
    , this.oa._consumerKey
    , this.oa._consumerSecret
    , function(error, responseData, responseText){
        callback(error, JSON.parse(responseData), responseText);
      }
    );
  };

  Xero.prototype.post = function(action, requestData, callback) {
    this.oa.post(
      this.baseURL + action
    , this.oa._consumerKey
    , this.oa._consumerSecret
    , {xml: json2xml.toXml(action, requestData)}
    , null
    , function(error, responseData, responseText){
        callback(error, responseData, responseText);
      }
    );
  };

  Xero.prototype.put = function(action, requestData, callback) {
    this.oa.put(
      this.baseURL + action
    , this.oa._consumerKey
    , this.oa._consumerSecret
    , {xml: json2xml.toXml(action, requestData)}
    , null
    , function(error, responseData, responseText){
        callback(error, responseData, responseText);
      }
    );
  };

  Xero.prototype.formatDateString = function(d) {
    return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay();
  };

  return Xero;
})();

module.exports = Xero;