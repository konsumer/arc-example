// this will create mock for your dynamo database from the records in data.json

const arc = require('@architect/functions')
const data = require('./data.json')

// TODO: fill in GSI data and other fields (from joins, etc)

const recordMap = (table) => {
  if (table === 'Employment') {
    return data.Employment.map(record => {
      // joins
      const person = data.Person.find(r => r.Person_ID === record.Person_ID)

      return {
        PK: 'EMPLOYEE_' + record.Employee_ID,
        SK: [person.First_name, person.Middle_names, person.Last_name].filter(n => n && n !== '').join(' '),

        JobID: 'JOB_' + record.HR_Job_ID,
        ManagerID: 'EMPLOYEE_' + record.Manager_Employee_ID,
        StartDate: record.Start_Date ? record.Start_Date.split('T')[0] : '',
        EndDate: record.End_Date ? record.End_Date.split('T')[0] : '',
        Salary: record.Salary,
        Commision_Percent: record.Commision_Percent,
        Gender: person.Gender
      }
    })
  }
  // TODO: need to figure out Region
  // if (table === 'Region') {
  // }

  if (table === 'Country') {
    return data.Country.map(record => {
      return {
        PK: 'COUNTRY_' + record.Country_Code,
        SK: record.Country_Name,
        Currency: record.Currency_Code
      }
    })
  }

  if (table === 'Location') {
    return data.Location.map(record => {
      // joins
      const country = data.Country.find(r => r.Country_ID === record.Country_ID)
      return {
        PK: 'LOCATION_' + record.Location_ID,
        SK: country.Country_Code,
        Address1: record.Address_Line_1,
        Address2: record.Address_Line_2,
        City: record.City,
        State: record.State,
        Zip: record.Postal_code
      }
    })
  }

  if (table === 'Department') {
    // unique departments
    return [...new Set(data.Customer_Employee.map(e => e.Department))].map(DepartmentID => {
      return {
        PK: 'DEPARTMENT_' + DepartmentID.replace(/ /g, '_').toUpperCase(),
        SK: DepartmentID
      }
    })
  }

  if (table === 'Customer') {
    return data.Customer.map(record => {
      return {
        PK: 'CUSTOMER_' + record.Customer_ID,
        SK: 'EMPLOYEE_' + record.AccountMgr_ID
      }
    })
  }

  if (table === 'Order') {
    return data.Order.map(record => {
      return {
        PK: 'ORDER_' + record.Order_ID,
        SK: 'CUSTOMER_' + record.Customer_ID
      }
    })
  }

  if (table === 'Product') {
    return data.Product.map(record => {
      return {
        PK: 'PRODUCT_' + record.Product_ID,
        SK: record.Product_Name
      }
    })
  }

  if (table === 'Warehouse') {
    return data.Warehouse.map(record => {
      return {
        PK: 'WAREHOUSE_' + record.Warehouse_ID,
        SK: 'LOCATION_' + record.Location_ID
      }
    })
  }

  // no mapping
  return []
}

// GSI-Bucket count: see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html
const N = 15

const run = async () => {
  let records = []
  // const { hroe } = await arc.tables()
  for (const table of ['Employment', 'Region', 'Country', 'Location', 'Job', 'Department', 'Customer', 'Order', 'Product', 'Warehouse']) {
    records = [...records, ...recordMap(table)]
  }
  console.log(records)
}
run()
