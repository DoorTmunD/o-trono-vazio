export const crownVertexSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
attribute float aMaterial;
uniform float uYaw;
uniform float uPitch;
uniform float uAspect;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPosition;
varying vec3 vLocal;
varying float vMaterial;
void main() {
  mat3 ry = mat3(cos(uYaw), 0., -sin(uYaw), 0., 1., 0., sin(uYaw), 0., cos(uYaw));
  mat3 rx = mat3(1., 0., 0., 0., cos(uPitch), sin(uPitch), 0., -sin(uPitch), cos(uPitch));
  mat3 rotation = rx * ry;
  vec3 world = rotation * aPosition;
  vNormal = rotation * aNormal;
  vColor = aColor;
  vPosition = world;
  vLocal = aPosition;
  vMaterial = aMaterial;
  world.y += .05;
  world.z -= 4.65;
  gl_Position = vec4(world.x * 2.95 / uAspect, world.y * 2.95, -1.002 * world.z - .2002, -world.z);
}`;

export const crownFragmentSource = `
precision highp float;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPosition;
varying vec3 vLocal;
varying float vMaterial;
float hash(vec3 p) {
  p = fract(p * .3183099 + vec3(.1, .3, .7));
  p *= 17.;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y), mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
void main() {
  vec3 normal = normalize(vNormal);
  if (!gl_FrontFacing) normal = -normal;
  float patina = noise(vLocal * 11.) * .65 + noise(vLocal * 37.) * .35;
  float toolmark = noise(vLocal * vec3(90., 230., 90.));
  vec3 irregularity = vec3(noise(vLocal * 86.), noise(vLocal * 86. + 13.), noise(vLocal * 86. + 29.)) - .5;
  normal = normalize(normal + irregularity * mix(.065, .006, vMaterial));
  vec3 eye = normalize(vec3(0., 0., 4.65) - vPosition);
  vec3 key = normalize(vec3(-3., 4.5, 4.));
  vec3 fill = normalize(vec3(3., 1.2, -.5));
  float diffuse = max(dot(normal, key), 0.);
  float secondary = max(dot(normal, fill), 0.);
  vec3 halfVector = normalize(key + eye);
  float roughness = mix(27. + patina * 20., 105., vMaterial);
  float highlight = pow(max(dot(normal, halfVector), 0.), roughness);
  float broadHighlight = pow(max(dot(normal, halfVector), 0.), 7.);
  vec3 metal = vColor * mix(.68, 1.09, patina) * (.97 + toolmark * .06);
  metal = mix(metal, vec3(.115, .125, .105), smoothstep(.58, .80, patina) * .28 * (1. - vMaterial));
  vec3 reflected = reflect(-eye, normal);
  float softbox = smoothstep(.18, .8, reflected.y) * .12;
  float interior = mix(.78, 1., smoothstep(-.40, -.05, vLocal.y));
  vec3 color = metal * (.20 + diffuse * .92 + secondary * .17) * interior;
  color += vec3(.88, .83, .71) * highlight * mix(.30, .17, vMaterial);
  color += vec3(.45, .42, .35) * broadHighlight * .095 * (1. - vMaterial);
  color += vec3(.29, .31, .32) * softbox * (1. - vMaterial);
  gl_FragColor = vec4(pow(max(color, vec3(0.)), vec3(.65)), 1.);
}`;
