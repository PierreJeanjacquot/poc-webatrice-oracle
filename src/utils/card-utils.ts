export function simplifyName(name: string): string {
  const simpleName = name
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "AE")
    .replace(/ö/g, "o")
    .replace(/-/g, " ")
    .replace(/[^a-zA-Z0-9 .]+/g, "")
    .trim()
    .toLowerCase();
  return simpleName;
}
