import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x808080);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const sphereObject = new THREE.SphereGeometry(2, 32, 32);
const floorObject = new THREE.PlaneGeometry(1000, 1000, 10, 10);
const boxObject = new THREE.BoxGeometry(5, 5);
const boxObject2 = new THREE.BoxGeometry(5, 5);

const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xd3ffd3,
});
const floorMaterial = new THREE.MeshBasicMaterial({
  color: 0x220022,
  side: THREE.DoubleSide,
});
const boxMaterial = new THREE.MeshBasicMaterial({
  color: 0x0e1f1f,
});
const boxMaterial2 = new THREE.MeshBasicMaterial({
  color: 0x0f100f,
});

const sphereMesh = new THREE.Mesh(sphereObject, sphereMaterial);
const floorMesh = new THREE.Mesh(floorObject, floorMaterial);
const boxMesh = new THREE.Mesh(boxObject, boxMaterial);
const boxMesh2 = new THREE.Mesh(boxObject2, boxMaterial2);

sphereMesh.add(camera);

scene.add(sphereMesh);
scene.add(floorMesh);
scene.add(boxMesh);
scene.add(boxMesh2);

camera.position.z = 5;

floorMesh.rotateX(Math.PI / 2);
floorMesh.position.y = -5;

boxMesh.position.x = -10;
boxMesh2.position.x = 10;

const loader = new THREE.TextureLoader();
loader.load('texture.png', texture => {
  sphereMesh.material.map = texture;
  sphereMesh.material.needsUpdate = true;
});

let keyboardEvent = "";
let isKeyDown = false;

const moveStepIncrease = 0.1;

let health = 100;

const update = () => {
  if (isKeyDown) {
    let sphereB3 = new THREE.Box3().setFromObject(sphereMesh);

    let boxB3 = new THREE.Box3().setFromObject(boxMesh);
    let box2B3 = new THREE.Box3().setFromObject(boxMesh2);

    let collision = sphereB3.intersectsBox(boxB3);
    let collision2 = sphereB3.intersectsBox(box2B3);

    if (collision || collision2) {
      health--;
      document.getElementById("health-bar")!.firstChild!.nodeValue =
        "Health: " + health;
    }

    if (keyboardEvent === "ArrowLeft") {
      sphereMesh.rotateY(moveStepIncrease);
    }
    if (keyboardEvent === "ArrowRight") {
      sphereMesh.rotateY(-moveStepIncrease);
    }

    if (keyboardEvent === "u") {
      sphereMesh.translateY(moveStepIncrease);
    }
    if (keyboardEvent === "d") {
      sphereMesh.translateY(-moveStepIncrease);
    }

    if (keyboardEvent === "ArrowUp") {
      sphereMesh.translateZ(-moveStepIncrease);
    }
    if (keyboardEvent === "ArrowDown") {
      sphereMesh.translateZ(moveStepIncrease);
    }
  }
};

const animate = () => {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);

  if (isKeyDown) update();
};

animate();

const onKeyDown = (event) => {
  keyboardEvent = event.key;
  isKeyDown = true;
};

const onKeyUp = (_event) => {
  keyboardEvent = "";
  isKeyDown = false;
};

const onResize = (_event) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);
window.addEventListener("resize", onResize, false);