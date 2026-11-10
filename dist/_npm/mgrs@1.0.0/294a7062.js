/**
 * Bundled by jsDelivr using Rollup v4.62.2 and esbuild v0.28.1.
 * Original file: /npm/mgrs@1.0.0/mgrs.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var U = 6,
  O = "AJSAJS",
  F = "AFAFAF",
  N = 65,
  d = 73,
  k = 79,
  C = 86,
  R = 90,
  m = { forward: G, inverse: q, toPoint: D };
function G(e, r) {
  return ((r = r || 5), J(x({ lat: e[1], lon: e[0] }), r));
}
function q(e) {
  var r = E(Z(e.toUpperCase()));
  return r.lat && r.lon
    ? [r.lon, r.lat, r.lon, r.lat]
    : [r.left, r.bottom, r.right, r.top];
}
function D(e) {
  var r = E(Z(e.toUpperCase()));
  return r.lat && r.lon
    ? [r.lon, r.lat]
    : [(r.left + r.right) / 2, (r.top + r.bottom) / 2];
}
function P(e) {
  return e * (Math.PI / 180);
}
function _(e) {
  return 180 * (e / Math.PI);
}
function x(e) {
  var r = e.lat,
    n = e.lon,
    v = 6378137,
    t = 0.00669438,
    f = 0.9996,
    i,
    a,
    c,
    s,
    l,
    o,
    u,
    M = P(r),
    h = P(n),
    L,
    b;
  ((b = Math.floor((n + 180) / 6) + 1),
    n === 180 && (b = 60),
    r >= 56 && r < 64 && n >= 3 && n < 12 && (b = 32),
    r >= 72 &&
      r < 84 &&
      (n >= 0 && n < 9
        ? (b = 31)
        : n >= 9 && n < 21
          ? (b = 33)
          : n >= 21 && n < 33
            ? (b = 35)
            : n >= 33 && n < 42 && (b = 37)),
    (i = (b - 1) * 6 - 180 + 3),
    (L = P(i)),
    (a = t / (1 - t)),
    (c = v / Math.sqrt(1 - t * Math.sin(M) * Math.sin(M))),
    (s = Math.tan(M) * Math.tan(M)),
    (l = a * Math.cos(M) * Math.cos(M)),
    (o = Math.cos(M) * (h - L)),
    (u =
      v *
      ((1 - t / 4 - (3 * t * t) / 64 - (5 * t * t * t) / 256) * M -
        ((3 * t) / 8 + (3 * t * t) / 32 + (45 * t * t * t) / 1024) *
          Math.sin(2 * M) +
        ((15 * t * t) / 256 + (45 * t * t * t) / 1024) * Math.sin(4 * M) -
        ((35 * t * t * t) / 3072) * Math.sin(6 * M))));
  var w =
      f *
        c *
        (o +
          ((1 - s + l) * o * o * o) / 6 +
          ((5 - 18 * s + s * s + 72 * l - 58 * a) * o * o * o * o * o) / 120) +
      5e5,
    g =
      f *
      (u +
        c *
          Math.tan(M) *
          ((o * o) / 2 +
            ((5 - s + 9 * l + 4 * l * l) * o * o * o * o) / 24 +
            ((61 - 58 * s + s * s + 600 * l - 330 * a) *
              o *
              o *
              o *
              o *
              o *
              o) /
              720));
  return (
    r < 0 && (g += 1e7),
    {
      northing: Math.round(g),
      easting: Math.round(w),
      zoneNumber: b,
      zoneLetter: B(r),
    }
  );
}
function E(e) {
  var r = e.northing,
    n = e.easting,
    v = e.zoneLetter,
    t = e.zoneNumber;
  if (t < 0 || t > 60) return null;
  var f = 0.9996,
    i = 6378137,
    a = 0.00669438,
    c,
    s = (1 - Math.sqrt(1 - a)) / (1 + Math.sqrt(1 - a)),
    l,
    o,
    u,
    M,
    h,
    L,
    b,
    w,
    g,
    z = n - 5e5,
    I = r;
  (v < "N" && (I -= 1e7),
    (b = (t - 1) * 6 - 180 + 3),
    (c = a / (1 - a)),
    (L = I / f),
    (w = L / (i * (1 - a / 4 - (3 * a * a) / 64 - (5 * a * a * a) / 256))),
    (g =
      w +
      ((3 * s) / 2 - (27 * s * s * s) / 32) * Math.sin(2 * w) +
      ((21 * s * s) / 16 - (55 * s * s * s * s) / 32) * Math.sin(4 * w) +
      ((151 * s * s * s) / 96) * Math.sin(6 * w)),
    (l = i / Math.sqrt(1 - a * Math.sin(g) * Math.sin(g))),
    (o = Math.tan(g) * Math.tan(g)),
    (u = c * Math.cos(g) * Math.cos(g)),
    (M = (i * (1 - a)) / Math.pow(1 - a * Math.sin(g) * Math.sin(g), 1.5)),
    (h = z / (l * f)));
  var A =
    g -
    ((l * Math.tan(g)) / M) *
      ((h * h) / 2 -
        ((5 + 3 * o + 10 * u - 4 * u * u - 9 * c) * h * h * h * h) / 24 +
        ((61 + 90 * o + 298 * u + 45 * o * o - 252 * c - 3 * u * u) *
          h *
          h *
          h *
          h *
          h *
          h) /
          720);
  A = _(A);
  var T =
    (h -
      ((1 + 2 * o + u) * h * h * h) / 6 +
      ((5 - 2 * u + 28 * o - 3 * u * u + 8 * c + 24 * o * o) *
        h *
        h *
        h *
        h *
        h) /
        120) /
    Math.cos(g);
  T = b + _(T);
  var p;
  if (e.accuracy) {
    var S = E({
      northing: e.northing + e.accuracy,
      easting: e.easting + e.accuracy,
      zoneLetter: e.zoneLetter,
      zoneNumber: e.zoneNumber,
    });
    p = { top: S.lat, right: S.lon, bottom: A, left: T };
  } else p = { lat: A, lon: T };
  return p;
}
function B(e) {
  var r = "Z";
  return (
    84 >= e && e >= 72
      ? (r = "X")
      : 72 > e && e >= 64
        ? (r = "W")
        : 64 > e && e >= 56
          ? (r = "V")
          : 56 > e && e >= 48
            ? (r = "U")
            : 48 > e && e >= 40
              ? (r = "T")
              : 40 > e && e >= 32
                ? (r = "S")
                : 32 > e && e >= 24
                  ? (r = "R")
                  : 24 > e && e >= 16
                    ? (r = "Q")
                    : 16 > e && e >= 8
                      ? (r = "P")
                      : 8 > e && e >= 0
                        ? (r = "N")
                        : 0 > e && e >= -8
                          ? (r = "M")
                          : -8 > e && e >= -16
                            ? (r = "L")
                            : -16 > e && e >= -24
                              ? (r = "K")
                              : -24 > e && e >= -32
                                ? (r = "J")
                                : -32 > e && e >= -40
                                  ? (r = "H")
                                  : -40 > e && e >= -48
                                    ? (r = "G")
                                    : -48 > e && e >= -56
                                      ? (r = "F")
                                      : -56 > e && e >= -64
                                        ? (r = "E")
                                        : -64 > e && e >= -72
                                          ? (r = "D")
                                          : -72 > e && e >= -80 && (r = "C"),
    r
  );
}
function J(e, r) {
  var n = "00000" + e.easting,
    v = "00000" + e.northing;
  return (
    e.zoneNumber +
    e.zoneLetter +
    K(e.easting, e.northing, e.zoneNumber) +
    n.substr(n.length - 5, r) +
    v.substr(v.length - 5, r)
  );
}
function K(e, r, n) {
  var v = V(n),
    t = Math.floor(e / 1e5),
    f = Math.floor(r / 1e5) % 20;
  return y(t, f, v);
}
function V(e) {
  var r = e % U;
  return (r === 0 && (r = U), r);
}
function y(e, r, n) {
  var v = n - 1,
    t = O.charCodeAt(v),
    f = F.charCodeAt(v),
    i = t + e - 1,
    a = f + r,
    c = !1;
  (i > R && ((i = i - R + N - 1), (c = !0)),
    (i === d || (t < d && i > d) || ((i > d || t < d) && c)) && i++,
    (i === k || (t < k && i > k) || ((i > k || t < k) && c)) &&
      (i++, i === d && i++),
    i > R && (i = i - R + N - 1),
    a > C ? ((a = a - C + N - 1), (c = !0)) : (c = !1),
    (a === d || (f < d && a > d) || ((a > d || f < d) && c)) && a++,
    (a === k || (f < k && a > k) || ((a > k || f < k) && c)) &&
      (a++, a === d && a++),
    a > C && (a = a - C + N - 1));
  var s = String.fromCharCode(i) + String.fromCharCode(a);
  return s;
}
function Z(e) {
  if (e && e.length === 0) throw "MGRSPoint coverting from nothing";
  for (
    var r = e.length, n = null, v = "", t, f = 0;
    !/[A-Z]/.test((t = e.charAt(f)));
  ) {
    if (f >= 2) throw "MGRSPoint bad conversion from: " + e;
    ((v += t), f++);
  }
  var i = parseInt(v, 10);
  if (f === 0 || f + 3 > r) throw "MGRSPoint bad conversion from: " + e;
  var a = e.charAt(f++);
  if (a <= "A" || a === "B" || a === "Y" || a >= "Z" || a === "I" || a === "O")
    throw "MGRSPoint zone letter " + a + " not handled: " + e;
  n = e.substring(f, (f += 2));
  for (var c = V(i), s = W(n.charAt(0), c), l = H(n.charAt(1), c); l < Q(a);)
    l += 2e6;
  var o = r - f;
  if (o % 2 !== 0)
    throw (
      `MGRSPoint has to have an even number 
of digits after the zone letter and two 100km letters - front 
half for easting meters, second half for 
northing meters` + e
    );
  var u = o / 2,
    M = 0,
    h = 0,
    L,
    b,
    w,
    g,
    z;
  return (
    u > 0 &&
      ((L = 1e5 / Math.pow(10, u)),
      (b = e.substring(f, f + u)),
      (M = parseFloat(b) * L),
      (w = e.substring(f + u)),
      (h = parseFloat(w) * L)),
    (g = M + s),
    (z = h + l),
    { easting: g, northing: z, zoneLetter: a, zoneNumber: i, accuracy: L }
  );
}
function W(e, r) {
  for (var n = O.charCodeAt(r - 1), v = 1e5, t = !1; n !== e.charCodeAt(0);) {
    if ((n++, n === d && n++, n === k && n++, n > R)) {
      if (t) throw "Bad character: " + e;
      ((n = N), (t = !0));
    }
    v += 1e5;
  }
  return v;
}
function H(e, r) {
  if (e > "V") throw "MGRSPoint given invalid Northing " + e;
  for (var n = F.charCodeAt(r - 1), v = 0, t = !1; n !== e.charCodeAt(0);) {
    if ((n++, n === d && n++, n === k && n++, n > C)) {
      if (t) throw "Bad character: " + e;
      ((n = N), (t = !0));
    }
    v += 1e5;
  }
  return v;
}
function Q(e) {
  var r;
  switch (e) {
    case "C":
      r = 11e5;
      break;
    case "D":
      r = 2e6;
      break;
    case "E":
      r = 28e5;
      break;
    case "F":
      r = 37e5;
      break;
    case "G":
      r = 46e5;
      break;
    case "H":
      r = 55e5;
      break;
    case "J":
      r = 64e5;
      break;
    case "K":
      r = 73e5;
      break;
    case "L":
      r = 82e5;
      break;
    case "M":
      r = 91e5;
      break;
    case "N":
      r = 0;
      break;
    case "P":
      r = 8e5;
      break;
    case "Q":
      r = 17e5;
      break;
    case "R":
      r = 26e5;
      break;
    case "S":
      r = 35e5;
      break;
    case "T":
      r = 44e5;
      break;
    case "U":
      r = 53e5;
      break;
    case "V":
      r = 62e5;
      break;
    case "W":
      r = 7e6;
      break;
    case "X":
      r = 79e5;
      break;
    default:
      r = -1;
  }
  if (r >= 0) return r;
  throw "Invalid zone letter: " + e;
}
export { m as default, G as forward, q as inverse, D as toPoint };
