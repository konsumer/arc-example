/* global describe, it, before, after */

// TODO: look into https://volument.com/baretest

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
    it('Look up Employee Details by Employee ID', async () => {
      const r = await api.employeeDetailsById('EMPLOYEE1')
      expect(r).to.be.ok()
    })

    it('Query Employee ID by Employee Name', async () => {
      const r = await api.employeeIdByName('John Smith')
      expect(r).to.be.ok()
    })

    it('Get an employee\'s current job details only', async () => {
      const r = await api.employeeCurrentJob('EMPLOYEE1')
      expect(r).to.be.ok()
    })

    it('Get Orders for a customer for a date range', async () => {
      const r = await api.ordersByCustomer('CUSTOMER1')
      expect(r).to.be.ok()
    })

    it('Show all Orders in OPEN status for a date range across all customers', async () => {
      const r = await api.ordersOpen()
      expect(r).to.be.ok()
    })

    it('All Employees Hired recently', async () => {
      const r = await api.employeesRecent()
      expect(r).to.be.ok()
    })

    it('Find all employees in specific Warehouse', async () => {
      const r = await api.employeesByWarehouse('WAREHOUSE1')
      expect(r).to.be.ok()
    })

    it('Get all Order items for a Product including warehouse location inventories', async () => {
      const r = await api.ordersByProduct('PRODUCT1')
      expect(r).to.be.ok()
    })

    it('Get customers by Account Rep', async () => {
      const r = await api.customerByRep('EMPLOYEE1')
      expect(r).to.be.ok()
    })

    it('Get orders by Account Rep and date', async () => {
      const r = await api.ordersByRep('EMPLOYEE1')
      expect(r).to.be.ok()
    })

    it('Get all employees with specific Job Title', async () => {
      const r = await api.employeesByTitle('Principal Account Manager')
      expect(r).to.be.ok()
    })

    it('Get inventory by Product and Warehouse', async () => {
      const r = await api.inventoryByWarehouse('PRODUCT1', 'WAREHOUSE1')
      expect(r).to.be.ok()
    })

    it('Get total product inventory', async () => {
      const r = await api.inventory('PRODUCT1')
      expect(r).to.be.ok()
    })

    it('Get Account Reps ranked by Order Total and Sales Period', async () => {
      const r = await api.accountRepsRankedByTotalAndQuarter('2017-Q1')
      expect(r).to.be.ok()
    })
  })
})
