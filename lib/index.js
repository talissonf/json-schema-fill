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
        case 'number':
          resp[key] = ''
          break
        case 'boolean':
          resp[key] = false
          break
        case 'array':
          resp[key] = resp[key] || []
          resp[key].push(fillSchemaWithFake(data, schema.properties[key].items))
          break
        case 'object':
          resp[key] = resp[key] || {}
          resp[key] = fillSchemaWithFake(data, schema.properties[key])
          break
        default: break
      }
    }
  }
  console.log(JSON.stringify(resp))
  return resp
}

module.exports = fillSchemaWithFake
