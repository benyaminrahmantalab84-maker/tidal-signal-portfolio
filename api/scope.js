const siteTypes = new Set(['portfolio', 'dashboard', 'commerce'])
const allowedFeatures = new Set(['auth', 'content', 'analytics', 'payments'])

const baseModules = {
  portfolio: ['responsive-ui', 'project-showcase', 'contact-path'],
  dashboard: ['responsive-ui', 'data-views', 'role-workflows'],
  commerce: ['responsive-ui', 'product-catalog', 'checkout-flow'],
}

const featureModules = {
  auth: 'authentication',
  content: 'content-management',
  analytics: 'analytics-dashboard',
  payments: 'payment-integration',
}

export function calculateScope(input) {
  if (
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input) ||
    !siteTypes.has(input.siteType) ||
    !Array.isArray(input.features) ||
    input.features.length > 4 ||
    input.features.some((feature) => !allowedFeatures.has(feature)) ||
    new Set(input.features).size !== input.features.length
  ) {
    return null
  }

  const modules = [...baseModules[input.siteType], ...input.features.map((feature) => featureModules[feature])]
  const score = (input.siteType === 'commerce' ? 2 : input.siteType === 'dashboard' ? 1 : 0)
    + input.features.length
    + (input.features.includes('payments') ? 1 : 0)

  return {
    modules,
    complexity: score >= 5 ? 'high' : score >= 2 ? 'medium' : 'low',
    note: 'Educational estimate only; not a quote or delivery commitment.',
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.statusCode = 405
    res.end(JSON.stringify({ error: 'method_not_allowed' }))
    return
  }

  try {
    let body = req.body
    if (body === undefined) {
      let raw = ''
      for await (const chunk of req) {
        raw += chunk
        if (raw.length > 4096) {
          res.statusCode = 413
          res.end(JSON.stringify({ error: 'payload_too_large' }))
          return
        }
      }
      body = JSON.parse(raw)
    } else if (typeof body === 'string') {
      body = JSON.parse(body)
    }

    const result = calculateScope(body)
    if (!result) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'invalid_input' }))
      return
    }

    res.statusCode = 200
    res.end(JSON.stringify(result))
  } catch {
    res.statusCode = 400
    res.end(JSON.stringify({ error: 'invalid_json' }))
  }
}
