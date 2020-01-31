/* global describe, it, expect, beforeAll, afterAll */
const arc = require('@architect/functions')

describe('api', () => {
  it('should get correctly named tables', async () => {
    const tables = await arc.tables()
    expect(tables.reflect).toBeDefined()
    expect(tables.hroe).toBeDefined()
  })
})
