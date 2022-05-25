const modules = import.meta.globEager("../../node_modules/shiki/themes/*.json");

const themes = {};
Object.keys(modules).forEach((path) => {
  const name = path.split("/").pop().replace(".json", "");
  if (name !== "css-variables") {
    themes[name] = modules[path].default;
  }
});

export function themeList() {
  return Object.keys(themes);
}

export function getTheme(name) {
  return themes[name];
}
