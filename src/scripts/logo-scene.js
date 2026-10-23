import * as THREE from "three";
import model from "../data/logo-shape.json";

// Both faces and the edge belong to the same extrusion of the original mark.
export function initLogo(host) {
  const canvas = host.querySelector("canvas");
  const stage = host.querySelector(".logo-stage");
  const fallback = host.querySelector(".logo-fallback");
  const controls = host.querySelector(".logo-controls");
  const pauseButton = host.querySelector("[data-logo-pause]");
  const resetButton = host.querySelector("[data-logo-reset]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
  camera.position.z = 4.1;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x777783, 1.35));
  function light(color, intensity, x, y, z) {
    const lamp = new THREE.DirectionalLight(color, intensity);
    lamp.position.set(x, y, z);
    scene.add(lamp);
  }
  light(0xffffff, 2.6, -3, 4, 5);
  light(0xdde3ff, 0.7, 4, -1, 3);
  light(0xffffff, 2, -1, 3, -4);
  const logo = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: 0xf4f0e7,
    roughness: 0.65,
    metalness: 0.015,
  });
  const geometries = [];
  function path(points, Class) {
    const result = new Class();
    const vertices = points.map(([x, y]) => [(x - 256) / 256, (256 - y) / 256]);
    const last = vertices.at(-1),
      first = vertices[0];
    result.moveTo((last[0] + first[0]) / 2, (last[1] + first[1]) / 2);
    vertices.forEach((a, i) => {
      const b = vertices[(i + 1) % vertices.length];
      result.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
    });
    result.closePath();
    return result;
  }
  for (const spec of model.shapes) {
    const shape = path(spec.outer, THREE.Shape);
    for (const hole of spec.holes) shape.holes.push(path(hole, THREE.Path));
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.085,
      bevelEnabled: true,
      bevelThickness: 0.024,
      bevelSize: 0.022,
      bevelSegments: 8,
      steps: 1,
      curveSegments: 3,
    });
    geometry.translate(0, 0, -0.0425);
    geometries.push(geometry);
    logo.add(new THREE.Mesh(geometry, material));
  }
  scene.add(logo);
  const velocity = new THREE.Vector3();
  const axis = new THREE.Vector3();
  const delta = new THREE.Quaternion();
  let automatic = !reduced.matches,
    paused = false,
    visible = true,
    disposed = false;
  let pointer = null,
    previousVector,
    startX = 0,
    startY = 0,
    dragged = false,
    previousTime = 0,
    lastMove = 0,
    raf = 0,
    lastFrame = 0;
  const listeners = new AbortController();
  const on = (target, event, handler) =>
    target.addEventListener(event, handler, { signal: listeners.signal });
  let controlsMoving;
  function isMoving() {
    return (
      !paused &&
      (automatic || velocity.length() > 0.006 || (pointer !== null && dragged))
    );
  }
  function updateControls() {
    const moving = isMoving();
    if (moving === controlsMoving) return;
    controlsMoving = moving;
    pauseButton.textContent = moving ? "Pausar giro" : "Activar giro";
    pauseButton.removeAttribute("aria-pressed");
  }
  function requestFrame() {
    if (!raf && visible && !document.hidden && !disposed)
      raf = requestAnimationFrame(frame);
  }
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    updateControls();
    requestFrame();
  }
  function frame(time) {
    raf = 0;
    if (disposed || !visible || document.hidden) {
      lastFrame = 0;
      return;
    }
    const dt = lastFrame ? Math.min((time - lastFrame) / 1000, 0.05) : 0;
    lastFrame = time;
    if (automatic && !paused && pointer === null) {
      // Start moving on the first frame and resume from the current orientation.
      axis.set(0, 1, 0);
      delta.setFromAxisAngle(axis, 0.42 * dt);
      logo.quaternion.premultiply(delta).normalize();
    } else if (!paused && pointer === null && velocity.length() > 0.006) {
      const speed = velocity.length(),
        decay = Math.exp(-2.2 * dt);
      axis.copy(velocity).divideScalar(speed);
      delta.setFromAxisAngle(axis, (speed * (1 - decay)) / 2.2);
      logo.quaternion.premultiply(delta).normalize();
      velocity.multiplyScalar(decay);
    }
    renderer.render(scene, camera);
    updateControls();
    if (
      pointer !== null ||
      (!paused && (automatic || velocity.length() > 0.006))
    )
      requestFrame();
    else lastFrame = 0;
  }
  function sphere(event) {
    const rect = canvas.getBoundingClientRect(),
      size = Math.min(rect.width, rect.height);
    let x = (2 * (event.clientX - rect.left) - rect.width) / size;
    let y = (rect.height - 2 * (event.clientY - rect.top)) / size;
    const r = x * x + y * y,
      z = r < 0.5 ? Math.sqrt(1 - r) : 0.5 / Math.sqrt(r);
    return new THREE.Vector3(x, y, z).normalize();
  }
  on(canvas, "pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    host.dataset.input = "pointer";
    startX = event.clientX;
    startY = event.clientY;
    dragged = false;
    velocity.set(0, 0, 0);
    pointer = event.pointerId;
    previousVector = sphere(event);
    previousTime = event.timeStamp;
    lastMove = event.timeStamp;
    canvas.setPointerCapture(pointer);
    requestFrame();
  });
  on(canvas, "pointermove", (event) => {
    if (pointer !== event.pointerId) return;
    if (!dragged) {
      if (Math.hypot(event.clientX - startX, event.clientY - startY) < 4)
        return;
      dragged = true;
      automatic = false;
      paused = false;
      updateControls();
    }
    const samples = event.getCoalescedEvents?.();
    for (const sample of samples?.length ? samples : [event]) {
      const current = sphere(sample),
        dt = THREE.MathUtils.clamp(
          (sample.timeStamp - previousTime) / 1000,
          0.006,
          0.05,
        );
      delta.setFromUnitVectors(previousVector, current);
      if (delta.w < 0) delta.set(-delta.x, -delta.y, -delta.z, -delta.w);
      const angle = 2 * Math.acos(THREE.MathUtils.clamp(delta.w, -1, 1));
      logo.quaternion.premultiply(delta).normalize();
      axis.set(delta.x, delta.y, delta.z);
      if (axis.lengthSq() > 1e-10)
        axis.normalize().multiplyScalar(Math.min(angle / dt, 9));
      else axis.set(0, 0, 0);
      velocity.lerp(axis, 1 - Math.exp(-36 * dt));
      previousVector = current;
      previousTime = sample.timeStamp;
      lastMove = sample.timeStamp;
    }
    requestFrame();
  });
  function release(event) {
    if (pointer !== event.pointerId) return;
    const oldPointer = pointer;
    pointer = null;
    if (
      !dragged ||
      event.type !== "pointerup" ||
      reduced.matches ||
      event.timeStamp - lastMove > 90
    )
      velocity.set(0, 0, 0);
    if (canvas.hasPointerCapture(oldPointer))
      canvas.releasePointerCapture(oldPointer);
    requestFrame();
  }
  on(canvas, "pointerup", release);
  on(canvas, "pointercancel", release);
  on(canvas, "lostpointercapture", release);
  function front() {
    automatic = !reduced.matches;
    paused = reduced.matches;
    velocity.set(0, 0, 0);
    logo.quaternion.identity();
    updateControls();
    requestFrame();
  }
  function pause() {
    if (isMoving()) {
      paused = true;
      velocity.set(0, 0, 0);
    } else {
      paused = false;
      automatic = true;
    }
    updateControls();
    requestFrame();
  }
  on(pauseButton, "click", pause);
  on(resetButton, "click", front);
  on(canvas, "keydown", (event) => {
    host.dataset.input = "keyboard";
    const rotations = {
      ArrowLeft: [0, -1, 0],
      ArrowRight: [0, 1, 0],
      ArrowUp: [-1, 0, 0],
      ArrowDown: [1, 0, 0],
    };
    if (rotations[event.key]) {
      event.preventDefault();
      automatic = false;
      velocity.set(0, 0, 0);
      axis.fromArray(rotations[event.key]);
      delta.setFromAxisAngle(axis, 0.18);
      logo.quaternion.premultiply(delta).normalize();
      requestFrame();
    } else if (event.code === "Space") {
      event.preventDefault();
      pause();
    } else if (event.key === "Home") {
      event.preventDefault();
      front();
    }
  });
  on(document, "keydown", (event) => {
    if (event.key === "Tab") host.dataset.input = "keyboard";
  });
  on(reduced, "change", () => {
    if (reduced.matches) {
      automatic = false;
      paused = true;
      velocity.set(0, 0, 0);
      updateControls();
    }
    requestFrame();
  });
  on(document, "visibilitychange", () => {
    lastFrame = 0;
    requestFrame();
  });
  on(canvas, "webglcontextlost", (event) => {
    event.preventDefault();
    canvas.hidden = true;
    fallback.hidden = false;
    controls.hidden = true;
    cleanup();
  });
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const visibility = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    lastFrame = 0;
    requestFrame();
  });
  visibility.observe(host);
  function cleanup() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    listeners.abort();
    resizeObserver.disconnect();
    visibility.disconnect();
    geometries.forEach((geometry) => geometry.dispose());
    material.dispose();
    renderer.dispose();
  }
  // Persisted pages retain their renderer when restored from the browser back cache.
  on(window, "pagehide", (event) => {
    if (!event.persisted) cleanup();
  });
  paused = reduced.matches;
  updateControls();
  canvas.hidden = false;
  controls.hidden = false;
  resize();
  renderer.render(scene, camera);
  fallback.hidden = true;
}
