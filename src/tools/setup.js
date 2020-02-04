// this will create mock for your database

const arc = require('@architect/functions')
const data = require('./data.json')

// TODO: need to improve the data and put it in easier-to-follow original format then
// use this mapping to create dynamo records
const keymap = {
  Employee: { PK: 'EmployeeID', SK: 'EmployeeName' },
  Region: { PK: 'RegionID', SK: 'RegionName' },
  Country: { PK: 'CountryId', SK: 'CountryName' },
  Location: { PK: 'LocationID', SK: 'CountryName' },
  Job: { PK: 'JobID', SK: 'JobTitle' },
  Department: { PK: 'DepartmentID', SK: 'DepartmentID' },
  Customer: { PK: 'CustomerID', SK: 'AccountRepID' },
  Order: { PK: 'OrderID', SK: 'CustomerID' },
  Product: { PK: 'ProductID', SK: 'ProductName' },
  Warehouse: { PK: 'WarehouseID', SK: 'RegionName' }
}

// GSI-Bucket count: see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html
const N = 15

const run = async () => {
  const { hroe } = await arc.tables()
  try {
    await Promise.all(data.map(r => {
      const record = {}
      Object.keys(r).forEach(k => {
        if (r[k] && r[k] !== '') {
          record[k] = r[k]
        }
      })
      record.GSI2_PK = Math.floor(Math.random() * N)
      return hroe.put(record)
    }))
    console.log(`put ${data.length} records.`)
  } catch (e) {
    console.error(e.message)
  }
}
run()
