(function(g) {
  g.registerToolkit("brush", function(f, d) {
    var a = this,
      e = d.canvas2d,
      g = d.contexts,
      l = f.detect,
      b = f.feature,
      c = f.net,
      p = d.render,
      w = d.scene,
      m = f.style,
      u = d.toolkit,
      t = f.util,
      h = f.vector,
      r = h.Cubic,
      k = h.Point;
    this.id = "brush";
    this.units = b.tools.brush.units;
    this.device = {};
    this.batches = {};
    this.position = {};
    this.intervals = {};
    this._attributes = {
      pathSimplify: "number",
      pathSmoothing: "number",
      content: "string",
      finger: "string",
      blur: "number",
      mode: "number",
      curved: "boolean",
      diameter: "number",
      distance: "number",
      increment: "number",
      innerRadius: "number",
      lineWidth: "number",
      outerRadius: "number",
      radius: "number",
      speed: "number",
      spacing: "object",
      spread: "number",
      src: "string",
      tolerance: "number",
      contiguous: "boolean",
      rotate: "object",
      scale: "object",
      translate: "object"
    };
    var v = t.clone(this._attributes);
    this.attributes = t.cloneInto(f.attrs.__styledObject, v);
    this.enabled = !1;
    this.enable = function() {
      var b = a.device.brush;
      b && b.enable && b.enable();
      if (!1 === a.enabled) {
        a.enabled = !0;
        a.ghostEnable();
        var c = a.active.canvas,
          d = b.useMinFingers || 1,
          e = b.useMaxFingers || t.INFINITY;
        a.onDrag = b && b.useMonitor ? eventjs.add(c, "drag", a.onRecord, {
          minFingers: d,
          maxFingers: e,
          monitor: !0
        }) : eventjs.add(c, "drag", a.onRecord, {
          minFingers: d,
          maxFingers: e
        });
        u.select && u.select.enable({
          mouse: !1
        })
      }
    };
    this.disable = function() {
      var b = a.device.brush;
      b && b.disable && b.disable();
      !0 === a.enabled && (a.dragging = !1, a.enabled = !1, a.ghostDisable(), a.onDrag.remove(), u.select && u.select.disable({
        mouse: !1
      }))
    };
    this.ghostEnabled = !1;
    this.ghostEnable = function() {
      if (!1 !== a.device.brush.useGhost && eventjs.isMouse && !1 === a.ghostEnabled) {
        a.ghostEnabled = !0;
        var b = a.active.canvas;
        a.onMouseOut = eventjs.add(b, "mouseout", a.onGhostExit);
        a.onMouseMove = eventjs.add(b, "mousemove", a.onGhost)
      }
    };
    this.ghostDisable = function() {
      !0 === a.ghostEnabled && (a.ghostEnabled = !1, a.onMouseOut.remove(), a.onMouseMove.remove())
    };
    this.loadResource = function(b) {
      var c = b.layer,
        e = b.onerror,
        h = b.onload,
        k = c.type;
      (b = f.module.toolkit["brush." + k]) ? new b(f, d, c, function(b, d) {
        if (d) e && e(c, "&ldquo;" + name + "&rdquo; " + b.type + " unavailable.");
        else {
          b.type = k;
          w.copyProperties(a, c, b);
          var f = a.batches[c.finger] || {};
          b.toolkit = a;
          b.toolkitId = "brush";
          b.layer = c;
          b.prepare = b.prepare || u.prepareBrush;
          b.seed = f.seed || b.seed || t.Random.seed();
          b.ctx = a.ctx;
          b.active = a.draw;
          b.cache = a.cache;
          m.load(b, function() {
            c.dirtyCheck = !0;
            c.render = s;
            c.brush = b;
            h && h(c)
          })
        }
      }) : e && e(c, k + " unavailable.")
    };
    this.changeDevice = function(b, c, d) {
      this.device = w.copyProperties(a, b);
      this.loadResource({
        layer: this.device,
        onerror: d,
        onload: c
      })
    };
    this.getDevice = function(a, b, c) {
      var e = a;
      "string" === typeof e && (e = t.clone(d.config[a]));
      this.loadResource({
        layer: e,
        onerror: c,
        onload: b
      });
      return e
    };
    this.getPadding = function(a, b) {
      var c = d.config[a.type],
        e = 0;
      c.diameter && a.diameter && (isFinite(a.diameter) ? e = a.diameter || 0 : isFinite(a.diameter.value) ? e = a.diameter.value : isFinite(a.diameter.min) && (e = a.diameter.max));
      if ("spirograph" === a.type) var f = a.distance || 0,
        e = e + 2 * (Math.abs((a.outerRadius || 0) - (a.innerRadius || 0)) + f);
      var f = c.scale && a.scale && a.scale.max || 1,
        h = c.translate && a.translate && a.translate.max || 0,
        h = 2 * Math.sqrt(h * h + h * h);
      return Math.ceil(((2 * (c.blur && a.blur || 0) + e + (c.lineWidth && a.lineWidth || 0)) * f + h) / 2)
    };
    this.updateObjectSize = function(b, c) {
      var f = b.bbox,
        k = f && f.scale.x || 1,
        m = a.getPadding(b, f);
      if ("floodfill" === b.type) var p = g.layer0,
        m = 0,
        l = {
          x1: 0,
          y1: 0,
          x2: p.width,
          y2: p.height
        };
      else l = isFinite(b.pathSmoothing) ? new h.BBox(h.catmullRomSpline({
        amount: b.pathSmoothing,
        path: b.data
      })) : new h.BBox(b.data);
      if (f) var r = f.units || "objectBoundingBox",
        s = (f.padding || 0) - m,
        p = f.x + s * k,
        t = f.y + s * k,
        s = 0;
      else r = a.units, s = m, p = l.x1, t = l.y1;
      var v = l.x2 - l.x1 + 2 * m,
        u = l.y2 - l.y1 + 2 * m,
        r = {
          x: p - s * k,
          y: t - s * k,
          width: v,
          height: u,
          padding: m,
          units: r,
          viewBox: [0, 0, v, u]
        };
      if (c && !f) {
        p = l.x1 + m * k - m;
        t = l.y1 + m * k - m;
        f = b.data;
        for (k = 0; k < f.length; k++) m = f[k], m.x -= p, m.y -= t, isFinite(m.x1 + m.y1) && (m.x1 -= p, m.y1 -= t), isFinite(m.x2 + m.y2) && (m.x2 -= p, m.y2 -= t);
        p = d.zoom * d.pixelRatio;
        r.x -= 1 * e.x / p;
        r.y -= 1 * e.y / p;
        return r
      }
      r.scale = f.scale;
      r.rotate = f.rotate;
      return b.bbox = r
    };
    this.onGhostExit = function(b) {
      if (b = a.device.brush) delete b.ghostX, delete b.ghostY
    };
    this.onGhost = function(b) {
      if ("eyeDropper" !== f.ui.colorPicker.state) {
        var c = a.device.brush;
        if (c) {
          var e = eventjs.getCoord(b),
            h = eventjs.getBBox(d.container),
            k = d.zoom;
          b = k * d.pixelRatio;
          var p = (e.x - h.x1 - h.scrollLeft) / k,
            e = (e.y - h.y1 - h.pageYOffset - d.scrollTop) / k;
          if (c.ghostDistance && isFinite(c.ghostX + c.ghostY)) {
            var k = c.ghostX - p,
              l = c.ghostY - e,
              g = Math.sqrt(k * k + l * l),
              h = c.ghostDistance;
            g > h && (k = Math.atan2(l, k), c.ghostX = p + Math.cos(k) * h, c.ghostY = e + Math.sin(k) * h, c.x = p, c.y = e)
          } else c.ghostY = e, c.ghostX = p, c.px = p, c.py = e, c.x = p, c.y = e;
          c.finger = c.finger || "0:A";
          c.interval = c.interval || 0;
          c.seed = c.seed || 1234567;
          c.isGhost = !0;
          c.isRecording = !0;
          c.path = [{
            cmd: "M",
            x: c.ghostX,
            y: c.ghostY
          }, {
            cmd: "L",
            x: c.x,
            y: c.y
          }];
          p = c.prepare();
          p.save();
          p.scale(b, b);
          c.render ? c.render() : (p.globalAlpha = c.opacity / 100, p.globalCompositeOperation = m.getComposite(c.composite, !c.isRecording), c.drawStart && c.drawStart(), c.draw && c.draw(null), c.drawEnd && c.drawEnd());
          p.restore()
        }
      }
    };
    this.onMultiRecord = function(b, c, d) {
      c.x -= 20;
      c.y -= 20;
      for (b = c.interval = 0; 2 > b; b++) {
        if (c.pointerStart) {
          var e = u.brush,
            f = w.copyAttributes(e.attributes, e.device.brush);
          f.type = a.type;
          e.deviceProxy[b] = f;
          a.loadResource({
            layer: f,
            onerror: function(a, b) {
              console.log(a, b)
            },
            onload: function(a) {
              console.log(a.brush)
            }
          })
        }
        c.x += 20;
        c.y += 20;
        c.interval += 20;
        c.identifier = b;
        c.isFromBrowser = !0;
        a.onRecord(null, c, d)
      }
    };
    this.onScroll = function(b) {
      if (d.__interacting) {
        var c = a.device.brush;
        c && (c.dirtyRender = !0, c.onScroll && c.onScroll(b))
      }
    };
    this.onRecord = function(e, p, l) {
      if ("eyeDropper" !== f.ui.colorPicker.state) {
        var r = u.getMouseId(e, p), s = e ? a.device : a.deviceProxy[r];
        
        if (s && s.brush) {
          a.deviceLastRecord = s;
          a.deviceLastRecordID = r;
          var v = s.type, s = s.brush;
          s.event = e;
          s.self = p;
          s.state = p.state;

          var x = a.batches[r] || (a.batches[r] = []),
            z = x.path || (x.path = []),
            J = z.length,
            N = eventjs.metaKey,
            K = eventjs.shiftKey,
            O = p.pointerStart,
            V = p.pointerMove,
            L = "move" === p.state,
            T = p.pointerEnd;
          d.__interacting = p.pointerDown && (O || L);
          var Q = p.isFromBrowser || !! e,
            U = Q && c.dataChannel && b.stream.realtime,
            da = d.scrollTop,
            aa = d.scrollLeft,
            R = d.zoom;
          if (O || V) {
            var ea = p.env,
              Z = aa + "x" + da;
            if (Z !== ea.scroll && (ea.scroll = Z, p.resetBoundingBox(), s.dirtyRender = !0, V)) return
          }
          var ga = da - da / R,
            W = aa - aa / R,
            ma = p.start.x / R + W,
            ua = p.start.y / R + ga,
            ea = p.x / R + W,
            Z = p.y / R + ga,
            ja = {
              x: ea,
              y: Z
            };
          if (!1 !== s.useSnap) if (O) s.useSnapShift = K, s.useSnapAngle = void 0;
          else if (s.useSnapShift) {
            var ta = .25 * Math.PI,
              Da = .5 * Math.PI,
              ua = {
                x: ma,
                y: ua
              },
              ma = k.angle(ua, ja);
            if (isFinite(s.useSnapAngle)) var va = s.useSnapAngle,
              ta = k.distance(ua, ja),
              ja = Math.abs(ma - va) >= Da ? -1 : 1,
              ja = k.atRadianDistance(ua, va, ta * ja);
            else if (3 < p.distanceMoved() / R) s.useSnapAngle = Math.round(ma / ta) * ta;
            else return
          }

          if (!(O && s.onPointerStart && s.onPointerStart(p, ja) || V && s.onPointerMove && s.onPointerMove(p, ja) || L && s.onPointerDrag && s.onPointerDrag(p, ja))) {
            if (T && s.onPointerEnd && s.onPointerEnd(p, ja)) return a.reset(r);
            if (T && J && s.onDoubleTap) {
              V = Date.now();
              Da = s.current;
              ma = z[J - 1];
              if (2 < J && Da && (ta = k.distance(Da, ma), 500 > V - s.timestamp && 25 > ta && s.onDoubleTap(p, ja))) return;
              s.timestamp = V;
              s.current = k.clone(ma)
            }



            if (!s.onPointer || !s.onPointer(p, x, ja)) 
              if (O /* O= pointer start */? (
                    e && eventjs.prevent(e), 
                    s.interval = x.interval = isFinite(p.interval) ? p.interval : a.interval || 0, 
                    s.seed = p.seed || s.seed, 
                    a.ghostDisable(), 
                    a.dragging = !0, 
                    m.load(s), 
                    1 === p.fingers && (
                      e = g.layer0.width, 
                      J = g.layer0.height, 
                      t.Canvas.blip(g.cache, e, J), 
                      t.Canvas.blip(g.active, e, J)
                    ), 
                    ja.cmd = "M", 
                    ja.beginPath = !0, 
                    ja.interval = x.interval, 
                    s.ghostDistance && (
                      eventjs.supports.touch && (s.ghostX = ea, s.ghostY = Z), Q && isFinite(s.ghostX + s.ghostY) && (ja.x = s.ghostX + aa / R + W, ja.y = s.ghostY + da / R + ga, delete s.ghostX, delete s.ghostY)
                    ),

                    U/* dataChannel */ && (
                      da = p.state + "," + ja.x + "," + ja.y + "," + r, 
                      aa = a.interval || 0, 
                      R = w.copyAttributes(a.attributes, s), 
                      R = w.clone(R, !0), 
                      c.dataChannel.send(["brush", v, da, N, K, R, aa])
                    ), 
                    !0 === s.click ? x.splice(0, 1, ja) : (x.push(ja), z.push(ja)), 
                    s.ghostDistance && (
                      ja = {}, 
                      ja.x = ea, 
                      ja.y = Z, 
                      ja.cmd = "L", 
                      x.push(ja), 
                      z.push(ja), 
                      U && (
                        da = "move," + ja.x + "," + ja.y + "," + r, 
                        c.dataChannel.send(["brush", v, da, N, K])
                      )
                    )
                  ) : (
                    e && eventjs.cancel(e), 
                    ja.cmd = L/* is state==='move' */ ? "L" : "Z", 
                    U /* dataChannel */ && (
                      da = p.state + "," + ja.x + "," + ja.y + "," + r, 
                      c.dataChannel.send(["brush", v, da, N, K])
                    ), 
                    s.lineRecord ? (
                      ja.cmd = "L", 
                      x.splice(1, 1, ja), 
                      z.splice(1, 1, ja), 
                      T /* poniter end */ && s.lineRecordRotate && (
                        r = x[0], 
                        N = x[1], 
                        ma = k.angle(r, N), 
                        r = k.atTimeOnLine(r, N, .5), 
                        N = new h.Transform, 
                        N.translate(r.x, r.y), 
                        N.rotate(-ma / 2), 
                        N.translate(-r.x, -r.y), 
                        N.flatten(x), 
                        N.flatten(z), 
                        x.__rotate = ma * t.RAD_DEG)
                      ) : s.click ? "Z" !== ja.cmd && x.splice(0, 1, ja) : (x.push(ja), z.push(ja))
                    ), 
                    s.dirtyRender = !0, 
                    s.isFromBrowser = Q, T/* point end */) 
                    {
                      1 === t.count(a.batches) && (a.dragging = !1);
                      Q && (a.gestures--, a.interval = s.interval || 0, 1 === p.fingers && a.ghostEnable());
                      p = Q || f.peer && f.peer.isStableStream();
                      if (Q || p || l) {
                        if (z.length) {
                          var X = a.createObject({
                            device: s,
                            layer: {
                              type: v,
                              toolkitId: "brush",
                              path: z,
                              bbox: {
                                rotate: x.__rotate || 0
                              }
                            }
                          });
                          a.renderToScene(X, function(b) {
                            a.reset(X.finger);
                            !1 === b && y();
                            a.addToHistory(X);
                            l && l(X)
                          })
                        }
                      } 
                    else y();
              Q && (s.seed = t.Random.seed())
            } else a.animate()
          }
        }
      }
    };
    a.renderToScene = function(c, d) {
      if (b.vector.edit) {
        var e = w.children,
          f = m.useSourceOver[c.composite];
        (e[e.length - 2] || {}).useStickToFront || !f ? p.sceneGCO("toolkit.brush", d) : (w.updateTransform(c), p.layer(a.ctx, c, d))
      } else e = g.layer0.ctx, e.globalAlpha = 1, e.globalCompositeOperation = "source-over", e.drawImage(g.draw, 0, 0), c.dirtyCheck = !1, d()
    };
    this.addToHistory = function(a) {
      d.history && a && d.history.store({
        cmd: "add",
        icon: a.type,
        name: a.type,
        data: [a]
      })
    };
    this.animate = function() {
      !1 === a.rendering && (a.rendering = !0, x())
    };
    this.createObject = function(b, c) {
      var d = b.layer,
        e = w.copyProperties(a, b.device);
      e.data = t.clone(d.path);
      e.bbox = t.cloneInto(d.bbox, a.updateObjectSize(e, !0));
      e.interval = e.data[0].interval;
      d = w.addObject(e);
      c && c(d);
      return d
    };
    this.reset = function(b) {
      var c = a.deviceLastRecord;
      (b = b || a.deviceLastRecordID) && c && (c = c.brush, delete a.batches[b], delete a.intervals[b], delete a.position[b + "x"], delete a.position[b + "y"], delete c.timestamp, delete c.current, delete c.event, delete c.self)
    };
    var x = function() {
        if (-1 === a.dragging) a.rendering = !1;
        else {
          !1 === a.dragging && (a.dragging = -1);
          var b = a.deviceLastRecord,
            e = b && b.brush;
          if (e) 

            if (e.dirtyRender || e.speed) {
            e.isGhost = !1;
            e.isRecording = !0;
            var f = d.zoom * d.pixelRatio,
              h = a.batches,
              k = e.prepare();
            k.save();
            k.scale(f, f);
            k.translate(-d.scrollLeft, -d.scrollTop);
            z(k, h);
            k.restore();
            e.postprocess && e.postprocess();
            a.rendering = !0;
            requestAnimationFrame(x);
            if (e.speed && e.isFromBrowser) 
              for (var m in a.intervals) 
                if (f = h[m]) 
                  if (k = a.intervals[m], !(0 < f.length)) {
                    b.brush.state = "move";
                    var p = {
                      cmd: "L",
                      x: k.x,
                      y: k.y
                    };
              c.dataChannel && c.dataChannel.send(["brush", e.type, "move," + k.x + "," + k.y + "," + m, eventjs.metaKey, eventjs.shiftKey]);
              f.push(p);
              f.path.push(p)
            }
          } else requestAnimationFrame(x);
          else requestAnimationFrame(x)
        }
      },
      s = function(b, c, d) {
        var e = this.brush;
        if (e) {
          this.dirtyCheck && w.copyAttributes(a.attributes, this, e);
          var f = e.interval || this.interval;
          e.ctx = b;
          e.active = a.draw;
          e.cache = a.cache;
          e.isGhost = !1;
          e.isRecording = !1;
          e.interval = f;
          e.bbox = this.bbox;
          e.state = e.state || "up";
          var h = {};
          h[this.finger] = this.data;
          h[this.finger].interval = f;
          if (!d) {
            d = this.bbox;
            var k = d.scale;
            c.matrix.x = 0 > k.x ? -d.width * k.x : 0;
            c.matrix.y = 0 > k.y ? -d.height * k.y : 0;
            c.matrix.y += d.padding * (k.y - (k.x - 1) - 1);
            c.apply(b, !0)
          }
          z(e.prepare(), h, e, this);
          e.interval = f;
          e.postprocess && e.postprocess()
        } else console.warn("brush missing:", e, this)
      },
      z = function(b, c, d, e) {
        var f = r.pointAtTime,/*d is options, e is device */
          k = a.position,
          p = a.intervals,
          g = a.deviceProxy,
          s, q, t;
        for (t in c) {
          e || (b = g[t] || a.device, d = b.brush);
          s = d.opacity / 100;
          q = d.type;
          var v = d.isEraser,
            u = "disco" === d.composite,
            x = d.isRecording,
            w = d.isGhost,
            z = m.getComposite(d.composite, !l.useSafeComposite[q] || !x),
            y = !! d.draw,
            da = isFinite(d.pathSmoothing),
            aa = isFinite(d.pathSimplify);
          d.dirtyRender = !1;
          var R = c[t], ea = R.length;
          if (0 !== ea && (R.interval = R.interval || 0, d.path = R.path || R, d.finger = t, b = d.renderTo || d.ctx)) {
            b.save();
            l.useLocalAlpha[q] && (b.globalAlpha = s);
            b.globalCompositeOperation = v && !x ? "source-over" : z;
            if (d.render) {
              /* h = g.module.vector */
              if (da || aa) 
                aa && (d.path = h.simplify(d.path, d.pathSimplify, !0)), 
                da && (d.path = h.catmullRomSpline({
                  amount: d.pathSmoothing,
                  path: d.path
                }));
              u = R[ea - 1];
              d.cmd = u && u.cmd;
              d.render(e || d);
              d.interval = R.interval
            } else for (v = 0; v < ea; v++) {
              var Z = x || w ? R.shift() : R[v],
                z = d.x = Z.x,
                aa = d.y = Z.y,
                ga = d.cmd = Z.cmd;
              if ("M" === ga) s = k[t + "x"] = z, q = k[t + "y"] = aa, R.increment = 0, d.px = s, d.py = q, x && ++a.gestures, d.drawStart && (d.interval = ++R.interval, d.drawStart());
              else {
                if ("Z" === ga) {
                  d.drawEnd && (d.interval = ++R.interval, d.drawEnd());
                  break
                }
                s = k[t + "x"];
                q = k[t + "y"];
                d.px = s;
                d.py = q
              }
              d.speed && (p[t] = Z);
              if (y) {
                var W = d.spacing,
                  ma = W.min,
                  ua = W.max,
                  ja = z - s,
                  ta = aa - q,
                  W = Math.sqrt(ja * ja + ta * ta) + 1;
                if (!(W < ma && "M" !== ga)) {
                  ga = ja / W || 0;
                  ma = ta / W || 0;
                  ta = ua || 1;
                  ua = ua < W - 1 ? ua : W - 1;
                  if (da = da && !x) {
                    var Da = R[v + 1],
                      va = Z,
                      X = {
                        x: s,
                        y: q
                      },
                      oa = R[v - 2];
                    if (!(Da && va && X && oa)) continue
                  }
                  Z = s;
                  for (ja = q; ua < W; ua += ta) da ? (aa = f(s, q, X.x + (va.x - oa.x) / 6, X.y + (va.y - oa.y) / 6, va.x + (X.x - Da.x) / 6, va.y + (X.y - Da.y) / 6, va.x, va.y, ua / W), z = aa.x, aa = aa.y) : (z = s + ga * ua, aa = q + ma * ua), u && (b.globalCompositeOperation = 0 === R.interval % 2 ? "lighter" : "source-over"), d.x = z, d.y = aa, d.px = Z, d.py = ja, d.interval = ++R.interval, d.draw(R.increment), Z = z, ja = aa;
                  k[t + "x"] = z;
                  k[t + "y"] = aa;
                  R.increment++
                }
              }
            }
            b.restore()
          }
        }
      },
      y = function() {
        t.isEmpty(a.batches) && t.Canvas.blip(a.draw.canvas)
      };
    return u.init(this)
  })
})(sketch);