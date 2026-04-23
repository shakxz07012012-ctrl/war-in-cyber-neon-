// ==========================================
// SHUKEN - Karakter Petir Cepat
// ==========================================

// Data karakter Shuken (akan ditambahkan ke hero)
const shuken = {
    x: 0,
    y: -800,
    width: 100,
    height: 110,  // Lebih tinggi dari karakter lain
    hp: 120,
    maxHp: 120,
    energi: 100,
    maxEnergi: 100,
    gravity: 2000,
    jumpPower: 680,
    speed: 550,  // Sangat cepat
    attackDamage: 35,
    useCollider: true,
    colliderBox: { width: 50, height: 100 },
    useHurtBox: true,
    hurtBox: { x: 0, y: 0, width: 50, height: 120 },
    vx: 0,
    vy: 0,
    scene: "1",
    isAttacking: false,
    isUsingSkill: false,
    skill1Cooldown: 0,
    skill2Cooldown: 0,
    ultiCooldown: 0,
    currentHero: "shuken",
    
    // Efek visual
    petirEffect: null,
    tintColor: "white"
}

// Wadah untuk projectile skill 1 (bola listrik)
const bolaPetir = {}

// Wadah untuk efek petir area (skill 2)
const petirArea = {}

// Wadah untuk efek petir dari atas (ulti)
const petirAtas = {}

// ==========================================
// SKILL 1: BOLA LISTRIK (Jarak Jauh)
// ==========================================
function shukenSkill1BolaListrik(shuken, dt, utils) {
    if (shuken.currentHero !== "shuken") return
    if (shuken.skill1Cooldown > 0) {
        shuken.skill1Cooldown -= dt
        return
    }
    if (shuken.energi < 12) return
    if (shuken.isAttacking || shuken.isUsingSkill) return
    
    shuken.isUsingSkill = true
    shuken.energi -= 12
    shuken.superState = true
    shuken.state = "skill1"
    shuken.img = "shukenSkill1"
    
    // Buat bola listrik
    const id = crypto.randomUUID()
    bolaPetir[id] = {
        id: id,
        x: shuken.x + shuken.width/2 - 20,
        y: shuken.y + shuken.height/3,
        width: 40,
        height: 40,
        scene: "1",
        dir: shuken.animationDirection === "right" ? 1 : -1,
        speed: 600,
        damage: 20,
        lifeTime: 2,
        img: "bolaPetir"
    }
    
    shuken.skill1Cooldown = 2  // Cooldown 2 detik
    shuken.superTimer = 0.3
    
    utils.timer(dt, "shukenSkill1Anim", 0.3, () => {
        shuken.isUsingSkill = false
    })
}

// ==========================================
// SKILL 2: SAMBARAN PETIR AREA
// ==========================================
function shukenSkill2PetirArea(shuken, dt, utils) {
    if (shuken.currentHero !== "shuken") return
    if (shuken.skill2Cooldown > 0) {
        shuken.skill2Cooldown -= dt
        return
    }
    if (shuken.energi < 25) return
    if (shuken.isAttacking || shuken.isUsingSkill) return
    
    shuken.isUsingSkill = true
    shuken.energi -= 25
    shuken.superState = true
    shuken.state = "skill2"
    shuken.img = "shukenSkill2"
    
    // Tentukan area sambaran (depan karakter)
    const areaX = shuken.animationDirection === "right" 
        ? shuken.x + shuken.width + 20
        : shuken.x - 120
    const areaY = shuken.y + shuken.height/2
    
    // Buat efek petir area
    const id = crypto.randomUUID()
    petirArea[id] = {
        id: id,
        x: areaX,
        y: areaY - 50,
        width: 120,
        height: 100,
        scene: "1",
        damage: 30,
        lifeTime: 0.3,
        img: "petirArea"
    }
    
    shuken.skill2Cooldown = 4  // Cooldown 4 detik
    shuken.superTimer = 0.4
    
    utils.timer(dt, "shukenSkill2Anim", 0.4, () => {
        shuken.isUsingSkill = false
    })
}

// ==========================================
// ULTIMATE: PETIR DARI ATAS
// ==========================================
function shukenUltiPetirAtas(shuken, dt, utils) {
    if (shuken.currentHero !== "shuken") return
    if (shuken.ultiCooldown > 0) {
        shuken.ultiCooldown -= dt
        return
    }
    if (shuken.energi < 50) return
    if (shuken.isAttacking || shuken.isUsingSkill) return
    
    shuken.isUsingSkill = true
    shuken.energi -= 50
    shuken.superState = true
    shuken.state = "ulti"
    shuken.img = "shukenUlti"
    
    // Petir menyambar DARI ATAS ke tanah
    // Tentukan posisi sambaran (depan karakter)
    const targetX = shuken.animationDirection === "right"
        ? shuken.x + shuken.width + 50
        : shuken.x - 130
    
    const id = crypto.randomUUID()
    petirAtas[id] = {
        id: id,
        x: targetX,
        y: -50,  // Mulai dari ATAS canvas
        width: 100,
        height: 800,  // Menyambar sampai ke bawah
        scene: "1",
        damage: 60,
        lifeTime: 0.5,
        img: "petirAtas",
        isFalling: true
    }
    
    shuken.ultiCooldown = 10  // Cooldown 10 detik
    shuken.superTimer = 0.6
    
    utils.timer(dt, "shukenUltiAnim", 0.6, () => {
        shuken.isUsingSkill = false
    })
}

// ==========================================
// SERANGAN DASAR SHUKEN (Pukulan Petir)
// ==========================================
function shukenBasicAttack(shuken, dt, utils, physics) {
    if (shuken.currentHero !== "shuken") return
    if (shuken.isAttacking || shuken.isUsingSkill) return
    if (shuken.state === "attack") return
    
    shuken.isAttacking = true
    shuken.superState = true
    shuken.state = "attack"
    shuken.img = "shukenAttack1"
    
    // Hitbox serangan
    const attackX = shuken.animationDirection === "right"
        ? shuken.x + shuken.width
        : shuken.x - 50
    
    const attackHitbox = {
        x: attackX,
        y: shuken.y + shuken.height/3,
        width: 50,
        height: 60,
        damage: shuken.attackDamage,
        scene: "1",
        lifeTime: 0.15
    }
    
    // Damage ke musuh terdekat
    const attackId = crypto.randomUUID()
    // Simpan hitbox untuk deteksi damage
    
    shuken.superTimer = 0.2
    
    utils.timer(dt, "shukenAttackAnim", 0.2, () => {
        shuken.isAttacking = false
        shuken.state = "idle"
    })
}

// ==========================================
// UPDATE BOLA LISTRIK (Skill 1)
// ==========================================
function updateBolaPetir(dt, physics, listPanahMiya = null) {
    Object.values(bolaPetir).forEach(bola => {
        bola.x += bola.dir * bola.speed * dt
        bola.lifeTime -= dt
        
        if (bola.lifeTime <= 0) {
            delete bolaPetir[bola.id]
        }
    })
    
    // Damage ke musuh (kelomang, guin, buff)
    if (physics) {
        physics.aabb(bolaPetir, "kelomang", (bola, musuh) => {
            musuh.hp -= bola.damage
            musuh.tintColor = "purple"
            delete bolaPetir[bola.id]
        })
        
        physics.aabb(bolaPetir, "guin", (bola, musuh) => {
            if (musuh.aktif) {
                musuh.hp -= bola.damage
                musuh.tintColor = "purple"
            }
            delete bolaPetir[bola.id]
        })
        
        physics.aabb(bolaPetir, "buff", (bola, musuh) => {
            musuh.hp -= bola.damage
            musuh.tintColor = "purple"
            delete bolaPetir[bola.id]
        })
    }
}

// ==========================================
// UPDATE PETIR AREA (Skill 2)
// ==========================================
function updatePetirArea(dt, physics) {
    Object.values(petirArea).forEach(petir => {
        petir.lifeTime -= dt
        
        if (petir.lifeTime <= 0) {
            delete petirArea[petir.id]
        }
    })
    
    if (physics) {
        physics.aabb(petirArea, "kelomang", (petir, musuh) => {
            musuh.hp -= petir.damage
            musuh.tintColor = "purple"
        })
        
        physics.aabb(petirArea, "guin", (petir, musuh) => {
            if (musuh.aktif) {
                musuh.hp -= petir.damage
                musuh.tintColor = "purple"
            }
        })
        
        physics.aabb(petirArea, "buff", (petir, musuh) => {
            musuh.hp -= petir.damage
            musuh.tintColor = "purple"
        })
    }
}

// ==========================================
// UPDATE PETIR DARI ATAS (Ultimate)
// ==========================================
function updatePetirAtas(dt, physics) {
    Object.values(petirAtas).forEach(petir => {
        petir.lifeTime -= dt
        
        if (petir.lifeTime <= 0) {
            delete petirAtas[petir.id]
        }
    })
    
    if (physics) {
        physics.aabb(petirAtas, "kelomang", (petir, musuh) => {
            musuh.hp -= petir.damage
            musuh.tintColor = "purple"
            musuh.tintColorTimer = 0.3
        })
        
        physics.aabb(petirAtas, "guin", (petir, musuh) => {
            if (musuh.aktif) {
                musuh.hp -= petir.damage
                musuh.tintColor = "purple"
            }
        })
        
        physics.aabb(petirAtas, "buff", (petir, musuh) => {
            musuh.hp -= petir.damage
            musuh.tintColor = "purple"
        })
    }
}

// ==========================================
// LOGIKA UTAMA SHUKEN (panggil di game loop)
// ==========================================
function logikaShuken(dt, hero, hpBar, manaBar, physics, utils) {
    const player = hero.shuken
    if (!player) return
    
    // Regenerasi energi
    player.energi = Math.min(player.maxEnergi, player.energi + 5 * dt)
    if (player.currentHero === "shuken") {
        manaBar.setMaxValue(player.maxEnergi)
        manaBar.setValue(player.energi)
        hpBar.setMaxValue(player.maxHp)
        hpBar.setValue(player.hp)
    }
    
    // Update cooldown visual (bisa ditampilkan di UI nanti)
    
    // Animasi berdasarkan state
    if (!player.superState) {
        if (!player.onGround) {
            player.state = player.vy < 0 ? "jump" : "fall"
            if (player.state === "jump") player.img = "shukenJump"
            if (player.state === "fall") player.img = "shukenFall"
        } else if (Math.abs(player.vx) > 10) {
            player.state = "run"
        } else {
            player.state = "idle"
            player.img = "shukenIdle"
        }
    }
    
    // Efek petir kecil saat idle (percikan listrik)
    if (player.state === "idle" && !player.superState && player.currentHero === "shuken") {
        utils.timer(dt, "shukenIdlePetir", 0.5, () => {
            // Efek visual percikan listrik (optional)
            player.tintColor = "#aa88ff"
            utils.timer(dt, "shukenIdlePetirReset", 0.1, () => {
                if (player.tintColor === "#aa88ff") player.tintColor = "white"
            })
        })
    }
}

// ==========================================
// SHUKEN VS MUSUH (Damage ke musuh saat terkena)
// ==========================================
function shukenVsMusuh(dt, hero, hpBar, physics) {
    const shuken = hero.shuken
    if (shuken.currentHero !== "shuken") return
    
    // Damage ke buff (semut)
    physics.aabb({ shuken: shuken }, "buff", (hero, musuh) => {
        if (shuken.isAttacking) {
            musuh.hp -= shuken.attackDamage
            shuken.isAttacking = false
        }
        shuken.hp -= 0.5
        hpBar.setValue(shuken.hp)
    })
    
    // Damage ke kelomang
    physics.aabb({ shuken: shuken }, "kelomang", (hero, musuh) => {
        if (shuken.isAttacking) {
            musuh.hp -= shuken.attackDamage
            shuken.isAttacking = false
        }
        shuken.hp -= 0.8
        hpBar.setValue(shuken.hp)
    })
    
    // Damage ke guin
    physics.aabb({ shuken: shuken }, "guin", (hero, musuh) => {
        if (shuken.isAttacking && musuh.aktif) {
            musuh.hp -= shuken.attackDamage
            shuken.isAttacking = false
        }
        shuken.hp -= 1
        hpBar.setValue(shuken.hp)
    })
}

// ==========================================
// EKSPOR SEMUA FUNGSI
// ==========================================
// (Jika menggunakan module, bisa di export. Tapi karena ini game loop, 
//  fungsi-fungsi di atas akan dipanggil langsung di index.html)