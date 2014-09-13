var common = require('./common.js');
var schema = require('./validator/schematron.js');

module.exports = schema(
  common,
  {
    deviceTime: schema().isDeviceTime(),
    recommended: schema().object({
      carb: schema().ifExists().number(),
      correction: schema().ifExists().number()
    }),
    bgInput: schema().ifExists().number(),
    carbInput: schema().ifExists().number(),
    insulinOnBoard: schema().ifExists().number(),
    insulinSensitivity: schema().number(),
    bgTarget: schema().oneOf(
      schema(
          {
            low: schema().number(),
            high: schema().number(),
            range: schema().banned(),
            start: schema().number().min(0).max(86400000),
            target: schema().banned()
          }
      ),
      schema(
          {
            low: schema().number(),
            high: schema().number(),
            range: schema().banned(),
            start: schema().number().min(0).max(86400000),
            target: schema().number()
          }
      ),
      schema(
          {
            low: schema().banned(),
            high: schema().banned(),
            range: schema().number(),
            start: schema().number().min(0).max(86400000),
            target: schema().number()
          }
      ),
      schema(
          {
            low: schema().banned(),
            high: schema().number(),
            range: schema().banned(),
            start: schema().number().min(0).max(86400000),
            target: schema().number()
          }
      )
    ),
    bolus: schema().ifExists().object()
  }
);