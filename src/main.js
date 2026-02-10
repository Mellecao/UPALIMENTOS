/**
 * UP Alimentos - Main JavaScript
 * WebGL background with physics simulation, GSAP animations, and scroll storytelling
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// Configuration & State
// ==========================================================================

const config = {
  peanutCount: 300,
  peanutCountMobile: 180,
  peanutSize: 0.3,
  mouseForceRadius: 200,
  mouseForceStrength: 0.0015,
  gravity: 0.5,
  friction: 0.1,
  restitution: 0.6,
};

const state = {
  scene: null,
  camera: null,
  renderer: null,
  instancedMesh: null,
  bodies: [],
  engine: null,
  mouse: new THREE.Vector2(),
  mouseWorld: new THREE.Vector2(),
  loadingManager: null,
  peanutModel: null,
  reducedMotion: false,
  reducedData: false,
};

// ==========================================================================
// Utility Functions
// ==========================================================================

function isMobile() {
  return window.innerWidth < 768;
}

function checkPreferences() {
  state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  state.reducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
  
  if (state.reducedMotion) {
    config.peanutCount = 50;
    config.peanutCountMobile = 30;
  }
  
  if (state.reducedData) {
    config.peanutCount = Math.min(config.peanutCount, 100);
    config.peanutCountMobile = Math.min(config.peanutCountMobile, 60);
  }
}

// ==========================================================================
// Loading Manager & Progress
// ==========================================================================

function setupLoadingManager() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.querySelector('.loading-bar');
  const loadingPercentage = document.querySelector('.loading-percentage');
  
  state.loadingManager = new THREE.LoadingManager(
    // onLoad
    () => {
      setTimeout(() => {
        hideLoadingScreen();
      }, 500);
    },
    // onProgress
    (url, loaded, total) => {
      const progress = (loaded / total) * 100;
      loadingBar.style.width = `${progress}%`;
      loadingPercentage.textContent = `${Math.round(progress)}%`;
    },
    // onError
    (url) => {
      console.error('Error loading:', url);
    }
  );
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const tl = gsap.timeline();
  
  tl.to(loadingScreen, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: () => {
      loadingScreen.style.display = 'none';
      document.body.style.overflow = 'auto';
      initScrollAnimations();
    }
  });
}

// ==========================================================================
// Three.js Scene Setup
// ==========================================================================

function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  
  // Scene
  state.scene = new THREE.Scene();
  state.scene.background = new THREE.Color(0xFDF6E7);
  
  // Camera
  const aspect = window.innerWidth / window.innerHeight;
  state.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
  state.camera.position.z = 25;
  
  // Renderer
  state.renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  state.renderer.setSize(window.innerWidth, window.innerHeight);
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  state.scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 5, 5);
  state.scene.add(directionalLight);
  
  const directionalLight2 = new THREE.DirectionalLight(0xff6b35, 0.3);
  directionalLight2.position.set(-5, -5, 5);
  state.scene.add(directionalLight2);
}

// ==========================================================================
// Matter.js Physics Setup
// ==========================================================================

function initPhysics() {
  const { Engine, World, Bodies } = Matter;
  
  state.engine = Engine.create();
  state.engine.world.gravity.y = config.gravity;
  
  // Create boundaries (walls)
  const worldWidth = 40;
  const worldHeight = 30;
  const wallThickness = 1;
  
  const ground = Bodies.rectangle(0, worldHeight / 2, worldWidth, wallThickness, {
    isStatic: true,
    restitution: config.restitution,
    friction: config.friction,
  });
  
  const ceiling = Bodies.rectangle(0, -worldHeight / 2, worldWidth, wallThickness, {
    isStatic: true,
    restitution: config.restitution,
    friction: config.friction,
  });
  
  const leftWall = Bodies.rectangle(-worldWidth / 2, 0, wallThickness, worldHeight, {
    isStatic: true,
    restitution: config.restitution,
    friction: config.friction,
  });
  
  const rightWall = Bodies.rectangle(worldWidth / 2, 0, wallThickness, worldHeight, {
    isStatic: true,
    restitution: config.restitution,
    friction: config.friction,
  });
  
  World.add(state.engine.world, [ground, ceiling, leftWall, rightWall]);
}

// ==========================================================================
// Load and Create Peanuts
// ==========================================================================

function loadPeanuts() {
  const loader = new GLTFLoader(state.loadingManager);
  
  loader.load(
    '/peanut.glb',
    (gltf) => {
      state.peanutModel = gltf.scene;
      createInstancedPeanuts();
    },
    undefined,
    (error) => {
      console.error('Error loading peanut model:', error);
      createFallbackBackground();
    }
  );
}

function createInstancedPeanuts() {
  if (!state.peanutModel) return;
  
  // Get geometry and material from the loaded model
  let geometry, material;
  state.peanutModel.traverse((child) => {
    if (child.isMesh && !geometry) {
      geometry = child.geometry;
      material = child.material.clone();
    }
  });
  
  if (!geometry) {
    console.error('No geometry found in peanut model');
    createFallbackBackground();
    return;
  }
  
  // Create instanced mesh
  const count = isMobile() ? config.peanutCountMobile : config.peanutCount;
  state.instancedMesh = new THREE.InstancedMesh(geometry, material, count);
  state.scene.add(state.instancedMesh);
  
  // Create physics bodies and set initial transforms
  const { Bodies, World } = Matter;
  const dummy = new THREE.Object3D();
  
  for (let i = 0; i < count; i++) {
    // Random position within bounds
    const x = (Math.random() - 0.5) * 35;
    const y = (Math.random() - 0.5) * 25;
    const z = (Math.random() - 0.5) * 5;
    
    // Create physics body
    const body = Bodies.circle(x, y, config.peanutSize, {
      restitution: config.restitution,
      friction: config.friction,
      density: 0.001,
    });
    World.add(state.engine.world, body);
    state.bodies.push(body);
    
    // Set initial transform
    dummy.position.set(x, y, z);
    dummy.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    dummy.scale.setScalar(config.peanutSize);
    dummy.updateMatrix();
    state.instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  
  state.instancedMesh.instanceMatrix.needsUpdate = true;
}

function createFallbackBackground() {
  // Fallback gradient if WebGL or model loading fails
  const canvas = document.getElementById('bg-canvas');
  canvas.style.background = 'linear-gradient(135deg, #FDF6E7 0%, #F8FCFF 100%)';
}

// ==========================================================================
// Mouse Interaction
// ==========================================================================

function setupMouseInteraction() {
  const canvas = document.getElementById('bg-canvas');
  
  const updateMouse = (clientX, clientY) => {
    state.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    state.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    
    // Convert to world coordinates
    const vector = new THREE.Vector3(state.mouse.x, state.mouse.y, 0);
    vector.unproject(state.camera);
    state.mouseWorld.set(vector.x, vector.y);
  };
  
  canvas.addEventListener('mousemove', (e) => {
    if (!state.reducedMotion) {
      updateMouse(e.clientX, e.clientY);
    }
  });
  
  canvas.addEventListener('touchmove', (e) => {
    if (!state.reducedMotion && e.touches.length > 0) {
      updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    }
  });
}

function applyMouseForce() {
  if (state.reducedMotion || !state.bodies.length) return;
  
  const { Body } = Matter;
  
  state.bodies.forEach((body) => {
    const dx = body.position.x - state.mouseWorld.x;
    const dy = body.position.y - state.mouseWorld.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < config.mouseForceRadius / 10) {
      const force = config.mouseForceStrength * (1 - distance / (config.mouseForceRadius / 10));
      const forceX = (dx / distance) * force;
      const forceY = (dy / distance) * force;
      
      Body.applyForce(body, body.position, { x: forceX, y: forceY });
    }
  });
}

// ==========================================================================
// Animation Loop
// ==========================================================================

function animate() {
  requestAnimationFrame(animate);
  
  // Update physics
  if (!state.reducedMotion) {
    Matter.Engine.update(state.engine, 1000 / 60);
    applyMouseForce();
  }
  
  // Update instanced mesh transforms
  if (state.instancedMesh && state.bodies.length > 0) {
    const dummy = new THREE.Object3D();
    
    state.bodies.forEach((body, i) => {
      dummy.position.set(body.position.x, body.position.y, (Math.sin(Date.now() * 0.001 + i) * 0.5));
      dummy.rotation.set(
        body.angle * 0.5,
        body.angle * 0.3 + Date.now() * 0.0001,
        body.angle
      );
      dummy.scale.setScalar(config.peanutSize);
      dummy.updateMatrix();
      state.instancedMesh.setMatrixAt(i, dummy.matrix);
    });
    
    state.instancedMesh.instanceMatrix.needsUpdate = true;
  }
  
  // Render
  state.renderer.render(state.scene, state.camera);
}

// ==========================================================================
// Scroll Animations (GSAP + ScrollTrigger)
// ==========================================================================

function initScrollAnimations() {
  if (state.reducedMotion) {
    // If reduced motion, skip complex animations
    document.querySelectorAll('.section-content, .hero-content').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }
  
  // Hero section fade in
  gsap.from('.hero-content', {
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: 'power3.out',
  });
  
  // Animate sections on scroll
  gsap.utils.toArray('.section-content').forEach((section) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
      },
      opacity: 0,
      y: 100,
      scale: 0.95,
    });
  });
  
  // Feature cards stagger
  gsap.utils.toArray('.feature-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      },
      opacity: 0,
      y: 50,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
    });
  });
  
  // Benefit items stagger
  gsap.utils.toArray('.benefit-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
      },
      opacity: 0,
      x: -50,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
    });
  });
  
  // Form animation
  gsap.from('.contact-form', {
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top 80%',
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power2.out',
  });
}

// ==========================================================================
// Menu Interactions
// ==========================================================================

function initMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuLinks = document.querySelectorAll('[data-menu-link]');
  
  let focusableElements = [];
  let firstFocusable = null;
  let lastFocusable = null;
  
  const openMenu = () => {
    menuOverlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Setup focus trap
    focusableElements = Array.from(
      menuOverlay.querySelectorAll('button, a[href]')
    );
    firstFocusable = focusableElements[0];
    lastFocusable = focusableElements[focusableElements.length - 1];
    
    // Focus close button
    setTimeout(() => menuClose.focus(), 100);
    
    // Animate menu links
    if (!state.reducedMotion) {
      gsap.to('.menu-link', {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
      });
    }
  };
  
  const closeMenu = () => {
    menuOverlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    
    // Return focus to toggle button
    menuToggle.focus();
    
    // Reset menu links
    if (!state.reducedMotion) {
      gsap.set('.menu-link', { opacity: 0, x: -20 });
    }
  };
  
  // Event listeners
  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
    });
  });
  
  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
      closeMenu();
    }
    
    // Focus trap
    if (menuOverlay.classList.contains('active') && e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
  
  // Click outside to close
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) {
      closeMenu();
    }
  });
}

// ==========================================================================
// Form Handling
// ==========================================================================

function initForm() {
  const form = document.getElementById('contact-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('Form submitted:', data);
    
    // Show success message (placeholder)
    alert('Obrigado pelo contato! Entraremos em contato em breve.');
    form.reset();
  });
}

// ==========================================================================
// Window Resize Handler
// ==========================================================================

function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  state.camera.aspect = width / height;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(width, height);
}

// ==========================================================================
// Initialize Everything
// ==========================================================================

function init() {
  checkPreferences();
  setupLoadingManager();
  initThreeJS();
  initPhysics();
  loadPeanuts();
  setupMouseInteraction();
  initMenu();
  initForm();
  
  window.addEventListener('resize', handleResize);
  
  animate();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
