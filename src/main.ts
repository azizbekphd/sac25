import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 10);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#app")?.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

// Impact point (world XZ coordinates)
const impact = new THREE.Vector2(0.0, 0.0);

let uniforms = {
  u_time: { value: 0 },
  u_impact: { value: impact }
};

let material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: `
    precision lowp float;

    uniform float u_time;
    uniform vec2 u_impact;

    varying float vHeight;

    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
        vec3 pos = position;

        float dist = distance(pos.xy, u_impact) + 0.5;

        float waveCenter = u_time * 3.0;
        float thickness = 1.0;

        float ring = 1.0 - smoothstep(0.0, thickness, abs(dist - waveCenter));

        float randomness = rand(pos.xz * 5.0);

        float falloff = exp(-dist * 0.5);
        float height = ring * falloff * (0.5 + 0.5 * randomness);

        pos.z += height;
        vHeight = height;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    precision lowp float;

    varying float vHeight;

    void main() {
        vec3 base = vec3(0.1, 0.2, 0.4);
        vec3 waveCol = vec3(0.6, 0.8, 1.0);
        vec3 color = mix(base, waveCol, clamp(vHeight * 10.0, 0.0, 1.0));
        gl_FragColor = vec4(color, 0.5);
    }
  `,
  side: THREE.DoubleSide,
  wireframe: false
});

// Plane with lots of subdivisions for smooth displacement
// let geometry = new THREE.PlaneGeometry(10, 10, 200, 200);
const geometry = new THREE.RingGeometry( 0.5, 4, 500, 500 )
let mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

function animate() {
  requestAnimationFrame(animate);

  uniforms.u_time.value += 0.02; // animate wave expansion
  uniforms.u_time.value %= 2;

  controls.update();
  renderer.render(scene, camera);
}
animate();
