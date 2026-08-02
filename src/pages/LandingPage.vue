<template>
  <div class="min-h-screen bg-white font-jakarta overflow-x-hidden relative">
    
    <!-- Navbar -->
    <nav class="fixed w-full top-0 z-50 transition-all duration-300" :class="isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-[#17c662]/10 py-4' : 'bg-transparent py-6'">
      <div class="px-6 flex items-center justify-between max-w-7xl mx-auto">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <span class="font-outfit font-extrabold text-2xl text-on-surface tracking-tight">Logo</span>
        </div>

        <!-- Center Menus -->
        <div class="hidden md:flex items-center gap-8">
          <div class="relative group cursor-pointer" @click="scrollTo('beranda')">
            <span class="text-sm font-medium transition-colors" :class="activeSection === 'beranda' ? 'text-primary' : 'text-on-surface hover:text-primary'">Beranda</span>
            <div v-if="activeSection === 'beranda'" class="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </div>
          <div class="relative group cursor-pointer" @click="scrollTo('how-it-works')">
            <span class="text-sm font-medium transition-colors" :class="activeSection === 'how-it-works' ? 'text-primary' : 'text-on-surface hover:text-primary'">How It Works</span>
            <div v-if="activeSection === 'how-it-works'" class="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </div>
          <div class="relative group cursor-pointer" @click="scrollTo('fitur')">
            <span class="text-sm font-medium transition-colors" :class="activeSection === 'fitur' ? 'text-primary' : 'text-on-surface hover:text-primary'">Fitur</span>
            <div v-if="activeSection === 'fitur'" class="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </div>
        </div>

        <!-- Right CTA -->
        <router-link to="/dashboard">
          <BaseButton variant="primary" size="sm" class="!px-6 !py-2.5 shadow-none hover:shadow-btn">Mulai Sekarang</BaseButton>
        </router-link>
      </div>
    </nav>

    <!-- Hero Section (Beranda) - Locked 100vh Viewport -->
    <section id="beranda" class="min-h-screen flex items-center max-w-7xl mx-auto px-6 pt-20 pb-10 scroll-mt-32 relative z-10">
      
      <!-- Main Hero Content -->
      <div class="grid lg:grid-cols-2 gap-12 items-center w-full">
        
        <!-- Left Content -->
        <div class="animate-fade-in z-10 relative">
          <h1 class="font-outfit font-extrabold text-5xl lg:text-[64px] text-[#0f3627] leading-[1.1] tracking-tight mb-6">
            Kelola Semua Uangmu<br/>
            dalam Satu Dashboard
          </h1>
          <p class="font-jakarta text-[#4a5f55] text-lg leading-relaxed mb-10 max-w-lg">
            Platform finansial terpadu untuk menghubungkan berbagai rekening bank, e-wallet, dan kas tunai secara real-time.
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <router-link to="/dashboard">
              <button class="bg-[#17c662] hover:bg-[#15b358] text-white font-jakarta font-semibold rounded-full px-8 py-3.5 shadow-btn transition-all hover:-translate-y-0.5">
                Daftar Gratis
              </button>
            </router-link>
            <button class="bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200/60 text-[#0f3627] font-jakarta font-semibold rounded-full px-8 py-3.5 shadow-sm transition-all hover:-translate-y-0.5">
              Pelajari Fitur
            </button>
          </div>
        </div>

        <!-- Right Content (3D Placeholder) -->
        <div class="relative animate-slide-up h-[400px] lg:h-[480px] flex items-center justify-center w-full">
          <!-- Soft glowing background to mimic the light behind the 3D objects -->
          <div class="absolute inset-0 bg-[#17c662]/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <!-- Placeholder Box for 3D Animation -->
          <div class="w-full h-full max-w-md border-2 border-dashed border-[#17c662]/35 rounded-2xl flex flex-col items-center justify-center bg-white/40 backdrop-blur-md relative z-10 hover:bg-white/60 transition-colors duration-300 shadow-sm">
            <svg class="w-12 h-12 text-[#17c662]/60 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
            <p class="font-jakarta font-semibold text-[#0f3627] text-sm">Area Animasi 3D / Spline</p>
            <p class="font-jakarta text-xs text-[#4a5f55] mt-1.5 max-w-[220px] text-center leading-relaxed">Kosongkan sementara. Nanti embed model 3D atau gambar ilustrasinya di sini.</p>
          </div>
        </div>

      </div>

    </section>

    <!-- SECTION: How It Works (Single Continuous Hourglass Gradient Layer Spanning from Beranda's Lower Third into How It Works) -->
    <section id="how-it-works" class="w-full bg-white relative scroll-mt-24">
        
        <!-- ONE Single Continuous Hourglass Gradient SVG (Seamless transition, zero white gap, zero duplicate blob) -->
        <div class="absolute -top-44 md:-top-64 inset-x-0 bottom-0 z-0 pointer-events-none flex items-center justify-center overflow-visible">
            <svg class="w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <!-- Horizontal Tri-Color Gradient: Soft Mint (Edges) -> Warm Lemon Yellow (Flanks) -> Luminous White (Center) -->
                    <linearGradient id="hyperbolicGradHIW" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#34d399" stop-opacity="0.30" />
                        <stop offset="15%" stop-color="#6ee7b7" stop-opacity="0.34" />
                        <stop offset="30%" stop-color="#fef08a" stop-opacity="0.60" />
                        <stop offset="42%" stop-color="#fef9c3" stop-opacity="0.80" />
                        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.95" />
                        <stop offset="58%" stop-color="#fef9c3" stop-opacity="0.80" />
                        <stop offset="70%" stop-color="#fef08a" stop-opacity="0.60" />
                        <stop offset="85%" stop-color="#6ee7b7" stop-opacity="0.34" />
                        <stop offset="100%" stop-color="#34d399" stop-opacity="0.30" />
                    </linearGradient>

                    <!-- Center Radiant Luminous White & Yellow Radial Core -->
                    <radialGradient id="hyperbolicCoreHIW" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
                        <stop offset="35%" stop-color="#ffffff" stop-opacity="0.90" />
                        <stop offset="60%" stop-color="#fef9c3" stop-opacity="0.45" />
                        <stop offset="85%" stop-color="#a7f3d0" stop-opacity="0.20" />
                        <stop offset="100%" stop-color="#34d399" stop-opacity="0" />
                    </radialGradient>
                </defs>

                <!-- 1. Outer Primary Hourglass: Top wings reach seamlessly into Beranda (Y=-80), curving hyperbolically into center neck at headline (Y=380-420), flaring downward -->
                <path d="M -160 -80 C 80 120, 300 380, 500 380 C 700 380, 920 120, 1160 -80 V 950 C 920 780, 700 420, 500 420 C 300 420, 80 780, -160 950 Z" 
                      fill="url(#hyperbolicGradHIW)" 
                      style="filter: blur(28px);"></path>

                <!-- 2. Inner Secondary Hyperbolic Layer for Dense Volumetric Presence on Wings -->
                <path d="M -120 0 C 100 180, 310 385, 500 385 C 690 385, 900 180, 1120 0 V 850 C 900 700, 690 415, 500 415 C 310 415, 100 700, -120 850 Z" 
                      fill="url(#hyperbolicGradHIW)" 
                      fill-opacity="0.85" 
                      style="filter: blur(32px);"></path>

                <!-- 3. Epicenter Core Glow: Aligned behind Headline Text -->
                <ellipse cx="500" cy="400" rx="300" ry="40" fill="url(#hyperbolicCoreHIW)" style="filter: blur(25px);"></ellipse>
            </svg>
        </div>

        <!-- Subtle Bottom Blend for Section Transition -->
        <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-0"></div>

        <!-- 1. Headline Block (Shifted Upward with Compact Spacing) -->
        <div class="relative w-full pt-10 md:pt-16 pb-4 md:pb-6 flex flex-col items-center justify-center">
          
          <!-- Headline & Subheading Text (Directly aligned over the hyperbolic throat/neck) -->
          <div class="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
              <h2 class="font-outfit text-3xl md:text-5xl lg:text-[46px] text-[#0f172a] mb-4 leading-[1.22] font-extrabold tracking-tight">
                  Uang kamu ada di mana-mana, tapi <br class="hidden md:block" /> nggak ada yang tahu totalnya
              </h2>
              <p class="font-jakarta text-sm md:text-base text-[#475569] leading-relaxed max-w-2xl mx-auto">
                  SatuSaldo menyelesaikan tiga masalah paling umum dalam mengelola keuangan <br class="hidden sm:block" /> personal — satu per satu.
              </p>
          </div>
        </div>

        <!-- 2. Existing 3-Card Fan Component (Lifted Upward with Exact Same Relative Spacing to Subheading) -->
        <div class="relative z-20 pt-4 md:pt-6 pb-20 md:pb-24 flex justify-center max-w-7xl mx-auto px-6">
          <div class="relative h-[400px] md:h-[460px] w-full max-w-4xl mx-auto flex items-end justify-center overflow-visible">
            
            <!-- Left Card: Bank (Tilted Left) -->
            <div class="absolute left-1/2 bottom-0 w-[280px] md:w-[320px] h-[360px] md:h-[420px] rounded-[32px] p-7 shadow-2xl flex flex-col justify-between"
                 style="background: linear-gradient(135deg, #c3f53c 0%, #9bc916 100%); transform: translateX(-110%) rotate(-12deg); transform-origin: bottom center; z-index: 1;">
              <div class="flex items-start justify-between">
                <span class="bg-white/30 backdrop-blur-sm border border-white/50 text-[#3f5207] px-3 py-1.5 rounded text-[11px] font-extrabold uppercase tracking-widest">Bank</span>
                <div class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                  <svg class="w-4 h-4 text-[#3f5207]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
              </div>
              <div class="text-left mt-auto">
                <p class="font-jakarta text-[#4a5f1a] text-xs font-semibold mb-1">Total Saldo Bank</p>
                <p class="font-outfit text-[#2c3d0c] text-[32px] font-extrabold tracking-tight">Rp 12.4M</p>
              </div>
            </div>

            <!-- Right Card: Cash (Tilted Right) -->
            <div class="absolute left-1/2 bottom-0 w-[280px] md:w-[320px] h-[360px] md:h-[420px] rounded-[32px] p-7 shadow-2xl flex flex-col justify-between"
                 style="background: linear-gradient(135deg, #2d452b 0%, #172b16 100%); transform: translateX(10%) rotate(12deg); transform-origin: bottom center; z-index: 1;">
              <div class="flex items-start justify-between">
                <span class="bg-white/10 backdrop-blur-sm border border-white/20 text-[#c3f53c] px-3 py-1.5 rounded text-[11px] font-extrabold uppercase tracking-widest">Cash</span>
                <div class="flex items-center -space-x-2">
                  <div class="w-5 h-5 rounded-full bg-[#f5a623]/80"></div>
                  <div class="w-5 h-5 rounded-full bg-[#d0021b]/80"></div>
                </div>
              </div>
              <div class="text-left mt-auto">
                <p class="font-jakarta text-[#a8b8a5] text-xs font-semibold mb-1">Pengeluaran Tunai</p>
                <p class="font-outfit text-[#c3f53c] text-[32px] font-extrabold tracking-tight">Rp 2.1M</p>
              </div>
            </div>

            <!-- Center Card: E-Wallet (Straight, Top) -->
            <div class="absolute left-1/2 bottom-0 w-[300px] md:w-[360px] h-[340px] md:h-[440px] bg-white rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.06)] p-8 flex flex-col z-10"
                 style="transform: translateX(-50%);">
              <div class="flex items-center justify-between mb-8">
                <span class="font-outfit text-[#17c662] text-lg font-bold">SatuSaldo</span>
                <span class="bg-[#e6faee] text-[#17c662] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">E-Wallet</span>
              </div>
              
              <div class="space-y-3">
                <!-- Row 1 -->
                <div class="bg-[#f8fafc] rounded-2xl p-3 flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full bg-[#3b82f6]"></div>
                    <div class="w-16 h-2 bg-[#e2e8f0] rounded-full ml-3"></div>
                  </div>
                  <span class="font-outfit text-[#1e293b] text-sm font-bold">Rp 3.5M</span>
                </div>
                <!-- Row 2 -->
                <div class="bg-[#f8fafc] rounded-2xl p-3 flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full bg-[#a855f7]"></div>
                    <div class="w-12 h-2 bg-[#e2e8f0] rounded-full ml-3"></div>
                  </div>
                  <span class="font-outfit text-[#1e293b] text-sm font-bold">Rp 1.2M</span>
                </div>
                <!-- Row 3 -->
                <div class="bg-[#f8fafc] rounded-2xl p-3 flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full bg-[#22c55e]"></div>
                    <div class="w-14 h-2 bg-[#e2e8f0] rounded-full ml-3"></div>
                  </div>
                  <span class="font-outfit text-[#1e293b] text-sm font-bold">Rp 800k</span>
                </div>
              </div>

              <div class="text-left mt-auto">
                <p class="font-jakarta text-[#94a3b8] text-xs font-semibold mb-0.5">Total E-Wallet</p>
                <p class="font-outfit text-[#475569] text-[40px] font-extrabold tracking-tight leading-none">Rp 5.5M</p>
              </div>
            </div>

          </div>
        </div>

    </section>

    <!-- SECTION: Fitur (Completely Empty for now) -->
    <section id="fitur" class="scroll-mt-24"></section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const activeSection = ref('beranda')
const isScrolled = ref(false)

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

let observer
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, { threshold: 0.3 })

  document.querySelectorAll('section[id]').forEach((section) => {
    observer.observe(section)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) {
    observer.disconnect()
  }
})
</script>
