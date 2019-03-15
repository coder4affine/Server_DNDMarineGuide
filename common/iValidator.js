const Ajv = require('ajv');
const errorCode = require('./error-code');
const errorMessage = require('./error-methods');

const schemaValidator = Ajv({
  allErrors: true,
});

module.exports = {
  json_schema(schema, data, model) {
    const testSchemaValidator = schemaValidator.compile(schema);
    const valid = testSchemaValidator(data);
    if (valid) {
      return {
        valid: true,
      };
    }

    return {
      valid: false,
      errorMessage: errorMessage.validationError(422, testSchemaValidator.errors, model),
    };
  },
};
