(function(g) {
  var f = (g.vector = g.vector || {}).Point,
    d = g.vector.mcMasterSmooth = function(a, d) {
      d = d || 3;
      0 === d % 2 && d++;
      var f = d / 2 >> 0,
        b = a.length;
      if (b < d) return a;
      for (var c = 0, p = 0, g = 0; g < d; g++) c += a[g].x, p += a[g].y;
      for (var m = a.slice(0, f), g = f, u = b - f; g < u; g++) {
        var t = a[g];
        "C" === t.cmd ? m.push(t) : (g > f && (c -= a[g - f - 1].x, p -= a[g - f - 1].y, c += a[g + f].x, p += a[g + f].y), m.push({
          x: (t.x + c / d) / 2,
          y: (t.y + p / d) / 2
        }))
      }
      return m.concat(a.slice(u, b))
    },
    a = g.vector.langSimplify = function(a, d, l) {
      d = d || 4;
      l = l || 1;
      var b = a.length - 1;
      if (0 >= b) return a;
      var c = 0,
        p = 0,
        g = Math.min(d, b),
        p = p + g,
        b = b - g,
        m = [];
      for (m.push(a[c]); g;) {
        for (var u = a[c], t = a[p], h = 0, r = c + 1; r != p;) {
          var k = f.toLineDistance(a[r], u, t),
            h = Math.max(h, k);
          if (h > l) break;
          else r++
        }
        h < l ? (c = p, m.push(a[c]), g = Math.min(d, b), p += g, b -= g) : (p--, b++)
      }
      return m
    };
  g.vector.roundPath = function(a, d) {
    var f = Math.pow(10, d);
    a.forEach(function(a) {
      for (var c in a) {
        var d = a[c];
        isFinite(d) && (a[c] = Math.round(d * f) / f)
      }
    });
    return a
  };
  g.vector.simplify = function(e, f, l) {
    return a(d(e, 3), 6, 1)
  }
})(sketch);
"undefined" === typeof sketch && (sketch = {});
(function(g) {
  g = g.vector || {};
  var f = function() {
      return {
        a: 1,
        b: 0,
        x: 0,
        c: 0,
        d: 1,
        y: 0
      }
    },
    d = function(d) {
      return d.a === a.a && d.b === a.b && d.c === a.c && d.d === a.d && d.x === a.x && d.y === a.y
    },
    a = f(),
    e = g.Transform = function(a) {
      void 0 === a ? this.matrix = f() : isFinite(a.a + a.b + a.c + a.d + a.x + a.y) ? this.fromObject(a) : isFinite(a[0] + a[1] + a[2] + a[3] + a[4] + a[5]) ? this.fromArray(a) : this.matrix = f();
      return this
    };
  e.identity = a;
  e.isIdentity = d;
  e.getIdentity = f;
  e.prototype = {
    identity: a,
    isIdentity: d,
    getIdentity: f,
    matrices: [],
    save: function() {
      this.matrices.push(this.cloneMatrix(this.matrix))
    },
    restore: function() {
      this.matrix = this.matrices.pop() || f()
    },
    point2d: function(a, d) {
      var b = this.matrix;
      return {
        x: b.a * a + b.c * d + b.x,
        y: b.b * a + b.d * d + b.y
      }
    },
    point2dx: function(a, d, b) {
      var c = this.matrix,
        e = a[d],
        f = a[b];
      a[d] = c.a * e + c.c * f + c.x;
      a[b] = c.b * e + c.d * f + c.y;
      return a
    },
    flatten: function(a, e, b) {
      if (a) {
        e && (a = JSON.parse(JSON.stringify(a)));
        if (a.length) {
          if (!d(this.matrix)) {
            e = 0;
            for (var c = a.length, f; e < c; e++) if (f = a[e]) switch (f.cmd) {
            case "M":
              this.point2dx(f, "x", "y");
              break;
            case "L":
              this.point2dx(f, "x", "y");
              break;
            case "C":
              this.point2dx(f, "x", "y");
              this.point2dx(f, "x1", "y1");
              this.point2dx(f, "x2", "y2");
              break;
            case "Q":
              this.point2dx(f, "x", "y");
              this.point2dx(f, "x1", "y1");
              break;
            case "Z":
            case "z":
              isFinite(f.x + f.y) && this.point2dx(f, "x", "y")
            }
          }
          b && (this.matrix = this.getIdentity())
        } else this.point2dx(a, "x", "y");
        return a
      }
    },
    invert: function(a) {
      a = a || this.matrix;
      void 0 === a.a && (M = this.cloneMatrix(M));
      var d = a.a * a.d - a.b * a.c;
      delete this.matrix;
      this.combine({
        a: a.d / d,
        b: -a.b / d,
        x: (a.b * a.y - a.d * a.x) / d,
        c: -a.c / d,
        d: a.a / d,
        y: (a.c * a.x - a.a * a.y) / d
      });
      return this
    },
    transform: function(a, d, b, c, e, f) {
      var m = this.matrix;
      this.matrix = {
        a: m.a * a + m.c * d,
        b: m.b * a + m.d * d,
        c: m.a * b + m.c * c,
        d: m.b * b + m.d * c,
        x: m.a * e + m.c * f + m.x,
        y: m.b * e + m.d * f + m.y
      };
      return this
    },
    setTransform: function(a, d, b, c, e, f) {
      this.matrix = {
        a: a,
        b: d,
        c: b,
        d: c,
        x: e,
        y: f
      };
      return this
    },
    rotate: function(a) {
      var d = this.matrix,
        b = Math.cos(a);
      a = Math.sin(a);
      this.matrix = {
        a: d.a * b + d.b * -a,
        b: d.a * a + d.b * b,
        c: d.c * b + d.d * -a,
        d: d.c * a + d.d * b,
        x: d.x,
        y: d.y
      };
      return this
    },
    scale: function(a, d) {
      void 0 === d && (d = a);
      var b = this.matrix;
      this.matrix = {
        a: b.a * a,
        b: b.b * d,
        c: b.c * a,
        d: b.d * d,
        x: b.x,
        y: b.y
      };
      return this
    },
    skew: function(a, d) {
      var b = this.matrix,
        c = b.a,
        e = b.b,
        f = b.c,
        m = b.d,
        g = Math.tan(a),
        t = Math.tan(d);
      b.a = c + f * t;
      b.b = e + m * t;
      b.c = c * g + f;
      b.d = e * g + m;
      return this
    },
    translate: function(a, d) {
      void 0 === d && (d = 0);
      var b = this.matrix;
      b.x = b.a * a + b.c * d + b.x;
      b.y = b.b * a + b.d * d + b.y;
      return this
    },
    combine: function(a) {
      var d = [];
      if (void 0 !== a.matrix) for (var b = 0; b < arguments.length; b++) d[b] = arguments[b].matrix;
      else if ("number" === typeof a.a) for (b = 0; b < arguments.length; b++) d[b] = arguments[b];
      else d = a;
      for (var b = this.matrix, c = [], e = 0; e < d.length; e++) void 0 === b ? b = d[e] : (c = d[e], b = {
        a: b.a * c.a + b.b * c.c,
        b: b.a * c.b + b.b * c.d,
        c: b.c * c.a + b.d * c.c,
        d: b.c * c.b + b.d * c.d,
        x: b.a * c.x + b.c * c.y + b.x,
        y: b.b * c.x + b.d * c.y + b.y
      });
      this.matrix = b;
      return this
    },
    clone: function() {
      return new e(this.cloneMatrix())
    },
    cloneMatrix: function(a) {
      a = a || this.matrix;
      return {
        a: a.a,
        b: a.b,
        c: a.c,
        d: a.d,
        x: a.x,
        y: a.y
      }
    },
    reset: function() {
      this.matrix = f();
      return this
    },
    fromArray: function(a) {
      this.matrix = {
        a: a[0],
        b: a[1],
        c: a[2],
        d: a[3],
        x: a[4],
        y: a[5]
      };
      return this
    },
    fromObject: function(a) {
      this.matrix = this.cloneMatrix(a);
      return this
    },
    fromString: function(a) {
      this.matrix = a.split(",").map(function(a) {
        return parseFloat(a)
      });
      return this
    },
    toString: function(a) {
      a = a || this.matrix;
      return "" + a.a + "," + a.b + "," + a.c + "," + a.d + "," + a.x + "," + a.y
    },
    toArray: function(a) {
      a = a || this.matrix;
      return [a.a, a.b, a.c, a.d, a.x, a.y]
    },
    apply: function(a, d) {
      var b = this.matrix;
      d ? a.transform(b.a, b.b, b.c, b.d, b.x, b.y) : a.setTransform(b.a, b.b, b.c, b.d, b.x, b.y);
      return this
    }
  };
  e.__default = new e;
  e.cloneMatrix = function(a) {
    return {
      a: a.a,
      b: a.b,
      c: a.c,
      d: a.d,
      x: a.x,
      y: a.y
    }
  };
  "undefined" !== typeof module && module.exports && (module.exports = e)
})(sketch);
"undefined" === typeof sketch && (sketch = {});

(function(g) {
  var f = g.vector = g.vector || {};
  g = f.Shape = f.Shape || {};
  var d = Math.PI,
    a = 2 * d;
  g.record = function() {
    var a;
    this.data = [];
    this.save = function() {};
    this.restore = function() {};
    this.translate = function() {};
    this.rotate = function() {};
    this.scale = function() {};
    this.beginPath = function() {
      this.data = []
    };
    this.moveTo = function(b, c) {
      this.data.push(a = {
        cmd: "M",
        x: b,
        y: c
      })
    };
    this.lineTo = function(a, b) {
      this.data.push({
        cmd: "L",
        x: a,
        y: b
      })
    };
    this.bezierCurveTo = function(a, b, c, d, e, f) {
      this.data.push({
        cmd: "C",
        x1: a,
        y1: b,
        x2: c,
        y2: d,
        x: e,
        y: f
      })
    };
    this.quadraticCurveTo = function(a, b, c, d) {
      this.data.push({
        cmd: "Q",
        x1: a,
        y1: b,
        x: c,
        y: d
      })
    };
    this.arcTo = function(a, b, c, d, e) {
      this.data.push({
        cmd: "A",
        x1: a,
        y1: b,
        x2: c,
        y2: d,
        radius: e
      })
    };
    this.closePath = function() {
      this.data.push({
        cmd: "Z",
        x: a.x,
        y: a.y
      })
    };
    this.stringify = function() {
      return f.SVGPath.fromVOBPath(this.data)
    }
  };
  g.VOBNode = function(a, b) {
    switch (b.type) {
    case "image":
      a.drawImage(b.image, b.x, b.y, b.width, b.height);
      break;
    case "line":
      a.moveTo(b.x1, b.y1);
      a.lineTo(b.x2, b.y2);
      break;
    case "polyline":
    case "polygon":
    case "path":
      e(a, b.data);
      break;
    case "ellipse":
      q(a, b.cx, b.cy, b.rx, b.ry);
      break;
    case "circle":
      q(a, b.cx, b.cy, b.r, b.r);
      break;
    case "rect":
      isFinite(b.rx) ? c(a, b.x, b.y, b.width, b.height, b.rx, b.ry) : l(a, b.x, b.y, b.width, b.height)
    }
  };
  var e = g.VOBPath = function(a, b) {
      for (var c = b && b.length, d = 0, e; d < c; d++) if (e = b[d]) switch (e.cmd) {
      case "M":
        a.moveTo(e.x, e.y);
        break;
      case "L":
        a.lineTo(e.x, e.y);
        break;
      case "Q":
        a.quadraticCurveTo(e.x1, e.y1, e.x, e.y);
        break;
      case "C":
        a.bezierCurveTo(e.x1, e.y1, e.x2, e.y2, e.x, e.y);
        break;
      case "A":
        a.arcTo(e.x1, e.y1, e.x2, e.y2, e.radius);
        break;
      case "Z":
      case "z":
        a.closePath()
      }
    };
  g.VOBPathOffset = function(a, b, c, d) {
    for (var e = b && b.length, f = 0, s; f < e; f++) if (s = b[f]) switch (s.cmd) {
    case "M":
      a.moveTo(s.x + c, s.y + d);
      a.lineTo(s.x + c + .01, s.y + d + .01);
      break;
    case "L":
      a.lineTo(s.x + c, s.y + d);
      break;
    case "C":
      a.bezierCurveTo(s.x1 + c, s.y1 + d, s.x2 + c, s.y2 + d, s.x + c, s.y + d)
    }
  };
  g.VOBPathDebug = function(a, b) {
    for (var c = "", d = b.length, e = 0, f; e < d; e++) if (f = b[i]) switch (f.cmd) {
    case "M":
      c += "ctx.moveTo(" + f.x + "," + f.y + ");\n";
      break;
    case "L":
      c += "ctx.lineTo(" + f.x + "," + f.y + ");\n";
      break;
    case "Q":
      c += "ctx.quadraticCurveTo(" + f.x1 + "," + f.y1 + "," + f.x + "," + f.y + ");\n";
      break;
    case "C":
      c += "ctx.bezierCurveTo(" + f.x1 + "," + f.y1 + "," + f.x2 + "," + f.y2 + "," + f.x + "," + f.y + ");\n";
      break;
    case "A":
      c += "ctx.arcTo(" + f.x1 + "," + f.y1 + "," + f.x2 + "," + f.y2 + "," + f.radius + ");\n";
      break;
    case "Z":
    case "z":
      c += "ctx.closePath();\n"
    }
    console.log(c);
    return c
  };
  g.line = function(a, b, c, d, e) {
    a.moveTo(b, c);
    a.lineTo(d, e)
  };
  g.circle = function(a, b, c, d, e) {
    return q(a, b, c, d, d, e)
  };
  var q = g.ellipse = function(a, b, c, d, e, f) {
      var s = .5522847498307936 * d,
        m = .5522847498307936 * e,
        p = b - d,
        l = c - e;
      d = b + d;
      e = c + e;
      a.moveTo(b, l);
      f ? (a.bezierCurveTo(b - s, l, p, c - m, p, c), a.bezierCurveTo(p, c + m, b - s, e, b, e), a.bezierCurveTo(b + s, e, d, c + m, d, c), a.bezierCurveTo(d, c - m, b + s, l, b, l)) : (a.bezierCurveTo(b + s, l, d, c - m, d, c), a.bezierCurveTo(d, c + m, b + s, e, b, e), a.bezierCurveTo(b - s, e, p, c + m, p, c), a.bezierCurveTo(p, c - m, b - s, l, b, l));
      a.closePath()
    };
  g.SVGPath = function(a, b) {
    return e(a, f.SVG.toVOBPath(b))
  };
  g.cross = function(a, b, c, d, e) {
    a.moveTo(b, c - e / 2);
    a.lineTo(b, c + e / 2);
    a.moveTo(b - d / 2, c);
    a.lineTo(b + d / 2, c)
  };
  g.exmark = function(a, b, c, d) {
    a.moveTo(b + d, c - d);
    a.lineTo(b - d, c + d);
    a.moveTo(b + d, c + d);
    a.lineTo(b - d, c - d)
  };
  g.square = function(a, c, d, e, f) {
    b(a, c - e, d - e, c + e, d + e, f)
  };
  var l = g.rect = function(a, c, d, e, f, m) {
      b(a, c, d, c + e, d + f, m)
    },
    b = g.rectangle = function(a, b, c, d, e, f) {
      a.moveTo(b, c);
      f ? (a.lineTo(b, e), a.lineTo(d, e), a.lineTo(d, c)) : (a.lineTo(d, c), a.lineTo(d, e), a.lineTo(b, e));
      a.closePath()
    };
  g.roundRectangle = function(a, b, d, e, f, m, s, p) {
    c(a, b, d, e - b, f - d, m, s, p)
  };
  var c = g.roundRect = function(a, b, c, e, f, m, s, p) {
      0 > e && (b -= e = Math.abs(e));
      0 > f && (c -= f = Math.abs(f));
      var l, q, g, w, u, E;
      "number" === typeof m ? (isFinite(s) || (s = m), l = e / 2, q = f / 2, m > l && (m = l), s > q && (s = q), l = q = g = w = m, s = u = E = m = s) : (Array.isArray(m) ? 4 === m.length && (m = [m[0], m[0], m[1], m[1], m[2], m[2], m[3], m[3]]) : m = [10, 10, 10, 10, 10, 10, 10, 10], l = m[0], q = m[2], g = m[4], w = m[6], s = m[1], u = m[3], E = m[5], m = m[7]);
      var D = d / 4,
        P = D / 2,
        G = Math.cos(P),
        J = -d / 2,
        N = J + 1 * D,
        K = J + 2 * D,
        O = J + 3 * D,
        V = J + 4 * D,
        L = J + 5 * D,
        T = J + 6 * D,
        Q = J + 7 * D;
      a.moveTo(b + l, c);
      p ? (D *= -1, P *= -1, a.quadraticCurveTo(b + l + Math.cos(J + P) * l / G, c + s + Math.sin(J + P) * s / G, b + l + Math.cos(J + D) * l, c + s + Math.sin(J + D) * s), a.quadraticCurveTo(b + l + Math.cos(Q + P) * l / G, c + s + Math.sin(Q + P) * s / G, b + l + Math.cos(Q + D) * l, c + s + Math.sin(Q + D) * s), a.lineTo(b, c + f - s), a.quadraticCurveTo(b + w + Math.cos(T + P) * w / G, c + f - m + Math.sin(T + P) * m / G, b + w + Math.cos(T + D) * w, c + f - m + Math.sin(T + D) * m), a.quadraticCurveTo(b + w + Math.cos(L + P) * w / G, c + f - m + Math.sin(L + P) * m / G, b + w + Math.cos(L + D) * w, c + f - m + Math.sin(L + D) * m), a.lineTo(b + e - w, c + f), a.quadraticCurveTo(b + e - g + Math.cos(V + P) * g / G, c + f - E + Math.sin(V + P) * E / G, b + e - g + Math.cos(V + D) * g, c + f - E + Math.sin(V + D) * E), a.quadraticCurveTo(b + e - g + Math.cos(O + P) * g / G, c + f - E + Math.sin(O + P) * E / G, b + e - g + Math.cos(O + D) * g, c + f - E + Math.sin(O + D) * E), a.lineTo(b + e, c + E), a.quadraticCurveTo(b + e - q + Math.cos(K + P) * q / G, c + u + Math.sin(K + P) * u / G, b + e - q + Math.cos(K + D) * q, c + u + Math.sin(K + D) * u), a.quadraticCurveTo(b + e - q + Math.cos(N + P) * q / G, c + u + Math.sin(N + P) * u / G, b + e - q + Math.cos(N + D) * q, c + u + Math.sin(N + D) * u), a.lineTo(b + q, c)) : (a.lineTo(b + e - q, c), a.quadraticCurveTo(b + e - q + Math.cos(J + P) * q / G, c + u + Math.sin(J + P) * u / G, b + e - q + Math.cos(J + D) * q, c + u + Math.sin(J + D) * u), a.quadraticCurveTo(b + e - q + Math.cos(N + P) * q / G, c + u + Math.sin(N + P) * u / G, b + e - q + Math.cos(N + D) * q, c + u + Math.sin(N + D) * u), a.lineTo(b + e, c + f - E), a.quadraticCurveTo(b + e - g + Math.cos(K + P) * g / G, c + f - E + Math.sin(K + P) * E / G, b + e - g + Math.cos(K + D) * g, c + f - E + Math.sin(K + D) * E), a.quadraticCurveTo(b + e - g + Math.cos(O + P) * g / G, c + f - E + Math.sin(O + P) * E / G, b + e - g + Math.cos(O + D) * g, c + f - E + Math.sin(O + D) * E), a.lineTo(b + w, c + f), a.quadraticCurveTo(b + w + Math.cos(V + P) * w / G, c + f - m + Math.sin(V + P) * m / G, b + w + Math.cos(V + D) * w, c + f - m + Math.sin(V + D) * m), a.quadraticCurveTo(b + w + Math.cos(L + P) * w / G, c + f - m + Math.sin(L + P) * m / G, b + w + Math.cos(L + D) * w, c + f - m + Math.sin(L + D) * m), a.lineTo(b, c + s), a.quadraticCurveTo(b + l + Math.cos(T + P) * l / G, c + s + Math.sin(T + P) * s / G, b + l + Math.cos(T + D) * l, c + s + Math.sin(T + D) * s), a.quadraticCurveTo(b + l + Math.cos(Q + P) * l / G, c + s + Math.sin(Q + P) * s / G, b + l + Math.cos(Q + D) * l, c + s + Math.sin(Q + D) * s));
      a.closePath()
    };
  g.roundRect2 = function(a, b, c, d, e, f, s) {
    d < 2 * f && (f = d / 2);
    e < 2 * f && (f = e / 2);
    s ? (a.moveTo(b + d - f, c), a.arcTo(b, c, b, c + f, f), a.arcTo(b, c + e, b + f, c + e, f), a.arcTo(b + d, c + e, b + d, c + e - f, f), a.arcTo(b + d, c, b + d - f, c, f)) : (a.moveTo(b + f, c), a.arcTo(b + d, c, b + d, c + e, f), a.arcTo(b + d, c + e, b, c + e, f), a.arcTo(b, c + e, b, c, f), a.arcTo(b, c, b + d, c, f));
    a.closePath()
  };
  g.ring = function(a, b, c, e, f, m, s, l) {
    var q = -d / 2;
    m += q;
    s += q;
    a.arc ? (a.arc(b, c, f, m, s, l), q = s, p(m, q) && (f = b + e * Math.cos(q), q = c + e * Math.sin(q), a.moveTo(f, q)), a.arc(b, c, e, s, m, !l)) : (w(a, f, f, f, m, s, l), q = s, p(m, q) && (b += e * Math.cos(q), c += e * Math.sin(q), a.moveTo(b, c)), w(a, f, f, e, s, m, !l));
    a.closePath()
  };
  g.pie = function(a, b, c, e, f, m, s) {
    var l = -d / 2;
    f += l;
    m += l;
    !1 === p(f, m) && a.moveTo(b, c);
    a.arc ? a.arc(b, c, e, f, m, s) : w(a, b, c, e, f, m, s);
    a.closePath()
  };
  var p = function(b, c) {
      var d = Math.abs((b + a) % a),
        e = Math.abs((c + a) % a);
      return d === e
    },
    w = function(a, b, c, k, m, p, s) {
      if (s) var l = Math.max(m, p),
        q = Math.min(m, p) - 1E-10;
      else l = Math.min(m, p) - 1E-10, q = Math.max(m, p);
      var g = (l - q) / d / 2;
      1 < Math.abs(g) && (b -= 2 * k);
      m = b + k * Math.cos(l);
      l = c + k * Math.sin(l);
      p = b + k * Math.cos(q);
      q = c + k * Math.sin(q);
      g = .5 <= Math.abs(g) ? 1 : 0;
      s = s ? 0 : 1;
      a.moveTo(b, c);
      a.lineTo(m, l);
      e(a, f.SVGPath.arcToBezier(m, l, k, k, 0, g, s, p, q));
      a.closePath()
    };
  g.triangle = function(a, b, c, d, e) {
    m(a, b, c, d, 3, e)
  };
  var m = g.regularPolygon = function(b, c, d, e, f, m) {
      for (var s = a / f, p = 0; p < f; p++) {
        var l = s * (m ? f - p : p) + 0,
          q = Math.sin(l) * e + c,
          l = -Math.cos(l) * e + d;
        0 === p ? b.moveTo(q, l) : b.lineTo(q, l)
      }
      b.closePath()
    };
  g.gear = function(b, c, e, f, m, p, s) {
    1 > p && (f *= p);
    var l = a / m,
      q = l / 4 * (s ? -1 : 1);
    p = f / p;
    var g = (l - d) / 2 + l / 8;
    s && (g += q);
    for (var A = 0; A < m; A++) {
      var w = l * (s ? m - A : A) + g,
        u = w - 3 * q,
        E = w - 2 * q,
        D = w - 1 * q,
        P = Math.cos(u) * p + c,
        u = Math.sin(u) * p + e;
      0 === A ? b.moveTo(P, u) : b.lineTo(P, u);
      b.lineTo(Math.cos(E) * p + c, Math.sin(E) * p + e);
      b.lineTo(Math.cos(D) * f + c, Math.sin(D) * f + e);
      b.lineTo(Math.cos(w) * f + c, Math.sin(w) * f + e)
    }
    b.closePath()
  };
  g.star = function(b, c, e, f, m, p, s) {
    1 > p && (f *= p);
    var l = a / m,
      q = l / 2 * (s ? -1 : 1);
    p = f / p;
    for (var g = (l - d) / 2, A = 0; A < m; A++) {
      var w = l * (s ? m - A : A) + g,
        u = Math.cos(w - q) * p + c,
        E = Math.sin(w - q) * p + e;
      0 === A ? b.moveTo(u, E) : b.lineTo(u, E);
      b.lineTo(Math.cos(w) * f + c, Math.sin(w) * f + e)
    }
    b.closePath()
  };
  g.burst = function(b, c, e, f, m, p, s) {
    var l = s ? -1 : 1,
      q = a / m,
      g = q / 2 * l,
      A = q / 4 * l,
      w = 3 * A,
      u = Math.cos(q / 4);
    1 > p && (f *= p);
    var E = f / p,
      u = E / u,
      D = (q - d) / 2;
    1 < p && (D += d);
    p = -q * l + D;
    b.moveTo(Math.cos(p) * f + c, Math.sin(p) * f + e);
    for (l = 0; l < m; l++) p = q * (s ? m - l : l) + D, b.quadraticCurveTo(Math.cos(p - w) * u + c, Math.sin(p - w) * u + e, Math.cos(p - g) * E + c, Math.sin(p - g) * E + e), b.quadraticCurveTo(Math.cos(p - A) * u + c, Math.sin(p - A) * u + e, Math.cos(p) * f + c, Math.sin(p) * f + e);
    b.closePath()
  };
  g.radialBurst = function(b, c, e, f, m, p, s, l) {
    var q = a / p,
      g = 4 * s,
      A = q / 4 * g,
      g = q / 8 * g;
    s = -d / 2 + q * s / 2;
    for (var w = 0; w < p; w++) {
      var u = q * w + s,
        E = u - A,
        D = u - g,
        P = Math.cos(D) * f + c,
        D = Math.sin(D) * f + e,
        G = Math.cos(E) * m + c,
        E = Math.sin(E) * m + e,
        J = Math.cos(u) * m + c,
        u = Math.sin(u) * m + e;
      b.moveTo(P, D);
      l ? (b.lineTo(P, D), b.lineTo(J, u), b.lineTo(G, E)) : (b.lineTo(G, E), b.lineTo(J, u), b.lineTo(P, D))
    }
    b.closePath()
  };
  var u = g.spiral = function(b, c, e, f, m, p, s, l) {
      var q = -d / 2;
      p = p / m * a;
      for (var g = 0; g <= m; g++) {
        var A = s ? m - g : g,
          w = Math.pow(f, A / m),
          u = A * p + q,
          A = Math.cos(u) * w + c,
          w = Math.sin(u) * w + e;
        0 !== g || l ? b.lineTo(A, w) : b.moveTo(A, w)
      }
    };
  g.spirals = function(b, c, d, e, f, m, s, p) {
    for (var l = f; l--;) {
      b.save();
      b.translate(c, d);
      b.rotate(l * a / f);
      b.translate(-c, -d);
      var q = 100 * m;
      u(b, c, d, e * s, q, m, !! p);
      u(b, c, d, e, q, m, !p, !0);
      b.closePath();
      b.restore()
    }
  };
  g.supershape = function(b, c, d, e, f, m, s, p, l, q) {
    m = m || .001;
    s = s || -.001;
    p = p || .001;
    l = l || .001;
    for (var g = 0; g <= f; g++) {
      var w = (q ? f - g : g) * a / f,
        u = Math.pow(Math.abs(Math.cos(m * w / 4) / 1), p),
        E = Math.pow(Math.abs(Math.sin(m * w / 4) / 1), l),
        E = Math.pow(u + E, 1 / s);
      0 === E ? w = u = 0 : (u = 1 / E * Math.cos(w) * e, w = 1 / E * Math.sin(w) * e);
      0 === g ? b.moveTo(u + c, w + d) : b.lineTo(u + c, w + d)
    }
    b.closePath()
  };
  g.clearPath = function(a, b, c, d, e, f, m, p, l) {
    var q = a.globalCompositeOperation;
    a.beginPath();
    a.globalCompositeOperation = "destination-out";
    shape[b](a, b, c, d, e, f, m, p, l);
    a.fill();
    a.globalCompositeOperation = q;
    a.beginPath()
  };
  g.clipPath = function(a, b, c, d, e, f, m, p, l) {
    a.beginPath();
    shape[b](a, b, c, d, e, f, m, p, l);
    a.clip()
  };
  "undefined" !== typeof module && module.exports && (module.exports = g)
})(sketch);