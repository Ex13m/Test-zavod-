import { useRef, useState } from 'react'
import { useStore, saveImage } from '../store'
import { analyzeShop, normalizeDomain, SCAN_STAGES } from '../engine/shopAnalyzer'
import { analyzeShopAI } from '../engine/agent'
import { generatePost } from '../engine/generator'
import { analyzeScreenshot, buildStyleProfile } from '../engine/styleAnalyzer'
import { seedDemoIfNeeded } from '../engine/seed'
import Icon from './Icons'
import { Captain } from './Assistant'

const blobToDataUrl = (blob) =>
  new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result)
    r.onerror = rej
    r.readAsDataURL(blob)
  })

// Пайплайн завода: адрес сайта → профиль магазина → воркспейс с демо-контентом
export default function Onboarding() {
  const { setShowOnboarding, showToast } = useStore()
  const [step, setStep] = useState('welcome') // welcome | url | scan | profile | seeding | done
  const [url, setUrl] = useState('')
  const [scanIdx, setScanIdx] = useState(0)
  const [profile, setProfile] = useState(null)
  const [seedLog, setSeedLog] = useState([])
  const timers = useRef([])

  const finish = () => {
    useStore.setState({ onboarded: true, seeded: true, showOnboarding: false })
  }

  const skip = async () => {
    useStore.setState({ onboarded: true })
    setShowOnboarding(false)
    await seedDemoIfNeeded()
  }

  const startScan = () => {
    const target = url || 'https://www.bosset.cz/'
    const heuristic = analyzeShop(target)
    if (!heuristic) return showToast('Похоже, это не адрес сайта — проверьте ввод', '⚠')
    setStep('scan')
    setScanIdx(0)
    // ИИ-агент читает живой HTML сайта (на деплое с ключом); эвристика — страховка
    const aiPromise = analyzeShopAI(target).catch(() => null)
    SCAN_STAGES.forEach((_, i) => {
      timers.current.push(setTimeout(() => setScanIdx(i + 1), 700 * (i + 1)))
    })
    timers.current.push(setTimeout(async () => {
      const ai = await aiPromise
      const p = ai
        ? {
            ...heuristic,
            ...ai,
            domain: normalizeDomain(target) || heuristic.domain,
            url: heuristic.url,
            aiPowered: true,
            confidence: ai.confidence ?? 0.9,
          }
        : heuristic
      setProfile(p)
      setStep('profile')
    }, 700 * SCAN_STAGES.length + 400))
  }

  const log = (line) => setSeedLog((l) => [...l, line])

  const createWorkspace = async () => {
    setStep('seeding')
    setSeedLog([])
    const s = useStore.getState()
    try {
      log(`Создаём воркспейс «${profile.name}»…`)
      const shopId = s.addShop({
        name: profile.name,
        domain: profile.domain,
        siteUrl: profile.url,
        lang: profile.lang,
        brands: profile.brands,
        tags: profile.tags,
        audience: profile.audience,
        niche: profile.niche,
      })
      s.setActiveShop(shopId)

      log('Принимаем демо-приманку Keitech Easy Shiner 4"…')
      const lureRes = await fetch('/demo/keitech-easy-shiner-4.jpg')
      const lureData = await blobToDataUrl(await lureRes.blob())
      useStore.getState().addLure({ name: 'Keitech Easy Shiner 4"', type: 'soft', imgKey: await saveImage(lureData) })
      const lure = useStore.getState().lures[0]

      log('Импортируем эталонные посты магазина (6 скринов)…')
      const feats = []
      for (let i = 1; i <= 6; i++) {
        try {
          const r = await fetch(`/demo/shots/bosset-${i}.png`)
          if (!r.ok) continue
          const dataUrl = await blobToDataUrl(await r.blob())
          const features = await analyzeScreenshot(dataUrl)
          feats.push(features)
          useStore.getState().addShot({ imgKey: await saveImage(dataUrl), features })
        } catch { /* пропускаем битый скрин */ }
      }
      log(`Снимаем профиль стиля по ${feats.length} скринам…`)
      useStore.getState().setStyleProfile(buildStyleProfile(feats))

      log(`Выпускаем первые посты на языке магазина (${profile.lang.toUpperCase()})…`)
      const st = useStore.getState()
      for (const [fw, seed] of [['aida', 101], ['story', 202]]) {
        const post = generatePost({
          lure, framework: fw, tone: profile.tone || 'friendly', length: 'medium',
          lang: profile.lang, styleProfile: st.styleProfile, settings: st.settings, seed,
        })
        st.addPost({ ...post, lureId: lure.id, imgKey: await saveImage(lureData) })
      }

      log('Готово: воронка настроена, теги подобраны, стиль скопирован.')
      setStep('done')
    } catch (e) {
      log('Сбой демо-наполнения: ' + e.message)
      setStep('done')
    }
  }

  return (
    <div className="onb-overlay">
      <div className="onb-card panel">
        {step === 'welcome' && (
          <div className="onb-center">
            <Captain size={110} />
            <h2 className="onb-title">Добро пожаловать на Контент-Завод</h2>
            <p className="onb-text">
              Я — Капитан Окунь, ваш штурман. Пайплайн простой: <b>вводите адрес магазина</b> —
              завод сам разбирается, что вы продаёте, каким брендам, на каком языке, и настраивает
              воронку, теги и стиль. Дальше работаем внутри воркспейса этого сайта.
            </p>
            <div className="row" style={{ justifyContent: 'center' }}>
              <button className="btn primary" onClick={() => setStep('url')}>
                <Icon name="lens" size={16} /> Настроить по сайту
              </button>
              <button className="btn ghost" onClick={skip}>Пропустить — просто посмотреть</button>
            </div>
          </div>
        )}

        {step === 'url' && (
          <>
            <div className="panel-title"><Icon name="lens" size={14} className="icon-gold" /> Шаг 1 · Адрес магазина</div>
            <p className="onb-text">Вставьте адрес сайта — по нему завод построит профиль воркспейса.</p>
            <div className="field">
              <label>Сайт магазина</label>
              <input
                type="url" autoFocus value={url} placeholder="https://www.bosset.cz/"
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startScan()}
              />
              <div className="hint">
                Демо-пример: <a style={{ color: 'var(--acc)', cursor: 'pointer' }} onClick={() => setUrl('https://www.bosset.cz/')}>www.bosset.cz</a> — чешский рыболовный e-shop
              </div>
            </div>
            <div className="row">
              <button className="btn primary" onClick={startScan}><Icon name="lens" size={16} /> Проанализировать</button>
              <div className="spacer" />
              <button className="btn ghost sm" onClick={skip}>Пропустить</button>
            </div>
          </>
        )}

        {step === 'scan' && (
          <>
            <div className="panel-title"><Icon name="gear" size={14} className="icon-gold" /> Шаг 2 · Анализ магазина</div>
            <div className="onb-scan">
              {SCAN_STAGES.map((st, i) => (
                <div key={st.label} className={'onb-scan-row' + (scanIdx === i ? ' active' : '') + (scanIdx > i ? ' done' : '')}>
                  <span className="osr-icon"><Icon name={scanIdx > i ? 'check' : st.icon} size={17} /></span>
                  <span>{st.label}</span>
                  {scanIdx === i && <span className="osr-dots">…</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'profile' && profile && (
          <>
            <div className="panel-title"><Icon name="diamond" size={14} className="icon-gold" /> Шаг 3 · Профиль магазина</div>
            <div className="onb-profile">
              <div className="op-name">
                {profile.name} <span className="tag t-acc">{profile.domain}</span>{' '}
                <span className={'tag ' + (profile.aiPowered ? 't-acc' : 't-amber')}>
                  {profile.aiPowered ? '🤖 ИИ-анализ сайта' : 'эвристика'}
                </span>
              </div>
              <div className="op-row"><b>Ниша:</b> {profile.niche}</div>
              <div className="op-row"><b>Язык постов:</b> {profile.lang.toUpperCase()} · {profile.country}</div>
              <div className="op-row"><b>Аудитория:</b> {profile.audience}</div>
              <div className="op-row"><b>Бренды:</b> <span className="chips" style={{ display: 'inline-flex' }}>{profile.brands.map((b) => <span key={b} className="tag t-amber">{b}</span>)}</span></div>
              <div className="op-row"><b>Теги для постов:</b> <span className="chips" style={{ display: 'inline-flex' }}>{profile.tags.map((t) => <span key={t} className="tag t-acc">{t}</span>)}</span></div>
              <div className="op-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <b>Уверенность анализа:</b>
                <div className="st-bar" style={{ flex: 1 }}><div className="st-fill" style={{ width: `${Math.round(profile.confidence * 100)}%` }} /></div>
                <span className="tag">{Math.round(profile.confidence * 100)}%</span>
              </div>
            </div>
            <div className="row mt-16">
              <button className="btn primary" onClick={createWorkspace}>
                <Icon name="factory" size={16} /> Создать воркспейс + демо-контент
              </button>
              <button className="btn ghost" onClick={() => setStep('url')}>← Другой адрес</button>
            </div>
          </>
        )}

        {(step === 'seeding' || step === 'done') && (
          <>
            <div className="panel-title"><Icon name="factory" size={14} className="icon-gold" /> Шаг 4 · Первый запуск линии</div>
            <div className="onb-seedlog">
              {seedLog.map((l, i) => (
                <div key={i} className="onb-scan-row done"><span className="osr-icon"><Icon name="check" size={15} /></span>{l}</div>
              ))}
              {step === 'seeding' && <div className="onb-scan-row active"><span className="osr-icon"><Icon name="gear" size={15} /></span>Цеха работают<span className="osr-dots">…</span></div>}
            </div>
            {step === 'done' && (
              <div className="row mt-16">
                <button className="btn primary" onClick={finish}><Icon name="wave" size={16} /> В завод</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
