import LZString from "lz-string";

export function toHash(input) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(input));
}

export function fromHash(hash) {
  return JSON.parse(LZString.decompressFromEncodedURIComponent(hash));
}

export function writeHash(input) {
  const hash = toHash(input);
  window.location.hash = hash;
}

export function readHash() {
  const hash = document.location.hash.slice(1);
  if (!hash) {
    return null;
  }

  try {
    return fromHash(hash);
  } catch {
    return {};
  }
}
