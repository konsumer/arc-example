// this will create mock for your database

const arc = require('@architect/functions')
const data = require('./data.json')

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
      return hroe.put(record)
    }))
    console.log(`put ${data.length} records.`)
  } catch (e) {
    console.error(e.message)
  }
}
run()
