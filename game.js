/**
 * ScootyKik - Web Prototype Game Engine
 * "Ride India. Feel India."
 */

// --- DATA STRUCTURES (Sync with Unity C# metadata) ---

const characters = [
    { name: "Default Boy", cost: 0, speed: 3, control: 4, stamina: 4, rank: 1, desc: "A simple high-school rider. Balanced stats.", visual: "👨" },
    { name: "Casual Boy", cost: 0, speed: 4, control: 4, stamina: 4, rank: 3, desc: "Casual style, loves scooty riding.", visual: "👦" },
    { name: "Youngster", cost: 600, speed: 4, control: 5, stamina: 4, rank: 6, desc: "Fast and furious city rider.", visual: "🧑" },
    { name: "Punjabi Style", cost: 500, speed: 5, control: 5, stamina: 5, rank: 8, desc: "Turban and black kurta. Full energy!", visual: "👳" },
    { name: "Village Boy", cost: 800, speed: 3, control: 6, stamina: 7, rank: 10, desc: "Dhoti and towel. Incredible stamina.", visual: "👨‍🌾" },
    { name: "Farmer Boy", cost: 800, speed: 3, control: 6, stamina: 7, rank: 12, desc: "Veshti and towel. Hardworking rider.", visual: "🧑‍🌾" },
    { name: "Street Style", cost: 1000, speed: 6, control: 5, stamina: 5, rank: 15, desc: "Hoodie, street smarts. High speed.", visual: "🥷" },
    { name: "Backpacker", cost: 1200, speed: 5, control: 5, stamina: 7, rank: 17, desc: "Traveler, ready to ride across India.", visual: "🎒" },
    { name: "Royal Look", cost: 1500, speed: 6, control: 6, stamina: 5, rank: 18, desc: "Royal Kurta. Extremely premium style.", visual: "👑" },
    { name: "Royal Punjabi", cost: 2000, speed: 6, control: 6, stamina: 7, rank: 20, desc: "Maroon turban. Absolute legend stats.", visual: "👳‍♂️" }
];

const vehicles = [
    { name: "Scooty", cost: 0, speed: 5, control: 6, stamina: 6, desc: "Your trusty Indian gearless scooter. Balanced stats, stable handling.", visual: "🛵", color: "#FFD700" },
    { name: "Cycle", cost: 400, speed: 2, control: 8, stamina: 9, desc: "Simple eco-friendly ride. High control, great stamina, but slow speed.", visual: "🚲", color: "#4CAF50" },
    { name: "Bike", cost: 800, speed: 7, control: 4, stamina: 5, desc: "A standard 150cc commuter bike. Fast acceleration but harder to steer.", visual: "🏍️", color: "#F44336" },
    { name: "Auto Rickshaw", cost: 1200, speed: 3, control: 6, stamina: 4, desc: "The classic yellow/green three-wheeler. High control, wide, and makes funny noises.", visual: "🛺", color: "#00E676" },
    { name: "Race Car", cost: 2000, speed: 9, control: 3, stamina: 7, desc: "A modified street racer. Maximum speed but extremely touchy controls.", visual: "🏎️", color: "#E91E63" }
];

const themes = [
    { name: "Tamil Nadu Village", cost: 0, bg: "linear-gradient(135deg, #FF9800 0%, #795548 100%)", road: "#5d544b", line: "#FFB300", accent: "🏛️", msg: "TN 09", desc: "Temple gopurams, wall writings, and wandering cows." },
    { name: "Bangalore City", cost: 300, bg: "linear-gradient(135deg, #6200EA 0%, #00B0FF 100%)", road: "#373d49", line: "#ffffff", accent: "🌆", msg: "KA 05", desc: "MG road signs, buses, heavy traffic, and Kannada signboards." },
    { name: "AP Highway", cost: 500, bg: "linear-gradient(135deg, #4CAF50 0%, #FFEB3B 100%)", road: "#444b54", line: "#ffffff", accent: "🛣️", msg: "AP 39", desc: "NH signboards, high-speed straight road, Vijayawada distance boards." },
    { name: "AP Village", cost: 800, bg: "linear-gradient(135deg, #2E7D32 0%, #8D6E63 100%)", road: "#6d5b4f", line: "", accent: "🌿", msg: "AP 27", desc: "Puddles, dirt tracks, coconut trees, and potholes." },
    { name: "Mumbai Sea Link", cost: 1200, bg: "linear-gradient(135deg, #008080 0%, #0077C2 100%)", road: "#2b313d", line: "#ffffff", accent: "🌊", msg: "MH 01", desc: "Bandy-Worli bridge, city skyline, ocean side." },
    { name: "Delhi Highway", cost: 1500, bg: "linear-gradient(135deg, #708090 0%, #D3D3D3 100%)", road: "#3e434f", line: "#ffffff", accent: "🌫️", msg: "DL 03", desc: "Thick winter fog, wide roads, and fast VVIP convoys." }
];

// --- SAFE STORAGE WRAPPER (handles SecurityError in TWA/restricted contexts) ---
const _memStore = {};
const SafeStorage = {
    getItem(key) {
        try { return localStorage.getItem(key); }
        catch(e) { return _memStore[key] !== undefined ? _memStore[key] : null; }
    },
    setItem(key, val) {
        try { localStorage.setItem(key, val); }
        catch(e) { _memStore[key] = String(val); }
    }
};

// --- LOCAL STORAGE STATE MANAGER ---

const State = {
    coins: 1250,
    highScore: 0,
    selectedChar: "Default Boy",
    selectedVehicle: "Scooty",
    selectedTheme: "Tamil Nadu Village",
    unlockedChars: ["Default Boy", "Casual Boy"],
    unlockedVehicles: ["Scooty"],
    unlockedThemes: ["Tamil Nadu Village"],
    dailyClaimTime: null,
    doubleCoinsEnd: null,

    load() {
        try {
            if (SafeStorage.getItem("scootykik_coins") !== null) {
                this.coins = parseInt(SafeStorage.getItem("scootykik_coins") || "1250");
                this.highScore = parseFloat(SafeStorage.getItem("scootykik_highscore") || "0");
                this.selectedChar = SafeStorage.getItem("scootykik_char") || "Default Boy";
                this.selectedVehicle = SafeStorage.getItem("scootykik_vehicle") || "Scooty";
                this.selectedTheme = SafeStorage.getItem("scootykik_theme") || "Tamil Nadu Village";
                
                try {
                    this.unlockedChars = JSON.parse(SafeStorage.getItem("scootykik_unlocked_chars")) || ["Default Boy", "Casual Boy"];
                } catch (e) {
                    this.unlockedChars = ["Default Boy", "Casual Boy"];
                }
                try {
                    this.unlockedVehicles = JSON.parse(SafeStorage.getItem("scootykik_unlocked_vehicles")) || ["Scooty"];
                } catch (e) {
                    this.unlockedVehicles = ["Scooty"];
                }
                try {
                    this.unlockedThemes = JSON.parse(SafeStorage.getItem("scootykik_unlocked_themes")) || ["Tamil Nadu Village"];
                } catch (e) {
                    this.unlockedThemes = ["Tamil Nadu Village"];
                }
                
                this.dailyClaimTime = SafeStorage.getItem("scootykik_daily_claim");
                const dbCoinsEnd = SafeStorage.getItem("scootykik_dbcoins_end");
                if (dbCoinsEnd) this.doubleCoinsEnd = new Date(dbCoinsEnd);
            } else {
                this.save(); // Initialize default storage
            }
        } catch (e) {
            console.warn("State.load: storage unavailable, using defaults.", e);
        }
        
        // Fail-safe validation for corrupt or missing values
        if (!characters.some(c => c.name === this.selectedChar)) this.selectedChar = "Default Boy";
        if (!vehicles.some(v => v.name === this.selectedVehicle)) this.selectedVehicle = "Scooty";
        if (!themes.some(t => t.name === this.selectedTheme)) this.selectedTheme = "Tamil Nadu Village";
        if (!Array.isArray(this.unlockedChars) || this.unlockedChars.length === 0) this.unlockedChars = ["Default Boy", "Casual Boy"];
        if (!Array.isArray(this.unlockedVehicles) || this.unlockedVehicles.length === 0) this.unlockedVehicles = ["Scooty"];
        if (!Array.isArray(this.unlockedThemes) || this.unlockedThemes.length === 0) this.unlockedThemes = ["Tamil Nadu Village"];

        this.syncUI();
    },

    save() {
        try {
            SafeStorage.setItem("scootykik_coins", this.coins);
            SafeStorage.setItem("scootykik_highscore", this.highScore);
            SafeStorage.setItem("scootykik_char", this.selectedChar);
            SafeStorage.setItem("scootykik_vehicle", this.selectedVehicle);
            SafeStorage.setItem("scootykik_theme", this.selectedTheme);
            SafeStorage.setItem("scootykik_unlocked_chars", JSON.stringify(this.unlockedChars));
            SafeStorage.setItem("scootykik_unlocked_vehicles", JSON.stringify(this.unlockedVehicles));
            SafeStorage.setItem("scootykik_unlocked_themes", JSON.stringify(this.unlockedThemes));
            SafeStorage.setItem("scootykik_daily_claim", this.dailyClaimTime);
            SafeStorage.setItem("scootykik_dbcoins_end", this.doubleCoinsEnd ? this.doubleCoinsEnd.toISOString() : "");
        } catch (e) {
            console.warn("State.save: storage unavailable.", e);
        }
    },

    syncUI() {
        // Sync coin counters
        document.getElementById("menu-total-coins").innerText = this.coins.toLocaleString();
        document.querySelectorAll(".total-coins-val").forEach(el => el.innerText = this.coins.toLocaleString());
        document.getElementById("menu-highScoreText") ? document.getElementById("menu-highScoreText").innerText = this.highScore.toFixed(2) + " KM" : null;
        
        const valBestDistance = document.getElementById("val-best-distance");
        if (valBestDistance) {
            valBestDistance.innerText = this.highScore.toFixed(2) + " KM";
        }
        const valTotalCoins = document.getElementById("val-total-coins");
        if (valTotalCoins) {
            valTotalCoins.innerText = this.coins.toLocaleString();
        }

        document.getElementById("current-city-badge").innerText = this.selectedTheme.split(' ')[0];

        // Sync Character Preview on Menu
        const char = characters.find(c => c.name === this.selectedChar);
        const vehicle = vehicles.find(v => v.name === this.selectedVehicle);
        
        document.getElementById("menu-rider-name").innerText = char.name;
        
        const avatarHolder = document.getElementById("menu-char-avatar");
        if (avatarHolder) {
            avatarHolder.innerHTML = `
                <div style="font-size: 85px; position: relative;">
                    <span>${vehicle.visual}</span>
                    <span style="position: absolute; bottom: 42px; left: 10px; font-size: 38px;">${char.visual}</span>
                </div>
            `;
        }
    },

    isDoubleCoinsActive() {
        if (!this.doubleCoinsEnd) return false;
        if (new Date() < this.doubleCoinsEnd) return true;
        this.doubleCoinsEnd = null;
        this.save();
        return false;
    }
};

// --- AUDIO SYNTHESIS SYSTEM (Web Audio API) ---

const AudioSys = {
    ctx: null,
    engineOsc: null,
    engineGain: null,
    currentVehicleType: "Scooty",
    ambientOsc1: null,
    ambientOsc2: null,
    ambientGain: null,
    lfo: null,

    init() {
        if (this.ctx) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        } catch (e) {
            console.warn("AudioContext init failed:", e);
        }
    },

    playCoin() {
        this.init();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        
        const playChime = (freq, delay) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, t + delay);
            gain.gain.setValueAtTime(0.0, t + delay);
            gain.gain.linearRampToValueAtTime(0.08, t + delay + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.28);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + delay);
            osc.stop(t + delay + 0.3);
        };

        playChime(1174.66, 0);
        playChime(1567.98, 0.06);
    },

    playHorn() {
        this.init();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        
        const playBeep = (startTime, duration) => {
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc1.type = "sawtooth";
            osc1.frequency.setValueAtTime(800, startTime);
            osc2.type = "sawtooth";
            osc2.frequency.setValueAtTime(805, startTime);

            gain.gain.setValueAtTime(0.0, startTime);
            gain.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
            gain.gain.setValueAtTime(0.08, startTime + duration - 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start(startTime);
            osc2.start(startTime);
            osc1.stop(startTime + duration);
            osc2.stop(startTime + duration);
        };

        playBeep(t, 0.10);
        playBeep(t + 0.13, 0.12);
    },

    playNearMiss() {
        this.init();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.18);
        
        gain.gain.setValueAtTime(0.0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
    },

    playCrash() {
        this.init();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        
        const bufferSize = this.ctx.sampleRate * 0.8;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, t);
        filter.frequency.exponentialRampToValueAtTime(80, t + 0.6);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(t);
        noise.stop(t + 0.8);

        const thudOsc = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        thudOsc.type = "triangle";
        thudOsc.frequency.setValueAtTime(130, t);
        thudOsc.frequency.exponentialRampToValueAtTime(20, t + 0.4);

        thudGain.gain.setValueAtTime(0.5, t);
        thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        thudOsc.connect(thudGain);
        thudGain.connect(this.ctx.destination);
        thudOsc.start(t);
        thudOsc.stop(t + 0.5);

        this.stopEngine();
    },

    startEngine(vehicleType = "Scooty") {
        this.init();
        if (!this.ctx) return;
        this.stopEngine();
        this.currentVehicleType = vehicleType;

        const t = this.ctx.currentTime;
        this.engineOsc = this.ctx.createOscillator();
        this.engineGain = this.ctx.createGain();

        if (vehicleType === "Cycle") {
            this.engineOsc.type = "triangle";
            this.engineOsc.frequency.value = 30;
            this.engineGain.gain.value = 0.02;
        } else if (vehicleType === "Auto Rickshaw") {
            this.engineOsc.type = "sawtooth";
            this.engineOsc.frequency.value = 65;
            this.engineGain.gain.value = 0.08;
        } else if (vehicleType === "Race Car") {
            this.engineOsc.type = "sawtooth";
            this.engineOsc.frequency.value = 110;
            this.engineGain.gain.value = 0.07;
        } else if (vehicleType === "Bike") {
            this.engineOsc.type = "sawtooth";
            this.engineOsc.frequency.value = 85;
            this.engineGain.gain.value = 0.09;
        } else {
            this.engineOsc.type = "triangle";
            this.engineOsc.frequency.value = 75;
            this.engineGain.gain.value = 0.08;
        }

        this.engineOsc.connect(this.engineGain);
        this.engineGain.connect(this.ctx.destination);
        this.engineOsc.start(t);
    },

    updateEnginePitch(speedRatio, isBoosting = false) {
        if (!this.engineOsc || !this.ctx) return;
        
        let basePitch = 70;
        let scale = 120;
        
        if (this.currentVehicleType === "Auto Rickshaw") {
            basePitch = 50;
            scale = 75;
        } else if (this.currentVehicleType === "Bike") {
            basePitch = 65;
            scale = 160;
        } else if (this.currentVehicleType === "Race Car") {
            basePitch = 90;
            scale = 220;
        } else if (this.currentVehicleType === "Cycle") {
            basePitch = 25;
            scale = 20;
        }
        
        const targetPitch = basePitch + (speedRatio * scale) + (isBoosting ? 35 : 0);
        this.engineOsc.frequency.setTargetAtTime(targetPitch, this.ctx.currentTime, 0.08);
    },

    startAmbient() {
        this.init();
        if (!this.ctx) return;
        this.stopAmbient();

        const t = this.ctx.currentTime;
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.0, t);
        this.ambientGain.gain.linearRampToValueAtTime(0.04, t + 1.0);

        this.ambientOsc1 = this.ctx.createOscillator();
        this.ambientOsc1.type = "triangle";
        this.ambientOsc1.frequency.value = 55;

        this.ambientOsc2 = this.ctx.createOscillator();
        this.ambientOsc2.type = "sine";
        this.ambientOsc2.frequency.value = 110;

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = "sine";
        lfo.frequency.value = 0.2;
        lfoGain.gain.value = 15;

        lfo.connect(lfoGain);
        lfoGain.connect(this.ambientOsc2.frequency);

        this.ambientOsc1.connect(this.ambientGain);
        this.ambientOsc2.connect(this.ambientGain);
        this.ambientGain.connect(this.ctx.destination);

        lfo.start(t);
        this.ambientOsc1.start(t);
        this.ambientOsc2.start(t);

        this.lfo = lfo;
    },

    stopAmbient() {
        if (this.ambientOsc1) {
            try { this.ambientOsc1.stop(); } catch(e){}
            this.ambientOsc1 = null;
        }
        if (this.ambientOsc2) {
            try { this.ambientOsc2.stop(); } catch(e){}
            this.ambientOsc2 = null;
        }
        if (this.lfo) {
            try { this.lfo.stop(); } catch(e){}
            this.lfo = null;
        }
        this.ambientGain = null;
    },

    stopEngine() {
        if (this.engineOsc) {
            try {
                this.engineOsc.stop();
            } catch (e) {}
            this.engineOsc = null;
        }
        this.stopAmbient();
    }
};

// --- GAMEPLAY ENGINE CORE (Canvas pseudo-3D runner) ---

const Game = {
    canvas: null,
    ctx: null,
    isPlaying: false,
    isPaused: false,
    
    // Stats & score
    distance: 0, // meters
    coinsCollected: 0,
    speed: 0, // current speed
    maxSpeed: 0,
    stamina: 100,
    maxStamina: 100,

    // Lane positioning
    lane: 1, // 0=Left, 1=Middle, 2=Right
    targetX: 0, // current smooth offset
    playerX: 0, // current actual rendering position

    // Assets setup
    charData: null,
    vehicleData: null,
    themeData: null,

    // Obstacles, coins, particles, scenery
    obstacles: [],
    coins: [],
    particles: [],
    scenery: [],

    // Timing and road curves
    roadOffset: 0,
    curveAngle: 0,
    nextObstacleTimer: 0,
    nextCoinTimer: 0,
    isBoosting: false,
    isStunned: false,
    slowZoneActive: false,
    shakeTime: 0,
    shakeIntensity: 0,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        
        // Handle canvas sizing dynamically
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());

        // Input bindings
        this.bindControls();
    },

    resizeCanvas() {
        if (!this.canvas) return;
        const rect = this.canvas.parentNode.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }
    },

    bindControls() {
        // Keyboard controls
        window.addEventListener("keydown", (e) => {
            if (!this.isPlaying || this.isPaused) return;

            if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
                this.moveLeft();
            } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
                this.moveRight();
            } else if (e.key.toLowerCase() === "h" || e.key === " ") {
                this.blowHorn();
            } else if (e.key === "Shift") {
                this.isBoosting = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === "Shift") {
                this.isBoosting = false;
            }
        });

        // Touch control buttons (Optimized for mobile touch responses)
        const leftBtn = document.getElementById("ctrl-btn-left");
        const steerLeft = (e) => {
            e.preventDefault();
            if (this.isPlaying && !this.isPaused) this.moveLeft();
        };
        leftBtn.addEventListener("touchstart", steerLeft, {passive: false});
        leftBtn.addEventListener("mousedown", steerLeft);

        const rightBtn = document.getElementById("ctrl-btn-right");
        const steerRight = (e) => {
            e.preventDefault();
            if (this.isPlaying && !this.isPaused) this.moveRight();
        };
        rightBtn.addEventListener("touchstart", steerRight, {passive: false});
        rightBtn.addEventListener("mousedown", steerRight);

        const hornBtn = document.getElementById("ctrl-btn-horn");
        const triggerHorn = (e) => {
            e.preventDefault();
            if (this.isPlaying && !this.isPaused) this.blowHorn();
        };
        hornBtn.addEventListener("touchstart", triggerHorn, {passive: false});
        hornBtn.addEventListener("mousedown", triggerHorn);

        // Speed boost button hold
        const boostBtn = document.getElementById("ctrl-btn-boost");
        const startBoost = (e) => {
            e.preventDefault();
            if (this.isPlaying && !this.isPaused) {
                this.isBoosting = true;
                boostBtn.classList.add("active");
            }
        };
        const stopBoost = (e) => {
            e.preventDefault();
            this.isBoosting = false;
            boostBtn.classList.remove("active");
        };

        boostBtn.addEventListener("touchstart", startBoost, {passive: false});
        boostBtn.addEventListener("touchend", stopBoost, {passive: false});
        boostBtn.addEventListener("mousedown", startBoost);
        boostBtn.addEventListener("mouseup", stopBoost);
        boostBtn.addEventListener("mouseleave", stopBoost);
    },

    start() {
        // Enforce dynamic resize now that the screen is visible
        this.resizeCanvas();

        this.charData = characters.find(c => c.name === State.selectedChar) || characters[0];
        this.vehicleData = vehicles.find(v => v.name === State.selectedVehicle) || vehicles[0];
        this.themeData = themes.find(t => t.name === State.selectedTheme) || themes[0];

        this.isPlaying = true;
        this.isPaused = false;
        this.isStunned = false;
        this.slowZoneActive = false;
        this.isBoosting = false;

        this.distance = 0;
        this.coinsCollected = 0;
        
        // Calculate physics attributes based on Stats
        const speedStat = this.charData.speed + this.vehicleData.speed;
        const controlStat = this.charData.control + this.vehicleData.control;
        const staminaStat = this.charData.stamina + this.vehicleData.stamina;

        this.speed = 15 + (speedStat * 1.5);
        this.maxSpeed = 35 + (speedStat * 2);
        this.maxStamina = 100 + (staminaStat * 10);
        this.stamina = this.maxStamina;

        this.lane = 1;
        this.targetX = 0;
        this.playerX = 0;

        this.obstacles = [];
        this.coins = [];
        this.particles = [];
        this.floatingTexts = [];
        this.scenery = [];

        // Pre-populate roadside scenery elements
        for (let i = 0; i < 10; i++) {
            const type = i % 3 === 0 ? "tree" : (i % 3 === 1 ? "pole" : "shop");
            let subType = "";
            if (type === "tree") {
                subType = Math.random() > 0.5 ? "coconut" : "banyan";
            } else if (type === "shop") {
                const rs = Math.random();
                subType = rs < 0.35 ? "dhaba" : (rs < 0.7 ? "pan_shop" : (rs < 0.85 ? "wall_painting" : "tea"));
            }
            this.scenery.push({
                x: i % 2 === 0 ? -150 - Math.random() * 80 : 150 + Math.random() * 80,
                z: i * 60 + 40,
                type: type,
                subType: subType
            });
        }

        this.roadOffset = 0;
        this.curveAngle = 0;
        
        // Start engine sound
        AudioSys.startEngine(this.vehicleData.name);
        AudioSys.startAmbient();

        // Hide alert UI
        document.getElementById("stunned-alert").classList.remove("active");
        document.getElementById("slowzone-alert").classList.remove("active");

        // UI texts update
        document.getElementById("hud-coins").innerText = "0";
        document.getElementById("hud-distance").innerText = "0.0 KM";

        // Request animation frame
        requestAnimationFrame(() => this.updateLoop());
    },

    updateLoop() {
        if (!this.isPlaying || this.isPaused) return;

        this.updatePhysics();
        this.render();

        requestAnimationFrame(() => this.updateLoop());
    },

    moveLeft() {
        if (this.isStunned) return;
        if (this.lane > 0) {
            this.lane--;
            this.targetX = (this.lane - 1) * 75; // lanes x-offset (-75, 0, 75)
        }
    },

    moveRight() {
        if (this.isStunned) return;
        if (this.lane < 2) {
            this.lane++;
            this.targetX = (this.lane - 1) * 75;
        }
    },

    blowHorn() {
        AudioSys.playHorn();
        
        // Flash HUD Horn effect
        const hornFlash = document.getElementById("horn-blast-effect");
        hornFlash.classList.add("active");
        setTimeout(() => hornFlash.classList.remove("active"), 300);

        // Scare nearby cows
        this.obstacles.forEach(o => {
            if (o.type === "cow" && o.z < 250 && o.z > 50) {
                o.isScared = true;
            }
        });
    },

    triggerShake(duration, intensity) {
        this.shakeTime = duration;
        this.shakeIntensity = intensity;
    },

    updatePhysics() {
        // 1. Smooth horizontal lane movement
        const controlStat = this.charData.control + this.vehicleData.control;
        const lerpSpeed = 0.08 + (controlStat * 0.01);
        this.playerX += (this.targetX - this.playerX) * lerpSpeed;
        const steerVelocity = (this.targetX - this.playerX);
        this.lean = Math.max(-0.16, Math.min(0.16, steerVelocity * 0.0035));

        // 2. Adjust Speed & Stamina
        if (this.isBoosting && this.stamina > 5 && !this.isStunned) {
            this.speed = Math.min(this.speed + 1.2, this.maxSpeed + 10);
            this.stamina = Math.max(0, this.stamina - 28 * 0.016); // ~28 drain/sec
        } else {
            this.isBoosting = false;
            let currentLimit = this.slowZoneActive ? 15 : this.maxSpeed;
            if (this.isStunned) currentLimit = 10;
            
            if (this.speed > currentLimit) {
                this.speed = Math.max(currentLimit, this.speed - 0.8);
            } else if (this.speed < currentLimit && !this.isStunned) {
                this.speed = Math.min(currentLimit, this.speed + 0.08); // Slow gradual acceleration
            }
            
            // Refill stamina
            const staminaStat = this.charData.stamina + this.vehicleData.stamina;
            this.stamina = Math.min(this.maxStamina, this.stamina + (5 + staminaStat * 0.8) * 0.016);
        }

        // Modulation of audio pitch
        AudioSys.updateEnginePitch(this.speed / this.maxSpeed, this.isBoosting);

        // Update distance
        this.distance += (this.speed / 3.6) * 0.016; // km/h to m/s * frame duration
        document.getElementById("hud-distance").innerText = (this.distance / 1000).toFixed(1) + " KM";

        // Update HUD elements
        document.getElementById("hud-stamina-fill").style.width = (this.stamina / this.maxStamina * 100) + "%";

        // 3. Move Road and Curvature
        this.roadOffset += this.speed * 0.15;
        this.curveAngle += Math.sin(this.distance * 0.002) * 0.0005;

        // 4. Spawn Coins
        this.nextCoinTimer -= this.speed * 0.016;
        if (this.nextCoinTimer <= 0) {
            this.spawnCoinsPattern();
            this.nextCoinTimer = 60 + Math.random() * 60; // Spawn coins frequency
        }

        // 5. Spawn Obstacles
        this.nextObstacleTimer -= this.speed * 0.016;
        if (this.nextObstacleTimer <= 0) {
            this.spawnObstacle();
            this.nextObstacleTimer = 80 + Math.random() * 100;
        }

        // 6. Update Particles
        this.particles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;
            p.z -= this.speed * 0.15; // move with road
            p.life -= 0.026;
            if (p.life <= 0) this.particles.splice(idx, 1);
        });

        // 6c. Update Floating Texts
        if (this.floatingTexts) {
            this.floatingTexts.forEach((ft, idx) => {
                ft.y -= 1.8;
                ft.life -= 0.022;
                if (ft.life <= 0) this.floatingTexts.splice(idx, 1);
            });
        }

        // 6b. Update Scenery elements
        this.scenery.forEach(s => {
            s.z -= this.speed * 0.15;
            if (s.z < -40) {
                s.z = 600; // recycle to horizon
                s.x = Math.random() > 0.5 ? -150 - Math.random() * 80 : 150 + Math.random() * 80;
                const r = Math.random();
                s.type = r < 0.45 ? "tree" : (r < 0.75 ? "pole" : "shop");
                if (s.type === "tree") {
                    s.subType = Math.random() > 0.5 ? "coconut" : "banyan";
                } else if (s.type === "shop") {
                    const rs = Math.random();
                    s.subType = rs < 0.35 ? "dhaba" : (rs < 0.7 ? "pan_shop" : (rs < 0.85 ? "wall_painting" : "tea"));
                } else {
                    s.subType = "";
                }
            }
        });

        // 7. Update Coins
        this.coins.forEach((c, idx) => {
            c.z -= this.speed * 0.15;
            
            // Check collection
            if (c.z < 25 && c.z > 0 && Math.abs(c.x - this.playerX) < 40) {
                // Collect coin!
                AudioSys.playCoin();
                let mult = State.isDoubleCoinsActive() ? 2 : 1;
                this.coinsCollected += mult;
                State.coins += mult;
                State.save();
                document.getElementById("hud-coins").innerText = this.coinsCollected;
                this.spawnPopup('+' + mult, "#FFD700", 1.0);
                this.coins.splice(idx, 1);
                
                // Spawn sparkle particles
                for (let k = 0; k < 6; k++) {
                    this.particles.push({
                        x: c.x + (Math.random() * 20 - 10),
                        y: 35 + (Math.random() * 20 - 10),
                        z: 10,
                        vx: Math.random() * 6 - 3,
                        vy: Math.random() * 6 - 1,
                        color: "#FFD700",
                        life: 1.0
                    });
                }
            } else if (c.z < -20) {
                this.coins.splice(idx, 1);
            }
        });

        // 8. Update Obstacles
        this.obstacles.forEach((o, idx) => {
            // Static vs Dynamic obstacles speed
            let zMove = this.speed * 0.15;
            if (o.type === "traffic") {
                zMove -= o.trafficSpeed * 0.12; // dynamic traffic travels forward (moves slower towards player)
            } else if (o.type === "cow" && o.isScared) {
                o.x += 10; // Run off road
            } else if (o.type === "school_children" || o.type === "dog") {
                o.x += o.crossSpeed;
            }

            o.z -= zMove;

            // Check warning triggers
            if (o.type === "slowzone") {
                // Check if inside slow zone boundary
                const inZone = (o.z > -50 && o.z < 300);
                this.slowZoneActive = inZone;
                const alertEl = document.getElementById("slowzone-alert");
                if (inZone) alertEl.classList.add("active");
                else alertEl.classList.remove("active");
            }

            // Near-miss check
            if (o.z < 28 && o.z > 0 && !o.nearMissChecked && o.type !== "pothole" && o.type !== "breaker" && o.type !== "slowzone" && o.type !== "vvip") {
                o.nearMissChecked = true;
                const dist = Math.abs(o.x - this.playerX);
                if (dist > o.width && dist < o.width + 25) {
                    AudioSys.playNearMiss();
                    const bonus = 50;
                    State.coins += bonus;
                    this.coinsCollected += bonus;
                    State.save();
                    document.getElementById("hud-coins").innerText = this.coinsCollected;
                    this.spawnPopup("NEAR MISS! +50", "#FF9500", 1.4);
                }
            }

            // Check collision
            if (o.z < 28 && o.z > 0 && Math.abs(o.x - this.playerX) < o.width) {
                if (o.type === "pothole") {
                    this.triggerStun();
                    this.obstacles.splice(idx, 1);
                } else if (o.type === "breaker") {
                    this.triggerBounce();
                    this.obstacles.splice(idx, 1);
                } else if (o.type === "slowzone") {
                    // Just triggers slow zone, no crash
                } else if (o.type === "vvip") {
                    // VVIP convoy is immediate un-revivable game over
                    this.triggerCrash(true);
                } else {
                    // Standard obstacle crash
                    this.triggerCrash(false);
                }
            } else if (o.z < -40) {
                this.obstacles.splice(idx, 1);
            }
        });
    },

    spawnCoinsPattern() {
        const lane = Math.floor(Math.random() * 3);
        const startX = (lane - 1) * 75;
        const count = 4;
        const spacing = 45;

        for (let i = 0; i < count; i++) {
            this.coins.push({
                x: startX,
                z: 600 + (i * spacing)
            });
        }
    },

    spawnObstacle() {
        const lane = Math.floor(Math.random() * 3);
        const startX = (lane - 1) * 75;

        // Weight choosing of obstacle types
        const r = Math.random();
        
        let type = "pothole";
        let label = "⚠️";
        let width = 35;
        let trafficSpeed = 0;

        if (r < 0.25) {
            type = "pothole";
            label = "🕳️";
            width = 30;
        } else if (r < 0.45) {
            type = "breaker";
            label = "🚧";
            width = 40;
        } else if (r < 0.65) {
            // Dynamic vehicles (Buses, Autos, Trucks)
            type = "traffic";
            width = 38;
            
            const vehiclesList = [
                { symbol: "🛺", name: "Auto", speed: 12 },
                { symbol: "🚌", name: "Bus", speed: 15 },
                { symbol: "🚚", name: "Truck", speed: 10 },
                { symbol: "🏍️", name: "Motorcycle", speed: 18 }
            ];
            const chosen = vehiclesList[Math.floor(Math.random() * vehiclesList.length)];
            label = chosen.symbol;
            trafficSpeed = chosen.speed;
        } else if (r < 0.80) {
            type = "cow";
            label = "🐄";
            width = 35;
        } else if (r < 0.90) {
            // Pedestrian / Dog crossing
            type = "dog";
            label = Math.random() > 0.5 ? "🐕" : "🚶";
            width = 25;
            this.obstacles.push({
                type: type,
                x: -160, // Starts way left offroad
                z: 600,
                width: width,
                label: label,
                crossSpeed: 3
            });
            return;
        } else if (r < 0.96) {
            // Slow zone banner
            type = "slowzone";
            label = "🚸";
            width = 0; // Not collidable directly
            this.obstacles.push({
                type: "slowzone",
                x: 0,
                z: 650,
                width: 0,
                label: "🚸 SCHOOL ZONE"
            });
            return;
        } else {
            // VVIP Convoy - extremely rare instant game over
            type = "vvip";
            label = "🚔 VVIP CONVOY";
            width = 45;
        }

        this.obstacles.push({
            type: type,
            x: startX,
            z: 600,
            width: width,
            label: label,
            trafficSpeed: trafficSpeed,
            isScared: false
        });
    },

    triggerStun() {
        if (this.isStunned) return;
        this.isStunned = true;
        this.triggerShake(15, 8);

        const alertEl = document.getElementById("stunned-alert");
        alertEl.classList.add("active");

        const flash = document.getElementById("screen-flash");
        flash.classList.add("flash-red");
        setTimeout(() => {
            flash.classList.remove("flash-red");
        }, 100);

        setTimeout(() => {
            this.isStunned = false;
            alertEl.classList.remove("active");
        }, 1500);
    },

    triggerBounce() {
        this.triggerShake(10, 8);
        // Animate canvas vertical camera bounce
        let bounceCount = 0;
        const interval = setInterval(() => {
            bounceCount++;
            if (bounceCount > 10) clearInterval(interval);
        }, 30);
    },

    triggerCrash(isVVIP) {
        AudioSys.playCrash();
        this.isPlaying = false;
        
        // Red screen flash
        const flash = document.getElementById("screen-flash");
        flash.classList.add("flash-red");
        setTimeout(() => flash.classList.remove("flash-red"), 400);

        // Shake camera
        this.triggerShake(30, 15);

        // Hide alert banners
        document.getElementById("slowzone-alert").classList.remove("active");

        // High score comparison
        const scoreKM = parseFloat((this.distance / 1000).toFixed(2));
        let isNewHigh = false;
        if (scoreKM > State.highScore) {
            State.highScore = scoreKM;
            State.save();
            isNewHigh = true;
        }

        // Show Game Over UI
        setTimeout(() => {
            // Keep gameplay screen visible under the translucent glassmorphic crash screen
            // document.getElementById("screen-gameplay").classList.remove("active");
            
            const goScreen = document.getElementById("screen-game-over");
            goScreen.classList.add("active");

            // Fill scorecard
            document.getElementById("go-rider-val").innerText = State.selectedChar;
            document.getElementById("go-vehicle-val").innerText = State.selectedVehicle;
            document.getElementById("go-distance-val").innerText = scoreKM.toFixed(2) + " KM";
            document.getElementById("go-coins-val").innerText = this.coinsCollected;
            document.getElementById("go-best-val").innerText = State.highScore.toFixed(2) + " KM";

            const deathMsg = document.getElementById("gameover-status-msg");
            if (isVVIP) {
                deathMsg.innerText = "🚨 CRITICAL FAILURE! Hit a VVIP Convoy! You can't revive, VIPs don't wait!";
                document.getElementById("btn-go-revive").style.display = "none";
            } else {
                deathMsg.innerText = this.getRandomFunnyDeathMessage();
                document.getElementById("btn-go-revive").style.display = "block";
            }
        }, 800);
    },

    getRandomFunnyDeathMessage() {
        const msgs = [
            "Ouch! Pothole or crater? Welcome to Indian Roads!",
            "Did that cow just judge your driving skills?",
            "Auto rickshaw cut you off? Typical Tuesday!",
            "Indian speed breakers: testing suspensions since 1947.",
            "Crash! Horn please next time!",
            "You ran right into the wedding procession! Did you get any biryani?"
        ];
        return msgs[Math.floor(Math.random() * msgs.length)];
    },

    spawnPopup(text, color, scale = 1.0) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const playerRenderY = h - 90;
        const playerRoadW = 35 + ((playerRenderY - 180) / (h/2)) * (320 - 35);
        const playerXRender = w/2 + (this.playerX / 75) * (playerRoadW / 3);

        this.floatingTexts.push({
            x: playerXRender + (Math.random() * 40 - 20),
            y: playerRenderY - 30 + (Math.random() * 25 - 12),
            text: text,
            color: color,
            scale: scale,
            life: 1.0
        });
    },

    revive() {
        this.isPlaying = true;
        this.isStunned = false;
        this.slowZoneActive = false;
        this.isBoosting = false;
        this.obstacles = [];
        this.coins = [];
        
        // Keep distance, revive in middle lane
        this.lane = 1;
        this.targetX = 0;
        this.playerX = 0;

        // Half stamina
        this.stamina = this.maxStamina / 2;

        AudioSys.startEngine(this.vehicleData.name);
        AudioSys.startAmbient();
        
        document.getElementById("screen-game-over").classList.remove("active");
        document.getElementById("screen-gameplay").classList.add("active");

        requestAnimationFrame(() => this.updateLoop());
    },

    render() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);

        // Camera Shake calculation
        let dx = 0, dy = 0;
        if (this.shakeTime > 0) {
            dx = (Math.random() * 2 - 1) * this.shakeIntensity;
            dy = (Math.random() * 2 - 1) * this.shakeIntensity;
            this.shakeTime--;
        }

        this.ctx.save();
        this.ctx.translate(dx, dy);

        // 1. Draw Background Sky Gradient (Deep blue gradient for all themes)
        const skyGrad = this.ctx.createLinearGradient(0, 0, 0, h/2);
        skyGrad.addColorStop(0, "#081326"); // Deep space top
        skyGrad.addColorStop(0.6, "#122B4F"); // Mid blue
        skyGrad.addColorStop(1, "#1D497D"); // Light horizon blue
        this.ctx.fillStyle = skyGrad;
        this.ctx.fillRect(0, 0, w, h/2);

        // Draw dynamic clouds
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        for (let i = 0; i < 3; i++) {
            const cx = ((this.distance * 0.08 + i * 160) % (w + 120)) - 60;
            const cy = 30 + i * 22;
            const cSize = 22 + i * 6;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, cSize, 0, Math.PI * 2);
            this.ctx.arc(cx - cSize * 0.6, cy + cSize * 0.1, cSize * 0.7, 0, Math.PI * 2);
            this.ctx.arc(cx + cSize * 0.6, cy + cSize * 0.1, cSize * 0.7, 0, Math.PI * 2);
            this.ctx.fill();
        }

        const horizonY = h/2;
        const roadBottomW = w - 40;
        const roadTopW = 24;
        const curveOffset = Math.sin(this.distance * 0.005) * 80;

        // 2. Draw Landmark in the distance (near horizon center)
        if (this.themeData.name.includes("Village") || this.themeData.name.includes("Tamil")) {
            drawTempleGopuram(this.ctx, w/2 + curveOffset, horizonY, 0.35);
        } else {
            // Draw city skylines
            this.ctx.fillStyle = "rgba(44, 62, 80, 0.35)";
            this.ctx.fillRect(w/2 - 50 + curveOffset, horizonY - 45, 18, 45);
            this.ctx.fillRect(w/2 - 28 + curveOffset, horizonY - 65, 24, 65);
            this.ctx.fillRect(w/2 + 5 + curveOffset, horizonY - 50, 16, 50);
            this.ctx.fillRect(w/2 + 25 + curveOffset, horizonY - 38, 20, 38);
        }

        // Horizon divider
        this.ctx.strokeStyle = "rgba(0,0,0,0.12)";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, horizonY);
        this.ctx.lineTo(w, horizonY);
        this.ctx.stroke();

        // 3. Dirt side areas / Ground (Offroad)
        this.ctx.fillStyle = this.themeData.name.includes("Village") ? "#8B7355" : "#78909C";
        this.ctx.beginPath();
        this.ctx.moveTo(0, horizonY);
        this.ctx.lineTo(w, horizonY);
        this.ctx.lineTo(w, h);
        this.ctx.lineTo(0, h);
        this.ctx.fill();

        // Main Road Pitch (Realistic dark asphalt)
        this.ctx.fillStyle = "#1E2026";
        this.ctx.beginPath();
        this.ctx.moveTo(w/2 - roadTopW/2 + curveOffset, horizonY);
        this.ctx.lineTo(w/2 + roadTopW/2 + curveOffset, horizonY);
        this.ctx.lineTo(w/2 + roadBottomW/2, h);
        this.ctx.lineTo(w/2 - roadBottomW/2, h);
        this.ctx.fill();

        // Sideline borders (White lane markings)
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.moveTo(w/2 - roadTopW/2 + curveOffset, horizonY);
        this.ctx.lineTo(w/2 - roadBottomW/2, h);
        this.ctx.moveTo(w/2 + roadTopW/2 + curveOffset, horizonY);
        this.ctx.lineTo(w/2 + roadBottomW/2, h);
        this.ctx.stroke();

        // Dashed Lane dividers (Yellow dashes)
        const stripeCount = 10;
        const stripeSpeedOffset = (this.roadOffset) % 60;
        
        this.ctx.strokeStyle = "#FFC72C";
        this.ctx.lineWidth = 2;

        for (let i = 0; i < stripeCount; i++) {
            const percentStart = (i * 60 - stripeSpeedOffset) / 600;
            const percentEnd = ((i + 0.5) * 60 - stripeSpeedOffset) / 600;
            
            if (percentStart < 0 || percentStart > 1) continue;

            const y1 = horizonY + percentStart * (h/2);
            const y2 = horizonY + percentEnd * (h/2);

            const wStart = roadTopW + percentStart * (roadBottomW - roadTopW);
            const wEnd = roadTopW + percentEnd * (roadBottomW - roadTopW);

            const xCurveStart = w/2 + curveOffset * (1 - percentStart);
            const xCurveEnd = w/2 + curveOffset * (1 - percentEnd);

            // Left lane divider
            this.ctx.beginPath();
            this.ctx.moveTo(xCurveStart - wStart/6, y1);
            this.ctx.lineTo(xCurveEnd - wEnd/6, y2);
            this.ctx.stroke();

            // Right lane divider
            this.ctx.beginPath();
            this.ctx.moveTo(xCurveStart + wStart/6, y1);
            this.ctx.lineTo(xCurveEnd + wEnd/6, y2);
            this.ctx.stroke();
        }

        // 4. Draw Scenery elements (dynamic perspective coconut trees, utility poles, roadside shops)
        this.scenery.forEach(s => {
            const zPct = s.z / 600;
            if (zPct > 1 || zPct < 0) return;

            const renderPct = 1 - zPct;
            const roadW = roadTopW + renderPct * (roadBottomW - roadTopW);
            
            // horizontal offset based on road expansion
            const sideOffset = s.x; // left or right
            const cx = w/2 + curveOffset * (1 - renderPct) + (sideOffset / 75) * (roadW / 3);
            const cy = horizonY + renderPct * (h/2);

            const scale = renderPct * 1.35;

            if (s.type === "tree") {
                if (s.subType === "banyan") {
                    drawBanyanTree(this.ctx, cx, cy, scale);
                } else {
                    drawCoconutTree(this.ctx, cx, cy, scale);
                }
            } else if (s.type === "pole") {
                drawElectricPole(this.ctx, cx, cy, scale);
            } else if (s.type === "shop") {
                drawRoadsideShop(this.ctx, cx, cy, scale, s.subType || "tea");
            }
        });

        // 5. Draw Coins
        this.coins.forEach(c => {
            const zPct = c.z / 600;
            if (zPct > 1 || zPct < 0) return;

            const renderPct = 1 - zPct;
            const size = 6 + (renderPct * 18);
            
            const roadW = roadTopW + renderPct * (roadBottomW - roadTopW);
            const laneXOffset = (c.x / 75) * (roadW / 3);
            const cx = w/2 + curveOffset * (1 - renderPct) + laneXOffset;
            const cy = horizonY + renderPct * (h/2) - (renderPct * 20);

            // Gold Coin
            this.ctx.fillStyle = "#FFD700";
            this.ctx.strokeStyle = "#B7950B";
            this.ctx.lineWidth = 1 + renderPct * 2;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, size/2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();

            // Shiny center
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.beginPath();
            this.ctx.arc(cx - size/6, cy - size/6, size/6, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // 6. Draw Obstacles
        this.obstacles.forEach(o => {
            const zPct = o.z / 600;
            if (zPct > 1 || zPct < 0) return;

            const renderPct = 1 - zPct;
            const roadW = roadTopW + renderPct * (roadBottomW - roadTopW);
            const laneXOffset = (o.x / 75) * (roadW / 3);
            const cx = w/2 + curveOffset * (1 - renderPct) + laneXOffset;
            const cy = horizonY + renderPct * (h/2);

            const scale = renderPct * 1.3;

            if (o.type === "vvip") {
                this.ctx.fillStyle = "red";
                this.ctx.font = `bold ${Math.floor(8 + renderPct * 14)}px sans-serif`;
                this.ctx.textAlign = "center";
                this.ctx.fillText("POLICE / VVIP", cx, cy - (renderPct * 65) - 5);
                drawIndianTruck(this.ctx, cx, cy, scale);
            } else if (o.type === "traffic") {
                if (o.label === "🛺") {
                    drawIndianAuto(this.ctx, cx, cy, scale);
                } else if (o.label === "🚌" || o.label === "🚚") {
                    drawIndianTruck(this.ctx, cx, cy, scale);
                } else if (o.label === "🏍️") {
                    drawMotorcycleObstacle(this.ctx, cx, cy, scale);
                } else {
                    drawIndianAuto(this.ctx, cx, cy, scale);
                }
            } else if (o.type === "cow") {
                drawCow(this.ctx, cx, cy, scale);
            } else if (o.type === "pothole") {
                drawPothole(this.ctx, cx, cy, scale);
            } else if (o.type === "breaker") {
                // Draw speed breaker (striped hazard rectangle)
                this.ctx.save();
                this.ctx.translate(cx, cy);
                this.ctx.scale(scale, scale);
                this.ctx.fillStyle = "#FFC107";
                this.ctx.fillRect(-20, -3, 40, 6);
                this.ctx.strokeStyle = "#000000";
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(-20, -3, 40, 6);
                
                this.ctx.fillStyle = "#000000";
                for (let i = -16; i < 20; i += 8) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(i, -3);
                    this.ctx.lineTo(i + 4, 3);
                    this.ctx.lineTo(i + 2, 3);
                    this.ctx.lineTo(i - 2, -3);
                    this.ctx.fill();
                }
                this.ctx.restore();
            } else {
                // Fallback text drawing if type unrecognized
                const fontSize = Math.floor(12 + renderPct * 65);
                this.ctx.font = `${fontSize}px Arial`;
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "bottom";
                this.ctx.fillText(o.label, cx, cy);
            }
        });

        // 7. Draw Particles
        this.particles.forEach(p => {
            const zPct = p.z / 600;
            const renderPct = 1 - Math.max(0, Math.min(1, zPct));
            const roadW = roadTopW + renderPct * (roadBottomW - roadTopW);
            const laneXOffset = (p.x / 75) * (roadW / 3);
            const cx = w/2 + curveOffset * (1 - renderPct) + laneXOffset;
            const cy = horizonY + renderPct * (h/2);

            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, 3 + renderPct * 10, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        });

        // 8. Draw Player Rider (Bottom center)
        const playerRenderY = h - 90;
        const playerRoadW = roadTopW + ((playerRenderY - horizonY) / (h/2)) * (roadBottomW - roadTopW);
        const playerXRender = w/2 + curveOffset * ((h - playerRenderY) / (h/2)) + (this.playerX / 75) * (playerRoadW / 3);

        const playerScale = 2.15;
        drawPlayerVehicleAndRider(this.ctx, playerXRender, playerRenderY, playerScale, this.vehicleData.name, this.charData.name, this.isBoosting, this.lean);

        // Boost Speed lines
        if (this.isBoosting) {
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            this.ctx.lineWidth = 1.8;
            for (let i = 0; i < 15; i++) {
                const sx = Math.random() * w;
                const sy = Math.random() * h;
                const len = 40 + Math.random() * 60;
                this.ctx.beginPath();
                this.ctx.moveTo(sx, sy);
                this.ctx.lineTo(sx, sy - len);
                this.ctx.stroke();
            }
        }

        // 9. Draw Floating Texts
        if (this.floatingTexts) {
            this.floatingTexts.forEach(ft => {
                this.ctx.save();
                this.ctx.globalAlpha = ft.life;
                this.ctx.fillStyle = ft.color;
                this.ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
                this.ctx.shadowBlur = 4;
                this.ctx.font = `bold ${Math.round(15 * ft.scale)}px 'Outfit', sans-serif`;
                this.ctx.textAlign = "center";
                this.ctx.fillText(ft.text, ft.x, ft.y);
                this.ctx.restore();
            });
        }

        this.ctx.restore(); // end shake translate
    }
};

// --- MOCK AD & SYSTEM TRIGGERS ---

const Ads = {
    adTimerVal: 5,
    adInterval: null,
    onCompleteCallback: null,

    showRewarded(callback) {
        this.onCompleteCallback = callback;
        const panel = document.getElementById("ad-overlay");
        panel.classList.add("active");

        this.adTimerVal = 5;
        document.getElementById("ad-timer").innerText = this.adTimerVal + "s";
        document.getElementById("ad-loading-fill").style.width = "0%";

        setTimeout(() => {
            document.getElementById("ad-loading-fill").style.width = "100%";
        }, 50);

        this.adInterval = setInterval(() => {
            this.adTimerVal--;
            document.getElementById("ad-timer").innerText = this.adTimerVal + "s";

            if (this.adTimerVal <= 0) {
                clearInterval(this.adInterval);
                panel.classList.remove("active");
                if (this.onCompleteCallback) this.onCompleteCallback(true);
            }
        }, 1000);
    }
};

// --- SCREEN NAVIGATION HANDLERS ---

let menuAnimId = null;
let charAnimId = null;
let vehicleAnimId = null;
let activeShowcaseChar = "Default Boy";
let activeShowcaseVehicle = "Scooty";

function startMenuAnimation() {
    const canvas = document.getElementById("menuCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    if (menuAnimId) cancelAnimationFrame(menuAnimId);
    
    let roadOffset = 0;
    
    function loop() {
        roadOffset += 4.5;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw deep blue sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height/2);
        skyGrad.addColorStop(0, "#081326");
        skyGrad.addColorStop(1, "#194175");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height/2);

        // Twinkling sky stars
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        for (let i = 0; i < 8; i++) {
            const px = ((roadOffset * 0.25 + i * 45) % canvas.width);
            const py = 12 + (Math.sin(roadOffset * 0.008 + i) * 6);
            ctx.beginPath();
            ctx.arc(px, py, i % 2 === 0 ? 1 : 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Horizon sky clouds
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        for (let i = 0; i < 3; i++) {
            const cx = (roadOffset * 0.15 + i * 110) % (canvas.width + 60) - 30;
            ctx.beginPath();
            ctx.arc(cx, 25, 12, 0, Math.PI * 2);
            ctx.arc(cx - 8, 28, 10, 0, Math.PI * 2);
            ctx.arc(cx + 8, 28, 10, 0, Math.PI * 2);
            ctx.fill();
        }

        // Horizon divider & Offroad ground
        ctx.fillStyle = "#161b24";
        ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);
        
        // Perspective road
        ctx.fillStyle = "#1E222A";
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 - 15, canvas.height/2);
        ctx.lineTo(canvas.width/2 + 15, canvas.height/2);
        ctx.lineTo(canvas.width/2 + 110, canvas.height);
        ctx.lineTo(canvas.width/2 - 110, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        // Lane lines
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 - 15, canvas.height/2);
        ctx.lineTo(canvas.width/2 - 110, canvas.height);
        ctx.moveTo(canvas.width/2 + 15, canvas.height/2);
        ctx.lineTo(canvas.width/2 + 110, canvas.height);
        ctx.stroke();

        // Center stripes moving
        ctx.strokeStyle = "#FF9500";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 12]);
        ctx.lineDashOffset = -roadOffset;
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, canvas.height/2);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Project side trees
        const treeZ1 = (roadOffset * 0.5) % 150;
        const treeZ2 = (roadOffset * 0.5 + 75) % 150;
        
        const scale1 = (150 - treeZ1) / 150;
        drawCoconutTree(ctx, canvas.width/2 + 25 + (scale1 * 80), canvas.height/2 + (scale1 * 100), scale1 * 0.95);
        
        const scale2 = (150 - treeZ2) / 150;
        drawCoconutTree(ctx, canvas.width/2 - 25 - (scale2 * 80), canvas.height/2 + (scale2 * 100), scale2 * 0.95);
        
        // Draw active vehicle & rider in center, bouncing gently
        const bounce = Math.sin(Date.now() * 0.012) * 1.5;
        const activeChar = State.selectedChar;
        const activeVehicle = State.selectedVehicle;
        drawPlayerVehicleAndRider(
            ctx, 
            canvas.width/2, 
            canvas.height - 40 + bounce, 
            1.6, 
            activeVehicle, 
            activeChar, 
            false
        );
        
        menuAnimId = requestAnimationFrame(loop);
    }
    loop();
}

function startCharSelectAnimation() {
    const canvas = document.getElementById("charSelectCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    if (charAnimId) cancelAnimationFrame(charAnimId);
    
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Spotlight
        const radial = ctx.createRadialGradient(canvas.width/2, canvas.height/2 - 20, 10, canvas.width/2, canvas.height/2 - 20, 120);
        radial.addColorStop(0, "rgba(255, 149, 0, 0.25)");
        radial.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Platform
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.strokeStyle = "rgba(255, 149, 0, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(canvas.width/2, canvas.height - 35, 60, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Animating bounce
        const bounce = Math.sin(Date.now() * 0.005) * 1.5;
        
        drawStandingRider(
            ctx,
            canvas.width/2,
            canvas.height - 40 + bounce,
            2.3, // Big showcase scale
            activeShowcaseChar
        );
        
        charAnimId = requestAnimationFrame(loop);
    }
    loop();
}

function startVehicleSelectAnimation() {
    const canvas = document.getElementById("vehicleSelectCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    if (vehicleAnimId) cancelAnimationFrame(vehicleAnimId);
    
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Spotlight
        const radial = ctx.createRadialGradient(canvas.width/2, canvas.height/2 - 20, 10, canvas.width/2, canvas.height/2 - 20, 120);
        radial.addColorStop(0, "rgba(255, 149, 0, 0.25)");
        radial.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Platform
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.strokeStyle = "rgba(255, 149, 0, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(canvas.width/2, canvas.height - 35, 65, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Bounce
        const bounce = Math.sin(Date.now() * 0.005) * 1.5;
        
        drawVehicleAtAngle(
            ctx,
            canvas.width/2,
            canvas.height - 40 + bounce,
            2.3, // Big vehicle scale
            activeShowcaseVehicle
        );
        
        vehicleAnimId = requestAnimationFrame(loop);
    }
    loop();
}

// --- SCREEN NAVIGATION HANDLERS ---

function navigateTo(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add("active");
    }

    // Scroll hack to hide mobile browser chrome/URL bar
    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 100);

    // Cancel all menu/showcase animations by default
    if (menuAnimId) { cancelAnimationFrame(menuAnimId); menuAnimId = null; }
    if (charAnimId) { cancelAnimationFrame(charAnimId); charAnimId = null; }
    if (vehicleAnimId) { cancelAnimationFrame(vehicleAnimId); vehicleAnimId = null; }

    if (screenId === "screen-main-menu") {
        State.syncUI();
        AudioSys.stopEngine();
        startMenuAnimation();
    } else if (screenId === "screen-character-select") {
        startCharSelectAnimation();
    } else if (screenId === "screen-vehicle-select") {
        startVehicleSelectAnimation();
    }
}

// Populate Lists functions
function populateCharacterList() {
    const list = document.getElementById("character-list-container");
    list.innerHTML = "";

    characters.forEach(c => {
        const isUnlocked = State.unlockedChars.includes(c.name);
        const isSelected = State.selectedChar === c.name;

        const card = document.createElement("div");
        card.className = `item-card ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}`;
        
        card.innerHTML = `
            <div class="item-visual">${c.visual}</div>
            <h4>${c.name}</h4>
            <div class="cost-badge ${isUnlocked ? 'unlocked' : ''}">
                ${isUnlocked ? 'UNLOCKED' : '🪙 ' + c.cost}
            </div>
        `;

        card.addEventListener("click", () => {
            document.querySelectorAll("#character-list-container .item-card").forEach(el => el.classList.remove("selected"));
            card.classList.add("selected");
            
            // Update Showcase Left details
            document.getElementById("char-showcase-name").innerText = c.name;
            document.getElementById("char-showcase-desc").innerText = c.desc;
            document.getElementById("char-showcase-rank").innerText = "RANK " + c.rank;
            
            document.getElementById("char-stat-speed").style.width = (c.speed * 10) + "%";
            document.getElementById("char-stat-control").style.width = (c.control * 10) + "%";
            document.getElementById("char-stat-stamina").style.width = (c.stamina * 10) + "%";

            activeShowcaseChar = c.name;

            // Handle Select or Buy Button label
            const selectBtn = document.getElementById("btn-confirm-character");
            if (isUnlocked) {
                selectBtn.innerText = "SELECT";
                selectBtn.onclick = () => {
                    State.selectedChar = c.name;
                    State.save();
                    navigateTo("screen-main-menu");
                };
            } else {
                selectBtn.innerText = `UNLOCK FOR 🪙 ${c.cost}`;
                selectBtn.onclick = () => {
                    if (State.coins >= c.cost) {
                        State.coins -= c.cost;
                        State.unlockedChars.push(c.name);
                        State.selectedChar = c.name;
                        State.save();
                        populateCharacterList();
                        State.syncUI();
                    } else {
                        alert("Not enough coins! Collect coins in game or watch ads in shop.");
                    }
                };
            }
        });

        // Trigger click on selected to initialize showcase
        if (isSelected) {
            setTimeout(() => card.click(), 10);
        }
    });
}

function populateVehicleList() {
    const list = document.getElementById("vehicle-list-container");
    list.innerHTML = "";

    vehicles.forEach(v => {
        const isUnlocked = State.unlockedVehicles.includes(v.name);
        const isSelected = State.selectedVehicle === v.name;

        const card = document.createElement("div");
        card.className = `item-card ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}`;
        
        card.innerHTML = `
            <div class="item-visual">${v.visual}</div>
            <h4>${v.name}</h4>
            <div class="cost-badge ${isUnlocked ? 'unlocked' : ''}">
                ${isUnlocked ? 'UNLOCKED' : '🪙 ' + v.cost}
            </div>
        `;

        card.style.borderBottom = `4px solid ${v.color}`;

        card.addEventListener("click", () => {
            document.querySelectorAll("#vehicle-list-container .item-card").forEach(el => el.classList.remove("selected"));
            card.classList.add("selected");
            
            // Update Showcase Left details
            document.getElementById("vehicle-showcase-name").innerText = v.name;
            document.getElementById("vehicle-showcase-desc").innerText = v.desc;
            
            document.getElementById("vehicle-stat-speed").style.width = (v.speed * 10) + "%";
            document.getElementById("vehicle-stat-control").style.width = (v.control * 10) + "%";
            document.getElementById("vehicle-stat-stamina").style.width = (v.stamina * 10) + "%";

            activeShowcaseVehicle = v.name;

            const selectBtn = document.getElementById("btn-confirm-vehicle");
            if (isUnlocked) {
                selectBtn.innerText = "SELECT";
                selectBtn.onclick = () => {
                    State.selectedVehicle = v.name;
                    State.save();
                    navigateTo("screen-main-menu");
                };
            } else {
                selectBtn.innerText = `UNLOCK FOR 🪙 ${v.cost}`;
                selectBtn.onclick = () => {
                    if (State.coins >= v.cost) {
                        State.coins -= v.cost;
                        State.unlockedVehicles.push(v.name);
                        State.selectedVehicle = v.name;
                        State.save();
                        populateVehicleList();
                        State.syncUI();
                    } else {
                        alert("Not enough coins! Collect coins in game or watch ads in shop.");
                    }
                };
            }
        });

        if (isSelected) {
            setTimeout(() => card.click(), 10);
        }
    });
}

function populateCityList() {
    const list = document.getElementById("city-list-container");
    list.innerHTML = "";

    themes.forEach(t => {
        const isUnlocked = State.unlockedThemes.includes(t.name);
        const isSelected = State.selectedTheme === t.name;

        const card = document.createElement("div");
        card.className = `city-card ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}`;
        card.style.background = t.bg;
        
        card.innerHTML = `
            ${isUnlocked ? '' : '<div class="card-lock-badge">🔒</div>'}
            <div class="city-visual-circle">${t.accent}</div>
            <div class="city-card-info">
                <h3>${t.name}</h3>
            </div>
            <span class="city-lock-status">${isUnlocked ? 'UNLOCKED' : '🪙 ' + t.cost}</span>
        `;

        card.addEventListener("click", () => {
            document.querySelectorAll("#city-list-container .city-card").forEach(el => el.classList.remove("selected"));
            card.classList.add("selected");

            const selectBtn = document.getElementById("btn-confirm-city");
            if (isUnlocked) {
                selectBtn.innerText = "SELECT THEME";
                selectBtn.onclick = () => {
                    State.selectedTheme = t.name;
                    State.save();
                    navigateTo("screen-main-menu");
                };
            } else {
                selectBtn.innerText = `UNLOCK THEME FOR 🪙 ${t.cost}`;
                selectBtn.onclick = () => {
                    if (State.coins >= t.cost) {
                        State.coins -= t.cost;
                        State.unlockedThemes.push(t.name);
                        State.selectedTheme = t.name;
                        State.save();
                        populateCityList();
                        State.syncUI();
                    } else {
                        alert("Not enough coins! Watch ads in shop to get coins.");
                    }
                };
            }
        });

        list.appendChild(card);

        if (isSelected) {
            setTimeout(() => card.click(), 10);
        }
    });
}

// Screenshot capture
function triggerScreenshot() {
    // White flash effect
    const flash = document.getElementById("screen-flash");
    flash.classList.add("flash-white");
    setTimeout(() => flash.classList.remove("flash-white"), 300);

    // Copy game canvas into a preview container overlay
    const ssCanvas = document.getElementById("screenshotCanvas");
    const gameCanvas = document.getElementById("gameCanvas");
    
    ssCanvas.width = gameCanvas.width;
    ssCanvas.height = gameCanvas.height;
    
    const ssCtx = ssCanvas.getContext("2d");
    ssCtx.drawImage(gameCanvas, 0, 0);

    // Draw card overlay on screenshot
    ssCtx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ssCtx.fillRect(10, gameCanvas.height - 150, gameCanvas.width - 20, 140);
    ssCtx.strokeStyle = "#FFB300";
    ssCtx.lineWidth = 2;
    ssCtx.strokeRect(10, gameCanvas.height - 150, gameCanvas.width - 20, 140);

    ssCtx.fillStyle = "#FFB300";
    ssCtx.font = "bold 20px sans-serif";
    ssCtx.fillText("🛵 SCOOTYKIK", 25, gameCanvas.height - 120);

    ssCtx.fillStyle = "#FFFFFF";
    ssCtx.font = "14px sans-serif";
    ssCtx.fillText(`Distance: ${(Game.distance/1000).toFixed(1)} KM`, 25, gameCanvas.height - 90);
    ssCtx.fillText(`Coins: ${Game.coinsCollected}`, 25, gameCanvas.height - 70);
    ssCtx.fillText("Ride India. Feel India.", 25, gameCanvas.height - 40);

    document.getElementById("screenshot-overlay").classList.add("active");
}

// Daily rewards claim checks
function checkDailyReward() {
    const claimBtn = document.getElementById("btn-claim-daily");
    const statusText = document.getElementById("daily-reward-status");

    const todayStr = new Date().toDateString();
    if (State.dailyClaimTime === todayStr) {
        claimBtn.disabled = true;
        statusText.innerText = "Claimed! Back tomorrow.";
    } else {
        claimBtn.disabled = false;
        statusText.innerText = "Ready to claim 🪙 200!";
    }
}

let activeShopTab = "characters";

function switchShopTab(tab) {
    activeShopTab = tab;
    
    // Toggle active class on tab buttons
    document.querySelectorAll(".shop-tab").forEach(btn => btn.classList.remove("active"));
    
    const tabMap = {
        "characters": "tab-shop-characters",
        "vehicles": "tab-shop-vehicles",
        "boosts": "tab-shop-coin-boosts",
        "ads": "tab-shop-ads"
    };
    
    const activeBtn = document.getElementById(tabMap[tab]);
    if (activeBtn) activeBtn.classList.add("active");
    
    populateShopGrid();
}

function populateShopGrid() {
    const grid = document.querySelector(".shop-items-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    if (activeShopTab === "characters") {
        characters.forEach(c => {
            const isUnlocked = State.unlockedChars.includes(c.name);
            const isSelected = State.selectedChar === c.name;
            
            const card = document.createElement("div");
            card.className = "shop-card";
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3>${c.name} ${c.visual}</h3>
                    <span style="font-size:11px; opacity:0.8; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px;">RANK ${c.rank}</span>
                </div>
                <p>${c.desc}</p>
                <div style="font-size:10px; color:#aaa; margin: 4px 0;">Speed: ${c.speed}/10 | Control: ${c.control}/10 | Stamina: ${c.stamina}/10</div>
                <span class="cost">${isUnlocked ? (isSelected ? 'ACTIVE' : 'OWNED') : '🪙 ' + c.cost}</span>
                <button class="btn-buy-shop">${isUnlocked ? (isSelected ? 'EQUIPPED' : 'EQUIP') : 'UNLOCK'}</button>
            `;
            
            const btn = card.querySelector(".btn-buy-shop");
            if (isUnlocked) {
                if (isSelected) {
                    btn.disabled = true;
                    btn.style.opacity = "0.5";
                } else {
                    btn.onclick = () => {
                        State.selectedChar = c.name;
                        State.save();
                        populateShopGrid();
                        State.syncUI();
                    };
                }
            } else {
                btn.onclick = () => {
                    if (State.coins >= c.cost) {
                        State.coins -= c.cost;
                        State.unlockedChars.push(c.name);
                        State.save();
                        populateShopGrid();
                        State.syncUI();
                    } else {
                        alert("Not enough coins! Watch ads or claim rewards.");
                    }
                };
            }
            grid.appendChild(card);
        });
    } else if (activeShopTab === "vehicles") {
        vehicles.forEach(v => {
            const isUnlocked = State.unlockedVehicles.includes(v.name);
            const isSelected = State.selectedVehicle === v.name;
            
            const card = document.createElement("div");
            card.className = "shop-card";
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3>${v.name} ${v.visual}</h3>
                </div>
                <p>${v.desc}</p>
                <div style="font-size:10px; color:#aaa; margin: 4px 0;">Speed: ${v.speed}/10 | Control: ${v.control}/10 | Stamina: ${v.stamina}/10</div>
                <span class="cost">${isUnlocked ? (isSelected ? 'ACTIVE' : 'OWNED') : '🪙 ' + v.cost}</span>
                <button class="btn-buy-shop">${isUnlocked ? (isSelected ? 'EQUIPPED' : 'EQUIP') : 'UNLOCK'}</button>
            `;
            
            const btn = card.querySelector(".btn-buy-shop");
            if (isUnlocked) {
                if (isSelected) {
                    btn.disabled = true;
                    btn.style.opacity = "0.5";
                } else {
                    btn.onclick = () => {
                        State.selectedVehicle = v.name;
                        State.save();
                        populateShopGrid();
                        State.syncUI();
                    };
                }
            } else {
                btn.onclick = () => {
                    if (State.coins >= v.cost) {
                        State.coins -= v.cost;
                        State.unlockedVehicles.push(v.name);
                        State.save();
                        populateShopGrid();
                        State.syncUI();
                    } else {
                        alert("Not enough coins!");
                    }
                };
            }
            grid.appendChild(card);
        });
    } else if (activeShopTab === "boosts") {
        const boosts = [
            {
                name: "Double Coins Boost",
                desc: "Get 2x coins on all runs for 5 minutes!",
                costText: "🪙 250 Coins",
                btnText: "BUY BOOST",
                action: () => {
                    if (State.coins >= 250) {
                        State.coins -= 250;
                        const end = new Date();
                        end.setMinutes(end.getMinutes() + 5);
                        State.doubleCoinsEnd = end;
                        State.save();
                        State.syncUI();
                        alert("Double Coins multiplier activated for 5 minutes!");
                    } else {
                        alert("Not enough coins!");
                    }
                }
            },
            {
                name: "VIP Supporter Pack",
                desc: "Get 2000 coins instantly for testing!",
                costText: "🪙 0 Coins (Dev Test)",
                btnText: "CLAIM 2000",
                action: () => {
                    State.coins += 2000;
                    State.save();
                    State.syncUI();
                    alert("Claimed 2000 Dev Coins!");
                }
            }
        ];
        
        boosts.forEach(b => {
            const card = document.createElement("div");
            card.className = "shop-card";
            card.innerHTML = `
                <h3>${b.name}</h3>
                <p>${b.desc}</p>
                <span class="cost">${b.costText}</span>
                <button class="btn-buy-shop">${b.btnText}</button>
            `;
            card.querySelector(".btn-buy-shop").onclick = b.action;
            grid.appendChild(card);
        });
    } else if (activeShopTab === "ads") {
        const ads = [
            {
                name: "Double Coins Ad Boost",
                desc: "Watch a short ad to get 2x coins for 5 minutes!",
                costText: "🎁 Watch Ad",
                btnText: "WATCH AD",
                action: () => {
                    Ads.showRewarded(() => {
                        const end = new Date();
                        end.setMinutes(end.getMinutes() + 5);
                        State.doubleCoinsEnd = end;
                        State.save();
                        State.syncUI();
                        alert("Double Coins multiplier activated for 5 minutes!");
                    });
                }
            },
            {
                name: "Free Coins Pack",
                desc: "Watch an ad to get 500 bonus coins instantly!",
                costText: "🎁 Watch Ad",
                btnText: "WATCH AD",
                action: () => {
                    Ads.showRewarded(() => {
                        State.coins += 500;
                        State.save();
                        State.syncUI();
                        alert("Claimed 🪙 500 free coins!");
                    });
                }
            }
        ];
        
        ads.forEach(a => {
            const card = document.createElement("div");
            card.className = "shop-card";
            card.innerHTML = `
                <h3>${a.name}</h3>
                <p>${a.desc}</p>
                <span class="cost">${a.costText}</span>
                <button class="btn-buy-shop">${a.btnText}</button>
            `;
            card.querySelector(".btn-buy-shop").onclick = a.action;
            grid.appendChild(card);
        });
    }
}

// Share score card to WhatsApp link
function shareToWhatsApp() {
    const distanceKM = (Game.distance / 1000).toFixed(2);
    const vehicle = State.selectedVehicle;
    const char = State.selectedChar;
    
    const text = `*Ride India. Feel India!* 🛵🇮🇳\nI just scored *${distanceKM} KM* riding a *${vehicle}* as *${char}* in *ScootyKik*!\nCollected: 🪙 *${Game.coinsCollected} coins*\n\nCan you beat my score? Let's ride!`;
    const encoded = encodeURIComponent(text);
    
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
}

// --- INIT APP & BUTTON BINDINGS ---

window.addEventListener("DOMContentLoaded", () => {
    // Register PWA Service Worker
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("./service-worker.js")
                .then(reg => console.log("Service Worker registered successfully:", reg.scope))
                .catch(err => console.error("Service Worker registration failed:", err));
        });
    }

    // Scroll hack on load to hide URL bar
    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 100);

    // PWA Install Prompt variables
    let deferredPrompt = null;
    let installBannerShown = false;

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });

    // 30 seconds install prompt trigger
    setTimeout(() => {
        if (!installBannerShown) {
            const banner = document.getElementById("pwa-install-banner");
            if (banner) {
                banner.classList.add("active");
                installBannerShown = true;
            }
        }
    }, 30000);

    const btnInstall = document.getElementById("btn-pwa-install");
    if (btnInstall) {
        btnInstall.addEventListener("click", async () => {
            const banner = document.getElementById("pwa-install-banner");
            if (banner) banner.classList.remove("active");
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`PWA install prompt choice: ${outcome}`);
                deferredPrompt = null;
            } else {
                alert("To install ScootyKik:\n1. Tap the browser menu (three dots icon)\n2. Select 'Add to Home screen' or 'Install app'.");
            }
        });
    }

    const btnCloseInstall = document.getElementById("btn-pwa-close");
    if (btnCloseInstall) {
        btnCloseInstall.addEventListener("click", () => {
            const banner = document.getElementById("pwa-install-banner");
            if (banner) banner.classList.remove("active");
        });
    }

    State.load();
    checkDailyReward();
    Game.init("gameCanvas");

    // Add Swipe and Arrow bindings for Character and Vehicle Select
    const selectNextCharacter = () => {
        const currentIndex = characters.findIndex(c => c.name === activeShowcaseChar);
        const nextIndex = (currentIndex + 1) % characters.length;
        const cards = document.querySelectorAll("#character-list-container .item-card");
        if (cards[nextIndex]) {
            cards[nextIndex].click();
            cards[nextIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    };
    const selectPrevCharacter = () => {
        const currentIndex = characters.findIndex(c => c.name === activeShowcaseChar);
        const prevIndex = (currentIndex - 1 + characters.length) % characters.length;
        const cards = document.querySelectorAll("#character-list-container .item-card");
        if (cards[prevIndex]) {
            cards[prevIndex].click();
            cards[prevIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    };
    const selectNextVehicle = () => {
        const currentIndex = vehicles.findIndex(v => v.name === activeShowcaseVehicle);
        const nextIndex = (currentIndex + 1) % vehicles.length;
        const cards = document.querySelectorAll("#vehicle-list-container .item-card");
        if (cards[nextIndex]) {
            cards[nextIndex].click();
            cards[nextIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    };
    const selectPrevVehicle = () => {
        const currentIndex = vehicles.findIndex(v => v.name === activeShowcaseVehicle);
        const prevIndex = (currentIndex - 1 + vehicles.length) % vehicles.length;
        const cards = document.querySelectorAll("#vehicle-list-container .item-card");
        if (cards[prevIndex]) {
            cards[prevIndex].click();
            cards[prevIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    };

    // Button click listeners
    document.getElementById("char-prev-arrow").addEventListener("click", selectPrevCharacter);
    document.getElementById("char-next-arrow").addEventListener("click", selectNextCharacter);
    document.getElementById("vehicle-prev-arrow").addEventListener("click", selectPrevVehicle);
    document.getElementById("vehicle-next-arrow").addEventListener("click", selectNextVehicle);

    // Swipe listeners
    const addSwipeListener = (canvasId, onLeft, onRight) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        let startX = 0, startY = 0;
        canvas.addEventListener("touchstart", (e) => {
            if (e.touches && e.touches.length > 0) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
        }, { passive: true });
        canvas.addEventListener("touchend", (e) => {
            if (!e.changedTouches || e.changedTouches.length === 0) return;
            const diffX = e.changedTouches[0].clientX - startX;
            const diffY = e.changedTouches[0].clientY - startY;
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
                if (diffX < 0) onLeft();
                else onRight();
            }
        }, { passive: true });
    };

    addSwipeListener("charSelectCanvas", selectNextCharacter, selectPrevCharacter);
    addSwipeListener("vehicleSelectCanvas", selectNextVehicle, selectPrevVehicle);

    // Menu Navigate clicks
    document.getElementById("btn-character-select").addEventListener("click", () => {
        populateCharacterList();
        navigateTo("screen-character-select");
    });
    
    document.getElementById("btn-vehicle-select").addEventListener("click", () => {
        populateVehicleList();
        navigateTo("screen-vehicle-select");
    });

    document.getElementById("btn-city-select").addEventListener("click", () => {
        populateCityList();
        navigateTo("screen-city-select");
    });

    document.getElementById("btn-shop").addEventListener("click", () => {
        navigateTo("screen-shop");
        switchShopTab("characters");
    });

    // Back click options
    document.getElementById("char-back-btn").addEventListener("click", () => navigateTo("screen-main-menu"));
    document.getElementById("vehicle-back-btn").addEventListener("click", () => navigateTo("screen-main-menu"));
    document.getElementById("city-back-btn").addEventListener("click", () => navigateTo("screen-main-menu"));
    document.getElementById("shop-back-btn").addEventListener("click", () => navigateTo("screen-main-menu"));

    // Shop tab button listeners
    document.getElementById("tab-shop-characters").addEventListener("click", () => switchShopTab("characters"));
    document.getElementById("tab-shop-vehicles").addEventListener("click", () => switchShopTab("vehicles"));
    document.getElementById("tab-shop-coin-boosts").addEventListener("click", () => switchShopTab("boosts"));
    document.getElementById("tab-shop-ads").addEventListener("click", () => switchShopTab("ads"));

    // Action clicks
    const startRideBtn = document.getElementById("btn-start-ride");
    const launchGame = (e) => {
        try {
            if (e) e.preventDefault();
            
            // Initialize and unlock audio under user gesture
            AudioSys.init();
            if (AudioSys.ctx && AudioSys.ctx.state === "suspended") {
                AudioSys.ctx.resume();
            }
            
            navigateTo("screen-gameplay");
            Game.start();
        } catch (err) {
            console.error("Launch error:", err);
            alert("Error starting game: " + err.message);
        }
    };
    startRideBtn.addEventListener("touchstart", launchGame, {passive: false});
    startRideBtn.addEventListener("click", launchGame);

    document.getElementById("btn-claim-daily").addEventListener("click", () => {
        State.coins += 200;
        State.dailyClaimTime = new Date().toDateString();
        State.save();
        checkDailyReward();
        State.syncUI();
    });

    // Gameplay buttons
    document.getElementById("hud-btn-pause").addEventListener("click", () => {
        Game.isPaused = true;
        AudioSys.stopEngine();
        document.getElementById("pause-dist-val").innerText = (Game.distance / 1000).toFixed(2) + " KM";
        document.getElementById("pause-coins-val").innerText = Game.coinsCollected;
        document.getElementById("pause-overlay").classList.add("active");
    });

    document.getElementById("btn-resume").addEventListener("click", () => {
        Game.isPaused = false;
        document.getElementById("pause-overlay").classList.remove("active");
        AudioSys.startEngine(Game.vehicleData.name);
        AudioSys.startAmbient();
        requestAnimationFrame(() => Game.updateLoop());
    });

    document.getElementById("btn-quit").addEventListener("click", () => {
        Game.isPlaying = false;
        document.getElementById("pause-overlay").classList.remove("active");
        navigateTo("screen-main-menu");
    });

    document.getElementById("hud-btn-camera").addEventListener("click", () => {
        triggerScreenshot();
    });

    document.getElementById("btn-close-screenshot").addEventListener("click", () => {
        document.getElementById("screenshot-overlay").classList.remove("active");
    });

    // Game Over actions
    document.getElementById("btn-go-revive").addEventListener("click", () => {
        Ads.showRewarded(() => {
            Game.revive();
        });
    });

    document.getElementById("btn-go-share").addEventListener("click", () => {
        shareToWhatsApp();
    });

    document.getElementById("btn-go-restart").addEventListener("click", () => {
        document.getElementById("screen-game-over").classList.remove("active");
        navigateTo("screen-gameplay");
        Game.start();
    });

    document.getElementById("btn-go-home").addEventListener("click", () => {
        document.getElementById("screen-game-over").classList.remove("active");
        navigateTo("screen-main-menu");
    });

    // Fade out loading screen after 1.5 seconds and launch main menu
    setTimeout(() => {
        const loader = document.getElementById("screen-loading");
        if (loader) {
            loader.style.opacity = "0";
            loader.style.transition = "opacity 0.5s ease";
            setTimeout(() => {
                loader.classList.remove("active");
                navigateTo("screen-main-menu");
            }, 500);
        } else {
            navigateTo("screen-main-menu");
        }
    }, 1500);
});

// --- HIGH-FIDELITY VECTOR DRAWING HELPERS (3RD PERSON PERSPECTIVE VIEW FROM BEHIND) ---

function drawCoconutTree(ctx, x, y, scale) {
    if (scale <= 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Trunk (drawn curved slightly)
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#8B5A2B"; // Brown trunk
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-15, -60, -10, -120);
    ctx.stroke();

    // Leafy fronds (swaying with wind)
    ctx.fillStyle = "#228B22"; // Forest Green
    for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.translate(-10, -120);
        ctx.rotate((i * 60) * Math.PI / 180 + Math.sin(Date.now() * 0.0025 + i) * 0.06);
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Coconuts
    ctx.fillStyle = "#4B3621";
    ctx.beginPath();
    ctx.arc(-14, -114, 5, 0, Math.PI * 2);
    ctx.arc(-5, -114, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawBanyanTree(ctx, x, y, scale) {
    if (scale <= 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Thick main trunk
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#5A3825"; // Dark wood
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-5, -30, -10, -60);
    ctx.stroke();

    // Secondary branches
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-10, -50);
    ctx.quadraticCurveTo(-30, -70, -45, -90);
    ctx.moveTo(-10, -50);
    ctx.quadraticCurveTo(15, -70, 35, -85);
    ctx.moveTo(-10, -60);
    ctx.quadraticCurveTo(0, -85, -5, -110);
    ctx.stroke();

    // Hanging aerial roots
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = "rgba(139, 90, 43, 0.75)"; // Light brown roots
    ctx.beginPath();
    ctx.moveTo(-35, -80); ctx.lineTo(-35, -10);
    ctx.moveTo(-20, -70); ctx.lineTo(-20, 0);
    ctx.moveTo(15, -70);  ctx.lineTo(15, -5);
    ctx.moveTo(25, -75);  ctx.lineTo(25, -20);
    ctx.stroke();

    // Large leafy canopy (bunch of overlapping circles)
    ctx.fillStyle = "#1E5A22"; // Dark forest green
    ctx.beginPath();
    ctx.arc(-45, -100, 25, 0, Math.PI * 2);
    ctx.arc(35, -95, 25, 0, Math.PI * 2);
    ctx.arc(-15, -115, 30, 0, Math.PI * 2);
    ctx.arc(15, -110, 28, 0, Math.PI * 2);
    ctx.fill();

    // Highlight canopy layer
    ctx.fillStyle = "#277D33";
    ctx.beginPath();
    ctx.arc(-40, -105, 18, 0, Math.PI * 2);
    ctx.arc(30, -100, 18, 0, Math.PI * 2);
    ctx.arc(-10, -120, 22, 0, Math.PI * 2);
    ctx.arc(10, -115, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawElectricPole(ctx, x, y, scale) {
    if (scale <= 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Main concrete pillar
    ctx.fillStyle = "#95A5A6"; 
    ctx.fillRect(-3, -140, 6, 140);

    // Metallic crossbars
    ctx.fillStyle = "#7F8C8D";
    ctx.fillRect(-28, -128, 56, 4);

    // Glass/porcelain insulators
    ctx.fillStyle = "#ECF0F1";
    ctx.fillRect(-24, -133, 5, 5);
    ctx.fillRect(-2, -133, 5, 5);
    ctx.fillRect(20, -133, 5, 5);

    // Hanging electrical wire links
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(-22, -128);
    ctx.quadraticCurveTo(-100, -90, -220, -128);
    ctx.moveTo(22, -128);
    ctx.quadraticCurveTo(100, -90, 220, -128);
    ctx.stroke();

    ctx.restore();
}

function drawRoadsideShop(ctx, x, y, scale, subType) {
    if (scale <= 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (subType === "wall_painting") {
        // Render a brick wall with wall painting in regional scripts
        ctx.fillStyle = "#8B4513"; // Brick color base
        ctx.fillRect(-40, -40, 80, 40);
        
        // Draw brick pattern lines
        ctx.strokeStyle = "#A0522D";
        ctx.lineWidth = 1;
        for (let row = -35; row <= -5; row += 8) {
            ctx.beginPath();
            ctx.moveTo(-40, row);
            ctx.lineTo(40, row);
            ctx.stroke();
        }

        // Painting plaque/billboard
        ctx.fillStyle = "#E74C3C"; // Red background
        ctx.fillRect(-30, -32, 60, 24);
        ctx.strokeStyle = "#FFFF00"; // Yellow frame
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-30, -32, 60, 24);

        // Select regional text based on coordinates
        const texts = [
            "శుభ యాత్ర",   // Telugu "Happy Journey"
            "இனிதே பயணம்", // Tamil "Sweet Journey"
            "శుభం",       // Telugu "Auspicious"
            "நல்வரவு",    // Tamil "Welcome"
            "ಕನ್ನಡ ನಾಡು",  // Kannada "Kannada Land"
            "जय हिन्द"     // Hindi "Victory to India"
        ];
        const text = texts[Math.abs(Math.floor(x + y)) % texts.length];

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 0, -20);

    } else if (subType === "dhaba") {
        // Roadside Dhaba
        ctx.fillStyle = "#8E603E"; // Mud wall
        ctx.fillRect(-35, -45, 70, 45);

        // Open dining area
        ctx.fillStyle = "#2D1D16";
        ctx.fillRect(-22, -32, 44, 32);

        // Thatched Straw Roof
        ctx.fillStyle = "#D2B48C"; // Straw light brown
        ctx.beginPath();
        ctx.moveTo(-42, -45);
        ctx.lineTo(42, -45);
        ctx.lineTo(32, -58);
        ctx.lineTo(-32, -58);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#8B7355";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Draw straw texture lines
        ctx.strokeStyle = "#EEDD82";
        ctx.lineWidth = 1.5;
        for (let i = -30; i <= 30; i += 10) {
            ctx.beginPath();
            ctx.moveTo(i, -45);
            ctx.lineTo(i * 0.8, -58);
            ctx.stroke();
        }

        // Small bench (charpai) outline on sides
        ctx.fillStyle = "#A0522D"; // wood
        ctx.fillRect(-45, -8, 10, 8); // Left cot
        ctx.fillRect(35, -8, 10, 8);  // Right cot

        // Signboard
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(-24, -25, 48, 11);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-24, -25, 48, 11);
        ctx.fillStyle = "#E74C3C";
        ctx.font = "bold 6px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("DHABA 🌾", 0, -18);

    } else if (subType === "pan_shop") {
        // Pan shop kiosk
        ctx.fillStyle = "#2E4053"; // Steel body
        ctx.fillRect(-28, -48, 56, 48);

        // Window/counter opening
        ctx.fillStyle = "#17202A";
        ctx.fillRect(-20, -38, 40, 26);

        // Kiosk awning
        ctx.fillStyle = "#FF5733"; // Orange awning
        ctx.beginPath();
        ctx.moveTo(-32, -48);
        ctx.lineTo(32, -48);
        ctx.lineTo(24, -36);
        ctx.lineTo(-24, -36);
        ctx.closePath();
        ctx.fill();

        // Hanging sachet packets (small colorful rects)
        const colors = ["#28B463", "#F4D03F", "#C0392B", "#5DADE2"];
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = colors[i];
            ctx.fillRect(-18 + i * 10, -32, 6, 12);
        }

        // Counter with small jars
        ctx.fillStyle = "#85929E";
        ctx.fillRect(-22, -12, 44, 12);

        // Signboard
        ctx.fillStyle = "#1E8449";
        ctx.fillRect(-18, -60, 36, 11);
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-18, -60, 36, 11);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 5.5px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PAN MAHAL", 0, -53);

    } else {
        // Tea Stall / Tapri (default)
        ctx.fillStyle = "#3E2723"; // Wood frame
        ctx.fillRect(-32, -46, 64, 46);

        ctx.fillStyle = "#000000";
        ctx.fillRect(-22, -32, 44, 32);

        // Counter
        ctx.fillStyle = "#8D6E63";
        ctx.fillRect(-25, -12, 50, 12);

        // Tea Kettle silhouette on counter
        ctx.fillStyle = "#B0BEC5"; // Silver
        ctx.fillRect(10, -19, 8, 7); // kettle body
        ctx.fillRect(8, -17, 2, 2);   // spout

        // Awning
        ctx.fillStyle = "#1A5276"; // Blue awning
        ctx.beginPath();
        ctx.moveTo(-36, -46);
        ctx.lineTo(36, -46);
        ctx.lineTo(28, -32);
        ctx.lineTo(-28, -32);
        ctx.closePath();
        ctx.fill();

        // Signboard
        ctx.fillStyle = "#F39C12";
        ctx.fillRect(-20, -58, 40, 11);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-20, -58, 40, 11);
        ctx.fillStyle = "#000";
        ctx.font = "bold 6px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("CHAI TAPRI ☕", 0, -50);
    }

    ctx.restore();
}

function drawTempleGopuram(ctx, x, y, scale) {
    if (scale <= 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const tiers = 6;
    let width = 75;
    const height = 18;

    ctx.fillStyle = "#F5B041"; // Gopuram Terracotta Gold
    ctx.strokeStyle = "#D35400";
    ctx.lineWidth = 1.2;

    for (let i = 0; i < tiers; i++) {
        const ty = -i * height;
        const tw = width - (i * 10);
        
        ctx.beginPath();
        ctx.rect(-tw/2, ty - height, tw, height);
        ctx.fill();
        ctx.stroke();

        // Architectural details (notches, statues) - LOD Optimized
        if (scale > 0.15) {
            ctx.fillStyle = "#E59866";
            for (let j = -tw/2 + 6; j < tw/2; j += 10) {
                ctx.fillRect(j, ty - height + 4, 5, height - 8);
            }
            ctx.fillStyle = "#F5B041";
        }
    }

    // Top Kalasams
    const topY = -tiers * height;
    ctx.fillStyle = "#D35400";
    ctx.beginPath();
    ctx.moveTo(-8, topY);
    ctx.lineTo(0, topY - 14);
    ctx.lineTo(8, topY);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawIndianTruck(ctx, x, y, scale) {
    if (scale <= 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Wheels
    ctx.fillStyle = "#1A1A1A";
    ctx.fillRect(-22, -8, 8, 8);
    ctx.fillRect(14, -8, 8, 8);

    // Mudguard flaps
    ctx.fillStyle = "#000000";
    ctx.fillRect(-24, 0, 10, 8);
    ctx.fillRect(14, 0, 10, 8);

    // Big rectangular rear container box (decorated cargo truck)
    ctx.fillStyle = "#E74C3C"; // Saffron Red
    ctx.fillRect(-26, -55, 52, 48);

    ctx.strokeStyle = "#F1C40F"; // Yellow framing
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-26, -55, 52, 48);

    // Color strips
    ctx.fillStyle = "#2ECC71"; // Green band
    ctx.fillRect(-24, -46, 48, 6);
    ctx.fillStyle = "#3498DB"; // Blue band
    ctx.fillRect(-24, -25, 48, 6);

    // Glowing tail lamps
    ctx.fillStyle = "#E74C3C"; 
    ctx.fillRect(-22, -15, 6, 4);
    ctx.fillRect(16, -15, 6, 4);
    ctx.fillStyle = "#F39C12";
    ctx.fillRect(-15, -15, 4, 4);
    ctx.fillRect(11, -15, 4, 4);

    // Indian Registration License Plate & Horn OK Please details - LOD Optimized
    if (scale > 0.15) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-12, -13, 24, 8);
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 0.6;
        ctx.strokeRect(-12, -13, 24, 8);
        ctx.fillStyle = "#000";
        ctx.font = "bold 5.5px Courier";
        ctx.textAlign = "center";
        ctx.fillText("MH 12 Q 3381", 0, -7);

        // Classic Sign: "HORN OK PLEASE"
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(-20, -36, 40, 9);
        ctx.strokeStyle = "#D35400";
        ctx.strokeRect(-20, -36, 40, 9);

        ctx.fillStyle = "#D35400";
        ctx.font = "bold 5.5px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("HORN  OK  PLEASE", 0, -29);
    } else {
        // Flat placeholder color for details when far away
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(-20, -36, 40, 9);
    }

    ctx.restore();
}

function drawIndianAuto(ctx, x, y, scale) {
    if (scale <= 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Tires
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(-15, -6, 5, 6);
    ctx.fillRect(10, -6, 5, 6);

    // Lower green body
    ctx.fillStyle = "#1E8449"; // Indian Rickshaw Green
    ctx.fillRect(-16, -26, 32, 20);

    // Top Yellow Canopy
    ctx.fillStyle = "#F4D03F"; // Saffron Yellow
    ctx.beginPath();
    ctx.moveTo(-16, -26);
    ctx.lineTo(-12, -45);
    ctx.lineTo(12, -45);
    ctx.lineTo(16, -26);
    ctx.closePath();
    ctx.fill();

    // Dark cabin back window
    ctx.fillStyle = "#1b2631"; 
    ctx.beginPath();
    ctx.moveTo(-11, -29);
    ctx.lineTo(-8, -41);
    ctx.lineTo(8, -41);
    ctx.lineTo(11, -29);
    ctx.closePath();
    ctx.fill();

    // Driver/Passenger head silhouette inside - LOD Optimized
    if (scale > 0.15) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(0, -33, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Lights
    ctx.fillStyle = "#E74C3C";
    ctx.fillRect(-14, -12, 4, 4);
    ctx.fillRect(10, -12, 4, 4);
    ctx.fillStyle = "#F39C12";
    ctx.fillRect(-14, -8, 4, 3);
    ctx.fillRect(10, -8, 4, 3);

    // Licence plate - LOD Optimized
    if (scale > 0.15) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-8, -13, 16, 7);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-8, -13, 16, 7);
        ctx.fillStyle = "#000000";
        ctx.font = "bold 4.5px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("DL 1R A 1912", 0, -8);
    } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-6, -12, 12, 5);
    }

    ctx.restore();
}

function drawMotorcycleObstacle(ctx, x, y, scale) {
    if (scale <= 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Rear Tire
    ctx.fillStyle = "#1C1D1F";
    ctx.fillRect(-3, -3, 6, 22);

    // Mudguard
    ctx.fillStyle = "#222";
    ctx.fillRect(-5, -12, 10, 10);

    // License Plate (Karnataka KA commuter look) - LOD Optimized
    if (scale > 0.15) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-7, -1, 14, 8);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-7, -1, 14, 8);
        ctx.fillStyle = "#000";
        ctx.font = "bold 3.5px Courier";
        ctx.textAlign = "center";
        ctx.fillText("KA 03", 0, 2);
        ctx.fillText("EX 4567", 0, 5);
    } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-5, 0, 10, 5);
    }

    // Exhaust pipe (silencer) on the right side
    ctx.fillStyle = "#555";
    ctx.fillRect(4, 2, 3, 12);
    if (scale > 0.15) {
        ctx.fillStyle = "#CCC"; // chrome tip
        ctx.fillRect(4, 12, 3, 2);
    }

    // Chassis frame and tail light
    ctx.fillStyle = "#C0392B"; // Red commuter bike
    ctx.fillRect(-6, -20, 12, 8);
    ctx.fillStyle = "#E74C3C"; // red lens
    ctx.fillRect(-4, -20, 8, 3);

    // Indicator lights - LOD Optimized
    if (scale > 0.15) {
        ctx.fillStyle = "#FF9800";
        ctx.fillRect(-8, -19, 2, 2);
        ctx.fillRect(6, -19, 2, 2);
    }

    // Rider Torso (back view)
    ctx.fillStyle = "#34495E"; // Dark blue jacket
    ctx.beginPath();
    ctx.moveTo(-9, -20);
    ctx.lineTo(9, -20);
    ctx.lineTo(6, -34);
    ctx.lineTo(-6, -34);
    ctx.closePath();
    ctx.fill();

    // Rider Helmet (back view)
    ctx.fillStyle = "#E67E22"; // Orange helmet
    ctx.beginPath();
    ctx.arc(0, -39, 5, 0, Math.PI * 2);
    ctx.fill();
    // Visor border
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-5, -38);
    ctx.lineTo(5, -38);
    ctx.stroke();

    ctx.restore();
}

function drawCow(ctx, x, y, scale) {
    if (scale <= 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // White body
    ctx.fillStyle = "#F9EBEA";
    ctx.beginPath();
    ctx.ellipse(0, -20, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark patches - LOD Optimized
    if (scale > 0.15) {
        ctx.fillStyle = "#2C3E50";
        ctx.beginPath();
        ctx.arc(-7, -22, 5, 0, Math.PI * 2);
        ctx.arc(5, -18, 4, 0, Math.PI * 2);
        ctx.arc(1, -24, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Legs
    ctx.strokeStyle = "#F9EBEA";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, -10); ctx.lineTo(-10, 0);
    ctx.moveTo(-4, -10);  ctx.lineTo(-4, 0);
    ctx.moveTo(4, -10);   ctx.lineTo(4, 0);
    ctx.moveTo(10, -10);  ctx.lineTo(10, 0);
    ctx.stroke();

    // Head
    ctx.fillStyle = "#F9EBEA";
    ctx.beginPath();
    ctx.ellipse(-18, -25, 6, 8, Math.PI/6, 0, Math.PI * 2);
    ctx.fill();

    // Horns - LOD Optimized
    if (scale > 0.15) {
        ctx.strokeStyle = "#BDC3C7";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-20, -30);
        ctx.quadraticCurveTo(-24, -36, -21, -38);
        ctx.moveTo(-16, -30);
        ctx.quadraticCurveTo(-14, -36, -11, -38);
        ctx.stroke();
    }

    // Tail - LOD Optimized
    if (scale > 0.15) {
        ctx.strokeStyle = "#F9EBEA";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(14, -20);
        ctx.quadraticCurveTo(18, -10, 15, 0);
        ctx.stroke();
    }

    ctx.restore();
}

function drawPothole(ctx, x, y, scale) {
    if (scale <= 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Pit dark ellipse
    ctx.fillStyle = "#282828";
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rough cracked border
    ctx.strokeStyle = "#4B4B4B";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 9, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Shiny cyan water ripple inside
    ctx.strokeStyle = "#80DEEA";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.ellipse(0, 0, 10 + Math.sin(Date.now() * 0.006) * 4, 4 + Math.sin(Date.now() * 0.006) * 1.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}

function drawPlayerVehicleAndRider(ctx, x, y, scale, vehicleName, charName, isBoosting, leanAngle) {
    ctx.save();
    ctx.translate(x, y);
    if (leanAngle) {
        ctx.rotate(leanAngle);
    }
    ctx.scale(scale, scale);

    // Engine vibration bounce
    const vibr = isBoosting ? Math.sin(Date.now() * 0.085) * 2.2 : Math.sin(Date.now() * 0.045) * 1.2;
    ctx.translate(0, vibr);

    let bodyColor = "#F1C40F"; // Scooty yellow
    if (vehicleName === "Bike") bodyColor = "#C0392B"; // Royal Red
    else if (vehicleName === "Auto Rickshaw") bodyColor = "#1E8449"; // Rickshaw Green
    else if (vehicleName === "Race Car") bodyColor = "#2980B9"; // Racing Blue
    else if (vehicleName === "Cycle") bodyColor = "#27AE60"; // Classic Cycle green

    if (vehicleName === "Scooty") {
        // Rear wheel
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(-8, 5, 16, 25);

        // Underframe mudguard
        ctx.fillStyle = "#5d6d7e";
        ctx.fillRect(-12, -4, 24, 18);

        // Licence Plate (Yellow TN Plate)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-14, 10, 28, 12);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-14, 10, 28, 12);
        ctx.fillStyle = "#000";
        ctx.font = "bold 5px Courier";
        ctx.textAlign = "center";
        ctx.fillText("TN 09", 0, 15);
        ctx.fillText("CY 2685", 0, 20);

        // Body shell
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, -9, 18, 0, Math.PI, true);
        ctx.lineTo(-18, 5);
        ctx.lineTo(18, 5);
        ctx.closePath();
        ctx.fill();

        // Signals
        ctx.fillStyle = "#FFB300";
        ctx.fillRect(-18, -9, 4, 5);
        ctx.fillRect(14, -9, 4, 5);

        // Tail light
        ctx.fillStyle = isBoosting ? "#FF3D00" : "#E74C3C";
        ctx.beginPath();
        ctx.arc(0, -9, 6, 0, Math.PI * 2);
        ctx.fill();

        // Mirrors & handle bar
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-25, -34);
        ctx.lineTo(25, -34);
        ctx.stroke();

        ctx.fillStyle = "#2c3e50";
        ctx.beginPath();
        ctx.ellipse(-26, -41, 6, 4, Math.PI/6, 0, Math.PI * 2);
        ctx.ellipse(26, -41, 6, 4, -Math.PI/6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-22, -34); ctx.lineTo(-24, -38);
        ctx.moveTo(22, -34);  ctx.lineTo(24, -38);
        ctx.stroke();

    } else if (vehicleName === "Bike") {
        // Rear tire
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(-9, -4, 18, 33);

        // Exhaust pipe silencer
        ctx.fillStyle = "#7f8c8d";
        ctx.fillRect(9, 4, 6, 21);
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(12, 24, 3, 0, Math.PI*2);
        ctx.fill();

        // License Plate
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-12, 9, 24, 10);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-12, 9, 24, 10);
        ctx.fillStyle = "#000";
        ctx.font = "bold 5px Courier";
        ctx.textAlign = "center";
        ctx.fillText("AP 39", 0, 13);
        ctx.fillText("JV 0987", 0, 17);

        // Chassis Frame
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(-11, -21);
        ctx.lineTo(11, -21);
        ctx.lineTo(7, 2);
        ctx.lineTo(-7, 2);
        ctx.closePath();
        ctx.fill();

        // Taillight
        ctx.fillStyle = "#E74C3C";
        ctx.fillRect(-6, -21, 12, 5);

        // Mirrors
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-28, -37);
        ctx.lineTo(28, -37);
        ctx.stroke();

        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(-26, -44, 5, 0, Math.PI * 2);
        ctx.arc(26, -44, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-22, -37); ctx.lineTo(-24, -41);
        ctx.moveTo(22, -37);  ctx.lineTo(24, -41);
        ctx.stroke();

    } else if (vehicleName === "Auto Rickshaw") {
        drawIndianAuto(ctx, 0, 14, 1.25);
    } else if (vehicleName === "Race Car") {
        // Wide Tires
        ctx.fillStyle = "#1C2833";
        ctx.fillRect(-35, -5, 12, 26);
        ctx.fillRect(23, -5, 12, 26);

        // Low profile chassis body
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-28, -12, 56, 18);
        
        // Cabin canopy
        ctx.fillStyle = "#2c3e50";
        ctx.beginPath();
        ctx.moveTo(-15, -12);
        ctx.lineTo(-10, -28);
        ctx.lineTo(10, -28);
        ctx.lineTo(15, -12);
        ctx.closePath();
        ctx.fill();

        // Large high spoiler wing
        ctx.fillStyle = "#111";
        ctx.fillRect(-36, -32, 72, 6);
        ctx.fillRect(-28, -32, 4, 20);
        ctx.fillRect(24, -32, 4, 20);

        // LED tail lights
        ctx.fillStyle = "#E74C3C";
        ctx.fillRect(-25, -9, 12, 3);
        ctx.fillRect(13, -9, 12, 3);

    } else if (vehicleName === "Cycle") {
        // Cycle slim wheel
        ctx.fillStyle = "#1A252C";
        ctx.fillRect(-2, -4, 4, 28);

        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(0, -24);
        ctx.lineTo(0, 10);
        ctx.stroke();

        ctx.fillStyle = "#D35400";
        ctx.beginPath();
        ctx.arc(0, -17, 3, 0, Math.PI*2);
        ctx.fill();

        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-17, -31);
        ctx.lineTo(17, -31);
        ctx.stroke();
    }

    // Torso and clothes
    if (vehicleName !== "Auto Rickshaw") {
        let shirtColor = "#F5B041";
        let hasTurban = false;
        let turbanColor = "#E67E22";
        let isSweater = false;
        let hasBackpack = false;

        if (charName.includes("Punjabi")) {
            shirtColor = "#2C3E50"; // Dark blue Kurta
            hasTurban = true;
            turbanColor = charName.includes("Royal") ? "#800020" : "#D35400";
        } else if (charName.includes("Village") || charName.includes("Farmer")) {
            shirtColor = "#FFFFFF"; // Traditional White veshti shirt
            isSweater = true; // Draw standard towel
        } else if (charName.includes("Street")) {
            shirtColor = "#2C3E50"; // Hoodie
            isSweater = false;
        } else if (charName.includes("Royal")) {
            shirtColor = "#D4AF37"; // Golden silk
        } else if (charName.includes("Backpacker")) {
            shirtColor = "#16A085"; // Teal shirt
            hasBackpack = true;
        }

        // Torso back drawing
        ctx.fillStyle = shirtColor;
        ctx.beginPath();
        ctx.moveTo(-13, -15);
        ctx.lineTo(13, -15);
        ctx.lineTo(9, -32);
        ctx.lineTo(-9, -32);
        ctx.closePath();
        ctx.fill();

        // Towel decoration
        if (isSweater) {
            ctx.fillStyle = charName.includes("Farmer") ? "#C0392B" : "#27AE60"; // red/green towel
            ctx.fillRect(-9, -32, 4.5, 17);
        } else if (hasBackpack) {
            ctx.fillStyle = "#8E44AD";
            ctx.fillRect(-7, -29, 14, 13);
            ctx.strokeStyle = "#6C3483";
            ctx.strokeRect(-7, -29, 14, 13);
        }

        // Head shape
        if (hasTurban) {
            ctx.fillStyle = turbanColor;
            ctx.beginPath();
            ctx.arc(0, -41, 7.5, 0, Math.PI * 2);
            ctx.arc(-4, -41, 6.5, 0, Math.PI * 2);
            ctx.arc(4, -41, 6.5, 0, Math.PI * 2);
            ctx.fill();
            // Kalgi pin
            ctx.fillStyle = "#F1C40F";
            ctx.beginPath();
            ctx.arc(0, -45, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Shiny dark blue helmet
            ctx.fillStyle = "#1F618D";
            ctx.beginPath();
            ctx.arc(0, -40, 7, 0, Math.PI * 2);
            ctx.fill();
            // Visor
            ctx.strokeStyle = "#111";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-7, -39);
            ctx.lineTo(7, -39);
            ctx.stroke();
        }

        // Arms holding handles
        ctx.strokeStyle = shirtColor;
        ctx.lineWidth = 4.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-9, -28);
        ctx.lineTo(-19, -34);
        ctx.moveTo(9, -28);
        ctx.lineTo(19, -34);
        ctx.stroke();
    }

    ctx.restore();
}

function drawStandingRider(ctx, x, y, scale, charName) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Feet
    ctx.fillStyle = "#111111";
    ctx.fillRect(-8, -3, 6, 4); // Left foot
    ctx.fillRect(2, -3, 6, 4);  // Right foot

    let pantsColor = "#34495E"; // Default dark pants
    let isDhoti = false;
    let shirtColor = "#F5B041";
    let hasTurban = false;
    let turbanColor = "#E67E22";
    let hasTowel = false;
    let towelColor = "#27AE60";
    let hasBackpack = false;
    let hasCrown = false;

    if (charName.includes("Punjabi")) {
        pantsColor = "#EAECEE"; // light pajama
        shirtColor = "#2C3E50"; // Dark blue Kurta
        hasTurban = true;
        turbanColor = charName.includes("Royal") ? "#800020" : "#D35400";
    } else if (charName.includes("Village") || charName.includes("Farmer")) {
        isDhoti = true;
        shirtColor = "#FFFFFF"; // traditional white
        hasTowel = true;
        towelColor = charName.includes("Farmer") ? "#C0392B" : "#27AE60";
    } else if (charName.includes("Street")) {
        shirtColor = "#2C3E50"; // hoodie
        pantsColor = "#1B2631";
    } else if (charName.includes("Royal")) {
        shirtColor = "#D4AF37"; // gold
        pantsColor = "#7B241C"; // maroon
        if (charName.includes("Look")) hasCrown = true;
    } else if (charName.includes("Backpacker")) {
        shirtColor = "#16A085"; // teal
        pantsColor = "#566573";
        hasBackpack = true;
    } else if (charName.includes("Casual")) {
        shirtColor = "#EC7063"; // salmon
        pantsColor = "#2E4053";
    } else if (charName.includes("Youngster")) {
        shirtColor = "#2E86C1"; // blue
        pantsColor = "#1C2833";
    }

    if (isDhoti) {
        // White Dhoti/Veshti
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(-10, -25);
        ctx.lineTo(10, -25);
        ctx.lineTo(8, -2);
        ctx.lineTo(-8, -2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#BDC3C7";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dhoti gold border (Kari)
        ctx.fillStyle = "#D4AF37";
        ctx.fillRect(-2, -25, 4, 23);
    } else {
        // Pants legs
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-7, -25, 5, 23); // Left leg
        ctx.fillRect(2, -25, 5, 23);  // Right leg
    }

    // Torso (Shirt)
    ctx.fillStyle = shirtColor;
    ctx.beginPath();
    ctx.moveTo(-12, -45);
    ctx.lineTo(12, -45);
    ctx.lineTo(9, -25);
    ctx.lineTo(-9, -25);
    ctx.closePath();
    ctx.fill();

    // Backpack straps on front chest
    if (hasBackpack) {
        ctx.fillStyle = "#8E44AD";
        // Straps
        ctx.fillRect(-8, -42, 2.5, 17);
        ctx.fillRect(5.5, -42, 2.5, 17);
    }

    // Arms
    ctx.strokeStyle = shirtColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    // Arms on hip
    ctx.beginPath();
    ctx.moveTo(-11, -43);
    ctx.lineTo(-16, -34);
    ctx.lineTo(-8, -28);
    ctx.moveTo(11, -43);
    ctx.lineTo(16, -34);
    ctx.lineTo(8, -28);
    ctx.stroke();

    // Towel
    if (hasTowel) {
        ctx.fillStyle = towelColor;
        ctx.fillRect(-10, -45, 4.5, 16);
    }

    // Head (Skin tone)
    ctx.fillStyle = "#FADBD8"; // Skin tone
    ctx.beginPath();
    ctx.arc(0, -52, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(-2.5, -53, 1, 0, Math.PI * 2);
    ctx.arc(2.5, -53, 1, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = "#E74C3C";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(0, -50, 2, 0, Math.PI);
    ctx.stroke();

    // Hair or Headwear
    if (hasTurban) {
        ctx.fillStyle = turbanColor;
        ctx.beginPath();
        ctx.arc(0, -56, 8, 0, Math.PI * 2);
        ctx.arc(-4, -55, 6, 0, Math.PI * 2);
        ctx.arc(4, -55, 6, 0, Math.PI * 2);
        ctx.fill();

        // Kalgi jewel
        ctx.fillStyle = "#F1C40F";
        ctx.beginPath();
        ctx.arc(0, -60, 2.5, 0, Math.PI * 2);
        ctx.fill();
    } else if (hasCrown) {
        ctx.fillStyle = "#D4AF37";
        ctx.beginPath();
        ctx.moveTo(-7, -57);
        ctx.lineTo(-5, -64);
        ctx.lineTo(-1, -59);
        ctx.lineTo(0, -66);
        ctx.lineTo(1, -59);
        ctx.lineTo(5, -64);
        ctx.lineTo(7, -57);
        ctx.closePath();
        ctx.fill();
    } else if (charName.includes("Street")) {
        // Dark hoodie cover
        ctx.fillStyle = "#34495E";
        ctx.beginPath();
        ctx.arc(0, -54, 8, 0, Math.PI * 2);
        ctx.fill();
        // Inner face mask reveal
        ctx.fillStyle = "#1C2833";
        ctx.beginPath();
        ctx.arc(0, -51, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF"; // eyes
        ctx.fillRect(-2, -52, 1, 1);
        ctx.fillRect(1, -52, 1, 1);
    } else {
        // Default black hair
        ctx.fillStyle = "#2C3E50";
        ctx.beginPath();
        ctx.arc(0, -56, 7.5, 0, Math.PI, true);
        ctx.fill();
    }

    ctx.restore();
}

function drawVehicleAtAngle(ctx, x, y, scale, vehicleName) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const vibr = Math.sin(Date.now() * 0.04) * 1.0;
    ctx.translate(0, vibr);

    let bodyColor = "#FFD700"; // Yellow default
    if (vehicleName === "Bike") bodyColor = "#C0392B"; // Red
    else if (vehicleName === "Auto Rickshaw") bodyColor = "#1E8449"; // Green
    else if (vehicleName === "Race Car") bodyColor = "#2980B9"; // Blue
    else if (vehicleName === "Cycle") bodyColor = "#27AE60"; // Green

    if (vehicleName === "Scooty") {
        // Wheels
        ctx.fillStyle = "#1C1D1F";
        ctx.beginPath();
        ctx.ellipse(-22, 10, 8, 14, Math.PI/6, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(20, 15, 8, 14, Math.PI/6, 0, Math.PI*2);
        ctx.fill();

        // Floorboard
        ctx.fillStyle = "#2C3E50";
        ctx.beginPath();
        ctx.moveTo(-20, 2);
        ctx.lineTo(15, 8);
        ctx.lineTo(10, 15);
        ctx.lineTo(-24, 8);
        ctx.closePath();
        ctx.fill();

        // Front shield body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(10, 8);
        ctx.lineTo(25, -20);
        ctx.lineTo(18, -32);
        ctx.lineTo(0, -6);
        ctx.closePath();
        ctx.fill();

        // Headlight
        ctx.fillStyle = "#FFFFCC";
        ctx.beginPath();
        ctx.ellipse(22, -26, 4, 6, -Math.PI/6, 0, Math.PI*2);
        ctx.fill();

        // Rear cover
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(-25, 2);
        ctx.lineTo(-8, 5);
        ctx.lineTo(-4, -14);
        ctx.lineTo(-20, -18);
        ctx.closePath();
        ctx.fill();

        // Black seat
        ctx.fillStyle = "#1E272C";
        ctx.beginPath();
        ctx.moveTo(-20, -18);
        ctx.lineTo(-4, -14);
        ctx.lineTo(5, -8);
        ctx.lineTo(-8, -11);
        ctx.closePath();
        ctx.fill();

        // Handlebars
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(15, -28);
        ctx.lineTo(8, -34);
        ctx.moveTo(15, -28);
        ctx.lineTo(24, -31);
        ctx.stroke();

    } else if (vehicleName === "Bike") {
        // Wheels
        ctx.fillStyle = "#1C1D1F";
        ctx.beginPath();
        ctx.ellipse(-24, 12, 9, 16, Math.PI/6, 0, Math.PI*2);
        ctx.ellipse(24, 16, 9, 16, Math.PI/6, 0, Math.PI*2);
        ctx.fill();

        // Spokes
        ctx.strokeStyle = "#BDC3C7";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-24, 12); ctx.lineTo(-24, 25);
        ctx.moveTo(24, 16); ctx.lineTo(24, 30);
        ctx.stroke();

        // Engine
        ctx.fillStyle = "#566573";
        ctx.fillRect(-10, -5, 20, 16);

        // Exhaust
        ctx.fillStyle = "#95A5A6";
        ctx.fillRect(-15, 6, 26, 6);

        // Tank
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(-2, -15, 14, 8, -Math.PI/12, 0, Math.PI*2);
        ctx.fill();

        // Seats
        ctx.fillStyle = "#1C2833";
        ctx.fillRect(-18, -17, 12, 6);

        // Fork
        ctx.strokeStyle = "#2C3E50";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(24, 16);
        ctx.lineTo(15, -28);
        ctx.stroke();

        ctx.fillStyle = "#F1C40F";
        ctx.beginPath();
        ctx.arc(17, -25, 4, 0, Math.PI*2);
        ctx.fill();

    } else if (vehicleName === "Auto Rickshaw") {
        // Wheels
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.ellipse(-18, 15, 8, 14, Math.PI/6, 0, Math.PI*2);
        ctx.ellipse(10, 18, 8, 14, Math.PI/6, 0, Math.PI*2);
        ctx.ellipse(18, 5, 6, 11, Math.PI/6, 0, Math.PI*2);
        ctx.fill();

        // Green bottom
        ctx.fillStyle = "#1E8449";
        ctx.beginPath();
        ctx.moveTo(-22, 10);
        ctx.lineTo(12, 14);
        ctx.lineTo(20, -5);
        ctx.lineTo(15, -15);
        ctx.lineTo(-20, -15);
        ctx.closePath();
        ctx.fill();

        // Yellow top
        ctx.fillStyle = "#F4D03F";
        ctx.beginPath();
        ctx.moveTo(-20, -15);
        ctx.lineTo(15, -15);
        ctx.lineTo(8, -38);
        ctx.lineTo(-14, -38);
        ctx.closePath();
        ctx.fill();

        // Cabin dark
        ctx.fillStyle = "#1A252F";
        ctx.beginPath();
        ctx.moveTo(-14, -15);
        ctx.lineTo(10, -15);
        ctx.lineTo(6, -32);
        ctx.lineTo(-10, -32);
        ctx.closePath();
        ctx.fill();

        // Light
        ctx.fillStyle = "#FFFF99";
        ctx.beginPath();
        ctx.arc(20, -7, 4, 0, Math.PI*2);
        ctx.fill();

    } else if (vehicleName === "Race Car") {
        // Wheels
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.ellipse(-26, 12, 11, 18, Math.PI/6, 0, Math.PI*2);
        ctx.ellipse(26, 18, 11, 18, Math.PI/6, 0, Math.PI*2);
        ctx.ellipse(-14, 5, 8, 14, Math.PI/6, 0, Math.PI*2);
        ctx.ellipse(14, 10, 8, 14, Math.PI/6, 0, Math.PI*2);
        ctx.fill();

        // Body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(-32, 8);
        ctx.lineTo(32, 14);
        ctx.lineTo(20, -8);
        ctx.lineTo(-28, -6);
        ctx.closePath();
        ctx.fill();

        // Wing front
        ctx.fillStyle = "#111";
        ctx.fillRect(18, 10, 16, 6);

        // Wing back
        ctx.fillStyle = "#111";
        ctx.fillRect(-35, -24, 18, 6);
        ctx.fillRect(-30, -18, 4, 16);

        // Stripe
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-10, -3, 20, 3);

    } else if (vehicleName === "Cycle") {
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 3;

        // Wheels
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.ellipse(-24, 14, 9, 18, Math.PI/6, 0, Math.PI*2);
        ctx.ellipse(24, 18, 9, 18, Math.PI/6, 0, Math.PI*2);
        ctx.fill();

        // Frame
        ctx.beginPath();
        ctx.moveTo(-24, 14);
        ctx.lineTo(-4, 10);
        ctx.lineTo(-14, -14);
        ctx.closePath();
        ctx.moveTo(-4, 10);
        ctx.lineTo(15, -20);
        ctx.lineTo(24, 18);
        ctx.stroke();

        // Handlebars
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(15, -20);
        ctx.lineTo(15, -34);
        ctx.lineTo(8, -36);
        ctx.moveTo(15, -34);
        ctx.lineTo(22, -32);
        ctx.stroke();

        // Seat
        ctx.fillStyle = "#1C2833";
        ctx.fillRect(-18, -18, 8, 4);
    }

    ctx.restore();
}
