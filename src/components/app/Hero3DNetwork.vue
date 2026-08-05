<template>
  <div ref="container" class="hero-3d-network absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
    <div ref="canvasHost" class="absolute inset-0"></div>

    <div id="label-center" class="label">Satu Saldo</div>
    <div id="label-top" class="label">E-Wallet</div>
    <div id="label-left" class="label">Tunai</div>
    <div id="label-right" class="label">Bank</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const container = ref(null)
const canvasHost = ref(null)

let scene, camera, renderer, controls
let labels = []
let flowParticles = []
let animationId = null
let resizeObserver = null
let disposables = []
let canvasTexture = null
let glowTexture = null

const cCenter = 0x4ade80
const cTop = 0xfacc15
const cLeft = 0x14532d
const cRight = 0x9de02b

// Zoom kamera dasar
const cameraZoomSize = 0
// Skala glow sprite relatif ke ukuran node
const GLOW_SCALE = 2.5

// Hitung pergeseran fokus kamera — geser ke kanan di layar lebar, netral di mobile
function computeShift(width) {
  const shiftX = window.innerWidth > 768 ? -8 : 0
  const shiftZ = window.innerWidth > 768 ? 8 : 0
  const shiftY = window.innerWidth > 768 ? 0 : 0
  return { shiftX, shiftZ, shiftY }
}

function createGradientTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 512, 512)
  gradient.addColorStop(0, '#50C878')
  gradient.addColorStop(1, '#FACC15')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)
  const tex = new THREE.CanvasTexture(canvas)
  disposables.push(tex)
  return tex
}

// Tekstur glow radial (pengganti bloom — background tetap transparan)
function createGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.45)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(canvas)
  disposables.push(tex)
  return tex
}

// Hitung d agar SELURUH network (node + glow + label) masuk view, apa pun shift kamera.
// Berbasis proyeksi isometrik aktual, bukan tebakan.
function computeD(width, height) {
  const aspect = width / height
  const { shiftX, shiftZ, shiftY } = computeShift(width)

  // Posisi node network — sinkron dengan buildNetwork()
  const nodes = [
    { x: 0, z: 0, size: 3.5 },
    { x: -2, z: -8, size: 2.2 },
    { x: -8, z: 6, size: 2.2 },
    { x: 8, z: 6, size: 2.2 }
  ]

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  nodes.forEach(n => {
    // Vektor node relatif target kamera
    const vx = n.x - shiftX
    const vy = -shiftY
    const vz = n.z - shiftZ

    // Proyeksi isometrik (kamera di (20,20,20) melihat target)
    const sx = (vx - vz) / Math.SQRT2
    const sy = (vx + vz) / Math.sqrt(6) + vy * Math.sqrt(2 / 3)

    // Posisi label di atas node
    const labelY = n.size * 0.6 + 1.5
    const syLabel = (vx + vz) / Math.sqrt(6) + (labelY - shiftY) * Math.sqrt(2 / 3)

    // Radius glow + setengah diagonal kubus
    const glowR = (n.size * GLOW_SCALE) / 2
    const halfK = n.size * 0.707

    minX = Math.min(minX, sx - glowR - halfK)
    maxX = Math.max(maxX, sx + glowR + halfK)
    minY = Math.min(minY, sy - 0.5)
    maxY = Math.max(maxY, syLabel + 1)
  })

  const halfW = Math.max(Math.abs(minX), Math.abs(maxX))
  const halfH = Math.max(Math.abs(minY), Math.abs(maxY))

  let d = cameraZoomSize
  if (halfW / aspect > d) d = halfW / aspect
  if (halfH > d) d = halfH
  return d + 1.5 // margin aman
}

function init() {
  const el = container.value
  if (!el) return
  const width = el.clientWidth
  const height = el.clientHeight
  if (width === 0 || height === 0) return

  scene = new THREE.Scene()
  scene.background = null
  // Putar scene -25° agar tampilan lebih dinamis
  scene.rotation.y = -25 * (Math.PI / 180)

  const aspect = width / height
  const d = computeD(width, height)
  camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000)

  // Geser fokus kamera ke kanan agar tidak tumpang tindih dengan teks Hero
  const { shiftX, shiftZ, shiftY } = computeShift(width)
  camera.position.set(20 + shiftX, 20 + shiftY, 20 + shiftZ)
  camera.lookAt(shiftX, shiftY, shiftZ)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  canvasHost.value.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5)
  scene.add(ambientLight)
  disposables.push(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
  dirLight.position.set(10, 20, 10)
  scene.add(dirLight)
  disposables.push(dirLight)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(shiftX, shiftY, shiftZ)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enableRotate = true
  controls.enableZoom = false
  controls.enablePan = false
  // Batasi rotasi agar tidak terbalik / terlalu flat
  controls.minPolarAngle = 0.5
  controls.maxPolarAngle = 1.4
  controls.update()

  buildNetwork()
}

function createNode(x, z, size, glowColor, domId) {
  const group = new THREE.Group()

  const topGeo = new THREE.BoxGeometry(size, size * 0.4, size)
  const topMat = new THREE.MeshStandardMaterial({
    map: canvasTexture,
    roughness: 0.1,
    metalness: 0.1
  })
  const topMesh = new THREE.Mesh(topGeo, topMat)
  topMesh.position.y = size * 0.2 + 0.1
  group.add(topMesh)

  const botGeo = new THREE.BoxGeometry(size - 0.2, 0.2, size - 0.2)
  const botMat = new THREE.MeshBasicMaterial({ color: glowColor })
  const botMesh = new THREE.Mesh(botGeo, botMat)
  botMesh.position.y = 0
  group.add(botMesh)

  group.position.set(x, 0, z)
  scene.add(group)

  disposables.push(topGeo, topMat, botGeo, botMat)

  const glowMat = new THREE.SpriteMaterial({
    map: glowTexture,
    color: glowColor,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.5
  })
  const glowSprite = new THREE.Sprite(glowMat)
  glowSprite.scale.set(size * GLOW_SCALE, size * GLOW_SCALE, 1)
  glowSprite.position.set(x, -0.3, z)
  scene.add(glowSprite)
  disposables.push(glowMat)

  labels.push({
    element: container.value.querySelector(domId),
    pos: new THREE.Vector3(x, size * 0.6 + 1.5, z)
  })
}

function buildTube(path, color) {
  const tubeGeo = new THREE.TubeGeometry(path, 64, 0.12, 8, false)
  const tubeMat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.4,
    metalness: 0.2
  })
  const tube = new THREE.Mesh(tubeGeo, tubeMat)
  scene.add(tube)
  disposables.push(tubeGeo, tubeMat)
}

function addFlowParticles(path, color, count, speedOffset) {
  for (let i = 0; i < count; i++) {
    const particleGeo = new THREE.SphereGeometry(0.25, 16, 16)
    const particleMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.7
    })
    const particle = new THREE.Mesh(particleGeo, particleMat)

    const coreGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const core = new THREE.Mesh(coreGeo, coreMat)
    particle.add(core)

    scene.add(particle)
    disposables.push(particleGeo, particleMat, coreGeo, coreMat)

    flowParticles.push({
      mesh: particle,
      path: path,
      progress: i / count,
      speed: speedOffset + (Math.random() * 0.0005)
    })
  }
}

function buildNetwork() {
  createNode(0, 0, 3.5, cCenter, '#label-center')
  createNode(-2, -8, 2.2, cTop, '#label-top')
  createNode(-8, 6, 2.2, cLeft, '#label-left')
  createNode(8, 6, 2.2, cRight, '#label-right')

  const y = 0

  const p1 = new THREE.CurvePath()
  p1.add(new THREE.LineCurve3(new THREE.Vector3(0, y, 0), new THREE.Vector3(4.5, y, 0)))
  p1.add(new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(4.5, y, 0),
    new THREE.Vector3(6, y, 0),
    new THREE.Vector3(6, y, -1.5)
  ))
  p1.add(new THREE.LineCurve3(new THREE.Vector3(6, y, -1.5), new THREE.Vector3(6, y, -6.5)))
  p1.add(new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(6, y, -6.5),
    new THREE.Vector3(6, y, -8),
    new THREE.Vector3(4.5, y, -8)
  ))
  p1.add(new THREE.LineCurve3(new THREE.Vector3(4.5, y, -8), new THREE.Vector3(-2, y, -8)))
  buildTube(p1, cTop)
  addFlowParticles(p1, cTop, 4, 0.002)

  const p2 = new THREE.CurvePath()
  p2.add(new THREE.LineCurve3(new THREE.Vector3(0, y, 0), new THREE.Vector3(-6.5, y, 0)))
  p2.add(new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-6.5, y, 0),
    new THREE.Vector3(-8, y, 0),
    new THREE.Vector3(-8, y, 1.5)
  ))
  p2.add(new THREE.LineCurve3(new THREE.Vector3(-8, y, 1.5), new THREE.Vector3(-8, y, 6)))
  buildTube(p2, cLeft)
  addFlowParticles(p2, cLeft, 3, 0.0035)

  const p3 = new THREE.CurvePath()
  p3.add(new THREE.LineCurve3(new THREE.Vector3(0, y, 0), new THREE.Vector3(0, y, 4.5)))
  p3.add(new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, y, 4.5),
    new THREE.Vector3(0, y, 6),
    new THREE.Vector3(1.5, y, 6)
  ))
  p3.add(new THREE.LineCurve3(new THREE.Vector3(1.5, y, 6), new THREE.Vector3(8, y, 6)))
  buildTube(p3, cRight)
  addFlowParticles(p3, cRight, 3, 0.0035)
}

function updateLabels() {
  labels.forEach(label => {
    if (!label.element) return
    const vector = label.pos.clone()
    // Terapkan transformasi scene (rotasi -25°) supaya label tidak meleset
    vector.applyMatrix4(scene.matrixWorld)
    vector.project(camera)

    const el = container.value
    const rect = el.getBoundingClientRect()
    const x = (vector.x * 0.5 + 0.5) * rect.width
    const y = (vector.y * -0.5 + 0.5) * rect.height

    label.element.style.left = `${x}px`
    label.element.style.top = `${y}px`
  })
}

function onResize() {
  const el = container.value
  if (!el || !camera || !renderer) return
  const width = el.clientWidth
  const height = el.clientHeight
  if (width === 0 || height === 0) return

  const aspect = width / height
  const d = computeD(width, height)
  camera.left = -d * aspect
  camera.right = d * aspect
  camera.top = d
  camera.bottom = -d
  camera.updateProjectionMatrix()

  // Terapkan ulang pergeseran fokus saat resize
  const { shiftX, shiftZ, shiftY } = computeShift(width)
  camera.position.set(20 + shiftX, 20 + shiftY, 20 + shiftZ)
  camera.lookAt(shiftX, shiftY, shiftZ)
  if (controls) {
    controls.target.set(shiftX, shiftY, shiftZ)
    controls.update()
  }

  renderer.setSize(width, height)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  flowParticles.forEach(particle => {
    particle.progress -= particle.speed
    if (particle.progress <= 0) {
      particle.progress = 1
    }
    const point = particle.path.getPointAt(particle.progress)
    particle.mesh.position.copy(point)
  })

  controls.update()
  updateLabels()
  renderer.render(scene, camera)
}

onMounted(() => {
  requestAnimationFrame(() => {
    canvasTexture = createGradientTexture()
    glowTexture = createGlowTexture()
    init()
    animate()
  })

  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)

  window.removeEventListener('resize', onResize)

  disposables.forEach(d => {
    if (d && d.dispose) d.dispose()
  })
  disposables = []

  if (scene) {
    scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose())
        } else {
          obj.material.dispose()
        }
      }
    })
  }

  if (renderer) {
    renderer.dispose()
    const domEl = renderer.domElement
    if (domEl && domEl.parentNode) {
      domEl.parentNode.removeChild(domEl)
    }
  }

  labels = []
  flowParticles = []
})
</script>

<style scoped>
.hero-3d-network {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.label {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  color: #1e293b;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: opacity 0.2s;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.label::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

#label-center::before { background-color: #4ade80; }
#label-top::before { background-color: #facc15; }
#label-left::before { background-color: #14532d; }
#label-right::before { background-color: #9de02b; }
</style>
