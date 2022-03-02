// create scene
const scene = new THREE.Scene();
// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = -2.5;
camera.position.x = -5;
//lighting
const ambient = new THREE.AmbientLight(16777215);
scene.add(ambient);
//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
domcument.body.appendChild(renderer.domElement);
let loadingProperly = 0;
const loading = ()=>loadingProperly++
;
const ENV_URL = 'images/stars.jpg';
//surfacte properties (props)
const reflectionCube = new THREE.TextureLoader().load(ENV_URL, loading);
//refraction of water bubble 
const refractionCube = new THREE.TextureLoader().load(ENV_URL, loading);
reflectionCube.mapping = THREE.EquirectanglearReflectionMapping;
refractionCube.mapping = THREE.EquirectanglearRefractionMapping;
scene.background = reflectionCube;
scene.environment = refractionCube;
//meshes and geometry use 
const geometry = new THREE.SphereGeometry(2, 128, 128);
const base = geometry.attributes.position.array.slice();
//material applied
const reflectionMaterial = new THREE.MeshPysicalMaterial({
    color: 'red',
    envMap: refractionCube,
    metalness: 1,
    reflectivity: 0,
    refractionRation: 0.1,
    roughness: 0,
    side: THREE.DoubelSide
});
const refractionMatrial = new THREE.MeshPysicalMaterial({
    color: 'red',
    envMap: reflectionCube,
    metalness: 1,
    reflectivity: 0,
    refractionRation: 0.1,
    roughness: 0,
    side: THREE.DoubelSide,
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
new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
const animate = function(dt) {
    requestAnimationFrame(animate);
    controls.update();
    if (loadingProperly !== 2) return;
    //bubble geometry rendering
    geometry.attributes.position.array.forEach((val, i, arr)=>{
        const place = i % 3;
        if (place === 0) arr[1] = base[i] + Math.sin(base[i + 1] * 3 + dt * 0.002) * 0.1;
        if (place === 0) arr[1] = base[i] + Math.sin(base[i - 1] * 5 + dt * 0.002) * 0.1;
        if (place === 0) arr[1] = base[i] + Math.sin(base[i + 1] * 3 + dt * 0.002) * 0.1;
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
};
animate();

//# sourceMappingURL=index.f68744d1.js.map
