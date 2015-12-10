(function(g) {
  g.registerToolkit = function(f, d) {
    if ("object" === typeof f && f.length) for (; f.length;) g.registerToolkit(f.shift(), d);
    else {
      var a = g.module;
      a.toolkit = a.toolkit || {};
      a.toolkit[f] = d
    }
  };

  g.module = g.module || {};
  g.module.Toolkit = function(f, d) {
    var a = this,
      e = f.detect,
      q = f.feature,
      l = f.lang,
      b = f.util,
      c = f.util.string,
      p = f.style;
    a.area = {};
    a.init = function(a) {
      a.rendering = !1;
      a.device = {};
      a.deviceProxy = {};
      a.deviceLastRecord = null;
      a.deviceLastRecordID = null;
      a.gestures = 0;
      a.interval = 0;
      a.timeSent = null;
      return a
    };
    a.clone = function(a, b) {
      d.config.addClone(b, a);
      e.addClone(b, a);
      var c;
      e.brush[b] && (c = "brush.");
      e.shape[b] && (c = "shape.");
      c && f.registerToolkit(c + a, f.module.toolkit[c + b])
    };
    a.setTool = function(b) {
      void 0 === b && (b = d.tool.type);
      "string" === typeof b && (b = {
        type: b
      });
      var c = b.type,
        e = b.tid,
        m = b.onload;
      b = b.onerror;
      var p = a.getConfig(c);
      if (p) {
        var s = a.getToolkit(p.toolkit);
        s && (d.tool.reset && d.tool.reset(), d.tool.disable && d.tool.disable(), p = d.tool.type, s.type = c, s.typePrevious = p || c, d[e || "tool"] = s, g(c, function() {
          s.enable();
          q.ui.cursors && f.ui.setCursor();
          f.emit("setTool", c);
          m && m()
        }, b))
      }
    };
    var g = function(b, c, d) {
        if (b = a.getConfig(b)) {
          var e = a[b.toolkit];
          e.changeDevice ? e.changeDevice(b, c, d) : e.style ? (b.src && (e.style.src = b.src), e.style.type = b.type, e.loadResource({
            layer: e.style,
            onerror: d,
            onload: c
          })) : c && c()
        }
      };
    a.getMouseId = function(a, b) {
      var c = "",
        d = "";
      a && (c = f.net.peerIdx || 0, d = f.net.socketId || 0, c = (isFinite(c) ? c : d || 0) + ":");
      d = b.identifier;
      d = Infinity === d ? "A" : d;
      return c + ("Infinity" === d ? "A" : d)
    };
    a.setDefaultConfigure = function(b) {
      var c = a.getConfig(d.tool.type),
        e;
      for (e in b) {
        var f = b[e],
          m = c[e];
        void 0 !== m && ("number" === typeof f ? void 0 !== m.max ? (m.min = f, m.max = f) : m.value = f : (m.min = f.min, m.max = f.max))
      }
    };
    a.setConfigureValues = function(b, c) {
      for (var d in b) a.setConfigure(c, d, b[d])
    };
    a.setConfigure = function(b, c, d) {
      var e = b.type;
      if (-1 === e.indexOf("gl_") && (e = a.getToolkit(e), !e || !e.attributes || !e.attributes[c])) {
        q.debug && console.warn("setConfigure:", arguments);
        return
      }
      e = b[c];
      if (void 0 === e) {
        if ("string" === typeof b.toolkit) {
          q.debug && console.warn("setConfigure:", arguments);
          return
        }
        return b[c] = f.attrs.create(c, d)
      }
      if (e.setValue) e.setValue(d);
      else if (isFinite(e)) isFinite(d) ? b[c] = d : isFinite(d.value) && (b[c] = d.value);
      else if ("string" === typeof e)"string" === typeof d && (b[c] = d);
      else if (p && e instanceof p.Fill) {
        if (d instanceof p.Fill || p.validate(d)) b[c] = new p.Fill(d)
      } else if (p && e instanceof p.Stroke) {
        if (d instanceof p.Stroke || p.validate(d)) b[c] = new p.Stroke(d)
      } else if (isFinite(e.min + e.max)) if (Array.isArray(d)) {
        var l = isFinite(d[0]) ? d[0] : 0,
          s = isFinite(d[1]) ? d[1] : 0;
        1 === d.length ? e.min = e.max = m(e.format, l) : 2 === d.length && (e.min = m(e.format, l), e.max = m(e.format, s))
      } else e.min = m(e.format, d.min), e.max = m(e.format, d.max);
      else isFinite(e.value) ? Array.isArray(d) ? (d = isFinite(d[0]) ? d[0] : 0, e.value = m(e.format, d)) : isFinite(d.value) ? e.value = m(e.format, d.value) : isFinite(d) && (e.value = m(e.format, d)) : b[c] = f.attrs.update(c, d, e);
      return e
    };
    var m = function(a, b) {
        switch (a) {
        case "int":
          return Math.round(b);
        default:
          return b
        }
      },
      u = function(a, b, c) {
        a = glfx.filters[a];
        var e = d.render.glfx;
        if (e && e.activeFilter) {
          b = a.paramIndex[b];
          switch (a.param[b].format.replace(")", "").split("(")[0]) {
          case "int":
            c = Math.round(c)
          }
          e.activeFilter.data[b] !== c && (e.activeFilter.data[b] = c, glfx.animationId || glfx.render());
          f.histogram && f.histogram.enabled && f.histogram.createAnalyze();
          d.render.glfx.activeItem && (d.render.glfx.activeItem.dirtyCache = !0, d.render())
        }
      },
      t = function(a, b) {
        var c = {};
        c[a] = b;
        return c
      };
    d.setParam = d.setParams = a.setParam = a.setParams = function(c, f, k) {
      if ("string" === typeof c) c = {}, c.filter = d.tool.type, c.params = t(c, f), c.selection = k;
      else if ("object" === typeof c)"string" === typeof c.param ? c.params = t(c.param, c.value) : "object" !== typeof c.params && (c = {
        params: c
      });
      else return console.warn("invalid params");
      var m = d.scene;
      f = c.cacheObject || {};
      var p = c.moduleId || "";
      k = c.param;
      var s = c.params,
        l = c.selection || m && m.selection.items;
      c = c.filter || "*";
      var y = "*" !== c,
        B = !y || e.useLocalAlpha[c],
        A = 0 === p.indexOf("gl_") && p.substr(3),
        p = !f.state || "start" === f.state,
        C = !f.state || "end" === f.state;
      if (A) {
        var F = a.getConfig(c),
          E;
        for (E in s) u(A, E, s[E])
      } else {
        if (y) for (E in F = a.getConfig(c), s) F && a.setConfigure(F, E, s[E]);
        if (q.vector.edit) {
          var A = [],
            F = [],
            D = 0,
            P = 0;
          for (E in l) {
            var G = m.children[E];
            if (G) {
              if (C) var J = {
                id: G.id
              },
                N = {
                  id: G.id
                },
                K = !1;
              for (E in s) {
                var O = s[E],
                  V = "data" + G.id + E;
                p && (f[V] = b.clone(G[E]));
                a.setConfigure(G, E, O);
                G.toolkit && (G.dirtyCheck = !0, G.toolkit.updateObjectSize(G), P++);
                C && f[V] !== G[E] && (m.setDirtyPixelData(G), J[E] = f[V], N[E] = G[E], K = !0)
              }
              C && K && (A.push(J), F.push(N), D++)
            }
          }
          C && b.isEmpty(l) && (y && (E = a.getDeviceFromType(c)) && E.type && a.setConfigureValues(s, E), d.tool.type && g(d.tool.type));
          D && d.history && (E = k ? a.getParamProperName(k) : "Object", d.history.store({
            cmd: "update",
            icon: "infinity",
            name: "Update " + E,
            data: {
              from: A,
              to: F
            }
          }));
          P && (q.ui.bruteForce ? d.render.clean("toolkit.setParam.realtime") : (1 < P && (B = !0), clearTimeout(f.interval), f.interval = setTimeout(function() {
            (!B || B && C) && d.render.clean("toolkit.setParam.end")
          }, 75)))
        }
      }
    };
    (function() {
      var b = {
        visible: "visibility"
      };
      a.getParamProperName = function(a) {
        return c.ucwords(b[a] || a)
      }
    })();
    a.setType = function(c, r) {
      r = r || d.selection.items;
      if (!q.vector.edit) return f.exec(c);
      var k = b.count(r);
      if (0 === k) return d.setTool({
        type: c.replace(" ", "_"),
        onload: function() {
          f.ui.refresh(c)
        }
      });
      var m = [],
        p = [],
        s = a.getToolkit(c),
        t = d.scene,
        g = a.getConfig(c),
        g = t.copyAttributes(s.attributes, g, {}),
        B = function(a, b) {
          a.dirtyCheck = !0;
          s.updateObjectSize(a);
          --k || (d.history && d.history.store({
            cmd: "update",
            icon: c,
            name: l.translate("convert-format", l.translate(c)),
            data: {
              from: m,
              to: p
            }
          }), d.render.clean("toolkit.setType"), f.ui.refresh(c))
        },
        A;
      for (A in r) {
        var w = t.children[A];
        if (w) {
          if (e.shape[w.type]) {
            if (!e.shape[c]) {
              k--;
              continue
            }
          } else if (e.brush[w.type]) {
            if (!e.brush[c]) {
              k--;
              continue
            }
          } else {
            k--;
            continue
          }(s = w.toolkit) ? ("arrow" === c && (g.curved = w.data && 2 === w.data.length ? !1 : !0), m.push(t.copyAttributes(s.sattributes, w, {
            id: w.id,
            type: w.type
          })), p.push(t.copyAttributes(s._attributes, g, {
            id: w.id,
            type: w.type = c
          })), void 0 === g.spacing && delete w.spacing, g.fill ? (w.fill = w.fill || g.fill, delete g.fill) : delete w.fill, g.stroke ? (w.stroke = w.stroke || g.stroke, delete g.stroke) : delete w.stroke, t.copyAttributes(s.attributes, g, w), s.loadResource({
            layer: w,
            onerror: B,
            onload: B
          })) : k--
        } else k--
      }
    };
    a.setup = function() {
      var c = d.contexts,
        r = f.module,
        k = d.config,
        m = {},
        p;
      for (p in k) {
        var s = k[p].toolkit,
          l = !b.exists("sketch.module.toolkit." + s);
        r.toolkit[s + "." + p] ? e.add(s, p) : f.vector.Shape[p] ? e.add(s, p) : -1 === p.indexOf(".") && "media" === s && a.media && (0 === p.indexOf("gl_") ? window.glfx && e.add(s, p) : e.add(s, p));
        if (!l && !m[s]) {
          m[s] = !0;
          e.add(s, p);
          l = new r.toolkit[s](f, d);
          l.type = s;
          l.draw = c.draw.ctx;
          l.cache = c.cache.ctx;
          l.active = c.active.ctx;
          l.ctx = c.layer0.ctx;
          l.updateObjectSize = l.updateObjectSize ||
          function(a, b) {
            b && b(a)
          };
          if (e.useDefaultDim[s]) {
            var t = q.tools[s];
            l.units = t.units || l.units;
            l.minWidth = t.minWidth || l.minWidth;
            l.minHeight = t.minHeight || l.minHeight;
            l.maxWidth = t.maxWidth || l.maxWidth;
            l.maxHeight = t.maxHeight || l.maxHeight;
            l.defaultWidth = t.defaultWidth || l.defaultWidth;
            l.defaultHeight = t.defaultHeight || l.defaultHeight
          }
          a[s] = l
        }
      }
    };
    a.loadResource = function(b, c, d) {
      var e = b.toolkit || a.ensureToolkit(b);
      e && e.loadResource({
        layer: b,
        onerror: d,
        onload: c
      })
    };
    a.getConfig = function(a) {
      var b = d.config[a];
      if (b) return b;
      q.debug && console.warn("missing configure", a)
    };
    a.getToolkit = function(b) {
      if (b = a.getToolkitId(b)) return a[b]
    };
    a.getToolkitId = function(b) {
      if (e.shape[b]) return "shape";
      if (e.brush[b]) return "brush";
      if (e.media[b]) return "media";
      if (a[b]) return b;
      q.debug && console.warn("missing toolkit", b)
    };
    a.getFeature = function(b) {
      b = a.getToolkitId(b);
      return q.tools[b] || {}
    };
    a.ensureToolkit = function(b) {
      if (b.toolkit) return b.toolkit;
      var c = a.getToolkit(b.type);
      if (c) return b.toolkit = c
    };
    a.getDevice = function(a) {
      if (a && a.device) return a.device.brush ? a.device.brush : a.device
    };
    a.getDeviceFromType = function(b) {
      b = a.getToolkit(b);
      return a.getDevice(b)
    };
    a.exists = function(b) {
      return (b = d.config[b]) && a[b.toolkit]
    };
    a.applyStyle = function(b, c) {
      var d = a.getBBox(c),
        e = c.fill,
        f = c.stroke,
        s = c.shadow;
      f && f.enabled && f.lineWidth && (b.strokeStyle = p.getStyle("stroke", b, d.x1, d.y1, d.x2, d.y2, c), b.stroke());
      e && e.enabled && (b.fillStyle = p.getStyle("fill", b, d.x1, d.y1, d.x2, d.y2, c), b.fill());
      s && s.enabled && (b.shadowColor = s.color, b.shadowBlur = s.blur, b.shadowOffsetX = s.x, b.shadowOffsetY = s.y)
    };
    a.trackGradient = function(a, b, c) {
      if (!d.render.highRes && e.useTrackGradient[b.type]) {
        a.globalAlpha = 1;
        a.globalCompositeOperation = "source-atop";
        var f = c.x1,
          m = c.x2,
          s = c.y1;
        c = c.y2;
        var l = m - f,
          q = c - s;
        a.fillStyle = p.getStyle("fill", a, f, s, m, c, b);
        a.fillRect(f, s, l, q)
      }
    };
    a.getBBox = function(a) {
      var b = ((a.diameter || 0) + (a.lineWidth || 0) + (a.blur || 0)) / 2;
      if (a.bbox) {
        var c = a.bbox;
        a = -c.padding;
        var d = -c.padding;
        return {
          x1: a,
          y1: d,
          x2: a + c.width,
          y2: d + c.height
        }
      }
      if (a.lineRecord) {
        var e = a.path;
        if (e[0] && e[1]) {
          a = e[0].x;
          var d = e[0].y,
            c = e[1].x,
            e = e[1].y,
            f = Math.atan2(e - d, c - a),
            m = b * Math.cos(f),
            b = b * Math.sin(f);
          return {
            x1: a - m,
            y1: d - b,
            x2: c + m,
            y2: e + b
          }
        }
      } else {
        if (a.calcBBox) return a.calcBBox();
        if (a.isRecording) {
          e = a.path;
          d = e.length;
          if (2 >= d || a.isGhost) c = {
            x1: Infinity,
            y1: Infinity,
            x2: -Infinity,
            y2: -Infinity
          };
          else if (a._bbox) c = a._bbox;
          else {
            console.warn("bbox not found");
            return
          }
          d = e[d - 1];
          d.x < c.x1 + b && (c.x1 = d.x - b);
          d.y < c.y1 + b && (c.y1 = d.y - b);
          d.x > c.x2 - b && (c.x2 = d.x + b);
          d.y > c.y2 - b && (c.y2 = d.y + b);
          return a._bbox = c
        }
      }
    };
    a.drawFromCache = function(a, c) {
      var d = a.active;
      d.save();
      a.useBlendMode ? a.useReset || (d.globalAlpha = 1, d.globalCompositeOperation = "copy", d.drawImage(a.ctx.canvas, 0, 0)) : b.Canvas.blip(d.canvas);
      "up" !== a.state && (d.globalCompositeOperation = a.isEraser && a.isRecording ? "source-over" : p.getComposite(a.composite), a.useAutoClear && (c = 1), d.globalAlpha = c || a.opacity / 100, d.drawImage(a.cache.canvas, 0, 0));
      d.restore()
    };
    a.prepareBrush = function() {
      var a, c = d.contexts,
        f = this.type,
        m = this.isRecording || this.isGhost;
      this.isEraser = "destination-out" === this.composite || "eraser" === f;
      this.useAutoClear = e.useAutoClear[f] || this.isGhost;
      this.useBlendMode = !p.useSourceOver[this.composite];
      this.useGlobalAlpha = !e.useLocalAlpha[f];
      this.useTrackGradient = e.useTrackGradient[f] && "color" !== this.fill.type;
      this.useReset = this.isGhost || "down" === this.state;
      if (m) {
        this.useReset && (b.Canvas.clear(c.active), b.Canvas.clear((a = this.active).canvas));
        if (this.useTrackGradient) this.useReset && a.drawImage(c.layer0, 0, 0), this.useCache = !0, a = this.cache;
        else if (this.useBlendMode) {
          if (e.useSafeComposite[f]) return a = this.active, (this.isGhost || "down" === this.state) && d.render.prepareGCO(this.composite, a.canvas), this.renderTo = a;
          this.useReset && a.drawImage(c.layer0, 0, 0);
          this.useCache = !0;
          a = this.cache
        } else this.useCache = !1, a = this.active;
        this.useAutoClear && b.Canvas.blip(a.canvas)
      } else this.useCache = !1, a = this.ctx;
      return this.renderTo = a
    };
    a.getToolCategory = function(a) {
      if (a) {
        a = a.replace("_", " ");
        var c = f.ui.icons,
          d;
        for (d in c) {
          var e = c[d];
          if (e.children && (e.children.length && (e.children = b.arrayToObject(e.children)), e.children[a])) return d
        }
      }
    };
    a.getToolIcon = function(b) {
      b = a.getToolCategory(b) || b;
      var c = f.ui.icons,
        d;
      for (d in c) if (b === d) return b = c[d], b.src || b
    };
    b.eventOverrideCall = function(a, b) {
      var c = d.tool || {},
        e = c[a];
      return e ? !e(b) : (c = (e = c.device) && e.brush && e.brush[a]) ? !c(b) : !1
    };
    b.eventOverride = function(a, e) {
      if (a && d.keyboard) {
        -1 === a.indexOf("on") && (a = "on" + c.ucwords(a) + "Key");
        var f = e.keyCode,
          m = "keyup" === e.type,
          p = a.substr(2),
          s = d.keyboard.pressed;
        e.name = p[0].toLowerCase() + p.substr(1);
        e.state = m ? "up" : s[f] ? "press" : "down";
        s[f] = !m;
        if (b.eventOverrideCall(a, e)) return !0
      }
    }
  }
})(sketch);