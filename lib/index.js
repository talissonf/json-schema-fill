'use strict'
const fillSchemaWithFake = (data, schema) => {
  let resp = {}
  for (const key in schema.properties) {
    if (data.hasOwnProperty(key)) {
      resp[key] = data[key]
    } else {
      switch (schema.properties[key].type) {
        case 'string':
          resp[key] = ''
          break
        case 'integer':
          resp[key] = ''
          break
        case 'boolean':
          resp[key] = false
          break
        case 'array':
          resp[key] = []
          resp[key].push(fillSchemaWithFake(data, schema.properties[key].items))
          break
        case 'object':
          resp[key] = {}
          resp[key] = fillSchemaWithFake(data, schema.properties[key])

          if (schema.properties[key].hasOwnProperty('patternProperties')) {
            let patternProperties = Object.keys(schema.properties[key].patternProperties)[0]
            patternProperties.toString().replace('^', '')
            patternProperties.toString().replace('$', '')
            if (patternProperties !== '[a-z0-9_]{2,30}') {
              let patterns = patternProperties.split('|')
              for (let i = 0; i < patterns.length; i++) {
                resp[key][patterns[i]] = {}
                resp[key][patterns[i]] = fillSchemaWithFake(data, schema.properties[key].patternProperties[patternProperties])
              }
            } else {
              resp[key] = {}
              resp[key] = fillSchemaWithFake(data, schema.properties[key])
            }
          } else {
            resp[key] = {}
            resp[key] = fillSchemaWithFake(data, schema.properties[key])
          }
          break
        default: break
      }
    }
  }
  return resp
}

module.exports = fillSchemaWithFake
