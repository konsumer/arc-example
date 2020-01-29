// this will create mock for your database

const arc = require('@architect/functions')
const data = require('./data.json')

// see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html
const N = 15

const run = async () => {
  const tables = await arc.tables()
  const { hroe } = tables
  console.log(await tables.reflect())
  try {
    await Promise.all(data.map(r => {
      const record = {}
      Object.keys(r).forEach(k => {
        if (r[k] && r[k] !== '') {
          record[k] = r[k]
        }
      })
      record['GSIBucket'] = Math.floor(Math.random() * N)
      return hroe.put(record)
    }))
    console.log(`put ${data.length} records.`)
  } catch (e) {
    console.error(e.message)
  }
}
run()
