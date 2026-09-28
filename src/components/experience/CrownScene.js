'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import styles from './crown-scene.module.css';

function subscribeMotion(callback) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
const readMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const serverMotion = () => true;

// Compact, faceted geometry keeps the artifact independent of external 3D libraries.
function crownGeometry() {
  const data = [];
  function triangle(a, b, c, color) {
    const u = b.map((v, i) => v - a[i]);
    const v = c.map((value, i) => value - a[i]);
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const length = Math.hypot(...n) || 1;
    for (const point of [a, b, c]) data.push(...point, ...n.map(value => value / length), ...color);
  }
  const gold = [.53, .37, .18];
  const trim = [.78, .59, .32];
  const point = (radius, angle, y) => [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
  function band(radius, thickness, y, height, color) {
    for (let i = 0; i < 80; i++) {
      const a = i / 80 * Math.PI * 2, b = (i + 1) / 80 * Math.PI * 2;
      const p = [point(radius, a, y), point(radius, b, y), point(radius, b, y + height), point(radius, a, y + height)];
      const q = [point(radius - thickness, a, y), point(radius - thickness, b, y), point(radius - thickness, b, y + height), point(radius - thickness, a, y + height)];
      triangle(p[0], p[2], p[1], color); triangle(p[0], p[3], p[2], color);
      triangle(q[0], q[1], q[2], color); triangle(q[0], q[2], q[3], color);
      triangle(p[3], q[2], p[2], color); triangle(p[3], q[3], q[2], color);
      triangle(p[0], p[1], q[1], color); triangle(p[0], q[1], q[0], color);
    }
  }
  band(1.1, .10, -.48, .32, gold);
  band(1.14, .17, -.51, .06, trim);
  band(1.13, .16, -.22, .07, trim);
  band(1.115, .12, -.39, .025, trim);
  // Eight thick, angular spires with a raised central ridge.
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    const height = i % 2 === 0 ? 1.1 : .78;
    const left = point(1.1, a - .25, -.17), right = point(1.1, a + .25, -.17);
    const tip = point(1.25, a, height), ridge = point(1.21, a, .03);
    const backLeft = point(1.0, a - .25, -.17), backRight = point(1.0, a + .25, -.17);
    const backTip = point(1.17, a, height - .035);
    triangle(left, tip, ridge, trim); triangle(ridge, tip, right, gold); triangle(left, ridge, right, gold);
    triangle(backRight, backTip, backLeft, gold);
    triangle(left, backLeft, backTip, gold); triangle(left, backTip, tip, trim);
    triangle(right, tip, backTip, gold); triangle(right, backTip, backRight, gold);
    // Garnet cabochons along the lower band.
    const t = point(1.17, a, -.225), b = point(1.17, a, -.40);
    const l = point(1.16, a - .065, -.31), r = point(1.16, a + .065, -.31);
    const peak = point(1.23, a, -.31);
    const garnet = [.22, .035, .024];
    triangle(t, l, peak, garnet); triangle(l, b, peak, garnet);
    triangle(b, r, peak, garnet); triangle(r, t, peak, garnet);
    // Fine teeth descending beneath the band.
    triangle(point(1.12, a - .055, -.50), point(1.12, a + .055, -.50), point(1.14, a, -.65), trim);
  }
  return new Float32Array(data);
}

const vertexSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
uniform float uYaw;
uniform float uPitch;
uniform float uAspect;
uniform float uFloat;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPosition;
void main() {
  mat3 ry = mat3(cos(uYaw), 0., -sin(uYaw), 0., 1., 0., sin(uYaw), 0., cos(uYaw));
  mat3 rx = mat3(1., 0., 0., 0., cos(uPitch), sin(uPitch), 0., -sin(uPitch), cos(uPitch));
  mat3 rotation = rx * ry;
  vec3 world = rotation * aPosition;
  vNormal = rotation * aNormal;
  vColor = aColor;
  vPosition = world;
  world.y += uFloat - .10;
  world.z -= 5.2;
  gl_Position = vec4(world.x * 2.55 / uAspect, world.y * 2.55, -1.002 * world.z - .2002, -world.z);
}`;
const fragmentSource = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPosition;
void main() {
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 light = normalize(vec3(-2.5, 3.5, 3.));
  float diffuse = max(dot(n, light), 0.);
  float rim = pow(1. - abs(dot(n, normalize(vec3(0., .2, 5.) - vPosition))), 3.);
  vec3 halfVector = normalize(light + normalize(vec3(0., 0., 5.) - vPosition));
  float shine = pow(max(dot(n, halfVector), 0.), 34.);
  float grain = fract(sin(dot(vPosition.xy * 170., vec2(12.9898, 78.233))) * 43758.5453);
  vec3 color = vColor * (.28 + diffuse * 1.15 + grain * .11) + vec3(.8, .61, .33) * shine * .9 + vec3(.28, .32, .34) * rim * .55;
  gl_FragColor = vec4(pow(color, vec3(.86)), 1.);
}`;

function createRenderer(canvas, paused, pointer, pose) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) return () => {};
  function shader(type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) { gl.deleteShader(result); return null; }
    return result;
  }
  const vertex = shader(gl.VERTEX_SHADER, vertexSource);
  const fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return () => {};
  const program = gl.createProgram();
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {};
  gl.useProgram(program);
  const geometry = crownGeometry();
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
  ['aPosition', 'aNormal', 'aColor'].forEach((name, i) => {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 36, i * 12);
  });
  const yaw = gl.getUniformLocation(program, 'uYaw'), pitch = gl.getUniformLocation(program, 'uPitch');
  const aspect = gl.getUniformLocation(program, 'uAspect'), floating = gl.getUniformLocation(program, 'uFloat');
  gl.enable(gl.DEPTH_TEST);
  let frame = 0, visible = true, last = 0;
  let { elapsed, x, y } = pose.current;
  function draw(time) {
    frame = 0;
    if (!visible || document.hidden) { last = 0; return; }
    if (!paused && last) elapsed += Math.min(time - last, 50);
    last = time;
    if (!paused) {
      x += (pointer.current.x - x) * .045;
      y += (pointer.current.y - y) * .045;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(aspect, canvas.width / canvas.height);
    gl.uniform1f(yaw, -.25 + elapsed * .000075 + x * .40);
    gl.uniform1f(pitch, .22 + y * .18);
    gl.uniform1f(floating, Math.sin(elapsed * .0007) * .065);
    gl.drawArrays(gl.TRIANGLES, 0, geometry.length / 9);
    if (!paused) frame = requestAnimationFrame(draw);
  }
  function resume() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); }
  function resize() {
    const box = canvas.getBoundingClientRect(), ratio = Math.min(window.devicePixelRatio || 1, 1.7);
    canvas.width = Math.max(1, Math.round(box.width * ratio));
    canvas.height = Math.max(1, Math.round(box.height * ratio));
    resume();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; resume(); });
  observer.observe(canvas);
  document.addEventListener('visibilitychange', resume);
  canvas.dataset.ready = 'true';
  resize();
  return () => {
    pose.current = { elapsed, x, y };
    cancelAnimationFrame(frame);
    resizeObserver.disconnect(); observer.disconnect();
    document.removeEventListener('visibilitychange', resume);
    gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment);
    delete canvas.dataset.ready;
  };
}

export default function CrownScene() {
  const canvas = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pose = useRef({ elapsed: 0, x: 0, y: 0 });
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const [override, setOverride] = useState(null);
  const active = override ?? !reduced;

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let cleanup = () => {};
    function initialize() { cleanup(); cleanup = createRenderer(element, !active, pointer, pose); }
    function contextLost(event) { event.preventDefault(); cleanup(); }
    initialize();
    element.addEventListener('webglcontextlost', contextLost);
    element.addEventListener('webglcontextrestored', initialize);
    return () => {
      cleanup();
      element.removeEventListener('webglcontextlost', contextLost);
      element.removeEventListener('webglcontextrestored', initialize);
    };
  }, [active]);

  function move(event) {
    if (!active || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    pointer.current = { x: (event.clientX - box.left) / box.width - .5, y: (event.clientY - box.top) / box.height - .5 };
  }

  return (
    <div className={`crown-scene ${styles.scene}`} data-motion={active ? 'active' : 'paused'} onPointerMove={move} onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; }}>
      <div className={styles.aura} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true"><span /><span /><i>✦</i></div>
      <div className={styles.topLabel} aria-hidden="true"><span /> Memento potentiae <span /></div>
      <div className={styles.fallback} aria-hidden="true">♛</div>
      <canvas ref={canvas} className={styles.canvas} data-testid="crown-canvas" aria-hidden="true" />
      <div className={styles.shadow} aria-hidden="true" />
      <div className={styles.sceneControls}>
        <span className={styles.hint}>Mova o cursor. Contemple o vazio.</span>
        <button type="button" onClick={() => setOverride(!active)} aria-label={active ? 'Pausar animação' : 'Ativar animação'} aria-pressed={!active} className={styles.motionButton}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">{active ? <path d="M5.5 4v8m5-8v8" stroke="currentColor" strokeWidth="1.3" /> : <path d="m6 4 6 4-6 4V4Z" stroke="currentColor" />}</svg>
          <span>{active ? 'Pausar' : 'Animar'}</span>
        </button>
      </div>
    </div>
  );
}
