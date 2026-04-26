// ==========================================
// SUBARU NATSUKI - Return by Death
// ==========================================

const subaru = {
    // Basic Stats
    x: 0, y: -800,
    width: 128, height: 128,
    hp: 120, maxHp: 120,
    mp: 100, maxMp: 100,
    speed: 420,
    gravity: 2000,
    jumpPower: 650,
    attackDamage: 15,
    
    // Skill 1 - Dash
    dashCd: 0,
    isDashing: false,
    invincible: false,
    invincibleTimer: 0,
    
    // Skill 2 - Magic Shot
    magicProjectiles: {},
    
    // Skill 3 - Thrust
    thrustCd: 0,
    
    // Ultimate - Return by Death
    deathHistory: [],
    isRespawning: false,
    respawnTimer: 0,
    deathCheckpoint: { x: 0, y: 0, hp: 120, mp: 100 },
    deathCount: 0,
    
    // State
    scene: "1",
    state: "idle",
    img: "subaruIdle1",
    animationDirection: "right",
    canMove: true,
    canAttack: true,
    onGround: false,
    vx: 0, vy: 0,
    superTimer: 0,
    isAttacking: false,
    tintColor: "white",
    damageBuff: 0,
    
    // Hitbox
    useCollider: true,
    colliderBox: { width: 70, height: 110 },
    useHurtBox: true,
    hurtBox: { x: 0, y: 0, width: 70, height: 120 }
}

// Fungsi untuk di panggil di game loop
function subaruUpdate(dt, subaru, renderer, canvas, physics, hpBar, manaBar) {
    // Cooldown
    subaru.dashCd = Math.max(0, subaru.dashCd - dt)
    subaru.thrustCd = Math.max(0, subaru.thrustCd - dt)
    subaru.invincibleTimer = Math.max(0, subaru.invincibleTimer - dt)
    if (subaru.invincibleTimer <= 0) subaru.invincible = false
    
    // Regenerasi MP
    subaru.mp = Math.min(subaru.maxMp, subaru.mp + 8 * dt)
    if (manaBar) manaBar.setValue(subaru.mp)
    
    // Return by Death
    if (!subaru.isRespawning && subaru.hp <= subaru.maxHp * 0.25 && subaru.scene === "1") {
        subaru.isRespawning = true
        subaru.respawnTimer = 0.8
        subaru.state = "dead"
        subaru.canMove = false
        subaru.canAttack = false
        subaru.deathCheckpoint = { 
            x: Math.max(0, subaru.x - 100), 
            y: subaru.y, 
            hp: subaru.maxHp, 
            mp: subaru.maxMp 
        }
        subaru.deathCount++
        if (renderer) renderer.fillRect(0, 0, canvas.width, canvas.height, "red", 0.7)
    }
    
    if (subaru.isRespawning) {
        subaru.respawnTimer -= dt
        if (subaru.respawnTimer <= 0) {
            subaru.x = subaru.deathCheckpoint.x
            subaru.y = subaru.deathCheckpoint.y
            subaru.hp = subaru.deathCheckpoint.hp
            subaru.mp = subaru.deathCheckpoint.mp
            subaru.isRespawning = false
            subaru.state = "idle"
            subaru.canMove = true
            subaru.canAttack = true
            subaru.vx = 0
            subaru.vy = 0
            if (hpBar) hpBar.setValue(subaru.hp)
        }
    }
    
    // Update projectile magic
    for (let id in subaru.magicProjectiles) {
        const p = subaru.magicProjectiles[id]
        p.x += p.dir * p.speed * dt
        p.lifeTime -= dt
        if (p.lifeTime <= 0) {
            delete subaru.magicProjectiles[id]
        } else if (physics) {
            physics.aabb({ temp: p }, "buff", (proj, m) => { m.hp -= p.damage; delete subaru.magicProjectiles[proj.id] })
            physics.aabb({ temp: p }, "kelomang", (proj, m) => { m.hp -= p.damage; delete subaru.magicProjectiles[proj.id] })
            physics.aabb({ temp: p }, "guin", (proj, m) => { if(m.aktif) m.hp -= p.damage; delete subaru.magicProjectiles[proj.id] })
        }
    }
    
    // Animasi state
    if (subaru.superTimer > 0) {
        subaru.superTimer -= dt
        if (subaru.superTimer <= 0) {
            subaru.isAttacking = false
            subaru.canAttack = true
            if (subaru.state !== "dead") subaru.state = "idle"
        }
    }
    
    if (!subaru.isRespawning && !subaru.isDashing && subaru.superTimer <= 0) {
        if (!subaru.onGround) {
            subaru.state = subaru.vy < 0 ? "jump" : "fall"
        } else if (Math.abs(subaru.vx) > 10) {
            subaru.state = "run"
        } else if (subaru.state !== "attack1" && subaru.state !== "attack2" && subaru.state !== "attack3") {
            subaru.state = "idle"
        }
    }
}

function subaruAttack1(subaru, physics) {
    if (subaru.isAttacking || !subaru.canAttack || subaru.isRespawning) return
    subaru.isAttacking = true
    subaru.canAttack = false
    subaru.state = "attack1"
    subaru.superTimer = 0.3
    
    const dmg = subaru.attackDamage + (subaru.damageBuff || 0)
    const hitX = subaru.animationDirection === "right" ? subaru.x + subaru.width - 40 : subaru.x - 60
    const hitbox = { x: hitX, y: subaru.y + subaru.height/2 - 40, width: 80, height: 80, damage: dmg }
    
    if (physics) {
        physics.aabb({ temp: hitbox }, "buff", (h, m) => { m.hp -= dmg; m.tintColor = "red" })
        physics.aabb({ temp: hitbox }, "kelomang", (h, m) => { m.hp -= dmg; m.tintColor = "red" })
        physics.aabb({ temp: hitbox }, "guin", (h, m) => { if(m.aktif) m.hp -= dmg; m.tintColor = "red" })
    }
}

function subaruDash(subaru) {
    if (subaru.dashCd > 0 || subaru.mp < 15 || subaru.isRespawning) return false
    subaru.mp -= 15
    subaru.dashCd = 2
    subaru.isDashing = true
    subaru.invincible = true
    subaru.invincibleTimer = 0.3
    subaru.state = "dash"
    
    const dashDist = 180
    subaru.x += subaru.animationDirection === "right" ? dashDist : -dashDist
    
    setTimeout(() => {
        subaru.isDashing = false
        if (subaru.state === "dash") subaru.state = "idle"
    }, 200)
    return true
}

function subaruMagicShot(subaru) {
    if (subaru.mp < 15 || subaru.isRespawning) return false
    subaru.mp -= 15
    subaru.state = "attack2"
    subaru.superTimer = 0.3
    subaru.isAttacking = true
    subaru.canAttack = false
    
    const id = crypto.randomUUID()
    subaru.magicProjectiles[id] = {
        id, x: subaru.x + (subaru.animationDirection === "right" ? subaru.width : -40),
        y: subaru.y + subaru.height/2, width: 40, height: 40,
        dir: subaru.animationDirection === "right" ? 1 : -1,
        speed: 500, damage: 25 + (subaru.damageBuff || 0),
        lifeTime: 2, scene: "1"
    }
    return true
}

function subaruThrust(subaru, physics) {
    if (subaru.thrustCd > 0 || subaru.mp < 20 || subaru.isRespawning) return false
    subaru.mp -= 20
    subaru.thrustCd = 3
    subaru.invincible = true
    subaru.invincibleTimer = 0.3
    subaru.state = "attack3"
    subaru.superTimer = 0.4
    subaru.isAttacking = true
    subaru.canAttack = false
    
    const thrustDist = 120
    subaru.x += subaru.animationDirection === "right" ? thrustDist : -thrustDist
    
    const dmg = 35 + (subaru.damageBuff || 0)
    const hitX = subaru.animationDirection === "right" ? subaru.x : subaru.x - 60
    const hitbox = { x: hitX, y: subaru.y + subaru.height/2 - 40, width: 80, height: 80, damage: dmg }
    
    if (physics) {
        physics.aabb({ temp: hitbox }, "buff", (h, m) => { m.hp -= dmg })
        physics.aabb({ temp: hitbox }, "kelomang", (h, m) => { m.hp -= dmg })
        physics.aabb({ temp: hitbox }, "guin", (h, m) => { if(m.aktif) m.hp -= dmg })
    }
    return true
}