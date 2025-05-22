const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
let animationId;
let isPaused = false;

// Configuration - customizable settings

const config = {
    fontSize: 18,
    fontFamily: 'Courier New',
    characters: 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@$%^&*',
    trailOpacity: 0.07,
    speed: 50
};

// Matrix effect - creates a rain of characters on the canvas 
class MatrixRain {
    constructor() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.drops = Array(Math.floor(canvas.width / config.fontSize)).fill(0);
    }

    resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.drops = Array(Math.floor(canvas.width / config.fontSize)).fill(0);
    }

    draw() {
        ctx.fillStyle = `rgba(0, 0, 0, ${config.trailOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = document.getElementById('colorPicker').value;
        ctx.font = `${config.fontSize}px ${config.fontFamily}`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 15;

        this.drops.forEach((drop, i) => {
            const char = config.characters[Math.floor(Math.random() * config.characters.length)];
            ctx.fillText(char, i * config.fontSize, drop * config.fontSize);

            if (drop * config.fontSize > canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        });
    }
}

// Animation control - start/stop animation on button click


const matrix = new MatrixRain();

function animate() {
    if (!isPaused) {
        matrix.draw();
    }
    animationId = requestAnimationFrame(animate);
}

// Controls
document.getElementById('pauseBtn').addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById('pauseBtn').textContent = isPaused ? '▶' : '⏸';
});

document.getElementById('speedSlider').addEventListener('input', (e) => {
    config.trailOpacity = 0.02 + (e.target.value / 100);
});

document.getElementById('colorPicker').addEventListener('input', (e) => {
    ctx.shadowColor = e.target.value;
});


animate();


document.addEventListener('click', () => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 100 + Math.random() * 800;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
});

