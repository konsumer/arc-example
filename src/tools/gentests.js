// this generates forms for http/get-index from markdown table

const { getFunctions } = require('./utils')

const lowerfirst = string => string.charAt(0).toLowerCase() + string.slice(1)

const run = async () => {
  const functions = await getFunctions()
  const out = `/* global describe, it, before, after */

const expect = require('expect.js')
const arc = require('@architect/functions')
const sandbox = require('@architect/sandbox')
const { Api } = require('./api')

let api

before(async () => {
  api = new Api()
  await sandbox.start({ quiet: true })
})
after(async () => {
  await sandbox.end()
})

describe('arc-example', () => {
  describe('arc', () => {
    it('should have started sandbox', async () => {
      expect(sandbox.db).to.be.ok()
    })

    it('should have setup hroe table', async () => {
      const data = await arc.tables()
      expect(data.hroe).to.be.ok()
    })
  })

  describe('api', () => {
    ${functions.map(({ description, func, args, query }) => {
return `
    it('should ${lowerfirst(description)}', async () => {
      const r = await api.${func}(${args})
      expect(r).to.be.ok()
    })`
    }).join('\n')}
  })
})
`
  console.log(out)
}

run()
