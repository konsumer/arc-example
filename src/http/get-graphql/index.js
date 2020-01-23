// just serve playground.html static file

// TODO: add cache headers

const { readFileSync } = require('fs')

const body = readFileSync(`${__dirname}/playground.html`).toString()

exports.handler = async function http (req) {
  return {
    headers: { 'content-type': 'text/html; charset=utf8' },
    body
  }
}
