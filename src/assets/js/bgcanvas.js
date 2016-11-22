"use strict"; (function(g, n) {
    var d = 6,
        x = typeof n === "string" ? document.querySelector(n) : n,
        l = document.createElement("canvas"),
        s = l.getContext("2d"),
        a = typeof Float32Array === "function" ? Float32Array: Array,
        u = [],
        r = [],
        b = Math.PI * 2,
        q,
        m,
        i,
        e,
        w = 0.088,
        y = 0.075,
        z = 100,
        k = 0.3,
        c = 0.4,
        f,
        h = 0;
    g.raf = g.requestAnimationFrame || g.webkitRequestAnimationFrame ||
        function(A) {
            return setTimeout(A, 1000 / 60)
        };
    x.appendChild(l);
    function j(B, D, C, A) {
        this.x = B;
        this.y = D;
        this.z = C;
        this.cx = B;
        this.cy = D;
        this.radius = A
    }
    j.prototype.move = function() {
        this.x = this.cx + this.cx * 0.5 * Math.cos(h * 0.08);
        this.y = this.cy + this.cy * 0.5 * Math.sin(h * 0.07)
    };
    function v(B, A, C) {
        this.a = B;
        this.b = A;
        this.c = C;
        this._depth = Math.max(B[2], A[2], C[2]);
        this.lightness = Math.random() * 10 + 30
    }
    v.prototype.getNormalAngle = function() {
        var I = this.a[5] - this.b[5],
            H = this.a[6] - this.b[6],
            G = this.a[2] - this.b[2],
            D = this.a[5] - this.c[5],
            B = this.a[6] - this.c[6],
            A = this.a[2] - this.c[2],
            F = H * A - G * B,
            E = A * D - I * D,
            C = I * B - H * D,
            J = Math.sqrt(F * F + E * E + C * C);
        return C / J
    };
    v.prototype.getColor = function(F, C) {
        var D = (this.a[0] + this.b[0] + this.c[0]) / 3 - C.x,
            B = (this.a[1] + this.b[1] + this.c[1]) / 3 - C.y,
            E = Math.sqrt(D * D + B * B),
            A = E > C.radius ? 0: 1 - E / C.radius;
        return "hsl(180,100%," + (this.lightness + 4 * A) + "%)"
    };
    v.prototype.getDepth = function() {
        return this._depth
    };
    v.prototype.draw = function(B, A) {
        var C = this.getNormalAngle();
        if (C < 0) {
            return
        }
        B.fillStyle = B.strokeStyle = this.getColor(C, A);
        B.beginPath();
        B.moveTo(this.a[5], this.a[6]);
        B.lineTo(this.b[5], this.b[6]);
        B.lineTo(this.c[5], this.c[6]);
        B.closePath();
        B.stroke();
        B.fill()
    };
    function t() {
        var B,
            C,
            H,
            I,
            G,
            E,
            J,
            F,
            D,
            A = x.getBoundingClientRect();
        l.width = q = G = A.width;
        l.height = m = E = A.height;
        G *= 1.5;
        E *= 1.5;
        if (G > E) {
            J = d;
            F = G / E * d | 0;
            D = m * 0.4
        } else {
            J = m / G * d + 0.5 | 0;
            F = d;
            D = q * 0.4
        }
        i = G / F;
        e = E / J;
        f = new j(q / 2, m / 2, 100, D);
        u.length = 0;
        F += 2;
        J += 2;
        B = J;
        while (B--) {
            C = F;
            while (C--) {
                H = new a(7);
                H[0] = i * (C - 1);
                H[1] = e * (B - 1);
                H[2] = Math.random() * z;
                H[3] = Math.random() * b;
                H[4] = Math.random() * 0.8 + 0.2;
                u[B * F + C] = H
            }
        }
        for (B = 1; B < J; B++) {
            for (C = 1; C < F; C++) {
                I = B * F + C;
                r.push(new v(u[I], u[I - 1], u[I - 1 - F]));
                r.push(new v(u[I], u[I - 1 - F], u[I - F]))
            }
        }
        r.sort(function(L, K) {
            return K.getDepth() - L.getDepth()
        });
        o()
    }
    function p() {
        var C = u.length,
            B,
            A,
            D;
        while (C--) {
            B = u[C];
            B[5] = B[0] + i * Math.cos(B[3] + h * B[4] * w) * k;
            B[6] = B[1] + e * Math.sin(B[3] + h * B[4] * y) * c
        }
        f.move()
    }
    function o() {
        var A = r.length;
        h += 0.1;
        p();
        while (A--) {
            r[A].draw(s, f)
        }
        raf(o)
    }
    t()
})
(window, "#stage");