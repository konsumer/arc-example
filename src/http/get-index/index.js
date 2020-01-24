// learn more about HTTP functions here: https://arc.codes/primitives/http

const { readFileSync } = require('fs')

const template = readFileSync(`${__dirname}/body.html`).toString()

exports.handler = async function http (req) {
  const body = template
    .replace(/DATENOW/g, (new Date()).toISOString().split('T').shift())
  return {
    headers: { 'content-type': 'text/html; charset=utf8' },
    body
  }
}
