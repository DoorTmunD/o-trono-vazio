import { crownGeometry } from './crown-geometry';
import { crownFragmentSource, crownVertexSource } from './crown-material';

export function createCrownRenderer(canvas, paused, pointer, pose) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) return () => {};
  function shader(type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) { gl.deleteShader(result); return null; }
    return result;
  }
  const vertex = shader(gl.VERTEX_SHADER, crownVertexSource);
  const fragment = shader(gl.FRAGMENT_SHADER, crownFragmentSource);
  if (!vertex || !fragment) { gl.deleteShader(vertex); gl.deleteShader(fragment); return () => {}; }
  const program = gl.createProgram();
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment);
    return () => {};
  }
  gl.useProgram(program);
  const geometry = crownGeometry();
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
  ['aPosition', 'aNormal', 'aColor', 'aMaterial'].forEach((name, index) => {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, index === 3 ? 1 : 3, gl.FLOAT, false, 40, index * 12);
  });
  const yaw = gl.getUniformLocation(program, 'uYaw'), pitch = gl.getUniformLocation(program, 'uPitch');
  const aspect = gl.getUniformLocation(program, 'uAspect');
  gl.enable(gl.DEPTH_TEST);
  let frame = 0, visible = true, last = 0;
  let { elapsed, x, y } = pose.current;
  function draw(time) {
    frame = 0;
    if (!visible || document.hidden) { last = 0; return; }
    if (!paused && last) elapsed += Math.min(time - last, 50);
    last = time;
    if (!paused) {
      x += (pointer.current.x - x) * .025;
      y += (pointer.current.y - y) * .025;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(aspect, canvas.width / canvas.height);
    // A restrained change of viewpoint: the object keeps its weight and contact.
    gl.uniform1f(yaw, -.32 + Math.sin(elapsed * .000065) * .12 + x * .14);
    gl.uniform1f(pitch, .34 + y * .07);
    gl.drawArrays(gl.TRIANGLES, 0, geometry.length / 10);
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
