const arc = require('@architect/functions')

// This describes the API
// Since I want a fairly close-mapping with the AWS example I focused on that
// But in a real app, you might want to make it more closely match your graphql SDL (just lookups and joins and whatever else is left for)
// You could also put this stuff directly in your graphql resolvers.

class Api {
  // Look up Employee Details by Employee ID
  // Table-PK="EmployeeId"
  async employeeDetailsById (employeeId) {
    const { hroe } = await arc.tables()
    return hroe.query({
      KeyConditionExpression: 'p = :employeeId',
      ExpressionAttributeValues: {
        ':employeeId': employeeId
      }
    })
  }

  // Query Employee Details by Employee Name
  // GSI1-PK="EmployeeName"
  async employeeDetailsByName (employeeName) {
    const { hroe } = await arc.tables()
    return hroe.query({
      IndexName: 'ap-as-index',
      KeyConditionExpression: 'ap = :employeeName',
      ExpressionAttributeValues: {
        ':employeeName': employeeName
      }
    })
  }

  // Get an employee's current job details only
  // Table-PK="EmployeeId", Table-SK starts-with "vo"
  async employeeCurrentDetailsById (employeeId) {}

  // Get Orders for a customer for a date range
  // GSI1-PK="CustomerId", GSI1-SK="status#date", for each StatusCode
  async ordersByCustomerAndDate (customerId, start = new Date(0), end = new Date(), status = 'OPEN') {}

  // Show all Orders in OPEN status for a date range across all customers
  // Use GSI2-PK=query in parallel for the range [0..N], GSI2-SK between OPEN-start & OPEN-end
  async ordersByDate (start = new Date(0), end = new Date(), status = 'OPEN') {}

  // All Employees Hired recently
  // Use GSI1-PK="HR-CONFIDENTIAL", GSI1-SK > datel
  // default is 1 month before today
  async employeeRecentHires (since = new Date(Date.now() - 2.628e+9)) {}

  // Find all employees in specific Warehouse
  // Use GSI-1, PKR="wareHouseId"
  async employeesByWarehouse (warehouseId) {}

  // Get all Orderitems for a Product including warehouse location inventories
  // Use GSI1-PKR="productId"
  async ordersByProduct (productId) {}

  // Get customers by Account Rep
  // Use GSI1-PK="repId"
  async customersByRep (repId) {}

  // Get orders by Account Rep and date
  // Use GSI1-PK="repId", GSI1-SK="STATUS-DATE", for each StatusCode
  async ordersByRepAndDate (repId, date = new Date(Date.now() - 2.628e+9), status = 'OPEN') {}

  // Get all employees with specific Job Title
  // Use GSI1-PK=v0O-JOBTITLE
  async employeesByJobTitle (jobTitle) {}

  // Get inventory by Product and Warehouse
  // Table-PK="productId", Table-SK="warehouseId"
  async inventoryByProductAndWarehouse (productId, warehouseId) {}

  // Get total product inventory
  // Table-PK="OE-productId", Table-SK="productId"
  async inventoryByProduct (productId) {}

  // Get Account Reps ranked by Order Total and Sales Period
  // Use GSI1-PK=quarter, scanindexForward=False
  async getRepsByPeriod (quarter) {}
}

exports.Api = Api
