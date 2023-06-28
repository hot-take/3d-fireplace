import * as THREE from 'three';
import './style.css' 
import gsap from "gsap";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Nebula, { Emitter, SpriteRenderer } from "three-nebula";
import json from "./assets/fire.json";

//scene
const scene = new THREE.Scene()

//model
const loader= new GLTFLoader()
loader.load('assets/scene.glb',function(glb){
  console.log(glb)
  const model= glb.scene;
  model.scale.set(0.03,0.03,0.03)
  scene.add(model);
})

//sizes
const sizes = {
  width:window.innerWidth,
  height:window.innerHeight,
}

//camera
const camera = new THREE.PerspectiveCamera(45,sizes.width/sizes.height,0.1,100)
camera.position.z=30
scene.add(camera)

//light
const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(2,2,5)
scene.add(light)


//renderer
const canvas = document.querySelector(".webgl")
const renderer= new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width,sizes.height)
renderer.render(scene,camera)
renderer.setPixelRatio(2)

//fire
function animate(nebula) {
  requestAnimationFrame(() => animate(nebula));
  nebula.update();
  renderer.render(scene, camera);
}

Nebula.fromJSONAsync(json.particleSystemState, THREE).then(loaded => {
loaded.emitters.forEach(emitter => {
emitter.position.set(-0.5,9,-3)
})
 const nebulaRenderer = new SpriteRenderer(scene, THREE);
 const nebula = loaded.addRenderer(nebulaRenderer);
 const startButton = document.getElementById("startButton");
 startButton.addEventListener("click", () => {
  animate(nebula); 
});
});


//resize
window.addEventListener("resize",() => {
  sizes.width=window.innerWidth
  sizes.height=window.innerHeight
  camera.aspect=sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width,sizes.height)
})




//controls
const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true
controls.autoRotate= true



const loop =() =>{
  controls.update()
  renderer.render(scene,camera,Nebula)
  window.requestAnimationFrame(loop)
}
loop()

//text animation
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let interval = null;

document.querySelector("a").onmouseover = (event) => {
  let iteration = 0;

  clearInterval(interval);

  interval = setInterval(() => {
    event.target.innerText = event.target.innerText
      .split("")
      .map((letter, index) => {
        if (index < iteration) {
          return event.target.dataset.value[index];
        }

        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iteration >= event.target.dataset.value.length) {
      clearInterval(interval);
    }

    iteration += 1 / 3;
  }, 30);
};




//timeline animations
const tl=gsap.timeline({defaults:{duration:0.8}})
tl.fromTo("nav",{y:"-100%"},{y:"0%"})