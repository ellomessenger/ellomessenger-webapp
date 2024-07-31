type Parts = (object | false | undefined)[];

export default function buildStyle(...parts: Parts) {
  return parts.filter(Boolean).reduce((a, v) => ({ ...a, ...v }), {});
}
