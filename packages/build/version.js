const editJsonFile = require("edit-json-file")

function changeVersion(args) {
  console.log({ cwd: process.cwd(), args })

  let file = editJsonFile(`./package.json`)

  // // Set a couple of fields
  // file.set("planet", "Earth")
  // file.set("city\\.name", "anytown")
  // file.set("name.first", "Johnny")
  // file.set("name.last", "B.")
  // file.set("is_student", false)

  // // Output the content
  // console.log(file.get())
  // // { planet: 'Earth',
  // //   city.name: 'anytown',
  // //   name: { first: 'Johnny', last: 'B.' },
  // //   is_student: false }

  // // Save the data to the disk
  // file.save()

  console.log(file.get("version"))
}

module.exports = {
  changeVersion,
}
