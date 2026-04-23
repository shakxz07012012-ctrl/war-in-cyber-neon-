// Kita buat supaya saat musuh mati makan akan mengeluarkan item
const drawItem = {}
const item = {
  heal : {x:0,y:0,width:40,height:40,img:"heal",lifeTime:10, duration:4, scene:"1", type :"item"},
  energi : {x:0,y:0,width:40,height:40,img:"energi",lifeTime:10, duration:5, scene:"1", type :"item"},
  peluruGanda : {x:0,y:0,width:40,height:40,img:"peluruGanda",lifeTime:10, duration:4, scene:"1", type :"item"},
}

const listItem = [
  {nama:"heal", peluang:0.3},
  {nama:"energi", peluang:0.3},
  {nama:"peluruGanda", peluang:0.4},
  ]
  
function getItem(){
  let step = 0
  let rand = Math.random()
  for(let itm of listItem){
    step += itm.peluang
    if(rand<step)return itm.nama
  }
  return null
}

function miyaMengambilItem(hero, physics){
  physics.aabb(hero, "item",(miya, item)=>{
    miya.statusItem = item.img
    miya.durasiItem = item.duration
    delete drawItem[item.id]
  })
}

// Timer untuk efek blinking yang aman
let itemBlinkTimers = {};

function miyaMenerimaEfekItem(hpBar, manaBar, hero, dt, utils){
  const miya = hero.miya
  const GAME_CONFIG = {
    HEAL_AMOUNT: 5,
    ENERGI_AMOUNT: 5,
    MAX_HP: 150,
    MAX_ENERGI: 100
  };
  
  switch(miya.statusItem){
    case "heal":
      miya.hp = Math.min(GAME_CONFIG.MAX_HP, miya.hp + GAME_CONFIG.HEAL_AMOUNT * dt)
      hpBar.setValue(miya.hp)
      
      miya.durasiItem -= dt
      // Efek blinking sederhana tanpa splitTime
      if(Math.floor(Date.now() / 100) % 2 === 0) {
        miya.tintColor = "lime"
      } else {
        miya.tintColor = "white"
      }
      
      if(miya.durasiItem<=0){
        miya.statusItem = ""
        miya.durasiItem = 0
        miya.tintColor = "white"
      }
      break
    case "energi":
      miya.energi = Math.min(GAME_CONFIG.MAX_ENERGI, miya.energi + GAME_CONFIG.ENERGI_AMOUNT * dt)
      manaBar.setValue(miya.energi)
      
      miya.durasiItem -= dt
      // Efek blinking sederhana tanpa splitTime
      if(Math.floor(Date.now() / 100) % 2 === 0) {
        miya.tintColor = "yellow"
      } else {
        miya.tintColor = "white"
      }
      
      if(miya.durasiItem<=0){
        miya.statusItem = ""
        miya.durasiItem = 0
        miya.tintColor = "white"
      }
      break
    case "peluruGanda":
      miya.durasiItem -= dt
      // Efek blinking sederhana tanpa splitTime
      if(Math.floor(Date.now() / 100) % 2 === 0) {
        miya.tintColor = "purple"
      } else {
        miya.tintColor = "white"
      }
      
      if(miya.durasiItem<=0){
        miya.statusItem = ""
        miya.durasiItem = 0
        miya.tintColor = "white"
      }
      break
  }
}