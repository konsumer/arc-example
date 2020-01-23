const { graphql } = require('graphql')
const { schema } = require('./schema')
const { Api } = require('../api')

const api = new Api()

exports.handler = async function http (req) {
  const { query, variables, operationName } = JSON.parse(Buffer.from(req.body, 'base64'))

  return {
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(await graphql(schema, query, {}, { request: req, api }, variables, operationName))
  }
}
