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
            <span class="text-sm font-medium transition-colors" :class="activeSection === 'beranda' ? 'text-primary' : 'text-on-surface hover:text-primary'">Home</span>
            <div v-if="activeSection === 'beranda'" class="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </div>
          <div class="relative group cursor-pointer" @click="scrollTo('how-it-works')">
            <span class="text-sm font-medium transition-colors" :class="activeSection === 'how-it-works' ? 'text-primary' : 'text-on-surface hover:text-primary'">How It Works</span>
            <div v-if="activeSection === 'how-it-works'" class="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </div>
          <div class="relative group cursor-pointer" @click="scrollTo('fitur')">
            <span class="text-sm font-medium transition-colors" :class="activeSection === 'fitur' ? 'text-primary' : 'text-on-surface hover:text-primary'">Features</span>
            <div v-if="activeSection === 'fitur'" class="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </div>
        </div>

        <!-- Right CTA -->
        <router-link to="/dashboard">
          <BaseButton variant="primary" size="sm" class="!px-6 !py-2.5 shadow-none hover:shadow-btn">Mulai Sekarang</BaseButton>
        </router-link>
      </div>
    </nav>

    <!-- Hero Section: hero-wrapper full-width (relative + overflow-hidden + min-h-screen).
         Kanvas absolute = 100% LAYAR (bukan 1280px), sehingga objek 3D tidak kepotong. -->
    <section id="beranda" class="hero-wrapper min-h-screen flex items-center relative overflow-hidden scroll-mt-32 bg-frosty-mint-hero">
      
      <!-- 3D Network Background — absolute penuh selebar layar -->
      <Hero3DNetwork />

      <!-- UI Wrapper: relative + z-10 + pointer-events-none; max-w-7xl menjaga posisi teks tetap terpusat -->
      <div class="ui-wrapper relative z-10 pointer-events-none w-full px-6 pt-20 pb-10 max-w-7xl mx-auto">
        
        <!-- Left Content -->
        <div class="animate-fade-in">
          <h1 class="font-outfit font-extrabold text-5xl lg:text-[64px] text-[#0f3627] leading-[1.1] tracking-tight mb-6">
            Kelola Semua Uangmu<br/>
            dalam Satu Dashboard
          </h1>
          <p class="font-jakarta text-[#4a5f55] text-lg leading-relaxed mb-10 max-w-lg">
            Platform finansial terpadu untuk menghubungkan berbagai rekening bank, e-wallet, dan kas tunai secara real-time.
          </p>
          <div class="flex flex-wrap items-center gap-4 pointer-events-auto">
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

      </div>

      <!-- Seamless Bottom Feathering to White -->
      <div class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-0"></div>

    </section>

    <!-- SECTION: How It Works (Single Continuous Hourglass Gradient Layer Spanning from Beranda's Lower Third into How It Works) -->
    <section id="how-it-works" class="w-full bg-white relative scroll-mt-24 min-h-screen flex flex-col justify-center">
        
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
        <div class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-0"></div>

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

    <!-- SECTION: Fitur (3 Card Grid with Custom Color Scheme & Default Visuals) -->
    <section id="fitur" class="w-full bg-frosty-mint-bottom relative scroll-mt-24 min-h-screen flex items-center py-20 overflow-hidden">
      
      <!-- Seamless Top & Bottom Feathering to White -->
      <div class="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-0"></div>
      <div class="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-0"></div>

      <div class="max-w-7xl mx-auto px-6 w-full relative z-10">
        
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="font-outfit font-bold text-4xl lg:text-5xl text-[#064E3B] tracking-tight mb-4">
            Fitur Unggulan Satu Saldo
          </h2>
          <p class="font-jakarta text-[#64748B] text-lg max-w-2xl mx-auto">
            Semua kebutuhan keuangan harianmu, terpusat dalam satu dashboard yang bersih dan mudah.
          </p>
        </div>

        <!-- 3 Column Grid (responsive: 1 kolom mobile, 3 kolom desktop) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          <!-- Card 1: Multi-Dompet Terpadu (Pale Lime Green Pastel) -->
          <div class="feature-card bg-[#EAF7D5] border border-[#D4F0AE] rounded-[32px] p-7 shadow-[0_12px_36px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(0,0,0,0.08)] flex flex-col justify-between">
            <div>
              <!-- Default Card Image / Visual Illustration -->
              <div class="w-full h-48 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/90 p-4 mb-6 flex flex-col justify-center items-center shadow-inner relative overflow-hidden group">
                <div class="w-full space-y-2.5 max-w-[220px]">
                  <div class="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-2.5 flex items-center justify-between shadow-xs">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-lg bg-[#17C662] flex items-center justify-center text-white text-[10px] font-bold">B</div>
                      <span class="font-outfit text-xs font-bold text-[#143D1A]">Bank BCA</span>
                    </div>
                    <span class="font-outfit text-xs font-bold text-[#143D1A]">Rp 12.4M</span>
                  </div>
                  <div class="bg-[#FEFCE8] border border-[#FEF08A] rounded-xl p-2.5 flex items-center justify-between shadow-xs">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-lg bg-[#EAB308] flex items-center justify-center text-white text-[10px] font-bold">E</div>
                      <span class="font-outfit text-xs font-bold text-[#143D1A]">GoPay &amp; OVO</span>
                    </div>
                    <span class="font-outfit text-xs font-bold text-[#143D1A]">Rp 5.5M</span>
                  </div>
                  <div class="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 flex items-center justify-between shadow-xs">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-lg bg-[#64748B] flex items-center justify-center text-white text-[10px] font-bold">K</div>
                      <span class="font-outfit text-xs font-bold text-[#143D1A]">Kas Tunai</span>
                    </div>
                    <span class="font-outfit text-xs font-bold text-[#143D1A]">Rp 2.1M</span>
                  </div>
                </div>
              </div>

              <h3 class="font-outfit font-bold text-2xl text-[#143D1A] mb-3">
                Multi-Dompet Terpadu
              </h3>
              <p class="font-jakarta text-[#38593A] text-sm md:text-base leading-relaxed">
                Pantau saldo Bank, E-Wallet &amp; Kas Tunai dalam satu tempat. Transisi antar sumber dana tanpa berpindah aplikasi.
              </p>
            </div>
          </div>

          <!-- Card 2: Pembayaran Tagihan (Vibrant Solid Green) -->
          <div class="feature-card bg-[#17C662] border border-[#14B258] rounded-[32px] p-7 shadow-[0_12px_36px_rgba(23,198,98,0.22)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(23,198,98,0.32)] flex flex-col justify-between">
            <div>
              <!-- Default Card Image / Visual Illustration -->
              <div class="w-full h-48 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 p-4 mb-6 flex flex-col justify-center items-center relative overflow-hidden shadow-inner">
                <div class="w-full space-y-2.5 max-w-[220px]">
                  <div class="bg-white/20 border border-white/30 rounded-xl p-2.5 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-lg bg-white text-[#17C662] flex items-center justify-center text-[10px] font-bold">⚡</div>
                      <span class="font-outfit text-xs font-bold text-white">Listrik PLN</span>
                    </div>
                    <span class="bg-white/30 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Lunas</span>
                  </div>
                  <div class="bg-white/20 border border-white/30 rounded-xl p-2.5 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-lg bg-white text-[#17C662] flex items-center justify-center text-[10px] font-bold">🌐</div>
                      <span class="font-outfit text-xs font-bold text-white">Internet WiFi</span>
                    </div>
                    <span class="bg-[#F5FF6C] text-[#064E3B] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Jatuh Tempo</span>
                  </div>
                  <div class="bg-white/20 border border-white/30 rounded-xl p-2.5 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-lg bg-white text-[#17C662] flex items-center justify-center text-[10px] font-bold">🎬</div>
                      <span class="font-outfit text-xs font-bold text-white">Netflix &amp; Spotify</span>
                    </div>
                    <span class="bg-white/30 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Auto-Debit</span>
                  </div>
                </div>
              </div>

              <h3 class="font-outfit font-bold text-2xl text-white mb-3">
                Pembayaran Tagihan
              </h3>
              <p class="font-jakarta text-emerald-50 text-sm md:text-base leading-relaxed">
                Bayar tagihan bulanan langsung dari dashboard. Riwayat tersimpan otomatis, tak perlu aplikasi lain.
              </p>
            </div>
          </div>

          <!-- Card 3: Ringkasan Real-time (Bright Lime Green) -->
          <div class="feature-card bg-[#C3F53C] border border-[#ADE82E] rounded-[32px] p-7 shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(0,0,0,0.12)] flex flex-col justify-between">
            <div>
              <!-- Default Card Image / Visual Illustration -->
              <div class="w-full h-48 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/90 p-4 mb-6 flex flex-col justify-center items-center shadow-inner relative overflow-hidden">
                <div class="w-full max-w-[220px] bg-white rounded-xl p-3 border border-[#E2E8F0] shadow-xs">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-jakarta text-[11px] font-semibold text-[#64748B]">Total Kekayaan Bersih</span>
                    <span class="bg-[#DCFCE7] text-[#15803D] text-[10px] font-extrabold px-1.5 py-0.5 rounded">+14.2%</span>
                  </div>
                  <p class="font-outfit text-xl font-extrabold text-[#0F172A] tracking-tight">Rp 20.000.000</p>
                  
                  <!-- Mini Chart Visual Sparkline -->
                  <div class="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-end justify-between h-8 gap-1">
                    <div class="w-full bg-[#E2E8F0] rounded-t-sm h-3"></div>
                    <div class="w-full bg-[#E2E8F0] rounded-t-sm h-4"></div>
                    <div class="w-full bg-[#E2E8F0] rounded-t-sm h-3.5"></div>
                    <div class="w-full bg-[#C3F53C] rounded-t-sm h-6"></div>
                    <div class="w-full bg-[#17C662] rounded-t-sm h-8"></div>
                  </div>
                </div>
              </div>

              <h3 class="font-outfit font-bold text-2xl text-[#1B2B06] mb-3">
                Ringkasan Real-time
              </h3>
              <p class="font-jakarta text-[#3B5514] text-sm md:text-base leading-relaxed">
                Lihat total kekayaan bersih &amp; ringkasan arus kas dalam hitungan detik. Data selalu segar.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Hero3DNetwork from '@/components/app/Hero3DNetwork.vue'

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

  // Deteksi section aktif berdasarkan posisi scroll (andal untuk section 100vh)
  const offset = 140 // garis deteksi di bawah navbar
  const ids = ['beranda', 'how-it-works', 'fitur']
  let current = ids[0]

  ids.forEach((id) => {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= offset) {
      current = id
    }
  })

  // Kalau sudah mentok di bawah, paksa section terakhir aktif
  const last = document.getElementById('fitur')
  if (last && window.innerHeight + window.scrollY >= last.offsetTop + last.offsetHeight - 4) {
    current = 'fitur'
  }

  activeSection.value = current
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.bg-frosty-mint-hero {
  background-color: #ffffff;
  background-image: 
    radial-gradient(ellipse 55% 42% at 6% 38%, rgba(245, 255, 108, 0.38) 0%, rgba(254, 249, 195, 0.14) 45%, transparent 75%),
    radial-gradient(ellipse 55% 42% at 94% 38%, rgba(52, 211, 153, 0.34) 0%, rgba(167, 243, 208, 0.12) 45%, transparent 75%),
    radial-gradient(ellipse 85% 60% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.98) 60%, rgba(240, 253, 244, 0.25) 100%);
}

.bg-frosty-mint-bottom {
  background-color: #ffffff;
  background-image: 
    radial-gradient(ellipse 60% 45% at 5% 95%, rgba(245, 255, 108, 0.42) 0%, rgba(254, 249, 195, 0.16) 45%, transparent 75%),
    radial-gradient(ellipse 60% 45% at 95% 95%, rgba(52, 211, 153, 0.38) 0%, rgba(167, 243, 208, 0.14) 45%, transparent 75%),
    radial-gradient(ellipse 85% 55% at 50% 98%, #ffffff 0%, rgba(255, 255, 255, 0.98) 60%, rgba(240, 253, 244, 0.28) 100%);
}
</style>
