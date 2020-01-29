const arc = require('@architect/functions')

// This describes the API
// Since I want a fairly close-mapping with the AWS example I focused on that, even though your data-server might need some other key-structure

// TODO: map outputted items so they have nicely named fields, instead of p/s/gs1p/gs1s/gs2p/gs2s

// util function to convert js date into date-string
const dateFormat = d => d.toISOString().split('T').shift()

// this makes code more readable to me, below
const GSI1 = 'arc-hroe-example-staging-hroe-SK-Data-index'
const GSI2 = 'arc-hroe-example-staging-hroe-GSI-Bucket-index'

class Api {
  // Look up Employee Details by Employee ID
  // PK="HR-employeeId"
  async employeeDetailsById (employeeId) {
    const { hroe } = await arc.tables()
    return hroe.query({
      KeyConditionExpression: 'PK=:employeeId',
      ExpressionAttributeValues: {
        ':employeeId': `HR-${employeeId}`
      }
    })
  }

  // Query Employee Details by Employee Name
  // GSI1_PK="employeeName"
  async employeeDetailsByName (employeeName) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:employeeName',
      ExpressionAttributeValues: {
        ':employeeName': employeeName
      }
    })
  }

  // Get an employee's current job details only
  // PK="EmployeeId", SK starts-with "J-"
  async employeeCurrentDetailsById (employeeId) {
    const { hroe } = await arc.tables()
    return hroe.query({
      KeyConditionExpression: 'PK=:employeeId AND SK BEGINS_WITH "J-"',
      ExpressionAttributeValues: {
        ':employeeId': employeeId
      }
    })
  }

  // Get Orders for a customer for a date range
  // GSI1_PK="CustomerId", GSI1_SK="status#date"
  async ordersByCustomerAndDate (customerId, start = 0, end, status = 'OPEN') {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:customerId AND Data BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':customerId': customerId,
        ':start': `${status}#${dateFormat(new Date(start))}`,
        ':end': `${status}#${dateFormat(new Date(end))}`
      }
    })
  }

  // Show all Orders in OPEN status for a date range across all customers
  // GSI2_PK=query in parallel for the range [0..N], GSI2_SK between OPEN#start & OPEN#end
  async ordersByDate (start = 0, end, status = 'OPEN') {
    // TODO: need to work out "GSI2_PK=query in parallel for the range [0..N]"
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI2,
      KeyConditionExpression: 'Data BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':start': `${status}#${dateFormat(new Date(start))}`,
        ':end': `${status}#${dateFormat(new Date(end))}`
      }
    })
  }

  // All Employees Hired recently
  // GSI1_PK="HR-CONFIDENTIAL", GSI1_SK > since
  // default is 1 month before today
  async employeeRecentHires (since = Date.now() - 2.628e+9) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK="HR-CONFIDENTIAL" AND Data>:since',
      ExpressionAttributeValues: {
        ':since': dateFormat(new Date(since))
      }
    })
  }

  // Find all employees in specific Warehouse
  // Use GSI1_PK="wareHouseId"
  async employeesByWarehouse (warehouseId) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:warehouseId',
      ExpressionAttributeValues: {
        ':warehouseId': warehouseId
      }
    })
  }

  // Get all Orderitems for a Product including warehouse location inventories
  // Use GSI1_PK="productId"
  async ordersByProduct (productId) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:productId',
      ExpressionAttributeValues: {
        ':productId': productId
      }
    })
  }

  // Get customers by Account Rep
  // Use GSI1_PK="repId"
  async customersByRep (repId) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:repId',
      ExpressionAttributeValues: {
        ':repId': repId
      }
    })
  }

  // Get orders by Account Rep and date
  // Use GSI1_PK="repId", GSI1_SK="status#date"
  async ordersByRepAndDate (repId, date = Date.now() - 2.628e+9, status = 'OPEN') {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI2,
      KeyConditionExpression: 'SK=:repId AND Data>:date',
      ExpressionAttributeValues: {
        ':date': `${status}#${dateFormat(new Date(date))}`,
        ':repId': repId
      }
    })
  }

  // Get all employees with specific Job Title
  // Use GSI1_PK=v0O-JOBTITLE
  async employeesByJobTitle (jobTitle) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:jobTitle',
      ExpressionAttributeValues: {
        ':jobTitle': jobTitle
      }
    })
  }

  // Get inventory by Product and Warehouse
  // PK="productId", SK="warehouseId"
  async inventoryByProductAndWarehouse (productId, warehouseId) {
    const { hroe } = await arc.tables()
    return hroe.query({
      KeyConditionExpression: 'PK=:productId AND SK=:warehouseId',
      ExpressionAttributeValues: {
        ':productId': productId,
        ':warehouseId': warehouseId
      }
    })
  }

  // Get total product inventory
  // PK="OE-productId", SK="productId"
  async inventoryByProduct (productId) {
    const { hroe } = await arc.tables()
    return hroe.query({
      KeyConditionExpression: 'PK=:oe_productId AND SK=:productId',
      ExpressionAttributeValues: {
        ':productId': productId,
        ':oe_productId': `OE-${productId}`
      }
    })
  }

  // Get Account Reps ranked by Order Total and Sales Period
  // Use GSI1_PK=quarter, scanindexForward=False
  async getRepsByPeriod (quarter) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: GSI1,
      KeyConditionExpression: 'SK=:quarter',
      ExpressionAttributeValues: {
        ':quarter': quarter
      },
      ScanIndexForward: false
    })
  }
}

exports.Api = Api
exports.dateFormat = dateFormat
