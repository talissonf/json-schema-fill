'use strict'
const fillSchemaWithFake = (data, schema, schemaDefinitions) => {
  let resp = {}

  if (!schema.properties) {
    schema.properties = {}
  }

  if (schema.hasOwnProperty('patternProperties')) {
    for (let pattern in schema.patternProperties) {
      if (schema.patternProperties.hasOwnProperty(pattern)) {
        let str = pattern.replace('^', '').replace('$', '')
        let values = str.split('|')
        for (let i = 0; i < values.length; i++) {
          schema.properties[values[i]] = schema.patternProperties[pattern]
        }
      }
    }
  }

  for (const key in schema.properties) {
    if (data.hasOwnProperty(key) && (typeof data[key] !== 'object' || data[key] === null)) {
      resp[key] = data[key]
    } else {
      if (schema.properties[key].hasOwnProperty('$ref')) {
        let referencia = schema.properties[key].$ref.replace('#', '').substring(1)
        let value = referencia.split('/')

        for (const chave in schemaDefinitions) {
          if (schemaDefinitions[value[1]]) {
            resp[key] = fillSchemaWithFake(data[key] || {}, schemaDefinitions[value[1]], schema.definitions)
          }
        }

      } else {
        switch (schema.properties[key].type) {
          case 'string':
          case 'integer':
          case 'number':
          case 'boolean':
            resp[key] = ''
            break
          case 'array':
            resp[key] = []
            if (schema.properties[key].items.type === 'object') {
              if (data[key] && data[key].length) {
                for (let i = 0; i < data[key].length; i++) {
                  resp[key].push(fillSchemaWithFake(data[key][i], schema.properties[key].items, schema.definitions))
                }
              } else {
                resp[key].push(fillSchemaWithFake({}, schema.properties[key].items, schema.definitions))
              }
            }
            break
          case 'object':
            resp[key] = fillSchemaWithFake(data[key] || {}, schema.properties[key], schema.definitions)
            break
          default: break
        }
      }
    }
  }
  return resp
}

module.exports = fillSchemaWithFake
