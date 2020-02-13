/* global describe, it, beforeAll, afterAll, expect */

// TODO: look into https://volument.com/baretest

const arc = require('@architect/functions')
const sandbox = require('@architect/sandbox')
const { Api } = require('./api')

let api

beforeAll(async () => {
  api = new Api()
  await sandbox.start({ quiet: true })
})
afterAll(async () => {
  await sandbox.end()
})

describe('arc-example', () => {
  describe('arc', () => {
    it('should have started sandbox', async () => {
      expect(sandbox.db).toBeDefined()
    })

    it('should have setup hroe table', async () => {
      const data = await arc.tables()
      expect(data.hroe).toBeDefined()
    })
  })

  describe('api', () => {
    it('Look up Employee Details by Employee ID', async () => {
      const r = await api.employeeDetailsById('EMPLOYEE1')
      expect(r).toBeDefined()
    })

    it.skip('Query Employee ID by Employee Name', async () => {
      const r = await api.employeeIdByName('John Smith')
      expect(r).toBeDefined()
    })

    it.skip('Get an employee\'s current job details only', async () => {
      const r = await api.employeeCurrentJob('EMPLOYEE1')
      expect(r).toBeDefined()
    })

    it('Get Orders for a customer for a date range', async () => {
      const r = await api.ordersByCustomer('CUSTOMER1')
      expect(r).toBeDefined()
    })

    it.skip('Show all Orders in OPEN status for a date range across all customers', async () => {
      const r = await api.ordersOpen()
      expect(r).toBeDefined()
    })

    it.skip('All Employees Hired recently', async () => {
      const r = await api.employeesRecent()
      expect(r).toBeDefined()
    })

    it('Find all employees in specific Warehouse', async () => {
      const r = await api.employeesByWarehouse('WAREHOUSE1')
      expect(r).toBeDefined()
    })

    it('Get all Order items for a Product including warehouse location inventories', async () => {
      const r = await api.ordersByProduct('PRODUCT1')
      expect(r).toBeDefined()
    })

    it('Get customers by Account Rep', async () => {
      const r = await api.customerByRep('EMPLOYEE1')
      expect(r).toBeDefined()
    })

    it('Get orders by Account Rep and date', async () => {
      const r = await api.ordersByRep('EMPLOYEE1')
      expect(r).toBeDefined()
    })

    it('Get all employees with specific Job Title', async () => {
      const r = await api.employeesByTitle('Principal Account Manager')
      expect(r).toBeDefined()
    })

    it.skip('Get inventory by Product and Warehouse', async () => {
      const r = await api.inventoryByWarehouse('PRODUCT1', 'WAREHOUSE1')
      expect(r).toBeDefined()
    })

    it.skip('Get total product inventory', async () => {
      const r = await api.inventory('PRODUCT1')
      expect(r).toBeDefined()
    })

    it.skip('Get Account Reps ranked by Order Total and Sales Period', async () => {
      const r = await api.accountRepsRankedByTotalAndQuarter('2017-Q1')
      expect(r).toBeDefined()
    })
  })
})
