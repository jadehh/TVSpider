/*
* @File     : pipixia.js.js
* @Author   : jade
* @Date     : 2024/2/2 14:56
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
(function (sttc) {
    'use strict';
    var aa = {};/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
    var p = this || self;

    function ba(a, b) {
        var c = ca("CLOSURE_FLAGS");
        a = c && c[a];
        return null != a ? a : b
    }

    function ca(a) {
        a = a.split(".");
        for (var b = p, c = 0; c < a.length; c++) if (b = b[a[c]], null == b) return null;
        return b
    }

    function da(a) {
        var b = typeof a;
        return "object" == b && null != a || "function" == b
    }

    function ea(a) {
        return Object.prototype.hasOwnProperty.call(a, fa) && a[fa] || (a[fa] = ++ha)
    }

    var fa = "closure_uid_" + (1E9 * Math.random() >>> 0), ha = 0;

    function ia(a, b, c) {
        return a.call.apply(a.bind, arguments)
    }

    function ka(a, b, c) {
        if (!a) throw Error();
        if (2 < arguments.length) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function () {
                var e = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(e, d);
                return a.apply(b, e)
            }
        }
        return function () {
            return a.apply(b, arguments)
        }
    }

    function la(a, b, c) {
        la = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ia : ka;
        return la.apply(null, arguments)
    }

    function ma(a, b) {
        var c = Array.prototype.slice.call(arguments, 1);
        return function () {
            var d = c.slice();
            d.push.apply(d, arguments);
            return a.apply(this, d)
        }
    }

    function na(a, b, c) {
        a = a.split(".");
        c = c || p;
        a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
        for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
    }

    function oa(a) {
        return a
    };let pa = (new Date).getTime();

    function qa(a) {
        return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
    }

    function ra(a, b) {
        let c = 0;
        a = qa(String(a)).split(".");
        b = qa(String(b)).split(".");
        const d = Math.max(a.length, b.length);
        for (let g = 0; 0 == c && g < d; g++) {
            var e = a[g] || "", f = b[g] || "";
            do {
                e = /(\d*)(\D*)(.*)/.exec(e) || ["", "", "", ""];
                f = /(\d*)(\D*)(.*)/.exec(f) || ["", "", "", ""];
                if (0 == e[0].length && 0 == f[0].length) break;
                c = sa(0 == e[1].length ? 0 : parseInt(e[1], 10), 0 == f[1].length ? 0 : parseInt(f[1], 10)) || sa(0 == e[2].length, 0 == f[2].length) || sa(e[2], f[2]);
                e = e[3];
                f = f[3]
            } while (0 == c)
        }
        return c
    }

    function sa(a, b) {
        return a < b ? -1 : a > b ? 1 : 0
    };var ta = ba(610401301, !1), va = ba(572417392, !0);

    function wa() {
        var a = p.navigator;
        return a && (a = a.userAgent) ? a : ""
    }

    var xa;
    const ya = p.navigator;
    xa = ya ? ya.userAgentData || null : null;

    function za(a) {
        return ta ? xa ? xa.brands.some(({brand: b}) => b && -1 != b.indexOf(a)) : !1 : !1
    }

    function q(a) {
        return -1 != wa().indexOf(a)
    };

    function Aa() {
        return ta ? !!xa && 0 < xa.brands.length : !1
    }

    function Ba() {
        return Aa() ? !1 : q("Trident") || q("MSIE")
    }

    function Ca() {
        return Aa() ? za("Microsoft Edge") : q("Edg/")
    }

    function Da() {
        !q("Safari") || Ea() || (Aa() ? 0 : q("Coast")) || (Aa() ? 0 : q("Opera")) || (Aa() ? 0 : q("Edge")) || Ca() || Aa() && za("Opera")
    }

    function Ea() {
        return Aa() ? za("Chromium") : (q("Chrome") || q("CriOS")) && !(Aa() ? 0 : q("Edge")) || q("Silk")
    }

    function Fa(a) {
        const b = {};
        a.forEach(c => {
            b[c[0]] = c[1]
        });
        return c => b[c.find(d => d in b)] || ""
    }

    function Ga() {
        var a = wa();
        if (Ba()) {
            var b = /rv: *([\d\.]*)/.exec(a);
            if (b && b[1]) a = b[1]; else {
                b = "";
                var c = /MSIE +([\d\.]+)/.exec(a);
                if (c && c[1]) if (a = /Trident\/(\d.\d)/.exec(a), "7.0" == c[1]) if (a && a[1]) switch (a[1]) {
                    case "4.0":
                        b = "8.0";
                        break;
                    case "5.0":
                        b = "9.0";
                        break;
                    case "6.0":
                        b = "10.0";
                        break;
                    case "7.0":
                        b = "11.0"
                } else b = "7.0"; else b = c[1];
                a = b
            }
            return a
        }
        c = RegExp("([A-Z][\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?", "g");
        b = [];
        let d;
        for (; d = c.exec(a);) b.push([d[1], d[2], d[3] || void 0]);
        a = Fa(b);
        return (Aa() ? 0 : q("Opera")) ? a(["Version", "Opera"]) : (Aa() ? 0 : q("Edge")) ? a(["Edge"]) : Ca() ? a(["Edg"]) : q("Silk") ? a(["Silk"]) : Ea() ? a(["Chrome", "CriOS", "HeadlessChrome"]) : (a = b[2]) && a[1] || ""
    };

    function Ha(a, b) {
        if ("string" === typeof a) return "string" !== typeof b || 1 != b.length ? -1 : a.indexOf(b, 0);
        for (let c = 0; c < a.length; c++) if (c in a && a[c] === b) return c;
        return -1
    }

    function Ia(a, b) {
        const c = a.length, d = "string" === typeof a ? a.split("") : a;
        for (let e = 0; e < c; e++) e in d && b.call(void 0, d[e], e, a)
    }

    function Ja(a, b) {
        const c = a.length, d = [];
        let e = 0;
        const f = "string" === typeof a ? a.split("") : a;
        for (let g = 0; g < c; g++) if (g in f) {
            const h = f[g];
            b.call(void 0, h, g, a) && (d[e++] = h)
        }
        return d
    }

    function Ka(a, b) {
        const c = a.length, d = Array(c), e = "string" === typeof a ? a.split("") : a;
        for (let f = 0; f < c; f++) f in e && (d[f] = b.call(void 0, e[f], f, a));
        return d
    }

    function La(a, b) {
        const c = a.length, d = "string" === typeof a ? a.split("") : a;
        for (let e = 0; e < c; e++) if (e in d && b.call(void 0, d[e], e, a)) return !0;
        return !1
    }

    function Ma(a, b) {
        a:{
            var c = a.length;
            const d = "string" === typeof a ? a.split("") : a;
            for (--c; 0 <= c; c--) if (c in d && b.call(void 0, d[c], c, a)) {
                b = c;
                break a
            }
            b = -1
        }
        return 0 > b ? null : "string" === typeof a ? a.charAt(b) : a[b]
    }

    function Na(a, b) {
        return 0 <= Ha(a, b)
    }

    function Oa(a) {
        const b = a.length;
        if (0 < b) {
            const c = Array(b);
            for (let d = 0; d < b; d++) c[d] = a[d];
            return c
        }
        return []
    };

    function Pa(a) {
        Pa[" "](a);
        return a
    }

    Pa[" "] = function () {
    };
    var Qa = Ba();
    !q("Android") || Ea();
    Ea();
    Da();
    var Ra = null;

    function Sa(a) {
        var b = [];
        Ua(a, function (c) {
            b.push(c)
        });
        return b
    }

    function Ua(a, b) {
        function c(k) {
            for (; d < a.length;) {
                var m = a.charAt(d++), l = Ra[m];
                if (null != l) return l;
                if (!/^[\s\xa0]*$/.test(m)) throw Error("Unknown base64 encoding at char: " + m);
            }
            return k
        }

        Va();
        for (var d = 0; ;) {
            var e = c(-1), f = c(0), g = c(64), h = c(64);
            if (64 === h && -1 === e) break;
            b(e << 2 | f >> 4);
            64 != g && (b(f << 4 & 240 | g >> 2), 64 != h && b(g << 6 & 192 | h))
        }
    }

    function Va() {
        if (!Ra) {
            Ra = {};
            for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), b = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; 5 > c; c++) for (var d = a.concat(b[c].split("")), e = 0; e < d.length; e++) {
                var f = d[e];
                void 0 === Ra[f] && (Ra[f] = e)
            }
        }
    };var Wa = "undefined" != typeof structuredClone;
    var Xa = !va;
    let Ya = !va;
    let Za = 0, $a = 0;

    function ab(a) {
        var b = 0 > a;
        a = Math.abs(a);
        var c = a >>> 0;
        a = Math.floor((a - c) / 4294967296);
        if (b) {
            b = c;
            c = ~a;
            b ? b = ~b + 1 : c += 1;
            const [d, e] = [b, c];
            a = e;
            c = d
        }
        Za = c >>> 0;
        $a = a >>> 0
    }

    function bb() {
        var a = Za, b = $a;
        if (b & 2147483648) var c = "" + (BigInt(b | 0) << BigInt(32) | BigInt(a >>> 0)); else b >>>= 0, a >>>= 0, 2097151 >= b ? c = "" + (4294967296 * b + a) : c = "" + (BigInt(b) << BigInt(32) | BigInt(a));
        return c
    };

    function cb(a) {
        return Array.prototype.slice.call(a)
    };var r = Symbol(), db = Symbol();

    function eb(a) {
        const b = a[r] | 0;
        1 !== (b & 1) && (Object.isFrozen(a) && (a = cb(a)), u(a, b | 1))
    }

    function x(a, b, c) {
        return c ? a | b : a & ~b
    }

    var u = (a, b) => {
        a[r] = b;
        return a
    };

    function fb() {
        var a = [];
        a[r] |= 1;
        return a
    }

    function gb(a) {
        a[r] |= 32;
        return a
    }

    function hb(a, b) {
        u(b, (a | 0) & -14591)
    }

    function ib(a, b) {
        u(b, (a | 34) & -14557)
    }

    function jb(a) {
        a = a >> 14 & 1023;
        return 0 === a ? 536870912 : a
    };var kb = {}, lb = {};

    function mb(a) {
        return !(!a || "object" !== typeof a || a.g !== lb)
    }

    function nb(a) {
        return null !== a && "object" === typeof a && !Array.isArray(a) && a.constructor === Object
    }

    let ob, pb = !va;

    function qb(a, b, c) {
        if (!Array.isArray(a) || a.length) return !1;
        const d = a[r] | 0;
        if (d & 1) return !0;
        if (!(b && (Array.isArray(b) ? b.includes(c) : b.has(c)))) return !1;
        u(a, d | 1);
        return !0
    }

    var rb;
    const sb = [];
    u(sb, 55);
    rb = Object.freeze(sb);

    function tb(a) {
        if (a & 2) throw Error();
    }

    class ub {
    }

    class vb {
    }

    Object.freeze(new ub);
    Object.freeze(new vb);
    let wb;

    function xb(a) {
        if (wb) throw Error("");
        wb = a
    }

    function yb(a) {
        a = Error(a);
        a.__closure__error__context__984382 || (a.__closure__error__context__984382 = {});
        a.__closure__error__context__984382.severity = "warning";
        if (wb) try {
            wb(a)
        } catch (b) {
            throw b.cause = a, b;
        }
        return a
    };

    function zb(a) {
        if (null != a && "boolean" !== typeof a) {
            var b = typeof a;
            throw Error(`Expected boolean but got ${"object" != b ? b : a ? Array.isArray(a) ? "array" : b : "null"}: ${a}`);
        }
        return a
    }

    const Ab = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;

    function Bb(a) {
        const b = typeof a;
        return "number" === b ? Number.isFinite(a) : "string" !== b ? !1 : Ab.test(a)
    }

    function Cb(a) {
        if (null != a) {
            if (!Number.isFinite(a)) throw yb("enum");
            a |= 0
        }
        return a
    }

    function Db(a) {
        return null == a ? a : Number.isFinite(a) ? a | 0 : void 0
    }

    function Eb(a) {
        if ("number" !== typeof a) throw yb("int32");
        if (!Number.isFinite(a)) throw yb("int32");
        return a | 0
    }

    function Fb(a) {
        return null == a ? a : Eb(a)
    }

    function Gb(a) {
        if (null == a) return a;
        if ("string" === typeof a) {
            if (!a) return;
            a = +a
        }
        if ("number" === typeof a) return Number.isFinite(a) ? a | 0 : void 0
    }

    function Hb(a) {
        if (null == a) return a;
        if ("string" === typeof a) {
            if (!a) return;
            a = +a
        }
        if ("number" === typeof a) return Number.isFinite(a) ? a >>> 0 : void 0
    }

    function Ib(a) {
        return "-" === a[0] ? 20 > a.length ? !0 : 20 === a.length && -922337 < Number(a.substring(0, 7)) : 19 > a.length ? !0 : 19 === a.length && 922337 > Number(a.substring(0, 6))
    }

    function Jb(a) {
        a = Math.trunc(a);
        if (!Number.isSafeInteger(a)) {
            ab(a);
            var b = Za, c = $a;
            if (a = c & 2147483648) b = ~b + 1 >>> 0, c = ~c >>> 0, 0 == b && (c = c + 1 >>> 0);
            b = 4294967296 * c + (b >>> 0);
            a = a ? -b : b
        }
        return a
    }

    function Kb(a) {
        var b = Math.trunc(Number(a));
        if (Number.isSafeInteger(b)) return String(b);
        b = a.indexOf(".");
        -1 !== b && (a = a.substring(0, b));
        Ib(a) || (16 > a.length ? ab(Number(a)) : (a = BigInt(a), Za = Number(a & BigInt(4294967295)) >>> 0, $a = Number(a >> BigInt(32) & BigInt(4294967295))), a = bb());
        return a
    }

    function Lb(a) {
        if ("string" !== typeof a) throw Error();
        return a
    }

    function Mb(a) {
        if (null != a && "string" !== typeof a) throw Error();
        return a
    }

    function Nb(a) {
        return null == a || "string" === typeof a ? a : void 0
    }

    function Ob(a, b, c, d) {
        if (null != a && "object" === typeof a && a.ma === kb) return a;
        if (!Array.isArray(a)) return c ? d & 2 ? (a = b[db]) ? b = a : (a = new b, d = a.A, d[r] |= 34, b = b[db] = a) : b = new b : b = void 0, b;
        let e = c = a[r] | 0;
        0 === e && (e |= d & 32);
        e |= d & 2;
        e !== c && u(a, e);
        return new b(a)
    };let Pb;

    function Qb(a, b) {
        Pb = b;
        a = new a(b);
        Pb = void 0;
        return a
    };

    function Rb(a, b) {
        return Sb(b)
    }

    function Sb(a) {
        switch (typeof a) {
            case "number":
                return isFinite(a) ? a : String(a);
            case "boolean":
                return a ? 1 : 0;
            case "object":
                if (a) {
                    if (Array.isArray(a)) return pb || !qb(a, void 0, 9999) ? a : void 0;
                    if (null != a && a instanceof Uint8Array) {
                        let b = "", c = 0;
                        const d = a.length - 10240;
                        for (; c < d;) b += String.fromCharCode.apply(null, a.subarray(c, c += 10240));
                        b += String.fromCharCode.apply(null, c ? a.subarray(c) : a);
                        return btoa(b)
                    }
                }
        }
        return a
    };

    function Tb(a, b, c) {
        a = cb(a);
        var d = a.length;
        const e = b & 256 ? a[d - 1] : void 0;
        d += e ? -1 : 0;
        for (b = b & 512 ? 1 : 0; b < d; b++) a[b] = c(a[b]);
        if (e) {
            b = a[b] = {};
            for (const f in e) Object.prototype.hasOwnProperty.call(e, f) && (b[f] = c(e[f]))
        }
        return a
    }

    function Ub(a, b, c, d, e, f) {
        if (null != a) {
            if (Array.isArray(a)) a = e && 0 == a.length && (a[r] | 0) & 1 ? void 0 : f && (a[r] | 0) & 2 ? a : Vb(a, b, c, void 0 !== d, e, f); else if (nb(a)) {
                const g = {};
                for (let h in a) Object.prototype.hasOwnProperty.call(a, h) && (g[h] = Ub(a[h], b, c, d, e, f));
                a = g
            } else a = b(a, d);
            return a
        }
    }

    function Vb(a, b, c, d, e, f) {
        const g = d || c ? a[r] | 0 : 0;
        d = d ? !!(g & 32) : void 0;
        a = cb(a);
        for (let h = 0; h < a.length; h++) a[h] = Ub(a[h], b, c, d, e, f);
        c && c(g, a);
        return a
    }

    function Wb(a) {
        return a.ma === kb ? Xb(a, Vb(a.A, Wb, void 0, void 0, !1, !1), !0) : null != a && a instanceof Uint8Array ? new Uint8Array(a) : a
    }

    function Yb(a) {
        return a.ma === kb ? a.toJSON() : Sb(a)
    }

    var Zb = Wa ? structuredClone : a => Vb(a, Wb, void 0, void 0, !1, !1);

    function $b(a, b, c = ib) {
        if (null != a) {
            if (a instanceof Uint8Array) return b ? a : new Uint8Array(a);
            if (Array.isArray(a)) {
                var d = a[r] | 0;
                if (d & 2) return a;
                b && (b = 0 === d || !!(d & 32) && !(d & 64 || !(d & 16)));
                return b ? u(a, (d | 34) & -12293) : Vb(a, $b, d & 4 ? ib : c, !0, !1, !0)
            }
            a.ma === kb && (c = a.A, d = c[r], a = d & 2 ? a : Qb(a.constructor, ac(c, d, !0)));
            return a
        }
    }

    function ac(a, b, c) {
        const d = c || b & 2 ? ib : hb, e = !!(b & 32);
        a = Tb(a, b, f => $b(f, e, d));
        a[r] = a[r] | 32 | (c ? 2 : 0);
        return a
    }

    function bc(a) {
        const b = a.A, c = b[r];
        return c & 2 ? Qb(a.constructor, ac(b, c, !1)) : a
    };

    function cc(a, b) {
        a = a.A;
        return dc(a, a[r], b)
    }

    function dc(a, b, c, d) {
        if (-1 === c) return null;
        if (c >= jb(b)) {
            if (b & 256) return a[a.length - 1][c]
        } else {
            var e = a.length;
            if (d && b & 256 && (d = a[e - 1][c], null != d)) return d;
            b = c + (+!!(b & 512) - 1);
            if (b < e) return a[b]
        }
    }

    function y(a, b, c) {
        const d = a.A;
        let e = d[r];
        tb(e);
        C(d, e, b, c);
        return a
    }

    function C(a, b, c, d, e) {
        const f = jb(b);
        if (c >= f || e) {
            let g = b;
            if (b & 256) e = a[a.length - 1]; else {
                if (null == d) return g;
                e = a[f + (+!!(b & 512) - 1)] = {};
                g |= 256
            }
            e[c] = d;
            c < f && (a[c + (+!!(b & 512) - 1)] = void 0);
            g !== b && u(a, g);
            return g
        }
        a[c + (+!!(b & 512) - 1)] = d;
        b & 256 && (a = a[a.length - 1], c in a && delete a[c]);
        return b
    }

    function ec(a, b, c) {
        return void 0 !== fc(a, b, c, !1)
    }

    function gc(a, b) {
        a = cc(a, b);
        return null == a || "boolean" === typeof a ? a : "number" === typeof a ? !!a : void 0
    }

    function hc(a, b, c) {
        a = a.A;
        let d = a[r];
        const e = 2 & d ? 1 : 2;
        let f = ic(a, d, b);
        var g = f[r] | 0;
        if (!(4 & g)) {
            if (4 & g || Object.isFrozen(f)) f = cb(f), g = jc(g, d, !1), d = C(a, d, b, f);
            var h = 0;
            let k = 0;
            for (; h < f.length; h++) {
                const m = c(f[h]);
                null != m && (f[k++] = m)
            }
            k < h && (f.length = k);
            g = kc(g, d);
            g = x(g, 20, !0);
            g = x(g, 4096, !1);
            g = x(g, 8192, !1);
            u(f, g);
            2 & g && Object.freeze(f)
        }
        lc(g) || (c = g, (h = 1 === e) ? g = x(g, 2, !0) : g = x(g, 32, !1), g !== c && u(f, g), h && Object.freeze(f));
        2 === e && lc(g) && (f = cb(f), g = jc(g, d, !1), u(f, g), C(a, d, b, f));
        return f
    }

    function ic(a, b, c) {
        a = dc(a, b, c);
        return Array.isArray(a) ? a : rb
    }

    function kc(a, b) {
        var c = !1;
        0 === a && (a = jc(a, b, c));
        return a = x(a, 1, !0)
    }

    function lc(a) {
        return !!(2 & a) && !!(4 & a) || !!(2048 & a)
    }

    function mc(a, b, c, d) {
        const e = a.A;
        let f = e[r];
        tb(f);
        if (null == c) return C(e, f, b), a;
        let g = c[r] | 0, h = g;
        var k = !!(2 & g) || Object.isFrozen(c);
        const m = !k && !1;
        if (!(4 & g)) for (g = 21, k && (c = cb(c), h = 0, g = jc(g, f, !0)), k = 0; k < c.length; k++) c[k] = d(c[k]);
        m && (c = cb(c), h = 0, g = jc(g, f, !0));
        g !== h && u(c, g);
        C(e, f, b, c);
        return a
    }

    function D(a, b, c, d) {
        const e = a.A;
        let f = e[r];
        tb(f);
        C(e, f, b, ("0" === d ? 0 === Number(c) : c === d) ? void 0 : c);
        return a
    }

    function nc(a, b, c, d) {
        const e = a.A;
        let f = e[r];
        tb(f);
        (c = oc(e, f, c)) && c !== b && null != d && (f = C(e, f, c));
        C(e, f, b, d);
        return a
    }

    function pc(a, b, c) {
        a = a.A;
        return oc(a, a[r], b) === c ? c : -1
    }

    function qc(a, b) {
        a = a.A;
        return oc(a, a[r], b)
    }

    function oc(a, b, c) {
        let d = 0;
        for (let e = 0; e < c.length; e++) {
            const f = c[e];
            null != dc(a, b, f) && (0 !== d && (b = C(a, b, d)), d = f)
        }
        return d
    }

    function rc(a) {
        var b = sc;
        a = a.A;
        let c = a[r];
        tb(c);
        const d = dc(a, c, 3);
        b = bc(Ob(d, b, !0, c));
        d !== b && C(a, c, 3, b);
        return b
    }

    function fc(a, b, c, d) {
        a = a.A;
        let e = a[r];
        const f = dc(a, e, c, d);
        b = Ob(f, b, !1, e);
        b !== f && null != b && C(a, e, c, b, d);
        return b
    }

    function E(a, b, c) {
        b = fc(a, b, c, !1);
        if (null == b) return b;
        a = a.A;
        let d = a[r];
        if (!(d & 2)) {
            const e = bc(b);
            e !== b && (b = e, C(a, d, c, b, !1))
        }
        return b
    }

    function F(a, b, c) {
        a = a.A;
        var d = a[r], e = d, f = !(2 & d), g = !!(2 & e), h = g ? 1 : 2;
        d = 1 === h;
        h = 2 === h;
        f && (f = !g);
        g = ic(a, e, c);
        var k = g[r] | 0;
        const m = !!(4 & k);
        if (!m) {
            k = kc(k, e);
            var l = g, n = e;
            const v = !!(2 & k);
            v && (n = x(n, 2, !0));
            let t = !v, w = !0, z = 0, A = 0;
            for (; z < l.length; z++) {
                const B = Ob(l[z], b, !1, n);
                if (B instanceof b) {
                    if (!v) {
                        const K = !!((B.A[r] | 0) & 2);
                        t && (t = !K);
                        w && (w = K)
                    }
                    l[A++] = B
                }
            }
            A < z && (l.length = A);
            k = x(k, 4, !0);
            k = x(k, 16, w);
            k = x(k, 8, t);
            u(l, k);
            v && Object.freeze(l)
        }
        b = !!(8 & k) || d && !g.length;
        if (f && !b) {
            lc(k) && (g = cb(g), k = jc(k, e, !1), e = C(a, e, c, g));
            b = g;
            f = k;
            for (l = 0; l < b.length; l++) k = b[l], n = bc(k), k !== n && (b[l] = n);
            f = x(f, 8, !0);
            f = x(f, 16, !b.length);
            u(b, f);
            k = f
        }
        lc(k) || (b = k, d ? k = x(k, !g.length || 16 & k && (!m || 32 & k) ? 2 : 2048, !0) : k = x(k, 32, !1), k !== b && u(g, k), d && Object.freeze(g));
        h && lc(k) && (g = cb(g), k = jc(k, e, !1), u(g, k), C(a, e, c, g));
        return g
    }

    function tc(a, b, c) {
        null == c && (c = void 0);
        return y(a, b, c)
    }

    function uc(a, b, c, d) {
        null == d && (d = void 0);
        return nc(a, b, c, d)
    }

    function vc(a, b, c) {
        const d = a.A;
        let e = d[r];
        tb(e);
        if (null == c) return C(d, e, b), a;
        let f = c[r] | 0, g = f;
        const h = !!(2 & f) || !!(2048 & f), k = h || Object.isFrozen(c);
        let m = !0, l = !0;
        for (let v = 0; v < c.length; v++) {
            var n = c[v];
            h || (n = !!((n.A[r] | 0) & 2), m && (m = !n), l && (l = n))
        }
        h || (f = x(f, 5, !0), f = x(f, 8, m), f = x(f, 16, l));
        k && f !== g && (c = cb(c), g = 0, f = jc(f, e, !0));
        f !== g && u(c, f);
        C(d, e, b, c);
        return a
    }

    function jc(a, b, c) {
        a = x(a, 2, !!(2 & b));
        a = x(a, 32, !!(32 & b) && c);
        return a = x(a, 2048, !1)
    }

    function G(a, b) {
        return Gb(cc(a, b))
    }

    function wc(a, b) {
        a = cc(a, b);
        var c;
        null == a ? c = a : Bb(a) ? "number" === typeof a ? c = Jb(a) : c = Kb(a) : c = void 0;
        return c
    }

    function H(a, b) {
        return Nb(cc(a, b))
    }

    function I(a, b) {
        return Db(cc(a, b))
    }

    function xc(a) {
        return a ?? 0
    }

    function J(a, b, c = !1) {
        return gc(a, b) ?? c
    }

    function yc(a, b) {
        return xc(wc(a, b))
    }

    function zc(a, b) {
        a = a.A;
        let c = a[r];
        const d = dc(a, c, b);
        var e = null == d || "number" === typeof d ? d : "NaN" === d || "Infinity" === d || "-Infinity" === d ? Number(d) : void 0;
        null != e && e !== d && C(a, c, b, e);
        return e ?? 0
    }

    function L(a, b) {
        return H(a, b) ?? ""
    }

    function M(a, b) {
        return xc(I(a, b))
    }

    function Ac(a, b, c, d) {
        return E(a, b, pc(a, d, c))
    }

    function Bc(a, b, c) {
        if (null != c) {
            var d = !!d;
            if (!Bb(c)) throw yb("int64");
            "string" === typeof c ? c = Kb(c) : d ? (c = Math.trunc(c), Number.isSafeInteger(c) ? c = String(c) : (d = String(c), Ib(d) ? c = d : (ab(c), c = bb()))) : c = Jb(c)
        }
        return D(a, b, c, "0")
    }

    function Dc(a, b) {
        var c = performance.now();
        if (null != c && "number" !== typeof c) throw Error(`Value of float/double field must be a number, found ${typeof c}: ${c}`);
        D(a, b, c, 0)
    }

    function Ec(a, b, c) {
        return D(a, b, Mb(c), "")
    };var N = class {
        constructor(a) {
            a:{
                null == a && (a = Pb);
                Pb = void 0;
                if (null == a) {
                    var b = 96;
                    a = []
                } else {
                    if (!Array.isArray(a)) throw Error();
                    b = a[r] | 0;
                    if (b & 64) break a;
                    var c = a;
                    b |= 64;
                    var d = c.length;
                    if (d && (--d, nb(c[d]))) {
                        b |= 256;
                        c = d - (+!!(b & 512) - 1);
                        if (1024 <= c) throw Error();
                        b = b & -16760833 | (c & 1023) << 14
                    }
                }
                u(a, b)
            }
            this.A = a
        }

        toJSON() {
            if (ob) var a = Xb(this, this.A, !1); else a = Vb(this.A, Yb, void 0, void 0, !1, !1), a = Xb(this, a, !0);
            return a
        }
    };
    N.prototype.ma = kb;

    function Xb(a, b, c) {
        const d = a.constructor.u;
        var e = (c ? a.A : b)[r], f = jb(e), g = !1;
        if (d && pb) {
            if (!c) {
                b = cb(b);
                var h;
                if (b.length && nb(h = b[b.length - 1])) for (g = 0; g < d.length; g++) if (d[g] >= f) {
                    Object.assign(b[b.length - 1] = {}, h);
                    break
                }
                g = !0
            }
            f = b;
            c = !c;
            h = a.A[r];
            a = jb(h);
            h = +!!(h & 512) - 1;
            var k;
            for (let B = 0; B < d.length; B++) {
                var m = d[B];
                if (m < a) {
                    m += h;
                    var l = f[m];
                    null == l ? f[m] = c ? rb : fb() : c && l !== rb && eb(l)
                } else {
                    if (!k) {
                        var n = void 0;
                        f.length && nb(n = f[f.length - 1]) ? k = n : f.push(k = {})
                    }
                    l = k[m];
                    null == k[m] ? k[m] = c ? rb : fb() : c && l !== rb && eb(l)
                }
            }
        }
        k = b.length;
        if (!k) return b;
        let v, t;
        if (nb(n = b[k - 1])) {
            a:{
                var w = n;
                f = {};
                c = !1;
                for (var z in w) if (Object.prototype.hasOwnProperty.call(w, z)) {
                    a = w[z];
                    if (Array.isArray(a)) {
                        h = a;
                        if (!Ya && qb(a, d, +z) || !Xa && mb(a) && 0 === a.size) a = null;
                        a != h && (c = !0)
                    }
                    null != a ? f[z] = a : c = !0
                }
                if (c) {
                    for (let B in f) {
                        w = f;
                        break a
                    }
                    w = null
                }
            }
            w != n && (v = !0);
            k--
        }
        for (e = +!!(e & 512) - 1; 0 < k; k--) {
            z = k - 1;
            n = b[z];
            if (!(null == n || !Ya && qb(n, d, z - e) || !Xa && mb(n) && 0 === n.size)) break;
            t = !0
        }
        if (!v && !t) return b;
        var A;
        g ? A = b : A = Array.prototype.slice.call(b, 0, k);
        b = A;
        g && (b.length = k);
        w && b.push(w);
        return b
    }

    function Fc(a, b) {
        if (null == b) return new a;
        if (!Array.isArray(b)) throw Error("must be an array");
        if (Object.isFrozen(b) || Object.isSealed(b) || !Object.isExtensible(b)) throw Error("arrays passed to jspb constructors must be mutable");
        b[r] |= 128;
        return Qb(a, gb(b))
    };

    function Gc(a, b) {
        const c = Hc;
        Hc = void 0;
        if (!b(a)) throw b = c ? c() + "\n" : "", Error(b + String(a));
    }

    const Ic = a => null !== a && void 0 !== a;
    let Hc = void 0;

    function Jc(a) {
        return b => {
            if (null == b || "" == b) b = new a; else {
                b = JSON.parse(b);
                if (!Array.isArray(b)) throw Error(void 0);
                b = Qb(a, gb(b))
            }
            return b
        }
    };var Kc = class extends N {
    };
    var Lc = class extends N {
    };
    Lc.u = [2, 3, 4];
    var O = class {
        constructor(a, b = !1) {
            this.g = a;
            this.defaultValue = b
        }
    }, Mc = class {
        constructor(a, b = 0) {
            this.g = a;
            this.defaultValue = b
        }
    }, Nc = class {
        constructor(a) {
            this.g = a;
            this.defaultValue = ""
        }
    }, Oc = class {
        constructor(a, b = []) {
            this.g = a;
            this.defaultValue = b
        }
    };
    var Pc = new O(203);

    function Qc(a) {
        return function () {
            return !a.apply(this, arguments)
        }
    }

    function Rc(a) {
        let b = !1, c;
        return function () {
            b || (c = a(), b = !0);
            return c
        }
    }

    function Sc(a) {
        let b = a;
        return function () {
            if (b) {
                const c = b;
                b = null;
                c()
            }
        }
    };

    function Tc(a, b, c) {
        a.addEventListener && a.addEventListener(b, c, !1)
    }

    function Uc(a, b, c) {
        return a.removeEventListener ? (a.removeEventListener(b, c, !1), !0) : !1
    };var P = a => {
        var b = "Aa";
        if (a.Aa && a.hasOwnProperty(b)) return a.Aa;
        b = new a;
        return a.Aa = b
    };
    var Vc = class {
        constructor() {
            const a = {};
            this.i = (b, c) => null != a[b] ? a[b] : c;
            this.j = (b, c) => null != a[b] ? a[b] : c;
            this.g = (b, c) => null != a[b] ? a[b] : c;
            this.h = (b, c) => null != a[b] ? a[b] : c;
            this.s = () => {
            }
        }
    };

    function Q(a) {
        return P(Vc).i(a.g, a.defaultValue)
    }

    function Wc(a) {
        return P(Vc).j(a.g, a.defaultValue)
    };

    function Xc(a, b) {
        const c = {};
        for (const d in a) b.call(void 0, a[d], d, a) && (c[d] = a[d]);
        return c
    }

    function Yc(a, b) {
        for (const c in a) if (b.call(void 0, a[c], c, a)) return !0;
        return !1
    }

    function Zc(a) {
        const b = [];
        let c = 0;
        for (const d in a) b[c++] = a[d];
        return b
    }

    function $c(a) {
        const b = {};
        for (const c in a) b[c] = a[c];
        return b
    };var ad;
    var bd = class {
        constructor(a) {
            this.h = a
        }

        toString() {
            return this.h + ""
        }
    };

    function cd(a, b) {
        a = dd.exec(ed(a).toString());
        var c = a[3] || "";
        return fd(a[1] + gd("?", a[2] || "", b) + gd("#", c))
    }

    function ed(a) {
        return a instanceof bd && a.constructor === bd ? a.h : "type_error:TrustedResourceUrl"
    }

    var dd = /^([^?#]*)(\?[^#]*)?(#[\s\S]*)?/, hd = {};

    function fd(a) {
        if (void 0 === ad) {
            var b = null;
            var c = p.trustedTypes;
            if (c && c.createPolicy) {
                try {
                    b = c.createPolicy("goog#html", {createHTML: oa, createScript: oa, createScriptURL: oa})
                } catch (d) {
                    p.console && p.console.error(d.message)
                }
                ad = b
            } else ad = b
        }
        a = (b = ad) ? b.createScriptURL(a) : a;
        return new bd(a, hd)
    }

    function gd(a, b, c) {
        if (null == c) return b;
        if ("string" === typeof c) return c ? a + encodeURIComponent(c) : "";
        for (var d in c) if (Object.prototype.hasOwnProperty.call(c, d)) {
            var e = c[d];
            e = Array.isArray(e) ? e : [e];
            for (var f = 0; f < e.length; f++) {
                var g = e[f];
                null != g && (b || (b = a), b += (b.length > a.length ? "&" : "") + encodeURIComponent(d) + "=" + encodeURIComponent(String(g)))
            }
        }
        return b
    };var id = class {
        constructor(a) {
            this.g = a
        }

        toString() {
            return this.g.toString()
        }
    };

    function jd(a) {
        return String(a).replace(/\-([a-z])/g, function (b, c) {
            return c.toUpperCase()
        })
    };

    function kd(a, b) {
        b = String(b);
        "application/xhtml+xml" === a.contentType && (b = b.toLowerCase());
        return a.createElement(b)
    }

    function ld(a) {
        this.g = a || p.document || document
    }

    ld.prototype.contains = function (a, b) {
        if (!a || !b) return !1;
        if (a.contains && 1 == b.nodeType) return a == b || a.contains(b);
        if ("undefined" != typeof a.compareDocumentPosition) return a == b || !!(a.compareDocumentPosition(b) & 16);
        for (; b && a != b;) b = b.parentNode;
        return b == a
    };

    function md() {
        return ta && xa ? xa.mobile : !nd() && (q("iPod") || q("iPhone") || q("Android") || q("IEMobile"))
    }

    function nd() {
        return ta && xa ? !xa.mobile && (q("iPad") || q("Android") || q("Silk")) : q("iPad") || q("Android") && !q("Mobile") || q("Silk")
    };var od = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$"),
        pd = /#|$/;

    function qd(a, b) {
        var c = a.search(pd);
        a:{
            var d = 0;
            for (var e = b.length; 0 <= (d = a.indexOf(b, d)) && d < c;) {
                var f = a.charCodeAt(d - 1);
                if (38 == f || 63 == f) if (f = a.charCodeAt(d + e), !f || 61 == f || 38 == f || 35 == f) break a;
                d += e + 1
            }
            d = -1
        }
        if (0 > d) return null;
        e = a.indexOf("&", d);
        if (0 > e || e > c) e = c;
        d += b.length + 1;
        return decodeURIComponent(a.slice(d, -1 !== e ? e : 0).replace(/\+/g, " "))
    };

    function rd(a, b = `unexpected value ${a}!`) {
        throw Error(b);
    };/*

 SPDX-License-Identifier: Apache-2.0
*/
    const sd = "alternate author bookmark canonical cite help icon license modulepreload next prefetch dns-prefetch prerender preconnect preload prev search subresource".split(" ");

    function td(a) {
        try {
            var b;
            if (b = !!a && null != a.location.href) a:{
                try {
                    Pa(a.foo);
                    b = !0;
                    break a
                } catch (c) {
                }
                b = !1
            }
            return b
        } catch {
            return !1
        }
    }

    function ud(a) {
        return td(a.top) ? a.top : null
    }

    function vd(a, b) {
        const c = wd("SCRIPT", a);
        c.src = ed(b);
        (void 0)?.sc || (b = (b = (c.ownerDocument && c.ownerDocument.defaultView || window).document.querySelector?.("script[nonce]")) ? b.nonce || b.getAttribute("nonce") || "" : "") && c.setAttribute("nonce", b);
        return (a = a.getElementsByTagName("script")[0]) && a.parentNode ? (a.parentNode.insertBefore(c, a), c) : null
    }

    function xd(a, b) {
        return b.getComputedStyle ? b.getComputedStyle(a, null) : a.currentStyle
    }

    function yd() {
        if (!globalThis.crypto) return Math.random();
        try {
            const a = new Uint32Array(1);
            globalThis.crypto.getRandomValues(a);
            return a[0] / 65536 / 65536
        } catch {
            return Math.random()
        }
    }

    function zd(a, b) {
        if (a) for (const c in a) Object.prototype.hasOwnProperty.call(a, c) && b(a[c], c, a)
    }

    function Ad(a) {
        const b = a.length;
        if (0 == b) return 0;
        let c = 305419896;
        for (let d = 0; d < b; d++) c ^= (c << 5) + (c >> 2) + a.charCodeAt(d) & 4294967295;
        return 0 < c ? c : 4294967296 + c
    }

    var Bd = /^([0-9.]+)px$/, Cd = /^(-?[0-9.]{1,30})$/;

    function Dd(a) {
        if (!Cd.test(a)) return null;
        a = Number(a);
        return isNaN(a) ? null : a
    }

    function R(a) {
        return (a = Bd.exec(a)) ? +a[1] : null
    }

    var Ed = (a, b) => {
        for (let e = 0; 50 > e; ++e) {
            try {
                var c = !(!a.frames || !a.frames[b])
            } catch {
                c = !1
            }
            if (c) return a;
            a:{
                try {
                    const f = a.parent;
                    if (f && f != a) {
                        var d = f;
                        break a
                    }
                } catch {
                }
                d = null
            }
            if (!(a = d)) break
        }
        return null
    }, Fd = Rc(() => md() ? 2 : nd() ? 1 : 0), Gd = a => {
        zd({display: "none"}, (b, c) => {
            a.style.setProperty(c, b, "important")
        })
    };
    let Hd = [];
    const Id = () => {
        const a = Hd;
        Hd = [];
        for (const b of a) try {
            b()
        } catch {
        }
    };

    function Jd() {
        var a = P(Vc).h(Kd.g, Kd.defaultValue), b = S.document;
        if (a.length && b.head) for (const c of a) c && b.head && (a = wd("META"), b.head.appendChild(a), a.httpEquiv = "origin-trial", a.content = c)
    }

    var Ld = () => {
        var a = Math.random;
        return Math.floor(a() * 2 ** 52)
    }, Md = a => {
        if ("number" !== typeof a.goog_pvsid) try {
            Object.defineProperty(a, "goog_pvsid", {value: Ld(), configurable: !1})
        } catch (b) {
        }
        return Number(a.goog_pvsid) || -1
    }, Od = a => {
        var b = Nd;
        "complete" === b.readyState || "interactive" === b.readyState ? (Hd.push(a), 1 == Hd.length && (window.Promise ? Promise.resolve().then(Id) : window.setImmediate ? setImmediate(Id) : setTimeout(Id, 0))) : b.addEventListener("DOMContentLoaded", a)
    };

    function wd(a, b = document) {
        return b.createElement(String(a).toLowerCase())
    };

    function Pd(a, b, c = null, d = !1, e = !1) {
        Rd(a, b, c, d, e)
    }

    function Rd(a, b, c, d, e = !1) {
        a.google_image_requests || (a.google_image_requests = []);
        const f = wd("IMG", a.document);
        if (c || d) {
            const g = h => {
                c && c(h);
                if (d) {
                    h = a.google_image_requests;
                    const k = Ha(h, f);
                    0 <= k && Array.prototype.splice.call(h, k, 1)
                }
                Uc(f, "load", g);
                Uc(f, "error", g)
            };
            Tc(f, "load", g);
            Tc(f, "error", g)
        }
        e && (f.attributionSrc = "");
        f.src = b;
        a.google_image_requests.push(f)
    }

    var Td = (a, b) => {
        let c = `https://${"pagead2.googlesyndication.com"}/pagead/gen_204?id=${b}`;
        zd(a, (d, e) => {
            if (d || 0 === d) c += `&${e}=${encodeURIComponent("" + d)}`
        });
        Sd(c)
    }, Sd = a => {
        var b = window;
        b.fetch ? b.fetch(a, {
            keepalive: !0,
            credentials: "include",
            redirect: "follow",
            method: "get",
            mode: "no-cors"
        }) : Pd(b, a, void 0, !1, !1)
    };
    let Ud = null;
    var Nd = document, S = window;

    function Vd(a) {
        this.g = a || {cookie: ""}
    }

    Vd.prototype.set = function (a, b, c) {
        let d, e, f, g = !1, h;
        "object" === typeof c && (h = c.tc, g = c.vc || !1, f = c.domain || void 0, e = c.path || void 0, d = c.Ab);
        if (/[;=\s]/.test(a)) throw Error('Invalid cookie name "' + a + '"');
        if (/[;\r\n]/.test(b)) throw Error('Invalid cookie value "' + b + '"');
        void 0 === d && (d = -1);
        this.g.cookie = a + "=" + b + (f ? ";domain=" + f : "") + (e ? ";path=" + e : "") + (0 > d ? "" : 0 == d ? ";expires=" + (new Date(1970, 1, 1)).toUTCString() : ";expires=" + (new Date(Date.now() + 1E3 * d)).toUTCString()) + (g ? ";secure" : "") + (null != h ? ";samesite=" + h : "")
    };
    Vd.prototype.get = function (a, b) {
        const c = a + "=", d = (this.g.cookie || "").split(";");
        for (let e = 0, f; e < d.length; e++) {
            f = qa(d[e]);
            if (0 == f.lastIndexOf(c, 0)) return f.slice(c.length);
            if (f == a) return ""
        }
        return b
    };
    Vd.prototype.isEmpty = function () {
        return !this.g.cookie
    };
    Vd.prototype.clear = function () {
        var a = (this.g.cookie || "").split(";");
        const b = [];
        var c = [];
        let d, e;
        for (let f = 0; f < a.length; f++) e = qa(a[f]), d = e.indexOf("="), -1 == d ? (b.push(""), c.push(e)) : (b.push(e.substring(0, d)), c.push(e.substring(d + 1)));
        for (c = b.length - 1; 0 <= c; c--) a = b[c], this.get(a), this.set(a, "", {
            Ab: 0,
            path: void 0,
            domain: void 0
        })
    };

    function Wd(a, b = window) {
        if (J(a, 5)) try {
            return b.localStorage
        } catch {
        }
        return null
    }

    function Xd(a = window) {
        try {
            return a.localStorage
        } catch {
            return null
        }
    };

    function Yd(a, ...b) {
        if (0 === b.length) return fd(a[0]);
        let c = a[0];
        for (let d = 0; d < b.length; d++) c += encodeURIComponent(b[d]) + a[d + 1];
        return fd(c)
    };let Zd = null;
    var $d = (a, b = []) => {
        let c = !1;
        p.google_logging_queue || (c = !0, p.google_logging_queue = []);
        p.google_logging_queue.push([a, b]);
        if (a = c) {
            if (null == Zd) {
                Zd = !1;
                try {
                    const d = ud(p);
                    d && -1 !== d.location.hash.indexOf("google_logging") && (Zd = !0);
                    Xd(p)?.getItem("google_logging") && (Zd = !0)
                } catch (d) {
                }
            }
            a = Zd
        }
        a && vd(p.document, Yd`https://pagead2.googlesyndication.com/pagead/js/logging_library.js`)
    };

    function ae(a = p) {
        let b = a.context || a.AMP_CONTEXT_DATA;
        if (!b) try {
            b = a.parent.context || a.parent.AMP_CONTEXT_DATA
        } catch {
        }
        return b?.pageViewId && b?.canonicalUrl ? b : null
    }

    function be(a = ae()) {
        return a ? td(a.master) ? a.master : null : null
    };var ce = a => {
        a = be(ae(a)) || a;
        a.google_unique_id = (a.google_unique_id || 0) + 1;
        return a.google_unique_id
    }, de = a => {
        a = a.google_unique_id;
        return "number" === typeof a ? a : 0
    }, ee = () => {
        if (!S) return !1;
        try {
            return !(!S.navigator.standalone && !S.top.navigator.standalone)
        } catch (a) {
            return !1
        }
    }, fe = a => {
        if (!a) return "";
        a = a.toLowerCase();
        "ca-" != a.substring(0, 3) && (a = "ca-" + a);
        return a
    };

    class ge {
        constructor(a, b) {
            this.error = a;
            this.context = b.context;
            this.msg = b.message || "";
            this.id = b.id || "jserror";
            this.meta = {}
        }
    }

    var he = a => !!(a.error && a.meta && a.id);
    const ie = RegExp("^https?://(\\w|-)+\\.cdn\\.ampproject\\.(net|org)(\\?|/|$)");
    var je = class {
        constructor(a, b) {
            this.g = a;
            this.h = b
        }
    }, ke = class {
        constructor(a, b, c) {
            this.url = a;
            this.l = b;
            this.Za = !!c;
            this.depth = null
        }
    };
    let le = null;

    function me() {
        if (null === le) {
            le = "";
            try {
                let a = "";
                try {
                    a = p.top.location.hash
                } catch (b) {
                    a = p.location.hash
                }
                if (a) {
                    const b = a.match(/\bdeid=([\d,]+)/);
                    le = b ? b[1] : ""
                }
            } catch (a) {
            }
        }
        return le
    };

    function ne() {
        const a = p.performance;
        return a && a.now && a.timing ? Math.floor(a.now() + a.timing.navigationStart) : Date.now()
    }

    function oe() {
        const a = p.performance;
        return a && a.now ? a.now() : null
    };var pe = class {
        constructor(a, b) {
            var c = oe() || ne();
            this.label = a;
            this.type = b;
            this.value = c;
            this.duration = 0;
            this.taskId = this.slotId = void 0;
            this.uniqueId = Math.random()
        }
    };
    const qe = p.performance, re = !!(qe && qe.mark && qe.measure && qe.clearMarks), se = Rc(() => {
        var a;
        if (a = re) a = me(), a = !!a.indexOf && 0 <= a.indexOf("1337");
        return a
    });

    function te(a) {
        a && qe && se() && (qe.clearMarks(`goog_${a.label}_${a.uniqueId}_start`), qe.clearMarks(`goog_${a.label}_${a.uniqueId}_end`))
    }

    function ue(a) {
        a.g = !1;
        a.h != a.i.google_js_reporting_queue && (se() && Ia(a.h, te), a.h.length = 0)
    }

    class ve {
        constructor(a) {
            this.h = [];
            this.i = a || p;
            let b = null;
            a && (a.google_js_reporting_queue = a.google_js_reporting_queue || [], this.h = a.google_js_reporting_queue, b = a.google_measure_js_timing);
            this.g = se() || (null != b ? b : 1 > Math.random())
        }

        start(a, b) {
            if (!this.g) return null;
            a = new pe(a, b);
            b = `goog_${a.label}_${a.uniqueId}_start`;
            qe && se() && qe.mark(b);
            return a
        }

        end(a) {
            if (this.g && "number" === typeof a.value) {
                a.duration = (oe() || ne()) - a.value;
                var b = `goog_${a.label}_${a.uniqueId}_end`;
                qe && se() && qe.mark(b);
                !this.g || 2048 < this.h.length || this.h.push(a)
            }
        }
    };

    function we(a, b) {
        const c = {};
        c[a] = b;
        return [c]
    }

    function xe(a, b, c, d, e) {
        const f = [];
        zd(a, function (g, h) {
            (g = ye(g, b, c, d, e)) && f.push(h + "=" + g)
        });
        return f.join(b)
    }

    function ye(a, b, c, d, e) {
        if (null == a) return "";
        b = b || "&";
        c = c || ",$";
        "string" == typeof c && (c = c.split(""));
        if (a instanceof Array) {
            if (d = d || 0, d < c.length) {
                const f = [];
                for (let g = 0; g < a.length; g++) f.push(ye(a[g], b, c, d + 1, e));
                return f.join(c[d])
            }
        } else if ("object" == typeof a) return e = e || 0, 2 > e ? encodeURIComponent(xe(a, b, c, d, e + 1)) : "...";
        return encodeURIComponent(String(a))
    }

    function ze(a) {
        let b = 1;
        for (const c in a.h) b = c.length > b ? c.length : b;
        return 3997 - b - a.i.length - 1
    }

    function Ae(a, b) {
        let c = "https://pagead2.googlesyndication.com" + b, d = ze(a) - b.length;
        if (0 > d) return "";
        a.g.sort(function (f, g) {
            return f - g
        });
        b = null;
        let e = "";
        for (let f = 0; f < a.g.length; f++) {
            const g = a.g[f], h = a.h[g];
            for (let k = 0; k < h.length; k++) {
                if (!d) {
                    b = null == b ? g : b;
                    break
                }
                let m = xe(h[k], a.i, ",$");
                if (m) {
                    m = e + m;
                    if (d >= m.length) {
                        d -= m.length;
                        c += m;
                        e = a.i;
                        break
                    }
                    b = null == b ? g : b
                }
            }
        }
        a = "";
        null != b && (a = e + "trn=" + b);
        return c + a
    }

    class Be {
        constructor() {
            this.i = "&";
            this.h = {};
            this.j = 0;
            this.g = []
        }
    };

    function Ce(a) {
        let b = a.toString();
        a.name && -1 == b.indexOf(a.name) && (b += ": " + a.name);
        a.message && -1 == b.indexOf(a.message) && (b += ": " + a.message);
        if (a.stack) {
            a = a.stack;
            var c = b;
            try {
                -1 == a.indexOf(c) && (a = c + "\n" + a);
                let d;
                for (; a != d;) d = a, a = a.replace(RegExp("((https?:/..*/)[^/:]*:\\d+(?:.|\n)*)\\2"), "$1");
                b = a.replace(RegExp("\n *", "g"), "\n")
            } catch (d) {
                b = c
            }
        }
        return b
    }

    var Ee = class {
        constructor(a, b, c = null) {
            this.B = a;
            this.C = b;
            this.h = c;
            this.g = null;
            this.i = !1;
            this.s = this.J
        }

        hb(a) {
            this.s = a
        }

        Da(a) {
            this.g = a
        }

        j(a) {
            this.i = a
        }

        ea(a, b, c) {
            let d, e;
            try {
                this.h && this.h.g ? (e = this.h.start(a.toString(), 3), d = b(), this.h.end(e)) : d = b()
            } catch (f) {
                b = this.C;
                try {
                    te(e), b = this.s(a, new ge(f, {message: Ce(f)}), void 0, c)
                } catch (g) {
                    this.J(217, g)
                }
                if (b) window.console?.error?.(f); else throw f;
            }
            return d
        }

        oa(a, b) {
            return (...c) => this.ea(a, () => b.apply(void 0, c))
        }

        J(a, b, c, d, e) {
            e = e || "jserror";
            let f;
            try {
                const Ta = new Be;
                var g = Ta;
                g.g.push(1);
                g.h[1] = we("context", a);
                he(b) || (b = new ge(b, {message: Ce(b)}));
                if (b.msg) {
                    let ja = b.msg;
                    null == ja.substring && (ja = `b/320546888 ${typeof ja} ${ja}`);
                    g = Ta;
                    var h = ja.substring(0, 512);
                    g.g.push(2);
                    g.h[2] = we("msg", h)
                }
                var k = b.meta || {};
                b = k;
                if (this.g) try {
                    this.g(b)
                } catch (ja) {
                }
                if (d) try {
                    d(b)
                } catch (ja) {
                }
                d = Ta;
                k = [k];
                d.g.push(3);
                d.h[3] = k;
                d = p;
                k = [];
                b = null;
                do {
                    var m = d;
                    if (td(m)) {
                        var l = m.location.href;
                        b = m.document && m.document.referrer || null
                    } else l = b, b = null;
                    k.push(new ke(l || "", m));
                    try {
                        d = m.parent
                    } catch (ja) {
                        d = null
                    }
                } while (d && m != d);
                for (let ja = 0, cg = k.length - 1; ja <= cg; ++ja) k[ja].depth = cg - ja;
                m = p;
                if (m.location && m.location.ancestorOrigins && m.location.ancestorOrigins.length == k.length - 1) for (l = 1; l < k.length; ++l) {
                    var n = k[l];
                    n.url || (n.url = m.location.ancestorOrigins[l - 1] || "", n.Za = !0)
                }
                var v = k;
                let Cc = new ke(p.location.href, p, !1);
                m = null;
                const Qd = v.length - 1;
                for (n = Qd; 0 <= n; --n) {
                    var t = v[n];
                    !m && ie.test(t.url) && (m = t);
                    if (t.url && !t.Za) {
                        Cc = t;
                        break
                    }
                }
                t = null;
                const ck = v.length && v[Qd].url;
                0 != Cc.depth && ck && (t = v[Qd]);
                f = new je(Cc, t);
                if (f.h) {
                    v = Ta;
                    var w = f.h.url || "";
                    v.g.push(4);
                    v.h[4] = we("top", w)
                }
                var z = {url: f.g.url || ""};
                if (f.g.url) {
                    var A = f.g.url.match(od), B = A[1], K = A[3], ua = A[4];
                    w = "";
                    B && (w += B + ":");
                    K && (w += "//", w += K, ua && (w += ":" + ua));
                    var dg = w
                } else dg = "";
                B = Ta;
                z = [z, {url: dg}];
                B.g.push(5);
                B.h[5] = z;
                De(this.B, e, Ta, this.i, c)
            } catch (Ta) {
                try {
                    De(this.B, e, {context: "ecmserr", rctx: a, msg: Ce(Ta), url: f && f.g.url}, this.i, c)
                } catch (Cc) {
                }
            }
            return this.C
        }

        Y(a, b) {
            b.catch(c => {
                c = c ? c : "unknown rejection";
                this.J(a, c instanceof Error ? c : Error(c), void 0, this.g || void 0)
            })
        }
    };
    var Fe = a => "string" === typeof a, Ge = a => void 0 === a;
    var He = class extends N {
    };
    He.u = [2, 8];
    var Ie = [3, 4, 5], Je = [6, 7];

    function Ke(a) {
        return null != a ? !a : a
    }

    function Le(a, b) {
        let c = !1;
        for (let d = 0; d < a.length; d++) {
            const e = a[d]();
            if (e === b) return e;
            null == e && (c = !0)
        }
        if (!c) return !b
    }

    function Me(a, b) {
        var c = F(a, He, 2);
        if (!c.length) return Ne(a, b);
        a = M(a, 1);
        if (1 === a) return Ke(Me(c[0], b));
        c = Ka(c, d => () => Me(d, b));
        switch (a) {
            case 2:
                return Le(c, !1);
            case 3:
                return Le(c, !0)
        }
    }

    function Ne(a, b) {
        const c = qc(a, Ie);
        a:{
            switch (c) {
                case 3:
                    var d = M(a, pc(a, Ie, 3));
                    break a;
                case 4:
                    d = M(a, pc(a, Ie, 4));
                    break a;
                case 5:
                    d = M(a, pc(a, Ie, 5));
                    break a
            }
            d = void 0
        }
        if (d && (b = (b = b[c]) && b[d])) {
            try {
                var e = hc(a, 8, Nb);
                var f = b(...e)
            } catch (g) {
                return
            }
            e = M(a, 1);
            if (4 === e) return !!f;
            if (5 === e) return null != f;
            if (12 === e) a = L(a, pc(a, Je, 7)); else a:{
                switch (c) {
                    case 4:
                        a = zc(a, pc(a, Je, 6));
                        break a;
                    case 5:
                        a = L(a, pc(a, Je, 7));
                        break a
                }
                a = void 0
            }
            if (null != a) {
                if (6 === e) return f === a;
                if (9 === e) return null != f && 0 === ra(String(f), a);
                if (null != f) switch (e) {
                    case 7:
                        return f < a;
                    case 8:
                        return f > a;
                    case 12:
                        return Fe(a) && Fe(f) && (new RegExp(a)).test(f);
                    case 10:
                        return null != f && -1 === ra(String(f), a);
                    case 11:
                        return null != f && 1 === ra(String(f), a)
                }
            }
        }
    }

    function Oe(a, b) {
        return !a || !(!b || !Me(a, b))
    };var Pe = class extends N {
    };
    Pe.u = [4];
    var Qe = class extends N {
        getValue() {
            return E(this, Pe, 2)
        }
    };
    var Re = class extends N {
    }, Se = Jc(Re);
    Re.u = [5];
    var Te = [1, 2, 3, 6, 7];
    var Ue = class extends N {
        constructor() {
            super()
        }
    };

    function Ve(a, b) {
        try {
            const c = d => [{[d.Ea]: d.Ba}];
            return JSON.stringify([a.filter(d => d.la).map(c), b.toJSON(), a.filter(d => !d.la).map(c)])
        } catch (c) {
            return We(c, b), ""
        }
    }

    function We(a, b) {
        try {
            Td({
                m: Ce(a instanceof Error ? a : Error(String(a))),
                b: M(b, 1) || null,
                v: L(b, 2) || null
            }, "rcs_internal")
        } catch (c) {
        }
    }

    var Xe = class {
        constructor(a, b) {
            var c = new Ue;
            a = D(c, 1, Cb(a), 0);
            b = Ec(a, 2, b);
            a = b.A;
            c = a[r];
            this.i = c & 2 ? b : Qb(b.constructor, ac(a, c, !0))
        }
    };
    var Ye = class extends N {
        constructor() {
            super()
        }
    };
    Ye.u = [2];

    function Ze(a) {
        var b = new $e;
        return y(b, 1, Cb(a))
    }

    var $e = class extends N {
        constructor() {
            super()
        }

        getValue() {
            return M(this, 1)
        }
    };

    function af(a, b) {
        return Bc(a, 1, b)
    }

    function bf(a, b) {
        return Bc(a, 2, b)
    }

    var cf = class extends N {
        constructor() {
            super()
        }

        getWidth() {
            return yc(this, 1)
        }

        getHeight() {
            return yc(this, 2)
        }
    };

    function df(a, b) {
        return tc(a, 1, b)
    }

    function ef(a, b) {
        return tc(a, 2, b)
    }

    function ff(a, b) {
        tc(a, 3, b)
    }

    function gf(a, b) {
        return D(a, 5, zb(b), !1)
    }

    var hf = class extends N {
        constructor() {
            super()
        }

        getContentUrl() {
            return L(this, 4)
        }
    };
    var sc = class extends N {
    };
    var jf = class extends N {
    };
    var kf = class extends N {
        constructor() {
            super()
        }

        getContentUrl() {
            return L(this, 1)
        }
    };

    function lf(a) {
        var b = new mf;
        return D(b, 1, Cb(a), 0)
    }

    var mf = class extends N {
        constructor() {
            super()
        }
    };

    function nf(a, b) {
        return uc(a, 4, of, b)
    }

    var pf = class extends N {
        constructor() {
            super()
        }
    }, of = [4, 5, 6, 8, 9, 10, 11, 12];
    var qf = class extends N {
        constructor() {
            super()
        }
    };

    function rf(a, b) {
        return D(a, 1, Cb(b), 0)
    }

    function sf(a, b) {
        return D(a, 2, Cb(b), 0)
    }

    var tf = class extends N {
        constructor() {
            super()
        }
    };
    var uf = class extends N {
        constructor() {
            super()
        }
    }, vf = [1, 2];

    function wf(a, b) {
        return tc(a, 1, b)
    }

    function xf(a, b) {
        return vc(a, 2, b)
    }

    function yf(a, b) {
        return mc(a, 4, b, Eb)
    }

    function zf(a, b) {
        return vc(a, 5, b)
    }

    function Af(a, b) {
        return D(a, 6, Cb(b), 0)
    }

    var Bf = class extends N {
        constructor() {
            super()
        }
    };
    Bf.u = [2, 4, 5];
    var Cf = class extends N {
        constructor() {
            super()
        }
    };
    Cf.u = [5];
    var Df = [1, 2, 3, 4];
    var Ef = class extends N {
        constructor() {
            super()
        }
    };
    Ef.u = [2, 3];

    function Ff(a) {
        var b = new Gf;
        return uc(b, 4, Hf, a)
    }

    var Gf = class extends N {
        constructor() {
            super()
        }

        getTagSessionCorrelator() {
            return yc(this, 2)
        }
    }, Hf = [4, 5, 7, 8];
    var If = class extends N {
        constructor() {
            super()
        }
    };
    var Jf = class extends N {
        constructor() {
            super()
        }
    };
    Jf.u = [4, 5];
    var Kf = class extends N {
        constructor() {
            super()
        }

        getTagSessionCorrelator() {
            return yc(this, 1)
        }
    };
    Kf.u = [2];
    var Lf = class extends N {
        constructor() {
            super()
        }
    }, Mf = [4, 6];

    class Nf extends Xe {
        constructor() {
            super(...arguments)
        }
    }

    function Of(a, ...b) {
        Pf(a, ...b.map(c => ({la: !0, Ea: 3, Ba: c.toJSON()})))
    }

    function Qf(a, ...b) {
        Pf(a, ...b.map(c => ({la: !0, Ea: 4, Ba: c.toJSON()})))
    }

    function Rf(a, ...b) {
        Pf(a, ...b.map(c => ({la: !0, Ea: 7, Ba: c.toJSON()})))
    }

    var Sf = class extends Nf {
    };
    var Tf = (a, b) => {
        globalThis.fetch(a, {
            method: "POST",
            body: b,
            keepalive: 65536 > b.length,
            credentials: "omit",
            mode: "no-cors",
            redirect: "follow"
        }).catch(() => {
        })
    };

    function Pf(a, ...b) {
        try {
            a.C && 65536 <= Ve(a.g.concat(b), a.i).length && Uf(a), a.j && !a.s && (a.s = !0, Vf(a.j, () => {
                Uf(a)
            })), a.g.push(...b), a.g.length >= a.B && Uf(a), a.g.length && null === a.h && (a.h = setTimeout(() => {
                Uf(a)
            }, a.H))
        } catch (c) {
            We(c, a.i)
        }
    }

    function Uf(a) {
        null !== a.h && (clearTimeout(a.h), a.h = null);
        if (a.g.length) {
            var b = Ve(a.g, a.i);
            a.D("https://pagead2.googlesyndication.com/pagead/ping?e=1", b);
            a.g = []
        }
    }

    var Wf = class extends Sf {
        constructor(a, b, c, d, e, f) {
            super(a, b);
            this.D = Tf;
            this.H = c;
            this.B = d;
            this.C = e;
            this.j = f;
            this.g = [];
            this.h = null;
            this.s = !1
        }
    }, Xf = class extends Wf {
        constructor(a, b, c = 1E3, d = 100, e = !1, f) {
            super(a, b, c, d, e && !0, f)
        }
    };

    function Yf(a, b) {
        var c = Date.now();
        c = Number.isFinite(c) ? Math.round(c) : 0;
        b = Bc(b, 1, c);
        c = Md(window);
        b = Bc(b, 2, c);
        return Bc(b, 6, a.s)
    }

    function Zf(a, b, c, d, e, f) {
        if (a.i) {
            var g = sf(rf(new tf, b), c);
            b = Af(xf(wf(zf(yf(new Bf, d), e), g), a.g.slice()), f);
            b = Ff(b);
            Qf(a.h, Yf(a, b));
            if (1 === f || 3 === f || 4 === f && !a.g.some(h => M(h, 1) === M(g, 1) && M(h, 2) === c)) a.g.push(g), 100 < a.g.length && a.g.shift()
        }
    }

    function $f(a, b, c, d) {
        if (a.i && a.j) {
            var e = new Ef;
            b = vc(e, 2, b);
            c = vc(b, 3, c);
            d && D(c, 1, Fb(d), 0);
            d = new Gf;
            d = uc(d, 7, Hf, c);
            Qf(a.h, Yf(a, d))
        }
    }

    function ag(a, b, c, d) {
        if (a.i) {
            var e = new qf;
            b = y(e, 1, Fb(b));
            c = y(b, 2, Fb(c));
            d = y(c, 3, Cb(d));
            c = new Gf;
            d = uc(c, 8, Hf, d);
            Qf(a.h, Yf(a, d))
        }
    }

    var bg = class {
        constructor(a, b, c, d = new Xf(6, "unknown", b)) {
            this.s = a;
            this.j = c;
            this.h = d;
            this.g = [];
            this.i = 0 < a && yd() < 1 / a
        }
    };
    var eg = class {
        constructor() {
            this.I = {[3]: {}, [4]: {}, [5]: {}}
        }
    };
    var fg = /^true$/.test("false");

    function gg(a, b) {
        switch (b) {
            case 1:
                return M(a, pc(a, Te, 1));
            case 2:
                return M(a, pc(a, Te, 2));
            case 3:
                return M(a, pc(a, Te, 3));
            case 6:
                return M(a, pc(a, Te, 6));
            default:
                return null
        }
    }

    function hg(a, b) {
        if (!a) return null;
        switch (b) {
            case 1:
                return J(a, 1);
            case 7:
                return L(a, 3);
            case 2:
                return zc(a, 2);
            case 3:
                return L(a, 3);
            case 6:
                return hc(a, 4, Nb);
            default:
                return null
        }
    }

    const ig = Rc(() => {
        if (!fg) return {};
        try {
            var a = window;
            try {
                var b = a.sessionStorage
            } catch {
                b = null
            }
            if (b = b?.getItem("GGDFSSK")) return JSON.parse(b)
        } catch {
        }
        return {}
    });

    function jg(a, b, c, d = 0) {
        P(kg).i[d] = P(kg).i[d]?.add(b) ?? (new Set).add(b);
        const e = ig();
        if (null != e[b]) return e[b];
        b = lg(d)[b];
        if (!b) return c;
        b = Se(JSON.stringify(b));
        b = mg(b);
        a = hg(b, a);
        return null != a ? a : c
    }

    function mg(a) {
        const b = P(eg).I;
        if (b) {
            const c = Ma(F(a, Qe, 5), d => Oe(E(d, He, 1), b));
            if (c) return c.getValue() ?? null
        }
        return E(a, Pe, 4) ?? null
    }

    class kg {
        constructor() {
            this.h = {};
            this.j = [];
            this.i = {};
            this.g = new Map
        }
    }

    function ng(a, b = !1, c) {
        return !!jg(1, a, b, c)
    }

    function og(a, b = 0, c) {
        a = Number(jg(2, a, b, c));
        return isNaN(a) ? b : a
    }

    function pg(a, b = "", c) {
        a = jg(3, a, b, c);
        return "string" === typeof a ? a : b
    }

    function qg(a, b = [], c) {
        a = jg(6, a, b, c);
        return Array.isArray(a) ? a : b
    }

    function lg(a) {
        return P(kg).h[a] || (P(kg).h[a] = {})
    }

    function rg(a, b) {
        const c = lg(b);
        zd(a, (d, e) => c[e] = d)
    }

    function sg(a, b, c, d, e = !1) {
        const f = [], g = [];
        Ia(b, h => {
            const k = lg(h);
            Ia(a, m => {
                var l = qc(m, Te);
                const n = gg(m, l);
                if (n) {
                    var v = P(kg).g.get(h)?.get(n)?.slice(0) ?? [];
                    a:{
                        const t = new Cf;
                        switch (l) {
                            case 1:
                                nc(t, 1, Df, Cb(n));
                                break;
                            case 2:
                                nc(t, 2, Df, Cb(n));
                                break;
                            case 3:
                                nc(t, 3, Df, Cb(n));
                                break;
                            case 6:
                                nc(t, 4, Df, Cb(n));
                                break;
                            default:
                                l = void 0;
                                break a
                        }
                        mc(t, 5, v, Eb);
                        l = t
                    }
                    if (v = l) v = !!P(kg).i[h]?.has(n);
                    v && f.push(l);
                    if (v = l) v = !!P(kg).g.get(h)?.has(n);
                    v && g.push(l);
                    e || (l = P(kg), l.g.has(h) || l.g.set(h, new Map), l.g.get(h).has(n) || l.g.get(h).set(n, []), d && l.g.get(h).get(n).push(d));
                    k[n] = m.toJSON()
                }
            })
        });
        (f.length || g.length) && $f(c, f, g, d ?? void 0)
    }

    function tg(a, b) {
        const c = lg(b);
        Ia(a, d => {
            var e = Se(JSON.stringify(d));
            const f = qc(e, Te);
            (e = gg(e, f)) && (c[e] || (c[e] = d))
        })
    }

    function ug() {
        return Ka(Object.keys(P(kg).h), a => Number(a))
    }

    function vg(a) {
        Na(P(kg).j, a) || rg(lg(4), a)
    };

    function T(a, b, c) {
        c.hasOwnProperty(a) || Object.defineProperty(c, String(a), {value: b})
    }

    function wg(a, b, c) {
        return b[a] || c
    }

    function xg(a) {
        T(5, ng, a);
        T(6, og, a);
        T(7, pg, a);
        T(8, qg, a);
        T(13, tg, a);
        T(15, vg, a)
    }

    function yg(a) {
        T(4, b => {
            P(eg).I = b
        }, a);
        T(9, (b, c) => {
            var d = P(eg);
            null == d.I[3][b] && (d.I[3][b] = c)
        }, a);
        T(10, (b, c) => {
            var d = P(eg);
            null == d.I[4][b] && (d.I[4][b] = c)
        }, a);
        T(11, (b, c) => {
            var d = P(eg);
            null == d.I[5][b] && (d.I[5][b] = c)
        }, a);
        T(14, b => {
            var c = P(eg);
            for (const d of [3, 4, 5]) Object.assign(c.I[d], b[d])
        }, a)
    }

    function zg(a) {
        a.hasOwnProperty("init-done") || Object.defineProperty(a, "init-done", {value: !0})
    };

    function Ag(a, b, c) {
        a.i = wg(1, b, () => {
        });
        a.j = (d, e) => wg(2, b, () => [])(d, c, e);
        a.g = () => wg(3, b, () => [])(c);
        a.h = d => {
            wg(16, b, () => {
            })(d, c)
        }
    }

    class Bg {
        i() {
        }

        h() {
        }

        j() {
            return []
        }

        g() {
            return []
        }
    };

    function De(a, b, c, d = !1, e) {
        if ((d ? a.g : Math.random()) < (e || .01)) try {
            let f;
            c instanceof Be ? f = c : (f = new Be, zd(c, (h, k) => {
                var m = f;
                const l = m.j++;
                h = we(k, h);
                m.g.push(l);
                m.h[l] = h
            }));
            const g = Ae(f, "/pagead/gen_204?id=" + b + "&");
            g && Pd(p, g)
        } catch (f) {
        }
    }

    function Cg(a, b) {
        0 <= b && 1 >= b && (a.g = b)
    }

    class Dg {
        constructor() {
            this.g = Math.random()
        }
    };let Eg, Fg;
    const Gg = new ve(window);
    (a => {
        Eg = a ?? new Dg;
        "number" !== typeof window.google_srt && (window.google_srt = Math.random());
        Cg(Eg, window.google_srt);
        Fg = new Ee(Eg, !0, Gg);
        Fg.Da(() => {
        });
        Fg.j(!0);
        "complete" == window.document.readyState ? window.google_measure_js_timing || ue(Gg) : Gg.g && Tc(window, "load", () => {
            window.google_measure_js_timing || ue(Gg)
        })
    })();
    var Hg = {Zb: 0, Yb: 1, Vb: 2, Qb: 3, Wb: 4, Rb: 5, Xb: 6, Tb: 7, Ub: 8, Pb: 9, Sb: 10, ac: 11};
    var Ig = {cc: 0, dc: 1, bc: 2};

    function Jg(a) {
        if (0 != a.g) throw Error("Already resolved/rejected.");
    }

    var Mg = class {
        constructor() {
            this.h = new Kg(this);
            this.g = 0
        }

        resolve(a) {
            Jg(this);
            this.g = 1;
            this.j = a;
            Lg(this.h)
        }
    };

    function Lg(a) {
        switch (a.g.g) {
            case 0:
                break;
            case 1:
                a.h && a.h(a.g.j);
                break;
            case 2:
                a.i && a.i(a.g.i);
                break;
            default:
                throw Error("Unhandled deferred state.");
        }
    }

    var Kg = class {
        constructor(a) {
            this.g = a
        }

        then(a, b) {
            if (this.h) throw Error("Then functions already set.");
            this.h = a;
            this.i = b;
            Lg(this)
        }
    };
    const Ng = class {
        constructor(a) {
            this.g = a.slice(0)
        }

        forEach(a) {
            this.g.forEach((b, c) => void a(b, c, this))
        }

        filter(a) {
            return new Ng(Ja(this.g, a))
        }

        apply(a) {
            return new Ng(a(this.g.slice(0)))
        }

        get(a) {
            return this.g[a]
        }

        add(a) {
            const b = this.g.slice(0);
            b.push(a);
            return new Ng(b)
        }
    };

    function Og(a, b) {
        for (var c = [], d = a.length, e = 0; e < d; e++) c.push(a[e]);
        c.forEach(b, void 0)
    };const Qg = class {
        constructor() {
            this.g = {};
            this.h = {}
        }

        set(a, b) {
            const c = Pg(a);
            this.g[c] = b;
            this.h[c] = a
        }

        get(a, b) {
            a = Pg(a);
            return void 0 !== this.g[a] ? this.g[a] : b
        }

        clear() {
            this.g = {};
            this.h = {}
        }
    };

    function Pg(a) {
        return a instanceof Object ? String(ea(a)) : a + ""
    };

    function Rg(a) {
        return new Sg({value: a}, null)
    }

    function Tg(a) {
        return new Sg(null, a)
    }

    function Ug(a) {
        try {
            return Rg(a())
        } catch (b) {
            return Tg(b)
        }
    }

    function Vg(a) {
        return null != a.g ? a.getValue() : null
    }

    function Wg(a, b) {
        null != a.g && b(a.getValue());
        return a
    }

    function Xg(a, b) {
        null != a.g || b(a.h);
        return a
    }

    class Sg {
        constructor(a, b) {
            this.g = a;
            this.h = b
        }

        getValue() {
            return this.g.value
        }

        map(a) {
            return null != this.g ? (a = a(this.getValue()), a instanceof Sg ? a : Rg(a)) : this
        }
    };const Yg = class {
        constructor(a) {
            this.g = new Qg;
            if (a) for (var b = 0; b < a.length; ++b) this.add(a[b])
        }

        add(a) {
            this.g.set(a, !0)
        }

        contains(a) {
            return void 0 !== this.g.g[Pg(a)]
        }
    };

    class Zg {
        constructor() {
            this.g = new Qg
        }

        set(a, b) {
            let c = this.g.get(a);
            c || (c = new Yg, this.g.set(a, c));
            c.add(b)
        }
    };var U = class extends N {
        getId() {
            return H(this, 3)
        }
    };
    U.u = [4];

    class $g {
        constructor({mb: a, ec: b, rc: c, Eb: d}) {
            this.g = b;
            this.j = new Ng(a || []);
            this.i = d;
            this.h = c
        }
    };const bh = a => {
        const b = [], c = a.j;
        c && c.g.length && b.push({V: "a", da: ah(c)});
        null != a.g && b.push({V: "as", da: a.g});
        null != a.h && b.push({V: "i", da: String(a.h)});
        null != a.i && b.push({V: "rp", da: String(a.i)});
        b.sort(function (d, e) {
            return d.V.localeCompare(e.V)
        });
        b.unshift({V: "t", da: "aa"});
        return b
    }, ah = a => {
        a = a.g.slice(0).map(ch);
        a = JSON.stringify(a);
        return Ad(a)
    }, ch = a => {
        const b = {};
        null != H(a, 7) && (b.q = H(a, 7));
        null != G(a, 2) && (b.o = G(a, 2));
        null != G(a, 5) && (b.p = G(a, 5));
        return b
    };
    var dh = class extends N {
        setLocation(a) {
            return y(this, 1, Cb(a))
        }
    };

    function eh(a) {
        const b = [].slice.call(arguments).filter(Qc(e => null === e));
        if (!b.length) return null;
        let c = [], d = {};
        b.forEach(e => {
            c = c.concat(e.Wa || []);
            d = Object.assign(d, e.gb)
        });
        return new fh(c, d)
    }

    function gh(a) {
        switch (a) {
            case 1:
                return new fh(null, {google_ad_semantic_area: "mc"});
            case 2:
                return new fh(null, {google_ad_semantic_area: "h"});
            case 3:
                return new fh(null, {google_ad_semantic_area: "f"});
            case 4:
                return new fh(null, {google_ad_semantic_area: "s"});
            default:
                return null
        }
    }

    function hh(a) {
        if (null == a) var b = null; else {
            var c = bh(a);
            a = [];
            for (b of c) c = String(b.da), a.push(b.V + "." + (20 >= c.length ? c : c.slice(0, 19) + "_"));
            b = new fh(null, {google_placement_id: a.join("~")})
        }
        return b
    }

    class fh {
        constructor(a, b) {
            this.Wa = a;
            this.gb = b
        }
    };const ih = new fh(["google-auto-placed"], {google_reactive_ad_format: 40, google_tag_origin: "qs"});
    var jh = Jc(class extends N {
    });
    var kh = class extends N {
    };
    var lh = class extends N {
    };
    var mh = class extends N {
    };
    mh.u = [6, 7, 9, 10, 11];
    var nh = class extends N {
    };
    var oh = class extends N {
        constructor() {
            super()
        }
    };
    oh.u = [1];

    function ph(a) {
        if (1 != a.nodeType) var b = !1; else if (b = "INS" == a.tagName) a:{
            b = ["adsbygoogle-placeholder"];
            a = a.className ? a.className.split(/\s+/) : [];
            for (var c = {}, d = 0; d < a.length; ++d) c[a[d]] = !0;
            for (d = 0; d < b.length; ++d) if (!c[b[d]]) {
                b = !1;
                break a
            }
            b = !0
        }
        return b
    };var qh = new O(1271), rh = new O(1308, !0), sh = new O(1316), th = new Mc(1130, 100), uh = new Nc(14),
        vh = new O(1247, !0), wh = new O(1272), xh = new O(316), yh = new O(1207, !0), zh = new O(313), Ah = new O(369),
        Bh = new O(1289), Ch = new O(1315), Dh = new O(1302), Eh = new O(217), Fh = new Nc(1307),
        Gh = new Mc(572636916, 25), Hh = new Mc(579884443), Ih = new Oc(556791602, ["1", "2", "4", "6"]),
        Jh = new O(579884441), Kh = new Mc(572636915, 150), Lh = new Mc(579884442), Mh = new O(561639564),
        Nh = new O(600847635), Oh = new O(600719280), Ph = new O(506914611), Qh = new O(506852289), Rh = new O(1120),
        Sh = new O(567362967, !0), Th = new O(45615403), Uh = new Mc(1079, 5), Vh = new O(10009, !0),
        Kd = new Oc(1934, ["As0hBNJ8h++fNYlkq8cTye2qDLyom8NddByiVytXGGD0YVE+2CEuTCpqXMDxdhOMILKoaiaYifwEvCRlJ/9GcQ8AAAB8eyJvcmlnaW4iOiJodHRwczovL2RvdWJsZWNsaWNrLm5ldDo0NDMiLCJmZWF0dXJlIjoiV2ViVmlld1hSZXF1ZXN0ZWRXaXRoRGVwcmVjYXRpb24iLCJleHBpcnkiOjE3MTk1MzI3OTksImlzU3ViZG9tYWluIjp0cnVlfQ==", "AgRYsXo24ypxC89CJanC+JgEmraCCBebKl8ZmG7Tj5oJNx0cmH0NtNRZs3NB5ubhpbX/bIt7l2zJOSyO64NGmwMAAACCeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZXN5bmRpY2F0aW9uLmNvbTo0NDMiLCJmZWF0dXJlIjoiV2ViVmlld1hSZXF1ZXN0ZWRXaXRoRGVwcmVjYXRpb24iLCJleHBpcnkiOjE3MTk1MzI3OTksImlzU3ViZG9tYWluIjp0cnVlfQ==", "A/ERL66fN363FkXxgDc6F1+ucRUkAhjEca9W3la6xaLnD2Y1lABsqmdaJmPNaUKPKVBRpyMKEhXYl7rSvrQw+AkAAACNeyJvcmlnaW4iOiJodHRwczovL2RvdWJsZWNsaWNrLm5ldDo0NDMiLCJmZWF0dXJlIjoiRmxlZGdlQmlkZGluZ0FuZEF1Y3Rpb25TZXJ2ZXIiLCJleHBpcnkiOjE3MTkzNTk5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9", "A6OdGH3fVf4eKRDbXb4thXA4InNqDJDRhZ8U533U/roYjp4Yau0T3YSuc63vmAs/8ga1cD0E3A7LEq6AXk1uXgsAAACTeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZXN5bmRpY2F0aW9uLmNvbTo0NDMiLCJmZWF0dXJlIjoiRmxlZGdlQmlkZGluZ0FuZEF1Y3Rpb25TZXJ2ZXIiLCJleHBpcnkiOjE3MTkzNTk5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9"]),
        Wh = new O(84);

    function Xh(a, b, c) {
        switch (c) {
            case 0:
                b.parentNode && b.parentNode.insertBefore(a, b);
                break;
            case 3:
                if (c = b.parentNode) {
                    var d = b.nextSibling;
                    if (d && d.parentNode != c) for (; d && 8 == d.nodeType;) d = d.nextSibling;
                    c.insertBefore(a, d)
                }
                break;
            case 1:
                b.insertBefore(a, b.firstChild);
                break;
            case 2:
                b.appendChild(a)
        }
        ph(b) && (b.setAttribute("data-init-display", b.style.display), b.style.display = "block")
    };

    function Yh(a, b) {
        const c = e => {
            e = Zh(e);
            return null == e ? !1 : 0 < e
        }, d = e => {
            e = Zh(e);
            return null == e ? !1 : 0 > e
        };
        switch (b) {
            case 0:
                return {init: $h(a.previousSibling, c), ha: e => $h(e.previousSibling, c), na: 0};
            case 2:
                return {init: $h(a.lastChild, c), ha: e => $h(e.previousSibling, c), na: 0};
            case 3:
                return {init: $h(a.nextSibling, d), ha: e => $h(e.nextSibling, d), na: 3};
            case 1:
                return {init: $h(a.firstChild, d), ha: e => $h(e.nextSibling, d), na: 3}
        }
        throw Error("Un-handled RelativePosition: " + b);
    }

    function Zh(a) {
        return a.hasOwnProperty("google-ama-order-assurance") ? a["google-ama-order-assurance"] : null
    }

    function $h(a, b) {
        return a && b(a) ? a : null
    };var ai = {rectangle: 1, horizontal: 2, vertical: 4};
    var bi = {
        overlays: 1,
        interstitials: 2,
        vignettes: 2,
        inserts: 3,
        immersives: 4,
        list_view: 5,
        full_page: 6,
        side_rails: 7
    };

    function ci(a) {
        a = a.document;
        let b = {};
        a && (b = "CSS1Compat" == a.compatMode ? a.documentElement : a.body);
        return b || {}
    }

    function di(a) {
        return ci(a).clientWidth
    };

    function ei(a, b) {
        do {
            const c = xd(a, b);
            if (c && "fixed" == c.position) return !1
        } while (a = a.parentElement);
        return !0
    };

    function fi(a, b) {
        var c = ["width", "height"];
        for (let e = 0; e < c.length; e++) {
            const f = "google_ad_" + c[e];
            if (!b.hasOwnProperty(f)) {
                var d = R(a[c[e]]);
                d = null === d ? null : Math.round(d);
                null != d && (b[f] = d)
            }
        }
    }

    var gi = (a, b) => !((Cd.test(b.google_ad_width) || Bd.test(a.style.width)) && (Cd.test(b.google_ad_height) || Bd.test(a.style.height))),
        ii = (a, b) => (a = hi(a, b)) ? a.y : 0, hi = (a, b) => {
            try {
                const c = b.document.documentElement.getBoundingClientRect(), d = a.getBoundingClientRect();
                return {x: d.left - c.left, y: d.top - c.top}
            } catch (c) {
                return null
            }
        }, ji = (a, b, c, d, e) => {
            if (a !== a.top) return ud(a) ? 3 : 16;
            if (!(488 > di(a))) return 4;
            if (!(a.innerHeight >= a.innerWidth)) return 5;
            const f = di(a);
            if (!f || (f - c) / f > d) a = 6; else {
                if (c = "true" != e.google_full_width_responsive) a:{
                    c = b.parentElement;
                    for (b = di(a); c; c = c.parentElement) if ((d = xd(c, a)) && (e = R(d.width)) && !(e >= b) && "visible" != d.overflow) {
                        c = !0;
                        break a
                    }
                    c = !1
                }
                a = c ? 7 : !0
            }
            return a
        }, ki = (a, b, c, d) => {
            const e = ji(b, c, a, .3, d);
            !0 !== e ? a = e : "true" == d.google_full_width_responsive || ei(c, b) ? (b = di(b), a = b - a, a = b && 0 <= a ? !0 : b ? -10 > a ? 11 : 0 > a ? 14 : 12 : 10) : a = 9;
            return a
        }, li = (a, b, c) => {
            a = a.style;
            "rtl" == b ? a.marginRight = c : a.marginLeft = c
        };
    const mi = (a, b) => {
        if (3 == b.nodeType) return /\S/.test(b.data);
        if (1 == b.nodeType) {
            if (/^(script|style)$/i.test(b.nodeName)) return !1;
            let c;
            try {
                c = xd(b, a)
            } catch (d) {
            }
            return !c || "none" != c.display && !("absolute" == c.position && ("hidden" == c.visibility || "collapse" == c.visibility))
        }
        return !1
    }, ni = (a, b, c) => {
        a = hi(b, a);
        return "rtl" == c ? -a.x : a.x
    };
    var oi = (a, b) => {
        var c;
        c = (c = b.parentElement) ? (c = xd(c, a)) ? c.direction : "" : "";
        if (c) {
            b.style.border = b.style.borderStyle = b.style.outline = b.style.outlineStyle = b.style.transition = "none";
            b.style.borderSpacing = b.style.padding = "0";
            li(b, c, "0px");
            b.style.width = di(a) + "px";
            if (0 !== ni(a, b, c)) {
                li(b, c, "0px");
                var d = ni(a, b, c);
                li(b, c, -1 * d + "px");
                a = ni(a, b, c);
                0 !== a && a !== d && li(b, c, d / (a - d) * d + "px")
            }
            b.style.zIndex = 30
        }
    };
    var pi = class {
        constructor(a, b) {
            this.U = a;
            this.i = b
        }

        height() {
            return this.i
        }

        g(a) {
            return 300 < a && 300 < this.i ? this.U : Math.min(1200, Math.round(a))
        }

        h() {
        }
    };
    var qi = (a, b, c, d = e => e) => {
        let e;
        return a.style && a.style[c] && d(a.style[c]) || (e = xd(a, b)) && e[c] && d(e[c]) || null
    }, ri = a => b => b.U <= a, ui = (a, b, c, d) => {
        const e = a && si(c, b), f = ti(b, d);
        return g => !(e && g.height() >= f)
    }, vi = a => b => b.height() <= a, si = (a, b) => ii(a, b) < ci(b).clientHeight - 100, wi = (a, b) => {
        var c = qi(b, a, "height", R);
        if (c) return c;
        var d = b.style.height;
        b.style.height = "inherit";
        c = qi(b, a, "height", R);
        b.style.height = d;
        if (c) return c;
        c = Infinity;
        do (d = b.style && R(b.style.height)) && (c = Math.min(c, d)), (d = qi(b, a, "maxHeight", R)) && (c = Math.min(c, d)); while ((b = b.parentElement) && "HTML" != b.tagName);
        return c
    };
    const ti = (a, b) => {
        const c = 0 == de(a);
        return b && c ? Math.max(250, 2 * ci(a).clientHeight / 3) : 250
    };
    var xi = {
        google_ad_channel: !0,
        google_ad_client: !0,
        google_ad_host: !0,
        google_ad_host_channel: !0,
        google_adtest: !0,
        google_tag_for_child_directed_treatment: !0,
        google_tag_for_under_age_of_consent: !0,
        google_tag_partner: !0,
        google_restrict_data_processing: !0,
        google_page_url: !0,
        google_debug_params: !0,
        google_shadow_mode: !0,
        google_adbreak_test: !0,
        google_ad_frequency_hint: !0,
        google_admob_interstitial_slot: !0,
        google_admob_rewarded_slot: !0,
        google_admob_ads_only: !0,
        google_ad_start_delay_hint: !0,
        google_max_ad_content_rating: !0,
        google_traffic_source: !0,
        google_overlays: !0,
        google_privacy_treatments: !0,
        google_xz: !0
    };
    const yi = RegExp("(^| )adsbygoogle($| )");

    function zi(a, b) {
        for (let c = 0; c < b.length; c++) {
            const d = b[c], e = jd(d.property);
            a[e] = d.value
        }
    };var Ai = class extends N {
    };
    var Bi = class extends N {
    };
    var Ci = class extends N {
        g() {
            return gc(this, 23)
        }
    };
    var Di = class extends N {
    };
    var Ei = class extends N {
    };
    var Fi = class extends N {
    };
    var Gi = class extends N {
    };
    var Hi = class extends N {
    };
    var Ii = class extends N {
        getName() {
            return H(this, 4)
        }
    }, Ji = [1, 2, 3];
    var Ki = class extends N {
    };
    Ki.u = [2, 5, 6, 11];
    var Li = class extends N {
    };
    var Ni = class extends N {
        g() {
            return Ac(this, Li, 2, Mi)
        }
    }, Mi = [1, 2];
    var Oi = class extends N {
        g() {
            return E(this, Ni, 3)
        }
    };
    Oi.u = [1, 4];
    var Pi = class extends N {
    }, Qi = Jc(Pi);
    Pi.u = [1, 2, 5, 7];

    function Ri(a) {
        var b = [];
        Og(a.getElementsByTagName("p"), function (c) {
            100 <= Si(c) && b.push(c)
        });
        return b
    }

    function Si(a) {
        if (3 == a.nodeType) return a.length;
        if (1 != a.nodeType || "SCRIPT" == a.tagName) return 0;
        var b = 0;
        Og(a.childNodes, function (c) {
            b += Si(c)
        });
        return b
    }

    function Ti(a) {
        return 0 == a.length || isNaN(a[0]) ? a : "\\" + (30 + parseInt(a[0], 10)) + " " + a.substring(1)
    }

    function Ui(a, b) {
        if (null == a.g) return b;
        switch (a.g) {
            case 1:
                return b.slice(1);
            case 2:
                return b.slice(0, b.length - 1);
            case 3:
                return b.slice(1, b.length - 1);
            case 0:
                return b;
            default:
                throw Error("Unknown ignore mode: " + a.g);
        }
    }

    const Vi = class {
        constructor(a, b, c, d) {
            this.j = a;
            this.h = b;
            this.i = c;
            this.g = d
        }

        query(a) {
            var b = [];
            try {
                b = a.querySelectorAll(this.j)
            } catch (f) {
            }
            if (!b.length) return [];
            a = Oa(b);
            a = Ui(this, a);
            "number" === typeof this.h && (b = this.h, 0 > b && (b += a.length), a = 0 <= b && b < a.length ? [a[b]] : []);
            if ("number" === typeof this.i) {
                b = [];
                for (var c = 0; c < a.length; c++) {
                    var d = Ri(a[c]), e = this.i;
                    0 > e && (e += d.length);
                    0 <= e && e < d.length && b.push(d[e])
                }
                a = b
            }
            return a
        }

        toString() {
            return JSON.stringify({
                nativeQuery: this.j, occurrenceIndex: this.h, paragraphIndex: this.i, ignoreMode: this.g
            })
        }
    };

    class Wi {
        constructor() {
            var a = Yd`https://pagead2.googlesyndication.com/pagead/js/err_rep.js`;
            this.g = null;
            this.i = !1;
            this.s = Math.random();
            this.h = this.J;
            this.B = a
        }

        Da(a) {
            this.g = a
        }

        j(a) {
            this.i = a
        }

        hb(a) {
            this.h = a
        }

        J(a, b, c = .01, d, e = "jserror") {
            if ((this.i ? this.s : Math.random()) > c) return !1;
            he(b) || (b = new ge(b, {context: a, id: e}));
            if (d || this.g) b.meta = {}, this.g && this.g(b.meta), d && d(b.meta);
            p.google_js_errors = p.google_js_errors || [];
            p.google_js_errors.push(b);
            p.error_rep_loaded || (vd(p.document, this.B), p.error_rep_loaded = !0);
            return !1
        }

        ea(a, b, c) {
            try {
                return b()
            } catch (d) {
                if (!this.h(a, d, .01, c, "jserror")) throw d;
            }
        }

        oa(a, b) {
            return (...c) => this.ea(a, () => b.apply(void 0, c))
        }

        Y(a, b) {
            b.catch(c => {
                c = c ? c : "unknown rejection";
                this.J(a, c instanceof Error ? c : Error(c), void 0, this.g || void 0)
            })
        }
    };const Xi = (a, b) => {
        b = b.google_js_reporting_queue = b.google_js_reporting_queue || [];
        2048 > b.length && b.push(a)
    };
    var Yi = (a, b, c, d, e = !1) => {
        const f = d || window, g = "undefined" !== typeof queueMicrotask;
        return function () {
            e && g && queueMicrotask(() => {
                f.google_rum_task_id_counter = f.google_rum_task_id_counter || 1;
                f.google_rum_task_id_counter += 1
            });
            const h = oe();
            let k, m = 3;
            try {
                k = b.apply(this, arguments)
            } catch (l) {
                m = 13;
                if (!c) throw l;
                c(a, l)
            } finally {
                f.google_measure_js_timing && h && Xi({
                    label: a.toString(),
                    value: h,
                    duration: (oe() || 0) - h,
                    type: m, ...(e && g && {taskId: f.google_rum_task_id_counter = f.google_rum_task_id_counter || 1})
                }, f)
            }
            return k
        }
    }, Zi = (a, b) => Yi(a, b, (c, d) => {
        (new Wi).J(c, d)
    }, void 0, !1);

    function $i(a, b, c) {
        return Yi(a, b, void 0, c, !0).apply()
    }

    function aj(a) {
        if (!a) return null;
        var b = H(a, 7);
        if (H(a, 1) || a.getId() || 0 < hc(a, 4, Nb).length) {
            var c = H(a, 3), d = H(a, 1), e = hc(a, 4, Nb);
            b = G(a, 2);
            var f = G(a, 5);
            a = bj(I(a, 6));
            var g = "";
            d && (g += d);
            c && (g += "#" + Ti(c));
            if (e) for (c = 0; c < e.length; c++) g += "." + Ti(e[c]);
            b = (e = g) ? new Vi(e, b, f, a) : null
        } else b = b ? new Vi(b, G(a, 2), G(a, 5), bj(I(a, 6))) : null;
        return b
    }

    var cj = {1: 1, 2: 2, 3: 3, 0: 0};

    function bj(a) {
        return null == a ? a : cj[a]
    }

    var dj = {1: 0, 2: 1, 3: 2, 4: 3};

    function ej(a) {
        return a.google_ama_state = a.google_ama_state || {}
    }

    function fj(a) {
        a = ej(a);
        return a.optimization = a.optimization || {}
    };var gj = a => {
        switch (I(a, 8)) {
            case 1:
            case 2:
                if (null == a) var b = null; else b = E(a, U, 1), null == b ? b = null : (a = I(a, 2), b = null == a ? null : new $g({
                    mb: [b],
                    Eb: a
                }));
                return null != b ? Rg(b) : Tg(Error("Missing dimension when creating placement id"));
            case 3:
                return Tg(Error("Missing dimension when creating placement id"));
            default:
                return Tg(Error("Invalid type: " + I(a, 8)))
        }
    };
    var hj = (a, b) => {
        const c = [];
        let d = a;
        for (a = () => {
            c.push({anchor: d.anchor, position: d.position});
            return d.anchor == b.anchor && d.position == b.position
        }; d;) {
            switch (d.position) {
                case 1:
                    if (a()) return c;
                    d.position = 2;
                case 2:
                    if (a()) return c;
                    if (d.anchor.firstChild) {
                        d = {anchor: d.anchor.firstChild, position: 1};
                        continue
                    } else d.position = 3;
                case 3:
                    if (a()) return c;
                    d.position = 4;
                case 4:
                    if (a()) return c
            }
            for (; d && !d.anchor.nextSibling && d.anchor.parentNode != d.anchor.ownerDocument.body;) {
                d = {anchor: d.anchor.parentNode, position: 3};
                if (a()) return c;
                d.position = 4;
                if (a()) return c
            }
            d && d.anchor.nextSibling ? d = {anchor: d.anchor.nextSibling, position: 1} : d = null
        }
        return c
    };

    function ij(a, b) {
        const c = new Zg, d = new Yg;
        b.forEach(e => {
            if (Ac(e, Gi, 1, Ji)) {
                e = Ac(e, Gi, 1, Ji);
                if (E(e, kh, 1) && E(E(e, kh, 1), U, 1) && E(e, kh, 2) && E(E(e, kh, 2), U, 1)) {
                    const g = jj(a, E(E(e, kh, 1), U, 1)), h = jj(a, E(E(e, kh, 2), U, 1));
                    if (g && h) for (var f of hj({anchor: g, position: I(E(e, kh, 1), 2)}, {
                        anchor: h,
                        position: I(E(e, kh, 2), 2)
                    })) c.set(ea(f.anchor), f.position)
                }
                E(e, kh, 3) && E(E(e, kh, 3), U, 1) && (f = jj(a, E(E(e, kh, 3), U, 1))) && c.set(ea(f), I(E(e, kh, 3), 2))
            } else Ac(e, Hi, 2, Ji) ? kj(a, Ac(e, Hi, 2, Ji), c) : Ac(e, Fi, 3, Ji) && lj(a, Ac(e, Fi, 3, Ji), d)
        });
        return new mj(c, d)
    }

    class mj {
        constructor(a, b) {
            this.h = a;
            this.g = b
        }
    }

    const kj = (a, b, c) => {
        E(b, kh, 2) ? (b = E(b, kh, 2), (a = jj(a, E(b, U, 1))) && c.set(ea(a), I(b, 2))) : E(b, U, 1) && (a = nj(a, E(b, U, 1))) && a.forEach(d => {
            d = ea(d);
            c.set(d, 1);
            c.set(d, 4);
            c.set(d, 2);
            c.set(d, 3)
        })
    }, lj = (a, b, c) => {
        E(b, U, 1) && (a = nj(a, E(b, U, 1))) && a.forEach(d => {
            c.add(ea(d))
        })
    }, jj = (a, b) => (a = nj(a, b)) && 0 < a.length ? a[0] : null, nj = (a, b) => (b = aj(b)) ? b.query(a) : null;

    class V extends Error {
        constructor(a = "") {
            super();
            this.name = "TagError";
            this.message = a ? "adsbygoogle.push() error: " + a : "";
            Error.captureStackTrace ? Error.captureStackTrace(this, V) : this.stack = Error().stack || ""
        }
    };let oj, W;
    const pj = new ve(p);
    var qj = a => {
        null != a && (p.google_measure_js_timing = a);
        p.google_measure_js_timing || ue(pj)
    };
    ((a, b = !0) => {
        oj = a || new Dg;
        "number" !== typeof p.google_srt && (p.google_srt = Math.random());
        Cg(oj, p.google_srt);
        W = new Ee(oj, b, pj);
        W.j(!0);
        "complete" == p.document.readyState ? qj() : pj.g && Tc(p, "load", () => {
            qj()
        })
    })();
    var rj = (a, b, c) => W.ea(a, b, c), sj = (a, b, c) => {
        const d = P(Bg).g();
        !b.eid && d.length && (b.eid = d.toString());
        De(oj, a, b, !0, c)
    }, tj = (a, b) => {
        W.Y(a, b)
    }, uj = (a, b, c, d) => {
        let e;
        he(b) ? e = b.msg || Ce(b.error) : e = Ce(b);
        return 0 == e.indexOf("TagError") ? ((b instanceof ge ? b.error : b).pbr = !0, !1) : W.J(a, b, c, d)
    };
    var vj = class {
        constructor() {
            this.g = Ld();
            this.h = 0
        }
    };

    function wj(a, b, c) {
        switch (c) {
            case 2:
            case 3:
                break;
            case 1:
            case 4:
                b = b.parentElement;
                break;
            default:
                throw Error("Unknown RelativePosition: " + c);
        }
        for (c = []; b;) {
            if (xj(b)) return !0;
            if (a.g.has(b)) break;
            c.push(b);
            b = b.parentElement
        }
        c.forEach(d => a.g.add(d));
        return !1
    }

    function yj(a) {
        a = zj(a);
        return a.has("all") || a.has("after")
    }

    function Aj(a) {
        a = zj(a);
        return a.has("all") || a.has("before")
    }

    function zj(a) {
        return (a = a && a.getAttribute("data-no-auto-ads")) ? new Set(a.split("|")) : new Set
    }

    function xj(a) {
        const b = zj(a);
        return a && ("AUTO-ADS-EXCLUSION-AREA" === a.tagName || b.has("inside") || b.has("all"))
    }

    var Bj = class {
        constructor() {
            this.g = new Set;
            this.h = new vj
        }
    };

    function Cj(a, b) {
        if (!a) return !1;
        a = xd(a, b);
        if (!a) return !1;
        a = a.cssFloat || a.styleFloat;
        return "left" == a || "right" == a
    }

    function Dj(a) {
        for (a = a.previousSibling; a && 1 != a.nodeType;) a = a.previousSibling;
        return a ? a : null
    }

    function Ej(a) {
        return !!a.nextSibling || !!a.parentNode && Ej(a.parentNode)
    };

    function Fj(a = null) {
        ({googletag: a} = a ?? window);
        return a?.apiReady ? a : void 0
    };const Gj = a => {
        const b = Fj(a);
        return b ? Ja(Ka(b.pubads().getSlots(), c => a.document.getElementById(c.getSlotElementId())), c => null != c) : null
    };
    var Hj = a => {
        const b = [];
        for (const c of a) {
            a = !0;
            for (let d = 0; d < b.length; d++) {
                const e = b[d];
                if (e.contains(c)) {
                    a = !1;
                    break
                }
                if (c.contains(e)) {
                    a = !1;
                    b[d] = c;
                    break
                }
            }
            a && b.push(c)
        }
        return b
    };

    function Ij(a, b) {
        if (a.j) return !0;
        a.j = !0;
        const c = F(a.i, mh, 1);
        a.h = 0;
        const d = Jj(a.D);
        var e = a.g;
        var f;
        try {
            var g = (f = e.localStorage.getItem("google_ama_settings")) ? jh(f) : null
        } catch (n) {
            g = null
        }
        f = null !== g && J(g, 2, !1);
        g = ej(e);
        f && (g.eatf = !0, $d(7, [!0, 0, !1]));
        b:{
            var h = {ub: !1, vb: !1}, k = Oa(e.document.querySelectorAll(".google-auto-placed"));
            const n = Oa(e.document.querySelectorAll("ins.adsbygoogle[data-anchor-shown],ins.adsbygoogle[data-anchor-status]")),
                v = Oa(e.document.querySelectorAll("ins.adsbygoogle[data-ad-format=autorelaxed]"));
            var m = (Gj(e) || Oa(e.document.querySelectorAll("div[id^=div-gpt-ad]"))).concat(Oa(e.document.querySelectorAll("iframe[id^=google_ads_iframe]")));
            const t = Oa(e.document.querySelectorAll("div.trc_related_container,div.OUTBRAIN,div[id^=rcjsload],div[id^=ligatusframe],div[id^=crt-],iframe[id^=cto_iframe],div[id^=yandex_], div[id^=Ya_sync],iframe[src*=adnxs],div.advertisement--appnexus,div[id^=apn-ad],div[id^=amzn-native-ad],iframe[src*=amazon-adsystem],iframe[id^=ox_],iframe[src*=openx],img[src*=openx],div[class*=adtech],div[id^=adtech],iframe[src*=adtech],div[data-content-ad-placement=true],div.wpcnt div[id^=atatags-]")),
                w = Oa(e.document.querySelectorAll("ins.adsbygoogle-ablated-ad-slot")),
                z = Oa(e.document.querySelectorAll("div.googlepublisherpluginad")),
                A = Oa(e.document.querySelectorAll("html > ins.adsbygoogle"));
            let B = [].concat(Oa(e.document.querySelectorAll("iframe[id^=aswift_],iframe[id^=google_ads_frame]")), Oa(e.document.querySelectorAll("body ins.adsbygoogle")));
            f = [];
            for (const [K, ua] of [[h.lc, k], [h.ub, n], [h.oc, v], [h.mc, m], [h.qc, t], [h.kc, w], [h.nc, z], [h.vb, A]]) !1 === K ? f = f.concat(ua) : B = B.concat(ua);
            h = Hj(B);
            f = Hj(f);
            h = h.slice(0);
            for (l of f) for (f = 0; f < h.length; f++) (l.contains(h[f]) || h[f].contains(l)) && h.splice(f, 1);
            var l = h;
            e = ci(e).clientHeight;
            for (f = 0; f < l.length; f++) if (!(l[f].getBoundingClientRect().top > e)) {
                e = !0;
                break b
            }
            e = !1
        }
        e = e ? g.eatfAbg = !0 : !1;
        if (e) return !0;
        e = new Yg([2]);
        for (g = 0; g < c.length; g++) {
            l = a;
            h = c[g];
            f = g;
            m = b;
            if (E(h, dh, 4) && e.contains(I(E(h, dh, 4), 1)) && 1 === I(h, 8) && Kj(h, d)) {
                l.h++;
                if (m = Lj(l, h, m, d)) k = ej(l.g), k.numAutoAdsPlaced || (k.numAutoAdsPlaced = 0), E(h, U, 1) && null != G(E(h, U, 1), 5) && (k.numPostPlacementsPlaced ? k.numPostPlacementsPlaced++ : k.numPostPlacementsPlaced = 1), null == k.placed && (k.placed = []), k.numAutoAdsPlaced++, k.placed.push({
                    index: f,
                    element: m.ga
                }), $d(7, [!1, l.h, !0]);
                l = m
            } else l = null;
            if (l) return !0
        }
        $d(7, [!1, a.h, !1]);
        return !1
    }

    function Lj(a, b, c, d) {
        if (!Kj(b, d) || 1 != I(b, 8)) return null;
        d = E(b, U, 1);
        if (!d) return null;
        d = aj(d);
        if (!d) return null;
        d = d.query(a.g.document);
        if (0 == d.length) return null;
        d = d[0];
        var e = I(b, 2);
        e = dj[e];
        e = void 0 === e ? null : e;
        var f;
        if (!(f = null == e)) {
            a:{
                f = a.g;
                switch (e) {
                    case 0:
                        f = Cj(Dj(d), f);
                        break a;
                    case 3:
                        f = Cj(d, f);
                        break a;
                    case 2:
                        var g = d.lastChild;
                        f = Cj(g ? 1 == g.nodeType ? g : Dj(g) : null, f);
                        break a
                }
                f = !1
            }
            if (c = !f && !(!c && 2 == e && !Ej(d))) c = 1 == e || 2 == e ? d : d.parentNode, c = !(c && !ph(c) && 0 >= c.offsetWidth);
            f = !c
        }
        if (!(c = f)) {
            c = a.B;
            f = I(b, 2);
            g = c.h;
            var h = ea(d);
            g = g.g.get(h);
            if (!(g = g ? g.contains(f) : !1)) a:{
                if (c.g.contains(ea(d))) switch (f) {
                    case 2:
                    case 3:
                        g = !0;
                        break a;
                    default:
                        g = !1;
                        break a
                }
                for (f = d.parentElement; f;) {
                    if (c.g.contains(ea(f))) {
                        g = !0;
                        break a
                    }
                    f = f.parentElement
                }
                g = !1
            }
            c = g
        }
        if (!c) {
            c = a.C;
            g = I(b, 2);
            a:switch (g) {
                case 1:
                    f = yj(d.previousElementSibling) || Aj(d);
                    break a;
                case 4:
                    f = yj(d) || Aj(d.nextElementSibling);
                    break a;
                case 2:
                    f = Aj(d.firstElementChild);
                    break a;
                case 3:
                    f = yj(d.lastElementChild);
                    break a;
                default:
                    throw Error("Unknown RelativePosition: " + g);
            }
            g = wj(c, d, g);
            c = c.h;
            sj("ama_exclusion_zone", {
                typ: f ? g ? "siuex" : "siex" : g ? "suex" : "noex",
                cor: c.g,
                num: c.h++,
                dvc: Fd()
            }, .1);
            c = f || g
        }
        if (c) return null;
        f = E(b, lh, 3);
        c = {};
        f && (c.jb = H(f, 1), c.Ua = H(f, 2), c.pb = !!gc(f, 3));
        f = E(b, dh, 4) && I(E(b, dh, 4), 2) ? I(E(b, dh, 4), 2) : null;
        f = gh(f);
        g = null != G(b, 12) ? G(b, 12) : null;
        g = null == g ? null : new fh(null, {google_ml_rank: g});
        b = Mj(a, b);
        b = eh(a.s, f, g, b);
        f = a.g;
        a = a.H;
        h = f.document;
        var k = c.pb || !1;
        g = kd((new ld(h)).g, "DIV");
        const m = g.style;
        m.width = "100%";
        m.height = "auto";
        m.clear = k ? "both" : "none";
        k = g.style;
        k.textAlign = "center";
        c.Db && zi(k, c.Db);
        h = kd((new ld(h)).g, "INS");
        k = h.style;
        k.display = "block";
        k.margin = "auto";
        k.backgroundColor = "transparent";
        c.jb && (k.marginTop = c.jb);
        c.Ua && (k.marginBottom = c.Ua);
        c.lb && zi(k, c.lb);
        g.appendChild(h);
        c = {ya: g, ga: h};
        c.ga.setAttribute("data-ad-format", "auto");
        g = [];
        if (h = b && b.Wa) c.ya.className = h.join(" ");
        h = c.ga;
        h.className = "adsbygoogle";
        h.setAttribute("data-ad-client", a);
        g.length && h.setAttribute("data-ad-channel", g.join("+"));
        a:{
            try {
                var l = c.ya;
                if (Q(zh)) {
                    {
                        const z = Yh(d, e);
                        if (z.init) {
                            var n = z.init;
                            for (d = n; d = z.ha(d);) n = d;
                            var v = {anchor: n, position: z.na}
                        } else v = {anchor: d, position: e}
                    }
                    l["google-ama-order-assurance"] = 0;
                    Xh(l, v.anchor, v.position)
                } else Xh(l, d, e);
                b:{
                    var t = c.ga;
                    t.dataset.adsbygoogleStatus = "reserved";
                    t.className += " adsbygoogle-noablate";
                    l = {element: t};
                    var w = b && b.gb;
                    if (t.hasAttribute("data-pub-vars")) {
                        try {
                            w = JSON.parse(t.getAttribute("data-pub-vars"))
                        } catch (z) {
                            break b
                        }
                        t.removeAttribute("data-pub-vars")
                    }
                    w && (l.params = w);
                    (f.adsbygoogle = f.adsbygoogle || []).push(l)
                }
            } catch (z) {
                (t = c.ya) && t.parentNode && (w = t.parentNode, w.removeChild(t), ph(w) && (w.style.display = w.getAttribute("data-init-display") || "none"));
                t = !1;
                break a
            }
            t = !0
        }
        return t ? c : null
    }

    function Mj(a, b) {
        return Vg(Xg(gj(b).map(hh), c => {
            ej(a.g).exception = c
        }))
    }

    const Nj = class {
        constructor(a, b, c, d, e) {
            this.g = a;
            this.H = b;
            this.i = c;
            this.s = e || null;
            (this.D = d) ? (a = a.document, d = F(d, Ii, 5), d = ij(a, d)) : d = ij(a.document, []);
            this.B = d;
            this.C = new Bj;
            this.h = 0;
            this.j = !1
        }
    };

    function Jj(a) {
        const b = {};
        a && hc(a, 6, Db).forEach(c => {
            b[c] = !0
        });
        return b
    }

    function Kj(a, b) {
        return a && ec(a, dh, 4) && b[I(E(a, dh, 4), 2)] ? !1 : !0
    };var Oj = Jc(class extends N {
    });

    function Pj(a) {
        try {
            var b = a.localStorage.getItem("google_auto_fc_cmp_setting") || null
        } catch (d) {
            b = null
        }
        const c = b;
        return c ? Ug(() => Oj(c)) : Rg(null)
    };

    function Qj() {
        if (Rj) return Rj;
        var a = be() || window;
        const b = a.google_persistent_state_async;
        return null != b && "object" == typeof b && null != b.S && "object" == typeof b.S ? Rj = b : a.google_persistent_state_async = Rj = new Sj
    }

    function Tj(a, b, c) {
        b = Uj[b] || `google_ps_${b}`;
        a = a.S;
        const d = a[b];
        return void 0 === d ? (a[b] = c(), a[b]) : d
    }

    function Vj(a, b, c) {
        return Tj(a, b, () => c)
    }

    function Wj(a, b, c) {
        a.S[Uj[b] || `google_ps_${b}`] = c
    }

    function Xj(a, b) {
        Wj(a, 38, b)
    }

    var Sj = class {
        constructor() {
            this.S = {}
        }
    }, Rj = null;
    const Uj = {[8]: "google_prev_ad_formats_by_region", [9]: "google_prev_ad_slotnames_by_region"};

    function Yj(a) {
        var b = new Zj;
        return y(b, 5, zb(a))
    }

    var Zj = class extends N {
        constructor() {
            super()
        }
    };
    Zj.u = [10];

    function ak() {
        this.s = this.s;
        this.i = this.i
    }

    ak.prototype.s = !1;

    function bk(a, b) {
        a.s ? b() : (a.i || (a.i = []), a.i.push(b))
    };const dk = a => {
        void 0 !== a.addtlConsent && "string" !== typeof a.addtlConsent && (a.addtlConsent = void 0);
        void 0 !== a.gdprApplies && "boolean" !== typeof a.gdprApplies && (a.gdprApplies = void 0);
        return void 0 !== a.tcString && "string" !== typeof a.tcString || void 0 !== a.listenerId && "number" !== typeof a.listenerId ? 2 : a.cmpStatus && "error" !== a.cmpStatus ? 0 : 3
    };

    function ek(a) {
        if (!1 === a.gdprApplies) return !0;
        void 0 === a.internalErrorState && (a.internalErrorState = dk(a));
        return "error" === a.cmpStatus || 0 !== a.internalErrorState ? a.internalBlockOnErrors ? (Td({e: String(a.internalErrorState)}, "tcfe"), !1) : !0 : "loaded" !== a.cmpStatus || "tcloaded" !== a.eventStatus && "useractioncomplete" !== a.eventStatus ? !1 : !0
    }

    function fk(a) {
        if (a.g) return a.g;
        a.g = Ed(a.h, "__tcfapiLocator");
        return a.g
    }

    function gk(a) {
        return "function" === typeof a.h.__tcfapi || null != fk(a)
    }

    function hk(a, b, c, d) {
        c || (c = () => {
        });
        if ("function" === typeof a.h.__tcfapi) a = a.h.__tcfapi, a(b, 2, c, d); else if (fk(a)) {
            ik(a);
            const e = ++a.H;
            a.C[e] = c;
            a.g && a.g.postMessage({__tcfapiCall: {command: b, version: 2, callId: e, parameter: d}}, "*")
        } else c({}, !1)
    }

    function ik(a) {
        a.j || (a.j = b => {
            try {
                var c = ("string" === typeof b.data ? JSON.parse(b.data) : b.data).__tcfapiReturn;
                a.C[c.callId](c.returnValue, c.success)
            } catch (d) {
            }
        }, Tc(a.h, "message", a.j))
    }

    class jk extends ak {
        constructor(a) {
            var b = {};
            super();
            this.h = a;
            this.g = null;
            this.C = {};
            this.H = 0;
            this.D = b.timeoutMs ?? 500;
            this.B = b.hc ?? !1;
            this.j = null
        }

        addEventListener(a) {
            let b = {internalBlockOnErrors: this.B};
            const c = Sc(() => a(b));
            let d = 0;
            -1 !== this.D && (d = setTimeout(() => {
                b.tcString = "tcunavailable";
                b.internalErrorState = 1;
                c()
            }, this.D));
            const e = (f, g) => {
                clearTimeout(d);
                f ? (b = f, b.internalErrorState = dk(b), b.internalBlockOnErrors = this.B, g && 0 === b.internalErrorState || (b.tcString = "tcunavailable", g || (b.internalErrorState = 3))) : (b.tcString = "tcunavailable", b.internalErrorState = 3);
                a(b)
            };
            try {
                hk(this, "addEventListener", e)
            } catch (f) {
                b.tcString = "tcunavailable", b.internalErrorState = 3, d && (clearTimeout(d), d = 0), c()
            }
        }

        removeEventListener(a) {
            a && a.listenerId && hk(this, "removeEventListener", null, a.listenerId)
        }
    };var ok = ({l: a, R: b, timeoutMs: c, ca: d, ia: e = !1, ja: f = !1}) => {
        b = kk({l: a, R: b, ia: e, ja: f});
        null != b.g || "tcunav" != b.h.message ? d(b) : lk(a, c).then(g => g.map(mk)).then(g => g.map(h => nk(a, h))).then(d)
    }, kk = ({l: a, R: b, ia: c = !1, ja: d = !1}) => {
        if (!pk({l: a, R: b, ia: c, ja: d})) return nk(a, Yj(!0));
        b = Qj();
        return (b = Vj(b, 24)) ? nk(a, mk(b)) : Tg(Error("tcunav"))
    };

    function pk({l: a, R: b, ia: c, ja: d}) {
        if (!(d = !d && gk(new jk(a)))) {
            if (c = !c) {
                if (b) {
                    a = Pj(a);
                    if (null != a.g) if ((a = a.getValue()) && null != I(a, 1)) b:switch (a = I(a, 1), a) {
                        case 1:
                            a = !0;
                            break b;
                        default:
                            throw Error("Unhandled AutoGdprFeatureStatus: " + a);
                    } else a = !1; else W.J(806, a.h, void 0, void 0), a = !1;
                    b = !a
                }
                c = b
            }
            d = c
        }
        return d ? !0 : !1
    }

    function lk(a, b) {
        return Promise.race([qk(), rk(a, b)])
    }

    function qk() {
        return (new Promise(a => {
            var b = Qj();
            a = {resolve: a};
            const c = Vj(b, 25, []);
            c.push(a);
            Wj(b, 25, c)
        })).then(sk)
    }

    function rk(a, b) {
        return new Promise(c => {
            a.setTimeout(c, b, Tg(Error("tcto")))
        })
    }

    function sk(a) {
        return a ? Rg(a) : Tg(Error("tcnull"))
    }

    function mk(a) {
        var b = {};
        if (ek(a)) if (!1 === a.gdprApplies) a = !0; else if ("tcunavailable" === a.tcString || void 0 === a.gdprApplies && !b.ic || "string" !== typeof a.tcString || !a.tcString.length) a = !b.jc; else {
            b:{
                if (a.publisher && a.publisher.restrictions && (b = a.publisher.restrictions["1"], void 0 !== b)) {
                    b = b["755"];
                    break b
                }
                b = void 0
            }
            0 === b ? a = !1 : a.purpose && a.vendor ? (b = a.vendor.consents, (b = !(!b || !b["755"])) && a.purposeOneTreatment && "CH" === a.publisherCC ? a = !0 : (b && (a = a.purpose.consents, b = !(!a || !a["1"])), a = b)) : a = !0
        } else a = !1;
        return Yj(a)
    }

    function nk(a, b) {
        return (a = Wd(b, a)) ? Rg(a) : Tg(Error("unav"))
    };var tk = class extends N {
    };
    tk.u = [1, 2, 3];
    var uk = class extends N {
    };
    uk.u = [1, 2, 3];
    var vk = class extends N {
        g() {
            return E(this, tk, 2)
        }

        h() {
            return E(this, uk, 3)
        }
    };
    const wk = class {
        constructor(a) {
            this.exception = a
        }
    };

    function xk(a, b) {
        try {
            var c = a.h, d = c.resolve, e = a.g;
            ej(e.g);
            F(e.i, mh, 1);
            d.call(c, new wk(b))
        } catch (f) {
            a = a.h, b = f, Jg(a), a.g = 2, a.i = b, Lg(a.h)
        }
    }

    var yk = class {
        constructor(a, b, c) {
            this.i = a;
            this.g = b;
            this.h = c
        }

        start() {
            this.j()
        }

        j() {
            try {
                switch (this.i.document.readyState) {
                    case "complete":
                    case "interactive":
                        Ij(this.g, !0);
                        xk(this);
                        break;
                    default:
                        Ij(this.g, !1) ? xk(this) : this.i.setTimeout(la(this.j, this), 100)
                }
            } catch (a) {
                xk(this, a)
            }
        }
    };
    var zk = class extends N {
        constructor() {
            super()
        }

        getVersion() {
            return xc(G(this, 2))
        }
    };
    zk.u = [3];

    function Ak(a) {
        return Sa(0 !== a.length % 4 ? a + "A" : a).map(b => b.toString(2).padStart(8, "0")).join("")
    }

    function Bk(a) {
        if (!/^[0-1]+$/.test(a)) throw Error(`Invalid input [${a}] not a bit string.`);
        return parseInt(a, 2)
    }

    function Ck(a) {
        if (!/^[0-1]+$/.test(a)) throw Error(`Invalid input [${a}] not a bit string.`);
        const b = [1, 2, 3, 5];
        let c = 0;
        for (let d = 0; d < a.length - 1; d++) b.length <= d && b.push(b[d - 1] + b[d - 2]), c += parseInt(a[d], 2) * b[d];
        return c
    };

    function Dk(a) {
        var b = Ak(a), c = Bk(b.slice(0, 6));
        a = Bk(b.slice(6, 12));
        var d = new zk;
        c = D(d, 1, Fb(c), 0);
        a = D(c, 2, Fb(a), 0);
        b = b.slice(12);
        c = Bk(b.slice(0, 12));
        d = [];
        let e = b.slice(12).replace(/0+$/, "");
        for (let k = 0; k < c; k++) {
            if (0 === e.length) throw Error(`Found ${k} of ${c} sections [${d}] but reached end of input [${b}]`);
            var f = 0 === Bk(e[0]);
            e = e.slice(1);
            var g = Ek(e, b), h = 0 === d.length ? 0 : d[d.length - 1];
            h = Ck(g) + h;
            e = e.slice(g.length);
            if (f) d.push(h); else {
                f = Ek(e, b);
                g = Ck(f);
                for (let m = 0; m <= g; m++) d.push(h + m);
                e = e.slice(f.length)
            }
        }
        if (0 < e.length) throw Error(`Found ${c} sections [${d}] but has remaining input [${e}], entire input [${b}]`);
        return mc(a, 3, d, Eb)
    }

    function Ek(a, b) {
        const c = a.indexOf("11");
        if (-1 === c) throw Error(`Expected section bitstring but not found in [${a}] part of [${b}]`);
        return a.slice(0, c + 2)
    };var Fk = "a".charCodeAt(), Gk = Zc(Hg), Hk = Zc(Ig);

    function Ik() {
        var a = new Jk;
        return Bc(a, 1, 0)
    }

    function Kk(a) {
        const b = yc(a, 1);
        a = xc(G(a, 2));
        return new Date(1E3 * b + a / 1E6)
    }

    var Jk = class extends N {
    };

    function Lk(a, b) {
        if (a.g + b > a.h.length) throw Error("Requested length " + b + " is past end of string.");
        const c = a.h.substring(a.g, a.g + b);
        a.g += b;
        return parseInt(c, 2)
    }

    function Mk(a) {
        let b = Lk(a, 12);
        const c = [];
        for (; b--;) {
            var d = !0 === !!Lk(a, 1), e = Lk(a, 16);
            if (d) for (d = Lk(a, 16); e <= d; e++) c.push(e); else c.push(e)
        }
        c.sort((f, g) => f - g);
        return c
    }

    function Nk(a, b, c) {
        const d = [];
        for (let e = 0; e < b; e++) if (Lk(a, 1)) {
            const f = e + 1;
            if (c && -1 === c.indexOf(f)) throw Error(`ID: ${f} is outside of allowed values!`);
            d.push(f)
        }
        return d
    }

    function Ok(a) {
        const b = Lk(a, 16);
        return !0 === !!Lk(a, 1) ? (a = Mk(a), a.forEach(c => {
            if (c > b) throw Error(`ID ${c} is past MaxVendorId ${b}!`);
        }), a) : Nk(a, b)
    }

    class Pk {
        constructor(a) {
            if (/[^01]/.test(a)) throw Error(`Input bitstring ${a} is malformed!`);
            this.h = a;
            this.g = 0
        }

        skip(a) {
            this.g += a
        }
    };var Rk = (a, b) => {
        try {
            var c = Sa(a.split(".")[0]).map(e => e.toString(2).padStart(8, "0")).join("");
            const d = new Pk(c);
            c = {};
            c.tcString = a;
            c.gdprApplies = !0;
            d.skip(78);
            c.cmpId = Lk(d, 12);
            c.cmpVersion = Lk(d, 12);
            d.skip(30);
            c.tcfPolicyVersion = Lk(d, 6);
            c.isServiceSpecific = !!Lk(d, 1);
            c.useNonStandardStacks = !!Lk(d, 1);
            c.specialFeatureOptins = Qk(Nk(d, 12, Hk), Hk);
            c.purpose = {consents: Qk(Nk(d, 24, Gk), Gk), legitimateInterests: Qk(Nk(d, 24, Gk), Gk)};
            c.purposeOneTreatment = !!Lk(d, 1);
            c.publisherCC = String.fromCharCode(Fk + Lk(d, 6)) + String.fromCharCode(Fk + Lk(d, 6));
            c.vendor = {consents: Qk(Ok(d), b), legitimateInterests: Qk(Ok(d), b)};
            return c
        } catch (d) {
            return null
        }
    };
    const Qk = (a, b) => {
        const c = {};
        if (Array.isArray(b) && 0 !== b.length) for (const d of b) c[d] = -1 !== a.indexOf(d); else for (const d of a) c[d] = !0;
        delete c[0];
        return c
    };
    var Sk = class extends N {
        g() {
            return null != H(this, 2)
        }
    };
    var Tk = class extends N {
        g() {
            return null != H(this, 2)
        }
    };
    var Uk = class extends N {
    };
    var Vk = class extends N {
    }, Wk = Jc(Vk);
    Vk.u = [7];

    function Xk(a) {
        a = Yk(a);
        try {
            var b = a ? Wk(a) : null
        } catch (c) {
            b = null
        }
        return b ? E(b, Uk, 4) || null : null
    }

    function Yk(a) {
        a = (new Vd(a)).get("FCCDCF", "");
        if (a) if (a.startsWith("%")) try {
            var b = decodeURIComponent(a)
        } catch (c) {
            b = null
        } else b = a; else b = null;
        return b
    };

    function Zk(a) {
        a.__uspapiPostMessageReady || $k(new al(a))
    }

    function $k(a) {
        a.g = b => {
            const c = "string" === typeof b.data;
            let d;
            try {
                d = c ? JSON.parse(b.data) : b.data
            } catch (f) {
                return
            }
            const e = d.__uspapiCall;
            e && "getUSPData" === e.command && a.l.__uspapi(e.command, e.version, (f, g) => {
                const h = {};
                h.__uspapiReturn = {returnValue: f, success: g, callId: e.callId};
                f = c ? JSON.stringify(h) : h;
                b.source && "function" === typeof b.source.postMessage && b.source.postMessage(f, b.origin);
                return f
            })
        };
        a.l.addEventListener("message", a.g);
        a.l.__uspapiPostMessageReady = !0
    }

    var al = class {
        constructor(a) {
            this.l = a;
            this.g = null
        }
    };
    Zc(Hg).map(a => Number(a));
    Zc(Ig).map(a => Number(a));

    function bl(a) {
        a.__tcfapiPostMessageReady || cl(new dl(a))
    }

    function cl(a) {
        a.h = b => {
            const c = "string" == typeof b.data;
            let d;
            try {
                d = c ? JSON.parse(b.data) : b.data
            } catch (f) {
                return
            }
            const e = d.__tcfapiCall;
            !e || "ping" !== e.command && "getTCData" !== e.command && "addEventListener" !== e.command && "removeEventListener" !== e.command || a.g.__tcfapi(e.command, e.version, (f, g) => {
                const h = {};
                h.__tcfapiReturn = "removeEventListener" === e.command ? {
                    success: f,
                    callId: e.callId
                } : {returnValue: f, success: g, callId: e.callId};
                f = c ? JSON.stringify(h) : h;
                b.source && "function" === typeof b.source.postMessage && b.source.postMessage(f, b.origin);
                return f
            }, e.parameter)
        };
        a.g.addEventListener("message", a.h);
        a.g.__tcfapiPostMessageReady = !0
    }

    var dl = class {
        constructor(a) {
            this.g = a;
            this.h = null
        }
    };
    var el = class extends N {
    };
    var fl = class extends N {
        g() {
            return null != H(this, 1)
        }
    }, gl = Jc(fl);
    fl.u = [2];

    function hl(a, b, c) {
        function d(l) {
            if (10 > l.length) return null;
            var n = g(l.slice(0, 4));
            n = h(n);
            l = g(l.slice(6, 10));
            l = k(l);
            return "1" + n + l + "N"
        }

        function e(l) {
            if (10 > l.length) return null;
            var n = g(l.slice(0, 6));
            n = h(n);
            l = g(l.slice(6, 10));
            l = k(l);
            return "1" + n + l + "N"
        }

        function f(l) {
            if (12 > l.length) return null;
            var n = g(l.slice(0, 6));
            n = h(n);
            l = g(l.slice(8, 12));
            l = k(l);
            return "1" + n + l + "N"
        }

        function g(l) {
            const n = [];
            let v = 0;
            for (let t = 0; t < l.length / 2; t++) n.push(Bk(l.slice(v, v + 2))), v += 2;
            return n
        }

        function h(l) {
            return l.every(n => 1 === n) ? "Y" : "N"
        }

        function k(l) {
            return l.some(n => 1 === n) ? "Y" : "N"
        }

        if (0 === a.length) return null;
        a = a.split(".");
        if (2 < a.length) return null;
        a = Ak(a[0]);
        const m = Bk(a.slice(0, 6));
        a = a.slice(6);
        if (1 !== m) return null;
        switch (b) {
            case 8:
                return d(a);
            case 10:
            case 12:
            case 9:
                return e(a);
            case 11:
                return c ? f(a) : null;
            default:
                return null
        }
    };var il = (a, b) => {
        const c = a.document, d = () => {
            if (!a.frames[b]) if (c.body) {
                const e = wd("IFRAME", c);
                e.style.display = "none";
                e.style.width = "0px";
                e.style.height = "0px";
                e.style.border = "none";
                e.style.zIndex = "-1000";
                e.style.left = "-1000px";
                e.style.top = "-1000px";
                e.name = b;
                c.body.appendChild(e)
            } else a.setTimeout(d, 5)
        };
        d()
    };

    function jl() {
        var a = Q(rh), b = Q(sh);
        S !== S.top || S.__uspapi || S.frames.__uspapiLocator || (a = new kl(a, b), ll(a), ml(a))
    }

    function ll(a) {
        !a.s || a.g.__uspapi || a.g.frames.__uspapiLocator || (a.g.__uspapiManager = "fc", il(a.g, "__uspapiLocator"), na("__uspapi", (...b) => nl(a, ...b), a.g), Zk(a.g))
    }

    function ml(a) {
        !a.i || a.g.__tcfapi || a.g.frames.__tcfapiLocator || (a.g.__tcfapiManager = "fc", il(a.g, "__tcfapiLocator"), a.g.__tcfapiEventListeners = a.g.__tcfapiEventListeners || [], na("__tcfapi", (...b) => ol(a, ...b), a.g), bl(a.g))
    }

    function nl(a, b, c, d) {
        "function" === typeof d && "getUSPData" === b && d({version: 1, uspString: a.s}, !0)
    }

    function pl(a, b) {
        if (!b?.g() || 0 === L(b, 1).length || 0 == F(b, el, 2).length) return null;
        const c = L(b, 1);
        let d;
        try {
            var e = Dk(c.split("~")[0]);
            d = c.includes("~") ? c.split("~").slice(1) : []
        } catch (f) {
            return null
        }
        b = F(b, el, 2).reduce((f, g) => yc(ql(f), 1) > yc(ql(g), 1) ? f : g);
        e = hc(e, 3, Gb).indexOf(xc(G(b, 1)));
        return -1 === e || e >= d.length ? null : {uspString: hl(d[e], xc(G(b, 1)), a.B), xa: Kk(ql(b))}
    }

    function rl(a) {
        a = a.find(b => 13 === M(b, 1));
        if (a?.g()) try {
            return gl(L(a, 2))
        } catch (b) {
        }
        return null
    }

    function ql(a) {
        return ec(a, Jk, 2) ? E(a, Jk, 2) : Ik()
    }

    function ol(a, b, c, d, e = null) {
        if ("function" === typeof d) {
            var f = a.h ? 2.2 : 2.1;
            if (c && (c > f || 1 >= c)) d(null, !1); else switch (c = a.g.__tcfapiEventListeners, b) {
                case "getTCData":
                    a.h || e && (!Array.isArray(e) || !e.every(g => "number" === typeof g)) ? d(null, !1) : d(sl(a, e, null), !0);
                    break;
                case "ping":
                    d({
                        gdprApplies: !0,
                        cmpLoaded: !0,
                        cmpStatus: "loaded",
                        displayStatus: "disabled",
                        apiVersion: a.h ? "2.2" : "2.1",
                        cmpVersion: 2,
                        cmpId: 300
                    });
                    break;
                case "addEventListener":
                    b = c.push(d);
                    d(sl(a, null, b - 1), !0);
                    break;
                case "removeEventListener":
                    c[e] ? (c[e] = null, d(!0)) : d(!1);
                    break;
                case "getInAppTCData":
                case "getVendorList":
                    d(null, !1)
            }
        }
    }

    function sl(a, b, c) {
        if (!a.i) return null;
        b = Rk(a.i, b);
        b.addtlConsent = null != a.j ? a.j : void 0;
        b.cmpStatus = "loaded";
        b.eventStatus = "tcloaded";
        null != c && (b.listenerId = c);
        return b
    }

    class kl {
        constructor(a, b) {
            var c = S;
            this.g = c;
            this.B = a;
            this.h = b;
            a = Yk(this.g.document);
            try {
                var d = a ? Wk(a) : null
            } catch (e) {
                d = null
            }
            (a = d) ? (d = E(a, Tk, 5) || null, a = F(a, Sk, 7), a = rl(a ?? []), d = {Va: d, Ya: a}) : d = {
                Va: null,
                Ya: null
            };
            a = d;
            d = pl(this, a.Ya);
            a = a.Va;
            a?.g() && 0 !== L(a, 2).length ? (b = ec(a, Jk, 1) ? E(a, Jk, 1) : Ik(), a = {
                uspString: L(a, 2),
                xa: Kk(b)
            }) : a = null;
            this.s = a && d ? d.xa > a.xa ? d.uspString : a.uspString : a ? a.uspString : d ? d.uspString : null;
            this.i = (d = Xk(c.document)) && null != H(d, 1) ? L(d, 1) : null;
            this.j = (c = Xk(c.document)) && null != H(c, 2) ? L(c, 2) : null
        }
    };const tl = {google_ad_channel: !0, google_ad_host: !0};

    function ul(a, b) {
        a.location.href && a.location.href.substring && (b.url = a.location.href.substring(0, 200));
        sj("ama", b, .01)
    }

    function vl(a) {
        const b = {};
        zd(tl, (c, d) => {
            d in a && (b[d] = a[d])
        });
        return b
    };

    function wl(a) {
        const b = /[a-zA-Z0-9._~-]/, c = /%[89a-zA-Z]./;
        return a.replace(/(%[a-zA-Z0-9]{2})/g, d => {
            if (!d.match(c)) {
                const e = decodeURIComponent(d);
                if (e.match(b)) return e
            }
            return d.toUpperCase()
        })
    }

    function xl(a) {
        let b = "";
        const c = /[/%?&=]/;
        for (let d = 0; d < a.length; ++d) {
            const e = a[d];
            b = e.match(c) ? b + e : b + encodeURIComponent(e)
        }
        return b
    };

    function yl(a) {
        a = hc(a, 2, Db);
        if (!a) return !1;
        for (let b = 0; b < a.length; b++) if (1 == a[b]) return !0;
        return !1
    }

    function zl(a, b) {
        a = xl(wl(a.location.pathname)).replace(/(^\/)|(\/$)/g, "");
        const c = Ad(a), d = Al(a);
        return b.find(e => {
            if (ec(e, Ei, 7)) {
                var f = E(e, Ei, 7);
                f = Hb(cc(f, 1))
            } else f = Hb(cc(e, 1));
            e = ec(e, Ei, 7) ? I(E(e, Ei, 7), 2) : 2;
            if ("number" !== typeof f) return !1;
            switch (e) {
                case 1:
                    return f == c;
                case 2:
                    return d[f] || !1
            }
            return !1
        }) || null
    }

    function Al(a) {
        const b = {};
        for (; ;) {
            b[Ad(a)] = !0;
            if (!a) return b;
            a = a.substring(0, a.lastIndexOf("/"))
        }
    };var Bl = a => {
        a = E(a, Di, 3);
        return !a || wc(a, 1) <= Date.now() ? !1 : !0
    };

    function Cl(a) {
        if (Q(xh)) var b = null; else try {
            b = a.getItem("google_ama_config")
        } catch (d) {
            b = null
        }
        try {
            var c = b ? Qi(b) : null
        } catch (d) {
            c = null
        }
        return c
    };var Dl = class extends N {
        g() {
            return E(this, vk, 2)
        }

        h() {
            return J(this, 3)
        }
    };
    var El = class extends N {
        g() {
            return hc(this, 1, Nb)
        }

        h() {
            return E(this, Dl, 2)
        }
    };
    El.u = [1];
    var Fl = class extends N {
        getId() {
            return xc(G(this, 1))
        }
    };
    Fl.u = [2];
    var Gl = class extends N {
    };
    Gl.u = [2];
    var Hl = class extends N {
    };
    Hl.u = [2];
    var Il = class extends N {
        g() {
            return yc(this, 2)
        }

        h() {
            return yc(this, 4)
        }

        i() {
            return J(this, 3)
        }
    };
    var Jl = class extends N {
    };
    Jl.u = [1, 4, 2, 3];
    var Ll = class extends N {
        h() {
            return Ac(this, Dl, 13, Kl)
        }

        j() {
            return void 0 !== fc(this, Dl, pc(this, Kl, 13))
        }

        g() {
            return Ac(this, El, 14, Kl)
        }

        i() {
            return void 0 !== fc(this, El, pc(this, Kl, 14))
        }
    };
    Ll.u = [19];
    var Kl = [13, 14];
    let Ml = void 0;

    function Nl(a) {
        Gc(Ml, Ge);
        Ml = a
    };

    function X(a) {
        return a.google_ad_modifications = a.google_ad_modifications || {}
    }

    function Ol(a) {
        a = X(a);
        const b = a.space_collapsing || "none";
        return a.remove_ads_by_default ? {Sa: !0, Jb: b, ua: a.ablation_viewport_offset} : null
    }

    function Pl(a, b) {
        a = X(a);
        a.had_ads_ablation = !0;
        a.remove_ads_by_default = !0;
        a.space_collapsing = "slot";
        a.ablation_viewport_offset = b
    }

    function Ql(a) {
        X(S).allow_second_reactive_tag = a
    }

    function Rl() {
        const a = X(window);
        a.afg_slotcar_vars || (a.afg_slotcar_vars = {});
        return a.afg_slotcar_vars
    };

    function Sl(a) {
        return X(a)?.head_tag_slot_vars?.google_ad_host ?? Tl(a)
    }

    function Tl(a) {
        return a.document?.querySelector('meta[name="google-adsense-platform-account"]')?.getAttribute("content") ?? null
    };const Ul = [2, 7, 1];
    var Xl = (a, b, c = "", d = null) => 1 === b && Vl(c, d) ? !0 : Wl(a, c, e => La(F(e, Kc, 2), f => I(f, 1) === b)),
        Vl = (a, b) => b ? b.j() ? J(b.h(), 1) : b.i() && "" !== a && 1 === b.g().g().length && b.g().g()[0] === a ? J(b.g().h(), 1) : !1 : !1,
        Yl = (a, b) => {
            b = xc(G(b, 18));
            -1 !== b && (a.tmod = b)
        }, $l = a => {
            const b = ud(S) || S;
            return Zl(b, a) ? !0 : Wl(S, "", c => La(hc(c, 3, Db), d => d === a))
        };

    function Zl(a, b) {
        a = (a = (a = a.location && a.location.hash) && a.match(/forced_clientside_labs=([\d,]+)/)) && a[1];
        return !!a && Na(a.split(","), b.toString())
    }

    function Wl(a, b, c) {
        a = ud(a) || a;
        const d = am(a);
        b && (b = fe(String(b)));
        return Yc(d, (e, f) => Object.prototype.hasOwnProperty.call(d, f) && (!b || b === f) && c(e))
    }

    function am(a) {
        a = bm(a);
        const b = {};
        zd(a, (c, d) => {
            try {
                const e = new Lc(c);
                b[d] = e
            } catch (e) {
            }
        });
        return b
    }

    var bm = a => {
        Gc(Ml, Ic);
        a = kk({l: a, R: Ml});
        return null != a.g ? cm(a.getValue()) : {}
    };

    function cm(a) {
        try {
            const b = a.getItem("google_adsense_settings");
            if (!b) return {};
            const c = JSON.parse(b);
            return c !== Object(c) ? {} : Xc(c, (d, e) => Object.prototype.hasOwnProperty.call(c, e) && "string" === typeof e && Array.isArray(d))
        } catch (b) {
            return {}
        }
    }

    function dm(a) {
        sj("atf_ad_settings_from_ppabg", {p_s: a}, .01)
    }

    const em = a => {
        sj("overlay_settings_from_ppabg", {p_s: a}, .01)
    }, fm = (a, b) => {
        if (Sl(p)) return Ul;
        if (b?.j()) {
            var c = L(b.h(), 9);
            b = b?.h()?.g()?.h();
            if (!a || c != a || !b) return Ul;
            em(!1);
            return hc(b, 3, Db)
        }
        if (b?.i()) {
            c = b?.g()?.g();
            if (!c || 1 !== c.length || !a || c[0] !== a || L(b, 17) != p.location.host) return Ul;
            a = b?.g()?.h()?.g()?.h();
            if (!a) return Ul;
            em(!0);
            return hc(a, 3, Db)
        }
        return Ul
    };
    var gm = (a, b) => {
        const c = [];
        a = fm(a, b);
        a.includes(1) || c.push(1);
        a.includes(2) || c.push(2);
        a.includes(7) || c.push(7);
        return c
    };

    function hm(a, b, c, d) {
        im(new jm(a, b, c, d))
    }

    function im(a) {
        Xg(Wg(kk({l: a.l, R: J(a.g, 6)}), b => {
            km(a, b, !0)
        }), () => {
            lm(a)
        })
    }

    function km(a, b, c) {
        Xg(Wg(mm(b), d => {
            nm("ok");
            a.h(d, {fromLocalStorage: !0})
        }), () => {
            var d = a.l;
            try {
                b.removeItem("google_ama_config")
            } catch (e) {
                ul(d, {lserr: 1})
            }
            c ? lm(a) : a.h(null, null)
        })
    }

    function lm(a) {
        Xg(Wg(om(a), b => {
            a.h(b, {fromPABGSettings: !0})
        }), () => {
            pm(a)
        })
    }

    function mm(a) {
        return (a = (a = Cl(a)) ? Bl(a) ? a : null : null) ? Rg(a) : Tg(Error("invlocst"))
    }

    function om(a) {
        if (Sl(a.l) && !J(a.g, 22)) return Tg(Error("invtag"));
        a:{
            var b = a.l;
            var c = a.i;
            a = a.g;
            if (a?.j()) (b = a?.h()?.g()?.g()) && (0 < F(b, mh, 1).length || Q(yh) && 0 < F(b, nh, 3).length) ? dm(!1) : b = null; else {
                if (a?.i()) {
                    const d = a?.g()?.g(), e = a?.g()?.h()?.g()?.g();
                    if (d && 1 === d.length && d[0] === c && e && (0 < F(e, mh, 1).length || Q(yh) && 0 < F(e, nh, 3).length) && L(a, 17) === b.location.host) {
                        dm(!0);
                        b = e;
                        break a
                    }
                }
                b = null
            }
        }
        b ? (c = new Pi, a = F(b, mh, 1), c = vc(c, 1, a), a = F(b, Ki, 2), c = vc(c, 7, a), Q(yh) && 0 < F(b, nh, 3).length && (a = new oh, b = F(b, nh, 3), b = vc(a, 1, b), tc(c, 6, b)), b = Rg(c)) : b = Tg(Error("invtag"));
        return b
    }

    function pm(a) {
        ok({
            l: a.l, R: J(a.g, 6), timeoutMs: 50, ca: b => {
                qm(a, b)
            }
        })
    }

    function qm(a, b) {
        Xg(Wg(b, c => {
            km(a, c, !1)
        }), c => {
            nm(c.message);
            a.h(null, null)
        })
    }

    function nm(a) {
        sj("abg::amalserr", {status: a, guarding: "true", timeout: 50, rate: .01}, .01)
    }

    class jm {
        constructor(a, b, c, d) {
            this.l = a;
            this.g = b;
            this.i = c;
            this.h = d
        }
    };var tm = (a, b, c, d) => {
        try {
            const e = zl(a, F(c, Ki, 7));
            if (e && yl(e)) {
                H(e, 4) && (d = eh(d, new fh(null, {google_package: H(e, 4)})));
                const f = new Nj(a, b, c, e, d);
                $i(1E3, () => {
                    var g = new Mg;
                    (new yk(a, f, g)).start();
                    return g.h
                }, a).then(ma(rm, a), ma(sm, a))
            }
        } catch (e) {
            ul(a, {atf: -1})
        }
    };
    const rm = a => {
        ul(a, {atf: 1})
    }, sm = (a, b) => {
        (a.google_ama_state = a.google_ama_state || {}).exception = b;
        ul(a, {atf: 0})
    };

    function um(a) {
        a.easpi = Q(Rh);
        a.asla = .4;
        a.asaa = -1;
        Q(Oh) || (a.sedf = !1);
        a.asro = Q(Ph);
        Q(Mh) || (a.sefa = !0);
        Q(Qh) && (a.sugawps = !0);
        const b = P(Vc).h(Ih.g, Ih.defaultValue);
        b.length && (a.seiel = b.join("~"));
        Q(Nh) || (a.slcwct = Wc(Kh), a.sacwct = Wc(Gh));
        Q(Jh) && (a.slmct = Wc(Lh), a.samct = Wc(Hh))
    };

    function vm(a, b) {
        if (!a) return !1;
        a = a.hash;
        if (!a || !a.indexOf) return !1;
        if (-1 != a.indexOf(b)) return !0;
        b = wm(b);
        return "go" != b && -1 != a.indexOf(b) ? !0 : !1
    }

    function wm(a) {
        let b = "";
        zd(a.split("_"), c => {
            b += c.substr(0, 2)
        });
        return b
    };Qa || Da();

    class xm {
        constructor() {
            this.promise = new Promise(a => {
                this.resolve = a
            })
        }
    };

    function ym() {
        const {promise: a, resolve: b} = new xm;
        return {promise: a, resolve: b}
    };

    function zm(a, b, c = () => {
    }) {
        b.google_llp || (b.google_llp = {});
        b = b.google_llp;
        let d = b[a];
        if (d) return d;
        d = ym();
        b[a] = d;
        c();
        return d
    }

    function Am(a, b, c) {
        return zm(a, b, () => {
            vd(b.document, c)
        }).promise
    };

    function Bm() {
        const a = {};
        P(Vc).g(uh.g, uh.defaultValue) && (a.bust = P(Vc).g(uh.g, uh.defaultValue));
        var b = Qj();
        b = Vj(b, 38, "");
        "" !== b && (a.sbust = b);
        return a
    }

    const Cm = new Map([[2, 7], [3, 1], [4, 3], [5, 12]]);

    function Dm(a, b, c) {
        c = cd(c, Bm());
        if (1 === a) return {
            uc: vd(b.document, c), Ta: new Promise(() => {
            })
        };
        if (Cm.has(a)) return {Ta: Am(Cm.get(a), b, c)};
        throw Error(`Unexpected chunkId: ${a}`);
    };

    function Em(a) {
        a.google_reactive_ads_global_state ? (null == a.google_reactive_ads_global_state.sideRailProcessedFixedElements && (a.google_reactive_ads_global_state.sideRailProcessedFixedElements = new Set), null == a.google_reactive_ads_global_state.sideRailAvailableSpace && (a.google_reactive_ads_global_state.sideRailAvailableSpace = new Map), null == a.google_reactive_ads_global_state.sideRailPlasParam && (a.google_reactive_ads_global_state.sideRailPlasParam = new Map)) : a.google_reactive_ads_global_state = new Fm;
        return a.google_reactive_ads_global_state
    }

    class Fm {
        constructor() {
            this.wasPlaTagProcessed = !1;
            this.wasReactiveAdConfigReceived = {};
            this.adCount = {};
            this.wasReactiveAdVisible = {};
            this.stateForType = {};
            this.reactiveTypeEnabledInAsfe = {};
            this.wasReactiveTagRequestSent = !1;
            this.reactiveTypeDisabledByPublisher = {};
            this.tagSpecificState = {};
            this.messageValidationEnabled = !1;
            this.floatingAdsStacking = new Gm;
            this.sideRailProcessedFixedElements = new Set;
            this.sideRailAvailableSpace = new Map;
            this.sideRailPlasParam = new Map
        }
    }

    var Gm = class {
        constructor() {
            this.maxZIndexRestrictions = {};
            this.nextRestrictionId = 0;
            this.maxZIndexListeners = []
        }
    };
    var Hm = a => {
        if (p.google_apltlad) return null;
        var b = Q(Dh) && 1 === (p.top == p ? 0 : td(p.top) ? 1 : 2);
        if (p !== p.top && !b || !a.google_ad_client) return null;
        p.google_apltlad = !0;
        b = {enable_page_level_ads: {pltais: !0}, google_ad_client: a.google_ad_client};
        const c = b.enable_page_level_ads;
        zd(a, (d, e) => {
            xi[e] && "google_ad_client" !== e && (c[e] = d)
        });
        c.google_pgb_reactive = 7;
        um(c);
        if ("google_ad_section" in a || "google_ad_region" in a) c.google_ad_section = a.google_ad_section || a.google_ad_region;
        return b
    };

    function Im(a, b) {
        X(S).ama_ran_on_page || $i(1001, () => {
            Jm(new Km(a, b))
        }, p)
    }

    function Jm(a) {
        hm(a.l, a.h, a.g.google_ad_client || "", (b, c) => {
            var d = a.l, e = a.g;
            X(S).ama_ran_on_page || b && Lm(d, e, b, c)
        })
    }

    class Km {
        constructor(a, b) {
            this.l = p;
            this.g = a;
            this.h = b
        }
    }

    function Lm(a, b, c, d) {
        d && (ej(a).configSourceInAbg = d);
        ec(c, Oi, 24) && (d = fj(a), d.availableAbg = !0, d.ablationFromStorage = !!E(c, Oi, 24)?.g()?.g());
        if (da(b.enable_page_level_ads) && 7 === b.enable_page_level_ads.google_pgb_reactive) {
            if (!zl(a, F(c, Ki, 7))) {
                sj("amaait", {value: "true"});
                return
            }
            sj("amaait", {value: "false"})
        }
        X(S).ama_ran_on_page = !0;
        E(c, Ci, 15)?.g() && (X(a).enable_overlap_observer = !0);
        var e = E(c, Bi, 13);
        e && 1 === I(e, 1) ? (d = 0, (e = E(e, Ai, 6)) && G(e, 3) && (d = G(e, 3) || 0), Pl(a, d)) : E(c, Oi, 24)?.g()?.g() && (fj(a).ablatingThisPageview = !0, Pl(a, 1));
        $d(3, [c.toJSON()]);
        const f = b.google_ad_client || "";
        b = vl(da(b.enable_page_level_ads) ? b.enable_page_level_ads : {});
        const g = eh(ih, new fh(null, b));
        rj(782, () => {
            tm(a, f, c, g)
        })
    };

    function Mm(a, b) {
        a = a.document;
        for (var c = void 0, d = 0; !c || a.getElementById(c + "_host");) c = "aswift_" + d++;
        a = c;
        c = Number(b.google_ad_width || 0);
        b = Number(b.google_ad_height || 0);
        d = document.createElement("div");
        d.id = a + "_host";
        const e = d.style;
        e.border = "none";
        e.height = `${b}px`;
        e.width = `${c}px`;
        e.margin = "0px";
        e.padding = "0px";
        e.position = "relative";
        e.visibility = "visible";
        e.backgroundColor = "transparent";
        e.display = "inline-block";
        return {tb: a, Lb: d}
    };

    function Nm({va: a, Ca: b}) {
        return a || ("dev" === b ? "dev" : "")
    };var Om = {
            google_analytics_domain_name: !0,
            google_analytics_uacct: !0,
            google_pause_ad_requests: !0,
            google_user_agent_client_hint: !0
        },
        Pm = a => (a = a.innerText || a.innerHTML) && (a = a.replace(/^\s+/, "").split(/\r?\n/, 1)[0].match(/^\x3c!--+(.*?)(?:--+>)?\s*$/)) && RegExp("google_ad_client").test(a[1]) ? a[1] : null,
        Qm = a => {
            if (a = a.innerText || a.innerHTML) if (a = a.replace(/^\s+|\s+$/g, "").replace(/\s*(\r?\n)+\s*/g, ";"), (a = a.match(/^\x3c!--+(.*?)(?:--+>)?$/) || a.match(/^\/*\s*<!\[CDATA\[(.*?)(?:\/*\s*\]\]>)?$/i)) && RegExp("google_ad_client").test(a[1])) return a[1];
            return null
        }, Rm = a => {
            switch (a) {
                case "true":
                    return !0;
                case "false":
                    return !1;
                case "null":
                    return null;
                case "undefined":
                    break;
                default:
                    try {
                        const b = a.match(/^(?:'(.*)'|"(.*)")$/);
                        if (b) return b[1] || b[2] || "";
                        if (/^[-+]?\d*(\.\d+)?$/.test(a)) {
                            const c = parseFloat(a);
                            return c === c ? c : void 0
                        }
                    } catch (b) {
                    }
            }
        };

    function Sm(a) {
        if (a.google_ad_client) var b = String(a.google_ad_client); else {
            if (null == (b = X(a).head_tag_slot_vars?.google_ad_client ?? a.document.querySelector(".adsbygoogle[data-ad-client]")?.getAttribute("data-ad-client"))) {
                b:{
                    b = a.document.getElementsByTagName("script");
                    a = a.navigator && a.navigator.userAgent || "";
                    a = RegExp("appbankapppuzdradb|daumapps|fban|fbios|fbav|fb_iab|gsa/|messengerforios|naver|niftyappmobile|nonavigation|pinterest|twitter|ucbrowser|yjnewsapp|youtube", "i").test(a) || /i(phone|pad|pod)/i.test(a) && /applewebkit/i.test(a) && !/version|safari/i.test(a) && !ee() ? Pm : Qm;
                    for (var c = b.length - 1; 0 <= c; c--) {
                        var d = b[c];
                        if (!d.google_parsed_script_for_pub_code && (d.google_parsed_script_for_pub_code = !0, d = a(d))) {
                            b = d;
                            break b
                        }
                    }
                    b = null
                }
                if (b) {
                    a = /(google_\w+) *= *(['"]?[\w.-]+['"]?) *(?:;|$)/gm;
                    for (c = {}; d = a.exec(b);) c[d[1]] = Rm(d[2]);
                    b = c;
                    b = b.google_ad_client ? b.google_ad_client : ""
                } else b = ""
            }
            b = b ?? ""
        }
        return b
    };var Tm = {"120x90": !0, "160x90": !0, "180x90": !0, "200x90": !0, "468x15": !0, "728x15": !0};

    function Um(a, b) {
        if (15 == b) {
            if (728 <= a) return 728;
            if (468 <= a) return 468
        } else if (90 == b) {
            if (200 <= a) return 200;
            if (180 <= a) return 180;
            if (160 <= a) return 160;
            if (120 <= a) return 120
        }
        return null
    };var Vm = class extends N {
        constructor() {
            super()
        }

        getVersion() {
            return L(this, 2)
        }
    };

    function Wm(a, b) {
        return y(a, 2, Mb(b))
    }

    function Xm(a, b) {
        return y(a, 3, Mb(b))
    }

    function Ym(a, b) {
        return y(a, 4, Mb(b))
    }

    function Zm(a, b) {
        return y(a, 5, Mb(b))
    }

    function $m(a, b) {
        return y(a, 9, Mb(b))
    }

    function an(a, b) {
        return vc(a, 10, b)
    }

    function bn(a, b) {
        return y(a, 11, zb(b))
    }

    function cn(a, b) {
        return y(a, 1, Mb(b))
    }

    function dn(a, b) {
        return y(a, 7, zb(b))
    }

    var en = class extends N {
        constructor() {
            super()
        }
    };
    en.u = [10, 6];
    const fn = "platform platformVersion architecture model uaFullVersion bitness fullVersionList wow64".split(" ");

    function gn() {
        var a = S;
        if ("function" !== typeof a.navigator?.userAgentData?.getHighEntropyValues) return null;
        const b = a.google_tag_data ?? (a.google_tag_data = {});
        if (b.uach_promise) return b.uach_promise;
        a = a.navigator.userAgentData.getHighEntropyValues(fn).then(c => {
            b.uach ?? (b.uach = c);
            return c
        });
        return b.uach_promise = a
    }

    function hn(a) {
        return bn(an(Zm(Wm(cn(Ym(dn($m(Xm(new en, a.architecture || ""), a.bitness || ""), a.mobile || !1), a.model || ""), a.platform || ""), a.platformVersion || ""), a.uaFullVersion || ""), a.fullVersionList?.map(b => {
            var c = new Vm;
            c = y(c, 1, Mb(b.brand));
            return y(c, 2, Mb(b.version))
        }) || []), a.wow64 || !1)
    }

    function jn() {
        return gn()?.then(a => hn(a)) ?? null
    };

    function kn(a, b) {
        b.google_ad_host || (a = Tl(a)) && (b.google_ad_host = a)
    }

    function ln(a, b, c = "") {
        S.google_sa_queue || (S.google_sa_queue = [], S.google_process_slots = W.oa(215, () => {
            mn(S.google_sa_queue)
        }), a = nn(c, a, b), Dm(1, S, a))
    }

    function mn(a) {
        const b = a.shift();
        "function" === typeof b && W.ea(216, b);
        a.length && p.setTimeout(W.oa(215, () => {
            mn(a)
        }), 0)
    }

    function on(a, b) {
        a.google_sa_queue = a.google_sa_queue || [];
        a.google_sa_impl ? b() : a.google_sa_queue.push(b)
    }

    function nn(a, b, c) {
        var d = S;
        b = J(c, 4) ? b.Fb : b.Gb;
        a:{
            if (J(c, 4)) {
                if (a = a || Sm(d)) {
                    d = Q(Th) ? {client: a, plah: d.location.host, aplac: Q(Th).toString()} : {
                        client: a,
                        plah: d.location.host
                    };
                    break a
                }
                throw Error("PublisherCodeNotFoundForAma");
            }
            d = {}
        }
        return cd(b, d)
    }

    function pn(a) {
        a:{
            var b = [p.top];
            var c = [];
            let e = 0, f;
            for (; f = b[e++];) {
                c.push(f);
                try {
                    if (f.frames) for (let g = 0; g < f.frames.length && 1024 > b.length; ++g) b.push(f.frames[g])
                } catch {
                }
            }
            b = c;
            for (c = 0; c < b.length; c++) try {
                var d = b[c].frames.google_esf;
                if (d) {
                    Ud = d;
                    break a
                }
            } catch (g) {
            }
            Ud = null
        }
        if (Ud) return null;
        d = wd("IFRAME");
        d.id = "google_esf";
        d.name = "google_esf";
        b = a.Ob;
        c = P(Vc).g(Fh.g, Fh.defaultValue);
        "inhead" === c ? b = a.Mb : "nohtml" === c && (b = a.Nb);
        Q(Bh) && (b = cd(b, {hello: "world"}));
        d.src = ed(b).toString();
        d.style.display = "none";
        return d
    }

    function qn(a, b, c, d) {
        const {tb: e, Lb: f} = Mm(a, b);
        c.appendChild(f);
        rn(a, c, b);
        c = b.google_start_time ?? pa;
        const g = (new Date).getTime();
        b.google_lrv = Nm({va: "m202401290101", Ca: L(d, 2)});
        b.google_async_iframe_id = e;
        b.google_start_time = c;
        b.google_bpp = g > c ? g - c : 1;
        a.google_sv_map = a.google_sv_map || {};
        a.google_sv_map[e] = b;
        on(a, () => {
            var h = f;
            if (!h || !h.isConnected) if (h = a.document.getElementById(String(b.google_async_iframe_id) + "_host"), null == h) throw Error("no_div");
            (h = a.google_sa_impl({pubWin: a, vars: b, innerInsElement: h})) && W.Y(911, h)
        })
    }

    function rn(a, b, c) {
        var d = c.google_ad_output, e = c.google_ad_format, f = c.google_ad_width || 0, g = c.google_ad_height || 0;
        e || "html" !== d && null != d || (e = f + "x" + g);
        d = !c.google_ad_slot || c.google_override_format || !Tm[c.google_ad_width + "x" + c.google_ad_height] && "aa" === c.google_loader_used;
        e && d ? e = e.toLowerCase() : e = "";
        c.google_ad_format = e;
        if ("number" !== typeof c.google_reactive_sra_index || !c.google_ad_unit_key) {
            e = [c.google_ad_slot, c.google_orig_ad_format || c.google_ad_format, c.google_ad_type, c.google_orig_ad_width || c.google_ad_width, c.google_orig_ad_height || c.google_ad_height];
            d = [];
            f = 0;
            for (g = b; g && 25 > f; g = g.parentNode, ++f) 9 === g.nodeType ? d.push("") : d.push(g.id);
            (d = d.join()) && e.push(d);
            c.google_ad_unit_key = Ad(e.join(":")).toString();
            e = [];
            for (d = 0; b && 25 > d; ++d) {
                f = (f = 9 !== b.nodeType && b.id) ? "/" + f : "";
                a:{
                    if (b && b.nodeName && b.parentElement) {
                        g = b.nodeName.toString().toLowerCase();
                        const h = b.parentElement.childNodes;
                        let k = 0;
                        for (let m = 0; m < h.length; ++m) {
                            const l = h[m];
                            if (l.nodeName && l.nodeName.toString().toLowerCase() === g) {
                                if (b === l) {
                                    g = "." + k;
                                    break a
                                }
                                ++k
                            }
                        }
                    }
                    g = ""
                }
                e.push((b.nodeName && b.nodeName.toString().toLowerCase()) + f + g);
                b = b.parentElement
            }
            b = e.join() + ":";
            e = [];
            if (a) try {
                let h = a.parent;
                for (d = 0; h && h !== a && 25 > d; ++d) {
                    const k = h.frames;
                    for (f = 0; f < k.length; ++f) if (a === k[f]) {
                        e.push(f);
                        break
                    }
                    a = h;
                    h = a.parent
                }
            } catch (h) {
            }
            c.google_ad_dom_fingerprint = Ad(b + e.join()).toString()
        }
    }

    function sn() {
        var a = ud(p);
        a && (a = Em(a), a.tagSpecificState[1] || (a.tagSpecificState[1] = {debugCard: null, debugCardRequested: !1}))
    }

    function tn() {
        const a = jn();
        null != a && a.then(b => {
            a:{
                ob = !0;
                try {
                    var c = JSON.stringify(b.toJSON(), Rb);
                    break a
                } finally {
                    ob = !1
                }
                c = void 0
            }
            S.google_user_agent_client_hint = c
        });
        Jd()
    };

    function un(a) {
        return b => !!(b.fa & a)
    }

    class Y extends pi {
        constructor(a, b, c, d = !1) {
            super(a, b);
            this.fa = c;
            this.xb = d
        }

        pa() {
            return this.fa
        }

        h(a, b, c) {
            c.style.height = this.height() + "px";
            b.rpe = !0
        }
    };const vn = {
        image_stacked: 1 / 1.91,
        image_sidebyside: 1 / 3.82,
        mobile_banner_image_sidebyside: 1 / 3.82,
        pub_control_image_stacked: 1 / 1.91,
        pub_control_image_sidebyside: 1 / 3.82,
        pub_control_image_card_stacked: 1 / 1.91,
        pub_control_image_card_sidebyside: 1 / 3.74,
        pub_control_text: 0,
        pub_control_text_card: 0
    }, wn = {
        image_stacked: 80,
        image_sidebyside: 0,
        mobile_banner_image_sidebyside: 0,
        pub_control_image_stacked: 80,
        pub_control_image_sidebyside: 0,
        pub_control_image_card_stacked: 85,
        pub_control_image_card_sidebyside: 0,
        pub_control_text: 80,
        pub_control_text_card: 80
    }, xn = {
        pub_control_image_stacked: 100,
        pub_control_image_sidebyside: 200,
        pub_control_image_card_stacked: 150,
        pub_control_image_card_sidebyside: 250,
        pub_control_text: 100,
        pub_control_text_card: 150
    };

    function yn(a) {
        var b = 0;
        a.P && b++;
        a.K && b++;
        a.L && b++;
        if (3 > b) return {N: "Tags data-matched-content-ui-type, data-matched-content-columns-num and data-matched-content-rows-num should be set together."};
        b = a.P.split(",");
        const c = a.L.split(",");
        a = a.K.split(",");
        if (b.length !== c.length || b.length !== a.length) return {N: 'Lengths of parameters data-matched-content-ui-type, data-matched-content-columns-num and data-matched-content-rows-num must match. Example: \n data-matched-content-rows-num="4,2"\ndata-matched-content-columns-num="1,6"\ndata-matched-content-ui-type="image_stacked,image_card_sidebyside"'};
        if (2 < b.length) return {N: "The parameter length of attribute data-matched-content-ui-type, data-matched-content-columns-num and data-matched-content-rows-num is too long. At most 2 parameters for each attribute are needed: one for mobile and one for desktop, while " + `you are providing ${b.length} parameters. Example: ${'\n data-matched-content-rows-num="4,2"\ndata-matched-content-columns-num="1,6"\ndata-matched-content-ui-type="image_stacked,image_card_sidebyside"'}.`};
        const d = [], e = [];
        for (let g = 0; g < b.length; g++) {
            var f = Number(c[g]);
            if (Number.isNaN(f) || 0 === f) return {N: `Wrong value '${c[g]}' for ${"data-matched-content-rows-num"}.`};
            d.push(f);
            f = Number(a[g]);
            if (Number.isNaN(f) || 0 === f) return {N: `Wrong value '${a[g]}' for ${"data-matched-content-columns-num"}.`};
            e.push(f)
        }
        return {L: d, K: e, bb: b}
    }

    function zn(a) {
        return 1200 <= a ? {width: 1200, height: 600} : 850 <= a ? {
            width: a,
            height: Math.floor(.5 * a)
        } : 550 <= a ? {width: a, height: Math.floor(.6 * a)} : 468 <= a ? {
            width: a,
            height: Math.floor(.7 * a)
        } : {width: a, height: Math.floor(3.44 * a)}
    };const An = Pa("script");

    class Bn {
        constructor(a, b, c = null, d = null, e = null, f = null, g = null, h = null, k = null, m = null, l = null, n = null) {
            this.B = a;
            this.ba = b;
            this.fa = c;
            this.g = d;
            this.X = e;
            this.h = f;
            this.i = g;
            this.C = h;
            this.D = k;
            this.j = m;
            this.s = l;
            this.H = n
        }

        size() {
            return this.ba
        }
    };const Cn = ["google_content_recommendation_ui_type", "google_content_recommendation_columns_num", "google_content_recommendation_rows_num"];
    var Dn = class extends pi {
        g(a) {
            return Math.min(1200, Math.max(this.U, Math.round(a)))
        }
    };

    function En(a, b) {
        Fn(a, b);
        if ("pedestal" === b.google_content_recommendation_ui_type) return new Bn(9, new Dn(a, Math.floor(a * b.google_phwr)));
        var c = md();
        468 > a ? c ? (c = a - 8 - 8, c = Math.floor(c / 1.91 + 70) + Math.floor(11 * (c * vn.mobile_banner_image_sidebyside + wn.mobile_banner_image_sidebyside) + 96), a = {
            aa: a,
            Z: c,
            K: 1,
            L: 12,
            P: "mobile_banner_image_sidebyside"
        }) : (a = zn(a), a = {
            aa: a.width,
            Z: a.height,
            K: 1,
            L: 13,
            P: "image_sidebyside"
        }) : (a = zn(a), a = {aa: a.width, Z: a.height, K: 4, L: 2, P: "image_stacked"});
        Gn(b, a);
        return new Bn(9, new Dn(a.aa, a.Z))
    }

    function Hn(a, b) {
        Fn(a, b);
        var c = yn({
            L: b.google_content_recommendation_rows_num,
            K: b.google_content_recommendation_columns_num,
            P: b.google_content_recommendation_ui_type
        });
        if (c.N) a = {aa: 0, Z: 0, K: 0, L: 0, P: "image_stacked", N: c.N}; else {
            var d = 2 === c.bb.length && 468 <= a ? 1 : 0;
            var e = c.bb[d];
            e = 0 === e.indexOf("pub_control_") ? e : "pub_control_" + e;
            var f = xn[e];
            let g = c.K[d];
            for (; a / g < f && 1 < g;) g--;
            f = g;
            d = c.L[d];
            c = Math.floor(((a - 8 * f - 8) / f * vn[e] + wn[e]) * d + 8 * d + 8);
            a = 1500 < a ? {width: 0, height: 0, Hb: `Calculated slot width is too large: ${a}`} : 1500 < c ? {
                width: 0,
                height: 0,
                Hb: `Calculated slot height is too large: ${c}`
            } : {width: a, height: c};
            a = {aa: a.width, Z: a.height, K: f, L: d, P: e}
        }
        if (a.N) throw new V(a.N);
        Gn(b, a);
        return new Bn(9, new Dn(a.aa, a.Z))
    }

    function Fn(a, b) {
        if (0 >= a) throw new V(`Invalid responsive width from Matched Content slot ${b.google_ad_slot}: ${a}. Please ensure to put this Matched Content slot into a non-zero width div container.`);
    }

    function Gn(a, b) {
        a.google_content_recommendation_ui_type = b.P;
        a.google_content_recommendation_columns_num = b.K;
        a.google_content_recommendation_rows_num = b.L
    };

    class In extends pi {
        g() {
            return this.U
        }

        h(a, b, c) {
            oi(a, c);
            c.style.height = this.height() + "px";
            b.rpe = !0
        }
    };const Jn = {
        "image-top": a => 600 >= a ? 284 + .414 * (a - 250) : 429,
        "image-middle": a => 500 >= a ? 196 - .13 * (a - 250) : 164 + .2 * (a - 500),
        "image-side": a => 500 >= a ? 205 - .28 * (a - 250) : 134 + .21 * (a - 500),
        "text-only": a => 500 >= a ? 187 - .228 * (a - 250) : 130,
        "in-article": a => 420 >= a ? a / 1.2 : 460 >= a ? a / 1.91 + 130 : 800 >= a ? a / 4 : 200
    };
    var Kn = class extends pi {
        g() {
            return Math.min(1200, this.U)
        }
    }, Ln = (a, b, c, d, e) => {
        var f = e.google_ad_layout || "image-top";
        if ("in-article" == f) {
            var g = a;
            if ("false" == e.google_full_width_responsive) a = g; else if (a = ji(b, c, g, .2, e), !0 !== a) e.gfwrnwer = a, a = g; else if (a = di(b)) if (e.google_full_width_responsive_allowed = !0, c.parentElement) {
                b:{
                    g = c;
                    for (let h = 0; 100 > h && g.parentElement; ++h) {
                        const k = g.parentElement.childNodes;
                        for (let m = 0; m < k.length; ++m) {
                            const l = k[m];
                            if (l != g && mi(b, l)) break b
                        }
                        g = g.parentElement;
                        g.style.width = "100%";
                        g.style.height = "auto"
                    }
                }
                oi(b, c)
            } else a = g; else a = g
        }
        if (250 > a) throw new V("Fluid responsive ads must be at least 250px wide: availableWidth=" + a);
        a = Math.min(1200, Math.floor(a));
        if (d && "in-article" != f) {
            f = Math.ceil(d);
            if (50 > f) throw new V("Fluid responsive ads must be at least 50px tall: height=" + f);
            return new Bn(11, new pi(a, f))
        }
        if ("in-article" != f && (d = e.google_ad_layout_key)) {
            f = "" + d;
            c = Math.pow(10, 3);
            if (e = (d = f.match(/([+-][0-9a-z]+)/g)) && d.length) for (b = [], g = 0; g < e; g++) b.push(parseInt(d[g], 36) / c); else b = null;
            if (!b) throw new V("Invalid data-ad-layout-key value: " + f);
            f = (a + -725) / 1E3;
            c = 0;
            d = 1;
            e = b.length;
            for (g = 0; g < e; g++) c += b[g] * d, d *= f;
            f = Math.ceil(1E3 * c - -725 + 10);
            if (isNaN(f)) throw new V("Invalid height: height=" + f);
            if (50 > f) throw new V("Fluid responsive ads must be at least 50px tall: height=" + f);
            if (1200 < f) throw new V("Fluid responsive ads must be at most 1200px tall: height=" + f);
            return new Bn(11, new pi(a, f))
        }
        d = Jn[f];
        if (!d) throw new V("Invalid data-ad-layout value: " + f);
        c = si(c, b);
        b = di(b);
        b = "in-article" !== f || c || a !== b ? Math.ceil(d(a)) : Math.ceil(1.25 * d(a));
        return new Bn(11, "in-article" == f ? new Kn(a, b) : new pi(a, b))
    };

    function Mn(a) {
        return b => {
            for (let c = a.length - 1; 0 <= c; --c) if (!a[c](b)) return !1;
            return !0
        }
    }

    function Nn(a, b) {
        var c = On.slice(0);
        const d = c.length;
        let e = null;
        for (let f = 0; f < d; ++f) {
            const g = c[f];
            if (a(g)) {
                if (null == b || b(g)) return g;
                null === e && (e = g)
            }
        }
        return e
    };var Z = [new Y(970, 90, 2), new Y(728, 90, 2), new Y(468, 60, 2), new Y(336, 280, 1), new Y(320, 100, 2), new Y(320, 50, 2), new Y(300, 600, 4), new Y(300, 250, 1), new Y(250, 250, 1), new Y(234, 60, 2), new Y(200, 200, 1), new Y(180, 150, 1), new Y(160, 600, 4), new Y(125, 125, 1), new Y(120, 600, 4), new Y(120, 240, 4), new Y(120, 120, 1, !0)],
        On = [Z[6], Z[12], Z[3], Z[0], Z[7], Z[14], Z[1], Z[8], Z[10], Z[4], Z[15], Z[2], Z[11], Z[5], Z[13], Z[9], Z[16]];
    var Qn = (a, b, c, d, e) => {
        "false" == e.google_full_width_responsive ? c = {
            F: a,
            G: 1
        } : "autorelaxed" === b && e.google_full_width_responsive || Pn(b) || e.google_ad_resize ? (b = ki(a, c, d, e), c = !0 !== b ? {
            F: a,
            G: b
        } : {F: di(c) || a, G: !0}) : c = {F: a, G: 2};
        const {F: f, G: g} = c;
        return !0 !== g ? {F: a, G: g} : d.parentElement ? {F: f, G: g} : {F: a, G: g}
    }, Tn = (a, b, c, d, e) => {
        const {F: f, G: g} = rj(247, () => Qn(a, b, c, d, e));
        var h = !0 === g;
        const k = R(d.style.width), m = R(d.style.height), {W: l, T: n, pa: v, ab: t} = Rn(f, b, c, d, e, h);
        h = Sn(b, v);
        var w;
        const z = (w = qi(d, c, "marginLeft", R)) ? w + "px" : "", A = (w = qi(d, c, "marginRight", R)) ? w + "px" : "";
        w = qi(d, c, "zIndex") || "";
        return new Bn(h, l, v, null, t, g, n, z, A, m, k, w)
    }, Pn = a => "auto" == a || /^((^|,) *(horizontal|vertical|rectangle) *)+$/.test(a), Rn = (a, b, c, d, e, f) => {
        b = Un(c, a, b);
        let g;
        var h = !1;
        let k = !1;
        var m = 488 > di(c);
        if (m) {
            g = ei(d, c);
            var l = si(d, c);
            h = !l && g;
            k = l && g
        }
        l = [ri(a), un(b)];
        l.push(ui(m, c, d, k));
        null != e.google_max_responsive_height && l.push(vi(e.google_max_responsive_height));
        m = [w => !w.xb];
        if (h || k) h = wi(c, d), m.push(vi(h));
        let n = Nn(Mn(l), Mn(m));
        if (!n) throw new V("No slot size for availableWidth=" + a);
        const {W: v, T: t} = rj(248, () => {
            var w;
            a:if (f) {
                if (e.gfwrnh && (w = R(e.gfwrnh))) {
                    w = {W: new In(a, w), T: !0};
                    break a
                }
                w = a / 1.2;
                var z = Math;
                var A = z.min;
                if (e.google_resizing_allowed || "true" == e.google_full_width_responsive) var B = Infinity; else {
                    B = d;
                    let ua = Infinity;
                    do {
                        var K = qi(B, c, "height", R);
                        K && (ua = Math.min(ua, K));
                        (K = qi(B, c, "maxHeight", R)) && (ua = Math.min(ua, K))
                    } while ((B = B.parentElement) && "HTML" != B.tagName);
                    B = ua
                }
                z = A.call(z, w, B);
                if (z < .5 * w || 100 > z) z = w;
                w = {W: new In(a, Math.floor(z)), T: z < w ? 102 : !0}
            } else w = {W: n, T: 100};
            return w
        });
        return "in-article" === e.google_ad_layout && c.location && "#hffwroe2etoq" == c.location.hash ? {
            W: Vn(a, c, d, v, e),
            T: !1,
            pa: b,
            ab: g
        } : {W: v, T: t, pa: b, ab: g}
    };
    const Sn = (a, b) => {
        if ("auto" == a) return 1;
        switch (b) {
            case 2:
                return 2;
            case 1:
                return 3;
            case 4:
                return 4;
            case 3:
                return 5;
            case 6:
                return 6;
            case 5:
                return 7;
            case 7:
                return 8
        }
        throw Error("bad mask");
    }, Un = (a, b, c) => {
        if ("auto" == c) c = Math.min(1200, di(a)), b = .25 >= b / c ? 4 : 3; else {
            b = 0;
            for (let d in ai) -1 != c.indexOf(d) && (b |= ai[d])
        }
        return b
    }, Vn = (a, b, c, d, e) => {
        const f = e.google_ad_height || qi(c, b, "height", R);
        b = Ln(a, b, c, f, e).size();
        return b.U * b.height() > a * d.height() ? new Y(b.U, b.height(), 1) : d
    };
    var Wn = (a, b, c, d, e) => {
        var f;
        (f = di(b)) ? 488 > di(b) ? b.innerHeight >= b.innerWidth ? (e.google_full_width_responsive_allowed = !0, oi(b, c), f = {
            F: f,
            G: !0
        }) : f = {F: a, G: 5} : f = {F: a, G: 4} : f = {F: a, G: 10};
        const {F: g, G: h} = f;
        if (!0 !== h || a == g) return new Bn(12, new pi(a, d), null, null, !0, h, 100);
        const {W: k, T: m, pa: l} = Rn(g, "auto", b, c, e, !0);
        return new Bn(1, k, l, 2, !0, h, m)
    };
    var Yn = (a, b) => {
        const c = b.google_ad_format;
        if ("autorelaxed" === c) {
            a:{
                if ("pedestal" !== b.google_content_recommendation_ui_type) for (const d of Cn) if (null != b[d]) {
                    a = !0;
                    break a
                }
                a = !1
            }
            return a ? 9 : 5
        }
        if (Pn(c)) return 1;
        if ("link" === c) return 4;
        if ("fluid" == c) return "in-article" !== b.google_ad_layout || !a.location || "#hffwroe2etop" != a.location.hash && "#hffwroe2etoq" != a.location.hash ? 8 : (Xn(b), 1);
        if (27 === b.google_reactive_ad_format) return Xn(b), 1
    }, $n = (a, b, c, d, e = !1) => {
        var f = b.offsetWidth || (c.google_ad_resize || e) && qi(b, d, "width", R) || c.google_ad_width || 0;
        4 === a && (c.google_ad_format = "auto", a = 1);
        e = (e = Zn(a, f, b, c, d)) ? e : Tn(f, c.google_ad_format, d, b, c);
        e.size().h(d, c, b);
        null != e.fa && (c.google_responsive_formats = e.fa);
        null != e.X && (c.google_safe_for_responsive_override = e.X);
        null != e.h && (!0 === e.h ? c.google_full_width_responsive_allowed = !0 : (c.google_full_width_responsive_allowed = !1, c.gfwrnwer = e.h));
        null != e.i && !0 !== e.i && (c.gfwrnher = e.i);
        d = e.s || c.google_ad_width;
        null != d && (c.google_resizing_width = d);
        d = e.j || c.google_ad_height;
        null != d && (c.google_resizing_height = d);
        d = e.size().g(f);
        const g = e.size().height();
        c.google_ad_width = d;
        c.google_ad_height = g;
        var h = e.size();
        f = h.g(f) + "x" + h.height();
        c.google_ad_format = f;
        c.google_responsive_auto_format = e.B;
        null != e.g && (c.armr = e.g);
        c.google_ad_resizable = !0;
        c.google_override_format = 1;
        c.google_loader_features_used = 128;
        !0 === e.h && (c.gfwrnh = e.size().height() + "px");
        null != e.C && (c.gfwroml = e.C);
        null != e.D && (c.gfwromr = e.D);
        null != e.j && (c.gfwroh = e.j);
        null != e.s && (c.gfwrow = e.s);
        null != e.H && (c.gfwroz = e.H);
        f = ud(window) || window;
        vm(f.location, "google_responsive_dummy_ad") && (Na([1, 2, 3, 4, 5, 6, 7, 8], e.B) || 1 === e.g) && 2 !== e.g && (f = JSON.stringify({
            googMsgType: "adpnt",
            key_value: [{key: "qid", value: "DUMMY_AD"}]
        }), c.dash = `<${An}>window.top.postMessage('${f}', '*'); 
          </${An}> 
          <div id="dummyAd" style="width:${d}px;height:${g}px; 
            background:#ddd;border:3px solid #f00;box-sizing:border-box; 
            color:#000;"> 
            <p>Requested size:${d}x${g}</p> 
            <p>Rendered size:${d}x${g}</p> 
          </div>`);
        1 != a && (a = e.size().height(), b.style.height = a + "px")
    };
    const Zn = (a, b, c, d, e) => {
        const f = d.google_ad_height || qi(c, e, "height", R);
        switch (a) {
            case 5:
                const {F: g, G: h} = rj(247, () => Qn(b, d.google_ad_format, e, c, d));
                !0 === h && b != g && oi(e, c);
                !0 === h ? d.google_full_width_responsive_allowed = !0 : (d.google_full_width_responsive_allowed = !1, d.gfwrnwer = h);
                return En(g, d);
            case 9:
                return Hn(b, d);
            case 8:
                return Ln(b, e, c, f, d);
            case 10:
                return Wn(b, e, c, f, d)
        }
    }, Xn = a => {
        a.google_ad_format = "auto";
        a.armr = 3
    };

    function ao(a, b) {
        a.google_resizing_allowed = !0;
        a.ovlp = !0;
        a.google_ad_format = "auto";
        a.iaaso = !0;
        a.armr = b
    };

    function bo(a, b) {
        var c = ud(b);
        if (c) {
            c = di(c);
            const d = xd(a, b) || {}, e = d.direction;
            if ("0px" === d.width && "none" !== d.cssFloat) return -1;
            if ("ltr" === e && c) return Math.floor(Math.min(1200, c - a.getBoundingClientRect().left));
            if ("rtl" === e && c) return a = b.document.body.getBoundingClientRect().right - a.getBoundingClientRect().right, Math.floor(Math.min(1200, c - a - Math.floor((c - b.document.body.clientWidth) / 2)))
        }
        return -1
    };

    function co(a, b) {
        switch (a) {
            case "google_reactive_ad_format":
                return a = parseInt(b, 10), isNaN(a) ? 0 : a;
            default:
                return b
        }
    }

    function eo(a, b) {
        if (a.getAttribute("src")) {
            var c = a.getAttribute("src") || "", d = qd(c, "client");
            d && (b.google_ad_client = co("google_ad_client", d));
            (c = qd(c, "host")) && (b.google_ad_host = co("google_ad_host", c))
        }
        a = a.attributes;
        c = a.length;
        for (d = 0; d < c; d++) {
            var e = a[d];
            if (/data-/.test(e.name)) {
                const f = qa(e.name.replace("data-matched-content", "google_content_recommendation").replace("data", "google").replace(/-/g, "_"));
                b.hasOwnProperty(f) || (e = co(f, e.value), null !== e && (b[f] = e))
            }
        }
    }

    function fo(a) {
        if (a = ae(a)) switch (a.data && a.data.autoFormat) {
            case "rspv":
                return 13;
            case "mcrspv":
                return 15;
            default:
                return 14
        } else return 12
    }

    function go(a, b, c, d) {
        eo(a, b);
        if (c.document && c.document.body && !Yn(c, b) && !b.google_reactive_ad_format) {
            var e = parseInt(a.style.width, 10), f = bo(a, c);
            if (0 < f && e > f) {
                var g = parseInt(a.style.height, 10);
                e = !!Tm[e + "x" + g];
                let h = f;
                if (e) {
                    const k = Um(f, g);
                    if (k) h = k, b.google_ad_format = k + "x" + g + "_0ads_al"; else throw new V("No slot size for availableWidth=" + f);
                }
                b.google_ad_resize = !0;
                b.google_ad_width = h;
                e || (b.google_ad_format = null, b.google_override_format = !0);
                f = h;
                a.style.width = `${f}px`;
                ao(b, 4)
            }
        }
        if (488 > di(c)) {
            f = ud(c) || c;
            (g = a.offsetWidth) || (g = qi(a, c, "width", R));
            g = g || b.google_ad_width || 0;
            e = b.google_ad_client;
            if (d = vm(f.location, "google_responsive_slot_preview") || Q(Eh) || Xl(f, 1, e, d)) b:if (b.google_reactive_ad_format || b.google_ad_resize || Yn(c, b) || gi(a, b)) d = !1; else {
                for (d = a; d; d = d.parentElement) {
                    f = xd(d, c);
                    if (!f) {
                        b.gfwrnwer = 18;
                        d = !1;
                        break b
                    }
                    if (!Na(["static", "relative"], f.position)) {
                        b.gfwrnwer = 17;
                        d = !1;
                        break b
                    }
                }
                d = ji(c, a, g, .3, b);
                !0 !== d ? (b.gfwrnwer = d, d = !1) : d = c === c.top ? !0 : !1
            }
            d ? (ao(b, 1), d = !0) : d = !1
        } else d = !1;
        if (g = Yn(c, b)) $n(g, a, b, c, d); else {
            if (gi(a, b)) {
                if (d = xd(a, c)) a.style.width = d.width, a.style.height = d.height, fi(d, b);
                b.google_ad_width || (b.google_ad_width = a.offsetWidth);
                b.google_ad_height || (b.google_ad_height = a.offsetHeight);
                b.google_loader_features_used = 256;
                b.google_responsive_auto_format = fo(c)
            } else fi(a.style, b);
            c.location && "#gfwmrp" == c.location.hash || 12 == b.google_responsive_auto_format && "true" == b.google_full_width_responsive ? $n(10, a, b, c, !1) : .01 > Math.random() && 12 === b.google_responsive_auto_format && (a = ki(a.offsetWidth || parseInt(a.style.width, 10) || b.google_ad_width, c, a, b), !0 !== a ? (b.efwr = !1, b.gfwrnwer = a) : b.efwr = !0)
        }
    };

    function ho(a) {
        if (a === a.top) return 0;
        for (let b = a; b && b !== b.top && td(b); b = b.parent) {
            if (a.sf_) return 2;
            if (a.$sf) return 3;
            if (a.inGptIF) return 4;
            if (a.inDapIF) return 5
        }
        return 1
    };

    function Vf(a, b, c = 0) {
        0 < a.g.size || io(a);
        c = Math.min(Math.max(0, c), 9);
        const d = a.g.get(c);
        d ? d.push(b) : a.g.set(c, [b])
    }

    function jo(a, b, c, d) {
        Tc(b, c, d);
        bk(a, () => Uc(b, c, d))
    }

    function ko(a, b) {
        1 !== a.h && (a.h = 1, 0 < a.g.size && lo(a, b))
    }

    function io(a) {
        a.l.document.visibilityState ? jo(a, a.l.document, "visibilitychange", b => {
            "hidden" === a.l.document.visibilityState && ko(a, b);
            "visible" === a.l.document.visibilityState && (a.h = 0)
        }) : "onpagehide" in a.l ? (jo(a, a.l, "pagehide", b => {
            ko(a, b)
        }), jo(a, a.l, "pageshow", () => {
            a.h = 0
        })) : jo(a, a.l, "beforeunload", b => {
            ko(a, b)
        })
    }

    function lo(a, b) {
        for (let c = 9; 0 <= c; c--) a.g.get(c)?.forEach(d => {
            d(b)
        })
    }

    var mo = class extends ak {
        constructor(a) {
            super();
            this.l = a;
            this.h = 0;
            this.g = new Map
        }
    };

    async function no(a, b) {
        var c = 10;
        return 0 >= c ? Promise.reject(Error(`wfc bad input ${c} ${200}`)) : b() ? Promise.resolve() : new Promise((d, e) => {
            const f = a.setInterval(() => {
                --c ? b() && (a.clearInterval(f), d()) : (a.clearInterval(f), e(Error(`wfc timed out ${c}`)))
            }, 200)
        })
    };

    function oo(a) {
        const b = a.g.pc;
        return null !== b && 0 !== b ? b : a.g.pc = Md(a.l)
    }

    function po(a) {
        const b = a.g.wpc;
        return null !== b && "" !== b ? b : a.g.wpc = Sm(a.l)
    }

    function qo(a, b) {
        var c = new pf;
        var d = oo(a);
        c = Bc(c, 1, d);
        d = po(a);
        c = Ec(c, 2, d);
        c = Bc(c, 3, a.g.sd);
        return Bc(c, 7, Math.round(b || a.l.performance.now()))
    }

    async function ro(a) {
        await no(a.l, () => !(!oo(a) || !po(a)))
    }

    function so(a) {
        var b = P(to);
        b.j && rj(1178, () => {
            const c = b.B;
            a(c);
            b.g.psi = c.toJSON()
        })
    }

    async function uo(a) {
        var b = P(to);
        if (b.j && !b.g.le.includes(1)) {
            b.g.le.push(1);
            var c = b.l.performance.now();
            await ro(b);
            a = df(ef(gf(new hf, a), bf(af(new cf, ci(b.l).scrollWidth), ci(b.l).scrollHeight)), bf(af(new cf, di(b.l)), ci(b.l).clientHeight));
            var d = new kf;
            Q(vh) ? (Ec(a, 4, b.i), Ec(d, 1, b.i)) : (Ec(a, 4, b.l?.document?.URL), Ec(d, 1, b.l?.document?.URL));
            var e = ho(b.l);
            0 !== e && ff(a, Ze(e));
            Rf(b.h, nf(qo(b, c), a));
            Vf(b.s, () => {
                try {
                    if (null != b.g?.psi) {
                        var f = Fc(jf, Zb(b.g.psi));
                        tc(d, 2, f)
                    }
                } catch {
                }
                f = b.h;
                var g = qo(b);
                g = uc(g, 8, of, d);
                Rf(f, g)
            }, 9)
        }
    }

    async function vo(a, b, c) {
        if (a.j && c.length && !a.g.lgdp.includes(Number(b))) {
            a.g.lgdp.push(Number(b));
            var d = a.l.performance.now();
            await ro(a);
            var e = a.h;
            a = qo(a, d);
            d = new Ye;
            b = D(d, 1, Cb(b), 0);
            c = mc(b, 2, c, Eb);
            c = uc(a, 9, of, c);
            Rf(e, c)
        }
    }

    async function wo(a, b) {
        await ro(a);
        var c = a.h;
        a = qo(a);
        a = Bc(a, 3, 1);
        b = uc(a, 10, of, b);
        Rf(c, b)
    }

    var to = class {
        constructor(a, b) {
            this.l = be() || window;
            this.s = b ?? new mo(this.l);
            this.h = a ?? new Xf(2, "m202401290101", 100, 100, !0, this.s);
            this.g = Tj(Qj(), 33, () => {
                const c = Wc(th);
                return {sd: c, ssp: 0 < c && yd() < 1 / c, pc: null, wpc: null, cu: null, le: [], lgdp: [], psi: null}
            })
        }

        get j() {
            return this.g.ssp
        }

        get i() {
            return this.g.cu
        }

        set i(a) {
            this.g.cu = a
        }

        get B() {
            return null === this.g.psi ? new jf : Fc(jf, Zb(this.g.psi))
        }
    };

    function xo() {
        var a = window;
        return "on" === p.google_adtest || "on" === p.google_adbreak_test || a.location.host.endsWith("h5games.usercontent.goog") ? a.document.querySelector('meta[name="h5-games-eids"]')?.getAttribute("content")?.split(",").map(b => Math.floor(Number(b))).filter(b => !isNaN(b) && 0 < b) || [] : []
    };

    function yo(a, b) {
        return a instanceof HTMLScriptElement && b.test(a.src) ? 0 : 1
    }

    function zo(a) {
        var b = S.document;
        if (b.currentScript) return yo(b.currentScript, a);
        for (const c of b.scripts) if (0 === yo(c, a)) return 0;
        return 1
    };

    function Ao(a, b) {
        return {
            [3]: {
                [55]: () => 0 === a,
                [23]: c => Xl(S, Number(c)),
                [24]: c => $l(Number(c)),
                [61]: () => J(b, 6),
                [63]: () => J(b, 6) || ".google.ch" === L(b, 8)
            }, [4]: {}, [5]: {[6]: () => L(b, 15)}
        }
    };

    function Bo(a = p) {
        return a.ggeac || (a.ggeac = {})
    };

    function Co(a, b = document) {
        return !!b.featurePolicy?.features().includes(a)
    }

    function Do(a, b = document) {
        return !!b.featurePolicy?.allowedFeatures().includes(a)
    };

    function Eo(a, b) {
        try {
            const d = a.split(".");
            a = p;
            let e = 0, f;
            for (; null != a && e < d.length; e++) f = a, a = a[d[e]], "function" === typeof a && (a = f[d[e]]());
            var c = a;
            if (typeof c === b) return c
        } catch {
        }
    }

    var Fo = {
        [3]: {
            [8]: a => {
                try {
                    return null != ca(a)
                } catch {
                }
            }, [9]: a => {
                try {
                    var b = ca(a)
                } catch {
                    return
                }
                if (a = "function" === typeof b) b = b && b.toString && b.toString(), a = "string" === typeof b && -1 != b.indexOf("[native code]");
                return a
            }, [10]: () => window === window.top, [6]: a => Na(P(Bg).g(), Number(a)), [27]: a => {
                a = Eo(a, "boolean");
                return void 0 !== a ? a : void 0
            }, [60]: a => {
                try {
                    return !!p.document.querySelector(a)
                } catch {
                }
            }, [69]: a => Co(a, p.document), [70]: a => Do(a, p.document)
        }, [4]: {
            [3]: () => Fd(), [6]: a => {
                a = Eo(a, "number");
                return void 0 !== a ? a : void 0
            }
        }, [5]: {
            [2]: () => window.location.href, [3]: () => {
                try {
                    return window.top.location.hash
                } catch {
                    return ""
                }
            }, [4]: a => {
                a = Eo(a, "string");
                return void 0 !== a ? a : void 0
            }
        }
    };

    function Go(a, b) {
        const c = new Map;
        for (const [f, g] of a[1].entries()) {
            var d = f, e = g;
            const {ib: h, eb: k, fb: m} = e[e.length - 1];
            c.set(d, h + k * m)
        }
        for (const f of b) for (const g of F(f, Gl, 2)) if (0 !== F(g, Fl, 2).length) {
            b = xc(Hb(cc(g, 8)));
            M(g, 4) && !M(g, 13) && (b = c.get(M(g, 4)) ?? 0, d = xc(Hb(cc(g, 1))) * F(g, Fl, 2).length, c.set(M(g, 4), b + d));
            d = [];
            for (e = 0; e < F(g, Fl, 2).length; e++) {
                const h = {
                    ib: b,
                    eb: xc(Hb(cc(g, 1))),
                    fb: F(g, Fl, 2).length,
                    Bb: e,
                    Xa: M(f, 1),
                    qa: g,
                    O: F(g, Fl, 2)[e]
                };
                d.push(h)
            }
            Ho(a[2], M(g, 10), d) || Ho(a[1], M(g, 4), d) || Ho(a[0], F(g, Fl, 2)[0].getId(), d)
        }
        return a
    }

    function Ho(a, b, c) {
        if (!b) return !1;
        a.has(b) || a.set(b, []);
        a.get(b).push(...c);
        return !0
    };

    function Io(a = yd()) {
        return b => Ad(`${b} + ${a}`) % 1E3
    };const Jo = [12, 13, 20];

    function Ko(a, b, c) {
        a.g[c] || (a.g[c] = []);
        a = a.g[c];
        a.includes(b) || a.push(b)
    }

    function Lo(a, b, c, d) {
        const e = [];
        var f;
        if (f = 9 !== b) a.j[b] ? f = !0 : (a.j[b] = !0, f = !1);
        if (f) return Zf(a.M, b, c, e, [], 4), e;
        f = Jo.includes(b);
        const g = [], h = P(eg).I, k = [];
        for (const v of [0, 1, 2]) for (const [t, w] of a.ka[v].entries()) {
            var m = t, l = w;
            const z = new uf;
            var n = l.filter(A => A.Xa === b && !!a.h[A.O.getId()] && Oe(E(A.qa, He, 3), h) && Oe(E(A.O, He, 3), h));
            if (n.length) for (const A of n) k.push(A.O); else if (!a.za && (2 === v ? (n = d[1], nc(z, 2, vf, Cb(m))) : n = d[0], m = n?.(String(m)) ?? (2 === v && 1 === M(l[0].qa, 11) ? void 0 : d[0](String(m))), void 0 !== m)) {
                for (const A of l) if (A.Xa === b) {
                    l = m - A.ib;
                    n = A.eb;
                    const B = A.fb, K = A.Bb;
                    0 <= l && l < n * B && l % B === K && Oe(E(A.qa, He, 3), h) && Oe(E(A.O, He, 3), h) && (l = M(A.qa, 13), 0 !== l && void 0 !== l && (n = a.i[String(l)], void 0 !== n && n !== A.O.getId() ? ag(a.M, a.i[String(l)], A.O.getId(), l) : a.i[String(l)] = A.O.getId()), k.push(A.O))
                }
                0 !== qc(z, vf) && (D(z, 3, Fb(m), 0), g.push(z))
            }
        }
        for (const v of k) d = v.getId(), e.push(d), Ko(a, d, f ? 4 : c), sg(F(v, Re, 2), f ? ug() : [c], a.M, d);
        Zf(a.M, b, c, e, g, 1);
        return e
    }

    function Mo(a, b) {
        b = b.map(c => new Hl(c)).filter(c => !Jo.includes(M(c, 1)));
        a.ka = Go(a.ka, b)
    }

    function No(a, b) {
        T(1, c => {
            a.h[c] = !0
        }, b);
        T(2, (c, d, e) => Lo(a, c, d, e), b);
        T(3, c => (a.g[c] || []).concat(a.g[4]), b);
        T(12, c => void Mo(a, c), b);
        T(16, (c, d) => void Ko(a, c, d), b)
    }

    var Oo = class {
        constructor(a, b, c, {za: d = !1, wc: e = []} = {}) {
            this.ka = a;
            this.M = c;
            this.j = {};
            this.za = d;
            this.g = {[b]: [], [4]: []};
            this.h = {};
            this.i = {};
            if (a = me()) {
                a = a.split(",") || [];
                for (const f of a) (a = Number(f)) && (this.h[a] = !0)
            }
            for (const f of e) this.h[f] = !0
        }
    };

    function Po(a, b) {
        a.g = wg(14, b, () => {
        })
    }

    class Qo {
        constructor() {
            this.g = () => {
            }
        }
    }

    function Ro(a) {
        P(Qo).g(a)
    };

    function So({
                    sb: a,
                    I: b,
                    config: c,
                    nb: d = Bo(),
                    ob: e = 0,
                    M: f = new bg(E(a, Il, 5)?.g() ?? 0, E(a, Il, 5)?.h() ?? 0, E(a, Il, 5)?.i() ?? !1),
                    ka: g = Go({[0]: new Map, [1]: new Map, [2]: new Map}, F(a, Hl, 2))
                }) {
        d.hasOwnProperty("init-done") ? (wg(12, d, () => {
        })(F(a, Hl, 2).map(h => h.toJSON())), wg(13, d, () => {
        })(F(a, Re, 1).map(h => h.toJSON()), e), b && wg(14, d, () => {
        })(b), To(e, d)) : (No(new Oo(g, e, f, c), d), xg(d), yg(d), zg(d), To(e, d), sg(F(a, Re, 1), [e], f, void 0, !0), fg = fg || !(!c || !c.wb), Ro(Fo), b && Ro(b))
    }

    function To(a, b = Bo()) {
        Ag(P(Bg), b, a);
        Uo(b, a);
        Po(P(Qo), b);
        P(Vc).s()
    }

    function Uo(a, b) {
        const c = P(Vc);
        c.i = (d, e) => wg(5, a, () => !1)(d, e, b);
        c.j = (d, e) => wg(6, a, () => 0)(d, e, b);
        c.g = (d, e) => wg(7, a, () => "")(d, e, b);
        c.h = (d, e) => wg(8, a, () => [])(d, e, b);
        c.s = () => {
            wg(15, a, () => {
            })(b)
        }
    };

    function Vo(a, b) {
        b = {[0]: Io(Md(b).toString())};
        b = P(Bg).j(a, b);
        Fg.Y(1085, vo(P(to), a, b))
    }

    function Wo(a, b, c) {
        var d = X(a);
        if (d.plle) To(1, Bo(a)); else {
            d.plle = !0;
            d = E(b, Jl, 12);
            var e = J(b, 9);
            So({sb: d, I: Ao(c, b), config: {za: e && !!a.google_disable_experiments, wb: e}, nb: Bo(a), ob: 1});
            if (c = L(b, 15)) c = Number(c), P(Bg).i(c);
            for (const f of hc(b, 19, Gb)) P(Bg).h(f);
            Vo(12, a);
            Vo(10, a);
            a = ud(a) || a;
            vm(a.location, "google_mc_lab") && P(Bg).h(44738307);
            vm(a.location, "google_auto_storify_swipeable") && P(Bg).h(44773747);
            vm(a.location, "google_auto_storify_scrollable") && P(Bg).h(44773746)
        }
    };

    function Xo(a) {
        W.Da(b => {
            b.shv = String(a);
            b.mjsv = Nm({va: "m202401290101", Ca: a});
            const c = P(Bg).g(), d = xo();
            b.eid = c.concat(d).join(",")
        })
    };

    function Yo(a) {
        var b = W;
        try {
            return Gc(a, Fe), new Ll(JSON.parse(a))
        } catch (c) {
            b.J(838, c instanceof Error ? c : Error(String(c)), void 0, d => {
                d.jspb = String(a)
            })
        }
        return new Ll
    };

    function Zo(a) {
        if (a.g) return a.g;
        a.B && a.B(a.h) ? a.g = a.h : a.g = Ed(a.h, a.D);
        return a.g ?? null
    }

    var $o = class extends ak {
        constructor(a, b, c) {
            super();
            this.D = b;
            this.B = c;
            this.C = new Map;
            this.j = new Map;
            this.h = a
        }
    };
    const ap = (a, b) => {
        (0, a.__uspapi)("getUSPData", 1, (c, d) => {
            b.ca({wa: c ?? void 0, rb: d ? void 0 : 2})
        })
    }, bp = {
        yb: a => a.ca,
        zb: (a, b) => ({__uspapiCall: {callId: b, command: "getUSPData", version: 1}}),
        Cb: (a, b) => {
            b = b.__uspapiReturn;
            a({wa: b.returnValue ?? void 0, rb: b.success ? void 0 : 2})
        }
    };
    var cp = class extends ak {
        constructor() {
            var a = S;
            super();
            this.timeoutMs = {}.timeoutMs ?? 500;
            this.caller = new $o(a, "__uspapiLocator", b => "function" === typeof b.__uspapi);
            this.caller.C.set("getDataWithCallback", ap);
            this.caller.j.set("getDataWithCallback", bp)
        }
    };
    var dp = Jc(class extends N {
    });
    const ep = (a, b) => {
        const c = {
            cb: d => {
                d = dp(d);
                b.ca({wa: d})
            }
        };
        b.spsp && (c.spsp = b.spsp);
        a = a.googlefc || (a.googlefc = {});
        a.__fci = a.__fci || [];
        a.__fci.push(b.command, c)
    }, fp = {
        yb: a => a.ca,
        zb: (a, b) => ({__fciCall: {callId: b, command: a.command, spsp: a.spsp || void 0}}),
        Cb: (a, b) => {
            a({wa: b})
        }
    };
    var gp = class extends ak {
        constructor() {
            var a = S;
            super();
            this.g = this.h = !1;
            this.caller = new $o(a, "googlefcPresent");
            this.caller.C.set("getDataWithCallback", ep);
            this.caller.j.set("getDataWithCallback", fp)
        }
    };
    var hp = a => {
        Tc(window, "message", b => {
            let c;
            try {
                c = JSON.parse(b.data)
            } catch (d) {
                return
            }
            !c || "sc-cnf" !== c.googMsgType || a(c, b)
        })
    };

    function ip(a, b) {
        return null == b ? `&${a}=null` : `&${a}=${Math.floor(b)}`
    }

    function jp(a, b) {
        return `&${a}=${b.toFixed(3)}`
    }

    function kp() {
        const a = new Set, b = Fj();
        try {
            if (!b) return a;
            const c = b.pubads();
            for (const d of c.getSlots()) a.add(d.getSlotId().getDomId())
        } catch {
        }
        return a
    }

    function lp(a) {
        a = a.id;
        return null != a && (kp().has(a) || a.startsWith("google_ads_iframe_") || a.startsWith("aswift"))
    }

    function mp(a, b, c) {
        if (!a.sources) return !1;
        switch (np(a)) {
            case 2:
                const d = op(a);
                if (d) return c.some(f => pp(d, f));
                break;
            case 1:
                const e = qp(a);
                if (e) return b.some(f => pp(e, f))
        }
        return !1
    }

    function np(a) {
        if (!a.sources) return 0;
        a = a.sources.filter(b => b.previousRect && b.currentRect);
        if (1 <= a.length) {
            a = a[0];
            if (a.previousRect.top < a.currentRect.top) return 2;
            if (a.previousRect.top > a.currentRect.top) return 1
        }
        return 0
    }

    function qp(a) {
        return rp(a, b => b.currentRect)
    }

    function op(a) {
        return rp(a, b => b.previousRect)
    }

    function rp(a, b) {
        return a.sources.reduce((c, d) => {
            d = b(d);
            return c ? d && 0 !== d.width * d.height ? d.top < c.top ? d : c : c : d
        }, null)
    }

    function pp(a, b) {
        const c = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        a = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        return 0 >= c || 0 >= a ? !1 : 50 <= 100 * c * a / ((b.right - b.left) * (b.bottom - b.top))
    }

    function sp() {
        const a = Array.from(document.getElementsByTagName("iframe")).filter(lp),
            b = [...kp()].map(c => document.getElementById(c)).filter(c => null !== c);
        tp = window.scrollX;
        up = window.scrollY;
        return vp = [...a, ...b].map(c => c.getBoundingClientRect())
    }

    function wp() {
        var a = new xp;
        if (Q(Pc)) {
            var b = window;
            if (!b.google_plmetrics && window.PerformanceObserver) {
                b.google_plmetrics = !0;
                b = ["layout-shift", "largest-contentful-paint", "first-input", "longtask"];
                a.kb.qb && b.push("event");
                for (const c of b) b = {
                    type: c,
                    buffered: !0
                }, "event" === c && (b.durationThreshold = 40), yp(a).observe(b);
                zp(a)
            }
        }
    }

    function Ap(a, b) {
        const c = tp !== window.scrollX || up !== window.scrollY ? [] : vp, d = sp();
        for (const e of b.getEntries()) switch (b = e.entryType, b) {
            case "layout-shift":
                Bp(a, e, c, d);
                break;
            case "largest-contentful-paint":
                b = e;
                a.Ka = Math.floor(b.renderTime || b.loadTime);
                a.Ja = b.size;
                break;
            case "first-input":
                b = e;
                a.Ga = Number((b.processingStart - b.startTime).toFixed(3));
                a.Ha = !0;
                a.g.some(f => f.entries.some(g => e.duration === g.duration && e.startTime === g.startTime)) || Cp(a, e);
                break;
            case "longtask":
                b = Math.max(0, e.duration - 50);
                a.B += b;
                a.H = Math.max(a.H, b);
                a.sa += 1;
                break;
            case "event":
                Cp(a, e);
                break;
            default:
                rd(b, void 0)
        }
    }

    function yp(a) {
        a.M || (a.M = new PerformanceObserver(Zi(640, b => {
            Ap(a, b)
        })));
        return a.M
    }

    function zp(a) {
        const b = Zi(641, () => {
            var d = document;
            2 === (d.prerendering ? 3 : {
                visible: 1,
                hidden: 2,
                prerender: 3,
                preview: 4,
                unloaded: 5
            }[d.visibilityState || d.webkitVisibilityState || d.mozVisibilityState || ""] || 0) && Dp(a)
        }), c = Zi(641, () => void Dp(a));
        document.addEventListener("visibilitychange", b);
        document.addEventListener("pagehide", c);
        a.Fa = () => {
            document.removeEventListener("visibilitychange", b);
            document.removeEventListener("pagehide", c);
            yp(a).disconnect()
        }
    }

    function Dp(a) {
        if (!a.Na) {
            a.Na = !0;
            yp(a).takeRecords();
            var b = "https://pagead2.googlesyndication.com/pagead/gen_204?id=plmetrics";
            window.LayoutShift && (b += jp("cls", a.C), b += jp("mls", a.X), b += ip("nls", a.ra), window.LayoutShiftAttribution && (b += jp("cas", a.s), b += ip("nas", a.Ma), b += jp("was", a.Ra)), b += jp("wls", a.ta), b += jp("tls", a.Qa));
            window.LargestContentfulPaint && (b += ip("lcp", a.Ka), b += ip("lcps", a.Ja));
            window.PerformanceEventTiming && a.Ha && (b += ip("fid", a.Ga));
            window.PerformanceLongTaskTiming && (b += ip("cbt", a.B), b += ip("mbt", a.H), b += ip("nlt", a.sa));
            let d = 0;
            for (var c of document.getElementsByTagName("iframe")) lp(c) && d++;
            b += ip("nif", d);
            b += ip("ifi", de(window));
            c = P(Bg).g();
            b += `&${"eid"}=${encodeURIComponent(c.join())}`;
            b += `&${"top"}=${p === p.top ? 1 : 0}`;
            b += a.Pa ? `&${"qqid"}=${encodeURIComponent(a.Pa)}` : ip("pvsid", Md(p));
            window.googletag && (b += "&gpt=1");
            c = Math.min(a.g.length - 1, Math.floor((a.M ? a.Ia : performance.interactionCount || 0) / 50));
            0 <= c && (c = a.g[c].latency, 0 <= c && (b += ip("inp", c)));
            window.fetch(b, {
                keepalive: !0, credentials: "include", redirect: "follow", method: "get", mode: "no-cors"
            });
            a.Fa()
        }
    }

    function Bp(a, b, c, d) {
        if (!b.hadRecentInput) {
            a.C += Number(b.value);
            Number(b.value) > a.X && (a.X = Number(b.value));
            a.ra += 1;
            if (c = mp(b, c, d)) a.s += b.value, a.Ma++;
            if (5E3 < b.startTime - a.La || 1E3 < b.startTime - a.Oa) a.La = b.startTime, a.h = 0, a.i = 0;
            a.Oa = b.startTime;
            a.h += b.value;
            c && (a.i += b.value);
            a.h > a.ta && (a.ta = a.h, a.Ra = a.i, a.Qa = b.startTime + b.duration)
        }
    }

    function Cp(a, b) {
        Ep(a, b);
        const c = a.g[a.g.length - 1], d = a.D[b.interactionId];
        if (d || 10 > a.g.length || b.duration > c.latency) d ? (d.entries.push(b), d.latency = Math.max(d.latency, b.duration)) : (b = {
            id: b.interactionId,
            latency: b.duration,
            entries: [b]
        }, a.D[b.id] = b, a.g.push(b)), a.g.sort((e, f) => f.latency - e.latency), a.g.splice(10).forEach(e => {
            delete a.D[e.id]
        })
    }

    function Ep(a, b) {
        b.interactionId && (a.ba = Math.min(a.ba, b.interactionId), a.j = Math.max(a.j, b.interactionId), a.Ia = a.j ? (a.j - a.ba) / 7 + 1 : 0)
    }

    var xp = class {
        constructor() {
            var a = {qb: Q(Sh)};
            this.i = this.h = this.ra = this.X = this.C = 0;
            this.Oa = this.La = Number.NEGATIVE_INFINITY;
            this.g = [];
            this.D = {};
            this.Ia = 0;
            this.ba = Infinity;
            this.Ga = this.Ja = this.Ka = this.Ma = this.Ra = this.s = this.Qa = this.ta = this.j = 0;
            this.Ha = !1;
            this.sa = this.H = this.B = 0;
            this.M = null;
            this.Na = !1;
            this.Fa = () => {
            };
            const b = document.querySelector("[data-google-query-id]");
            this.Pa = b ? b.getAttribute("data-google-query-id") : null;
            this.kb = a
        }
    }, tp, up, vp = [];
    let Fp = null;
    const Gp = [], Hp = new Map;
    let Ip = -1;

    function Jp(a) {
        return yi.test(a.className) && "done" !== a.dataset.adsbygoogleStatus
    }

    function Kp(a, b, c) {
        a.dataset.adsbygoogleStatus = "done";
        Lp(a, b, c)
    }

    function Lp(a, b, c) {
        var d = window;
        d.google_spfd || (d.google_spfd = go);
        var e = b.google_reactive_ads_config;
        e || go(a, b, d, c);
        kn(d, b);
        if (!Mp(a, b, d)) {
            if (e) {
                e = e.page_level_pubvars || {};
                if (X(S).page_contains_reactive_tag && !X(S).allow_second_reactive_tag) {
                    if (e.pltais) {
                        Ql(!1);
                        return
                    }
                    throw new V("Only one 'enable_page_level_ads' allowed per page.");
                }
                X(S).page_contains_reactive_tag = !0;
                Ql(7 === e.google_pgb_reactive)
            }
            b.google_unique_id = ce(d);
            zd(Om, (f, g) => {
                b[g] = b[g] || d[g]
            });
            "sd" !== b.google_loader_used && (b.google_loader_used = "aa");
            b.google_reactive_tag_first = 1 === (X(S).first_tag_on_page || 0);
            rj(164, () => {
                qn(d, b, a, c)
            })
        }
    }

    function Mp(a, b, c) {
        var d = b.google_reactive_ads_config,
            e = "string" === typeof a.className && RegExp("(\\W|^)adsbygoogle-noablate(\\W|$)").test(a.className),
            f = Ol(c);
        if (f && f.Sa && "on" !== b.google_adtest && !e) {
            e = ii(a, c);
            const g = ci(c).clientHeight;
            e = 0 == g ? null : e / g;
            if (!f.ua || f.ua && (e || 0) >= f.ua) return a.className += " adsbygoogle-ablated-ad-slot", c = c.google_sv_map = c.google_sv_map || {}, d = ea(a), b.google_element_uid = d, c[b.google_element_uid] = b, a.setAttribute("google_element_uid", String(d)), "slot" === f.Jb && (null !== Dd(a.getAttribute("width")) && a.setAttribute("width", "0"), null !== Dd(a.getAttribute("height")) && a.setAttribute("height", "0"), a.style.width = "0px", a.style.height = "0px"), !0
        }
        if ((f = xd(a, c)) && "none" === f.display && !("on" === b.google_adtest || 0 < b.google_reactive_ad_format || d)) return c.document.createComment && a.appendChild(c.document.createComment("No ad requested because of display:none on the adsbygoogle tag")), !0;
        a = null == b.google_pgb_reactive || 3 === b.google_pgb_reactive;
        return 1 !== b.google_reactive_ad_format && 8 !== b.google_reactive_ad_format || !a ? !1 : (p.console && p.console.warn("Adsbygoogle tag with data-reactive-ad-format=" + String(b.google_reactive_ad_format) + " is deprecated. Check out page-level ads at https://www.google.com/adsense"), !0)
    }

    function Np(a) {
        var b = document.getElementsByTagName("INS");
        for (let d = 0, e = b[d]; d < b.length; e = b[++d]) {
            var c = e;
            if (Jp(c) && "reserved" !== c.dataset.adsbygoogleStatus && (!a || e.id === a)) return e
        }
        return null
    }

    function Op(a, b, c) {
        if (a && "shift" in a) {
            so(e => {
                zc(rc(e), 2) || (e = rc(e), Dc(e, 2))
            });
            for (var d = 20; 0 < a.length && 0 < d;) {
                try {
                    Pp(a.shift(), b, c)
                } catch (e) {
                    setTimeout(() => {
                        throw e;
                    })
                }
                --d
            }
        }
    }

    function Qp() {
        const a = wd("INS");
        a.className = "adsbygoogle";
        a.className += " adsbygoogle-noablate";
        Gd(a);
        return a
    }

    function Rp(a, b) {
        const c = {}, d = gm(a.google_ad_client, b);
        zd(bi, (g, h) => {
            !1 === a.enable_page_level_ads ? c[h] = !1 : a.hasOwnProperty(h) ? c[h] = a[h] : d.includes(g) && (c[h] = !1)
        });
        da(a.enable_page_level_ads) && (c.page_level_pubvars = a.enable_page_level_ads);
        const e = Qp();
        Nd.body.appendChild(e);
        const f = {google_reactive_ads_config: c, google_ad_client: a.google_ad_client};
        f.google_pause_ad_requests = !!X(S).pause_ad_requests;
        Kp(e, f, b);
        so(g => {
            zc(rc(g), 6) || (g = rc(g), Dc(g, 6))
        })
    }

    function Sp(a, b) {
        Em(p).wasPlaTagProcessed = !0;
        const c = () => {
            Rp(a, b)
        }, d = p.document;
        if (d.body || "complete" === d.readyState || "interactive" === d.readyState) Rp(a, b); else {
            const e = Sc(W.oa(191, c));
            Tc(d, "DOMContentLoaded", e);
            Q(Ch) && null == p.MutationObserver || (new p.MutationObserver((f, g) => {
                d.body && (e(), g.disconnect())
            })).observe(d, {childList: !0, subtree: !0})
        }
    }

    function Pp(a, b, c) {
        const d = {};
        rj(165, () => {
            Tp(a, d, b, c)
        }, e => {
            e.client = e.client || d.google_ad_client || a.google_ad_client;
            e.slotname = e.slotname || d.google_ad_slot;
            e.tag_origin = e.tag_origin || d.google_tag_origin
        })
    }

    function Up(a) {
        delete a.google_checked_head;
        zd(a, (b, c) => {
            xi[c] || (delete a[c], b = c.replace("google", "data").replace(/_/g, "-"), p.console.warn(`AdSense head tag doesn't support ${b} attribute.`))
        })
    }

    function Vp(a, b) {
        var c = S.document.querySelector('script[src*="/pagead/js/adsbygoogle.js?client="]:not([data-checked-head])') || S.document.querySelector('script[src*="/pagead/js/adsbygoogle.js"][data-ad-client]:not([data-checked-head])');
        if (c) {
            c.setAttribute("data-checked-head", "true");
            var d = X(window);
            if (d.head_tag_slot_vars) Wp(c); else {
                so(g => {
                    g = rc(g);
                    D(g, 7, zb(!0), !1)
                });
                var e = {};
                eo(c, e);
                Up(e);
                var f = $c(e);
                d.head_tag_slot_vars = f;
                c = {google_ad_client: e.google_ad_client, enable_page_level_ads: e};
                "bottom" === e.google_overlays && (c.overlays = {bottom: !0});
                delete e.google_overlays;
                S.adsbygoogle || (S.adsbygoogle = []);
                d = S.adsbygoogle;
                d.loaded ? d.push(c) : d.splice && d.splice(0, 0, c);
                e.google_adbreak_test || b.h()?.h() ? Xp(f, a) : hp(() => {
                    Xp(f, a)
                })
            }
        }
    }

    function Wp(a) {
        const b = X(window).head_tag_slot_vars, c = a.getAttribute("src") || "";
        if ((a = qd(c, "client") || a.getAttribute("data-ad-client") || "") && a !== b.google_ad_client) throw new V("Warning: Do not add multiple property codes with AdSense tag to avoid seeing unexpected behavior. These codes were found on the page " + a + ", " + b.google_ad_client);
    }

    function Yp(a) {
        if ("object" === typeof a && null != a) {
            if ("string" === typeof a.type) return 2;
            if ("string" === typeof a.sound || "string" === typeof a.preloadAdBreaks) return 3
        }
        return 0
    }

    function Tp(a, b, c, d) {
        if (null == a) throw new V("push() called with no parameters.");
        so(f => {
            zc(rc(f), 3) || (f = rc(f), Dc(f, 3))
        });
        d.i() && Zp(a, d.g().g(), L(d, 2));
        var e = Yp(a);
        if (0 !== e) if (d = Rl(), d.first_slotcar_request_processing_time || (d.first_slotcar_request_processing_time = Date.now(), d.adsbygoogle_execution_start_time = pa), null == Fp) $p(a), Gp.push(a); else if (3 === e) {
            const f = Fp;
            rj(787, () => {
                f.handleAdConfig(a)
            })
        } else tj(730, Fp.handleAdBreak(a)); else {
            pa = (new Date).getTime();
            ln(c, d, aq(a));
            bq();
            a:{
                if (void 0 != a.enable_page_level_ads) {
                    if ("string" === typeof a.google_ad_client) {
                        e = !0;
                        break a
                    }
                    throw new V("'google_ad_client' is missing from the tag config.");
                }
                e = !1
            }
            if (e) so(f => {
                zc(rc(f), 4) || (f = rc(f), Dc(f, 4))
            }), cq(a, d); else if ((e = a.params) && zd(e, (f, g) => {
                b[g] = f
            }), "js" === b.google_ad_output) console.warn("Ads with google_ad_output='js' have been deprecated and no longer work. Contact your AdSense account manager or switch to standard AdSense ads."); else {
                e = dq(a.element);
                eo(e, b);
                c = X(p).head_tag_slot_vars || {};
                zd(c, (f, g) => {
                    b.hasOwnProperty(g) || (b[g] = f)
                });
                if (e.hasAttribute("data-require-head") && !X(p).head_tag_slot_vars) throw new V("AdSense head tag is missing. AdSense body tags don't work without the head tag. You can copy the head tag from your account on https://adsense.com.");
                if (!b.google_ad_client) throw new V("Ad client is missing from the slot.");
                if (c = 0 === (X(S).first_tag_on_page || 0) && Hm(b)) so(f => {
                    zc(rc(f), 5) || (f = rc(f), Dc(f, 5))
                }), eq(c);
                0 === (X(S).first_tag_on_page || 0) && (X(S).first_tag_on_page = 2);
                b.google_pause_ad_requests = !!X(S).pause_ad_requests;
                Kp(e, b, d)
            }
        }
    }

    let fq = !1;

    function Zp(a, b, c) {
        fq || (fq = !0, a = aq(a) || Sm(S), sj("predictive_abg", {a_c: a, p_c: b.join(), b_v: c}, .01))
    }

    function aq(a) {
        return a.google_ad_client ? a.google_ad_client : (a = a.params) && a.google_ad_client ? a.google_ad_client : ""
    }

    function bq() {
        if (Q(Ah)) {
            var a = Ol(S);
            if (!(a = a && a.Sa)) {
                a = S;
                try {
                    var b = a.localStorage
                } catch (c) {
                    b = null
                }
                b = b ? Cl(b) : null;
                a = !(b && Bl(b) && b)
            }
            a || Pl(S, 1)
        }
    }

    function eq(a) {
        Od(() => {
            Em(p).wasPlaTagProcessed || p.adsbygoogle && p.adsbygoogle.push(a)
        })
    }

    function cq(a, b) {
        0 === (X(S).first_tag_on_page || 0) && (X(S).first_tag_on_page = 1);
        if (a.tag_partner) {
            var c = a.tag_partner;
            const d = X(p);
            d.tag_partners = d.tag_partners || [];
            d.tag_partners.push(c)
        }
        Im(a, b);
        Sp(a, b)
    }

    function dq(a) {
        if (a) {
            if (!Jp(a) && (a.id ? a = Np(a.id) : a = null, !a)) throw new V("'element' has already been filled.");
            if (!("innerHTML" in a)) throw new V("'element' is not a good DOM element.");
        } else if (a = Np(), !a) throw new V("All 'ins' elements in the DOM with class=adsbygoogle already have ads in them.");
        return a
    }

    function gq() {
        var a = new jk(S), b = new cp, c = new gp, d = S.__cmp ? 1 : 0;
        a = gk(a) ? 1 : 0;
        b = Zo(b.caller) ? 1 : 0;
        c.h || (c.g = !!Zo(c.caller), c.h = !0);
        c = c.g;
        sj("cmpMet", {tcfv1: d, tcfv2: a, usp: b, fc: c ? 1 : 0, ptt: 9}, .001)
    }

    function hq(a) {
        var b = Qj();
        Wj(b, 26, !!Number(a))
    }

    function iq(a) {
        Number(a) ? X(S).pause_ad_requests = !0 : (X(S).pause_ad_requests = !1, a = () => {
            if (!X(S).pause_ad_requests) {
                var b = {};
                let c;
                "function" === typeof window.CustomEvent ? c = new CustomEvent("adsbygoogle-pub-unpause-ad-requests-event", b) : (c = document.createEvent("CustomEvent"), c.initCustomEvent("adsbygoogle-pub-unpause-ad-requests-event", !!b.bubbles, !!b.cancelable, b.detail));
                S.dispatchEvent(c)
            }
        }, p.setTimeout(a, 0), p.setTimeout(a, 1E3))
    }

    function jq(a) {
        a && a.call && "function" === typeof a && window.setTimeout(a, 0)
    }

    function Xp(a, b) {
        b = Dm(2, p, b.Ib).Ta.then(c => {
            null == Fp && (c.init(a), Fp = c, kq(c))
        });
        W.Y(723, b);
        b.finally(() => {
            Gp.length = 0;
            sj("slotcar", {event: "api_ld", time: Date.now() - pa, time_pr: Date.now() - Ip});
            Q(Vh) && wo(P(to), lf(23))
        })
    }

    function kq(a) {
        for (const [c, d] of Hp) {
            var b = c;
            const e = d;
            -1 !== e && (p.clearTimeout(e), Hp.delete(b))
        }
        for (b = 0; b < Gp.length; b++) {
            if (Hp.has(b)) continue;
            const c = Gp[b], d = Yp(c);
            rj(723, () => {
                if (3 === d) a.handleAdConfig(c); else if (2 === d) {
                    var e = a.handleAdBreakBeforeReady(c);
                    W.Y(730, e)
                }
            })
        }
    }

    function $p(a) {
        var b = Gp.length;
        if (2 === Yp(a) && "preroll" === a.type && null != a.adBreakDone) {
            var c = a.adBreakDone;
            -1 === Ip && (Ip = Date.now());
            var d = p.setTimeout(() => {
                try {
                    c({
                        breakType: "preroll",
                        breakName: a.name,
                        breakFormat: "preroll",
                        breakStatus: "timeout"
                    }), Hp.set(b, -1), sj("slotcar", {
                        event: "pr_to",
                        source: "adsbygoogle"
                    }), Q(Vh) && wo(P(to), lf(22))
                } catch (e) {
                    console.error("[Ad Placement API] adBreakDone callback threw an error:", e instanceof Error ? e : Error(String(e)))
                }
            }, 1E3 * Wc(Uh));
            Hp.set(b, d)
        }
    }

    function lq() {
        var a = S.document, b = Yd`https://googleads.g.doubleclick.net`;
        const c = a.createElement("LINK");
        c.crossOrigin = "";
        a:{
            if (b instanceof bd) c.href = ed(b).toString(); else {
                if (-1 === sd.indexOf("preconnect")) throw Error('TrustedResourceUrl href attribute required with rel="preconnect"');
                if (b instanceof id) b = b instanceof id && b.constructor === id ? b.g : "type_error:SafeUrl"; else {
                    c:{
                        try {
                            var d = new URL(b)
                        } catch (e) {
                            d = "https:";
                            break c
                        }
                        d = d.protocol
                    }
                    b = "javascript:" !== d ? b : void 0
                }
                if (void 0 === b) break a;
                c.href = b
            }
            c.rel = "preconnect"
        }
        a.head.appendChild(c)
    };(function (a, b, c, d = () => {
    }) {
        W.hb(uj);
        rj(166, () => {
            const e = new Xf(2, a);
            try {
                xb(n => {
                    var v = new Lf;
                    var t = new Kf;
                    try {
                        var w = Md(window);
                        Bc(t, 1, w)
                    } catch (K) {
                    }
                    try {
                        var z = P(Bg).g();
                        mc(t, 2, z, Eb)
                    } catch (K) {
                    }
                    try {
                        Ec(t, 3, window.document.URL)
                    } catch (K) {
                    }
                    v = tc(v, 2, t);
                    t = new Jf;
                    t = D(t, 1, Cb(1191), 0);
                    try {
                        var A = Fe(n?.name) ? n.name : "Unknown error";
                        Ec(t, 2, A)
                    } catch (K) {
                    }
                    try {
                        var B = Fe(n?.message) ? n.message : `Caught ${n}`;
                        Ec(t, 3, B)
                    } catch (K) {
                    }
                    try {
                        const K = Fe(n?.stack) ? n.stack : Error().stack;
                        K && mc(t, 4, K.split(/\n\s*/), Lb)
                    } catch (K) {
                    }
                    n = tc(v, 1, t);
                    A = new If;
                    try {
                        Ec(A, 1, "m202401290101")
                    } catch {
                    }
                    uc(n, 6, Mf, A);
                    Bc(n, 5, 1);
                    Of(e, n)
                })
            } catch (n) {
            }
            const f = Yo(b);
            Xo(L(f, 2));
            Nl(J(f, 6));
            Xj(Qj(), L(f, 24));
            d();
            $d(16, [1, f.toJSON()]);
            var g = be(ae(S)) || S;
            const h = c(Nm({va: a, Ca: L(f, 2)}), f);
            var k = null === S.document.currentScript ? 1 : zo(h.Kb);
            Yl(g, f);
            Wo(g, f, k);
            Q(qh) && lq();
            so(n => {
                var v = xc(G(n, 1)) + 1;
                D(n, 1, Fb(v), 0);
                S.top === S && (v = xc(G(n, 2)) + 1, D(n, 2, Fb(v), 0));
                zc(rc(n), 1) || (n = rc(n), Dc(n, 1))
            });
            tj(1086, uo(0 === k));
            if (!Ba() || 0 <= ra(Ga(), 11)) {
                qj(Q(Wh));
                tn();
                jl();
                try {
                    wp()
                } catch {
                }
                sn();
                Vp(h, f);
                g = window;
                k = g.adsbygoogle;
                if (!k || !k.loaded) {
                    sj("new_abg_tag", {value: `${J(f, 16)}`, host_v: `${J(f, 22)}`, frequency: .01}, .01);
                    gq();
                    var m = {
                        push: n => {
                            Pp(n, h, f)
                        }, loaded: !0
                    };
                    try {
                        Object.defineProperty(m, "requestNonPersonalizedAds", {set: hq}), Object.defineProperty(m, "pauseAdRequests", {set: iq}), Object.defineProperty(m, "onload", {set: jq})
                    } catch {
                    }
                    if (k) for (var l of ["requestNonPersonalizedAds", "pauseAdRequests"]) void 0 !== k[l] && (m[l] = k[l]);
                    Op(k, h, f);
                    g.adsbygoogle = m;
                    k && (m.onload = k.onload);
                    Q(wh) || (l = pn(h)) && document.documentElement.appendChild(l)
                }
            }
        })
    })("m202401290101", "undefined" === typeof sttc ? void 0 : sttc, function (a, b) {
        const c = 2012 < xc(G(b, 1)) ? `_fy${xc(G(b, 1))}` : "", d = L(b, 3);
        b = L(b, 2);
        Yd`data:text/javascript,//show_ads_impl_preview.js`;
        return {
            Ib: Yd`https://pagead2.googlesyndication.com/pagead/managed/js/adsense/${a}/${""}slotcar_library${c}.js`,
            Gb: Yd`https://pagead2.googlesyndication.com/pagead/managed/js/adsense/${a}/${""}show_ads_impl${c}.js`,
            Fb: Yd`https://pagead2.googlesyndication.com/pagead/managed/js/adsense/${a}/${""}show_ads_impl_with_ama${c}.js`,
            Ob: Yd`https://googleads.g.doubleclick.net/pagead/html/${b}/${d}/zrt_lookup${c}.html`,
            Mb: Yd`https://googleads.g.doubleclick.net/pagead/html/${b}/${d}/zrt_lookup_inhead${c}.html`,
            Nb: Yd`https://googleads.g.doubleclick.net/pagead/html/${b}/${d}/zrt_lookup_nohtml${c}.html`,
            Kb: /^(?:https?:)?\/\/(?:pagead2\.googlesyndication\.com|securepubads\.g\.doubleclick\.net)\/pagead\/(?:js\/)?(?:show_ads|adsbygoogle)\.js(?:[?#].*)?$/
        }
    });
}).call(this, "[2021,\"r20240131\",\"r20190131\",null,null,null,null,\".google.com.sg\",null,null,null,[[[1310,null,null,[1]],[1277,null,null,[1]],[1308,null,null,[1]],[1275,null,null,[1]],[1311,null,null,[1]],[null,1130,null,[null,100]],[1270,null,null,[1]],[null,1032,null,[null,200],[[[12,null,null,null,4,null,\"Android\",[\"navigator.userAgent\"]],[null,500]]]],[1247,null,null,[1]],[null,1224,null,[null,0.01]],[1312,null,null,[1]],[1207,null,null,[1]],[null,1263,null,[null,-1]],[null,1265,null,[null,-1]],[null,1264,null,[null,-1]],[1267,null,null,[1]],[1268,null,null,[1]],[null,66,null,[null,-1]],[null,65,null,[null,-1]],[1241,null,null,[1]],[1285,null,null,[1]],[1300,null,null,[1]],[null,null,null,[null,null,null,[\"en\",\"de\"]],null,1273],[1223,null,null,[1]],[null,null,null,[null,null,null,[\"44786015\",\"44786016\"]],null,1261],[null,1072,null,[null,0.75]],[null,572636916,null,[null,25]],[null,566560958,null,[null,30000]],[null,508040914,null,[null,100]],[null,547455356,null,[null,49]],[null,null,null,[null,null,null,[\"1\",\"2\",\"4\",\"6\"]],null,556791602],[45614877,null,null,[1]],[561639568,null,null,[1]],[null,572636915,null,[null,150]],[null,595645509,null,[null,0.3]],[null,561668774,null,[null,0.1]],[598587325,null,null,[1]],[599093330,null,null,[1]],[null,469675170,null,[null,30000]],[597181300,null,null,[1]],[586386407,null,null,[1]],[573506525,null,null,[1]],[573506524,null,null,[1]],[586643641,null,null,[1]],[567362967,null,null,[1]],[570863962,null,null,[1]],[null,null,570879859,[null,null,\"control_1\\\\.\\\\d\"]],[null,570863961,null,[null,50]],[570879858,null,null,[1]],[null,1085,null,[null,5]],[null,63,null,[null,30]],[null,1080,null,[null,5]],[10010,null,null,[1]],[null,1027,null,[null,10]],[null,57,null,[null,120]],[null,1079,null,[null,5]],[10009,null,null,[1]],[null,1050,null,[null,30]],[null,58,null,[null,120]],[10005,null,null,[1]],[555237685,null,null,[1]],[45460956,null,null,[]],[45414947,null,null,[1]],[null,472785970,null,[null,500]],[557143911,null,null,[1]],[null,550718588,null,[null,250]],[null,null,null,[null,null,null,[\"As0hBNJ8h++fNYlkq8cTye2qDLyom8NddByiVytXGGD0YVE+2CEuTCpqXMDxdhOMILKoaiaYifwEvCRlJ\/9GcQ8AAAB8eyJvcmlnaW4iOiJodHRwczovL2RvdWJsZWNsaWNrLm5ldDo0NDMiLCJmZWF0dXJlIjoiV2ViVmlld1hSZXF1ZXN0ZWRXaXRoRGVwcmVjYXRpb24iLCJleHBpcnkiOjE3MTk1MzI3OTksImlzU3ViZG9tYWluIjp0cnVlfQ==\",\"AgRYsXo24ypxC89CJanC+JgEmraCCBebKl8ZmG7Tj5oJNx0cmH0NtNRZs3NB5ubhpbX\/bIt7l2zJOSyO64NGmwMAAACCeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZXN5bmRpY2F0aW9uLmNvbTo0NDMiLCJmZWF0dXJlIjoiV2ViVmlld1hSZXF1ZXN0ZWRXaXRoRGVwcmVjYXRpb24iLCJleHBpcnkiOjE3MTk1MzI3OTksImlzU3ViZG9tYWluIjp0cnVlfQ==\",\"A\/ERL66fN363FkXxgDc6F1+ucRUkAhjEca9W3la6xaLnD2Y1lABsqmdaJmPNaUKPKVBRpyMKEhXYl7rSvrQw+AkAAACNeyJvcmlnaW4iOiJodHRwczovL2RvdWJsZWNsaWNrLm5ldDo0NDMiLCJmZWF0dXJlIjoiRmxlZGdlQmlkZGluZ0FuZEF1Y3Rpb25TZXJ2ZXIiLCJleHBpcnkiOjE3MTkzNTk5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9\",\"A6OdGH3fVf4eKRDbXb4thXA4InNqDJDRhZ8U533U\/roYjp4Yau0T3YSuc63vmAs\/8ga1cD0E3A7LEq6AXk1uXgsAAACTeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZXN5bmRpY2F0aW9uLmNvbTo0NDMiLCJmZWF0dXJlIjoiRmxlZGdlQmlkZGluZ0FuZEF1Y3Rpb25TZXJ2ZXIiLCJleHBpcnkiOjE3MTkzNTk5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9\"]],null,1934],[485990406,null,null,[]]],[[12,[[40,[[21065724],[21065725,[[203,null,null,[1]]]]],[4,null,9,null,null,null,null,[\"LayoutShift\"]],71],[10,[[31061690],[31061691,[[83,null,null,[1]],[84,null,null,[1]]]]],null,61]]],[13,[[500,[[31061692],[31061693,[[77,null,null,[1]],[78,null,null,[1]],[85,null,null,[1]],[80,null,null,[1]],[76,null,null,[1]]]]],[4,null,6,null,null,null,null,[\"31061691\"]]],[1000,[[31078663,null,[2,[[4,null,70,null,null,null,null,[\"browsing-topics\"]],[4,null,8,null,null,null,null,[\"document.browsingTopics\"]]]]]]],[1000,[[31078664,null,[2,[[4,null,69,null,null,null,null,[\"browsing-topics\"]],[1,[[4,null,70,null,null,null,null,[\"browsing-topics\"]]]]]]]]],[1000,[[31078665,null,[2,[[4,null,8,null,null,null,null,[\"navigator.runAdAuction\"]],[4,null,70,null,null,null,null,[\"run-ad-auction\"]],[4,null,70,null,null,null,null,[\"join-ad-interest-group\"]]]]]]],[1000,[[31078666,null,[2,[[4,null,69,null,null,null,null,[\"join-ad-interest-group\"]],[1,[[4,null,70,null,null,null,null,[\"join-ad-interest-group\"]]]]]]]]],[1000,[[31078667,null,[2,[[4,null,69,null,null,null,null,[\"run-ad-auction\"]],[1,[[4,null,70,null,null,null,null,[\"run-ad-auction\"]]]]]]]]],[1000,[[31078668,null,[4,null,70,null,null,null,null,[\"attribution-reporting\"]]]]],[1000,[[31078669,null,[2,[[4,null,69,null,null,null,null,[\"attribution-reporting\"]],[1,[[4,null,70,null,null,null,null,[\"attribution-reporting\"]]]]]]]]],[1000,[[31078670,null,[4,null,70,null,null,null,null,[\"shared-storage\"]]]]],[1000,[[31078671,null,[2,[[4,null,69,null,null,null,null,[\"shared-storage\"]],[1,[[4,null,70,null,null,null,null,[\"shared-storage\"]]]]]]]]]]],[10,[[50,[[31067422],[31067423,[[null,1032,null,[]]]],[44776369],[44792510],[44804781],[44806359]],[3,[[4,null,8,null,null,null,null,[\"gmaSdk.getQueryInfo\"]],[4,null,8,null,null,null,null,[\"webkit.messageHandlers.getGmaQueryInfo.postMessage\"]],[4,null,8,null,null,null,null,[\"webkit.messageHandlers.getGmaSig.postMessage\"]]]],69],[1,[[31078995],[31078996,[[45545710,null,null,[1]],[45459826,null,null,[1]],[531007060,null,null,[1]],[45545724,null,null,[1]],[45430975,null,null,[1]],[531582260,null,null,[1]]]]]],[10,[[31079964],[31079965]]],[10,[[31080649],[31080650,[[null,592337179,null,[null,1]]]],[31080651,[[null,592337179,null,[null,2]]]]]],[50,[[31080658],[31080659,[[45615403,null,null,[1]]]]],null,89],[null,[[31080773],[31080774,[[596652146,null,null,[1]]]]]],[10,[[31080779],[31080780,[[null,595730437,null,[null,800]]]]]],[10,[[31080793],[31080794,[[1316,null,null,[1]]]]]],[10,[[31080795],[31080796,[[1315,null,null,[1]]]]]],[10,[[31080797],[31080798,[[600719280,null,null,[1]]]]]],[1000,[[31080817,[[null,null,14,[null,null,\"31080817\"]]],[6,null,null,null,6,null,\"31080817\"]]],[4,null,55],63,null,null,null,null,null,null,null,null,2],[1000,[[31080818,[[null,null,14,[null,null,\"31080818\"]]],[6,null,null,null,6,null,\"31080818\"]]],[4,null,55],63,null,null,null,null,null,null,null,null,2],[10,[[31080819],[31080820,[[561639564,null,null,[1]]]]]],[50,[[31080825],[31080826,[[45615403,null,null,[]]]]],null,89],[1000,[[31080836,[[null,null,14,[null,null,\"31080836\"]]],[6,null,null,null,6,null,\"31080836\"]]],[4,null,55],63,null,null,null,null,null,null,null,null,2],[1000,[[31080837,[[null,null,14,[null,null,\"31080837\"]]],[6,null,null,null,6,null,\"31080837\"]]],[4,null,55],63,null,null,null,null,null,null,null,null,2],[1000,[[31080872,[[null,null,14,[null,null,\"31080872\"]]],[6,null,null,null,6,null,\"31080872\"]]],[4,null,55],63,null,null,null,null,null,null,null,null,2],[1000,[[31080873,[[null,null,14,[null,null,\"31080873\"]]],[6,null,null,null,6,null,\"31080873\"]]],[4,null,55],63,null,null,null,null,null,null,null,null,2],[10,[[31080886],[31080887,[[160889229,null,null,[1]]]]]],[1,[[42531513],[42531514,[[316,null,null,[1]]]]]],[1,[[42531644],[42531645,[[368,null,null,[1]]]],[42531646,[[369,null,null,[1]],[368,null,null,[1]]]]]],[50,[[42531705],[42531706]]],[1,[[42532242],[42532243,[[1256,null,null,[1]],[290,null,null,[1]]]]]],[1,[[42532262],[42532263,[[null,1263,null,[null,16]]]],[42532264,[[null,1263,null,[null,4294967296]]]],[42532265,[[null,1265,null,[null,60]],[null,1264,null,[null,0.2]],[1266,null,null,[1]]]],[42532266,[[null,1263,null,[null,4294967296]],[null,1265,null,[null,60]],[null,1264,null,[null,0.2]],[1266,null,null,[1]]]],[42532267,[[null,1263,null,[null,16]],[null,1265,null,[null,60]],[null,1264,null,[null,0.2]],[1266,null,null,[1]]]],[42532268,[[1266,null,null,[1]]]]]],[1,[[42532360],[42532361,[[1260,null,null,[1]],[1291,null,null,[1]]]]],null,90],[1,[[42532362],[42532363]]],[50,[[42532523],[42532524,[[1300,null,null,[]]]]]],[null,[[42532525],[42532526]]],[1,[[44719338],[44719339,[[334,null,null,[1]],[null,54,null,[null,100]],[null,66,null,[null,10]],[null,65,null,[null,1000]]]]]],[10,[[44776368],[44779257]],[3,[[4,null,8,null,null,null,null,[\"gmaSdk.getQueryInfo\"]],[4,null,8,null,null,null,null,[\"webkit.messageHandlers.getGmaQueryInfo.postMessage\"]],[4,null,8,null,null,null,null,[\"webkit.messageHandlers.getGmaSig.postMessage\"]]]],69],[10,[[44785292],[44785293,[[1239,null,null,[1]]]]]],[10,[[44785294],[44785295]]],[1,[[44795552],[44795553,[[1260,null,null,[1]]]]],null,90],[1,[[44795554],[44795555]]],[100,[[44795921],[44795922,[[1222,null,null,[1]]]],[44798934,[[1222,null,null,[1]]]]]],[1,[[44801778],[44801779,[[506914611,null,null,[1]]]]],[4,null,55]],[1000,[[44802674,[[506852289,null,null,[1]]],[12,null,null,null,2,null,\"smitmehta\\\\.com\/\"]]],[4,null,55]],[50,[[44809003,[[1289,null,null,[1]]]],[44809004,[[1289,null,null,[1]],[null,null,1307,[null,null,\"inhead\"]]]],[44809005,[[1289,null,null,[1]],[null,null,1307,[null,null,\"nohtml\"]]]]]],[50,[[44809530],[44809531,[[1302,null,null,[1]]]]]],[50,[[95320376,[[1309,null,null,[1]]]],[95320377,[[null,null,null,[null,null,null,[\"en\",\"de\",\"fr\"]],null,1273],[1309,null,null,[1]]]],[95320378,[[null,null,null,[null,null,null,[\"en\",\"de\",\"ja\"]],null,1273],[1309,null,null,[1]]]]],null,75],[50,[[95321957,[[null,null,null,[null,null,null,[\"en\",\"de\",\"es\"]],null,1273],[1309,null,null,[1]]]],[95321958,[[null,null,null,[null,null,null,[\"en\",\"de\",\"vi\"]],null,1273],[1309,null,null,[1]]]],[95321963,[[1309,null,null,[1]]]]],null,75],[50,[[95322180,[[null,null,null,[null,null,null,[\"en\",\"de\",\"pt\"]],null,1273],[1309,null,null,[1]]]],[95322181,[[null,null,null,[null,null,null,[\"en\",\"de\",\"ar\"]],null,1273],[1309,null,null,[1]]]],[95322182,[[null,null,null,[null,null,null,[\"en\",\"de\",\"hi\"]],null,1273],[1309,null,null,[1]]]],[95322183,[[null,null,null,[null,null,null,[\"en\",\"de\",\"it\"]],null,1273],[1309,null,null,[1]]]],[95322184,[[null,null,null,[null,null,null,[\"en\",\"de\",\"pl\"]],null,1273],[1309,null,null,[1]]]],[95322195,[[null,null,null,[null,null,null,[\"en\",\"de\",\"ko\"]],null,1273],[1309,null,null,[1]]]],[95322329,[[1309,null,null,[1]]]]],null,75],[10,[[95322433],[95322434]]],[10,[[95322745],[95322746,[[1271,null,null,[1]]]],[95322747,[[1272,null,null,[1]]]],[95322748,[[1271,null,null,[1]],[1272,null,null,[1]]]]]],[100,[[95323722],[95323723,[[600455846,null,null,[1]]]],[95323724,[[600455847,null,null,[1]]]]],[2,[[4,null,55],[12,null,null,null,4,null,\"Firefox|FxiOS\",[\"navigator.userAgent\"]]]]],[50,[[95323760,[[1309,null,null,[1]]]],[95323761,[[null,null,null,[null,null,null,[\"en\",\"de\",\"nl\"]],null,1273],[1309,null,null,[1]]]]],null,75]]],[11,[[1000,[[31080775,null,[4,null,6,null,null,null,null,[\"31080773\"]]]],[4,null,61],107,null,null,null,null,null,null,null,null,18],[1000,[[31080776,null,[4,null,6,null,null,null,null,[\"31080774\"]]]],[4,null,61],107,null,null,null,null,null,null,null,null,18]]],[17,[[100,[[95320868],[95320869,[[597181299,null,null,[1]],[1120,null,null,[1]]]],[95320870,[[1120,null,null,[1]]]]],[4,null,55],null,null,null,null,null,null,133],[10,[[95321865],[95321866,[[566279275,null,null,[1]]]],[95321867,[[566279276,null,null,[1]]]],[95321868,[[566279275,null,null,[1]],[566279276,null,null,[1]]]]],[4,null,55],null,null,null,null,null,null,145],[1,[[95322388,null,[2,[[5,null,8,null,null,null,null,[\"localStorage\"]],[4,null,8,null,null,null,null,[\"localStorage\"]]]]],[95322389,null,[2,[[5,null,8,null,null,null,null,[\"localStorage\"]],[4,null,8,null,null,null,null,[\"localStorage\"]]]]],[95322390,null,[2,[[5,null,8,null,null,null,null,[\"localStorage\"]],[4,null,8,null,null,null,null,[\"localStorage\"]]]]],[95322391,null,[2,[[5,null,8,null,null,null,null,[\"localStorage\"]],[4,null,8,null,null,null,null,[\"localStorage\"]]]]]],null,null,null,null,null,null,null,144],[1,[[95322397],[95322398,[[null,595645509,null,[null,0.2]]]],[95322399,[[null,595645509,null,[null,0.4]]]]],[4,null,55],null,null,null,null,null,null,140],[10,[[95322897],[95322898]],null,null,null,null,32,null,null,142,1],[166,[[95323004],[95323005,[[null,null,589752731,[null,null,\"#FFFFFF\"]],[null,null,589752730,[null,null,\"#1A73E8\"]]]],[95323006,[[595118933,null,null,[1]]]],[95323007,[[595118933,null,null,[1]],[null,null,589752731,[null,null,\"#FFFFFF\"]],[null,null,589752730,[null,null,\"#1A73E8\"]]]],[95323008,[[595989603,null,null,[1]]]],[95323009,[[595118932,null,null,[1]]]]],[4,null,55],null,null,null,null,null,null,143],[1,[[95323904],[95324019,[[null,null,null,[null,null,null,[\"1\",\"2\",\"4\",\"6\",\"8\"]],null,556791602]]],[95324020,[[null,null,null,[null,null,null,[\"1\",\"2\",\"4\",\"6\",\"11\"]],null,556791602]]],[95324021,[[null,null,null,[null,null,null,[\"1\",\"2\",\"4\",\"6\",\"13\"]],null,556791602]]],[95324022,[[null,null,null,[null,null,null,[\"1\",\"2\",\"4\",\"6\",\"16\"]],null,556791602]]],[95324023,[[null,null,null,[null,null,null,[\"1\",\"2\",\"4\",\"6\",\"9\",\"10\"]],null,556791602]]],[95324024,[[null,null,null,[null,null,null,[\"1\",\"2\",\"4\",\"6\",\"9\",\"17\"]],null,556791602]]]],[4,null,55],null,null,null,null,null,null,146]]]],null,null,[null,1000,1,1000]],[1,[],null,null,null,null,null,null,\"ca-pub-2130961341954082\"],null,null,1,null,1500428938,[44759876,44759927,44759837]]");
