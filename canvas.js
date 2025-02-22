const canvas = document.querySelector('canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// logo position
const ingo = document.querySelector('.card')
let ingoXY = ingo.getBoundingClientRect();
let ingoTop = Math.round(ingoXY.top)
let ingoLeft = Math.round(ingoXY.left)
let ingoRight = Math.round(ingoXY.right)

// decide id 'click' turns on or off rain
let rainyDay = false
// to be able to stop animation
let requestId
// to hinder 'click' from stopping animation before rain is gone
let animTime = true

const rainArray = []
const splashArray = []

// moving rain sideways
let wind = -1
// moving rain downwards
let rainFallSpeed = 10
// calculate when rain hits logo if screen resizes
let ingoTopDiff = ingoTop % rainFallSpeed

// start/stop rain when 'click' in window
canvas.addEventListener('click', () => {
  if (rainyDay) {
    setTimeout(stopAnimate, 3000);
    rainyDay = false
  } else {
    if (animTime) {
      runAnimate()
      rainyDay = true
      animTime = false
    }
  }
})

// keep code intact while resizing window
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  let ingoXY = ingo.getBoundingClientRect();
  ingoTop = Math.round(ingoXY.top)
  ingoLeft = Math.round(ingoXY.left)
  ingoRight = Math.round(ingoXY.right)
  ingoTopDiff = ingoTop % rainFallSpeed
})

class Rain{
  constructor(){
    this.x = Math.random() * canvas.width
    this.y = 0
    this.radius = 1.2
    this.dx = wind
    this.dy = rainFallSpeed
  }

  update(){
    this.x += this.dx
    this.y += this.dy
    if (this.y >= canvas.height) {
      splashArray.push(new Splash(this.x, canvas.height,  this.radius))
    } else if (this.x > ingoLeft && this.x < ingoRight && this.y === ingoTop - ingoTopDiff) {
      splashArray.push(new Splash(this.x, ingoTop, this.radius))
    }
  }

  draw(){
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

class Splash{
  constructor(rainX, splashHeight, rainRadius){
    this.x = rainX
    this.y = splashHeight
    this.radius = Math.random() * (rainRadius * 0.7)
    this.dx = Math.random() * 3 -1.5
    this.dy = Math.random() * -4
  }

  update(){
    this.x += this.dx
    this.y += this.dy
    this.dy += 0.2
  }

  draw(){
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

// produce new rain
function init(){
  for (let i = 0; i < 10; i++){
    rainArray.push(new Rain())
  }
}

function handleRain(){
  for (let i = 0; i < rainArray.length; i++){
    rainArray[i].update()
    rainArray[i].draw()
    if (rainArray[i].y >= canvas.height) {
      rainArray.splice(i, 1)
    } else if (rainArray[i].x > ingoLeft && rainArray[i].x < ingoRight && rainArray[i].y === ingoTop - ingoTopDiff){
      rainArray.splice(i, 1)
    }
  }
}

function handleSplash(){
  for (let i = 0; i < splashArray.length; i++){
    splashArray[i].update()
    splashArray[i].draw()
    if (splashArray[i].y > canvas.height) {
      splashArray.splice(i, 1)
    }
  }
}

// animation loop
function animate(){
  requestId = undefined;
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  handleRain()
  handleSplash()
  if (rainyDay) {
    init()
  }
  runAnimate()
}

function runAnimate(){
  if (!requestId) {
    requestId = window.requestAnimationFrame(animate);
 }
}

function stopAnimate() {
  if (requestId) {
     window.cancelAnimationFrame(requestId);
     requestId = undefined;
     animTime = true
    }
}
