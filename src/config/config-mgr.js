const logger = require("../logger")("config:mgr");
const { cosmiconfigSync } = require("cosmiconfig");
const configLoader = cosmiconfigSync("tool");
const schema = require("./schema.json");
const Ajv = require("ajv");
const ajv = new Ajv({ jsonPointers: true });
const betterAjvErrors = require("better-ajv-errors");
module.exports = function getConfig() {
  const result = configLoader.search(process.cwd());
  if (result) {
    const isValid = ajv.validate(schema, result.config);
    if (!isValid) {
      logger.warning("Invalid configuration was supplied");
      console.log();
      console.log(betterAjvErrors(schema, result.config, ajv.errors));

      process.exit(1);
    }
    logger.debug("Found configuration", result.config);
    return result.config;
  } else {
    logger.warning("Could not find the configuration,using default");
    return { port: 1234 };
  }
};
