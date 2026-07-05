import { useEffect, useRef } from 'react'

// ============================================================
// Подводная сцена: процедурная рыба на «позвоночнике» из сегментов
// гонится за блуждающей приманкой; пузырьки, планктон, лучи света.
// ============================================================
export default function FishCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf, W, H
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = W * DPR
      canvas.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // --- приманка: блуждающая цель ---
    const lure = { x: 300, y: 300, vx: 0, vy: 0, tx: 500, ty: 400, retarget: 0 }

    // --- рыба: цепочка сегментов, голова тянется к приманке ---
    const SEGS = 22
    const fish = {
      spine: Array.from({ length: SEGS }, (_, i) => ({ x: 100 - i * 12, y: 400 })),
      vx: 0, vy: 0, phase: 0,
    }

    // --- пузырьки и планктон ---
    const bubbles = []
    const plankton = Array.from({ length: 40 }, () => ({
      x: Math.random() * 2000, y: Math.random() * 1200,
      r: Math.random() * 1.6 + 0.4, sp: Math.random() * 0.15 + 0.03,
      ph: Math.random() * Math.PI * 2,
    }))

    const spawnBubble = (x, y, big = false) => {
      if (bubbles.length > 70) return
      bubbles.push({
        x, y,
        r: big ? Math.random() * 4 + 2.5 : Math.random() * 2.2 + 0.8,
        vy: Math.random() * 0.5 + 0.35,
        wob: Math.random() * Math.PI * 2,
        life: 1,
      })
    }

    let t = 0
    const draw = () => {
      t += reduced ? 0.15 : 1
      ctx.clearRect(0, 0, W, H)

      // лучи света
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < 4; i++) {
        const bx = W * (0.15 + i * 0.24) + Math.sin(t * 0.003 + i * 2) * 60
        const grad = ctx.createLinearGradient(bx, 0, bx + 180, H)
        grad.addColorStop(0, `rgba(94, 234, 212, ${0.035 + Math.sin(t * 0.008 + i) * 0.015})`)
        grad.addColorStop(1, 'rgba(94, 234, 212, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(bx - 30, -10)
        ctx.lineTo(bx + 90, -10)
        ctx.lineTo(bx + 260, H + 10)
        ctx.lineTo(bx + 60, H + 10)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      // планктон
      ctx.fillStyle = 'rgba(148, 210, 220, 0.25)'
      for (const p of plankton) {
        p.ph += 0.01
        const px = (p.x + Math.sin(p.ph) * 8) % (W + 40)
        const py = (p.y - t * p.sp) % (H + 40)
        ctx.beginPath()
        ctx.arc(px < 0 ? px + W : px, py < 0 ? py + H : py, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // --- приманка блуждает ---
      lure.retarget -= 1
      if (lure.retarget <= 0) {
        lure.tx = 80 + Math.random() * (W - 160)
        lure.ty = 80 + Math.random() * (H - 160)
        lure.retarget = 140 + Math.random() * 200
      }
      lure.vx += (lure.tx - lure.x) * 0.0012
      lure.vy += (lure.ty - lure.y) * 0.0012
      lure.vx *= 0.97; lure.vy *= 0.97
      lure.x += lure.vx; lure.y += lure.vy
      const wob = Math.sin(t * 0.2) * 3

      // приманка: тело-воблер + тройник + блик
      ctx.save()
      ctx.translate(lure.x, lure.y + wob)
      ctx.rotate(Math.atan2(lure.vy, lure.vx) * 0.6 + Math.sin(t * 0.15) * 0.25)
      const lg = ctx.createLinearGradient(-12, 0, 12, 0)
      lg.addColorStop(0, '#fbbf24')
      lg.addColorStop(1, '#f97316')
      ctx.fillStyle = lg
      ctx.beginPath()
      ctx.ellipse(0, 0, 13, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.beginPath()
      ctx.arc(7, -1.5, 1.6, 0, Math.PI * 2)
      ctx.fill()
      // тройник
      ctx.strokeStyle = 'rgba(200, 220, 230, 0.7)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(-11, 2); ctx.lineTo(-15, 8); ctx.lineTo(-12, 9)
      ctx.moveTo(-15, 8); ctx.lineTo(-18, 9)
      ctx.stroke()
      // свечение
      ctx.globalCompositeOperation = 'lighter'
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 30)
      glow.addColorStop(0, 'rgba(251, 191, 36, 0.35)')
      glow.addColorStop(1, 'rgba(251, 191, 36, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(-32, -32, 64, 64)
      ctx.restore()

      // леска вверх от приманки
      ctx.strokeStyle = 'rgba(180, 220, 230, 0.12)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(lure.x, lure.y + wob - 4)
      ctx.quadraticCurveTo(lure.x + 40, (lure.y + wob) * 0.5, lure.x + 90, -20)
      ctx.stroke()

      // пузырьки от приманки
      if (t % 22 === 0) spawnBubble(lure.x - 10, lure.y + wob)

      // --- рыба преследует приманку (с отставанием) ---
      const head = fish.spine[0]
      const dx = lure.x - 55 - head.x
      const dy = lure.y + wob - head.y
      const dist = Math.hypot(dx, dy)
      const chase = dist > 90 ? 0.0022 : 0.0009 // близко — крадётся
      fish.vx += dx * chase
      fish.vy += dy * chase
      const sp = Math.hypot(fish.vx, fish.vy)
      const maxSp = 2.6
      if (sp > maxSp) { fish.vx = (fish.vx / sp) * maxSp; fish.vy = (fish.vy / sp) * maxSp }
      fish.vx *= 0.985; fish.vy *= 0.985
      fish.phase += 0.11 + sp * 0.05
      head.x += fish.vx
      head.y += fish.vy + Math.sin(fish.phase * 0.5) * 0.4

      // сегменты тянутся друг за другом (inverse kinematics)
      for (let i = 1; i < SEGS; i++) {
        const prev = fish.spine[i - 1]
        const seg = fish.spine[i]
        const ang = Math.atan2(seg.y - prev.y, seg.x - prev.x)
        const wave = Math.sin(fish.phase - i * 0.42) * (i / SEGS) * 3.2 * (0.5 + sp * 0.35)
        const len = 10 - i * 0.18
        seg.x = prev.x + Math.cos(ang) * len + Math.cos(ang + Math.PI / 2) * wave * 0.15
        seg.y = prev.y + Math.sin(ang) * len + Math.sin(ang + Math.PI / 2) * wave * 0.15
      }

      // тело рыбы: полигон по позвоночнику с переменной шириной
      const width = (i) => {
        const q = i / SEGS
        return 14 * Math.sin(Math.min(1, q * 2.4) * Math.PI * 0.5) * (1 - q * 0.82) + 1.2
      }
      ctx.save()
      const bodyGrad = ctx.createLinearGradient(head.x, head.y - 20, head.x, head.y + 20)
      bodyGrad.addColorStop(0, 'rgba(70, 130, 150, 0.5)')
      bodyGrad.addColorStop(0.5, 'rgba(45, 95, 115, 0.45)')
      bodyGrad.addColorStop(1, 'rgba(20, 50, 65, 0.5)')
      ctx.fillStyle = bodyGrad
      ctx.beginPath()
      for (let i = 0; i < SEGS; i++) {
        const s = fish.spine[i]
        const nx = i < SEGS - 1 ? fish.spine[i + 1] : s
        const a = Math.atan2(nx.y - s.y, nx.x - s.x) + Math.PI / 2
        const w = width(i)
        const px = s.x + Math.cos(a) * w
        const py = s.y + Math.sin(a) * w
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      for (let i = SEGS - 1; i >= 0; i--) {
        const s = fish.spine[i]
        const nx = i < SEGS - 1 ? fish.spine[i + 1] : s
        const a = Math.atan2(nx.y - s.y, nx.x - s.x) - Math.PI / 2
        const w = width(i)
        ctx.lineTo(s.x + Math.cos(a) * w, s.y + Math.sin(a) * w)
      }
      ctx.closePath()
      ctx.fill()

      // хвостовой плавник
      const tail = fish.spine[SEGS - 1]
      const pre = fish.spine[SEGS - 3]
      const ta = Math.atan2(tail.y - pre.y, tail.x - pre.x)
      const flap = Math.sin(fish.phase - SEGS * 0.42) * 0.5
      ctx.fillStyle = 'rgba(60, 120, 140, 0.35)'
      ctx.beginPath()
      ctx.moveTo(tail.x, tail.y)
      ctx.lineTo(tail.x + Math.cos(ta + 0.5 + flap) * 16, tail.y + Math.sin(ta + 0.5 + flap) * 16)
      ctx.lineTo(tail.x + Math.cos(ta + flap * 0.5) * 9, tail.y + Math.sin(ta + flap * 0.5) * 9)
      ctx.lineTo(tail.x + Math.cos(ta - 0.5 + flap) * 16, tail.y + Math.sin(ta - 0.5 + flap) * 16)
      ctx.closePath()
      ctx.fill()

      // спинной плавник
      const mid = fish.spine[6]
      const mid2 = fish.spine[8]
      const ma = Math.atan2(mid2.y - mid.y, mid2.x - mid.x)
      ctx.fillStyle = 'rgba(70, 135, 155, 0.3)'
      ctx.beginPath()
      ctx.moveTo(mid.x, mid.y)
      ctx.lineTo(mid.x + Math.cos(ma - Math.PI / 2) * 11, mid.y + Math.sin(ma - Math.PI / 2) * 11)
      ctx.lineTo(mid2.x, mid2.y)
      ctx.closePath()
      ctx.fill()

      // глаз
      const eyeSeg = fish.spine[1]
      ctx.fillStyle = 'rgba(230, 245, 250, 0.75)'
      ctx.beginPath()
      ctx.arc(eyeSeg.x + 2, eyeSeg.y - 3, 2.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(5, 15, 25, 0.95)'
      ctx.beginPath()
      ctx.arc(eyeSeg.x + 2.8, eyeSeg.y - 3, 1.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // пузыри изо рта рыбы при рывке
      if (sp > 1.6 && t % 14 === 0) spawnBubble(head.x + 6, head.y - 2, true)
      if (t % 90 === 0) spawnBubble(Math.random() * W, H + 10)

      // --- пузырьки ---
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i]
        b.y -= b.vy
        b.wob += 0.06
        b.x += Math.sin(b.wob) * 0.4
        b.life -= 0.003
        if (b.y < -20 || b.life <= 0) { bubbles.splice(i, 1); continue }
        ctx.strokeStyle = `rgba(160, 225, 235, ${0.35 * b.life})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = `rgba(200, 240, 250, ${0.18 * b.life})`
        ctx.beginPath()
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.35, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="fish-canvas" style={{ width: '100%', height: '100%' }} />
}
