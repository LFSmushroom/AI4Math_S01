/**
 * AI4Math-Cosmos MVP — Three.js Star Field Visualization
 *
 * Features:
 *  - 3D star field with ~100 mathematical nodes (solved=glowing, unsolved=dim)
 *  - Connection lines between related nodes
 *  - OrbitControls (drag rotate, scroll zoom)
 *  - Hover highlight + click info panel
 *  - WebSocket AI solve with lighting animation
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

// ── Globals ──────────────────────────────────────────────────────────
const API_BASE = window.location.origin;
let scene, camera, renderer, labelRenderer, controls;
let raycaster, mouse;
let nodesData = [];
let edgesData = [];
let starMeshes = [];       // { mesh, glowMesh, nodeData }
let lineSegments = null;
let hoveredStar = null;
let selectedStar = null;
let wsConnection = null;
let simulateMode = true;

// DOM refs
const container = document.getElementById("canvas-container");
const infoPanel = document.getElementById("info-panel");
const panelName = document.getElementById("panel-name");
const panelArea = document.getElementById("panel-area");
const panelDesc = document.getElementById("panel-desc");
const panelImportance = document.getElementById("panel-importance");
const panelDifficulty = document.getElementById("panel-difficulty");
const solveBtn = document.getElementById("solve-btn");
const panelStatus = document.getElementById("panel-status");
const toast = document.getElementById("toast");
const simulateCheck = document.getElementById("simulate-check");

// ── Color map by area ─────────────────────────────────────────────────
const AREA_COLORS = {
    "Number Theory": 0x7ec8f8,
    "Algebra": 0xf87171,
    "Geometry": 0x4ade80,
    "Topology": 0xfbbf24,
    "Analysis": 0xc084fc,
    "Graph Theory": 0x38bdf8,
    "Combinatorics": 0xfb923c,
    "Logic": 0x818cf8,
    "Complex Analysis": 0x34d399,
    "Linear Algebra": 0xfb7185,
    "Complexity Theory": 0xa78bfa,
    "Differential Geometry": 0x2dd4bf,
    "Algebraic Geometry": 0xf472b6,
    "PDE": 0x60a5fa,
    "Probability": 0xfacc15,
    "Game Theory": 0xe879f9,
    "Category Theory": 0x22d3ee,
    "Set Theory": 0x94a3b8,
    "Functional Analysis": 0xa3e635,
    "Dynamical Systems": 0xfdba74,
    "Group Theory": 0xfda4af,
    "Harmonic Analysis": 0x86efac,
    "Information Theory": 0x67e8f9,
    "Mathematical Physics": 0xd8b4fe,
    "Operator Algebras": 0x6ee7b7,
    "Computability": 0x93c5fd,
};

function getAreaColor(area) {
    return AREA_COLORS[area] || 0x888888;
}

// ── Scene initialization ─────────────────────────────────────────────

function initScene() {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Label renderer (for CSS2D)
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    container.appendChild(labelRenderer.domElement);

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 80);
    camera.position.set(8, 6, 16);
    camera.lookAt(0, 0, 0);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 35;
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.15;

    // Raycaster
    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.3;
    mouse = new THREE.Vector2();

    // Ambient light
    scene.add(new THREE.AmbientLight(0x222244, 0.5));

    // Background nebula particles
    createBackgroundParticles();

    // Resize
    window.addEventListener("resize", onResize);
}

// ── Background nebula particles ──────────────────────────────────────

function createBackgroundParticles() {
    const count = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        // Random sphere distribution
        const r = 20 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const c = new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 0.3, 0.3 + Math.random() * 0.3);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    scene.add(new THREE.Points(geometry, material));
}

// ── Star creation ────────────────────────────────────────────────────

function createStarSprite(color, size, opacity) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    const c = new THREE.Color(color);
    gradient.addColorStop(0, `rgba(${Math.floor(c.r * 255)},${Math.floor(c.g * 255)},${Math.floor(c.b * 255)},1)`);
    gradient.addColorStop(0.2, `rgba(${Math.floor(c.r * 255)},${Math.floor(c.g * 255)},${Math.floor(c.b * 255)},0.8)`);
    gradient.addColorStop(0.5, `rgba(${Math.floor(c.r * 255)},${Math.floor(c.g * 255)},${Math.floor(c.b * 255)},0.2)`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: opacity,
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size, size, 1);
    return sprite;
}

function createGlowRing(color, size) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    const c = new THREE.Color(color);
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.3, `rgba(${Math.floor(c.r * 255)},${Math.floor(c.g * 255)},${Math.floor(c.b * 255)},0.4)`);
    gradient.addColorStop(0.6, `rgba(${Math.floor(c.r * 255)},${Math.floor(c.g * 255)},${Math.floor(c.b * 255)},0.1)`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.5,
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size, size, 1);
    return sprite;
}

function createStarNode(nodeData) {
    const { pos, status, area, importance } = nodeData;
    const color = getAreaColor(area);
    const baseSize = 0.4 + importance * 0.2;

    const group = new THREE.Group();

    if (status === "solved") {
        // Glowing star with glow ring
        const star = createStarSprite(color, baseSize, 0.9);
        const glow = createGlowRing(color, baseSize * 3.5);
        group.add(star);
        group.add(glow);
        group.userData = { star, glow, isSolved: true };
    } else {
        // Dim star, barely visible
        const star = createStarSprite(0x334466, baseSize * 0.7, 0.25);
        group.add(star);
        group.userData = { star, isSolved: false };
    }

    group.position.set(pos[0], pos[1], pos[2]);
    group.userData.nodeData = nodeData;
    group.userData.area = area;
    group.userData.color = color;
    group.userData.baseSize = baseSize;

    scene.add(group);
    return group;
}

// ── Connection lines ─────────────────────────────────────────────────

function createConnectionLines() {
    if (lineSegments) {
        scene.remove(lineSegments);
        lineSegments.geometry.dispose();
        lineSegments.material.dispose();
    }

    const positions = [];
    const colors = [];

    for (const [a, b] of edgesData) {
        const nodeA = nodesData.find(n => n.id === a);
        const nodeB = nodesData.find(n => n.id === b);
        if (!nodeA || !nodeB) continue;

        positions.push(...nodeA.pos, ...nodeB.pos);

        const bothSolved = nodeA.status === "solved" && nodeB.status === "solved";
        const c = bothSolved
            ? new THREE.Color(getAreaColor(nodeA.area)).multiplyScalar(0.6)
            : new THREE.Color(0x222244);
        colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    lineSegments = new THREE.LineSegments(geometry, material);
    scene.add(lineSegments);
}

function updateConnectionLines() {
    if (!lineSegments) return;
    const posAttr = lineSegments.geometry.getAttribute("position");
    const colAttr = lineSegments.geometry.getAttribute("color");

    let idx = 0;
    for (const [a, b] of edgesData) {
        const nodeA = nodesData.find(n => n.id === a);
        const nodeB = nodesData.find(n => n.id === b);
        if (!nodeA || !nodeB) continue;

        posAttr.setXYZ(idx, ...nodeA.pos);
        posAttr.setXYZ(idx + 1, ...nodeB.pos);

        const bothSolved = nodeA.status === "solved" && nodeB.status === "solved";
        const c = bothSolved
            ? new THREE.Color(getAreaColor(nodeA.area)).multiplyScalar(0.8)
            : new THREE.Color(0x111133);
        colAttr.setXYZ(idx, c.r, c.g, c.b);
        colAttr.setXYZ(idx + 1, c.r, c.g, c.b);
        idx += 2;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
}

// ── Load data & build scene ──────────────────────────────────────────

async function loadData() {
    try {
        const res = await fetch(`${API_BASE}/api/cosmos/nodes`);
        const data = await res.json();
        nodesData = data.nodes;
        edgesData = data.edges;

        // Create star meshes
        starMeshes = nodesData.map(node => createStarNode(node));

        // Create connection lines
        createConnectionLines();

        console.log(`Loaded ${nodesData.length} stars, ${edgesData.length} edges`);
    } catch (err) {
        console.error("Failed to load star data:", err);
    }
}

// ── Interaction ──────────────────────────────────────────────────────

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function updateHover() {
    raycaster.setFromCamera(mouse, camera);

    // Collect all star sprites for raycasting
    const targets = starMeshes.map(m => m.userData.star || m.children.find(c => c.isSprite));
    const intersects = raycaster.intersectObjects(targets, false);

    // Reset previous hover
    if (hoveredStar && (!intersects.length || intersects[0].object !== (hoveredStar.userData.star || hoveredStar.children[0]))) {
        resetHover(hoveredStar);
        hoveredStar = null;
    }

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        let parent = obj.parent;
        // Handle case where the intersected object is a child of the group
        if (parent && parent.userData && parent.userData.nodeData) {
            if (hoveredStar !== parent) {
                hoveredStar = parent;
                highlightStar(parent);
            }
        }
    }
}

function highlightStar(group) {
    const star = group.userData.star;
    if (star) {
        star.scale.set(group.userData.baseSize * 1.6, group.userData.baseSize * 1.6, 1);
        star.material.opacity = Math.min(1, star.material.opacity + 0.3);
    }
    if (group.userData.glow) {
        group.userData.glow.material.opacity = 0.8;
        group.userData.glow.scale.set(group.userData.baseSize * 4.5, group.userData.baseSize * 4.5, 1);
    }
    document.body.style.cursor = "pointer";
}

function resetHover(group) {
    const star = group.userData.star;
    if (star) {
        star.scale.set(group.userData.baseSize, group.userData.baseSize, 1);
        star.material.opacity = group.userData.isSolved ? 0.9 : 0.25;
    }
    if (group.userData.glow) {
        group.userData.glow.material.opacity = 0.5;
        group.userData.glow.scale.set(group.userData.baseSize * 3.5, group.userData.baseSize * 3.5, 1);
    }
    document.body.style.cursor = "default";
}

function onClick(event) {
    if (event.target.closest("#info-panel") || event.target.closest("#top-bar")) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const targets = starMeshes.map(m => m.userData.star || m.children.find(c => c.isSprite));
    const intersects = raycaster.intersectObjects(targets, false);

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        let parent = obj.parent;
        if (parent && parent.userData && parent.userData.nodeData) {
            selectStar(parent);
        }
    } else {
        deselectStar();
    }
}

function selectStar(group) {
    // Deselect previous
    if (selectedStar && selectedStar !== group) {
        resetHover(selectedStar);
    }
    selectedStar = group;
    highlightStar(group);
    showPanel(group);
}

function deselectStar() {
    if (selectedStar) {
        resetHover(selectedStar);
        selectedStar = null;
    }
    hidePanel();
}

// ── Info panel ───────────────────────────────────────────────────────

function showPanel(group) {
    const node = group.userData.nodeData;
    panelName.textContent = node.name;
    panelArea.textContent = node.area;
    panelDesc.textContent = node.description;
    panelImportance.textContent = node.importance;
    panelDifficulty.textContent = node.ai_difficulty;

    if (node.status === "solved") {
        solveBtn.style.display = "none";
        panelStatus.textContent = "已点亮 — 此定理已被证明";
        panelStatus.className = "success";
    } else {
        solveBtn.style.display = "block";
        solveBtn.disabled = false;
        solveBtn.textContent = "启动 AI 探索";
        solveBtn.className = "";
        panelStatus.textContent = "";
        panelStatus.className = "";
    }

    // Position panel near the clicked star
    const screenPos = new THREE.Vector3();
    group.getWorldPosition(screenPos);
    screenPos.project(camera);

    const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;

    infoPanel.style.left = `${x}px`;
    infoPanel.style.top = `${Math.max(120, y - 180)}px`;
    infoPanel.classList.remove("hidden");
}

function hidePanel() {
    infoPanel.classList.add("hidden");
    panelStatus.textContent = "";
    panelStatus.className = "";
}

// ── AI Solve ─────────────────────────────────────────────────────────

async function onSolveClick() {
    if (!selectedStar) return;
    const node = selectedStar.userData.nodeData;
    if (node.status === "solved") return;

    solveBtn.disabled = true;
    solveBtn.textContent = "AI 思考中...";
    solveBtn.classList.add("solving");
    panelStatus.textContent = "";
    panelStatus.className = "";

    // Start blinking animation
    const blinkAnim = startBlinkAnimation(selectedStar);

    try {
        const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws/solve/${node.id}`;
        wsConnection = new WebSocket(wsUrl);

        wsConnection.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            switch (msg.event) {
                case "task_running":
                    panelStatus.textContent = "AI 正在分析问题...";
                    break;

                case "task_success":
                    stopBlinkAnimation(blinkAnim);
                    node.status = "solved";
                    selectedStar.userData.isSolved = true;
                    updateStarToSolved(selectedStar);
                    updateConnectionLines();
                    showPanel(selectedStar);
                    showToast(`${node.name} 已被点亮！`, false);
                    wsConnection.close();
                    break;

                case "task_failed":
                    stopBlinkAnimation(blinkAnim);
                    resetStarAppearance(selectedStar);
                    panelStatus.textContent = msg.message || "AI 暂未能解决此问题";
                    panelStatus.className = "failed";
                    solveBtn.disabled = false;
                    solveBtn.textContent = "重新尝试";
                    solveBtn.classList.remove("solving");
                    showToast("AI 未能解决此问题，可以重新尝试", true);
                    wsConnection.close();
                    break;

                case "already_solved":
                    stopBlinkAnimation(blinkAnim);
                    panelStatus.textContent = "此问题已解决";
                    panelStatus.className = "success";
                    wsConnection.close();
                    break;
            }
        };

        wsConnection.onerror = () => {
            stopBlinkAnimation(blinkAnim);
            resetStarAppearance(selectedStar);
            panelStatus.textContent = "连接失败，请重试";
            panelStatus.className = "failed";
            solveBtn.disabled = false;
            solveBtn.textContent = "重新尝试";
            solveBtn.classList.remove("solving");
        };

    } catch (err) {
        console.error("WebSocket error:", err);
        stopBlinkAnimation(blinkAnim);
        resetStarAppearance(selectedStar);
        panelStatus.textContent = "连接失败";
        panelStatus.className = "failed";
        solveBtn.disabled = false;
        solveBtn.textContent = "重新尝试";
        solveBtn.classList.remove("solving");
    }
}

// ── Blink animation ──────────────────────────────────────────────────

function startBlinkAnimation(group) {
    const star = group.userData.star;
    if (!star) return null;

    let phase = 0;
    const interval = setInterval(() => {
        phase = (phase + 1) % 4;
        if (phase < 2) {
            star.material.opacity = 0.9;
            star.material.color.set(0xffffff);
            star.scale.set(group.userData.baseSize * 1.4, group.userData.baseSize * 1.4, 1);
        } else {
            star.material.opacity = 0.2;
            star.material.color.set(group.userData.color);
            star.scale.set(group.userData.baseSize * 0.8, group.userData.baseSize * 0.8, 1);
        }
    }, 400);

    return { interval, group };
}

function stopBlinkAnimation(anim) {
    if (!anim) return;
    clearInterval(anim.interval);
}

function resetStarAppearance(group) {
    const star = group.userData.star;
    if (star) {
        star.material.color.set(group.userData.color);
        star.material.opacity = 0.25;
        star.scale.set(group.userData.baseSize * 0.7, group.userData.baseSize * 0.7, 1);
    }
}

// ── Lighting animation on solve ──────────────────────────────────────

function updateStarToSolved(group) {
    const node = group.userData.nodeData;
    const color = group.userData.color;
    const baseSize = group.userData.baseSize;

    // Update star sprite
    const star = group.userData.star;
    if (star) {
        star.material.color.set(color);
        star.material.opacity = 0.9;
        star.scale.set(baseSize, baseSize, 1);
    }

    // Add glow ring
    if (!group.userData.glow) {
        const glow = createGlowRing(color, baseSize * 3.5);
        group.add(glow);
        group.userData.glow = glow;
    }

    // Create ripple effect
    createRippleEffect(group);
}

function createRippleEffect(group) {
    const pos = group.position.clone();
    const node = group.userData.nodeData;
    const color = group.userData.color;

    // Create expanding ring
    const ringGeo = new THREE.RingGeometry(0.1, 0.3, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(camera.position);
    scene.add(ring);

    // Animate expansion
    const startTime = Date.now();
    const duration = 1500;

    function animateRipple() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const scale = 1 + progress * 8;
        ring.scale.set(scale, scale, scale);
        ring.material.opacity = 0.8 * (1 - progress);

        // Update related line colors
        if (node.related && node.related.length > 0) {
            updateConnectionLines();
        }

        if (progress < 1) {
            requestAnimationFrame(animateRipple);
        } else {
            scene.remove(ring);
            ringGeo.dispose();
            ringMat.dispose();
        }
    }

    requestAnimationFrame(animateRipple);
}

// ── Toast notification ───────────────────────────────────────────────

function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = isError ? "visible error" : "visible";
    setTimeout(() => {
        toast.classList.remove("visible", "error");
    }, 3000);
}

// ── Resize handler ───────────────────────────────────────────────────

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

// ── Render loop ──────────────────────────────────────────────────────

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    updateHover();

    // Make ripples always face camera
    // (handled in ripple creation)

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// ── Event listeners ──────────────────────────────────────────────────

function bindEvents() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    solveBtn.addEventListener("click", onSolveClick);
    simulateCheck.addEventListener("change", () => {
        simulateMode = simulateCheck.checked;
    });
}

// ── Init ─────────────────────────────────────────────────────────────

async function init() {
    initScene();
    bindEvents();
    await loadData();
    animate();
}

init();