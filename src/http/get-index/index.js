// learn more about HTTP functions here: https://arc.codes/primitives/http

const { readFileSync } = require('fs')
const { dateFormat, NOW, EPOCH, MONTHAGO } = require('../../api')

const template = readFileSync(`${__dirname}/body.html`).toString()

exports.handler = async function http (req) {
  const body = template
    .replace(/NOW/g, dateFormat(NOW()))
    .replace(/EPOCH/g, dateFormat(EPOCH))
    .replace(/MONTHAGO/g, dateFormat(MONTHAGO()))
  return {
    headers: { 'content-type': 'text/html; charset=utf8' },
    body
  }
}
