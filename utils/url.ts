export function parseHashStringParameters(
  asPath: string
): Record<string, string | undefined> {
  const hashIndex = asPath.indexOf('#')

  if (hashIndex === -1) return {}

  const query = asPath.slice(hashIndex + 1)

  const params = query.split('&').reduce((params, item) => {
    const [key, value] = item.split('=')
    params[decodeURIComponent(key)] = decodeURIComponent(value)
    return params
  }, {} as Record<string, string>)

  console.log(params)

  return params
}
