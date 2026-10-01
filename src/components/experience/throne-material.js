// Surface response is independent of the mesh and render lifecycle. Restrained
// local-space texture gives the oak and limestone weight at any canvas size.
export const meshVertex = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec4 aMaterial;
uniform mat4 uMatrix;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vMaterial;
void main() {
  vPosition = aPosition;
  vNormal = aNormal;
  vMaterial = aMaterial;
  gl_Position = uMatrix * vec4(aPosition, 1.);
}`;

export const meshFragment = `
precision highp float;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vMaterial;
uniform vec3 uEye;
float hash(vec3 p) {
  p = fract(p * .1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}
float noise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f*f*(3.-2.*f);
  return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x),
                 mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                 mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
}
void main() {
  vec3 p = vPosition;
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 view = normalize(uEye - p);
  vec3 key = normalize(vec3(-4.8, 6.7, 4.3) - p);
  vec3 fill = normalize(vec3(5.5, 4.0, 2.8) - p);
  float kind = vMaterial.a;
  float grain = noise(p * 36.);
  float coarse = noise(p * 3.7);
  vec3 surface = vMaterial.rgb;
  float roughness = .86;
  if (kind < .5) {
    // Oxidized oak: long fibres, patchy old wax and dark pores. Variation is
    // anchored in the timber, so highlights stay quiet when the camera moves.
    float fibre = noise(p * vec3(53., 1.65, 48.));
    float growth = noise(p * vec3(7.8, .65, 8.5));
    float age = smoothstep(.29,.73,noise(p * vec3(3.1,1.8,3.3)));
    surface *= .81 + growth * .23 + fibre * .12 + grain * .035;
    surface = mix(surface, surface * vec3(.71,.75,.79), age * .45);
    vec3 fibres = vec3(fibre-.5, (coarse-.5)*.24, growth-.5);
    n = normalize(n + (fibres - n * dot(fibres,n)) * .11);
    roughness = mix(.72,.89,age);
  } else if (kind < 2.5) {
    surface *= .81 + coarse * .21 + grain * .13;
    vec3 pores = vec3(grain-.5, coarse-.5, noise(p*18.+vec3(7.,31.,13.))-.5);
    n = normalize(n + (pores - n * dot(pores,n)) * .10);
  } else if (kind < 3.5) {
    surface *= .81 + grain * .22;
    roughness = .77;
  } else {
    surface *= .73 + grain * .18;
    roughness = .63;
  }
  // A broad off-frame window reveals construction, without theatrical rim light.
  float diffuse = max(dot(n, key), 0.);
  float bounce = max(dot(n, fill), 0.);
  vec3 color = surface * (vec3(.31,.295,.27)
    + vec3(1.43,1.32,1.19) * diffuse
    + vec3(.23,.23,.215) * bounce);
  float specular = pow(max(dot(n, normalize(key + view)), 0.), 25.);
  color += vec3(.56,.52,.45) * specular * (1. - roughness) * .09;
  float backCrease = exp(-abs(p.z + .34) * 8.) * exp(-abs(p.y - 1.43) * 4.);
  color *= 1. - backCrease * .36;
  // The seat casts a quiet contact shadow across the legs and upper step.
  float underSeat = (1. - smoothstep(.72,1.04,abs(p.x)))
    * (1. - smoothstep(.50,.90,abs(p.z)))
    * (1. - smoothstep(1.05,1.35,p.y));
  color *= 1. - underSeat * .36;
  float surfaceAlpha = 1.;
  if (kind > 1.5 && kind < 2.5) {
    float contact = exp(-dot(p.xz * vec2(.42,.55), p.xz * vec2(.42,.55)));
    color *= 1. - contact * .70;
    vec2 joints = abs(fract((p.xz + vec2(.5,.1)) / vec2(2.8,2.1)) - .5);
    color *= 1. - smoothstep(.493,.5,max(joints.x,joints.y)) * .16;
    surfaceAlpha = 1. - smoothstep(2.5,20.,-p.z);
  }
  float distanceFog = 1. - exp(-max(length(uEye-p) - 8.,0.) * .038);
  vec3 fog = vec3(.031,.030,.025);
  color = mix(color, fog, min(distanceFog,.88));
  gl_FragColor = vec4(pow(max(color,0.),vec3(.88)), surfaceAlpha);
}`;

export const screenVertex = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * .5 + .5;
  gl_Position = vec4(aPosition, .9999, 1.);
}`;

export const atmosphereFragment = `
precision highp float;
varying vec2 vUv;
uniform float uAspect;
uniform float uTime;
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
    mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
void main() {
  vec2 uv = vUv;
  float cloud = noise(uv*vec2(4.,7.)+vec2(uTime*.003,0.));
  cloud += noise(uv*vec2(12.,16.)-vec2(uTime*.005,0.))*.30;
  // Diffuse daylight entering the room, not a circular aura or spotlight.
  vec2 window = (uv - vec2(.36,.84)) * vec2(min(uAspect,1.7),.75);
  float daylight = exp(-dot(window,window) * 6.5);
  float shaft = exp(-pow((uv.x + uv.y*.23 - .52)*4.1,2.))
    * smoothstep(.18,.85,uv.y);
  vec3 color = vec3(.017,.019,.018);
  color += vec3(.081,.074,.055) * daylight * (.61 + cloud*.19);
  color += vec3(.038,.035,.026) * shaft * .33;
  float mist = exp(-pow((uv.y-.36)*5.5,2.)) * cloud;
  color += vec3(.060,.060,.052) * mist * .14;
  float vignette = 1. - smoothstep(.18,1.05,length((uv-.5)*vec2(1.,.82)));
  color *= .45 + vignette*.55;
  gl_FragColor = vec4(color,1.);
}`;

export const dustVertex = `
attribute vec4 aDust;
uniform mat4 uMatrix;
uniform float uTime;
uniform float uPixelRatio;
varying float vAlpha;
void main() {
  vec3 p = aDust.xyz;
  p.x += sin(uTime*.045+aDust.w*6.)*.13;
  p.y = mod(p.y+uTime*(.007+aDust.w*.009),7.);
  vec4 clip = uMatrix*vec4(p,1.);
  gl_Position = clip;
  gl_PointSize = clamp((.7+aDust.w*.9)*uPixelRatio*8./clip.w,1.,3.);
  vAlpha = (.035+aDust.w*.075) * (.75+.25*sin(uTime*.14+aDust.w*70.));
}`;

export const dustFragment = `
precision mediump float;
varying float vAlpha;
void main() {
  float r=length(gl_PointCoord-.5)*2.;
  float alpha=pow(max(0.,1.-r),2.)*vAlpha;
  gl_FragColor=vec4(.63,.60,.51,alpha);
}`;
