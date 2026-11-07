import { useEffect, useRef } from 'react'
import ribbonSrc from '@/assets/lanyard-tile.webp'
import foto from '@/assets/foto.webp'
import { data } from '@/mock'

const GRAVITY = 6500
const AIR_DRAG = 0.8
const CARD_MASS = 6
const ROPE_MASS = 6
const REST_STRETCH = 0.06
const MAX_STRETCH = 2.2
const SPRING_DAMP = 0.12
const CORD_DAMP = 0.55
const BEND = 0.02
const MAX_BEND = 0.45
const SPIN_DAMP = 0.025
const MAX_YAW = 12
const MAX_SPEED = 2500
const FOLLOW = 0.025
const SEGS = 24
const DT = 1 / 480

const RIBBON_W = 360
const CARD_W = 192
const ANCHOR_Y = -60
const GRAB_PX = 20

const STEP_MS = DT * 1000
const DRAG_K = Math.exp(-AIR_DRAG * DT)
const FOLLOW_K = 1 - Math.exp(-DT / FOLLOW)
const MAX_STEP = MAX_SPEED * DT
const ROPE_W = SEGS / ROPE_MASS
const CARD_W_INV = 2 / CARD_MASS

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const wrap  = (a) => Math.atan2(Math.sin(a), Math.cos(a))
const point = (x, y, w) => ({ x, y, px: x, py: y, rx: x, ry: y, w })
const YAW_K = 1 - Math.exp(-DT / 0.12)

function integrate(p) {
  if (p.w === 0) return
  let vx = (p.x - p.px) * DRAG_K
  let vy = (p.y - p.py) * DRAG_K
  const v = Math.hypot(vx, vy)
  if (v > MAX_STEP) { vx *= MAX_STEP / v; vy *= MAX_STEP / v }
  p.px = p.x; p.py = p.y
  p.x += vx
  p.y += vy + GRAVITY * DT * DT
}

// Elástico (XPBD): só puxa quando esticado — dobra livre como uma fita de verdade.
// `alpha` = complacência (0 = rígido). Acima de `max` vira um limite rígido.
function elastic(a, b, len, alpha, max) {
  const ws = a.w + b.w
  if (ws === 0) return
  const dx = b.x - a.x, dy = b.y - a.y
  const d = Math.hypot(dx, dy) || 0.0001
  if (d <= len) return
  let k = (d - len) / d / (ws + alpha / (DT * DT))
  const over = d - max
  if (over > 0) k = Math.max(k, over / d / ws)
  a.x += dx * k * a.w; a.y += dy * k * a.w
  b.x -= dx * k * b.w; b.y -= dy * k * b.w
}

function rod(a, b, len) {
  const ws = a.w + b.w
  if (ws === 0) return
  const dx = b.x - a.x, dy = b.y - a.y
  const d = Math.hypot(dx, dy) || 0.0001
  const k = (d - len) / d / ws
  a.x += dx * k * a.w; a.y += dy * k * a.w
  b.x -= dx * k * b.w; b.y -= dy * k * b.w
}

function dampAlong(a, b) {
  const ws = a.w + b.w
  if (ws === 0) return
  const dx = b.x - a.x, dy = b.y - a.y
  const d = Math.hypot(dx, dy) || 1
  const ux = dx / d, uy = dy / d
  const rv = ((b.x - b.px) - (a.x - a.px)) * ux + ((b.y - b.py) - (a.y - a.py)) * uy
  const j = rv * SPRING_DAMP / ws
  a.px -= ux * j * a.w; a.py -= uy * j * a.w
  b.px += ux * j * b.w; b.py += uy * j * b.w
}

const COS_MAX_BEND = Math.cos(MAX_BEND)
function bend(prev, top, body, cardLen) {
  const ws = prev.w + body.w
  if (ws === 0) return
  const a = Math.hypot(top.x - prev.x, top.y - prev.y)
  const straight = a + cardLen
  const minD = Math.sqrt(a * a + cardLen * cardLen + 2 * a * cardLen * COS_MAX_BEND)
  const dx = body.x - prev.x, dy = body.y - prev.y
  const d = Math.hypot(dx, dy) || 0.0001
  if (d >= straight) return
  const target = d < minD ? minD : d + (straight - d) * BEND
  const k = (target - d) / d / ws
  prev.x -= dx * k * prev.w; prev.y -= dy * k * prev.w
  body.x += dx * k * body.w; body.y += dy * k * body.w
}

function spinDamp(top, body) {
  const ax = body.x - top.x, ay = body.y - top.y
  const d = Math.hypot(ax, ay) || 1
  const nx = -ay / d, ny = ax / d
  const rv = ((body.x - body.px) - (top.x - top.px)) * nx + ((body.y - body.py) - (top.y - top.py)) * ny
  const ws = top.w + body.w
  if (ws === 0) return
  const j = rv * SPIN_DAMP / ws
  top.px  -= nx * j * top.w;  top.py  -= ny * j * top.w
  body.px += nx * j * body.w; body.py += ny * j * body.w
}

// Crachá pendurado numa fita elástica (Verlet + XPBD). Ocupa a seção pai (que deve ser `relative`).
// Tudo roda fora do React: o loop atualiza canvas e card direto no DOM, sem re-render.
export default function Lanyard() {
  const canvasRef = useRef(null)
  const cardRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const card   = cardRef.current
    const host   = canvas.parentElement
    const ctx    = canvas.getContext('2d')

    const ribbon = new Image()
    ribbon.src = ribbonSrc

    let w = 0, h = 0, anchorX = 0, cardLen = 0, alpha = 0, ropeLen = 0, cordK = 0
    let pts = []
    let rest = []
    let body = null
    let drag = null
    let yaw = 0, prevYaw = 0
    let raf = 0, last = 0, acc = 0

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = host.clientWidth
      h = host.clientHeight
      canvas.width  = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      anchorX = w * 0.78
      const restY = Math.min(h, window.innerHeight) * 0.38
      const hang  = restY - ANCHOR_Y
      cardLen = card.offsetHeight / 2

      const carried = Array.from({ length: SEGS }, (_, i) => CARD_MASS + (SEGS - 1 - i) / ROPE_W)
      const load = carried.reduce((s, c) => s + c, 0) * GRAVITY
      const k = load / (hang * REST_STRETCH)
      alpha = 1 / k
      rest = carried.map(c => hang / SEGS - c * GRAVITY / k)
      ropeLen = rest.reduce((s, l) => s + l, 0)
      const omega = Math.sqrt(GRAVITY / (hang * REST_STRETCH))
      cordK = Math.min(2 * CORD_DAMP * omega * DT, 0.5)

      pts = [point(anchorX, ANCHOR_Y, 0)]
      for (let i = 0; i < SEGS; i++) {
        const y = pts[i].y + rest[i] + carried[i] * GRAVITY / k
        pts.push(point(anchorX, y, ROPE_W))
      }
      pts[SEGS].w = CARD_W_INV
      body = point(anchorX, pts[SEGS].y + cardLen, CARD_W_INV)
      yaw = prevYaw = 0

      body.px -= 0.6
      pts[SEGS].px -= 0.3
    }

    const placeCard = () => {
      // Direção de um trecho longo da fita (o último pedacinho vibra e faria a foto tremer)
      const top = pts[SEGS], prev = pts[SEGS - 8]
      const ra = Math.atan2(top.y - prev.y, top.x - prev.x)
      drag.angle += wrap(ra - drag.angle) * (1 - Math.exp(-DT / 0.5))
      const cx = Math.cos(drag.angle) * cardLen, cy = Math.sin(drag.angle) * cardLen
      top.x  = drag.cx - cx * drag.a; top.y = drag.cy - cy * drag.a
      body.x = top.x + cx;            body.y = top.y + cy
    }

    const walls = (p, mx, top, bottom) => {
      const vx = p.x - p.px, vy = p.y - p.py
      if (p.x < mx)         { p.x = mx;         p.px = p.x + vx * 0.4 }
      if (p.x > w - mx)     { p.x = w - mx;     p.px = p.x + vx * 0.4 }
      if (p.y < top)        { p.y = top;        p.py = p.y + vy * 0.4 }
      if (p.y > h - bottom) { p.y = h - bottom; p.py = p.y + vy * 0.4 }
    }

    const step = () => {
      const top = pts[SEGS]
      for (const p of pts) { p.rx = p.x; p.ry = p.y }
      body.rx = body.x; body.ry = body.y
      prevYaw = yaw

      for (const p of pts) integrate(p)
      integrate(body)

      if (drag) {
        drag.cx += (drag.gx - drag.cx) * FOLLOW_K
        drag.cy += (drag.gy - drag.cy) * FOLLOW_K
        if (drag.kind === 'rope') {
          const p = pts[drag.i]
          p.px = p.x; p.py = p.y
          p.x = drag.cx; p.y = drag.cy
        } else {
          top.px = top.x; top.py = top.y
          body.px = body.x; body.py = body.y
          placeCard()
        }
      }

      for (let i = 0; i < SEGS; i++) elastic(pts[i], pts[i + 1], rest[i], alpha, rest[i] * MAX_STRETCH)
      for (let i = SEGS - 1; i >= 0; i--) elastic(pts[i], pts[i + 1], rest[i], alpha, rest[i] * MAX_STRETCH)
      if (drag?.kind !== 'card') {
        rod(top, body, cardLen)
        bend(pts[SEGS - 1], top, body, cardLen)
        rod(top, body, cardLen)
        spinDamp(top, body)
      }
      for (let i = 0; i < SEGS; i++) dampAlong(pts[i], pts[i + 1])

      if (drag?.kind !== 'card') {
        let total = 0
        for (let i = 0; i < SEGS; i++) total += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y)
        if (total > ropeLen) {
          const prev = pts[SEGS - 1]
          const d = Math.hypot(top.x - prev.x, top.y - prev.y) || 1
          const ux = (top.x - prev.x) / d, uy = (top.y - prev.y) / d
          for (const p of [top, body]) {
            const vr = ((p.x - p.px) * ux + (p.y - p.py) * uy) * cordK
            p.px += ux * vr; p.py += uy * vr
          }
        }
      }

      if (drag?.kind !== 'card') {
        walls(top, CARD_W / 2, 0, 40)
        walls(body, CARD_W / 2, cardLen, cardLen)
      }

      const vx = (body.x - body.rx) / DT
      yaw += (clamp(vx * 0.006, -MAX_YAW, MAX_YAW) - yaw) * YAW_K
    }

    // `t` (0..1) = quanto já avançamos rumo ao próximo passo da física. Desenhar a posição
    // interpolada evita o tremor de quadros que recebem 3 passos e outros 4 (ex.: 144Hz).
    const X = new Float64Array(SEGS + 2), Y = new Float64Array(SEGS + 2)
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i <= SEGS; i++) {
        X[i] = pts[i].rx + (pts[i].x - pts[i].rx) * t
        Y[i] = pts[i].ry + (pts[i].y - pts[i].ry) * t
      }
      const bx = body.rx + (body.x - body.rx) * t
      const by = body.ry + (body.y - body.ry) * t

      const img = ribbon.complete && ribbon.naturalWidth ? ribbon : null
      let total = 0
      for (let i = 0; i < SEGS; i++) total += Math.hypot(X[i + 1] - X[i], Y[i + 1] - Y[i])
      const texPerPx = img ? img.naturalHeight / (total || 1) : 0
      let texY = 0

      for (let i = 0; i < SEGS; i++) {
        const dx = X[i + 1] - X[i], dy = Y[i + 1] - Y[i]
        const len = Math.hypot(dx, dy)
        if (len < 0.01) continue

        ctx.save()
        ctx.translate(X[i], Y[i])
        ctx.rotate(Math.atan2(dy, dx) - Math.PI / 2)
        if (img) {
          const slice = len * texPerPx
          ctx.drawImage(img, 0, texY, img.naturalWidth, Math.max(slice, 1), -RIBBON_W / 2, 0, RIBBON_W, len + 0.8)
          texY += slice
        } else {
          ctx.fillStyle = '#1c1c1c'
          ctx.fillRect(-17, 0, 34, len + 0.8)
        }
        ctx.restore()
      }

      const tx = X[SEGS], ty = Y[SEGS]
      const angle = Math.atan2(by - ty, bx - tx) - Math.PI / 2
      ctx.save()
      ctx.translate(tx, ty)
      ctx.rotate(angle)
      ctx.beginPath(); ctx.roundRect(-7, -12, 14, 18, 3)
      ctx.fillStyle = '#6a6a6a'; ctx.fill()
      ctx.beginPath(); ctx.roundRect(-5, -10, 6, 14, 2)
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill()
      ctx.beginPath(); ctx.roundRect(-4, -8, 8, 12, 2)
      ctx.fillStyle = '#111'; ctx.fill()
      ctx.restore()

      const yawNow = prevYaw + (yaw - prevYaw) * t
      card.style.transform =
        `translate3d(${tx - CARD_W / 2}px, ${ty}px, 0) rotate(${angle}rad) perspective(800px) rotateY(${yawNow}deg)`
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      acc += Math.min(now - (last || now), 100)
      last = now
      while (acc >= STEP_MS) { step(); acc -= STEP_MS }
      draw(acc / STEP_MS)
    }
    const start = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame) } }
    const stop  = () => { cancelAnimationFrame(raf); raf = 0 }

    const toLocal = (e) => {
      const r = host.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const ropeAt = (x, y) => {
      let best = -1, bestD = GRAB_PX
      for (let i = 1; i < SEGS; i++) {
        const d = Math.hypot(pts[i].x - x, pts[i].y - y)
        if (d < bestD) { bestD = d; best = i }
      }
      return best
    }

    const setGoal = (x, y) => {
      const maxY = drag.kind === 'card' ? h - cardLen * (2 - drag.a) - 4 : h - 8
      let gx = clamp(x - drag.ox, 8, w - 8)
      let gy = clamp(y - drag.oy, 0, maxY)
      const dx = gx - anchorX, dy = gy - ANCHOR_Y
      const d = Math.hypot(dx, dy)
      if (d > drag.reach) { gx = anchorX + dx / d * drag.reach; gy = ANCHOR_Y + dy / d * drag.reach }
      drag.gx = gx; drag.gy = gy
    }

    const onDown = (e) => {
      if (e.button !== 0) return
      const { x, y } = toLocal(e)
      const top = pts[SEGS]
      const maxRope = ropeLen * MAX_STRETCH * 0.95

      if (card.contains(e.target)) {
        const ax = body.x - top.x, ay = body.y - top.y
        const a = clamp(((x - top.x) * ax + (y - top.y) * ay) / (cardLen * cardLen), 0, 2)
        const gx = top.x + ax * a, gy = top.y + ay * a
        drag = { kind: 'card', a, angle: Math.atan2(ay, ax), ox: x - gx, oy: y - gy, cx: gx, cy: gy, reach: maxRope + a * cardLen }
        top.w = body.w = 0
      } else {
        const i = ropeAt(x, y)
        if (i < 0) return
        const p = pts[i]
        p.w = 0
        drag = { kind: 'rope', i, ox: x - p.x, oy: y - p.y, cx: p.x, cy: p.y, reach: maxRope * i / SEGS }
      }

      e.preventDefault()
      host.setPointerCapture(e.pointerId)
      setGoal(x, y)
      host.style.cursor = card.style.cursor = 'grabbing'
    }

    const onMove = (e) => {
      const { x, y } = toLocal(e)
      if (drag) setGoal(x, y)
      else if (e.pointerType === 'mouse') host.style.cursor = ropeAt(x, y) >= 0 ? 'grab' : ''
    }

    const onUp = () => {
      if (!drag) return
      if (drag.kind === 'rope') pts[drag.i].w = ROPE_W
      else pts[SEGS].w = body.w = CARD_W_INV
      drag = null
      host.style.cursor = card.style.cursor = ''
    }

    host.addEventListener('pointerdown', onDown)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerup', onUp)
    host.addEventListener('pointercancel', onUp)

    let size = ''
    const ro = new ResizeObserver(() => {
      const next = `${host.clientWidth}x${host.clientHeight}`
      if (next === size) return
      size = next
      drag = null
      layout()
      draw(0)
    })
    ro.observe(host)
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(host)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointerdown', onDown)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerup', onUp)
      host.removeEventListener('pointercancel', onUp)
      host.style.cursor = ''
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] h-full w-full" />

      <div
        ref={cardRef}
        className="absolute left-0 top-0 z-10 origin-top cursor-grab touch-none select-none overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_rgba(0,0,0,0.5)] will-change-transform"
        style={{ width: CARD_W }}
      >
        <img
          src={foto}
          alt={data.name}
          draggable={false}
          width={CARD_W}
          height={220}
          className="block h-[220px] w-full object-cover object-top"
        />
        <div className="border-t border-border px-3 py-2.5">
          <p className="text-xs font-semibold text-foreground">{data.name}</p>
          <p className="mt-0.5 font-mono text-[9px] text-muted-foreground">{data.title}</p>
          <div className="mt-2.5 h-7 rounded opacity-40 bg-[repeating-linear-gradient(90deg,#333_0,#333_3px,transparent_3px,transparent_6px)]" />
        </div>
      </div>
    </>
  )
}
