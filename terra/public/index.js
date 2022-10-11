import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';

let cena;
let camera;
let renderer;
var clock = new THREE.Clock;

const canvas = document.querySelector('.fundo');

cena = new THREE.Scene();

const fov = 60;
const aspecto = window.innerWidth / window.innerHeight;
const proximidade = .1;
const distancia = 100;

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
    map: THREE.ImageUtils.loadTexture('texture/starsMilk.jpg'),
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

terraMesh.rotateZ(0.3);
nuvemMesh.rotateZ(0.3);

const frustum = new THREE.Frustum()
const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
frustum.setFromProjectionMatrix(matrix)

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

let aumenta = 0;
let mudaPosicao = 0;
let valor = 0.0005;

let vetor = new THREE.Vector3();

let nuvemScale, terraScale, nuvemPosition;

function render() {

    terraMesh.rotation.y += 0.001;
    nuvemMesh.rotation.y += 0.0025;
    estrelaMesh.rotation.y += 0.001;

    // console.log(`x = ${innerWidth}, y = ${innerHeight}`)

    let tempo = clock.getElapsedTime();
    
    if (frustum.containsPoint(vetor)) {
        vetor.x = terraMesh.position.x + (0.1 + (tempo / 5));
        vetor.y = terraMesh.position.y;
        vetor.z = terraMesh.position.z;
        
        terraMesh.position.set(tempo / 6, 0, 1);

        nuvemMesh.position.set(tempo / 6, 0, 1);

        terraMesh.scale.set(0.1 + (tempo / 5), 
                            0.1 + (tempo / 5), 
                            0.1 + (tempo / 5));

        nuvemMesh.scale.set(0.1 + (tempo / 5), 
                            0.1 + (tempo / 5), 
                            0.1 + (tempo / 5));

        nuvemScale = nuvemMesh.scale.x;
        terraScale = terraMesh.scale.x;
        nuvemPosition = nuvemMesh.position.x;
        
    } else {
        if(mudaPosicao == 0){
            terraMesh.position.x -= 0.005;
            nuvemMesh.position.x -= 0.005;
            if(((nuvemMesh.position.x * 100) / nuvemPosition) <= -100) mudaPosicao = 1;
        } 

        if (mudaPosicao == 1) {
            terraMesh.position.x += 0.005;
            nuvemMesh.position.x += 0.005;
            if(((nuvemMesh.position.x * 100) / nuvemPosition) >= 100) mudaPosicao = 0;
        }

        if (aumenta == 0) {
            terraMesh.scale.x -= valor;
            terraMesh.scale.y -= valor;
            terraMesh.scale.z -= valor;

            nuvemMesh.scale.x -= valor;
            nuvemMesh.scale.y -= valor;
            nuvemMesh.scale.z -= valor;

            if (((nuvemMesh.scale.x * 100) / nuvemScale) <= 20) aumenta = 1;
        }

        if (aumenta == 1) {
            terraMesh.scale.x += valor;
            terraMesh.scale.y += valor;
            terraMesh.scale.z += valor;

            nuvemMesh.scale.x += valor;
            nuvemMesh.scale.y += valor;
            nuvemMesh.scale.z += valor;

            if (((nuvemMesh.scale.x * 100) / nuvemScale) >= 100) aumenta = 0;
        }
    }
    renderer.render(cena, camera);
}

animate();