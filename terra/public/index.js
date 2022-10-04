import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';

let cena;
let camera;
let renderer;
const canvas = document.querySelector('.fundo');

cena = new THREE.Scene();

const fov = 60;
const aspecto = window.innerWidth / window.innerHeight;
const proximidade = 0.1;
const distancia = 1000;

camera = new THREE.PerspectiveCamera(fov, aspecto, proximidade, distancia);
camera.position.z = 2;
cena.add(camera);

renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);

const controls = new OrbitControls(camera, renderer.domElement);

const terraGeometry = new THREE.SphereGeometry(0.6, 32, 32);

const terraMaterial = new THREE.MeshPhongMaterial({
    roughness: 1,
    metalness: 0,
    map: THREE.ImageUtils.loadTexture('texture/mapa2.jpg'),
    bumpMap: THREE.ImageUtils.loadTexture('texture/specularmap.jpg'),
    bumpScale: 0.3
});

const terraMesh = new THREE.Mesh(terraGeometry, terraMaterial);
cena.add(terraMesh);

const nuvemGeometry = new THREE.SphereGeometry(0.63, 32, 32);

const nuvemMaterial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('texture/nuvemTerra.png'),
    transparent: true,
});

const nuvemMesh = new THREE.Mesh(nuvemGeometry, nuvemMaterial);
cena.add(nuvemMesh);

const estrelaGeometry = new THREE.SphereGeometry(80, 64, 64);

const estrelaMaterial = new THREE.MeshBasicMaterial({
    map : THREE.ImageUtils.loadTexture('texture/galaxy.png'),
    side: THREE.BackSide
});

const estrelaMesh = new THREE.Mesh(estrelaGeometry, estrelaMaterial);
cena.add(estrelaMesh);

const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
cena.add(ambientlight);

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(5, 3, 5);
cena.add(pointLight);

const Helper = new THREE.PointLightHelper(pointLight);
cena.add(Helper);

window.addEventListener('resize', () => {
    camera.aspecto = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}, false);

terraMesh.rotateZ (0.30);
nuvemMesh.rotateZ (0.30);

const animate = () => {
    requestAnimationFrame(animate);
    estrelaMesh.rotateX(0.002)
    terraMesh.rotateY (0.0015);
    nuvemMesh.rotateY (0.0025);  
    controls.update();
    render();
};

const render = () => {
    renderer.render(cena, camera);
}

animate();