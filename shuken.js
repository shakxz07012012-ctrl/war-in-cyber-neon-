// ==================== SHUKEN.JS - TAMBAHAN UNTUK GAME KAMU ====================

// Data Shu Ken sebagai musuh baru
const shukenEnemy = {
  "shuken-1": {
    id: "shuken-1",
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
    isDead: false,
    animationDirection: "right"
  }
};

// Wadah projectile Hadouken
const listProjectileShuken = {};

// Tambahkan gambar Shu Ken ke listImg (listImg dari data.js)
if (typeof listImg !== 'undefined') {
  listImg.shukenIdle = { path: "ShukenIdle.png" };
  listImg.shukenPukul = { path: "ShukenPukul.png" };
  listImg.shukenUppercut = { path: "ShukenUppercut.png" };
  listImg.shukenRush = { path: "ShukenRush.png" };
  listImg.shukenHadouken = { path: "ShukenHadouken.png" };
  listImg.shukenUlti = { path: "ShukenUlti.png" };
  listImg.projectileHadouken = { path: "Hadouken.png" };
}

// Tambahkan properti skill ke hero.miya
if (typeof hero !== 'undefined' && hero.miya) {
  hero.miya.cd_pukul = 0;
  hero.miya.cd_uppercut = 0;
  hero.miya.cd_rush = 0;
  hero.miya.cd_hadouken = 0;
  hero.miya.cd_shoryuken = 0;
  hero.miya.currentSkill = "";
  hero.miya.skillTimer = 0;
  hero.miya.invincible = false;
}

// ==================== FUNGSI-FUNGSI SHU KEN ====================

// Update cooldown skill
function updateShukenCooldowns(hero, dt) {
  const skills = ["cd_pukul", "cd_uppercut", "cd_rush", "cd_hadouken", "cd_shoryuken"];
  skills.forEach(skill => {
    if (hero[skill] > 0) hero[skill] = Math.max(0, hero[skill] - dt);
  });
  if (hero.skillTimer > 0) {
    hero.skillTimer -= dt;
    if (hero.skillTimer <= 0 && hero.currentSkill) {
      hero.currentSkill = "";
      hero.invincible = false;
    }
  }
}

// Update projectile Hadouken
function updateHadoukenProjectile(dt, physics) {
  for (let id in listProjectileShuken) {
    const p = listProjectileShuken[id];
    p.x += p.dir * p.speed * dt;
    p.lifeTime -= dt;
    if (p.lifeTime <= 0) {
      delete listProjectileShuken[id];
      continue;
    }
    if (physics && physics.aabb) {
      physics.aabb(p, "kelomang,buff,guin,shuken", (proj, enemy) => {
        enemy.hp -= p.damage;
        enemy.tintColor = "red";
        delete listProjectileShuken[proj.id];
      });
    }
  }
}

// Logika Shu Ken sebagai musuh
function logikaShuKen(dt, miya, physics) {
  Object.values(shukenEnemy).forEach(el => {
    if (el.hp <= 0) {
      el.scene = "inactive";
      if (typeof tembok !== 'undefined') {
        Object.values(tembok).forEach(wl => {
          if (wl.img === "gerbang") wl.scene = "inactive";
        });
      }
      return;
    }
    el.vx = el.vx || 0;
    el.vy = el.vy || 0;
    if (physics) {
      physics.applyPhysics(dt, el);
      el.vy += 2000 * dt;
    }
    const dx = miya.x - el.x;
    if (Math.abs(dx) > 60) {
      el.vx = dx > 0 ? 120 : -120;
      el.animationDirection = dx > 0 ? "right" : "left";
    } else {
      el.vx = 0;
    }
    el.img = "shukenIdle";
  });
}

// Panah Miya vs Shu Ken
function panahMiyaVsShuKen(panah, physics) {
  if (!physics || !physics.aabb) return;
  physics.aabb(panah, "shuken", (p, enemy) => {
    if (enemy.hp <= 0) return;
    enemy.hp -= 8;
    enemy.tintColor = "red";
    delete panah[p.id];
  });
}

// Miya vs Shu Ken (collision)
function miyaVsShuKen(hero, hpBar, physics) {
  if (!physics || !physics.aabb) return;
  physics.aabb(hero, "shuken", (h, enemy) => {
    if (h.invincible) return;
    h.hp -= 5;
    if (hpBar) hpBar.setValue(h.hp);
    h.tintColor = "red";
  });
}

// Health bar Shu Ken
function hpShuKen(dt, monster, camera, renderer) {
  if (!monster || monster.hp <= 0 || monster.scene === "inactive") return;
  monster.hpVisual = monster.hpVisual || monster.hp;
  monster.hpVisual -= (monster.hpVisual - monster.hp) * 5 * dt;
  const barWidth = 80;
  const barX = monster.x - camera.x;
  const barY = monster.y - camera.y - 15;
  if (renderer) {
    renderer.fillRect(barX, barY, barWidth, 10, "#330000");
    renderer.fillRect(barX, barY, (monster.hpVisual / monster.originalHp) * barWidth, 10, "#ff6600");
    renderer.fillRect(barX, barY, (monster.hp / monster.originalHp) * barWidth, 10, "#ff0000");
  }
}

// ==================== TOMBOL SKILL UNTUK HERO ====================

function createShukenSkillButtons(heroRef, physicsRef, manaBarRef) {
  const miya = heroRef.miya;
  
  // Tombol Pukul (Q)
  const tombolPukul = new VirtualButton({
    text: "👊", bottom: 15, right: 320, width: 55, height: 55, fontSize: 28,
    background: "rgba(0,0,0,0.7)", borderRadius: "50%", border: "2px solid orange",
    onPress: () => {
      if (miya.cd_pukul > 0) return;
      miya.cd_pukul = 0.5;
      miya.currentSkill = "pukul";
      miya.skillTimer = 0.2;
      miya.tintColor = "orange";
      const xPos = miya.x + (miya.animationDirection === "right" ? 60 : -60);
      physicsRef.aabbRange(xPos, miya.y, 60, 80, "kelomang,buff,guin,shuken", (enemy) => {
        enemy.hp -= 15;
        enemy.tintColor = "red";
      });
      setTimeout(() => { if (miya.currentSkill === "pukul") miya.tintColor = "white"; }, 200);
    }
  });
  
  // Tombol Uppercut (W)
  const tombolUppercut = new VirtualButton({
    text: "⬆️", bottom: 80, right: 320, width: 55, height: 55, fontSize: 28,
    background: "rgba(0,0,0,0.7)", borderRadius: "50%", border: "2px solid yellow",
    onPress: () => {
      if (miya.cd_uppercut > 0) return;
      miya.cd_uppercut = 2;
      miya.currentSkill = "uppercut";
      miya.skillTimer = 0.3;
      miya.vy = -400;
      miya.tintColor = "yellow";
      physicsRef.aabbRange(miya.x, miya.y, 70, 100, "kelomang,buff,guin,shuken", (enemy) => {
        enemy.hp -= 25;
        enemy.vy = -300;
        enemy.tintColor = "red";
      });
      setTimeout(() => { if (miya.currentSkill === "uppercut") miya.tintColor = "white"; }, 300);
    }
  });
  
  // Tombol Rush (E)
  const tombolRush = new VirtualButton({
    text: "💨", bottom: 145, right: 320, width: 55, height: 55, fontSize: 28,
    background: "rgba(0,0,0,0.7)", borderRadius: "50%", border: "2px solid cyan",
    onPress: () => {
      if (miya.cd_rush > 0) return;
      miya.cd_rush = 3;
      miya.currentSkill = "rush";
      miya.skillTimer = 0.4;
      miya.invincible = true;
      miya.tintColor = "cyan";
      miya.vx = miya.animationDirection === "right" ? 600 : -600;
      let hitCount = 0;
      const rushInterval = setInterval(() => {
        if (miya.skillTimer <= 0 || hitCount >= 3) {
          clearInterval(rushInterval);
          miya.invincible = false;
          if (miya.currentSkill === "rush") miya.tintColor = "white";
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
  
  // Tombol Hadouken (R)
  const tombolHadouken = new VirtualButton({
    text: "🌊", bottom: 15, right: 250, width: 55, height: 55, fontSize: 28,
    background: "rgba(0,0,0,0.7)", borderRadius: "50%", border: "2px solid blue",
    onPress: () => {
      if (miya.cd_hadouken > 0) return;
      if (miya.energi < 15) return;
      miya.cd_hadouken = 1.5;
      miya.energi -= 15;
      manaBarRef.setValue(miya.energi);
      miya.currentSkill = "hadouken";
      miya.skillTimer = 0.3;
      miya.tintColor = "blue";
      const id = crypto.randomUUID();
      listProjectileShuken[id] = {
        id, x: miya.x + miya.width/2, y: miya.y + miya.height/3,
        width: 40, height: 40, scene: miya.scene,
        dir: miya.animationDirection === "right" ? 1 : -1,
        speed: 550, damage: 20, lifeTime: 2.5, img: "projectileHadouken"
      };
      setTimeout(() => { if (miya.currentSkill === "hadouken") miya.tintColor = "white"; }, 300);
    }
  });
  
  // Tombol Shoryuken (T/Ultimate)
  const tombolShoryuken = new VirtualButton({
    text: "🔥", bottom: 80, right: 250, width: 55, height: 55, fontSize: 28,
    background: "rgba(0,0,0,0.7)", borderRadius: "50%", border: "2px solid red",
    onPress: () => {
      if (miya.cd_shoryuken > 0) return;
      if (miya.energi < 30) return;
      miya.cd_shoryuken = 8;
      miya.energi -= 30;
      manaBarRef.setValue(miya.energi);
      miya.currentSkill = "shoryuken";
      miya.skillTimer = 0.5;
      miya.vy = -500;
      miya.invincible = true;
      miya.tintColor = "red";
      setTimeout(() => {
        if (miya.skillTimer > 0) {
          physicsRef.aabbRange(miya.x, miya.y - 100, 120, 120, "kelomang,buff,guin,shuken", (enemy) => {
            enemy.hp -= 45;
            enemy.vy = -400;
            enemy.tintColor = "red";
          });
        }
      }, 200);
      setTimeout(() => {
        if (miya.currentSkill === "shoryuken") {
          miya.tintColor = "white";
          miya.invincible = false;
        }
      }, 500);
    }
  });
  
  return { tombolPukul, tombolUppercut, tombolRush, tombolHadouken, tombolShoryuken };
}