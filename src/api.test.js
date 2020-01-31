/* global describe, it, expect, beforeAll, afterAll */
const sandbox = require('@architect/sandbox')
const { Api } = require('./api')

// this doesn't work in arc yet. needs to allow quiet param (architect/issues#621) and needs
// beforeAll(() => {
//   const api = new Api()
//   return sandbox.start({quiet: true})
// })
// afterAll(sandbox.end)

let api
beforeAll(() => {
  api = new Api()
})

describe('api', () => {
  describe('employeeDetailsById', () => {
    it('should be able to look up an employee by ID', async () => {
      const results = await api.employeeDetailsById('EMPLOYEE1')
      console.log(results)
    })
  })
})
