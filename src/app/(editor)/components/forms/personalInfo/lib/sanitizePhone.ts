export function sanitizePhone(value: string) {
  let v = value.replace(/[^0-9+()\s]/g, "");

  const firstPlusIndex = v.indexOf("+");
  if (firstPlusIndex !== -1) {
    if (firstPlusIndex !== 0) v = v.replace(/\+/g, "");
    v =
      v.slice(0, firstPlusIndex + 1) +
      v.slice(firstPlusIndex + 1).replace(/\+/g, "");
  }

  const openIndex = v.indexOf("(");
  if (openIndex !== -1) {
    v = v.slice(0, openIndex + 1) + v.slice(openIndex + 1).replace(/\(/g, "");
  }
  const closeIndex = v.indexOf(")");
  if (closeIndex !== -1) {
    v = v.slice(0, closeIndex + 1) + v.slice(closeIndex + 1).replace(/\)/g, "");
  }

  const openPos = v.indexOf("(");
  const closePos = v.indexOf(")");
  if (closePos !== -1 && (openPos === -1 || closePos < openPos)) {
    v = v.replace(")", "");
  }

  return v;
}
