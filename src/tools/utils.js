const { readFile } = require('fs').promises

// parse the README for access-patterns
exports.getFunctions = async () => {
  const README = (await readFile(`${__dirname}/../../README.md`)).toString()
  const rTable = /\| Access Patterns.+\n[| -:]+\n| (.+) +\| `(.+)\((.+)\)` +\| `(.+)` +\|/g
  let m
  const out = []
  while ((m = rTable.exec(README)) !== null) {
    if (m.index === rTable.lastIndex) {
      rTable.lastIndex++
    }
    if (!m[2]) {
      continue
    }
    out.push({
      description: m[1].trim(),
      func: m[2].trim(),
      args: m[3] && m[3].split(',').map(s => s.trim().replace('*', '')),
      query: m[4] && m[4].split(',').map(s => s.trim())
    })
  }
  return out
}
