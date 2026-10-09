const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const BLUE_SHADES = [
  "#3b82f6",
  "#93c5fd",
  "#bfdbfe",
  "#60a5fa",
  "#2563eb",
  "#1d4ed8"
];

class Particle {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.color = BLUE_SHADES[Math.floor(Math.random() * BLUE_SHADES.length)];
    this.size = Math.random() * 2 + 1;

    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.04 + 0.01;
    this.offsetRange = Math.random() * 3 + 1;
  }

  update() {
    this.angle += this.speed;
    const offsetX = Math.cos(this.angle) * this.offsetRange;
    const offsetY = Math.sin(this.angle) * this.offsetRange;

    this.x += (this.targetX + offsetX - this.x) * 0.05;
    this.y += (this.targetY + offsetY - this.y) * 0.05;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = [];
const PARTICLE_COUNT = 800;

function createHeartParticles() {
  particles.length = 0;
  const centerX = width / 2;
  const centerY = height / 2 - 30;
  const scale = Math.min(width, height) / 45;

  let count = 0;
  while (count < PARTICLE_COUNT) {
    // Ambil titik acak dalam kotak [-1.5, 1.5]
    const rx = (Math.random() - 0.5) * 3;
    const ry = (Math.random() - 0.5) * 3;

    // Persamaan area dalam hati: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
    const equation = Math.pow(rx * rx + ry * ry - 1, 3) - rx * rx * Math.pow(ry, 3);

    // Jika titik berada di dalam area hati
    if (equation <= 0) {
      const px = centerX + rx * 13 * scale;
      const py = centerY - ry * 13 * scale; // Dibalik sumbu Y agar tidak terbalik

      const p = new Particle(Math.random() * width, Math.random() * height);
      p.targetX = px;
      p.targetY = py;
      particles.push(p);
      count++;
    }
  }
}


createHeartParticles();

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  createHeartParticles();
});

function drawBottomGlow() {
  const centerX = width / 2;
  const centerY = height / 2 + 170;

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, 110, 20, 0, 0, Math.PI * 2);
  
  const gradient = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 110);
  gradient.addColorStop(0, 'rgba(96, 165, 250, 0.9)');
  gradient.addColorStop(0.5, 'rgba(37, 99, 235, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.shadowColor = '#60a5fa';
  ctx.shadowBlur = 25;
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  ctx.shadowBlur = 6;
  ctx.shadowColor = '#60a5fa';

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  drawBottomGlow();

  requestAnimationFrame(animate);
}

animate();
