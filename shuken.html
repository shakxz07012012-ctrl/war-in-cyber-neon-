// ============ SHU KEN CHARACTER WITH SKILL SYSTEM ============

// Wadah untuk projectile
const listProjectileShuken = {};

// Class AI untuk Shu Ken (sebagai musuh nanti)
class ShuKenAI extends AI_Behaviour {
  decide(player) {
    const shu = this.getEntity();
    const dx = player.x - shu.x;
    const dis = Math.abs(dx);
    
    if(shu.hp < 50) return "faseKritis";
    if(dis < 100) return "faseDekat";
    if(dis < 350) return "faseSedang";
    return "faseJauh";
  }
  
  getPatterns() {
    return {
      faseDekat: [
        ["pukul", 0.5],
        ["pukul", 0.5],
        ["uppercut", 1],
        ["pukul", 0.3],
        ["rush", 0.8]
      ],
      faseSedang: [
        ["rush", 1],
        ["pukul", 0.3],
        ["rush", 0.7],
        ["hadouken", 1]
      ],
      faseJauh: [
        ["hadouken", 1.5],
        ["rush", 1],
        ["hadouken", 1]
      ],
      faseKritis: [
        ["pukul", 0.3],
        ["shoryuken", 1.5],
        ["pukul", 0.3],
        ["shoryuken", 1],
        ["pukul", 0.5]
      ]
    };
  }
}

// Data Shu Ken sebagai musuh
const shukenEnemy = {
  "shuken-boss-1": {
    id: "shuken-boss-1",
    x: 6800,
    y: 0,
    originalX: 6800,
    originalY: 0,
    width: 80,
    height: 80,
    type: "shuken",
    scene: "1",
    originalScene: "1",
    hp: 300,
    originalHp: 300,
    color: "orange",
    img: "shukenIdle",
    gravity: 2000,
    vx: 0,
    vy: 0,
    useCollider: true,
    colliderBox: { width: 50, height: 70 },
    isDead: false
  }
};

// ============ SKILL BUTTON SYSTEM UNTUK HERO ============

function createSkillButtons(heroRef, hpBarRef, manaBarRef, physicsRef, utilsRef) {
  const miya = heroRef.miya;
  
  // Skill 1: Pukul (Q)
  const tombolPukul = new VirtualButton({
    text: "👊",
    bottom: 15,
    right: 320,
    width: 55,
    height: 55,
    fontSize: 28,
    background: "rgba(0,0,0,0.7)",
    borderRadius: "50%",
    border: "2px solid orange",
    onPress: () => {
      if(miya.cd_pukul > 0) return;
      miya.cd_pukul = 0.5;
      miya.currentSkill = "pukul";
      miya.skillTimer = 0.2;
      miya.skillDamage = 15;
      
      // Efek visual
      miya.tintColor = "orange";
      
      // Damage area di depan
      const xPos = miya.x + (miya.animationDirection === "right" ? 60 : -60);
      physicsRef.aabbRange(xPos, miya.y, 60, 80, "kelomang,buff,guin,shuken", (enemy) => {
        enemy.hp -= 15;
        enemy.tintColor = "red";
        if(enemy.hp <= 0) enemy.isDead = true;
      });
      
      setTimeout(() => {
        if(miya.currentSkill === "pukul") miya.tintColor = "white";
      }, 200);
    }
  });
  
  // Skill 2: Uppercut (W)
  const tombolUppercut = new VirtualButton({
    text: "⬆️",
    bottom: 80,
    right: 320,
    width: 55,
    height: 55,
    fontSize: 28,
    background: "rgba(0,0,0,0.7)",
    borderRadius: "50%",
    border: "2px solid yellow",
    onPress: () => {
      if(miya.cd_uppercut > 0) return;
      miya.cd_uppercut = 2;
      miya.currentSkill = "uppercut";
      miya.skillTimer = 0.3;
      miya.skillDamage = 25;
      miya.vy = -400;
      miya.tintColor = "yellow";
      
      physicsRef.aabbRange(miya.x, miya.y, 70, 100, "kelomang,buff,guin,shuken", (enemy) => {
        enemy.hp -= 25;
        enemy.vy = -300;
        enemy.tintColor = "red";
      });
      
      setTimeout(() => {
        if(miya.currentSkill === "uppercut") miya.tintColor = "white";
      }, 300);
    }
  });
  
  // Skill 3: Rush (E)
  const tombolRush = new VirtualButton({
    text: "💨",
    bottom: 145,
    right: 320,
    width: 55,
    height: 55,
    fontSize: 28,
    background: "rgba(0,0,0,0.7)",
    borderRadius: "50%",
    border: "2px solid cyan",
    onPress: () => {
      if(miya.cd_rush > 0) return;
      miya.cd_rush = 3;
      miya.currentSkill = "rush";
      miya.skillTimer = 0.4;
      miya.invincible = true;
      miya.tintColor = "cyan";
      
      const dashSpeed = miya.animationDirection === "right" ? 600 : -600;
      miya.vx = dashSpeed;
      
      // Damage selama rush (3 kali)
      let hitCount = 0;
      const rushInterval = setInterval(() => {
        if(miya.skillTimer <= 0 || hitCount >= 3) {
          clearInterval(rushInterval);
          miya.invincible = false;
          if(miya.currentSkill === "rush") miya.tintColor = "white";
          return;
        }
        physicsRef.aabbRange(miya.x, miya.y, 80, 80, "kelomang,buff,guin,shuken", (enemy) => {
          enemy.hp -= 10;
          enemy.tintColor = "red";
        });
        hitCount++;
      }, 130);
    }
  });
  
  // Skill 4: Hadouken (R)
  const tombolHadouken = new VirtualButton({
    text: "🌊",
    bottom: 15,
    right: 250,
    width: 55,
    height: 55,
    fontSize: 28,
    background: "rgba(0,0,0,0.7)",
    borderRadius: "50%",
    border: "2px solid blue",
    onPress: () => {
      if(miya.cd_hadouken > 0) return;
      if(miya.energi < 15) return;
      
      miya.cd_hadouken = 1.5;
      miya.energi -= 15;
      manaBarRef.setValue(miya.energi);
      miya.currentSkill = "hadouken";
      miya.skillTimer = 0.3;
      miya.tintColor = "blue";
      
      const id = crypto.randomUUID();
      listProjectileShuken[id] = {
        id: id,
        x: miya.x + miya.width/2,
        y: miya.y + miya.height/3,
        width: 40,
        height: 40,
        scene: miya.scene,
        dir: miya.animationDirection === "right" ? 1 : -1,
        speed: 550,
        damage: 20,
        lifeTime: 2.5,
        img: "projectileHadouken"
      };
      
      setTimeout(() => {
        if(miya.currentSkill === "hadouken") miya.tintColor = "white";
      }, 300);
    }
  });
  
  // Skill 5: Shoryuken (T/Ultimate)
  const tombolShoryuken = new VirtualButton({
    text: "🔥",
    bottom: 80,
    right: 250,
    width: 55,
    height: 55,
    fontSize: 28,
    background: "rgba(0,0,0,0.7)",
    borderRadius: "50%",
    border: "2px solid red",
    onPress: () => {
      if(miya.cd_shoryuken > 0) return;
      if(miya.energi < 30) return;
      
      miya.cd_shoryuken = 8;
      miya.energi -= 30;
      manaBarRef.setValue(miya.energi);
      miya.currentSkill = "shoryuken";
      miya.skillTimer = 0.5;
      miya.vy = -500;
      miya.invincible = true;
      miya.tintColor = "red";
      
      setTimeout(() => {
        if(miya.skillTimer > 0) {
          physicsRef.aabbRange(miya.x, miya.y - 100, 120, 120, "kelomang,buff,guin,shuken", (enemy) => {
            enemy.hp -= 45;
            enemy.vy = -400;
            enemy.tintColor = "red";
          });
        }
      }, 200);
      
      setTimeout(() => {
        if(miya.currentSkill === "shoryuken") {
          miya.tintColor = "white";
          miya.invincible = false;
        }
      }, 500);
    }
  });
  
  return { tombolPukul, tombolUppercut, tombolRush, tombolHadouken, tombolShoryuken };
}

// Update cooldown semua skill
function updateSkillCooldowns(hero, dt) {
  const cdSkills = ["cd_pukul", "cd_uppercut", "cd_rush", "cd_hadouken", "cd_shoryuken"];
  cdSkills.forEach(skill => {
    if(hero[skill] > 0) {
      hero[skill] = Math.max(0, hero[skill] - dt);
    }
  });
  
  if(hero.skillTimer > 0) {
    hero.skillTimer -= dt;
    if(hero.skillTimer <= 0 && hero.currentSkill) {
      hero.currentSkill = "";
      hero.invincible = false;
    }
  }
}

// Update projectile hadouken
function updateHadoukenProjectile(dt, physicsRef) {
  for(let id in listProjectileShuken) {
    const p = listProjectileShuken[id];
    p.x += p.dir * p.speed * dt;
    p.lifeTime -= dt;
    
    if(p.lifeTime <= 0) {
      delete listProjectileShuken[id];
      continue;
    }
    
    physicsRef.aabb(p, "kelomang,buff,guin,shuken", (proj, enemy) => {
      enemy.hp -= p.damage;
      enemy.tintColor = "red";
      delete listProjectileShuken[proj.id];
    });
  }
}

// Logika Shu Ken sebagai musuh (BOSS)
function logikaShuKen(dt, miya, physicsRef, utilsRef) {
  Object.values(shukenEnemy).forEach(el => {
    if(el.hp <= 0) {
      el.scene = "inactive";
      el.isDead = true;
      
      // Buka pintu gerbang
      Object.values(tembok).forEach(wl => {
        if(wl.img === "gerbang") wl.scene = "inactive";
      });
      return;
    }
    
    if(!el.ai) {
      el.ai = new ShuKenAI(el);
    }
    
    el.ai.update(dt, miya);
    
    el.useCollider = true;
    el.colliderBox = { width: 50, height: 70 };
    el.gravity = 2000;
    el.vx = el.vx || 0;
    el.vy = el.vy || 0;
    
    physicsRef.applyPhysics(dt, el);
    el.vy += el.gravity * dt;
    
    // Animasi berdasarkan state
    switch(el.state) {
      case "pukul":
        el.vx = 0;
        el.img = "shukenPukul";
        el.tintColor = "orange";
        setTimeout(() => el.tintColor = "white", 200);
        
        physicsRef.aabbRange(el.x + (el.animationDirection === "right" ? 50 : -50), el.y, 60, 80, "miya", (player) => {
          player.hp -= 12;
        });
        break;
        
      case "uppercut":
        el.vx = 0;
        el.vy = -350;
        el.img = "shukenUppercut";
        physicsRef.aabbRange(el.x, el.y, 70, 100, "miya", (player) => {
          player.hp -= 20;
          player.vy = -250;
        });
        break;
        
      case "rush":
        const dash = el.animationDirection === "right" ? 400 : -400;
        el.vx = dash;
        el.img = "shukenRush";
        physicsRef.aabbRange(el.x, el.y, 80, 80, "miya", (player) => {
          player.hp -= 8;
        });
        break;
        
      case "hadouken":
        el.vx = 0;
        el.img = "shukenHadouken";
        utilsRef.timer(dt, "shukenShoot", 0.3, () => {
          const id = crypto.randomUUID();
          listProjectileShuken[id] = {
            id: id,
            x: el.x + el.width/2,
            y: el.y + el.height/3,
            width: 40,
            height: 40,
            scene: el.scene,
            dir: el.animationDirection === "right" ? 1 : -1,
            speed: 400,
            damage: 15,
            lifeTime: 2,
            img: "projectileHadouken"
          };
        });
        break;
        
      case "shoryuken":
        el.vy = -450;
        el.img = "shukenUlti";
        physicsRef.aabbRange(el.x, el.y - 100, 120, 120, "miya", (player) => {
          player.hp -= 35;
          player.vy = -350;
        });
        break;
        
      default:
        el.img = "shukenIdle";
        el.vx = 0;
        break;
    }
  });
}

// Health bar untuk Shu Ken
function hpShuKen(dt, monster, camera, renderer) {
  if(monster.hp <= 0 || monster.scene === "inactive") return;
  
  monster.hpVisual = monster.hpVisual || monster.hp;
  monster.hpVisual -= (monster.hpVisual - monster.hp) * 5 * dt;
  
  const barWidth = 80;
  const barX = monster.x - camera.x;
  const barY = monster.y - camera.y - 15;
  
  renderer.fillRect(barX, barY, barWidth, 10, "#330000");
  renderer.fillRect(barX, barY, (monster.hpVisual / monster.originalHp) * barWidth, 10, "#ff6600");
  renderer.fillRect(barX, barY, (monster.hp / monster.originalHp) * barWidth, 10, "#ff0000");
}

// Panah Miya vs Shu Ken
function panahMiyaVsShuKen(panah, physicsRef) {
  physicsRef.aabb(panah, "shuken", (g1, g2) => {
    if(g2.hp <= 0) return;
    g2.hp -= 8;
    g2.tintColor = "red";
    delete panah[g1.id];
  });
}

// Miya vs Shu Ken (collision)
function miyaVsShuKen(dt, hero, hpBarRef, physicsRef) {
  physicsRef.aabb(hero, "shuken", (g1, g2) => {
    if(g1.invincible) return;
    if(g2.state === "shoryuken" || g2.state === "uppercut") {
      g1.hp -= 15;
    } else {
      g1.hp -= 5;
    }
    hpBarRef.setValue(g1.hp);
    g1.tintColor = "red";
  });
}