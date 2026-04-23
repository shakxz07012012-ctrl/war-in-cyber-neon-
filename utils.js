// ============ TAMBAHKAN FUNGSI INI KE UTILS.JS ============

// Fungsi aabbRange untuk collision area (bukan antar objek)
Collision.prototype.aabbRange = function(x, y, width, height, targetTypes, callback) {
  // Pastikan targetTypes adalah string, pisahkan dengan koma
  const targets = targetTypes.split(",");
  
  for(let type of targets) {
    const trimmedType = type.trim();
    const list = this.gameState.get(trimmedType);
    
    if(!list) continue;
    
    for(let id in list) {
      const obj = list[id];
      
      // Skip jika objek tidak aktif
      if(obj.scene === "inactive") continue;
      if(obj.hp !== undefined && obj.hp <= 0) continue;
      
      // Cek collision antara area dengan objek
      const isColliding = (
        x < obj.x + (obj.width || obj.colliderBox?.width || 50) &&
        x + width > obj.x &&
        y < obj.y + (obj.height || obj.colliderBox?.height || 50) &&
        y + height > obj.y
      );
      
      if(isColliding) {
        callback(obj);
      }
    }
  }
};

// Optional: Tambahkan fungsi timer yang lebih stabil
Utils.prototype.timer = function(dt, timerName, duration, onComplete) {
  if(this[timerName] === undefined) {
    this[timerName] = 0;
  }
  
  this[timerName] += dt;
  
  if(this[timerName] >= duration) {
    this[timerName] = 0;
    if(onComplete) onComplete();
    return true;
  }
  return false;
};

// Optional: Fungsi random range
Utils.prototype.rand = function(min, max) {
  return min + Math.random() * (max - min);
};