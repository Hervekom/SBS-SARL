"""Génère les visuels SVG (produits, catégories, hero) pour SBS SARL.
Style : studio blanc, disque orange façon logo, accents or & noir."""
import os, sys

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

ORANGE = "#F26B1D"
ORANGE_L = "#F99A4E"
BROWN = "#7A2E0B"
GOLD = "#D4A017"
GOLD_L = "#F2CF5B"
NOIR = "#111111"

_uid = [0]
def uid(p="g"):
    _uid[0] += 1
    return f"{p}{_uid[0]}"

def defs_common():
    return f"""
  <radialGradient id="bgGrad" cx="50%" cy="42%" r="75%">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F1F1F1"/>
  </radialGradient>
  <linearGradient id="discGrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FFE3CC"/><stop offset="1" stop-color="#FFC59A"/>
  </linearGradient>
  <linearGradient id="discStrong" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="{ORANGE_L}"/><stop offset=".55" stop-color="{ORANGE}"/><stop offset="1" stop-color="{BROWN}"/>
  </linearGradient>
  <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="{GOLD_L}"/><stop offset=".5" stop-color="{GOLD}"/><stop offset="1" stop-color="#9C7410"/>
  </linearGradient>
  <linearGradient id="wall1" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="{ORANGE_L}"/><stop offset=".45" stop-color="{ORANGE}"/><stop offset="1" stop-color="#1A0A03"/>
  </linearGradient>
  <linearGradient id="wall2" x1="0" y1="1" x2="1" y2="0">
    <stop offset="0" stop-color="#0E0E10"/><stop offset=".6" stop-color="#3A2A10"/><stop offset="1" stop-color="{GOLD}"/>
  </linearGradient>
  <linearGradient id="wall3" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2B2F6B"/><stop offset=".5" stop-color="#7B3FA0"/><stop offset="1" stop-color="{ORANGE}"/>
  </linearGradient>
  <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset=".35" stop-color="#FFFFFF" stop-opacity="0"/>
    <stop offset=".6" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".25"/>
  </linearGradient>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".22"/>
  </filter>
  <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#000" flood-opacity=".18"/>
  </filter>"""

def metal(id_, c1, c2, c3=None):
    c3 = c3 or c1
    return f"""<linearGradient id="{id_}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="{c2}"/><stop offset=".15" stop-color="{c1}"/><stop offset=".5" stop-color="{c3}"/>
    <stop offset=".85" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient>"""

def backdrop(w, h, cx=None, cy=None, r=None, strong=False):
    cx = cx or w / 2; cy = cy or h * 0.47; r = r or min(w, h) * 0.36
    fill = "url(#discStrong)" if strong else "url(#discGrad)"
    return f"""<rect width="{w}" height="{h}" fill="url(#bgGrad)"/>
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"/>
  <circle cx="{cx + r*0.92}" cy="{cy - r*0.95}" r="{r*0.09}" fill="{ORANGE}" opacity=".9"/>
  <circle cx="{cx - r*1.02}" cy="{cy - r*0.55}" r="{r*0.05}" fill="{GOLD}"/>
  <circle cx="{cx - r*0.75}" cy="{cy + r*0.95}" r="{r*0.035}" fill="{NOIR}"/>
  <ellipse cx="{w/2}" cy="{h*0.88}" rx="{w*0.28}" ry="{h*0.025}" fill="#000" opacity=".07"/>"""

def svg(w, h, body, extra_defs=""):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
<defs>{defs_common()}
{extra_defs}
</defs>
{body}
</svg>"""

# ---------------------------------------------------------------- objets
def phone_front(x, y, w, h, frame="#1B1B1D", wall="url(#wall1)", rot=0, island=True, notch_dot=False, label=True):
    r = w * 0.16
    bez = w * 0.045
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    s = f'<g {t} filter="url(#shadow)">'
    s += f'<rect x="{-w*0.012}" y="{h*0.2}" width="{w*0.02}" height="{h*0.08}" rx="2" fill="{frame}"/>'
    s += f'<rect x="{w*0.992}" y="{h*0.24}" width="{w*0.02}" height="{h*0.12}" rx="2" fill="{frame}"/>'
    s += f'<rect width="{w}" height="{h}" rx="{r}" fill="{frame}"/>'
    s += f'<rect x="{bez}" y="{bez}" width="{w-2*bez}" height="{h-2*bez}" rx="{r-bez}" fill="{wall}"/>'
    # motifs du fond d'écran
    s += f'<circle cx="{w*0.78}" cy="{h*0.3}" r="{w*0.38}" fill="#FFFFFF" opacity=".08"/>'
    s += f'<circle cx="{w*0.2}" cy="{h*0.78}" r="{w*0.3}" fill="#000" opacity=".12"/>'
    if label:
        s += f'<text x="{w/2}" y="{h*0.23}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="300" font-size="{w*0.2}" fill="#FFF">09:41</text>'
        s += f'<text x="{w/2}" y="{h*0.115}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="{w*0.045}" fill="#FFF" opacity=".85">mardi 21 octobre</text>'
        # dock
        dy = h * 0.86
        s += f'<rect x="{w*0.1}" y="{dy - h*0.045}" width="{w*0.8}" height="{h*0.09}" rx="{w*0.08}" fill="#FFF" opacity=".18"/>'
        for i in range(4):
            cx = w * (0.22 + i * 0.187)
            col = [ORANGE, "#FFF", GOLD, "#25D366"][i]
            s += f'<rect x="{cx - w*0.06}" y="{dy - w*0.06}" width="{w*0.12}" height="{w*0.12}" rx="{w*0.03}" fill="{col}" opacity=".95"/>'
    if island:
        s += f'<rect x="{w*0.36}" y="{bez + h*0.012}" width="{w*0.28}" height="{h*0.03}" rx="{h*0.015}" fill="#000"/>'
    if notch_dot:
        s += f'<circle cx="{w/2}" cy="{bez + h*0.025}" r="{w*0.022}" fill="#000"/>'
    s += f'<rect width="{w}" height="{h}" rx="{r}" fill="url(#glassSheen)"/>'
    s += '</g>'
    return s

def phone_back(x, y, w, h, body, frame=None, cam="pro", rot=0, logo=None, cam_color="#1A1A1A"):
    frame = frame or body
    r = w * 0.16
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    s = f'<g {t} filter="url(#shadow)">'
    s += f'<rect width="{w}" height="{h}" rx="{r}" fill="{frame}"/>'
    s += f'<rect x="{w*0.025}" y="{w*0.025}" width="{w*0.95}" height="{h - w*0.05}" rx="{r*0.9}" fill="{body}"/>'
    s += f'<rect width="{w}" height="{h}" rx="{r}" fill="url(#glassSheen)" opacity=".7"/>'

    def lens(cx, cy, rr):
        return (f'<circle cx="{cx}" cy="{cy}" r="{rr}" fill="#2A2A2C" stroke="{frame}" stroke-width="{rr*0.18}"/>'
                f'<circle cx="{cx}" cy="{cy}" r="{rr*0.62}" fill="#0B0B12"/>'
                f'<circle cx="{cx}" cy="{cy}" r="{rr*0.35}" fill="#1D2240"/>'
                f'<circle cx="{cx - rr*0.22}" cy="{cy - rr*0.22}" r="{rr*0.14}" fill="#FFF" opacity=".55"/>')
    if cam == "pro":  # îlot carré 3 objectifs
        m = w * 0.06; sz = w * 0.46
        s += f'<rect x="{m}" y="{m}" width="{sz}" height="{sz}" rx="{sz*0.26}" fill="{body}" stroke="#000" stroke-opacity=".12" stroke-width="2"/>'
        s += f'<rect x="{m}" y="{m}" width="{sz}" height="{sz}" rx="{sz*0.26}" fill="#FFF" opacity=".12"/>'
        rr = sz * 0.2
        s += lens(m + sz*0.3, m + sz*0.28, rr) + lens(m + sz*0.3, m + sz*0.72, rr) + lens(m + sz*0.74, m + sz*0.5, rr)
        s += f'<circle cx="{m + sz*0.76}" cy="{m + sz*0.2}" r="{sz*0.06}" fill="#FFF6D8"/>'
    elif cam == "vertical":  # objectifs alignés (Samsung)
        cx = w * 0.2; rr = w * 0.085
        for i in range(3):
            s += lens(cx, w*0.17 + i * rr * 2.5, rr)
        s += f'<circle cx="{cx + rr*2}" cy="{w*0.17}" r="{rr*0.3}" fill="#FFF6D8"/>'
    elif cam == "ring":  # grand module rond (Tecno/Infinix/Xiaomi)
        cx = w * 0.5; cy = w * 0.42; R = w * 0.3
        s += f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="{cam_color}" stroke="url(#goldGrad)" stroke-width="{w*0.02}"/>'
        s += lens(cx - R*0.42, cy - R*0.3, R*0.3) + lens(cx + R*0.42, cy - R*0.3, R*0.3) + lens(cx, cy + R*0.42, R*0.3)
    elif cam == "rect":  # module rectangulaire coin
        m = w * 0.07; ww = w * 0.36; hh = w * 0.56
        s += f'<rect x="{m}" y="{m}" width="{ww}" height="{hh}" rx="{ww*0.3}" fill="{cam_color}"/>'
        s += lens(m + ww/2, m + hh*0.25, ww*0.3) + lens(m + ww/2, m + hh*0.68, ww*0.3)
    if logo:
        s += f'<text x="{w/2}" y="{h*0.7}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" letter-spacing="2" font-size="{w*0.085}" fill="#000" opacity=".28">{logo}</text>'
    s += '</g>'
    return s

def watch_square(x, y, s_, strap="#1A1A1A", case="#2A2A2C", face="url(#wall1)", rot=0, crown_col=None):
    w = s_; h = s_ * 1.18
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#shadow)">'
    sw = w * 0.62
    out += f'<rect x="{(w-sw)/2}" y="{-h*0.62}" width="{sw}" height="{h*0.8}" rx="{sw*0.2}" fill="{strap}"/>'
    out += f'<rect x="{(w-sw)/2}" y="{h*0.82}" width="{sw}" height="{h*0.8}" rx="{sw*0.2}" fill="{strap}"/>'
    for i in range(4):
        out += f'<circle cx="{w/2}" cy="{h*1.12 + i*h*0.13}" r="{w*0.025}" fill="#000" opacity=".35"/>'
    out += f'<rect x="{w*0.98}" y="{h*0.3}" width="{w*0.07}" height="{h*0.16}" rx="{w*0.03}" fill="{crown_col or case}"/>'
    out += f'<rect width="{w}" height="{h}" rx="{w*0.28}" fill="{case}"/>'
    out += f'<rect x="{w*0.07}" y="{w*0.07}" width="{w*0.86}" height="{h - w*0.14}" rx="{w*0.22}" fill="#000"/>'
    out += f'<rect x="{w*0.12}" y="{w*0.12}" width="{w*0.76}" height="{h - w*0.24}" rx="{w*0.18}" fill="{face}" opacity=".95"/>'
    out += f'<text x="{w/2}" y="{h*0.56}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="{w*0.26}" fill="#FFF">10:09</text>'
    out += f'<circle cx="{w*0.3}" cy="{h*0.75}" r="{w*0.07}" fill="none" stroke="{GOLD_L}" stroke-width="{w*0.025}"/>'
    out += f'<circle cx="{w*0.5}" cy="{h*0.75}" r="{w*0.07}" fill="none" stroke="#FFF" stroke-width="{w*0.025}"/>'
    out += f'<circle cx="{w*0.7}" cy="{h*0.75}" r="{w*0.07}" fill="none" stroke="#25D366" stroke-width="{w*0.025}"/>'
    out += f'<rect width="{w}" height="{h}" rx="{w*0.28}" fill="url(#glassSheen)" opacity=".8"/>'
    out += '</g>'
    return out

def watch_round(x, y, d, strap="#1A1A1A", case="#C9CCD1", face="#0E0E10", rot=0, accent=ORANGE):
    R = d / 2
    t = f'transform="translate({x},{y}) rotate({rot},{R},{R})"'
    out = f'<g {t} filter="url(#shadow)">'
    sw = d * 0.52
    out += f'<rect x="{R - sw/2}" y="{-d*0.75}" width="{sw}" height="{d}" rx="{sw*0.25}" fill="{strap}"/>'
    out += f'<rect x="{R - sw/2}" y="{d*0.75}" width="{sw}" height="{d}" rx="{sw*0.25}" fill="{strap}"/>'
    out += f'<rect x="{d*0.96}" y="{R - d*0.08}" width="{d*0.07}" height="{d*0.16}" rx="{d*0.02}" fill="{case}"/>'
    out += f'<circle cx="{R}" cy="{R}" r="{R}" fill="{case}"/>'
    out += f'<circle cx="{R}" cy="{R}" r="{R*0.86}" fill="#000"/>'
    out += f'<circle cx="{R}" cy="{R}" r="{R*0.8}" fill="{face}"/>'
    for i in range(12):
        import math
        a = i * math.pi / 6
        x1 = R + math.sin(a) * R * 0.72; y1 = R - math.cos(a) * R * 0.72
        x2 = R + math.sin(a) * R * 0.62; y2 = R - math.cos(a) * R * 0.62
        out += f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#FFF" stroke-width="{d*0.012}" opacity=".8"/>'
    out += f'<text x="{R}" y="{R*1.08}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="{d*0.16}" fill="#FFF">10:09</text>'
    out += f'<path d="M {R - R*0.45} {R*1.35} A {R*0.5} {R*0.5} 0 0 0 {R + R*0.45} {R*1.35}" fill="none" stroke="{accent}" stroke-width="{d*0.03}" stroke-linecap="round"/>'
    out += f'<circle cx="{R}" cy="{R}" r="{R}" fill="url(#glassSheen)" opacity=".6"/>'
    out += '</g>'
    return out

def band(x, y, w, strap="#111", rot=0):
    h = w * 0.42
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#shadow)">'
    out += f'<rect x="{-w*0.55}" y="{h*0.18}" width="{w*2.1}" height="{h*0.64}" rx="{h*0.32}" fill="{strap}"/>'
    out += f'<rect width="{w}" height="{h}" rx="{h/2}" fill="#1E1E20"/>'
    out += f'<rect x="{w*0.06}" y="{h*0.14}" width="{w*0.88}" height="{h*0.72}" rx="{h*0.36}" fill="url(#wall1)"/>'
    out += f'<text x="{w*0.5}" y="{h*0.62}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="{h*0.38}" fill="#FFF">8 452 pas</text>'
    out += f'<rect width="{w}" height="{h}" rx="{h/2}" fill="url(#glassSheen)"/>'
    out += '</g>'
    return out

def case_back(x, y, w, h, col, rot=0, clear=False, phone_body="#4B4F55", cam="pro", rugged=False, magsafe=False):
    r = w * 0.17
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#shadow)">'
    if clear:
        out += phone_back(w*0.035, w*0.035, w*0.93, h - w*0.07, phone_body, cam=cam).replace('filter="url(#shadow)"', '')
        out += f'<rect width="{w}" height="{h}" rx="{r}" fill="#DDEBF7" fill-opacity=".28" stroke="#BCD3E6" stroke-width="{w*0.03}"/>'
        out += f'<rect width="{w}" height="{h}" rx="{r}" fill="url(#glassSheen)"/>'
        if magsafe:
            out += f'<circle cx="{w/2}" cy="{h*0.55}" r="{w*0.24}" fill="none" stroke="#FFF" stroke-opacity=".9" stroke-width="{w*0.035}"/>'
            out += f'<rect x="{w/2 - w*0.02}" y="{h*0.55 + w*0.27}" width="{w*0.04}" height="{w*0.1}" fill="#FFF" opacity=".9"/>'
    else:
        out += f'<rect width="{w}" height="{h}" rx="{r}" fill="{col}"/>'
        if rugged:
            for cx_, cy_ in [(w*0.12,w*0.12),(w*0.88,w*0.12),(w*0.12,h-w*0.12),(w*0.88,h-w*0.12)]:
                out += f'<circle cx="{cx_}" cy="{cy_}" r="{w*0.1}" fill="#000" opacity=".18"/>'
            out += f'<rect width="{w}" height="{h}" rx="{r}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="{w*0.05}"/>'
            out += f'<rect x="{w*0.15}" y="{h*0.42}" width="{w*0.7}" height="{h*0.4}" rx="{w*0.08}" fill="#000" opacity=".12"/>'
            for i in range(5):
                out += f'<line x1="{w*0.22}" y1="{h*(0.47 + i*0.07)}" x2="{w*0.78}" y2="{h*(0.47 + i*0.07)}" stroke="#000" stroke-opacity=".2" stroke-width="{w*0.02}"/>'
        out += f'<rect width="{w}" height="{h}" rx="{r}" fill="url(#glassSheen)" opacity=".7"/>'
        m = w * 0.06; sz = w * 0.48
        out += f'<rect x="{m}" y="{m}" width="{sz}" height="{sz}" rx="{sz*0.27}" fill="#000" opacity=".35"/>'
        rr = sz * 0.19
        for cx_, cy_ in [(0.3,0.28),(0.3,0.72),(0.74,0.5)]:
            out += f'<circle cx="{m + sz*cx_}" cy="{m + sz*cy_}" r="{rr}" fill="#151515"/><circle cx="{m + sz*cx_}" cy="{m + sz*cy_}" r="{rr*0.5}" fill="#1D2240"/>'
    out += '</g>'
    return out

def glass_sheet(x, y, w, h, rot=0, privacy=False):
    r = w * 0.16
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    fill = "#1A1A1A" if privacy else "#E9F4FF"
    op = ".55" if privacy else ".55"
    out = f'<g {t} filter="url(#softShadow)">'
    out += f'<rect width="{w}" height="{h}" rx="{r}" fill="{fill}" fill-opacity="{op}" stroke="#FFFFFF" stroke-width="{w*0.02}"/>'
    out += f'<rect x="{w*0.03}" y="{w*0.03}" width="{w*0.94}" height="{h - w*0.06}" rx="{r*0.85}" fill="none" stroke="#000" stroke-opacity=".75" stroke-width="{w*0.035}"/>'
    out += f'<rect x="{w*0.38}" y="{w*0.05}" width="{w*0.24}" height="{w*0.035}" rx="{w*0.017}" fill="#000" opacity=".5"/>'
    out += f'<path d="M {w*0.1} {h*0.35} L {w*0.55} {h*0.08} L {w*0.75} {h*0.08} L {w*0.1} {h*0.5} Z" fill="#FFF" opacity=".55"/>'
    out += f'<path d="M {w*0.15} {h*0.62} L {w*0.9} {h*0.18} L {w*0.9} {h*0.24} L {w*0.15} {h*0.68} Z" fill="#FFF" opacity=".35"/>'
    out += '</g>'
    return out

def wallet_case(x, y, w, h, col="#3B2416", rot=0):
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#shadow)">'
    # phone visible on the right page
    out += f'<rect width="{w*2.02}" height="{h}" rx="{w*0.12}" fill="{col}"/>'
    out += f'<rect x="{w*0.06}" y="{w*0.06}" width="{w*0.9}" height="{h - w*0.12}" rx="{w*0.08}" fill="#000" opacity=".22"/>'
    for i in range(3):
        yy = h * (0.18 + i * 0.13)
        out += f'<path d="M {w*0.12} {yy} H {w*0.88} V {yy + h*0.1} H {w*0.12} Z" fill="#000" opacity=".2"/>'
        out += f'<rect x="{w*0.14}" y="{yy - h*0.05}" width="{w*0.6}" height="{h*0.07}" rx="6" fill="{[GOLD, ORANGE, "#EDEDED"][i]}"/>'
    out += f'<rect x="{w*0.95}" y="0" width="{w*0.12}" height="{h}" fill="#000" opacity=".18"/>'
    for yy in range(int(h*0.04), int(h), int(h*0.04)):
        out += f'<circle cx="{w*0.03}" cy="{yy}" r="2" fill="{GOLD_L}" opacity=".6"/>'
    out += '</g>'
    out += phone_front(x + w*1.1, y + w*0.06, w*0.86, h - w*0.12, wall="url(#wall2)")
    return out

def car_charger(x, y, s_, rot=0):
    w = s_ * 0.55; h = s_
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#shadow)">'
    out += f'<linearGradient id="cc1" x1="0" x2="1"><stop offset="0" stop-color="#2B2B2D"/><stop offset=".5" stop-color="#4A4A4E"/><stop offset="1" stop-color="#1C1C1E"/></linearGradient>'
    # barrel
    out += f'<rect x="{w*0.18}" y="{h*0.42}" width="{w*0.64}" height="{h*0.48}" rx="{w*0.12}" fill="url(#cc1)"/>'
    out += f'<rect x="{w*0.42}" y="{h*0.88}" width="{w*0.16}" height="{h*0.1}" rx="{w*0.05}" fill="url(#goldGrad)"/>'
    out += f'<rect x="{w*0.1}" y="{h*0.6}" width="{w*0.1}" height="{h*0.1}" rx="3" fill="#C9CCD1"/>'
    out += f'<rect x="{w*0.8}" y="{h*0.6}" width="{w*0.1}" height="{h*0.1}" rx="3" fill="#C9CCD1"/>'
    # head
    out += f'<rect width="{w}" height="{h*0.46}" rx="{w*0.22}" fill="url(#cc1)"/>'
    out += f'<rect x="{w*0.05}" y="{h*0.02}" width="{w*0.9}" height="{h*0.42}" rx="{w*0.2}" fill="#18181A"/>'
    out += f'<rect x="{w*0.25}" y="{h*0.1}" width="{w*0.5}" height="{h*0.07}" rx="{h*0.03}" fill="#000" stroke="{ORANGE}" stroke-width="2"/>'
    out += f'<rect x="{w*0.22}" y="{h*0.24}" width="{w*0.56}" height="{h*0.09}" rx="4" fill="#000" stroke="#555" stroke-width="2"/>'
    out += f'<text x="{w/2}" y="{h*0.41}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="{w*0.12}" fill="{ORANGE}">38W PD</text>'
    out += f'<rect width="{w}" height="{h*0.46}" rx="{w*0.22}" fill="url(#glassSheen)" opacity=".5"/>'
    out += '</g>'
    return out

def wall_charger(x, y, s_, col="#F4F4F4", rot=0, label="25W"):
    w = s_; h = s_
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#shadow)">'
    out += f'<rect x="{w*0.3}" y="{-h*0.22}" width="{w*0.08}" height="{h*0.26}" rx="4" fill="#B8BCC2"/>'
    out += f'<rect x="{w*0.62}" y="{-h*0.22}" width="{w*0.08}" height="{h*0.26}" rx="4" fill="#B8BCC2"/>'
    out += f'<rect width="{w}" height="{h}" rx="{w*0.2}" fill="{col}" stroke="#000" stroke-opacity=".08" stroke-width="2"/>'
    out += f'<rect width="{w}" height="{h}" rx="{w*0.2}" fill="url(#glassSheen)"/>'
    out += f'<rect x="{w*0.33}" y="{h*0.42}" width="{w*0.34}" height="{h*0.12}" rx="{h*0.06}" fill="#222"/>'
    out += f'<text x="{w/2}" y="{h*0.82}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="{w*0.12}" fill="#9A9A9A">{label}</text>'
    out += '</g>'
    return out

def cable(path_d, col="#F4F4F4", width=14, end_col=None):
    end_col = end_col or col
    return (f'<path d="{path_d}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="{width+6}" stroke-linecap="round" transform="translate(0,8)"/>'
            f'<path d="{path_d}" fill="none" stroke="{col}" stroke-width="{width}" stroke-linecap="round"/>'
            f'<path d="{path_d}" fill="none" stroke="#FFF" stroke-opacity=".35" stroke-width="{width*0.3}" stroke-linecap="round" stroke-dasharray="6 10"/>')

def connector(x, y, w, h, col="#EDEDED", rot=0, tip="#C9CCD1", lightning=False):
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#softShadow)">'
    out += f'<rect width="{w}" height="{h}" rx="{w*0.25}" fill="{col}"/>'
    tw = w * (0.45 if lightning else 0.6)
    out += f'<rect x="{(w-tw)/2}" y="{-h*0.42}" width="{tw}" height="{h*0.45}" rx="{tw*0.3}" fill="{tip}"/>'
    out += f'<rect width="{w}" height="{h}" rx="{w*0.25}" fill="url(#glassSheen)"/>'
    out += '</g>'
    return out

def powerbank(x, y, w, h, col="#1B1B1D", rot=0):
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#shadow)">'
    out += f'<rect width="{w}" height="{h}" rx="{w*0.14}" fill="{col}"/>'
    out += f'<rect x="{w*0.04}" y="{w*0.04}" width="{w*0.92}" height="{h - w*0.08}" rx="{w*0.11}" fill="#FFF" opacity=".05"/>'
    out += f'<rect width="{w}" height="{h}" rx="{w*0.14}" fill="url(#glassSheen)" opacity=".6"/>'
    out += f'<text x="{w/2}" y="{h*0.42}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="{w*0.2}" fill="#FFF">20000</text>'
    out += f'<text x="{w/2}" y="{h*0.5}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="{w*0.08}" fill="{GOLD_L}" letter-spacing="3">mAh · 22.5W</text>'
    for i in range(4):
        out += f'<circle cx="{w*(0.32 + i*0.12)}" cy="{h*0.66}" r="{w*0.03}" fill="{ORANGE if i < 3 else "#444"}"/>'
    out += f'<rect x="{w*0.2}" y="{h*0.8}" width="{w*0.6}" height="{h*0.04}" rx="4" fill="url(#discStrong)"/>'
    out += '</g>'
    return out

def earbuds(x, y, s_, col="#F7F7F7", rot=0, dark=False):
    w = s_; h = s_ * 0.8
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#shadow)">'
    out += f'<rect width="{w}" height="{h}" rx="{h*0.36}" fill="{col}" stroke="#000" stroke-opacity=".08" stroke-width="2"/>'
    out += f'<line x1="{w*0.04}" y1="{h*0.36}" x2="{w*0.96}" y2="{h*0.36}" stroke="#000" stroke-opacity=".15" stroke-width="3"/>'
    out += f'<circle cx="{w/2}" cy="{h*0.62}" r="{w*0.025}" fill="{ORANGE if not dark else GOLD}"/>'
    out += f'<rect width="{w}" height="{h}" rx="{h*0.36}" fill="url(#glassSheen)"/>'
    out += '</g>'
    # deux écouteurs posés devant
    bud_col = "#1B1B1D" if dark else "#FFFFFF"
    for i, (dx, rr) in enumerate([(w*0.05, -18), (w*0.62, 22)]):
        bx = x + dx; by = y + h * 0.92
        out += f'<g transform="translate({bx},{by}) rotate({rr})" filter="url(#softShadow)">'
        out += f'<ellipse cx="{w*0.16}" cy="{w*0.13}" rx="{w*0.16}" ry="{w*0.13}" fill="{bud_col}" stroke="#000" stroke-opacity=".1" stroke-width="2"/>'
        out += f'<rect x="{w*0.22}" y="{w*0.14}" width="{w*0.08}" height="{w*0.28}" rx="{w*0.04}" fill="{bud_col}" stroke="#000" stroke-opacity=".1" stroke-width="2"/>'
        out += f'<ellipse cx="{w*0.1}" cy="{w*0.12}" rx="{w*0.06}" ry="{w*0.05}" fill="#555" opacity=".6"/>'
        out += '</g>'
    return out

def car_mount(x, y, s_, rot=0):
    w = s_; h = s_
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#shadow)">'
    out += f'<rect x="{w*0.38}" y="{h*0.55}" width="{w*0.24}" height="{h*0.38}" rx="{w*0.06}" fill="#2A2A2C"/>'
    for i in range(3):
        out += f'<rect x="{w*0.3}" y="{h*(0.82 + i*0.05)}" width="{w*0.4}" height="{h*0.03}" rx="3" fill="#3A3A3C"/>'
    out += f'<circle cx="{w/2}" cy="{h*0.32}" r="{w*0.32}" fill="#1B1B1D"/>'
    out += f'<circle cx="{w/2}" cy="{h*0.32}" r="{w*0.27}" fill="none" stroke="url(#goldGrad)" stroke-width="{w*0.035}"/>'
    out += f'<circle cx="{w/2}" cy="{h*0.32}" r="{w*0.16}" fill="#2D2D30"/>'
    out += f'<text x="{w/2}" y="{h*0.35}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="{w*0.08}" fill="{ORANGE}">MAG</text>'
    out += f'<circle cx="{w/2}" cy="{h*0.32}" r="{w*0.32}" fill="url(#glassSheen)" opacity=".6"/>'
    out += '</g>'
    return out

def speaker(x, y, w, h, col=ORANGE, rot=0):
    t = f'transform="translate({x},{y}) rotate({rot},{w/2},{h/2})"'
    out = f'<g {t} filter="url(#shadow)">'
    out += f'<rect width="{w}" height="{h}" rx="{h/2}" fill="{col}"/>'
    # grille
    for i in range(int(w/14)):
        for j in range(int(h/14)):
            cx = 14*i + 10; cy = 14*j + 10
            if h*0.15 < cy < h*0.85 and w*0.12 < cx < w*0.88:
                out += f'<circle cx="{cx}" cy="{cy}" r="2.6" fill="#000" opacity=".25"/>'
    out += f'<ellipse cx="{w*0.04}" cy="{h/2}" rx="{h*0.12}" ry="{h*0.42}" fill="#111"/>'
    out += f'<ellipse cx="{w*0.96}" cy="{h/2}" rx="{h*0.12}" ry="{h*0.42}" fill="#111"/>'
    out += f'<rect x="{w*0.42}" y="{h*0.38}" width="{w*0.16}" height="{h*0.24}" rx="8" fill="#111" opacity=".85"/>'
    out += f'<text x="{w/2}" y="{h*0.55}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="{h*0.12}" fill="#FFF">SBS</text>'
    out += f'<rect width="{w}" height="{h}" rx="{h/2}" fill="url(#glassSheen)"/>'
    out += '</g>'
    return out

# --------------------------------------------------------------- produits
P = {}
W = H = 800

P["prod-iphone-15-pro-max"] = svg(W, H, backdrop(W, H) +
    phone_front(395, 150, 250, 520, frame="#8E8A82", wall="url(#wall2)", rot=8) +
    phone_back(170, 130, 250, 520, body="#A8A398", frame="#8E8A82", cam="pro", rot=-8))

P["prod-galaxy-s24-ultra"] = svg(W, H, backdrop(W, H) +
    phone_front(400, 140, 250, 530, frame="#2E2E30", wall="url(#wall3)", rot=7, island=False, notch_dot=True) +
    phone_back(165, 130, 250, 530, body="#3D3B48", frame="#2E2E30", cam="vertical", rot=-7, logo="SAMSUNG"))

P["prod-galaxy-a55"] = svg(W, H, backdrop(W, H) +
    phone_front(400, 160, 240, 500, frame="#7FA6D6", wall="url(#wall1)", rot=7, island=False, notch_dot=True) +
    phone_back(175, 150, 240, 500, body="#A9C7EC", frame="#7FA6D6", cam="vertical", rot=-7, logo="SAMSUNG"))

P["prod-tecno-camon-30"] = svg(W, H, backdrop(W, H) +
    phone_front(405, 160, 240, 505, frame="#1C1C1E", wall="url(#wall2)", rot=7, island=False, notch_dot=True) +
    phone_back(170, 145, 240, 505, body="#1F3B2E", frame="#16291F", cam="ring", rot=-7, logo="TECNO", cam_color="#0D0D0D"))

P["prod-infinix-note-40"] = svg(W, H, backdrop(W, H) +
    phone_front(405, 160, 240, 505, frame="#2A2A2A", wall="url(#wall1)", rot=7, island=False, notch_dot=True) +
    phone_back(170, 145, 240, 505, body="#C9A24A", frame="#A88634", cam="ring", rot=-7, logo="INFINIX", cam_color="#141414"))

P["prod-redmi-note-13"] = svg(W, H, backdrop(W, H) +
    phone_front(405, 160, 240, 505, frame="#2A2140", wall="url(#wall3)", rot=7, island=False, notch_dot=True) +
    phone_back(170, 145, 240, 505, body="#6B5BA8", frame="#4D3F85", cam="rect", rot=-7, logo="REDMI", cam_color="#1A1530"))

# protection
P["prod-coque-magsafe"] = svg(W, H, backdrop(W, H) +
    case_back(270, 120, 270, 560, None, rot=-6, clear=True, phone_body="#3B4A5F", magsafe=True))

P["prod-verre-trempe-9d"] = svg(W, H, backdrop(W, H) +
    phone_front(300, 170, 230, 480, frame="#1C1C1E", wall="url(#wall1)", rot=-4) +
    glass_sheet(240, 130, 230, 480, rot=-12))

P["prod-verre-anti-espion"] = svg(W, H, backdrop(W, H) +
    phone_front(310, 170, 230, 480, frame="#1C1C1E", wall="url(#wall2)", rot=4) +
    glass_sheet(250, 140, 230, 480, rot=-10, privacy=True))

P["prod-pochette-cuir"] = svg(W, H, backdrop(W, H) +
    wallet_case(150, 200, 250, 420, col="#5A3218"))

P["prod-coque-antichoc"] = svg(W, H, backdrop(W, H) +
    case_back(160, 150, 240, 500, "#1C1C1E", rot=-8, rugged=True) +
    case_back(400, 150, 240, 500, ORANGE, rot=8, rugged=True))

# montres
P["prod-apple-watch-s9"] = svg(W, H, backdrop(W, H) +
    watch_square(290, 270, 220, strap="#E8692A", case="#2A2A2C", face="url(#wall2)", crown_col=ORANGE))

P["prod-galaxy-watch-6"] = svg(W, H, backdrop(W, H) +
    watch_round(280, 260, 240, strap="#1C1C1E", case="#3A3A3C", face="#0B0B0D", accent=GOLD))

P["prod-smartwatch-ultra"] = svg(W, H, backdrop(W, H) +
    watch_square(300, 270, 210, strap=ORANGE, case="#C27A1E", face="#050505", crown_col=ORANGE).replace("10:09", "10:09"))

P["prod-smart-band-8"] = svg(W, H, backdrop(W, H) +
    band(250, 330, 300, strap="#111111", rot=-14))

# chargeurs & gadgets
P["prod-chargeur-auto-38w"] = svg(W, H, backdrop(W, H) +
    cable("M 470 520 C 560 600, 640 560, 640 450 S 600 260, 520 230", col="#1C1C1E", width=14) +
    connector(505, 175, 34, 60, col="#1C1C1E", rot=-25) +
    car_charger(280, 180, 440, rot=-10))

P["prod-chargeur-samsung-25w"] = svg(W, H, backdrop(W, H) +
    cable("M 360 520 C 360 640, 540 660, 560 540 S 520 300, 600 250", col="#F4F4F4", width=14) +
    connector(585, 195, 34, 62, col="#F4F4F4", rot=20) +
    wall_charger(230, 300, 230, rot=-6, label="25W"))

P["prod-powerbank-20000"] = svg(W, H, backdrop(W, H) +
    powerbank(270, 150, 260, 480, rot=-8))

P["prod-ecouteurs-tws"] = svg(W, H, backdrop(W, H) +
    earbuds(260, 230, 280, col="#1B1B1D", dark=True))

P["prod-airpods-pro-2"] = svg(W, H, backdrop(W, H) +
    earbuds(260, 230, 280, col="#FAFAFA"))

P["prod-support-voiture-mag"] = svg(W, H, backdrop(W, H) +
    car_mount(260, 200, 280) +
    phone_back(470, 150, 200, 420, body="#2B2B2D", cam="pro", rot=10))

P["prod-cable-usbc-lightning"] = svg(W, H, backdrop(W, H) +
    cable("M 250 560 C 150 420, 300 260, 420 340 S 640 520, 560 280", col=ORANGE, width=16) +
    connector(232, 560, 40, 74, col="#EDEDED", rot=200) +
    connector(540, 200, 36, 70, col="#EDEDED", rot=-10, lightning=True))

P["prod-enceinte-flip"] = svg(W, H, backdrop(W, H) +
    speaker(180, 290, 440, 200, col=ORANGE, rot=-8))

for k, v in P.items():
    with open(os.path.join(OUT, f"{k}.svg"), "w") as f:
        f.write(v)

# --------------------------------------------------------------- catégories (4:3)
CW, CH = 1200, 900
cats = {}
cats["cat-smartphones"] = svg(CW, CH, backdrop(CW, CH, r=330) +
    phone_back(300, 180, 250, 520, body="#A8A398", frame="#8E8A82", cam="pro", rot=-14) +
    phone_front(650, 180, 250, 520, frame="#2E2E30", wall="url(#wall3)", rot=14, island=False, notch_dot=True) +
    phone_front(475, 150, 260, 560, frame="#1C1C1E", wall="url(#wall1)"))
cats["cat-protection"] = svg(CW, CH, backdrop(CW, CH, r=330) +
    case_back(280, 200, 240, 500, ORANGE, rot=-14, rugged=True) +
    case_back(700, 200, 240, 500, None, rot=14, clear=True, phone_body="#3B4A5F", magsafe=True) +
    phone_front(500, 180, 230, 500, frame="#1C1C1E", wall="url(#wall2)") +
    glass_sheet(470, 150, 230, 500, rot=-6))
cats["cat-montres"] = svg(CW, CH, backdrop(CW, CH, r=330) +
    watch_round(290, 330, 230, strap="#1C1C1E", case="#3A3A3C", face="#0B0B0D", accent=GOLD, rot=-12) +
    watch_square(700, 330, 200, strap=ORANGE, case="#2A2A2C", face="url(#wall2)", rot=12) +
    band(470, 400, 240, rot=0))
cats["cat-chargeurs"] = svg(CW, CH, backdrop(CW, CH, r=330) +
    cable("M 420 640 C 520 760, 760 720, 780 560", col="#F4F4F4", width=14) +
    powerbank(760, 220, 200, 380, rot=10) +
    wall_charger(300, 470, 170, rot=-8) +
    car_charger(500, 170, 360, rot=-6) +
    earbuds(700, 620, 150, col="#1B1B1D", dark=True))
for k, v in cats.items():
    with open(os.path.join(OUT, f"{k}.svg"), "w") as f:
        f.write(v)

# --------------------------------------------------------------- hero
HW, HH = 1200, 900
hero = svg(HW, HH,
    f'<rect width="{HW}" height="{HH}" fill="#111111"/>'
    f'<circle cx="600" cy="430" r="330" fill="url(#discStrong)"/>'
    f'<circle cx="930" cy="140" r="34" fill="{ORANGE}"/>'
    f'<circle cx="250" cy="250" r="18" fill="{GOLD}"/>'
    f'<circle cx="320" cy="760" r="12" fill="#FFF" opacity=".8"/>'
    f'<circle cx="600" cy="430" r="400" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity=".6"/>'
    + phone_back(330, 170, 240, 500, body="#A8A398", frame="#8E8A82", cam="pro", rot=-12)
    + phone_front(560, 140, 260, 560, frame="#1C1C1E", wall="url(#wall2)", rot=6)
    + watch_square(840, 470, 150, strap=ORANGE, case="#2A2A2C", face="url(#wall1)", rot=12)
    + earbuds(190, 560, 150, col="#FAFAFA"))
with open(os.path.join(OUT, "hero-sbs.svg"), "w") as f:
    f.write(hero)

print("ok", len(P), "produits")
