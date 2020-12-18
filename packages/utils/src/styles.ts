export interface Classes {
  [className: string]: string
}

type ClassName = string | string[]

export function classNamesWithPrefix(prefix: string) {
  return (className: ClassName, classes?: Classes) =>
    classNames(
      Array.isArray(className)
        ? className.map(cn => prefix + cn)
        : [prefix + className],
      classes
    )
}

export function classNames(
  className: ClassName, // TODO force array
  classes?: Classes
) {
  const classNames = Array.isArray(className)
    ? className
    : [className]
  if (isEmpty(classes)) {
    return classNames.join(" ")
  }
  const allClasses = classNames.slice()
  classNames.forEach(cn => {
    if (cn in classes!) {
      allClasses.push(classes![cn])
    }
  })
  return allClasses.join(" ")
}

function isEmpty(classes?: Classes) {
  if (!classes) return true
  for (const _ in classes) {
    return false
  }
  return true
}
