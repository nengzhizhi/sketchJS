(function(g) {
    g.registerToolkit("brush.pencil", 
    function(f, d, a, e) {
        var g = d.toolkit,
        l = f.vector.Shape;
        this.prepare = g.prepareBrush;
        this.construct = function(a, c) {
            this.diameter = isFinite(a.diameter) ? a.diameter: 30;
            this.spacing = a.spacing || [0, 0];
            this.pathSmoothing = this.pathSimplify = .5;
            c(this)
        };
        this.render = function(a) {
            var c = this.path;
            a = this.renderTo;
            a.save();
            a.beginPath();
            a.lineCap = "round";
            a.lineJoin = "round";
            a.lineWidth = this.diameter;
            this.isRecording && (a.globalAlpha = this.opacity / 100);
            l.VOBPathOffset(a, c, 0, 0);
            c = g.getBBox(this);
            a.strokeStyle = f.style.getStyle("fill", a, c.x1, c.y1, c.x2, c.y2, this);
            a.stroke();
            this.useCache && g.drawFromCache(this);
            a.restore()
        };
        this.construct(a, e)
    })
})(sketch);