// The crown is built as an object a metalsmith could make: a thin circlet,
// rolled wire edges, chased leaves, rivets and small cabochon settings.
const TAU = Math.PI * 2;
const METAL = [.35, .29, .20];
const EDGE = [.45, .37, .25];
const GARNET = [.105, .018, .016];
/** @type {Float32Array | null} */
let cachedGeometry = null;
const normalize = v => { const length = Math.hypot(...v) || 1; return v.map(value => value / length); };
const subtract = (a, b) => a.map((value, index) => value - b[index]);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

export function crownGeometry() {
  if (cachedGeometry) return cachedGeometry;
  const data = [];
  function triangle(a, b, c, color, material = 0, normals = null) {
    const normal = normalize(cross(subtract(b, a), subtract(c, a)));
    [a, b, c].forEach((point, index) => data.push(...point, ...(normals?.[index] ?? normal), ...color, material));
  }

  // Small deviations preserve the feeling of hand worked, slightly oval metal.
  const radius = angle => 1.075 + Math.sin(angle * 3 + .4) * .006 + Math.cos(angle * 7) * .003;
  const point = (r, angle, y) => [Math.cos(angle) * r, y, Math.sin(angle) * r * .94];
  const local = (angle, x, y, depth) => point(depth - x * x * .065, angle + x / 1.09, y);

  function surface(sample, columns, rows, color, material = 0) {
    const epsilon = .0002;
    function vertex(u, v) {
      const position = sample(u, v);
      const du = subtract(sample(u + epsilon, v), sample(u - epsilon, v));
      const dv = subtract(sample(u, v + epsilon), sample(u, v - epsilon));
      return { position, normal: normalize(cross(du, dv)) };
    }
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const a = vertex(column / columns, row / rows);
        const b = vertex((column + 1) / columns, row / rows);
        const c = vertex((column + 1) / columns, (row + 1) / rows);
        const d = vertex(column / columns, (row + 1) / rows);
        triangle(a.position, b.position, c.position, color, material, [a.normal, b.normal, c.normal]);
        triangle(a.position, c.position, d.position, color, material, [a.normal, c.normal, d.normal]);
      }
    }
  }

  // Rolled edging and wire ornament are round in section, never faceted strips.
  function wire(path, thickness, segments, color = EDGE) {
    surface((u, v) => {
      const center = path(u);
      const tangent = normalize(subtract(path(u + .0002), path(u - .0002)));
      const axis = Math.abs(tangent[1]) > .95 ? [1, 0, 0] : [0, 1, 0];
      const side = normalize(cross(tangent, axis));
      const up = normalize(cross(side, tangent));
      return center.map((value, index) => value + thickness * (Math.cos(v * TAU) * side[index] + Math.sin(v * TAU) * up[index]));
    }, segments, 8, color);
  }

  // Smooth exterior and a visibly darker inner wall reveal the sheet thickness.
  surface((u, v) => point(radius(u * TAU), u * TAU, -.405 + v * .286), 144, 4, METAL);
  surface((u, v) => point(radius(-u * TAU) - .055, -u * TAU, -.405 + v * .286), 144, 3, [.22, .185, .13]);
  [-.405, -.119].forEach(y => {
    surface((u, v) => point(radius(u * TAU) - v * .055, u * TAU, y), 144, 1, METAL);
    wire(u => point(radius(u * TAU) - .003, u * TAU, y), .022, 144);
  });
  [-.357, -.166].forEach(y => wire(u => point(radius(u * TAU) + .003, u * TAU, y), .007, 144, METAL));

  // Each trefoil is a softly bevelled plate. The silhouette uses cubic curves,
  // with concave cutouts triangulated explicitly instead of a central fan.
  const outline = [[-.043, 0]];
  const curves = [
    [[-.045, .035], [-.037, .062], [-.059, .087]],
    [[-.12, .12], [-.235, .174], [-.187, .239]],
    [[-.145, .295], [-.070, .233], [-.048, .181]],
    [[-.089, .301], [-.083, .369], [0, .429]],
    [[.083, .369], [.089, .301], [.048, .181]],
    [[.070, .233], [.145, .295], [.187, .239]],
    [[.235, .174], [.12, .12], [.059, .087]],
    [[.037, .062], [.045, .035], [.043, 0]],
  ];
  curves.forEach(([control1, control2, end]) => {
    const start = outline[outline.length - 1];
    for (let step = 1; step <= 9; step++) {
      const t = step / 9, s = 1 - t;
      outline.push([0, 1].map(axis => s ** 3 * start[axis] + 3 * s * s * t * control1[axis] + 3 * s * t * t * control2[axis] + t ** 3 * end[axis]));
    }
  });
  const signedArea = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const indices = outline.map((_, index) => index).reverse();
  const faces = [];
  for (let attempts = 0; indices.length > 2 && attempts < outline.length * outline.length; attempts++) {
    for (let index = 0; index < indices.length; index++) {
      const a = indices[(index + indices.length - 1) % indices.length], b = indices[index], c = indices[(index + 1) % indices.length];
      if (signedArea(outline[a], outline[b], outline[c]) <= 0) continue;
      const occupied = indices.some(other => other !== a && other !== b && other !== c && signedArea(outline[a], outline[b], outline[other]) >= 0 && signedArea(outline[b], outline[c], outline[other]) >= 0 && signedArea(outline[c], outline[a], outline[other]) >= 0);
      if (occupied) continue;
      faces.push([a, b, c]);
      indices.splice(index, 1);
      break;
    }
  }

  for (let leaf = 0; leaf < 6; leaf++) {
    const angle = leaf / 6 * TAU;
    const scale = leaf % 2 ? .91 : 1;
    const base = radius(angle);
    function leafPoint(index, front, inset = 0) {
      const [x, y] = outline[index];
      return local(angle, x * (1 - inset), -.13 + (y * (1 - inset) + inset * .18) * scale, base + y * .065 + (front ? .019 : -.020));
    }
    faces.forEach(face => {
      triangle(.../** @type {[number[], number[], number[]]} */ (face.map(index => leafPoint(index, true, .055))), METAL);
      triangle(.../** @type {[number[], number[], number[]]} */ ([...face].reverse().map(index => leafPoint(index, false))), [.255, .212, .148]);
    });
    outline.forEach((_, index) => {
      const next = (index + 1) % outline.length;
      const a = leafPoint(index, true, .055), b = leafPoint(next, true, .055);
      const c = leafPoint(next, false), d = leafPoint(index, false);
      triangle(a, b, c, EDGE); triangle(a, c, d, EDGE);
    });
    // Shallow chased veins break up the broad metal faces without sharp spikes.
    wire(t => local(angle, .006 * Math.sin(t * 6), -.10 + t * .33 * scale, base + .027 + t * .022), .004, 22, EDGE);
    [-1, 1].forEach(direction => wire(t => local(angle, direction * (.022 + t * .124), -.02 + t * .13 * scale, base + .032 + t * .007), .004, 18, EDGE));

    // A low, rounded garnet is sunk into a restrained gold bezel.
    wire(t => local(angle, Math.cos(t * TAU) * .075, -.263 + Math.sin(t * TAU) * .087, base + .019), .012, 40);
    surface((u, v) => {
      const longitude = u * TAU, latitude = v * Math.PI;
      return local(angle, Math.sin(latitude) * Math.cos(longitude) * .065, -.263 + Math.cos(latitude) * .077, base + .012 + Math.sin(latitude) * Math.sin(longitude) * .042);
    }, 32, 16, GARNET, 1);

    // Small pins and a chased botanical flourish occupy the spaces between stones.
    const between = angle + Math.PI / 6;
    const betweenRadius = radius(between);
    surface((u, v) => {
      const longitude = u * TAU, latitude = v * Math.PI;
      return local(between, Math.sin(latitude) * Math.cos(longitude) * .018, -.263 + Math.cos(latitude) * .018, betweenRadius + .008 + Math.sin(latitude) * Math.sin(longitude) * .017);
    }, 12, 8, EDGE);
    [-1, 1].forEach(direction => {
      wire(t => local(between, direction * (.032 + t * .178), -.263 + Math.sin(t * Math.PI) * .047, betweenRadius + .003), .0035, 22, EDGE);
      wire(t => local(between, direction * (.032 + t * .178), -.263 - Math.sin(t * Math.PI) * .047, betweenRadius + .003), .0035, 22, METAL);
    });
  }
  cachedGeometry = new Float32Array(data);
  return cachedGeometry;
}
