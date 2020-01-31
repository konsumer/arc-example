/* global describe, it, expect, beforeAll, afterAll */
const sandbox = require('@architect/sandbox')

describe('api', () => {
  it('should be able to start the sandbox', async () => {
    const end = sandbox.start()
    end()
  })
})
