export function withTimeout<T>(p: Promise<T>, ms = 4000, label = 'op'): Promise<T> {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error(`TIMEOUT:${label}:${ms}`)), ms)
    p.then(v => { clearTimeout(t); res(v); }).catch(e => { clearTimeout(t); rej(e); })
  })
}
