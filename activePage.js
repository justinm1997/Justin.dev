var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname){
  for(tablink of tablinks){
      tablink.classList.remove("active-link");
  }
  for(tabcontent of tabcontents){
    tabcontent.classList.remove("active-tab");
  }
  event.currentTarget.classList.add("active-link");
  document.getElementById(tabname).classList.add("active-tab");
}


// ----------------------menu open / close

var sidemeu = document.getElementById("sidemenu");

function openmenu(){
  sidemeu.style.right = "0";
}

function closemenu(){
  sidemeu.style.right = "-200px";
}

//  ----------------- contacts form
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwxHGkWpzbBFZpEjT2klwQy5AV_ZF3eAt_xIetjuCJ0_SvSQGiS8lIROHThdIXDzMjU/exec'
  const form = document.forms['submit-to-google-sheet']
  const msg = document.getElementById("msg")

  form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => {
        msg.innerHTML = "Message sent successfully"
        setTimeout(function(){
          msg.innerHTML = ""
      },5000)
      form.reset()
    })
      .catch(error => console.error('Error!', error.message))
  })



  // -----------------   active nav bar 

  const navLinkEls = document.querySelectorAll('.nav__link');

  navLinkEls.forEach(navLinkEl => {
    navLinkEl.addEventListener('click', () => {
      document.querySelector('.active')?.classList.remove('active');
      navLinkEl.classList.add('active');
    });
  });


  //---------------------- scroll active -------------


  const navLinksEls = document.querySelectorAll('.nav__link');
  const sectionEls = document.querySelectorAll('.sections');

  let currentSection = 'home';
  window.addEventListener('scroll', () => {
    sectionEls.forEach(sectionEl => {
      if (window.scrollY >= (sectionEl.offsetTop - sectionEl.clientHeight / 2)) {
        currentSection = sectionEl.id;
      }
    });
    
  navLinksEls.forEach(navLinksEl => {
    if (navLinksEl.href.includes(currentSection)) {
      document.querySelector('.active').classList.remove('active');
      navLinksEl.classList.add('active');
    }
  });
  });


  //---------------------test

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;


// get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
}

window.addEventListener('mousemove',
  function(event) {
      mouse.x = event.x;
      mouse.y = event.y;
    }
);


// create particle

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
// method to draw individual particles

draw() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
  ctx.fillStyle = 'rgba(144,1,1,1)';
  ctx.fill();
}
  


// check particle postition, check mouse, move the particles, draw the particle

update() {
  if (this.x > canvas.width || this.x < 0 ) {
      this.directionX = -this.directionX;
}
if (this.y > canvas.height || this.y < 0) {
  this.directionY = -this.directionY;
}



// check collision detection
let dx = mouse.x - this.x;
let dy = mouse.y - this.y;
let distance = Math.sqrt(dx*dx + dy*dy);
if (distance < mouse.radius + this.size){
  if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
    this.x += 10;
  }
  if (mouse.x > this.x && this.x > this.size * 10) {
    this.x -= 10;
  }
  if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
    this.y += 10;
  }
  if (mouse.y > this.y && this.y > this.size * 10) {
    this.y -= 10;
  }
}
this.x += this.directionX;
this.y += this.directionY;
// draw particle
this.draw();
}
}


// create particle array
function init () {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles*1; i++) {
    let size = (Math.random() * 5) + 1;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let directionX = (Math.random() * 5) - 2.5;
    let directionY = (Math.random() * 5) - 2.5;
    let color = '#8C5523';

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));

  }
}


// check if particles are close enough
function connect(){
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance = (( particlesArray[a].x - particlesArray[b].x)
       * (particlesArray[a].x - particlesArray[b].x))
      + ((particlesArray[a].y - particlesArray[b].y) *
      (particlesArray[a].y - particlesArray[b].y));
      if (distance < (canvas.width/7) * (canvas.height/7)) {
        opacityValue = 1 - (distance/20000);
        ctx.strokeStyle='rgba(144,0,0,1)' + opacityValue + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}



// animation loop

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
}
connect();
}

// Resize event
window.addEventListener('resize',
  function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius - ((canvas.height/80) * (canvas.height/80));
    init();
  }
);

// mouse out event
window.addEventListener('mouseout',
  function(){
    mouse.x = undefined;
    mouse.x = undefined;
  }
)

init();
animate();


// ---------------------------test smaller screens




