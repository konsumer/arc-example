// learn more about HTTP functions here: https://arc.codes/primitives/http

const { readFileSync } = require('fs')
const arc = require('@architect/functions')
const { Api } = require('../../api')

const api = new Api()
const template = readFileSync(`${__dirname}/body.html`).toString()

exports.handler = async function http (req) {
  const { call, ...query } = arc.http.helpers.bodyParser(req)
  const results = await api[call].apply(api, Object.values(query))

  return {
    headers: { 'content-type': 'text/html; charset=utf8' },
    body: template.replace('OUTPUT', JSON.stringify({ call, query, results }, null, 2))
  }
}
