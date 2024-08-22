const fs = require("fs")
const path = require("path")

const getOpenCollectiveSponsors = require("./oc-sponsors.js")
const fetchGitHubSponsors = require("./gh-sponsors.js")

const ignore = ["outerbounds", "github-sponsors", "guest-fbd7c737"]
const replace = {
  speakeasybot: "speakeasy-api",
  ndimares: "speakeasy-api",
  hamelsmu: "outerbounds",
  "severin-ibarluzea": "seveibar",
  fbopensource: "facebook",
}
const others = [
  // from paypal
  { name: "matthiaszepper", amount: Math.round(94.3 + 108.71 + 47) },
  // missing from gh api
  { name: "github", amount: 20550 },
]

Promise.all([getOpenCollectiveSponsors(), fetchGitHubSponsors()]).then(
  ([ocSponsors, ghSponsors]) => {
    const all = [...ocSponsors, ...ghSponsors, ...others]
      .filter((s) => !ignore.includes(s.name))
      .map((s) => ({ name: replace[s.name] || s.name, amount: s.amount }))

    const sponsors = []
    all.forEach((s) => {
      const index = sponsors.findIndex((sp) => sp.name === s.name)
      if (index === -1) {
        sponsors.push(s)
      } else {
        sponsors[index].amount += s.amount
      }
    })

    sponsors.sort((a, b) => b.amount - a.amount)

    console.table(sponsors)
    fs.writeFileSync(
      path.join(__dirname, "../sponsors.json"),
      JSON.stringify(sponsors, null, 2),
    )
  },
)
