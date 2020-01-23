const arc = require('@architect/functions')

// This describes the API
// Since I want a fairly close-mapping with the AWS example I focused on that
// But in a real app, you might want to make it more closely match your graphql SDL (just lookups and joins and whatever else is left for)
// You could also put this stuff directly in your graphql resolvers.

class Api {
  // async function to get table lib
  table () {
    return arc.tables()
      .then(t => t.hroe)
  }

  // Look up Employee Details by Employee ID
  // Table-PK="EmployeeId"
  async employeeDetailsById (employeeId) {
    const t = await this.table()
    return t.query({
      key_condition_expression: 'pk = :employeeId',
      expression_attribute_values: {
        ':employeeId': { S: employeeId }
      }
    })
  }

  // Query Employee Details by Employee Name
  // GSI1-PK="EmployeeName"
  employeeDetailsByName (employeeName) {}

  // Get an employee's current job details only
  // Table-PK="EmployeeId", Table-SK starts-with "vo"
  employeeCurrentDetailsById (employeeId) {}

  // Get Orders for a customer for a date range
  // GSI1-PK="CustomerId", GSI1-SK="status#date", for each StatusCode
  ordersByCustomerAndDate (customerId, start = new Date(0), end = new Date(), status = 'OPEN') {}

  // Show all Orders in OPEN status for a date range across all customers
  // Use GSI2-PK=query in parallel for the range [0..N], GSI2-SK between OPEN-start & OPEN-end
  ordersByDate (start = new Date(0), end = new Date(), status = 'OPEN') {}

  // All Employees Hired recently
  // Use GSI1-PK="HR-CONFIDENTIAL", GSI1-SK > datel
  // default is 1 month before today
  employeeRecentHires (since = new Date(Date.now() - 2.628e+9)) {}

  // Find all employees in specific Warehouse
  // Use GSI-1, PKR="wareHouseId"
  employeesByWarehouse (warehouseId) {}

  // Get all Orderitems for a Product including warehouse location inventories
  // Use GSI1-PKR="productId"
  ordersByProduct (productId) {}

  // Get customers by Account Rep
  // Use GSI1-PK="repId"
  customersByRep (repId) {}

  // Get orders by Account Rep and date
  // Use GSI1-PK="repId", GSI1-SK="STATUS-DATE", for each StatusCode
  ordersByRepAndDate (repId, date = new Date(Date.now() - 2.628e+9), status = 'OPEN') {}

  // Get all employees with specific Job Title
  // Use GSI1-PK=v0O-JOBTITLE
  employeesByJobTitle (jobTitle) {}

  // Get inventory by Product and Warehouse
  // Table-PK="productId", Table-SK="warehouseId"
  inventoryByProductAndWarehouse (productId, warehouseId) {}

  // Get total product inventory
  // Table-PK="OE-productId", Table-SK="productId"
  inventoryByProduct (productId) {}

  // Get Account Reps ranked by Order Total and Sales Period
  // Use GSI1-PK=quarter, scanindexForward=False
  getRepsByPeriod (quarter) {}
}

exports.Api = Api
