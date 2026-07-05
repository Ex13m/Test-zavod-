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

      // --- настоящий окунь-охотник ---
      // профиль тела: округлое рыло → горбатая спина → хвостовой стебель
      const MAXW = 17
      const width = (i) => {
        const q = i / (SEGS - 1)
        if (q < 0.3) return MAXW * (0.3 + 0.7 * Math.sin((q / 0.3) * Math.PI * 0.5))
        const t = (q - 0.3) / 0.7
        return MAXW * (1 - 0.88 * Math.pow(t, 1.2))
      }
      // точки верхней/нижней кромки — пригодятся для плавников и полос
      const edge = (i, side) => {
        const s = fish.spine[i]
        const nx = i < SEGS - 1 ? fish.spine[i + 1] : fish.spine[i - 1]
        const dirSign = i < SEGS - 1 ? 1 : -1
        const a = Math.atan2((nx.y - s.y) * dirSign, (nx.x - s.x) * dirSign) + side * Math.PI / 2
        const w = width(i)
        return [s.x + Math.cos(a) * w, s.y + Math.sin(a) * w, a]
      }

      ctx.save()
      // хвостовой плавник: два лопасти-веера
      const tail = fish.spine[SEGS - 1]
      const pre = fish.spine[SEGS - 4]
      const ta = Math.atan2(tail.y - pre.y, tail.x - pre.x)
      const flap = Math.sin(fish.phase - SEGS * 0.42) * 0.45
      ctx.fillStyle = 'rgba(65, 130, 150, 0.5)'
      ctx.strokeStyle = 'rgba(140, 210, 220, 0.35)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(tail.x, tail.y)
      ctx.lineTo(tail.x + Math.cos(ta + 0.65 + flap) * 24, tail.y + Math.sin(ta + 0.65 + flap) * 24)
      ctx.quadraticCurveTo(
        tail.x + Math.cos(ta + flap) * 13, tail.y + Math.sin(ta + flap) * 13,
        tail.x + Math.cos(ta - 0.65 + flap) * 24, tail.y + Math.sin(ta - 0.65 + flap) * 24
      )
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // тело
      const bodyGrad = ctx.createLinearGradient(head.x, head.y - MAXW, head.x, head.y + MAXW)
      bodyGrad.addColorStop(0, 'rgba(95, 165, 180, 0.72)')
      bodyGrad.addColorStop(0.55, 'rgba(55, 115, 135, 0.66)')
      bodyGrad.addColorStop(1, 'rgba(200, 220, 225, 0.5)') // светлое брюхо
      ctx.fillStyle = bodyGrad
      ctx.beginPath()
      for (let i = 0; i < SEGS; i++) {
        const [px, py] = edge(i, 1)
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      for (let i = SEGS - 1; i >= 0; i--) {
        const [px, py] = edge(i, -1)
        ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()

      // колючий спинной плавник (веер из лучей, сегменты 5–10)
      ctx.fillStyle = 'rgba(60, 125, 145, 0.45)'
      ctx.strokeStyle = 'rgba(150, 215, 225, 0.3)'
      ctx.beginPath()
      let first = true
      for (let i = 5; i <= 10; i++) {
        const [ex, ey, ea] = edge(i, -1)
        const spike = 10 + Math.sin(fish.phase * 0.5 + i) * 1.5 - (i - 5) * 0.8
        if (first) { ctx.moveTo(ex, ey); first = false }
        ctx.lineTo(ex + Math.cos(ea) * spike, ey + Math.sin(ea) * spike)
        const [nx2, ny2] = i < 10 ? edge(i + 1, -1) : [ex, ey]
        ctx.lineTo(nx2, ny2)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // мягкий второй спинной + анальный плавники
      const softFin = (i0, i1, side, len) => {
        const [x0, y0] = edge(i0, side)
        const [x1, y1, a1] = edge(i1, side)
        ctx.fillStyle = 'rgba(60, 125, 145, 0.4)'
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.quadraticCurveTo(x1 + Math.cos(a1) * len, y1 + Math.sin(a1) * len, x1, y1)
        ctx.closePath()
        ctx.fill()
      }
      softFin(12, 15, -1, 8)   // второй спинной
      softFin(12, 15, 1, 9)    // анальный

      // грудной плавник у головы — гребёт
      const [gx, gy, ga] = edge(3, 1)
      const row = Math.sin(fish.phase * 0.9) * 0.5
      ctx.fillStyle = 'rgba(90, 160, 175, 0.55)'
      ctx.beginPath()
      ctx.moveTo(gx, gy - 2)
      ctx.quadraticCurveTo(
        gx + Math.cos(ga + 0.9 + row) * 15, gy + Math.sin(ga + 0.9 + row) * 15,
        gx + Math.cos(ga + 0.35 + row) * 11, gy + Math.sin(ga + 0.35 + row) * 11
      )
      ctx.closePath()
      ctx.fill()

      // вертикальные полосы окуня (сегменты 4–13)
      ctx.strokeStyle = 'rgba(15, 45, 60, 0.4)'
      ctx.lineCap = 'round'
      for (let i = 4; i <= 13; i += 3) {
        const [tx2, ty2] = edge(i, -1)
        const [bx2, by2] = edge(i, 1)
        ctx.lineWidth = 3.2
        ctx.beginPath()
        ctx.moveTo(tx2 * 0.15 + fish.spine[i].x * 0.85, ty2 * 0.15 + fish.spine[i].y * 0.85 - width(i) * 0.7)
        ctx.quadraticCurveTo(fish.spine[i].x, fish.spine[i].y, bx2 * 0.3 + fish.spine[i].x * 0.7, by2 * 0.3 + fish.spine[i].y * 0.7)
        ctx.stroke()
      }

      // жаберная крышка
      const [jx, jy] = edge(2, -1)
      const [jx2, jy2] = edge(2, 1)
      ctx.strokeStyle = 'rgba(170, 220, 230, 0.35)'
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(jx * 0.8 + fish.spine[2].x * 0.2, jy * 0.8 + fish.spine[2].y * 0.2)
      ctx.quadraticCurveTo(fish.spine[3].x, fish.spine[3].y, jx2 * 0.85 + fish.spine[2].x * 0.15, jy2 * 0.85 + fish.spine[2].y * 0.15)
      ctx.stroke()

      // рот — приоткрыт в погоне
      const headA = Math.atan2(fish.vy, fish.vx)
      ctx.strokeStyle = 'rgba(20, 50, 65, 0.7)'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(head.x + Math.cos(headA) * 6, head.y + Math.sin(headA) * 6)
      ctx.lineTo(head.x + Math.cos(headA + 0.5) * 1.5, head.y + Math.sin(headA + 0.5) * 1.5)
      ctx.stroke()

      // глаз: белок, янтарная радужка, зрачок
      const eyeSeg = fish.spine[1]
      const eyeX = eyeSeg.x + Math.cos(headA) * 1.5
      const eyeY = eyeSeg.y + Math.sin(headA) * 1.5 - 4
      ctx.fillStyle = 'rgba(235, 245, 248, 0.9)'
      ctx.beginPath(); ctx.arc(eyeX, eyeY, 3.4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(233, 165, 60, 0.85)'
      ctx.beginPath(); ctx.arc(eyeX + 0.6, eyeY, 2.2, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(8, 18, 28, 0.98)'
      ctx.beginPath(); ctx.arc(eyeX + 0.9, eyeY, 1.1, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.beginPath(); ctx.arc(eyeX - 0.4, eyeY - 1, 0.7, 0, Math.PI * 2); ctx.fill()
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
