const editJsonFile = require("edit-json-file")

function changeVersion([argVersion]) {
  const version = argVersion || getShaVersion()

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

function getShaVersion() {
  const revision = require("child_process")
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim()
  return `0.0.0-${revision}`
}

module.exports = {
  changeVersion,
}
