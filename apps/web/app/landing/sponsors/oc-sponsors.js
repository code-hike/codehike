const parseCSV = require("./csv")
const path = require("path")

function getSponsors() {
  // https://opencollective.com/codehike/transactions?type=CREDIT
  const data = parseCSV(path.join(__dirname, "./codehike-transactions.csv"))

  const transactions = data.map((d) => ({
    date: d["date"],
    name: d["oppositeAccountSlug"],
    amount: parseInt(d["amount"]),
  }))

  const totals = {}
  transactions.forEach((t) => {
    totals[t.name] = (totals[t.name] || 0) + t.amount
  })

  const list = []
  for (let name in totals) {
    list.push({ name, amount: Math.round(totals[name]) })
  }

  return list
}

module.exports = getSponsors
