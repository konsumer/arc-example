// this will create mock for your database

const arc = require('@architect/functions')
const data = require('./data.json')

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
