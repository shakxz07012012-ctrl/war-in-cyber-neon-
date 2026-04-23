function logikaMonsterJungler(dt, miya, monster, physics){
  // Inisialisasi properti jika belum ada
  monster.useCollider = monster.useCollider ?? true
  monster.colliderBox = monster.colliderBox ?? {width : 50, height : 50}
  monster.speed = monster.speed ?? 100
  monster.gravity = monster.gravity ?? 2000
  monster.vx = monster.vx ?? 0
  monster.vy = monster.vy ?? 0
  monster.tintColor = monster.tintColor ?? "white"
  monster.isChase = monster.isChase ?? false
  
  physics.applyPhysics(dt, monster)
  monster.vy += monster.gravity * dt
  
  const dx = miya.x - monster.x
  const dis = Math.abs(dx)
  
  //jika jarak miya dan musuh sudah lebih kecil dari 300 maka buat monster mengejar
  if(dis < 300){
    monster.isChase = true
  }
  
  if(monster.hp <= 0){
    monster.scene = "inactive"
    const dropItem = getItem()
    const id = crypto.randomUUID()
    if(dropItem && !monster.isDead){
      monster.isDead = true
      drawItem[id] = {
        ...item[dropItem]
      }
      drawItem[id].x = monster.x + monster.width/2
      drawItem[id].y = monster.y + monster.height/2
      drawItem[id].id = id
    }
    return
  }
  
  if(monster.isChase){
    if(dis > 60){
      if(dx > 5){
        monster.vx += monster.speed * dt
        monster.vx = Math.min(monster.vx, 200)
      } else if(dx < -5){
        monster.vx -= monster.speed * dt
        monster.vx = Math.max(monster.vx, -200)
      }
    } else {
      monster.vx = 0
    }
  }
}

function hpMonster(dt, monster, camera, renderer){
  if(monster.hp <= 0) return
  monster.hpVisual = monster.hpVisual ?? monster.hp;
  monster.hpVisual -= (monster.hpVisual - monster.hp) * 5 * dt
  
  renderer.fillRect(monster.x - camera.x, monster.y - camera.y - 10, monster.hpVisual, 8, "maroon")
  renderer.fillRect(monster.x - camera.x, monster.y - camera.y - 10, monster.hp, 8, "red")
}

function panahMiyaVsMonster(dt, panah, physics){
  physics.aabb(panah, "buff", (g1, g2)=>{
    if(g2.scene === "inactive") return;
    g2.hp -= 10
    g2.tintColor = "red"
    delete panah[g1.id]
  })
}

function miyaVsMonster(dt, hero, hpBar, physics){
  physics.aabb(hero, "buff", (g1, g2)=>{
    if(g2.scene === "inactive") return;
    g1.hp -= 0.8
    hpBar.setValue(g1.hp);
    g1.tintColor = "red"
  })
}