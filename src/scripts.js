import * as THREE from 'three';
import {OrbitControls} from 'three'
// create scene
const scene = new THREE.Scene();


// camera
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000 )
camera.position.z = -2.5;
camera.position.x = -5

//lighting
const ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let loadingProperly = 0;
const loading = () => loadingProperly++;
const ENV_URL = 'images/stars.jpg';

    //surfacte properties (props)
const reflectionCube = new THREE.TextureLoader().load(ENV_URL, loading);
    //refraction of water bubble 
const refractionCube = new THREE.TextureLoader().load(ENV_URL, loading);
reflectionCube.mapping = THREE.EquirectangularReflectionMapping;
refractionCube.mapping = THREE.EquirectangularRefractionMapping;

scene.background = reflectionCube;
scene.environment = refractionCube;


//meshes and geometry use 
const geometry = new THREE.SphereGeometry(2, 128, 128 );
const base = geometry.attributes.position.array.slice();

//material applied
const reflectionMaterial = new THREE.MeshPhysicalMaterial({
    color: 'red', //0xc3e4f9
    envMap: refractionCube,
    metalness: 1,
    reflectivity: 0,
    refractionRation: .1,
    roughness: 0,
    side: THREE.DoubleSide
});


const refractionMatrial = new THREE.MeshPhysicalMaterial({
    color: 'red', //0xc3e4f9
    envMap: reflectionCube,
    metalness: 1,
    reflectivity: 0,
    refractionRation: .1,
    roughness: 0,
    side: THREE.DoubleSide,
    transmission: 1,
    transparent: true
});

const refractionShere = new THREE.Mesh(geometry, refractionMatrial);
const reflectionShere = new THREE.Mesh(geometry, reflectionMaterial);

const sphere = new THREE.Object3D();
sphere.add(refractionShere);
sphere.add(reflectionShere);

scene.add(sphere);
sphere.lookAt(camera.position);
camera.lookAt(sphere.position);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 



//animate function
const animate = function(dt) {
    requestAnimationFrame(animate);
    controls.update();
    if (loadingProperly !== 2 ) return; 

    //bubble geometry rendering
    geometry.attributes.position.array.forEach((val, i, arr ) => {
        const place = i % 3;

        if (place === 0 ) {
            arr[1] = base[i] + Math.sin(base[i + 1 ] * 3 + dt * .002) * .1;   
        }
        if (place === 0 ) {
            arr[1] = base[i] + Math.sin(base[i - 1 ] * 5 + dt * .002) * .1;
        }
        if (place === 0 ) {
        arr[1] = base[i] + Math.sin(base[i + 1 ] * 3 + dt * .002) * .1;
        }
    });

    //updat bubble positions and window resize
    geometry.computerVertexNormals();
    geometry.normalizeNormales();
    geometry.attributes.position.needsUpdate = true; 

    // function windowResize() {
    //     camera.aspect = window.innerWidth / window.innerHeight;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(window.innerWidth, window.innerHeight);      
    // }
    // window.addEventListener('resize', windowResize, false);


    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    
}

animate();


