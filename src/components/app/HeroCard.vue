<template>
  <div class="w-full relative group overflow-visible">
    <!-- 1. Efek Glow (bayangan bercahaya) di belakang card -->
    <div class="absolute -inset-0.5 bg-primary/20 blur-2xl opacity-40 group-hover:opacity-60 transition duration-700 rounded-2xl pointer-events-none" />

    <!-- 2. Warna Dasar Card Proporsional (min-h-[220px] sm:min-h-[240px], py-6 sm:py-7) -->
    <div class="relative overflow-visible rounded-2xl border border-primary/20 shadow-2xl h-full min-h-[220px] sm:min-h-[240px] bg-gradient-to-br from-primary via-primary-fixed to-primary/80 flex items-center px-8 sm:px-10 py-6 sm:py-7 z-10">
      
      <!-- 3. Efek pantulan cahaya (Radial Gradient putih) di sudut kanan atas -->
      <div class="absolute inset-0 z-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.4),_transparent_60%)] pointer-events-none" />

      <!-- Konten Kiri -->
      <div class="flex flex-col gap-2 z-20 max-w-sm sm:max-w-md">
        
        <!-- Teks Header + Tombol Eye Sensor di sampingnya -->
        <div class="flex items-center gap-2.5">
          <h2 class="text-white text-2xl sm:text-3xl font-semibold tracking-tight font-outfit">
            Active Balance
          </h2>

          <button 
            @click="walletStore.toggleBalance()" 
            class="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            title="Sembunyikan / Tampilkan Saldo"
          >
            <svg v-if="!walletStore.balanceHidden" class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>

        <!-- Teks Nominal Utama -->
        <h1 class="text-white text-3xl sm:text-5xl font-extrabold tracking-tight text-glow mt-1 font-outfit currency flex items-baseline gap-3 flex-wrap">
          <span>IDR</span>
          <span class="text-3xl sm:text-4xl font-extrabold">
            {{ walletStore.balanceHidden ? '*** ***' : formatAmount(walletStore.totalBalance) }}
          </span>
        </h1>
        
      </div>

      <!-- Gambar 3D Kanan (Transparan Tanpa Background Hitam & Statis) -->
      <div class="absolute -top-18 -right-6 sm:-top-24 sm:-right-8 lg:-top-28 lg:-right-10 w-[280px] sm:w-[380px] lg:w-[440px] pointer-events-none z-30 select-none">
        <img 
          :src="transparentIcon || rawIcon" 
          alt="3D Rocket" 
          class="w-full h-auto drop-shadow-2xl"
          style="filter: drop-shadow(-8px 20px 28px rgba(0,0,0,0.32));"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import rawIcon from '../../../Ref UI/icon3.png'

const walletStore = useWalletStore()
const transparentIcon = ref('')

onMounted(() => {
  const img = new Image()
  img.src = rawIcon
  img.onload = () => {
    try {
      const w = img.naturalWidth || img.width
      const h = img.naturalHeight || img.height
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      
      const imgData = ctx.getImageData(0, 0, w, h)
      const d = imgData.data
      
      // BFS Flood-fill background removal from borders
      const visited = new Uint8Array(w * h)
      const queue = []
      
      // Enqueue all border pixels that are dark
      for (let x = 0; x < w; x++) {
        queue.push((0 * w + x))
        queue.push(((h - 1) * w + x))
      }
      for (let y = 0; y < h; y++) {
        queue.push((y * w + 0))
        queue.push((y * w + (w - 1)))
      }
      
      let head = 0
      while (head < queue.length) {
        const idx = queue[head++]
        if (visited[idx]) continue
        visited[idx] = 1
        
        const px = idx * 4
        const r = d[px]
        const g = d[px + 1]
        const b = d[px + 2]
        const maxVal = Math.max(r, g, b)
        
        if (maxVal <= 45) {
          if (maxVal <= 18) {
            d[px + 3] = 0 // transparent
          } else {
            d[px + 3] = Math.round(((maxVal - 18) / (45 - 18)) * d[px + 3])
          }
          
          const curX = idx % w
          const curY = Math.floor(idx / w)
          
          if (curX > 0 && !visited[idx - 1]) queue.push(idx - 1)
          if (curX < w - 1 && !visited[idx + 1]) queue.push(idx + 1)
          if (curY > 0 && !visited[idx - w]) queue.push(idx - w)
          if (curY < h - 1 && !visited[idx + w]) queue.push(idx + w)
        }
      }
      
      ctx.putImageData(imgData, 0, 0)
      transparentIcon.value = canvas.toDataURL('image/png')
    } catch (err) {
      console.warn('Canvas transparency error', err)
    }
  }
})

function formatAmount(amount) {
  if (!amount && amount !== 0) return '0'
  return amount.toLocaleString('id-ID')
}
</script>

<style scoped>
/* Bayangan teks agar lebih menonjol */
.text-glow {
  text-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}
</style>
