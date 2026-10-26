"""Trace a bitmap logotype into exact lines and circular arcs.

The source is a raster of a geometric logo, so the reconstruction is done in
two stages: sub-pixel contours are pulled out of the greyscale with marching
squares, then every contour is fitted with lines and arcs. Sharp corners are
found on the raw contour and rebuilt as the exact intersection of the two
neighbouring primitives, which removes the ~1px rounding that rasterising
introduced. The result matches the bitmap to well under half a pixel.

Pure Python: the caller supplies the greyscale, nothing else is imported.
"""
import math

# ---------------------------------------------------------------- contours


def _interp(a, b, level):
    """Parameter in (0,1) where the segment a->b crosses `level`."""
    if b == a:
        return 0.5
    t = (level - a) / (b - a)
    return min(max(t, 1e-9), 1.0 - 1e-9)


def extract_contours(gray, level):
    """Sub-pixel iso-contours of `gray` at `level`.

    Returns closed loops of (x, y) points in pixel coordinates: pixel (i, j)
    covers [i, i+1] x [j, j+1] and its centre is (i+0.5, j+0.5). y grows
    downward, as in the image.
    """
    h = len(gray)
    w = len(gray[0])

    def h_cross(x, y):
        return (x + 0.5 + _interp(gray[y][x], gray[y][x + 1], level), y + 0.5)

    def v_cross(x, y):
        return (x + 0.5, y + 0.5 + _interp(gray[y][x], gray[y + 1][x], level))

    segs = []
    for y in range(h - 1):
        row0, row1 = gray[y], gray[y + 1]
        for x in range(w - 1):
            v = [row0[x], row0[x + 1], row1[x + 1], row1[x]]
            ins = [vi < level for vi in v]
            n = sum(ins)
            if n == 0 or n == 4:
                continue
            # corners clockwise in image space: 0=(x,y) 1=(x+1,y) 2=(x+1,y+1) 3=(x,y+1)
            def cross_of(i, x=x, y=y):
                if i == 0:
                    return h_cross(x, y)
                if i == 1:
                    return v_cross(x + 1, y)
                if i == 2:
                    return h_cross(x, y + 1)
                return v_cross(x, y)

            flip = [i for i in range(4) if ins[i] != ins[(i + 1) % 4]]
            if len(flip) == 2:
                segs.append((cross_of(flip[0]), cross_of(flip[1])))
            else:
                # saddle: cut off each inside corner separately
                c = [cross_of(i) for i in range(4)]
                if ins[0]:
                    segs.append((c[3], c[0]))
                    segs.append((c[1], c[2]))
                else:
                    segs.append((c[0], c[1]))
                    segs.append((c[2], c[3]))

    adj = {}
    for a, b in segs:
        adj.setdefault(a, []).append(b)
        adj.setdefault(b, []).append(a)
    used = set()
    loops = []
    for a, b in segs:
        if (a, b) in used:
            continue
        loop = [a]
        prev, cur = a, b
        used.add((a, b))
        used.add((b, a))
        guard = len(segs) + 4
        while cur != a and guard > 0:
            guard -= 1
            loop.append(cur)
            cands = [n for n in adj[cur] if (cur, n) not in used]
            if not cands:
                break
            if len(cands) == 1:
                nxt = cands[0]
            else:
                # ambiguous junction: carry straight on
                dx, dy = cur[0] - prev[0], cur[1] - prev[1]
                m = math.hypot(dx, dy) or 1.0
                dx, dy = dx / m, dy / m
                best, nxt = -2.0, cands[0]
                for c in cands:
                    ex, ey = c[0] - cur[0], c[1] - cur[1]
                    mm = math.hypot(ex, ey) or 1.0
                    d = (dx * ex + dy * ey) / mm
                    if d > best:
                        best, nxt = d, c
            used.add((cur, nxt))
            used.add((nxt, cur))
            prev, cur = cur, nxt
        if len(loop) > 2 and cur == a:
            loops.append(loop)
    return loops


def signed_area(loop):
    s = 0.0
    n = len(loop)
    for i in range(n):
        x0, y0 = loop[i]
        x1, y1 = loop[(i + 1) % n]
        s += x0 * y1 - x1 * y0
    return s / 2


def point_in_loop(loop, p):
    x, y = p
    inside = False
    n = len(loop)
    for i in range(n):
        x0, y0 = loop[i]
        x1, y1 = loop[(i + 1) % n]
        if (y0 > y) != (y1 > y):
            xi = x0 + (y - y0) * (x1 - x0) / (y1 - y0)
            if x < xi:
                inside = not inside
    return inside


def smooth(loop, half=2):
    """Moving average over a closed loop. Kills the raster staircase on
    diagonals and curves; corners are detected before this is applied."""
    n = len(loop)
    if half <= 0 or n < 2 * half + 1:
        return list(loop)
    k = 2 * half + 1
    out = []
    for i in range(n):
        sx = sy = 0.0
        for d in range(-half, half + 1):
            p = loop[(i + d) % n]
            sx += p[0]
            sy += p[1]
        out.append((sx / k, sy / k))
    return out


# ---------------------------------------------------------------- fitting


def fit_line(p):
    """Total-least-squares line. Returns (point, unit direction, rms)."""
    n = len(p)
    mx = sum(q[0] for q in p) / n
    my = sum(q[1] for q in p) / n
    sxx = sum((q[0] - mx) ** 2 for q in p)
    syy = sum((q[1] - my) ** 2 for q in p)
    sxy = sum((q[0] - mx) * (q[1] - my) for q in p)
    theta = 0.5 * math.atan2(2 * sxy, sxx - syy)
    dx, dy = math.cos(theta), math.sin(theta)
    rms = math.sqrt(sum((dy * (q[0] - mx) - dx * (q[1] - my)) ** 2 for q in p) / n)
    return (mx, my), (dx, dy), rms


def fit_circle(p):
    """Algebraic (Kasa) circle fit. Returns (cx, cy, r, rms) or None."""
    n = len(p)
    sx = sum(q[0] for q in p)
    sy = sum(q[1] for q in p)
    sxx = sum(q[0] ** 2 for q in p)
    syy = sum(q[1] ** 2 for q in p)
    sxy = sum(q[0] * q[1] for q in p)
    sxz = sum(q[0] * (q[0] ** 2 + q[1] ** 2) for q in p)
    syz = sum(q[1] * (q[0] ** 2 + q[1] ** 2) for q in p)
    sz = sum(q[0] ** 2 + q[1] ** 2 for q in p)
    A = [[sxx, sxy, sx], [sxy, syy, sy], [sx, sy, n]]
    B = [sxz, syz, sz]

    def det3(m):
        return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
                - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))

    D = det3(A)
    if abs(D) < 1e-12:
        return None
    sol = []
    for col in range(3):
        M = [row[:] for row in A]
        for i in range(3):
            M[i][col] = B[i]
        sol.append(det3(M) / D)
    cx, cy = sol[0] / 2, sol[1] / 2
    r2 = sol[2] + cx * cx + cy * cy
    if r2 <= 0:
        return None
    r = math.sqrt(r2)
    rms = math.sqrt(sum((math.hypot(q[0] - cx, q[1] - cy) - r) ** 2 for q in p) / n)
    return cx, cy, r, rms


def wrap(a):
    while a > math.pi:
        a -= 2 * math.pi
    while a < -math.pi:
        a += 2 * math.pi
    return a


class Line:
    kind = "line"

    def __init__(self, p, d):
        self.p = p
        self.d = d
        self.n = (-d[1], d[0])

    def point_at(self, t):
        return (self.p[0] + self.d[0] * t, self.p[1] + self.d[1] * t)

    def tangent_at(self, q):
        return self.d


class Arc:
    kind = "arc"

    def __init__(self, c, r, a0, a1, ccw):
        self.c = c
        self.r = r
        self.a0 = a0
        self.a1 = a1
        self.ccw = ccw

    def point_at_angle(self, a):
        return (self.c[0] + self.r * math.cos(a), self.c[1] + self.r * math.sin(a))

    def angle_of(self, q):
        return math.atan2(q[1] - self.c[1], q[0] - self.c[0])

    def tangent_at(self, q):
        a = self.angle_of(q)
        t = (-math.sin(a), math.cos(a))
        return t if self.ccw else (-t[0], -t[1])


def _fit_line_model(p):
    (mx, my), (dx, dy), _ = fit_line(p)
    line = Line((mx, my), (dx, dy))
    return line, [abs(line.n[0] * (q[0] - mx) + line.n[1] * (q[1] - my)) for q in p]


def _fit_arc_model(p):
    res = fit_circle(p)
    if res is None:
        return None, None
    cx, cy, r, _ = res
    errs = [abs(math.hypot(q[0] - cx, q[1] - cy) - r) for q in p]
    total = 0.0
    for i in range(len(p) - 1):
        a = math.atan2(p[i][1] - cy, p[i][0] - cx)
        b = math.atan2(p[i + 1][1] - cy, p[i + 1][0] - cx)
        total += wrap(b - a)
    a0 = math.atan2(p[0][1] - cy, p[0][0] - cx)
    a1 = math.atan2(p[-1][1] - cy, p[-1][0] - cx)
    return Arc((cx, cy), r, a0, a1, total > 0), errs


def best_model(p):
    """Choose a line or an arc for a run of points."""
    if len(p) < 3:
        return _fit_line_model(p)
    line, lerr = _fit_line_model(p)
    lmax = max(lerr)
    arc, aerr = _fit_arc_model(p) if len(p) >= 6 else (None, None)
    if arc is None:
        return line, lerr
    chord = math.hypot(p[-1][0] - p[0][0], p[-1][1] - p[0][1])
    amax = max(aerr)
    # A line is a circle of infinite radius, so an arc can always shave a
    # little off the error by bowing along raster noise: require it to be
    # clearly better, or genuinely tight, before preferring it.
    if lmax < 0.25 or lmax < 0.55 * amax or (chord > 0 and arc.r > 15 * chord):
        return line, lerr
    return arc, aerr


def _segment(p, tol, min_len, depth=0):
    """Split a run into contiguous position ranges [lo, hi]; hi is shared with
    the next range so the primitives stay connected."""
    m = len(p)
    if m < 2:
        return [(0, m - 1)]
    model, errs = best_model(p)
    if max(errs) <= tol or m <= 2 * min_len or depth > 16:
        return [(0, m - 1)]
    k = max(range(m), key=lambda i: errs[i])
    mid = len(p) // 2 if (k <= 0 or k >= m - 1) else k
    mid = max(min_len, min(m - min_len, mid))
    if mid <= 0 or mid >= m - 1:
        return [(0, m - 1)]
    left = _segment(p[: mid + 1], tol, min_len, depth + 1)
    right = [(a + mid, b + mid) for a, b in _segment(p[mid:], tol, min_len, depth + 1)]
    return left + right


def _cost(p, lo, hi):
    _, errs = best_model(p[lo:hi + 1])
    return sum(e * e for e in errs)


def _refine(p, ranges, search=5):
    """Slide each internal boundary to where the two fits are jointly best."""
    ranges = [list(r) for r in ranges]
    for _ in range(2):
        for i in range(len(ranges) - 1):
            lo, hi, base = ranges[i][0], ranges[i + 1][1], ranges[i][1]
            best, best_cost = None, None
            for d in range(-search, search + 1):
                b = base + d
                if b <= lo + 1 or b >= hi - 1:
                    continue
                tot = _cost(p, lo, b) + _cost(p, b, hi)
                if best_cost is None or tot < best_cost:
                    best_cost, best = tot, b
            if best is not None:
                ranges[i][1] = best
                ranges[i + 1][0] = best
    return [tuple(r) for r in ranges]


def _compatible(m1, cand, ang_tol_deg, dist_tol):
    if m1.kind != cand.kind:
        return False
    if m1.kind == "line":
        a1 = math.atan2(m1.d[1], m1.d[0])
        a2 = math.atan2(cand.d[1], cand.d[0])
        ang = math.degrees(abs(wrap(a2 - a1)))
        return min(ang, 180 - ang) <= ang_tol_deg
    return (abs(cand.r - m1.r) <= dist_tol and
            math.hypot(cand.c[0] - m1.c[0], cand.c[1] - m1.c[1]) <= dist_tol)


def merge(prims, ang_tol_deg=3.0, dist_tol=0.3):
    """Join adjacent primitives that describe one feature."""
    out = list(prims)
    changed = True
    while changed and len(out) > 1:
        changed = False
        new, i = [], 0
        while i < len(out):
            if i + 1 < len(out):
                m1, p1 = out[i]
                m2, p2 = out[i + 1]
                if m1.kind == m2.kind:
                    ppt = p1 + p2[1:]
                    cand, errs = best_model(ppt)
                    if (cand.kind == m1.kind and max(errs) <= dist_tol and
                            _compatible(m1, cand, ang_tol_deg, dist_tol)):
                        new.append((cand, ppt))
                        i += 2
                        changed = True
                        continue
            new.append(out[i])
            i += 1
        out = new
    return out


def intersect(m1, m2, near):
    """Where two primitive supports cross, nearest to `near`."""
    def pick(cands):
        if not cands:
            return None
        return min(cands, key=lambda q: math.hypot(q[0] - near[0], q[1] - near[1]))

    if m1.kind == "line" and m2.kind == "line":
        d1, d2 = m1.d, m2.d
        den = d1[0] * d2[1] - d1[1] * d2[0]
        if abs(den) < 1e-12:
            return None
        dx, dy = m2.p[0] - m1.p[0], m2.p[1] - m1.p[1]
        return m1.point_at((dx * d2[1] - dy * d2[0]) / den)

    if m1.kind == "arc" and m2.kind == "arc":
        (x1, y1), r1 = m1.c, m1.r
        (x2, y2), r2 = m2.c, m2.r
        d = math.hypot(x2 - x1, y2 - y1)
        if d < 1e-9 or d > r1 + r2 or d < abs(r1 - r2):
            return None
        a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
        h2 = r1 * r1 - a * a
        if h2 < 0:
            return None
        h = math.sqrt(h2)
        xm, ym = x1 + a * (x2 - x1) / d, y1 + a * (y2 - y1) / d
        rx, ry = -(y2 - y1) * (h / d), (x2 - x1) * (h / d)
        return pick([(xm + rx, ym + ry), (xm - rx, ym - ry)])

    arc, line = (m1, m2) if m1.kind == "arc" else (m2, m1)
    (cx, cy), r = arc.c, arc.r
    px, py = line.p
    dx, dy = line.d
    fx, fy = px - cx, py - cy
    b = 2 * (fx * dx + fy * dy)
    c = fx * fx + fy * fy - r * r
    disc = b * b - 4 * c
    if disc < 0:
        return None
    sq = math.sqrt(disc)
    return pick([line.point_at((-b + sq) / 2), line.point_at((-b - sq) / 2)])


def _join(m1, m2, near, max_dist=5.0):
    """Where two neighbouring primitives meet. Near-parallel supports can
    cross far away, so fall back to the traced point in that case."""
    q = intersect(m1, m2, near)
    if q is None or math.hypot(q[0] - near[0], q[1] - near[1]) > max_dist:
        return near
    return q


def _angle_between(m1, m2, p):
    t1, t2 = m1.tangent_at(p), m2.tangent_at(p)
    dot = max(-1.0, min(1.0, t1[0] * t2[0] + t1[1] * t2[1]))
    return math.degrees(math.acos(dot))


def _turn_angles(pts, k=1):
    n = len(pts)
    th = []
    for i in range(n):
        x0, y0 = pts[(i - k) % n]
        x1, y1 = pts[(i + k) % n]
        th.append(math.atan2(y1 - y0, x1 - x0))
    return [wrap(th[(i + 1) % n] - th[i]) for i in range(n)]


def _corner_peaks(pts, thresh_deg=45.0, split_deg=100.0, min_turn_deg=15.0):
    """Indices where the contour turns sharply.

    A sharp corner flags a run of neighbouring points because the detector
    window is wider than the corner, so flagged runs are walked while
    accumulating turn: each time the accumulation passes split_deg a further
    corner is emitted. That keeps one 90 deg corner as a single corner while
    still resolving two corners joined by a short edge, like the end of a
    crossbar.
    """
    n = len(pts)
    ta = _turn_angles(pts, k=1)
    thr = math.radians(thresh_deg)
    flagged = set()
    for i in range(n):
        s = sum(ta[(i + d) % n] for d in range(-2, 3))
        if abs(s) > thr:
            flagged.add(i)
    peaks = []
    i = 0
    while i < n:
        if i not in flagged:
            i += 1
            continue
        grp = [i]
        j = i + 1
        while j < n and j in flagged:
            grp.append(j)
            j += 1
        cum, start = 0.0, 0
        for k, idx in enumerate(grp):
            cum += ta[idx]
            if abs(cum) > math.radians(split_deg) or k == len(grp) - 1:
                pk = max(grp[start:k + 1], key=lambda q: abs(ta[q]))
                if abs(ta[pk]) > math.radians(min_turn_deg):
                    peaks.append(pk)
                cum, start = 0.0, k + 1
        i = j
    if len(peaks) > 1 and (peaks[0] - peaks[-1]) % n <= 2:
        if abs(ta[peaks[-1]]) > abs(ta[peaks[0]]):
            peaks[0] = peaks[-1]
        peaks.pop()
    return peaks


def fit_loop(pts, corner_deg=45.0, tol=0.3, tol_global=0.85, smooth_half=2,
             min_len=6):
    """Fit one closed contour.

    Returns a list of primitives in loop order; each has a `model`
    (Line/Arc) plus `start`/`end` points, or `closed=True` for a contour that
    is a single full circle.
    """
    n = len(pts)
    spts = smooth(pts, smooth_half)
    whole, werrs = best_model(spts)
    if whole.kind == "arc" and max(werrs) <= tol_global:
        return [dict(model=whole, start=None, end=None, closed=True,
                     in_ang=0.0, out_ang=0.0)]

    peaks = _corner_peaks(pts, thresh_deg=corner_deg)
    runs = []
    if not peaks:
        runs.append(list(range(n)))
    else:
        for j in range(len(peaks)):
            a, b = peaks[j], peaks[(j + 1) % len(peaks)]
            idx = []
            i = (a + 1) % n
            guard = 0
            while i != b and guard <= n:
                idx.append(i)
                i = (i + 1) % n
                guard += 1
            if len(idx) >= 2:
                runs.append(idx)

    prims = []
    for idx in runs:
        p = [spts[i] for i in idx]
        ranges = _segment(p, tol, min_len)
        if len(ranges) > 1:
            ranges = _refine(p, ranges)
        pieces = []
        for lo, hi in ranges:
            model, _ = best_model(p[lo:hi + 1])
            pieces.append((model, p[lo:hi + 1]))
        # fragments shorter than a few px are corner rounding, not geometry:
        # dropping them lets the two real neighbours meet at a sharp corner
        pieces = [pc for pc in pieces if len(pc[1]) >= 5] or pieces
        prims.extend(merge(pieces))

    out = []
    m = len(prims)
    for i in range(m):
        model, p = prims[i]
        prev_model = prims[(i - 1) % m][0]
        next_model = prims[(i + 1) % m][0]
        p_start, p_end = p[0], p[-1]
        s = _join(prev_model, model, p_start) if m > 1 else p_start
        e = _join(model, next_model, p_end) if m > 1 else p_end
        out.append(dict(model=model, start=s, end=e, closed=False,
                        in_ang=_angle_between(prev_model, model, p_start),
                        out_ang=_angle_between(model, next_model, p_end)))
    return out


# ---------------------------------------------------------------- output


def to_segments(prims, arc_step_deg=90.0):
    """Primitives -> ('L', p0, p1) | ('C', p0, c1, c2, p1) segments."""
    segs = []

    def cubic_arc(m, a0, sweep, nseg):
        # k carries the sign of the sweep, which is what flips the tangent
        # direction for clockwise arcs; scaling it by sign(sweep) as well
        # would mirror the control points to the wrong side of the chord.
        da = sweep / nseg
        k = 4.0 / 3.0 * math.tan(da / 4)
        for i in range(nseg):
            b0, b1 = a0 + da * i, a0 + da * (i + 1)
            q0, q1 = m.point_at_angle(b0), m.point_at_angle(b1)
            t0 = (-math.sin(b0), math.cos(b0))
            t1 = (-math.sin(b1), math.cos(b1))
            segs.append(("C", q0,
                         (q0[0] + k * m.r * t0[0], q0[1] + k * m.r * t0[1]),
                         (q1[0] - k * m.r * t1[0], q1[1] - k * m.r * t1[1]),
                         q1))

    for pr in prims:
        m = pr["model"]
        if pr.get("closed"):
            cubic_arc(m, m.a0, 2 * math.pi, max(4, int(math.ceil(360.0 / arc_step_deg))))
            continue
        p0, p1 = pr["start"], pr["end"]
        if m.kind == "line":
            segs.append(("L", p0, p1))
            continue
        a0 = m.angle_of(p0)
        sweep = m.angle_of(p1) - a0
        if m.ccw:
            while sweep <= 0:
                sweep += 2 * math.pi
        else:
            while sweep >= 0:
                sweep -= 2 * math.pi
        nseg = max(1, int(math.ceil(abs(math.degrees(sweep)) / arc_step_deg)))
        cubic_arc(m, a0, sweep, nseg)
    return segs


def flatten(segs, steps=16):
    """Segments -> a dense polyline, for rendering and area checks."""
    pts = []
    for s in segs:
        if s[0] == "L":
            pts.append(s[1])
            pts.append(s[2])
            continue
        _, p0, c1, c2, p3 = s
        pts.append(p0)
        for i in range(1, steps + 1):
            t = i / steps
            mt = 1 - t
            pts.append((
                mt ** 3 * p0[0] + 3 * mt ** 2 * t * c1[0] + 3 * mt * t ** 2 * c2[0] + t ** 3 * p3[0],
                mt ** 3 * p0[1] + 3 * mt ** 2 * t * c1[1] + 3 * mt * t ** 2 * c2[1] + t ** 3 * p3[1],
            ))
    return pts


def max_deviation(prims, raw_pts):
    """Largest distance from any traced point to the fitted outline (px)."""
    poly = flatten(to_segments(prims))
    if len(poly) < 2:
        return 1e9
    segs = [(poly[i], poly[i + 1]) for i in range(len(poly) - 1)]
    segs.append((poly[-1], poly[0]))     # contours are closed
    worst = 0.0
    for p in raw_pts:
        best = 1e9
        for a, b in segs:
            dx, dy = b[0] - a[0], b[1] - a[1]
            L2 = dx * dx + dy * dy
            if L2 == 0:
                d = math.hypot(p[0] - a[0], p[1] - a[1])
            else:
                t = max(0.0, min(1.0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2))
                d = math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))
            if d < best:
                best = d
        worst = max(worst, best)
    return worst
