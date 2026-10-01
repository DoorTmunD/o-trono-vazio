import { createThroneGeometry } from './throne-geometry';
import { meshVertex, meshFragment, screenVertex, atmosphereFragment, dustVertex, dustFragment } from './throne-material';

// The geometry and atmosphere are generated locally. Only a small vertex buffer
// crosses the GPU boundary; there are no 4K textures or third-party runtimes.
const normalize = v => { const l = Math.hypot(...v) || 1; return v.map(n => n / l); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const subtract = (a, b) => a.map((n, i) => n - b[i]);
const dot = (a, b) => a.reduce((sum, n, i) => sum + n * b[i], 0);

function multiply(a, b) {
  const result = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    for (let k = 0; k < 4; k++) result[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  }
  return result;
}

function cameraMatrix(eye, target, aspect) {
  const z = normalize(subtract(eye, target));
  const x = normalize(cross([0, 1, 0], z));
  const y = cross(z, x);
  const view = [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1];
  const f = 2.6, near = .1, far = 70;
  return multiply([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, -(far + near) / (far - near), -1, 0, 0, -2 * far * near / (far - near), 0], view);
}

/** @param {HTMLCanvasElement} canvas */
export function createThroneRenderer(canvas) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: true, depth: true, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) return null;
  const buffers = [], shaders = [], programs = [];
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  function program(vertexSource, fragmentSource) {
    const program = gl.createProgram();
    if (!program) throw new Error('WebGL program unavailable');
    programs.push(program);
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
      const shader = gl.createShader(Number(type));
      if (!shader) throw new Error('WebGL shader unavailable');
      shaders.push(shader);
      gl.shaderSource(shader, String(source)); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('WebGL shader unsupported');
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('WebGL scene unsupported');
    return program;
  }
  function buffer(data) {
    const result = gl.createBuffer(); buffers.push(result);
    gl.bindBuffer(gl.ARRAY_BUFFER, result); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return result;
  }
  function attribute(program, name, size, stride, offset) {
    const location = gl.getAttribLocation(program, name);
    if (location >= 0) { gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset); }
  }
  function releaseGpu() {
    buffers.forEach(b => gl.deleteBuffer(b));
    programs.forEach(p => gl.deleteProgram(p));
    shaders.forEach(s => gl.deleteShader(s));
    delete canvas.dataset.ready;
  }
  let mesh, atmosphere, dust, geometry, meshBuffer, screenBuffer, dustBuffer;
  try {
    mesh = program(meshVertex, meshFragment);
    atmosphere = program(screenVertex, atmosphereFragment);
    dust = program(dustVertex, dustFragment);
    geometry = createThroneGeometry(); meshBuffer = buffer(geometry);
    screenBuffer = buffer(new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]));
    const particles = [];
    // Deterministic placement prevents a jump after context restoration.
    let seed = 47;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < (mobile ? 36 : 72); i++) particles.push((random()-.5)*15, random()*7, (random()-.5)*12, random());
    dustBuffer = buffer(new Float32Array(particles));
  } catch {
    releaseGpu(); return null;
  }
  const uniforms = (p, names) => Object.fromEntries(names.map(name => [name, gl.getUniformLocation(p, name)]));
  const mu = uniforms(mesh, ['uMatrix', 'uEye']);
  const au = uniforms(atmosphere, ['uAspect', 'uTime']);
  const du = uniforms(dust, ['uMatrix', 'uTime', 'uPixelRatio']);
  let frame = 0, paused = true, visible = true, disposed = false;
  let elapsed = 0, last = 0, lastDraw = 0, pixelRatio = 1;
  let pointerX = 0, pointerY = 0, currentX = 0, currentY = 0;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function render(time) {
    frame = 0;
    if (disposed || !visible || document.hidden) { last = 0; return; }
    if (!paused && lastDraw && time - lastDraw < 1000 / 30 - 1) {
      frame = requestAnimationFrame(render); return;
    }
    if (!paused && last) elapsed += Math.min(time - last, 90) / 1000;
    last = time; lastDraw = time;
    if (!paused) { currentX += (pointerX-currentX)*.035; currentY += (pointerY-currentY)*.035; }
    const aspect = canvas.width / canvas.height;
    // The same architectural composition adapts without stretching on phones.
    const distance = aspect < 1 ? 10.1 + (1-aspect)*2.4 : 9.3;
    const eye = [1.05 + currentX*.55 + Math.sin(elapsed*.045)*.06, 3.15 + currentY*.18, distance];
    const target = [0, aspect < 1 ? .72 : 1.42, -.10];
    const matrix = cameraMatrix(eye, target, aspect);
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(.017,.019,.018,1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    // Attribute arrays belong to context state, so reset them across passes.
    for (let i = 0; i < 3; i++) gl.disableVertexAttribArray(i);
    gl.useProgram(atmosphere); gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer);
    attribute(atmosphere,'aPosition',2,8,0);
    gl.uniform1f(au.uAspect,aspect); gl.uniform1f(au.uTime,elapsed);
    gl.drawArrays(gl.TRIANGLES,0,6);

    gl.enable(gl.DEPTH_TEST); gl.depthMask(true);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(mesh); gl.bindBuffer(gl.ARRAY_BUFFER,meshBuffer);
    attribute(mesh,'aPosition',3,40,0); attribute(mesh,'aNormal',3,40,12); attribute(mesh,'aMaterial',4,40,24);
    gl.uniformMatrix4fv(mu.uMatrix,false,matrix); gl.uniform3fv(mu.uEye,eye);
    gl.drawArrays(gl.TRIANGLES,0,geometry.length/10);

    for (let i = 0; i < 3; i++) gl.disableVertexAttribArray(i);
    gl.useProgram(dust); gl.bindBuffer(gl.ARRAY_BUFFER,dustBuffer);
    attribute(dust,'aDust',4,16,0);
    gl.uniformMatrix4fv(du.uMatrix,false,matrix); gl.uniform1f(du.uTime,elapsed); gl.uniform1f(du.uPixelRatio,pixelRatio);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
    gl.drawArrays(gl.POINTS,0,mobile ? 36 : 72);
    gl.depthMask(true); gl.disable(gl.BLEND);
    canvas.dataset.ready = 'true';
    if (!paused) frame = requestAnimationFrame(render);
  }
  function schedule() {
    if (!disposed && !frame && visible && !document.hidden) frame = requestAnimationFrame(render);
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; last = 0; }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const budget = rect.width <= 760 ? 1400000 : 3840 * 2160;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(budget / Math.max(1,rect.width*rect.height)), 3840 / Math.max(1,rect.width), 2160 / Math.max(1,rect.height));
    canvas.width = Math.max(1, Math.round(rect.width*pixelRatio));
    canvas.height = Math.max(1, Math.round(rect.height*pixelRatio));
    schedule();
  }
  function visibility() { if (document.hidden) stop(); else schedule(); }
  function pointer(event) {
    if (paused || !finePointer.matches) return;
    pointerX = event.clientX / window.innerWidth - .5;
    pointerY = event.clientY / window.innerHeight - .5;
  }
  const resizeObserver = new ResizeObserver(resize);
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) schedule(); else stop();
  });
  resizeObserver.observe(canvas); intersection.observe(canvas);
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pointermove',pointer,{ passive:true });
  resize();
  return {
    setPaused(value) { paused = value; stop(); schedule(); },
    dispose() {
      disposed = true; stop(); resizeObserver.disconnect(); intersection.disconnect();
      document.removeEventListener('visibilitychange',visibility);
      window.removeEventListener('pointermove',pointer);
      releaseGpu();
    },
  };
}
