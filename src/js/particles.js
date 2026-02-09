export function initParticles() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const config = {
    gridSize: 40,
    particleCount: 45,
    particleSpeedMin: 0.5,
    particleSpeedMax: 4,
    particleColors: ['#919191', '#00AEEF', '#919191'],
    trailLength: 80,
    backgroundColor: '#0B1A2B',
    rippleDuration: 2000,
    rippleMaxRadius: 200,
  };

  const occupiedLines = { horizontal: new Set(), vertical: new Set() };

  function hexToRGBA(hex, alpha = 1) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r
      ? `rgba(${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)},${alpha})`
      : hex;
  }

  function createGrid() {
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 120, 180, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 80, 140, 0)');
    ctx.strokeStyle = gradient;
    for (let y = 0; y < canvas.height; y += config.gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    for (let x = 0; x < canvas.width; x += config.gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
  }

  class Particle {
    constructor() {
      this.color = config.particleColors[Math.floor(Math.random() * config.particleColors.length)];
      this.speed = Math.random() * (config.particleSpeedMax - config.particleSpeedMin) + config.particleSpeedMin;
      this.trail = [];
      this.active = false;
      this.reset();
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > config.trailLength) this.trail.shift();
      if (this.active) {
        if (this.direction === 'horizontal') {
          this.x += this.speed;
          if (this.x > canvas.width) { this.active = false; occupiedLines.horizontal.delete(this.y); }
        } else {
          this.y += this.speed;
          if (this.y > canvas.height) { this.active = false; occupiedLines.vertical.delete(this.x); }
        }
      } else {
        const allOff = this.trail.every(p =>
          (this.direction === 'horizontal' && p.x > canvas.width) ||
          (this.direction === 'vertical' && p.y > canvas.height)
        );
        if (allOff) this.reset();
      }
    }
    draw() {
      for (let i = 0; i < this.trail.length; i++) {
        const p = this.trail[i];
        const alpha = i / this.trail.length;
        ctx.fillStyle = hexToRGBA(this.color, alpha);
        ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI * 2); ctx.fill();
      }
    }
    findLine() {
      for (let a = 0; a < 100; a++) {
        if (Math.random() > 0.5) {
          const y = Math.round(Math.random() * canvas.height / config.gridSize) * config.gridSize;
          if (!occupiedLines.horizontal.has(y)) {
            this.direction = 'horizontal'; this.x = 0; this.y = y;
            occupiedLines.horizontal.add(y); return true;
          }
        } else {
          const x = Math.round(Math.random() * canvas.width / config.gridSize) * config.gridSize;
          if (!occupiedLines.vertical.has(x)) {
            this.direction = 'vertical'; this.x = x; this.y = 0;
            occupiedLines.vertical.add(x); return true;
          }
        }
      }
      return false;
    }
    reset() {
      if (this.findLine()) {
        this.trail = []; this.active = true;
        this.speed = Math.random() * (config.particleSpeedMax - config.particleSpeedMin) + config.particleSpeedMin;
      } else {
        this.active = false; this.trail = [];
      }
    }
  }

  class Ripple {
    constructor(x, y) {
      this.x = x; this.y = y; this.radius = 0;
      this.maxRadius = config.rippleMaxRadius;
      this.startTime = Date.now();
    }
    update() { this.radius = ((Date.now() - this.startTime) / config.rippleDuration) * this.maxRadius; }
    draw() {
      const alpha = 1 - this.radius / this.maxRadius;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.stroke();
    }
    isComplete() { return this.radius >= this.maxRadius; }
  }

  const particles = Array.from({ length: config.particleCount }, () => new Particle());
  let ripples = [];
  let mouseX = -100, mouseY = -100;

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    ripples.push(new Ripple(e.clientX - rect.left, e.clientY - rect.top));
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function drawCursor() {
    const alpha = 0.3;
    ctx.fillStyle = `rgba(0, 200, 255, ${alpha})`;
    ctx.beginPath(); ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2); ctx.fill();
  }

  function animate() {
    createGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    ripples = ripples.filter(r => !r.isComplete());
    ripples.forEach(r => { r.update(); r.draw(); });
    drawCursor();
    requestAnimationFrame(animate);
  }
  animate();
}
