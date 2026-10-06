import { useEffect, useState, type FormEvent } from 'react'
import { content, type Locale } from './content'

type SiteType = 'portfolio' | 'dashboard' | 'commerce'
type Feature = 'auth' | 'content' | 'analytics' | 'payments'
type ScopeResult = { modules: string[]; complexity: 'low' | 'medium' | 'high' }

const siteTypes: SiteType[] = ['portfolio', 'dashboard', 'commerce']
const featureOptions: Feature[] = ['auth', 'content', 'analytics', 'payments']
const repositoryUrl = import.meta.env.VITE_REPOSITORY_URL?.trim()
  || 'https://github.com/benyaminrahmantalab84-maker/tidal-signal-portfolio'

function initialLocale(): Locale {
  try {
    return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'fa'
  } catch {
    return 'fa'
  }
}

function App() {
  const [lang, setLang] = useState<Locale>(initialLocale)
  const [siteType, setSiteType] = useState<SiteType>('portfolio')
  const [features, setFeatures] = useState<Feature[]>([])
  const [result, setResult] = useState<ScopeResult | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [showBackTop, setShowBackTop] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const t = content[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
    document.title = t.pageTitle
    try { localStorage.setItem('portfolio-language', lang) } catch { /* storage may be unavailable */ }
  }, [lang, t.pageTitle])

  useEffect(() => {
    let frame = 0
    const updateScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0)
        setShowBackTop(window.scrollY > 600)
      })
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  function toggleFeature(feature: Feature) {
    setFeatures((current) => current.includes(feature)
      ? current.filter((item) => item !== feature)
      : [...current, feature])
    setResult(null)
    setStatus('idle')
  }

  async function submitScope(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setResult(null)
    try {
      const response = await fetch('/api/scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteType, features }),
      })
      if (!response.ok) throw new Error('API error')
      const data: ScopeResult = await response.json()
      if (!Array.isArray(data.modules) || !['low', 'medium', 'high'].includes(data.complexity)) {
        throw new Error('Invalid API response')
      }
      setResult(data)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">{t.skip}</a>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
      <div className="reading-progress" aria-hidden="true" style={{ transform: `scaleX(${scrollProgress})` }} />

      <header className="site-header" id="top">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label={t.brand}><span className="brand-mark">✳</span><span>{t.brand}</span></a>
          <nav className="main-nav" aria-label={lang === 'fa' ? 'ناوبری اصلی' : 'Main navigation'}>
            <a href="#work">{t.nav.work}</a>
            <a href="#skills">{t.nav.skills}</a>
            <a href="#demo">{t.nav.demo}</a>
            <a href="#contact">{t.nav.contact}</a>
          </nav>
          <button className="language-switch" type="button" onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')} aria-label={t.languageLabel}>
            <span className={lang === 'fa' ? 'active' : ''}>FA</span><span className="language-divider">/</span><span className={lang === 'en' ? 'active' : ''}>EN</span>
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" />{t.heroEyebrow}</div>
            <p className="sample-pill"><span className="signal-dot" />{t.sampleBadge}</p>
            <h1 id="hero-title">{t.heroTitleA}<br /><em>{t.heroTitleB}</em></h1>
            <p className="hero-description">{t.heroText}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#featured">{t.heroPrimary}<span aria-hidden="true">↗</span></a>
              <a className="button button-ghost" href="#demo">{t.heroSecondary}<span aria-hidden="true">↗</span></a>
            </div>
            <p className="hero-foot">{t.heroFoot}</p>
          </div>
          <div className="hero-visual" aria-label={t.visualTitle}>
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="visual-card">
              <div className="visual-card-top"><span className="window-dots"><i /><i /><i /></span><span>{t.visualTop}</span><span className="visual-live"><i />{t.visualStatus}</span></div>
              <div className="visual-card-body">
                <div className="visual-symbol">✳</div>
                <p className="visual-caption">{t.visualTitle}</p>
                <div className="visual-steps">
                  <div><span>01</span><b>{t.visualStep1}</b><i /></div>
                  <div><span>02</span><b>{t.visualStep2}</b><i /></div>
                  <div><span>03</span><b>{t.visualStep3}</b><i /></div>
                </div>
              </div>
              <div className="visual-card-bottom"><span className="code-dot" />{t.visualCode}<span className="terminal-cursor">_</span></div>
            </div>
            <span className="visual-glint glint-a">✦</span><span className="visual-glint glint-b">✧</span>
          </div>
          <div className="scroll-cue"><span />{t.scroll}</div>
        </section>

        <section className="section section-featured" id="featured" aria-labelledby="featured-title">
          <div className="shell">
            <div className="section-heading reveal">
              <div><p className="section-kicker">{t.featureKicker}</p><h2 id="featured-title">{t.featureTitle}</h2></div>
              <p>{t.featureText}</p>
            </div>
            <div className="feature-stage reveal">
              <img src="/images/tidal-signal-coast.jpg" alt={t.featureImageAlt} loading="lazy" width="1280" height="853" />
              <div className="feature-shade" aria-hidden="true" />
              <div className="feature-radar" aria-hidden="true"><span /><span /><i /></div>
              <div className="feature-stage-copy">
                <span className="feature-tag">{t.featureTag}</span>
                <h3 dir="ltr">{t.featureName}</h3>
                <a href="#work">{t.featureExplore}<span aria-hidden="true">↗</span></a>
              </div>
            </div>
            <div className="feature-under">
              <div className="feature-attribution"><p>{t.featureCaption}</p><a href="https://commons.wikimedia.org/wiki/File:Krakenes-lighthouse-waves-tunliweb.jpg" target="_blank" rel="noreferrer">{t.featureCredit} ↗</a><span aria-hidden="true"> · </span><a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">{t.featureLicense} ↗</a></div>
              <div>{t.featureChips.map((chip) => <span key={chip}>{chip}</span>)}</div>
            </div>
          </div>
        </section>

        <section className="section section-work" id="work" aria-labelledby="work-title">
          <div className="shell">
            <div className="section-heading reveal"><div><p className="section-kicker">{t.workKicker}</p><h2 id="work-title">{t.workTitle}</h2></div><p>{t.workIntro}</p></div>
            <div className="project-grid">
              {t.projects.map((project) => <article className={`project-card ${project.className} reveal`} key={project.number}>
                <div className="project-art" aria-hidden="true"><div className="art-halo" /><div className="art-frame"><span className="art-bar" /><span className="art-rail" /><span className="art-block one" /><span className="art-block two" /><span className="art-block three" /></div><span className="art-index">{project.number}</span></div>
                <div className="project-body"><div className="project-meta"><span>{project.category}</span><span className="concept-tag">{t.concept}</span></div><h3>{project.title}</h3><div className="project-detail"><span>{t.problem}</span><p>{project.problemText}</p></div><div className="project-detail"><span>{t.solution}</span><p>{project.solutionText}</p></div><p className="project-stack">{project.stack}</p></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="section section-skills" id="skills" aria-labelledby="skills-title">
          <div className="shell skills-layout"><div className="skills-intro reveal"><p className="section-kicker">{t.skillsKicker}</p><h2 id="skills-title">{t.skillsTitle}</h2><p>{t.skillsIntro}</p><div className="skills-decoration" aria-hidden="true"><span>R</span><span>/</span><span>N</span></div></div><div className="skills-list">{t.skillGroups.map((group, index) => <div className="skill-row reveal" key={group.title}><span className="skill-icon" aria-hidden="true">{group.icon}</span><div><h3>{group.title}</h3><p>{group.detail}</p></div><span className="skill-number">0{index + 1}</span></div>)}<p className="skill-note">{t.skillNote}</p></div></div>
        </section>

        <section className="section section-demo" id="demo" aria-labelledby="demo-title">
          <div className="shell"><div className="section-heading reveal"><div><p className="section-kicker">{t.demoKicker}</p><h2 id="demo-title">{t.demoTitle}</h2></div><p>{t.demoIntro}</p></div>
            <div className="demo-panel reveal"><div className="demo-form-side"><div className="demo-panel-heading"><span className="demo-mini-icon" aria-hidden="true">⌘</span><h3>{t.demoCardTitle}</h3></div><form onSubmit={submitScope}><fieldset><legend>{t.siteType}</legend><div className="type-options">{siteTypes.map((type) => <label className={`type-option ${siteType === type ? 'selected' : ''}`} key={type}><input type="radio" name="siteType" value={type} checked={siteType === type} onChange={() => { setSiteType(type); setResult(null); setStatus('idle') }} /><span>{t.siteTypes[type]}</span><span aria-hidden="true">↗</span></label>)}</div></fieldset><fieldset><legend>{t.featuresLabel}</legend><div className="feature-options">{featureOptions.map((feature) => <label className={`feature-option ${features.includes(feature) ? 'selected' : ''}`} key={feature}><input type="checkbox" checked={features.includes(feature)} onChange={() => toggleFeature(feature)} /><span className="checkbox-visual" aria-hidden="true">✓</span><span>{t.features[feature]}</span></label>)}</div></fieldset><button className="button button-primary submit-button" type="submit" disabled={status === 'loading'}>{status === 'loading' ? t.loading : t.submit}<span aria-hidden="true">↗</span></button></form></div><div className="demo-result-side"><div className="result-top"><span className="result-light" />{t.demoTech}</div><div className="result-content" aria-live="polite">{status === 'error' ? <p className="result-error" role="alert">{t.error}</p> : result ? <><div className="result-success-icon" aria-hidden="true">✳</div><h3>{t.resultTitle}</h3><div className="module-list">{result.modules.map((module) => <span key={module}>{t.moduleLabels[module] ?? module}</span>)}</div><div className="complexity-row"><span>{t.complexity}</span><strong>{t.levels[result.complexity]}</strong></div><p className="result-disclaimer">{t.resultNote}</p></> : <div className="empty-result"><div className="empty-orbit" aria-hidden="true">✳</div><p>{status === 'loading' ? t.loading : t.emptyResult}</p></div>}</div></div></div>
          </div>
        </section>

        <section className="section section-contact" id="contact" aria-labelledby="contact-title"><div className="shell contact-layout"><div className="reveal"><p className="section-kicker">{t.contactKicker}</p><h2 id="contact-title">{t.contactTitle}</h2><p>{t.contactText}</p></div><div className="contact-card reveal"><span className="contact-card-icon" aria-hidden="true">✳</span><p>{t.contactName}</p><p>{t.contactEmail}</p><p>{t.contactGithub}</p>{repositoryUrl && <a href={repositoryUrl} target="_blank" rel="noreferrer">{t.source} ↗</a>}</div></div></section>
      </main>
      {showBackTop && <button className="back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })} aria-label={t.backTop} title={t.backTop}><span aria-hidden="true">↑</span><small>{t.backTop}</small></button>}
      <footer className="site-footer"><div className="shell footer-inner"><span>{t.footer}</span><a href="#top">{t.backTop} ↑</a></div></footer>
    </>
  )
}

export default App
