// ==========================================
// ANALOG CONTROLLER - Joystick untuk Mobile
// ==========================================

class AnalogController {
    static injected = false;
    static instances = [];

    static injectCSS() {
        if (this.injected) return;
        const style = document.createElement("style");
        style.textContent = `
            .analog-container {
                position: fixed;
                bottom: 80px;
                left: 30px;
                width: 140px;
                height: 140px;
                z-index: 10000;
                touch-action: none;
            }
            .analog-base {
                position: absolute;
                width: 100%;
                height: 100%;
                background: rgba(30,30,40,0.6);
                border-radius: 50%;
                backdrop-filter: blur(8px);
                border: 2px solid rgba(255,255,255,0.3);
                box-shadow: 0 0 20px rgba(0,0,0,0.3);
            }
            .analog-stick {
                position: absolute;
                width: 55px;
                height: 55px;
                background: rgba(255,255,255,0.9);
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.05s ease;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                border: 2px solid rgba(255,215,0,0.6);
                cursor: pointer;
            }
            .analog-stick::after {
                content: "▲";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 20px;
                color: #ffcc00;
                font-weight: bold;
                text-shadow: 0 0 5px #ff6600;
            }
            .analog-value {
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                font-size: 11px;
                font-family: monospace;
                background: rgba(0,0,0,0.6);
                padding: 2px 8px;
                border-radius: 20px;
                white-space: nowrap;
            }
            
            .attack-btn-miya {
                position: fixed;
                bottom: 120px;
                right: 20px;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                border: none;
                background: rgba(0,150,255,0.85);
                backdrop-filter: blur(8px);
                color: white;
                font-size: 32px;
                font-weight: bold;
                z-index: 10000;
                cursor: pointer;
                touch-action: none;
                transition: transform 0.08s ease;
                box-shadow: 0 0 15px rgba(0,150,255,0.5);
            }
            
            .attack-btn-shuken {
                position: fixed;
                bottom: 120px;
                right: 20px;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                border: none;
                background: rgba(200,100,50,0.85);
                backdrop-filter: blur(8px);
                color: white;
                font-size: 32px;
                font-weight: bold;
                z-index: 10000;
                cursor: pointer;
                touch-action: none;
                transition: transform 0.08s ease;
                box-shadow: 0 0 15px rgba(200,100,50,0.5);
            }
            
            .attack-btn-subaru {
                position: fixed;
                bottom: 120px;
                right: 20px;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                border: none;
                background: rgba(150,80,200,0.85);
                backdrop-filter: blur(8px);
                color: white;
                font-size: 32px;
                font-weight: bold;
                z-index: 10000;
                cursor: pointer;
                touch-action: none;
                transition: transform 0.08s ease;
                box-shadow: 0 0 15px rgba(150,80,200,0.5);
            }
            
            .skill1-shuken, .skill1-subaru {
                position: fixed;
                bottom: 120px;
                right: 100px;
                width: 65px;
                height: 65px;
                border-radius: 50%;
                border: none;
                background: rgba(100,50,200,0.85);
                backdrop-filter: blur(8px);
                color: white;
                font-size: 28px;
                font-weight: bold;
                z-index: 10000;
                cursor: pointer;
                touch-action: none;
                transition: transform 0.08s ease;
                box-shadow: 0 0 12px rgba(100,50,200,0.5);
            }
            
            .skill2-shuken, .skill2-subaru {
                position: fixed;
                bottom: 120px;
                right: 180px;
                width: 65px;
                height: 65px;
                border-radius: 50%;
                border: none;
                background: rgba(150,50,200,0.85);
                backdrop-filter: blur(8px);
                color: white;
                font-size: 26px;
                font-weight: bold;
                z-index: 10000;
                cursor: pointer;
                touch-action: none;
                transition: transform 0.08s ease;
                box-shadow: 0 0 12px rgba(150,50,200,0.5);
            }
            
            .skill3-shuken, .skill3-subaru {
                position: fixed;
                bottom: 180px;
                right: 100px;
                width: 65px;
                height: 65px;
                border-radius: 50%;
                border: none;
                background: rgba(200,50,255,0.9);
                backdrop-filter: blur(8px);
                color: white;
                font-size: 20px;
                font-weight: bold;
                z-index: 10000;
                cursor: pointer;
                touch-action: none;
                transition: transform 0.08s ease;
                box-shadow: 0 0 12px rgba(200,50,255,0.5);
            }
            
            .jump-btn {
                position: fixed;
                bottom: 120px;
                right: 260px;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                border: none;
                background: rgba(0,200,100,0.85);
                backdrop-filter: blur(8px);
                color: white;
                font-size: 32px;
                font-weight: bold;
                z-index: 10000;
                cursor: pointer;
                touch-action: none;
                transition: transform 0.08s ease;
                box-shadow: 0 0 15px rgba(0,200,100,0.5);
            }
            
            .attack-btn-miya:active, .attack-btn-shuken:active, .attack-btn-subaru:active,
            .skill1-shuken:active, .skill2-shuken:active, .skill3-shuken:active,
            .skill1-subaru:active, .skill2-subaru:active, .skill3-subaru:active,
            .jump-btn:active {
                transform: scale(0.9);
            }
            
            @media (max-width: 700px) {
                .analog-container { width: 110px; height: 110px; bottom: 60px; left: 20px; }
                .analog-stick { width: 45px; height: 45px; }
                .attack-btn-miya, .attack-btn-shuken, .attack-btn-subaru { width: 60px; height: 60px; font-size: 28px; bottom: 100px; right: 15px; }
                .skill1-shuken, .skill1-subaru { width: 55px; height: 55px; font-size: 24px; bottom: 100px; right: 90px; }
                .skill2-shuken, .skill2-subaru { width: 55px; height: 55px; font-size: 22px; bottom: 100px; right: 160px; }
                .skill3-shuken, .skill3-subaru { width: 55px; height: 55px; font-size: 18px; bottom: 150px; right: 90px; }
                .jump-btn { width: 60px; height: 60px; font-size: 28px; bottom: 100px; right: 230px; }
            }
            
            @media (max-width: 500px) {
                .skill2-shuken, .skill2-subaru { right: 140px; }
                .jump-btn { right: 210px; }
            }
        `;
        document.head.appendChild(style);
        this.injected = true;
    }

    constructor(options = {}) {
        AnalogController.injectCSS();
        
        this.id = options.id || `analog_${Date.now()}_${Math.random()}`;
        this.onMove = options.onMove || (() => {});
        this.onRelease = options.onRelease || (() => {});
        this.deadZone = options.deadZone || 0.15;
        this.size = options.size || 140;
        
        this.active = false;
        this.dx = 0;
        this.dy = 0;
        this.angle = 0;
        this.magnitude = 0;
        
        this.container = null;
        this.base = null;
        this.stick = null;
        this.valueDisplay = null;
        
        this.createElements();
        this.attachEvents();
        
        AnalogController.instances.push(this);
    }
    
    createElements() {
        this.container = document.createElement("div");
        this.container.className = "analog-container";
        this.container.style.width = this.size + "px";
        this.container.style.height = this.size + "px";
        
        this.base = document.createElement("div");
        this.base.className = "analog-base";
        
        this.stick = document.createElement("div");
        this.stick.className = "analog-stick";
        
        this.valueDisplay = document.createElement("div");
        this.valueDisplay.className = "analog-value";
        this.valueDisplay.textContent = "⚡ 0%";
        
        this.container.appendChild(this.base);
        this.container.appendChild(this.stick);
        this.container.appendChild(this.valueDisplay);
        document.body.appendChild(this.container);
    }
    
    attachEvents() {
        const getPos = (e) => {
            const rect = this.container.getBoundingClientRect();
            let clientX, clientY;
            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            return {
                x: clientX - rect.left - this.size/2,
                y: clientY - rect.top - this.size/2
            };
        };
        
        const onStart = (e) => {
            e.preventDefault();
            this.active = true;
        };
        
        const onMove = (e) => {
            if (!this.active) return;
            e.preventDefault();
            
            const pos = getPos(e);
            let dx = pos.x / (this.size/2);
            let dy = pos.y / (this.size/2);
            
            let mag = Math.hypot(dx, dy);
            if (mag > 1) {
                dx /= mag;
                dy /= mag;
                mag = 1;
            }
            
            if (mag < this.deadZone) {
                this.dx = 0;
                this.dy = 0;
                this.magnitude = 0;
            } else {
                const factor = (mag - this.deadZone) / (1 - this.deadZone);
                this.dx = dx * factor;
                this.dy = dy * factor;
                this.magnitude = mag;
            }
            
            this.angle = Math.atan2(this.dy, this.dx);
            
            const stickX = this.dx * (this.size/2 - 30);
            const stickY = this.dy * (this.size/2 - 30);
            this.stick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
            
            const percent = Math.floor(this.magnitude * 100);
            this.valueDisplay.textContent = `⚡ ${percent}%`;
            
            this.onMove({ dx: this.dx, dy: this.dy, angle: this.angle, magnitude: this.magnitude });
        };
        
        const onEnd = (e) => {
            e.preventDefault();
            this.active = false;
            this.dx = 0;
            this.dy = 0;
            this.magnitude = 0;
            this.stick.style.transform = "translate(-50%, -50%)";
            this.valueDisplay.textContent = "⚡ 0%";
            this.onRelease();
        };
        
        this.container.addEventListener("touchstart", onStart, { passive: false });
        this.container.addEventListener("touchmove", onMove, { passive: false });
        this.container.addEventListener("touchend", onEnd);
        this.container.addEventListener("touchcancel", onEnd);
        this.container.addEventListener("mousedown", onStart);
        window.addEventListener("mousemove", (e) => { if (this.active) onMove(e); });
        window.addEventListener("mouseup", onEnd);
    }
    
    getDirection() {
        return { dx: this.dx, dy: this.dy, angle: this.angle, magnitude: this.magnitude };
    }
    
    isMoving() {
        return this.magnitude > this.deadZone;
    }
    
    destroy() {
        this.container.remove();
        const index = AnalogController.instances.indexOf(this);
        if (index > -1) AnalogController.instances.splice(index, 1);
    }
    
    static destroyAll() {
        AnalogController.instances.forEach(instance => instance.destroy());
        AnalogController.instances = [];
    }
}

class GameController {
    constructor(heroType, callbacks = {}) {
        this.heroType = heroType;
        this.callbacks = callbacks;
        this.analog = null;
        this.jumpBtn = null;
        this.attackBtn = null;
        this.skill1Btn = null;
        this.skill2Btn = null;
        this.skill3Btn = null;
        
        this.createControls();
    }
    
    createSkillBtn(text, bottom, right, bg, callback) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.style.position = "fixed";
        btn.style.bottom = bottom + "px";
        btn.style.right = right + "px";
        btn.style.width = "65px";
        btn.style.height = "65px";
        btn.style.borderRadius = "50%";
        btn.style.backgroundColor = bg;
        btn.style.border = "none";
        btn.style.fontSize = "28px";
        btn.style.fontWeight = "bold";
        btn.style.zIndex = "10000";
        btn.style.cursor = "pointer";
        btn.style.touchAction = "none";
        btn.style.transition = "transform 0.08s ease";
        btn.style.boxShadow = "0 0 12px rgba(0,0,0,0.3)";
        btn.onpointerdown = (e) => {
            e.preventDefault();
            if (callback) callback();
            btn.style.transform = "scale(0.9)";
        };
        btn.onpointerup = () => { btn.style.transform = "scale(1)"; };
        btn.onpointerleave = () => { btn.style.transform = "scale(1)"; };
        document.body.appendChild(btn);
        return btn;
    }
    
    createControls() {
        this.destroy();
        
        this.analog = new AnalogController({
            size: 140,
            onMove: (data) => {
                if (this.callbacks.onMove) this.callbacks.onMove(data);
            },
            onRelease: () => {
                if (this.callbacks.onMoveStop) this.callbacks.onMoveStop();
            }
        });
        
        // Jump Button
        this.jumpBtn = document.createElement("button");
        this.jumpBtn.className = "jump-btn";
        this.jumpBtn.textContent = "▲";
        this.jumpBtn.onpointerdown = (e) => {
            e.preventDefault();
            if (this.callbacks.onJump) this.callbacks.onJump();
            this.jumpBtn.style.transform = "scale(0.9)";
        };
        this.jumpBtn.onpointerup = () => { this.jumpBtn.style.transform = "scale(1)"; };
        this.jumpBtn.onpointerleave = () => { this.jumpBtn.style.transform = "scale(1)"; };
        document.body.appendChild(this.jumpBtn);
        
        // Attack Button berdasarkan hero
        let attackClass = "attack-btn-miya";
        let attackIcon = "🏹";
        let attackBg = "rgba(0,150,255,0.85)";
        
        if (this.heroType === "shuken") {
            attackClass = "attack-btn-shuken";
            attackIcon = "👊";
            attackBg = "rgba(200,100,50,0.85)";
        } else if (this.heroType === "subaru") {
            attackClass = "attack-btn-subaru";
            attackIcon = "🗡️";
            attackBg = "rgba(150,80,200,0.85)";
        }
        
        this.attackBtn = document.createElement("button");
        this.attackBtn.className = attackClass;
        this.attackBtn.textContent = attackIcon;
        this.attackBtn.onpointerdown = (e) => {
            e.preventDefault();
            if (this.callbacks.onAttack) this.callbacks.onAttack();
            this.attackBtn.style.transform = "scale(0.9)";
        };
        this.attackBtn.onpointerup = () => { this.attackBtn.style.transform = "scale(1)"; };
        this.attackBtn.onpointerleave = () => { this.attackBtn.style.transform = "scale(1)"; };
        document.body.appendChild(this.attackBtn);
        
        // Skill Buttons
        if (this.heroType === "shuken") {
            this.skill1Btn = this.createSkillBtn("⚡", 120, 100, "rgba(100,50,200,0.85)", this.callbacks.onSkill1);
            this.skill2Btn = this.createSkillBtn("🌊", 120, 180, "rgba(150,50,200,0.85)", this.callbacks.onSkill2);
            this.skill3Btn = this.createSkillBtn("💥", 180, 100, "rgba(200,50,255,0.9)", this.callbacks.onUlti);
        } else if (this.heroType === "subaru") {
            this.skill1Btn = this.createSkillBtn("🌪️", 120, 100, "rgba(80,80,200,0.85)", this.callbacks.onSkill1);
            this.skill2Btn = this.createSkillBtn("⚡", 120, 180, "rgba(200,80,200,0.85)", this.callbacks.onSkill2);
            this.skill3Btn = this.createSkillBtn("💥", 180, 100, "rgba(200,50,100,0.85)", this.callbacks.onSkill3);
        }
    }
    
    getMoveDirection() {
        return this.analog ? this.analog.getDirection() : { dx: 0, dy: 0, magnitude: 0 };
    }
    
    isMoving() {
        return this.analog ? this.analog.isMoving() : false;
    }
    
    destroy() {
        if (this.analog) this.analog.destroy();
        if (this.jumpBtn) this.jumpBtn.remove();
        if (this.attackBtn) this.attackBtn.remove();
        if (this.skill1Btn) this.skill1Btn.remove();
        if (this.skill2Btn) this.skill2Btn.remove();
        if (this.skill3Btn) this.skill3Btn.remove();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnalogController, GameController };
}