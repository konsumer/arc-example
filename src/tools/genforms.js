// this generates forms for http/get-index from markdown table

const { getFunctions } = require('./utils')

const run = async () => {
  const functions = await getFunctions()
  console.log(functions.map(({ description, func, args }) => {
    if (!func) {
      return
    }
    return `
<form method="POST"><input type="hidden" name="call" value="${func}" />
  <h2>${func}</h2>
  <p>${description}</p>
  ${args.map(a => {
    const [name, val] = a.split('=')
    if (name === 'status') {
      return '<label for="status">status</label><select name="status"><option>OPEN</option><option>PENDING</option><option>CLOSED</option></select>'
    }
    if (name === 'start' || name === 'end') {
      return `<label for="${name}">${name}</label><input type="date" name="${name}" value="${val ? val.replace(/"/g, '') : ''}" />`
    }
    return `<label for="${name}">${name}</label><input type="text" name="${name}" value="${val ? val.replace(/"/g, '') : ''}" />`
  }).join('\n  ')}
  <button type="submit">RUN</button>
</form>
`
  }).join('\n'))
}

run()
