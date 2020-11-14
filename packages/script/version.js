const editJsonFile = require("edit-json-file")

function changeVersion([version]) {
  let file = editJsonFile(`./package.json`, {
    stringify_eol: true,
  })

  console.log(`Update ${file.get("version")} to ${version}`)
  file.set("version", version)

  changeDependencies(file, "dependencies", version)
  changeDependencies(file, "devDependencies", version)
  changeDependencies(file, "peerDependencies", version)

  file.save()
}

function changeDependencies(file, depType, version) {
  const deps = file.get(depType)
  if (!deps) return

  const names = Object.keys(deps).filter(
    name =>
      name.startsWith("@code-hike/") &&
      name !== "@code-hike/script"
  )

  names.forEach(name => {
    const path = `${depType}.${name}`
    console.log(
      `Update ${name} dep ${file.get(path)} to ${version}`
    )
    file.set(path, version)
  })
}

module.exports = {
  changeVersion,
}
