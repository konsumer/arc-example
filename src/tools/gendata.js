// this will generate fake data

const faker = require('faker')
const cc = require('@saadixl/countries')

const data = {}

data.Customer_Company = [...new Array(10)].map((v, i) => {
  return {
    Company_ID: i,
    Company_Name: faker.company.companyName(),
    Description: faker.company.catchPhrase(),
    Company_Credit_Limit: faker.random.number(100) * 10000,
    Credit_Limit_Currency: faker.finance.currencyCode()
  }
})

data.Person = [...new Array(100)].map((v, i) => {
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

data.Customer_Employee = [...new Array(20)].map((v, i) => {
  return {
    Customer_Employee_ID: i,
    Company_ID: faker.random.arrayElement(data.Customer_Company).Company_ID,
    Badge_Number: faker.random.alphaNumeric(20).toUpperCase(),
    Job_Title: faker.name.jobTitle(),
    Department: faker.name.jobArea(),
    Credit_Limit: faker.random.number(100) * 10000,
    Credit_Limit_Currency: faker.random.arrayElement(data.Country).Currency_Code
  }
})

data.Customer = [...new Array(50)].map((v, i) => {
  return {
    Customer_ID: i,
    Person_ID: faker.random.arrayElement(data.Person).Person_ID,
    Customer_Employee_ID: faker.random.arrayElement(data.Customer_Employee).Customer_Employee_ID,
    AccountMgr_ID: faker.random.arrayElement(data.Customer_Employee).Customer_Employee_ID,
    Income_level: faker.random.number(100) * 10000
  }
})

data.Product = [...new Array(200)].map((v, i) => {
  return {
    Product_ID: i,
    Product_Name: faker.commerce.productName(),
    Description: `${faker.company.catchPhrase()} with ${faker.company.bs()}.`,
    Category: faker.random.number(5)
  }
})

data.Location = [...new Array(50)].map((v, i) => {
  return {
    Location_ID: i,
    Country_ID: faker.random.arrayElement(data.Country).Country_ID,
    Address_Line_1: faker.address.streetAddress(),
    Address_Line_2: faker.address.secondaryAddress(),
    City: faker.address.city(),
    State: faker.address.stateAbbr(),
    // District VARCHAR(24)
    Postal_code: faker.address.zipCode(),
    Location_type_code: faker.random.number(5),
    Description: faker.lorem.paragraph(),
    Shipping_notes: faker.lorem.paragraph()
  }
})

// Table Person_Location {
//   Persons_Person_ID INT [pk]
//   Locations_Location_ID INT [pk]
//   Sub_Address VARCHAR(45)
//   Location_Usage VARCHAR(45)
//   Notes TINYTEXT
// }

// Table Warehouse {
//   Warehouse_ID INT [pk]
//   Location_ID INT
//   Warehouse_Name VARCHAR(45)
// }

// Table Inventory {
//   Inventory_ID INT [pk]
//   Product_ID INT
//   Warehouse_ID INT
//   Quantity_on_Hand INT
//   Quantity_Available INT
// }

// Table Orders {
//   Order_ID INT [pk]
//   Customer_ID INT
//   Sales_Rep_ID INT
//   Order_Date DATE
//   Order_Code INT
//   Order_Status VARCHAR(15)
//   Order_Total INT
//   Order_Currency VARCHAR(5)
//   Promotion_Code VARCHAR(45)
// }

// Table Order_Item {
//   Order_ID INT [pk]
//   Customer_ID INT
//   Product_ID INT
//   Unit_Price DECIMAL
//   Quantity DOUBLE
// }
//

// Table Employment_Jobs {
//   HR_Job_ID INT [pk]
//   Countries_Country_ID INT
//   Job_Title VARCHAR(45)
//   Min_Salary INT
//   Max_Salary INT
// }

//
// Table Employment {
//   Employee_ID INT [pk]
//   Person_ID INT
//   HR_Job_ID INT
//   Manager_Employee_ID INT
//   Start_Date DATE
//   End_Date DATE
//   Salary INT
//   Commision_Percent DECIMAL
//   Employmentcol VARCHAR
// }
//

//
// Table Phone_Number {
//   Phone_Number_ID INT [pk]
//   Persons_Person_ID INT
//   Locations_Location_ID INT
//   Country_code INT
//   Phone_number INT
//   Phone_Type_ID INT
// }
//
// Table Person {
//   Person_ID INT [pk]
//   First_name VARCHAR(20)
//   Last_name VARCHAR(20)
//   Middle_names VARCHAR(45)
//   Nickname VARCHAR(20)
//   Nat_Lang_Code INT
//   Culture_code INT
//   Gender VARCHAR(12)
// }
//
// Table Restricted_info {
//   Person_ID INT [pk]
//   Date_of_Birth DATE
//   Date_of_Death DATE
//   Government_ID VARCHAR(24)
//   Passport_ID VARCHAR(24)
//   Hire_Date DATE
//   Seniority_Code INT
// }
//

//

//

//

// console.log(JSON.stringify(data, null, 2))
console.log(faker.helpers.userCard())
