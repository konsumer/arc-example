// learn more about HTTP functions here: https://arc.codes/primitives/http

const { readFileSync } = require('fs')

const body = readFileSync(`${__dirname}/body.html`).toString()

exports.handler = async function http (req) {
  const out = {}

  return {
    headers: { 'content-type': 'text/html; charset=utf8' },
    body: body.replace('OUTPUT', JSON.stirngify(out, null, 2))
  }
}
