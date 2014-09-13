var _ = require('lodash');
var util = require('util');

var joy = require('./validator/schematron');

var schemas = {
  basal: require('./basal'),
  bolus: require('./bolus'),
  cbg: require('./bg'),
  common: require('./common'),
  deviceMeta: joy(),
  message: require('./message'),
  settings: require('./settings'),
  smbg: require('./bg'),
  wizard: require('./wizard')
};

module.exports = {
  validateOne: function(datum, result) {
    result = result || {valid: [], invalid: []};
    var handler = schemas[datum.type];
    if (handler == null) {
      datum.errorMessage = util.format('No schema defined for data.type[%s]', datum.type);
      console.log(new Error(datum.errorMessage), datum);
      result.invalid.push(datum);
    }
    else {
      try {
        handler(datum);
        result.valid.push(datum);
      }
      catch(e) {
        console.log('Oh noes! This is wrong:\n', datum);
        console.log(util.format('Error Message: %s%s', datum.type, e.message));
        datum.errorMessage = e.message;
        result.invalid.push(datum);
      }
    }
  },
  validateAll: function(data) {
    var result = {valid: [], invalid: []};
    for (var i = 0; i < data.length; ++i) {
      this.validateOne(data[i], result);
    }
    return result;
  }
};
