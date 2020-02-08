// this will generate fake data

const faker = require('faker')
const cc = require('@saadixl/countries')
const { RandomSSN } = require('ssn')

const data = {}

// some kind of hex-based seating system
const randomSeat = () => (faker.random.number(1024) + 1024).toString(16).split('').map(c => `${c}${faker.random.number(15).toString(16)}`).join('|').toUpperCase()

const randomPassport = () => [...Array(faker.random.number(3) + 6)].map(() => faker.random.alphaNumeric()).join('').toUpperCase()

const randomSSN = new RandomSSN()

data.Customer_Company = [...Array(10)].map((v, i) => {
  return {
    Company_ID: i,
    Company_Name: faker.company.companyName(),
    Description: faker.company.catchPhrase(),
    Company_Credit_Limit: faker.random.number(100) * 10000,
    Credit_Limit_Currency: faker.finance.currencyCode()
  }
})

data.Person = [...Array(100)].map((v, i) => {
  return {
    Person_ID: i,
    First_name: faker.name.firstName(),
    Last_name: faker.name.lastName(),
    Middle_names: Math.random() > 0.7 ? faker.name.firstName() : '',
    Nat_long_code: faker.random.number(100),
    Culture_code: faker.random.number(100),
    Gender: Math.random() > 0.2 ? faker.random.arrayElement(['Male', 'Female']) : faker.random.arrayElement(['Non-binary', 'Other'])
  }
})

data.Country = ['US', 'CN', 'JP', 'DE', 'FR'].map((c, i) => {
  const country = cc(c)
  return {
    Country_ID: i,
    Country_Name: country.name,
    Country_Code: c,
    Nat_Lang_Code: faker.random.number(100),
    Currency_Code: country.currencyCode
  }
})

// Every Customer_Company has 1-20 employees
data.Customer_Employee = []
data.Customer_Company.forEach((company, cid) => {
  [...Array(Math.floor(Math.random() * 20))].forEach((v, i) => {
    data.Customer_Employee.push({
      Customer_Employee_ID: i + cid,
      Company_ID: company.Company_ID,
      Badge_Number: faker.random.alphaNumeric(20).toUpperCase(),
      Job_Title: faker.name.jobTitle(),
      Department: faker.name.jobArea(),
      Credit_Limit: faker.random.number(100) * 10000,
      Credit_Limit_Currency: faker.random.arrayElement(data.Country).Currency_Code
    })
  })
})

data.Customer = [...Array(50)].map((v, i) => {
  return {
    Customer_ID: i,
    Person_ID: faker.random.arrayElement(data.Person).Person_ID,
    Customer_Employee_ID: faker.random.arrayElement(data.Customer_Employee).Customer_Employee_ID,
    AccountMgr_ID: faker.random.arrayElement(data.Customer_Employee).Customer_Employee_ID,
    Income_level: faker.random.number(100) * 10000
  }
})

data.Product = [...Array(200)].map((v, i) => {
  return {
    Product_ID: i,
    Product_Name: faker.commerce.productName(),
    Description: `${faker.company.catchPhrase()} with ${faker.company.bs()}.`,
    Category: faker.random.number(5)
  }
})

data.Location = [...Array(50)].map((v, i) => {
  return {
    Location_ID: i,
    Country_ID: faker.random.arrayElement(data.Country).Country_ID,
    Address_Line_1: faker.address.streetAddress(),
    Address_Line_2: Math.random() > 0.7 ? faker.address.secondaryAddress() : '',
    City: faker.address.city(),
    State: faker.address.stateAbbr(),
    District: '',
    Postal_code: faker.address.zipCode(),
    Location_type_code: faker.random.number(5),
    Description: faker.company.bs(),
    Shipping_notes: faker.company.catchPhrase()
  }
})

// every Person has 1 Location
data.Person_Location = data.Person.map(person => {
  return {
    Persons_Person_ID: person.Person_ID,
    Locations_Location_ID: faker.random.arrayElement(data.Location).Location_ID,
    Sub_Address: randomSeat(),
    Location_Usage: faker.company.bs(),
    Notes: faker.company.catchPhrase()
  }
})

data.Warehouse = [...Array(20)].map((v, i) => {
  return {
    Warehouse_ID: i,
    Location_ID: faker.random.arrayElement(data.Location).Location_ID,
    Warehouse_Name: faker.company.companyName()
  }
})

// every Warehouse & Product has 1 Inventory
data.Inventory = []
data.Warehouse.forEach((warehouse, wid) => {
  data.Product.forEach((product, pid) => {
    const Quantity_on_Hand = 10 + faker.random.number(100)
    data.Inventory.push({
      Inventory_ID: wid + pid,
      Product_ID: product.Product_ID,
      Warehouse_ID: warehouse.Warehouse_ID,
      Quantity_on_Hand,
      Quantity_Available: Quantity_on_Hand + faker.random.number(100)
    })
  })
})

data.Employment_Jobs = [...Array(50)].map((v, i) => {
  const Min_Salary = (faker.random.number(1000) * 10000) + 50000
  return {
    HR_Job_ID: i,
    Countries_Country_ID: faker.random.arrayElement(data.Country).Country_ID,
    Job_Title: faker.name.jobTitle(),
    Min_Salary,
    Max_Salary: Min_Salary + faker.random.number(1000) * 10000
  }
})

// each Employment_Jobs has at least 1 Employment
data.Employment = []
let Employee_ID = 0
data.Employment_Jobs.forEach((ej, ejid) => {
  [...Array(faker.random.number(10))].forEach(() => {
    Employee_ID++
    data.Employment.push({
      Employee_ID,
      Person_ID: faker.random.arrayElement(data.Person).Person_ID,
      HR_Job_ID: ej.HR_Job_ID,
      Manager_Employee_ID: Employee_ID === 1 ? '' : faker.random.arrayElement(data.Employment).Employee_ID,
      Start_Date: faker.date.past(),
      End_Date: Math.random() > 0.7 ? faker.date.past() : null,
      Salary: faker.random.number(ej.Min_Salary, ej.Max_Salary),
      Commision_Percent: faker.random.number(2, 20),
      Employmentcol: ''
    })
  })
})

data.Order = [...Array(100)].map((v, i) => {
  return {
    Order_ID: i,
    Customer_ID: faker.random.arrayElement(data.Customer).Customer_ID,
    Sales_Rep_ID: faker.random.arrayElement(data.Employment).Employee_ID,
    Order_Date: faker.date.past(),
    Order_Code: faker.random.number(10),
    Order_Status: faker.random.arrayElement(['OPEN', 'PENDING', 'SHIPPED']),
    Order_Total: faker.random.number(10000),
    Order_Currency: faker.random.arrayElement(data.Country).Currency_Code,
    Promotion_Code: Math.random() > 0.7 ? faker.company.bs() : ''
  }
})

// each Order has at least 1 order Order_Item
data.Order_Item = []
data.Order.forEach(order => {
  [...new Array(faker.random.number(100))].map((v, i) => {
    const Quantity = faker.random.number(50)
    data.Order_Items.push({
      Order_ID: order.Order_ID,
      Customer_ID: order.Customer_ID,
      Product_ID: faker.random.arrayElement(data.Product).Product_ID,
      Unit_Price: order.Order_Total / Quantity,
      Quantity
    })
  })
})

// each Person_Location has 1 Phone_Number
data.Phone_Number = data.Person_Location.map((pl, pli) => {
  return {
    Phone_Number_ID: pli,
    Persons_Person_ID: pl.Person_ID,
    Locations_Location_ID: pl.Locations_Location_ID,
    Country_code: faker.random.arrayElement(data.Country).Nat_Lang_Code,
    Phone_number: faker.random.number(89999999999) + 10000000000,
    Phone_Type_ID: faker.random.number(4)
  }
})

// each Employment has 1 Restricted_info
data.Restricted_info = data.Employment.map(emp => {
  return {
    Person_ID: emp.Person_ID,
    Date_of_Birth: faker.date.between(new Date(0), new Date(Date.now() - 5.676e+11)), // must be at least 18
    Date_of_Death: '', // no one is dead
    Government_ID: randomSSN.value().toFormattedString(),
    Passport_ID: randomPassport(),
    Hire_Date: faker.date.past(),
    Seniority_Code: faker.random.number(4)
  }
})

console.log(JSON.stringify(data, null, 2))
