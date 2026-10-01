// The throne is assembled like a piece of furniture: oak joinery, recessed
// panels, turned supports and a stone plinth. All detail is genuine geometry.
const TAU = Math.PI * 2;
const normalize = v => { const length = Math.hypot(...v) || 1; return v.map(n => n / length); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const subtract = (a, b) => a.map((n, i) => n - b[i]);

// The last channel selects the surface response in throne-material.js.
const oak = [.134, .115, .089, 0];
const endgrain = [.105, .088, .067, 0];
const carving = [.164, .139, .107, 0];
const recess = [.061, .051, .039, 0];
const stone = [.177, .158, .132, 1];
const floor = [.086, .079, .067, 2];
const leather = [.076, .051, .036, 3];
const iron = [.096, .086, .067, 4];

export function createThroneGeometry() {
  const data = [];
  function triangle(a, b, c, material, normals = null) {
    const normal = normalize(cross(subtract(b, a), subtract(c, a)));
    [a, b, c].forEach((point, i) => data.push(...point, ...(normals ? normals[i] : normal), ...material));
  }
  function quad(a, b, c, d, material) { triangle(a, b, c, material); triangle(a, c, d, material); }
  function smoothQuad(a, b, c, d, normals, material) {
    triangle(a, b, c, material, normals.slice(0, 3));
    triangle(a, c, d, material, [normals[0], normals[2], normals[3]]);
  }

  function roundedLoop(x, z, width, depth, radius) {
    const points = [];
    const r = Math.max(.002, Math.min(radius, width / 2 - .001, depth / 2 - .001));
    for (let corner = 0; corner < 4; corner++) {
      const angle = corner * Math.PI / 2;
      const cx = x + (corner === 0 || corner === 3 ? 1 : -1) * (width / 2 - r);
      const cz = z + (corner < 2 ? 1 : -1) * (depth / 2 - r);
      for (let i = 0; i <= 4; i++) {
        const a = angle + i / 4 * Math.PI / 2;
        points.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
      }
    }
    return points;
  }

  function box(x, y, z, width, height, depth, material, bevel = .025) {
    const b = Math.min(bevel, width / 4, height / 3, depth / 4);
    const rings = [];
    // Circular bevels soften the edges instead of a single low-poly chamfer.
    for (let i = 0; i <= 3; i++) {
      const angle = i / 3 * Math.PI / 2;
      const inset = b * (1 - Math.sin(angle));
      rings.push(roundedLoop(x, z, width - inset * 2, depth - inset * 2, b).map(([px, pz]) => [px, y + b * (1 - Math.cos(angle)), pz]));
    }
    for (let i = 0; i <= 3; i++) {
      const angle = i / 3 * Math.PI / 2;
      const inset = b * (1 - Math.cos(angle));
      rings.push(roundedLoop(x, z, width - inset * 2, depth - inset * 2, b).map(([px, pz]) => [px, y + height - b + b * Math.sin(angle), pz]));
    }
    for (let r = 0; r < rings.length - 1; r++) for (let i = 0; i < rings[r].length; i++) {
      const next = (i + 1) % rings[r].length;
      quad(rings[r][i], rings[r + 1][i], rings[r + 1][next], rings[r][next], material);
    }
    const top = rings[rings.length - 1];
    for (let i = 0; i < top.length; i++) {
      const next = (i + 1) % top.length;
      triangle([x, y + height, z], top[next], top[i], material);
      triangle([x, y, z], rings[0][i], rings[0][next], material);
    }
  }

  function tube(points, radius, material, segments = 10) {
    const rings = points.map((p, i) => {
      const tangent = normalize(subtract(points[Math.min(i + 1, points.length - 1)], points[Math.max(i - 1, 0)]));
      const side = normalize(cross(tangent, Math.abs(tangent[2]) < .95 ? [0, 0, 1] : [1, 0, 0]));
      const up = normalize(cross(tangent, side));
      return Array.from({ length: segments }, (_, j) => {
        const a = j / segments * TAU;
        const normal = side.map((n, k) => n * Math.cos(a) + up[k] * Math.sin(a));
        return { point: p.map((n, k) => n + normal[k] * radius), normal };
      });
    });
    for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < segments; j++) {
      const k = (j + 1) % segments;
      const corners = [rings[i][j], rings[i][k], rings[i + 1][k], rings[i + 1][j]];
      smoothQuad(corners[0].point, corners[1].point, corners[2].point, corners[3].point, corners.map(c => c.normal), material);
    }
  }

  function turnedPost(x, y, z, profile, material, segments = 28) {
    for (let i = 0; i < profile.length - 1; i++) {
      const [ay, ar] = profile[i], [by, br] = profile[i + 1];
      const slope = (ar - br) / Math.max(.001, by - ay);
      for (let j = 0; j < segments; j++) {
        const a = j / segments * TAU, b = (j + 1) / segments * TAU;
        const p = (angle, height, radius) => [x + Math.cos(angle) * radius, y + height, z + Math.sin(angle) * radius];
        const na = normalize([Math.cos(a), slope, Math.sin(a)]), nb = normalize([Math.cos(b), slope, Math.sin(b)]);
        smoothQuad(p(a, ay, ar), p(a, by, br), p(b, by, br), p(b, ay, ar), [na, na, nb, nb], material);
      }
    }
  }

  function archOutline(x, bottom, spring, width, rise) {
    const points = [[x - width / 2, bottom], [x + width / 2, bottom]];
    for (let i = 0; i <= 32; i++) {
      const a = i / 32 * Math.PI;
      points.push([x + Math.cos(a) * width / 2, spring + Math.sin(a) * rise]);
    }
    return points;
  }

  function panel(x, bottom, spring, width, rise, z, depth, material, bevel = .025) {
    const outside = archOutline(x, bottom, spring, width, rise);
    const inside = archOutline(x, bottom + bevel, spring, width - bevel * 2, rise - bevel);
    const center = [x, (bottom + spring) / 2, z];
    for (let i = 0; i < outside.length; i++) {
      const j = (i + 1) % outside.length;
      triangle(center, [...inside[i], z], [...inside[j], z], material);
      quad([...inside[i], z], [...outside[i], z - bevel], [...outside[j], z - bevel], [...inside[j], z], material);
      quad([...outside[i], z - bevel], [...outside[i], z - depth], [...outside[j], z - depth], [...outside[j], z - bevel], material);
    }
  }

  function moulding(x, bottom, spring, width, rise, z, radius, material) {
    const outline = archOutline(x, bottom, spring, width, rise);
    tube([...outline, outline[0]].map(([px, py]) => [px, py, z]), radius, material);
  }

  // Broad worn limestone steps, with restrained irregular joints.
  quad([-18, -.045, 14], [18, -.045, 14], [18, -.045, -22], [-18, -.045, -22], floor);
  box(0, 0, .07, 4.35, .16, 3.35, stone, .045);
  box(0, .16, -.09, 3.62, .17, 2.80, [.155, .138, .115, 1], .039);
  box(0, .33, -.20, 2.94, .15, 2.22, stone, .032);

  // Four separate legs and mortised seat rails keep the silhouette believable.
  for (const side of [-1, 1]) {
    turnedPost(side * .76, .48, .60, [[0,.13],[.07,.15],[.13,.15],[.16,.115],[.48,.09],[.58,.12],[.66,.12],[.70,.14]], oak);
    box(side * .76, .48, -.55, .24, 3.00, .25, oak, .022);
    box(side * .76, .55, .02, .105, .105, 1.18, endgrain, .015);
    box(side * .76, 1.05, .02, .19, .24, 1.37, oak);
  }
  box(0, 1.055, .62, 1.65, .245, .18, oak);
  box(0, 1.055, .721, 1.33, .034, .025, carving, .008);
  box(0, 1.253, .04, 1.91, .135, 1.61, carving, .043);
  box(0, 1.378, .085, 1.49, .072, 1.21, leather, .032);
  // The cushion's rolled seam is deliberately almost the same color.
  const seam = roundedLoop(0, .085, 1.43, 1.15, .11);
  tube([...seam, seam[0]].map(([x, z]) => [x, 1.419, z]), .007, [.116,.081,.052,3], 6);

  // A solid arched back with inset joinery, rather than blades or a metal halo.
  panel(0, 1.31, 3.36, 1.68, .39, -.415, .23, oak, .045);
  panel(0, 1.54, 3.24, 1.33, .31, -.357, .048, recess, .02);
  moulding(0, 1.53, 3.25, 1.39, .33, -.326, .025, carving);
  moulding(0, 1.60, 3.24, 1.25, .265, -.324, .011, oak);
  // Three recessed fielded panels catch grazing light like hand-cut oak.
  for (let i = -1; i <= 1; i++) {
    const x = i * .387, spring = 3.025 - Math.abs(i) * .085;
    panel(x, 1.73, spring, .329, .16, -.333, .02, endgrain, .019);
    moulding(x, 1.71, spring, .354, .179, -.306, .013, carving);
    panel(x, 1.82, spring - .06, .232, .115, -.310, .015, oak, .024);
  }
  box(0, 1.47, -.301, 1.51, .087, .064, carving, .017);
  box(0, 1.59, -.301, 1.32, .037, .057, endgrain, .01);
  // Shallow floral carving, scaled as workmanship rather than a magic emblem.
  for (let petal = 0; petal < 6; petal++) {
    const a = petal * TAU / 6;
    const points = Array.from({ length: 19 }, (_, i) => {
      const t = i / 18 * TAU;
      const u = .053 + .047 * Math.cos(t), v = .020 * Math.sin(t);
      return [u * Math.sin(a) + v * Math.cos(a), 3.432 + u * Math.cos(a) - v * Math.sin(a), -.312];
    });
    tube(points, .010, carving, 8);
  }
  // An uninterrupted curved cornice and small turned finials.
  moulding(0, 3.22, 3.38, 1.74, .395, -.422, .036, carving);
  for (const side of [-1, 1]) {
    box(side * .80, 1.40, -.395, .155, 1.99, .18, oak, .03);
    box(side * .80, 3.33, -.40, .21, .075, .23, carving, .018);
    turnedPost(side * .80, 3.405, -.40, [[0,.075],[.025,.080],[.05,.055],[.085,.068],[.13,.063],[.165,.038],[.18,0]], oak);

    // Turned front arm supports, a bowed arm rail and softly rounded handrest.
    turnedPost(side * .86, 1.37, .61, [[0,.105],[.05,.105],[.075,.072],[.16,.061],[.20,.083],[.25,.087],[.30,.069],[.44,.057],[.49,.09],[.54,.093]], carving);
    const rail = Array.from({ length: 15 }, (_, i) => {
      const t = i / 14;
      return [side * (.86 - t * .03), 1.925 + t * .18 - Math.sin(t * Math.PI) * .045, .68 - t * 1.10];
    });
    tube(rail, .092, oak, 16);
    box(side * .86, 1.90, .60, .263, .095, .38, carving, .040);
    box(side * .86, 1.43, .0, .085, .09, 1.17, endgrain, .015);
    // Narrow carved side panels leave the weight and depth of the seat visible.
    box(side * .84, 1.49, -.07, .065, .38, .79, endgrain, .022);
    box(side * .883, 1.55, -.07, .024, .24, .64, oak, .008);
  }

  // Small dark iron pegs are construction details, never luminous decoration.
  for (const side of [-1, 1]) for (const y of [1.12, 1.23]) {
    tube([[side * .66, y, .719], [side * .66, y, .729]], .015, iron, 10);
  }

  // Only the hint of a vaulted room: heavy stone piers disappear in darkness.
  for (const side of [-1, 1]) {
    box(side * 4.9, -.04, -3.8, 1.12, .37, 1.30, [.096,.088,.074,1], .07);
    box(side * 4.9, .33, -3.8, .77, 8.1, .98, [.101,.094,.080,1], .055);
    box(side * 8.3, -.04, -9.0, 1.20, 9.6, 1.40, [.082,.076,.064,1], .07);
  }

  return new Float32Array(data);
}
