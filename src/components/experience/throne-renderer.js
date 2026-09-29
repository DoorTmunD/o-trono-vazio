// The geometry and atmosphere are generated locally. Only a small vertex buffer
// crosses the GPU boundary; there are no 4K textures or third-party runtimes.
const TAU = Math.PI * 2;
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

function project(point, matrix) {
  const p = [...point, 1];
  const result = [0, 0, 0, 0];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) result[r] += matrix[c * 4 + r] * p[c];
  return [result[0] / result[3] * .5 + .5, result[1] / result[3] * .5 + .5];
}

function sceneGeometry() {
  const data = [];
  // RGB is linear-ish material reflectance. Alpha encodes metal / stone / floor.
  const basalt = [.065, .079, .092, 0];
  const edge = [.105, .119, .126, 0];
  const black = [.028, .032, .039, 0];
  const gold = [.43, .29, .12, 1];
  const paleGold = [.68, .46, .22, 1];
  const floor = [.057, .066, .072, 2];

  function triangle(a, b, c, color) {
    const n = normalize(cross(subtract(b, a), subtract(c, a)));
    for (const point of [a, b, c]) data.push(...point, ...n, ...color);
  }
  function quad(a, b, c, d, color) { triangle(a, b, c, color); triangle(a, c, d, color); }
  function box(x, y, z, w, h, depth, color, bevel = .06) {
    // Beveled rectangular prism: wide planar faces with light-catching edges.
    const x0 = x - w / 2, x1 = x + w / 2, z0 = z - depth / 2, z1 = z + depth / 2;
    const b = Math.min(bevel, w / 4, depth / 4, h / 3);
    const loop = [[x0 + b, z0], [x1 - b, z0], [x1, z0 + b], [x1, z1 - b], [x1 - b, z1], [x0 + b, z1], [x0, z1 - b], [x0, z0 + b]];
    const top = loop.map(([px, pz]) => [x + (px - x) * (1 - b / w), y + h, z + (pz - z) * (1 - b / depth)]);
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8;
      quad([loop[i][0], y, loop[i][1]], [loop[j][0], y, loop[j][1]], [loop[j][0], y + h - b, loop[j][1]], [loop[i][0], y + h - b, loop[i][1]], color);
      quad([loop[i][0], y + h - b, loop[i][1]], [loop[j][0], y + h - b, loop[j][1]], top[j], top[i], color);
      triangle([x, y + h, z], top[i], top[j], color);
    }
  }
  function cylinder(radius, y, height, color, segments = 96) {
    for (let i = 0; i < segments; i++) {
      const a = i / segments * TAU, b = (i + 1) / segments * TAU;
      const p = [Math.sin(a) * radius, y, Math.cos(a) * radius], q = [Math.sin(b) * radius, y, Math.cos(b) * radius];
      quad(p, q, [q[0], y + height - .045, q[2]], [p[0], y + height - .045, p[2]], color);
      const topP = [p[0] * .987, y + height, p[2] * .987], topQ = [q[0] * .987, y + height, q[2] * .987];
      quad([p[0], y + height - .045, p[2]], [q[0], y + height - .045, q[2]], topQ, topP, color);
      triangle([0, y + height, 0], topP, topQ, color);
    }
  }
  function blade(x, y, width, height, z, color, lean = 0) {
    const l = [x - width / 2, y, z], r = [x + width / 2, y, z];
    const ls = [x - width * .43 + lean, y + height * .84, z - .09];
    const rs = [x + width * .43 + lean, y + height * .84, z - .09];
    const tip = [x + lean, y + height, z - .12];
    const ridge = [x + lean * .45, y + height * .52, z + .17];
    triangle(l, ridge, r, color); triangle(l, ls, ridge, color);
    triangle(ls, tip, ridge, color); triangle(tip, rs, ridge, color); triangle(rs, r, ridge, color);
    const behind = p => [p[0], p[1], p[2] - .28];
    const loop = [l, ls, tip, rs, r];
    for (let i = 0; i < 5; i++) quad(loop[i], loop[(i + 1) % 5], behind(loop[(i + 1) % 5]), behind(loop[i]), black);
  }
  function ring(radius, width, y, z, color, start = 0, end = TAU, segments = 180) {
    // Four sides, not a flat graphic: the halo has a subtly chamfered profile.
    const profile = [[-width / 2, 0], [-width / 3, .055], [width / 3, .055], [width / 2, 0], [width / 3, -.055], [-width / 3, -.055]];
    const p = (angle, radiusDelta, dz) => [Math.sin(angle) * (radius + radiusDelta), y + Math.cos(angle) * (radius + radiusDelta), z + dz];
    for (let i = 0; i < segments; i++) {
      const a = start + i / segments * (end - start), b = start + (i + 1) / segments * (end - start);
      for (let j = 0; j < profile.length; j++) {
        const k = (j + 1) % profile.length;
        quad(p(a, ...profile[j]), p(b, ...profile[j]), p(b, ...profile[k]), p(a, ...profile[k]), color);
      }
    }
  }

  // A distant, quiet floor dissolves into the atmosphere.
  quad([-30, -.06, 15], [30, -.06, 15], [30, -.06, -30], [-30, -.06, -30], floor);
  cylinder(3.38, 0, .15, basalt);
  cylinder(2.96, .15, .17, edge);
  cylinder(2.52, .32, .17, basalt);
  cylinder(2.08, .49, .18, edge);
  // Thin inlays around the circular stone podium, with actual cylindrical faces.
  cylinder(2.972, .24, .021, gold);
  cylinder(2.09, .58, .019, gold);

  // Sculpted foot, seat and arms. The empty seat stays clearly readable.
  box(0, .67, .05, 2.22, .20, 1.93, black, .11);
  box(0, .87, .03, 1.80, .24, 1.63, basalt, .08);
  for (const side of [-1, 1]) {
    box(side * .79, .9, .65, .30, .69, .41, edge, .055);
    box(side * .78, .9, -.49, .30, .69, .38, basalt, .05);
  }
  box(0, 1.41, .05, 1.98, .20, 1.68, edge, .065);
  box(0, 1.61, .04, 1.54, .085, 1.34, black, .03);
  box(0, 1.405, .865, 1.64, .035, .022, gold, .006);
  for (const side of [-1, 1]) {
    box(side * 1.02, 1.57, .25, .30, .79, 1.3, basalt, .055);
    box(side * 1.01, 2.36, .25, .37, .12, 1.46, edge, .055);
    box(side * 1.013, 2.469, .30, .095, .018, 1.14, gold, .004);
    blade(side * 1.04, .87, .32, 1.47, .91, edge);
    blade(side * 1.18, 1.63, .42, 2.78, -.50, basalt, side * .18);
    blade(side * 1.35, 1.81, .26, 2.10, -.73, edge, side * .15);
    box(side * 1.015, 1.62, .923, .045, .50, .017, gold, .004);
  }
  // Nine closely layered basalt fins form a cathedral silhouette.
  for (let i = -4; i <= 4; i++) {
    const x = i * .225;
    const height = 3.78 - Math.abs(i) * .185;
    blade(x, 1.51, .30, height, -.53 - Math.abs(i) * .025, Math.abs(i) % 2 ? basalt : edge, i * .04);
  }
  // Central hand-worked gold incision, deliberately sparse.
  blade(0, 2.21, .038, 2.41, -.343, gold);
  for (const side of [-1, 1]) blade(side * .65, 2.1, .024, 1.81, -.381, gold, side * .08);

  ring(2.66, .084, 3.20, -2.03, paleGold);
  ring(2.79, .015, 3.20, -2.09, gold);
  ring(2.57, .014, 3.20, -2.03, gold, -.08, Math.PI * 1.91);
  // Fine radial engraving makes the backlit halo feel machined and ancient.
  for (let i = 0; i < 84; i++) {
    const a = i / 84 * TAU;
    const r0 = 2.76, r1 = i % 7 === 0 ? 2.90 : 2.82;
    const width = i % 7 === 0 ? .005 : .0016;
    quad([Math.sin(a - width) * r0, 3.20 + Math.cos(a - width) * r0, -2.02], [Math.sin(a + width) * r0, 3.20 + Math.cos(a + width) * r0, -2.02], [Math.sin(a + width) * r1, 3.20 + Math.cos(a + width) * r1, -2.02], [Math.sin(a - width) * r1, 3.20 + Math.cos(a - width) * r1, -2.02], gold);
  }

  // Tall, broken colonnades provide scale and genuine camera parallax.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const x = side * (3.95 + i * 2.25), z = -2.8 - i * 3.35;
      box(x, -.04, z, 1.11, .43, 1.18, black, .08);
      box(x, .39, z, .77, 8.6 + i * .7, .89, basalt, .1);
      box(x + side * .265, .44, z + .447, .045, 8.4 + i * .7, .014, gold, .005);
      box(x - side * .37, .38, z + .13, .11, 8.7 + i * .7, .76, black, .025);
    }
    // Foreground sentinels only appear at the extreme widescreen edges.
    box(side * 7.8, -.1, 1.9, 1.5, 10.5, 1.6, black, .17);
  }
  return new Float32Array(data);
}

const meshVertex = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec4 aMaterial;
uniform mat4 uMatrix;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vMaterial;
void main() {
  vPosition = aPosition; vNormal = aNormal; vMaterial = aMaterial;
  gl_Position = uMatrix * vec4(aPosition, 1.);
}`;

const meshFragment = `
precision highp float;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vMaterial;
uniform vec3 uEye;
uniform float uTime;
float hash(vec3 p) { p = fract(p * .1031); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float noise(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
void main() {
  vec3 n = normalize(vNormal); if (!gl_FrontFacing) n = -n;
  vec3 p = vPosition;
  vec3 view = normalize(uEye - p);
  vec3 warm = normalize(vec3(-3.7, 7.5, 4.) - p);
  vec3 cold = normalize(vec3(5., 4.1, 1.) - p);
  vec3 back = normalize(vec3(0., 4.7, -3.3) - p);
  float diffuse = max(dot(n, warm), 0.);
  float cool = max(dot(n, cold), 0.);
  float rimLight = max(dot(n, back), 0.);
  float metal = step(.5, vMaterial.a) * (1. - step(1.5, vMaterial.a));
  float rough = noise(p * 27.) * .17 + noise(p * 87.) * .08;
  float veins = pow(noise(p * vec3(5., 1.1, 6.)), 9.);
  vec3 material = vMaterial.rgb * (.80 + rough + veins * .48);
  float fresnel = pow(1. - max(dot(n, view), 0.), 3.);
  float specular = pow(max(dot(n, normalize(warm + view)), 0.), mix(37., 76., metal));
  vec3 color = material * (vec3(.23,.30,.37) + vec3(1.78,1.28,.75) * diffuse + vec3(.34,.49,.68) * cool);
  color += vec3(.90,.61,.31) * specular * (.16 + metal * .85);
  color += vec3(.50,.30,.13) * rimLight * (.16 + metal * .42);
  color += vec3(.20,.26,.32) * fresnel * .095;
  // Local ambient occlusion grounds the empty seat and the stepped dais.
  float seatAO = 1. - .34 * exp(-abs(p.y - 1.65) * 4.) * exp(-abs(p.z + .5) * 4.);
  color *= seatAO;
  if (vMaterial.a > 1.5) {
    float shadow = exp(-length(p.xz * vec2(.48,.28)) * 1.2);
    color *= 1. - shadow * .79;
    float reflection = exp(-pow(p.x / (1.0 + max(p.z,0.) * .20),2.)) * exp(-abs(p.z - 2.) * .19);
    color += vec3(.075,.045,.020) * reflection * (.55 + noise(p * 3.) * .45);
    vec2 grid = abs(fract(p.xz / 3.4) - .5);
    color *= 1. - .20 * (1. - smoothstep(.492,.5,max(grid.x,grid.y)));
  }
  // Distance haze is intentionally subtle; the throne retains its black levels.
  float distanceFog = 1. - exp(-max(length(uEye-p) - 9.,0.) * .029);
  vec3 fog = vec3(.036,.043,.050) + vec3(.045,.026,.007) * exp(-abs(p.x)*.15);
  color = mix(color, fog, min(distanceFog,.76));
  float grain = hash(vec3(gl_FragCoord.xy, floor(uTime * 12.))) - .5;
  color += grain * .011;
  // Let the distant floor dissolve into the atmosphere instead of ending at a hard horizon.
  float surfaceAlpha = vMaterial.a > 1.5 ? 1. - smoothstep(4.,24.,-p.z) : 1.;
  gl_FragColor = vec4(pow(max(color,0.),vec3(.84)), surfaceAlpha);
}`;

const screenVertex = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() { vUv = aPosition * .5 + .5; gl_Position = vec4(aPosition, .9999, 1.); }
`;

const atmosphereFragment = `
precision highp float;
varying vec2 vUv;
uniform float uAspect;
uniform float uTime;
uniform vec3 uHalo;
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p) {
 vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
void main() {
  vec2 uv = vUv;
  vec2 p = (uv-uHalo.xy)*vec2(uAspect,1.)/uHalo.z;
  float r = length(p);
  float angle = atan(p.y,p.x);
  float cloud = noise(uv*vec2(4.,7.)+vec2(uTime*.008,0.));
  cloud += noise(uv*vec2(11.,18.)-vec2(uTime*.012,0.))*.38;
  float glow = exp(-abs(r-1.)*4.5)*.125 + exp(-abs(r-1.)*27.)*.23;
  float rays = .5+.5*sin(angle*41.+sin(angle*17.)*2.7);
  rays *= .5+.5*sin(angle*67.+1.1);
  float shaft = rays*exp(-abs(r-1.)*1.5)*smoothstep(.87,1.05,r)*.037;
  vec3 color = vec3(.012,.019,.027);
  color += vec3(.22,.26,.29)*cloud*.053;
  color += vec3(.77,.47,.18)*(glow+shaft)*(cloud*.22+.88);
  color += vec3(.18,.23,.28)*exp(-length((uv-vec2(.25,.80))*vec2(1.4,.8))*3.)*.11;
  float mist = exp(-pow((uv.y-.32)*6.,2.)) * cloud;
  color += vec3(.11,.13,.15)*mist*.15;
  float vignette = smoothstep(1.1,.22,length((uv-.5)*vec2(.95,.83)));
  color *= .40 + vignette*.60;
  color += (hash(gl_FragCoord.xy + floor(uTime*12.))-.5)*.015;
  gl_FragColor = vec4(color,1.);
}`;

const dustVertex = `
attribute vec4 aDust;
uniform mat4 uMatrix;
uniform float uTime;
uniform float uPixelRatio;
varying float vAlpha;
void main() {
  vec3 p = aDust.xyz;
  p.x += sin(uTime*.07+aDust.w*6.)*.22;
  p.y = mod(p.y+uTime*(.014+aDust.w*.016),7.);
  vec4 clip = uMatrix*vec4(p,1.);
  gl_Position = clip;
  gl_PointSize = clamp((1.2+aDust.w*1.9)*uPixelRatio*9./clip.w,1.,6.);
  vAlpha = (.09+aDust.w*.30) * (.65+.35*sin(uTime*.23+aDust.w*70.));
}`;
const dustFragment = `
precision mediump float;
varying float vAlpha;
void main() {
 float r=length(gl_PointCoord-.5)*2.;
 float alpha=pow(max(0.,1.-r),2.)*vAlpha;
 gl_FragColor=vec4(.82,.64,.37,alpha);
}`;

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
    geometry = sceneGeometry(); meshBuffer = buffer(geometry);
    screenBuffer = buffer(new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]));
    const particles = [];
    // Deterministic placement prevents a jump after context restoration.
    let seed = 47;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < (mobile ? 75 : 160); i++) particles.push((random()-.5)*15, random()*7, (random()-.5)*12, random());
    dustBuffer = buffer(new Float32Array(particles));
  } catch {
    releaseGpu(); return null;
  }
  const uniforms = (p, names) => Object.fromEntries(names.map(name => [name, gl.getUniformLocation(p, name)]));
  const mu = uniforms(mesh, ['uMatrix', 'uEye', 'uTime']);
  const au = uniforms(atmosphere, ['uAspect', 'uTime', 'uHalo']);
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
    const distance = aspect < 1 ? 14.5 + (1-aspect)*3.6 : 13.1;
    const eye = [.35 + currentX*.82 + Math.sin(elapsed*.08)*.13, 4.0 + currentY*.28, distance];
    const target = [0, aspect < 1 ? 1.28 : 2.06, -.10];
    const matrix = cameraMatrix(eye, target, aspect);
    const halo = project([0, 3.20, -2.03], matrix);
    const haloTop = project([0, 5.86, -2.03], matrix);
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(.01,.016,.023,1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    // Attribute arrays belong to context state, so reset them across passes.
    for (let i = 0; i < 3; i++) gl.disableVertexAttribArray(i);
    gl.useProgram(atmosphere); gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer);
    attribute(atmosphere,'aPosition',2,8,0);
    gl.uniform1f(au.uAspect,aspect); gl.uniform1f(au.uTime,elapsed);
    gl.uniform3f(au.uHalo,halo[0],halo[1],Math.max(.01,haloTop[1]-halo[1]));
    gl.drawArrays(gl.TRIANGLES,0,6);

    gl.enable(gl.DEPTH_TEST); gl.depthMask(true);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(mesh); gl.bindBuffer(gl.ARRAY_BUFFER,meshBuffer);
    attribute(mesh,'aPosition',3,40,0); attribute(mesh,'aNormal',3,40,12); attribute(mesh,'aMaterial',4,40,24);
    gl.uniformMatrix4fv(mu.uMatrix,false,matrix); gl.uniform3fv(mu.uEye,eye); gl.uniform1f(mu.uTime,elapsed);
    gl.drawArrays(gl.TRIANGLES,0,geometry.length/10);

    for (let i = 0; i < 3; i++) gl.disableVertexAttribArray(i);
    gl.useProgram(dust); gl.bindBuffer(gl.ARRAY_BUFFER,dustBuffer);
    attribute(dust,'aDust',4,16,0);
    gl.uniformMatrix4fv(du.uMatrix,false,matrix); gl.uniform1f(du.uTime,elapsed); gl.uniform1f(du.uPixelRatio,pixelRatio);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE); gl.depthMask(false);
    gl.drawArrays(gl.POINTS,0,mobile ? 75 : 160);
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
