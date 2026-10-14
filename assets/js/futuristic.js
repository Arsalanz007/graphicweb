/* ==========================================================================
   NOCTURNEART // QUANTUM PRODUCTION LAB — FUTURISTIC INTERACTION SYSTEM
   ========================================================================== */

(function () {
  'use strict';

  // State Management
  const state = {
    audioEnabled: false,
    scanlines: false,
    matrixMode: false,
    currentChannel: 1,
    threeLoaded: false
  };

  /* --------------------------------------------------------------------------
     1. WEB AUDIO API SYNTHESIZER (Sci-Fi UI SFX)
     -------------------------------------------------------------------------- */
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSfx(type) {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.03);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'warp') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn('Audio SFX error', e);
    }
  }

  /* --------------------------------------------------------------------------
     2. AMBIENT THREE.JS QUANTUM PARTICLES & HOLOGRAPHIC TESSERACT
     -------------------------------------------------------------------------- */
  function initWebGLHologram() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - windowHalfX);
      mouseY = (e.clientY - windowHalfY);
    });

    if (window.THREE) {
      try {
        state.threeLoaded = true;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 3000);
        camera.position.z = 850;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 1. Quantum Particle Nexus
        const particleCount = 1400;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color1 = new THREE.Color(0x00f0ff); // Cyan
        const color2 = new THREE.Color(0xff2a5f); // Magenta
        const color3 = new THREE.Color(0xf5c542); // Gold

        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 2200;
          positions[i + 1] = (Math.random() - 0.5) * 2200;
          positions[i + 2] = (Math.random() - 0.5) * 2200;

          const rnd = Math.random();
          const c = rnd < 0.65 ? color1 : (rnd < 0.85 ? color2 : color3);
          colors[i] = c.r;
          colors[i + 1] = c.g;
          colors[i + 2] = c.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: 3.5,
          vertexColors: true,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // 2. Holographic Geometric Wireframe Tesseract
        const geoIcosahedron = new THREE.IcosahedronGeometry(260, 2);
        const wireMaterial = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          wireframe: true,
          transparent: true,
          opacity: 0.18
        });
        const hologramMesh = new THREE.Mesh(geoIcosahedron, wireMaterial);
        hologramMesh.position.set(400, 50, -200);
        scene.add(hologramMesh);

        // Resize handler
        window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Animation loop
        function animate() {
          requestAnimationFrame(animate);

          targetX = mouseX * 0.05;
          targetY = mouseY * 0.05;

          particles.rotation.y += 0.0008;
          particles.rotation.x += 0.0004;

          hologramMesh.rotation.x += 0.002;
          hologramMesh.rotation.y += 0.003;

          camera.position.x += (targetX - camera.position.x) * 0.03;
          camera.position.y += (-targetY - camera.position.y) * 0.03;
          camera.lookAt(scene.position);

          renderer.render(scene, camera);
        }
        animate();
        return;
      } catch (err) {
        console.warn('Three.js initialization fallback', err);
      }
    }

    // High-performance HTML5 Canvas Fallback if Three.js is not loaded
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const dots = [];
    for (let i = 0; i < 90; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.3 ? '#00f0ff' : '#ff2a5f'
      });
    }

    function render2dFallback() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0 || d.x > width) d.vx *= -1;
        if (d.y < 0 || d.y > height) d.vy *= -1;

        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const dist = Math.hypot(d.x - d2.x, d.y - d2.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(render2dFallback);
    }
    render2dFallback();
  }

  /* --------------------------------------------------------------------------
     3. CYBER-DECK CHANNEL SWITCHER (HIGH-RES ASSET SHOWCASE)
     -------------------------------------------------------------------------- */
  const deckChannels = {
    1: {
      type: 'image',
      src: 'assets/img/front1.jpeg',
      title: 'CH-01: SORCERESS OF THE STORM // LIGHTNING TRIDENT',
      res: 'MASTER LOOKDEV // 4K'
    },
    2: {
      type: 'image',
      src: 'assets/img/front2.jpeg',
      title: 'CH-02: COSMIC MAN OF TOMORROW // SUPERNOVA FLIGHT',
      res: 'SUPERHERO MASTER'
    },
    3: {
      type: 'image',
      src: 'assets/img/front3.jpeg',
      title: 'CH-03: SYNDICATE ENFORCER // NEO-CITY UNDERWORLD',
      res: 'CHARACTER DESIGN'
    },
    4: {
      type: 'image',
      src: 'assets/img/front4.jpeg',
      title: 'CH-04: SERAPH OF THE ASTRAL RING // CELESTIAL SANCTUM',
      res: 'MYSTIC CONCEPT'
    },
    5: {
      type: 'image',
      src: 'assets/img/front5.jpeg',
      title: 'CH-05: INFERNO KATANA DUELIST // TEMPLE FIRESTORM',
      res: 'ACTION LOOKDEV'
    },
    6: {
      type: 'image',
      src: 'assets/img/front6.jpeg',
      title: 'CH-06: DRAGON-WINGED HYBRID // HIGHLAND FORTRESS',
      res: 'FANTASY BERSERKER'
    }
  };

  function initDeckChannels() {
    const buttons = document.querySelectorAll('.deck-channel-btn');
    const screen = document.getElementById('deck-main-screen');
    const titleEl = document.getElementById('deck-title-text');
    const resEl = document.getElementById('deck-res-badge');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const ch = parseInt(btn.dataset.channel, 10);
        if (ch === state.currentChannel || !deckChannels[ch]) return;

        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.currentChannel = ch;

        const data = deckChannels[ch];
        if (titleEl) titleEl.textContent = data.title;
        if (resEl) resEl.textContent = data.res;

        if (screen) {
          const img = screen.querySelector('img');
          if (img) {
            img.style.opacity = '0.2';
            img.style.transform = 'scale(0.98)';
            setTimeout(() => {
              img.src = data.src;
              img.alt = data.title;
              img.style.opacity = '1';
              img.style.transform = 'scale(1)';
            }, 120);
          } else {
            screen.innerHTML = `
              <img id="deck-display-img" src="${data.src}" alt="${data.title}" loading="eager">
              <div class="deck-hud-overlay" aria-hidden="true">
                <div class="deck-hud-top">
                  <span>ACTIVE ● 00:24:18:02</span>
                  <span id="deck-res-badge">${data.res}</span>
                </div>
                <div class="deck-hud-bottom">
                  <div class="wave-bars">
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                  </div>
                  <span class="mono" style="font-size:0.65rem; color:var(--cyan)">TRANSMISSION: STABLE</span>
                </div>
              </div>
            `;
          }
        }

        playSfx('warp');
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. INTERACTIVE BEFORE / AFTER VFX DUAL-SLIDER
     -------------------------------------------------------------------------- */
  function initComparisonSlider() {
    const box = document.getElementById('vfx-compare-box');
    const layerAfter = document.getElementById('vfx-compare-after');
    const handle = document.getElementById('vfx-compare-handle');
    if (!box || !layerAfter || !handle) return;

    let isDown = false;

    function move(e) {
      if (!isDown) return;
      const rect = box.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let pos = (clientX - rect.left) / rect.width;
      if (pos < 0.05) pos = 0.05;
      if (pos > 0.95) pos = 0.95;

      const pct = (pos * 100).toFixed(1) + '%';
      layerAfter.style.width = pct;
      handle.style.left = pct;
    }

    box.addEventListener('mousedown', (e) => {
      isDown = true;
      move(e);
      playSfx('click');
    });

    window.addEventListener('mouseup', () => { isDown = false; });
    window.addEventListener('mousemove', move);

    box.addEventListener('touchstart', (e) => {
      isDown = true;
      move(e);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDown = false; });
    window.addEventListener('touchmove', move, { passive: true });
  }

  /* --------------------------------------------------------------------------
     5. HOLOCORE QUOTE & TIMELINE CALCULATOR
     -------------------------------------------------------------------------- */
  function initQuoteCalculator() {
    const root = document.getElementById('holocore-calculator');
    if (!root) return;

    let selectedService = 'vfx';
    let duration = 30; // seconds or shots
    let speedTier = 'standard';
    const addons = new Set();

    const serviceBase = {
      anim: { base: 950, unitRate: 28, name: '3D/2D Animation & Motion' },
      vfx: { base: 1200, unitRate: 35, name: 'Quantum VFX & CG Compositing' },
      art: { base: 350, unitRate: 15, name: 'Digital Character Art & Ref Sheets' },
      suite: { base: 2600, unitRate: 45, name: 'Full-Scale Cyber Production Suite' }
    };

    const speedMultipliers = {
      standard: { mult: 1.0, days: 12, label: 'Standard Orbital (12 Days)' },
      priority: { mult: 1.35, days: 5, label: 'Warp Priority (5 Days)' },
      hyperdrive: { mult: 1.85, days: 2, label: 'Hyperdrive Warp (48 Hours)' }
    };

    const addonRates = {
      '8k': 300,
      'sound': 450,
      'sources': 350,
      'rights': 500
    };

    const priceDisplay = document.getElementById('calc-price-display');
    const timelineDisplay = document.getElementById('calc-timeline-display');
    const slider = document.getElementById('calc-scope-slider');
    const sliderVal = document.getElementById('calc-scope-val');
    const copyBriefBtn = document.getElementById('calc-copy-brief-btn');

    function calculate() {
      const s = serviceBase[selectedService];
      const sp = speedMultipliers[speedTier];

      let subtotal = s.base + (duration * s.unitRate);
      subtotal *= sp.mult;

      addons.forEach(key => {
        if (addonRates[key]) subtotal += addonRates[key];
      });

      const low = Math.round(subtotal * 0.95);
      const high = Math.round(subtotal * 1.15);

      if (priceDisplay) {
        priceDisplay.innerHTML = `$${low.toLocaleString()} <span>– $${high.toLocaleString()}</span>`;
      }
      if (timelineDisplay) {
        timelineDisplay.innerHTML = `Guaranteed Delivery: <b>${sp.label}</b>`;
      }
      updateEmailLink();
    }

    function updateEmailLink() {
      const emailBtns = document.querySelectorAll('#calc-email-brief-btn, .calc-email-link');
      if (!emailBtns.length) return;
      const s = serviceBase[selectedService];
      const sp = speedMultipliers[speedTier];
      const addonList = Array.from(addons).join(', ') || 'Standard Deliverables';
      const priceText = priceDisplay ? priceDisplay.innerText : '';

      const body = `=== NOCTURNEART // PROJECT TRANSMISSION BRIEF ===
Desk: ${s.name}
Scope / Runtime: ${duration} units
Timeline Tier: ${sp.label}
Selected Add-ons: ${addonList}
Estimated Scope Range: ${priceText}

Client Notes / Brief Details:
[Please add any references, deadlines, or specific requirements here]

Transmitted via NOCTURNE-OS Holocore Simulator.`;

      const mailtoUrl = `mailto:nexorasyndicateltd@gmail.com?subject=${encodeURIComponent('NocturneArt Project Transmission Brief - ' + s.name)}&body=${encodeURIComponent(body)}`;
      emailBtns.forEach(btn => {
        btn.href = mailtoUrl;
      });
    }

    // Service chips
    root.querySelectorAll('.calc-chip[data-service]').forEach(chip => {
      chip.addEventListener('click', () => {
        root.querySelectorAll('.calc-chip[data-service]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedService = chip.dataset.service;
        playSfx('click');
        calculate();
      });
    });

    // Speed chips
    root.querySelectorAll('.calc-chip[data-speed]').forEach(chip => {
      chip.addEventListener('click', () => {
        root.querySelectorAll('.calc-chip[data-speed]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        speedTier = chip.dataset.speed;
        playSfx('click');
        calculate();
      });
    });

    // Slider
    if (slider) {
      slider.addEventListener('input', (e) => {
        duration = parseInt(e.target.value, 10);
        if (sliderVal) sliderVal.textContent = duration + 's runtime / shots';
        calculate();
      });
    }

    // Checkboxes
    root.querySelectorAll('input[type="checkbox"][data-addon]').forEach(box => {
      box.addEventListener('change', (e) => {
        if (e.target.checked) addons.add(e.target.dataset.addon);
        else addons.delete(e.target.dataset.addon);
        playSfx('beep');
        calculate();
      });
    });

    // Copy Brief action
    if (copyBriefBtn) {
      copyBriefBtn.addEventListener('click', () => {
        const s = serviceBase[selectedService];
        const sp = speedMultipliers[speedTier];
        const addonList = Array.from(addons).join(', ') || 'Standard Deliverables';

        const brief = `=== NOCTURNEART // PROJECT TRANSMISSION BRIEF ===
Desk: ${s.name}
Scope / Runtime: ${duration} units
Timeline Tier: ${sp.label}
Selected Add-ons: ${addonList}
Estimated Scope Range: ${priceDisplay.innerText}
Generated via NOCTURNE-OS Holocore Simulator.`;

        navigator.clipboard.writeText(brief).then(() => {
          const originalText = copyBriefBtn.textContent;
          copyBriefBtn.textContent = '✓ BRIEF COPIED TO CLIPBOARD';
          copyBriefBtn.classList.add('btn--magenta');
          playSfx('warp');
          setTimeout(() => {
            copyBriefBtn.textContent = originalText;
            copyBriefBtn.classList.remove('btn--magenta');
          }, 3000);
        });
      });
    }

    calculate();
  }

  /* --------------------------------------------------------------------------
     6. ARTWORK GALLERY FILTER & HOLOGRAM LIGHTBOX INSPECTOR
     -------------------------------------------------------------------------- */
  function initGalleryAndLightbox() {
    const filterButtons = document.querySelectorAll('.gallery-filters .filter-btn');
    const cards = document.querySelectorAll('.artwork-card');
    const modal = document.getElementById('hologram-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!modal) return;

    const modalImg = document.getElementById('modal-preview-img');
    const modalTitle = document.getElementById('modal-title');
    const modalMeta = document.getElementById('modal-meta');
    const modalSpecRes = document.getElementById('spec-res');
    const modalSpecFps = document.getElementById('spec-fps');
    const modalSpecSoft = document.getElementById('spec-soft');
    const modalSpecColor = document.getElementById('spec-color');
    const modalDesc = document.getElementById('modal-desc');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        cards.forEach(card => {
          const cat = card.dataset.cat;
          const match = filter === 'all' || cat === filter;
          card.style.display = match ? 'flex' : 'none';
        });
        playSfx('click');
      });
    });

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.dataset.title || 'NocturneArt Production';
        const meta = card.dataset.meta || 'Cinematic Master';
        const src = card.dataset.img || card.querySelector('img')?.src;
        const res = card.dataset.res || '4K DCI (4096x2160)';
        const fps = card.dataset.fps || '24.000 fps Cine';
        const soft = card.dataset.soft || 'Foundry Nuke / Blender / Unreal';
        const color = card.dataset.color || 'ACEScg / Rec.709';
        const desc = card.dataset.desc || 'High-fidelity cinematic production rendered with precision timing, colour accuracy, and deliverable compliance.';

        if (modalImg) modalImg.src = src;
        if (modalTitle) modalTitle.textContent = title;
        if (modalMeta) modalMeta.textContent = meta;
        if (modalSpecRes) modalSpecRes.textContent = res;
        if (modalSpecFps) modalSpecFps.textContent = fps;
        if (modalSpecSoft) modalSpecSoft.textContent = soft;
        if (modalSpecColor) modalSpecColor.textContent = color;
        if (modalDesc) modalDesc.textContent = desc;

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        playSfx('warp');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        playSfx('click');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }


  /* --------------------------------------------------------------------------
     8. HUD TELEMETRY CONTROLS (Audio, Scanlines, Matrix)
     -------------------------------------------------------------------------- */
  function toggleAudio() {
    initAudio();
    state.audioEnabled = !state.audioEnabled;
    const btn = document.getElementById('telem-audio-toggle');
    if (btn) {
      btn.textContent = state.audioEnabled ? 'SOUND: ON' : 'SOUND: MUTED';
      btn.classList.toggle('active', state.audioEnabled);
    }
    playSfx('beep');
  }

  function toggleScanlines() {
    state.scanlines = !state.scanlines;
    document.body.classList.toggle('scanlines', state.scanlines);
    const btn = document.getElementById('telem-scan-toggle');
    if (btn) btn.classList.toggle('active', state.scanlines);
    playSfx('beep');
  }

  function toggleMatrix() {
    state.matrixMode = !state.matrixMode;
    document.body.classList.toggle('matrix-mode', state.matrixMode);
    const btn = document.getElementById('telem-matrix-toggle');
    if (btn) btn.classList.toggle('active', state.matrixMode);
    playSfx('beep');
  }

  function initHudControls() {
    const audioBtn = document.getElementById('telem-audio-toggle');
    const scanBtn = document.getElementById('telem-scan-toggle');
    const matrixBtn = document.getElementById('telem-matrix-toggle');

    if (audioBtn) audioBtn.addEventListener('click', toggleAudio);
    if (scanBtn) scanBtn.addEventListener('click', toggleScanlines);
    if (matrixBtn) matrixBtn.addEventListener('click', toggleMatrix);

    // Dynamic FPS & node latency generator
    const fpsEl = document.getElementById('telem-fps');
    if (fpsEl) {
      setInterval(() => {
        const fps = Math.floor(59 + Math.random() * 2);
        fpsEl.textContent = `${fps} FPS`;
      }, 1500);
    }
  }

  /* --------------------------------------------------------------------------
     9. MOBILE MENU
     -------------------------------------------------------------------------- */
  function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
      const isOpen = nav.style.display === 'flex';
      nav.style.display = isOpen ? 'none' : 'flex';
      burger.setAttribute('aria-expanded', !isOpen);
      playSfx('click');
    });
  }

  /* --------------------------------------------------------------------------
     INITIALIZATION
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initWebGLHologram();
    initDeckChannels();
    initComparisonSlider();
    initQuoteCalculator();
    initGalleryAndLightbox();
    initHudControls();
    initMobileMenu();

    // Universal button click sound
    document.querySelectorAll('.btn, .nav__link, .soft-chip').forEach(el => {
      el.addEventListener('mouseenter', () => playSfx('beep'));
      el.addEventListener('click', () => playSfx('click'));
    });
  });

})();
