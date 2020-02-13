const arc = require('@architect/functions')

// This describes the API
// Since I want a fairly close-mapping with the AWS example I focused on that, even though your data-server might need some other key-structure

// These make things easier to read & match the docs better

// util: convert js date into date-string YYYY-MM-DD
const dateFormat = d => (new Date(d)).toISOString().split('T').shift()

// names for your indexes, as they are in table
const GSI1 = 'SK-GSI1_SK-index'
const GSI2 = 'GSI2_PK-GSI1_SK-index'
const GSI3 = 'GSI1_SK-index'

// util: first date - Wed Dec 31 1969 16:00:00 GMT-0800
const EPOCH = new Date(0)

// util: current date
const NOW = () => new Date()

// util: a month ago
const MONTHAGO = () => new Date(Date.now() - 2.628e+9)

// this is organaized a class, but it has no state, so you could implement it as a bunch of plain methods, if you wanted
class Api {
  // Look up Employee Details by Employee ID
  // PK="HR-{employeeID}"
  async employeeDetailsById (employeeID) {
    const { hroe } = await arc.tables()
    const r = await hroe.query({
      KeyConditionExpression: 'PK=:employeeID',
      ExpressionAttributeValues: {
        ':employeeID': `HR-${employeeID}`
      }
    })

    if (!r.Items.length) {
      return undefined
    }

    // make the detail-object look nice
    const item = { PositionPast: [], ID: employeeID, Quotas: [] }
    r.Items.forEach(({ PK, SK, GSI1_SK, GSI2_PK, ...record }) => {
      Object.keys(record).forEach(k => {
        item[k] = record[k]
      })
      if (SK === 'HR-CONFIDENTIAL') {
        item.HireDate = GSI1_SK
      }
      if (SK.startsWith('J-')) {
        item.PositionCurrent = {
          ID: SK,
          Title: GSI1_SK
        }
      }
      if (SK.startsWith('JH-')) {
        item.PositionPast.push({
          ID: SK,
          Title: GSI1_SK
        })
      }
      if (SK.startsWith('QUOTA-')) {
        item.Quotas.push({
          Quarter: SK.replace('QUOTA-', ''),
          Amount: parseFloat(GSI1_SK)
        })
      }
      if (SK.includes('|')) {
        item.Seat = GSI1_SK
        item.Region = SK
      }
    })
    return item
  }

  // Query Employee Details by Employee Name
  // GSI1_PK={employeeName}
  async employeeIdByName (employeeName) {
    const { hroe } = await arc.tables()
    const r = await hroe.query({
      IndexName: GSI3,
      KeyConditionExpression: 'GSI1_SK=:employeeName',
      ExpressionAttributeValues: {
        ':employeeName': employeeName
      }
    })

    return {
      Name: employeeName,
      ID: r.Items[0].SK
    }
  }

  // Get an employee's current job details only
  // PK="HR-{employeeID}", SK.beginsWith("J")
  async employeeCurrentJob (employeeID) {
    const { hroe } = await arc.tables()
    const r = await hroe.query({
      KeyConditionExpression: 'PK=:employeeID AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':employeeID': `HR-${employeeID}`,
        ':prefix': 'J-'
      }
    })

    return {
      ID: employeeID,
      PositionCurrent: {
        ID: r.Items[0].SK,
        Title: r.Items[0].GSI1_SK
      }
    }
  }

  // Get Orders for a customer for a date range
  // SK={employeeID}, GSI1_SK.between("{status}-{start}", "{status}-{end}")
  async ordersByCustomer (customerID, status = 'OPEN', start = EPOCH, end = NOW()) {
    const { hroe } = await arc.tables()
    const r = await hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:customerID AND GSI1_SK BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':customerID': customerID,
        ':start': `${status}#${dateFormat(start)}`,
        ':end': `${status}#${dateFormat(end)}`
      }
    })
    return r.Items.map(({ PK, SK, GSI1_SK, SalesRepID }) => {
      const [Status, OrderDate] = GSI1_SK.split('#')
      return {
        ID: PK,
        Customer: SK,
        SalesRep: SalesRepID,
        Status,
        OrderDate
      }
    })
  }

  // Show all Orders in OPEN status for a date range across all customers
  // GSI2_PK=parallell([0...N]), GSI1_SK.between("{status}-{start}", "{status}-{end}")
  async ordersByStatus (start = 0, end = NOW, status = 'OPEN') {
    const { hroe } = await arc.tables()
    const r = await Promise.all([...new Array(15)].map((v, bucket) => {
      return hroe.query({
        IndexName: GSI2,
        KeyConditionExpression: 'GSI2_PK=:bucket AND GSI1_SK BETWEEN :start AND :end',
        ExpressionAttributeValues: {
          ':bucket': bucket,
          ':start': `${status}#${dateFormat(start)}`,
          ':end': `${status}#${dateFormat(end)}`
        }
      })
    }))
    // TODO: map to nicer structure
    return r.map(i => i.Items).reduce((a, c) => [...a, ...c], [])
  }

  // All Employees Hired recently
  // SK="HR-CONFIDENTIAL", GSI1_SK > {start}
  async employeesRecent (start = MONTHAGO()) {
    const { hroe } = await arc.tables()
    // TODO: not working
    const r = await hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:key AND GSI1_SK > :start',
      ExpressionAttributeValues: {
        ':start': dateFormat(start),
        ':key': 'HR-CONFIDENTIAL'
      }
    })
    return {
      ID: r.Items[0].PK.replace('HR-', ''),
      StartDate: r.Items[0].GSI1_SK
    }
  }

  // Find all employees in specific Warehouse
  // GSI1_PK={warehouseID}
  async employeesByWarehouse (warehouseID) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:warehouseID',
      ExpressionAttributeValues: {
        ':warehouseID': warehouseID
      }
    })
  }

  // Get all Order items for a Product including warehouse location inventories
  // GSI1_PK={productID}
  async ordersByProduct (productID) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:productID',
      ExpressionAttributeValues: {
        ':productID': productID
      }
    })
  }

  // Get customers by Account Rep
  // GSI1_PK={employeeID}
  async customerByRep (employeeID) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:employeeID',
      ExpressionAttributeValues: {
        ':employeeID': employeeID
      }
    })
  }

  // Get orders by Account Rep and date
  // GSI1_PK={employeeID}, GSI1_SK="{status}-{start}"
  async ordersByRep (employeeID, status = 'OPEN', start = EPOCH) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:employeeID AND GSI1_SK=:start',
      ExpressionAttributeValues: {
        ':employeeID': employeeID,
        ':start': `${status}#${dateFormat(start)}`
      }
    })
  }

  // Get all employees with specific Job Title
  // GSI1_PK="JH-{title}"
  async employeesByTitle (title) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:title',
      ExpressionAttributeValues: {
        ':title': `JH-${title}`
      }
    })
  }

  // Get inventory by Product and Warehouse
  // PK="OE-{productID}", SK={warehouseID}
  async inventoryByWarehouse (productID, warehouseID) {
    const { hroe } = await arc.tables()
  }

  // Get total product inventory
  // PK="OE-{productID}", SK={productID}
  async inventory (productID) {
    const { hroe } = await arc.tables()
  }

  // Get Account Reps ranked by Order Total and Sales Period
  // GSI1_PK={quarter}, scanindexForward=False
  async accountRepsRankedByTotalAndQuarter (quarter) {
    const { hroe } = await arc.tables()
  }
}

module.exports = { Api, dateFormat, EPOCH, NOW, MONTHAGO }
