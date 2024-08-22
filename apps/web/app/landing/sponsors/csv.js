const fs = require("fs")

function parseCSV(path) {
  const str = fs.readFileSync(path, "utf8")
  const arr = []
  let quote = false // 'true' means we're inside a quoted field

  // Iterate over each character, keep track of current row and column (of the returned array)
  for (let row = 0, col = 0, c = 0; c < str.length; c++) {
    let cc = str[c],
      nc = str[c + 1] // Current character, next character
    arr[row] = arr[row] || [] // Create a new row if necessary
    arr[row][col] = arr[row][col] || "" // Create a new column (start with empty string) if necessary

    // If the current character is a quotation mark, and we're inside a
    // quoted field, and the next character is also a quotation mark,
    // add a quotation mark to the current column and skip the next character
    if (cc == '"' && quote && nc == '"') {
      arr[row][col] += cc
      ++c
      continue
    }

    // If it's just one quotation mark, begin/end quoted field
    if (cc == '"') {
      quote = !quote
      continue
    }

    // If it's a comma and we're not in a quoted field, move on to the next column
    if (cc == "," && !quote) {
      ++col
      continue
    }

    // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
    // and move on to the next row and move to column 0 of that new row
    if (cc == "\r" && nc == "\n" && !quote) {
      ++row
      col = 0
      ++c
      continue
    }

    // If it's a newline (LF or CR) and we're not in a quoted field,
    // move on to the next row and move to column 0 of that new row
    if (cc == "\n" && !quote) {
      ++row
      col = 0
      continue
    }
    if (cc == "\r" && !quote) {
      ++row
      col = 0
      continue
    }

    // Otherwise, append the current character to the current column
    arr[row][col] += cc
  }

  const headers = arr.shift()

  return arr.map(row => {
    const obj = {}
    row.forEach((value, i) => {
      obj[headers[i]] = value
    })
    return obj
  })
}

module.exports = parseCSV
