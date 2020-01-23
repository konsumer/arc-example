// simple graphql schema
// you could also build the schema from lots of files using https://github.com/Urigo/merge-graphql-schemas
// I make some sort of complex resolvers, since I want to have nice model-hierarchy

const { makeExecutableSchema } = require('graphql-tools')
const { Api } = require('../api')

const api = new Api()

const typeDefs = `
type Employee {
  id: String!
  name: String!
  startDate: Date
  endDate: Date
  job: Job!
  phoneNumber: Phone!
  email: Email!
  manager: Employee
  country: Country
  city: Location
  region: Region
  department: Department
  orderTotals(quarter: String): Float
}

type Quota {
  total: Float

}

type Region {
  id: String!
  name: String!
}

type Country {
  id: String!
  name: String!
}

type Location {
  id: String!
  name: String!
}

type Job {
  id: String!
  title: String!
}

type Department {
  id: String!
}

type Customer {
  id: String!
  accountRep: Employee!
}

type Order {
  id: String!
  customer: Customer!
  products: [Product]!
  total: Float!
}

type Product {
  id: String!
  name: String!
}

type Warehouse {
  id: String!
  region: Region!
}
`

const resolvers = {

}

exports.schema = makeExecutableSchema({ typeDefs, resolvers })
