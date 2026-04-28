#!/usr/bin/env python3
"""Generate cartoon sprite-sheets, portrait SVGs, UI icons, and scenario headers
for SwampSimulator. Output goes to ./build/sprites, ./build/images/portraits,
./build/images/ui. Also writes ./build/sprites/manifest.js."""
import os, math, json
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SPR = os.path.join(ROOT, 'build', 'sprites')
PORT = os.path.join(ROOT, 'build', 'images', 'portraits')
UI = os.path.join(ROOT, 'build', 'images', 'ui')
for d in (SPR, PORT, UI):
    os.makedirs(d, exist_ok=True)

FW, FH = 64, 64       # frame size
INK = (28, 36, 41, 255)
SHADE_ALPHA = 60      # darkness of two-tone shadow

# Palette tokens (match style.css)
PAL = {
    'cypress': (47,107,58), 'water': (45,106,115), 'mud': (107,74,43),
    'sky': (245,239,214), 'ink': (28,36,41), 'accent': (201,139,44),
    'warn': (201,122,44), 'danger': (177,58,44), 'ok': (74,138,63),
    'leaf': (62,138,67), 'algae_green': (101,158,68), 'lily': (90,160,90),
    'cattail_brown': (128,82,42), 'sphagnum': (140,170,90),
    'frog': (98,158,72), 'tadpole': (50,70,42),
    'fish': (96,124,140), 'mullet': (160,160,140),
    'gator': (74,90,62), 'snake': (140,120,52),
    'turtle': (90,120,80), 'otter': (114,80,52), 'beaver': (104,68,40),
    'crayfish': (160,72,52), 'snail': (180,150,90),
    'heron': (160,170,180), 'osprey': (104,86,68), 'owl': (132,108,78),
    'vulture': (60,52,46),
    'dragonfly': (96,200,200), 'firefly': (240,210,80),
    'mosquito': (130,130,140), 'bat': (66,52,52),
    'deer': (170,124,80), 'panther': (90,72,52),
}

def darker(c, amt=40):
    return tuple(max(0, ch - amt) for ch in c[:3]) + ((c[3] if len(c)==4 else 255),)

# --------- low-level draw helpers ----------
def new_frame():
    return Image.new('RGBA', (FW, FH), (0,0,0,0))

def outline_ellipse(d, bbox, fill, ink=INK, w=2):
    d.ellipse(bbox, fill=fill, outline=ink, width=w)

def shaded_ellipse(d, bbox, fill, ink=INK, w=2):
    d.ellipse(bbox, fill=fill, outline=ink, width=w)
    # shadow on lower half
    x0,y0,x1,y1 = bbox
    h = y1-y0
    sh = (x0+2, y0+h*0.55, x1-2, y1-2)
    d.ellipse(sh, fill=darker(fill, 35))

def draw_eye(d, x, y, r=2):
    d.ellipse((x-r,y-r,x+r,y+r), fill=(255,255,255,255), outline=INK, width=1)
    d.ellipse((x-1,y-1,x+1,y+1), fill=INK)

# --------- body templates, parameterised by frame index t (0..frames-1) ----------
def render_blob(d, color, t, total, mode):
    """frog/turtle-like squat body. mode: 'idle','walk','swim'"""
    breathe = 0
    if mode == 'idle':
        breathe = math.sin(2*math.pi*t/total) * 1.5
    body = (12, 26+breathe, 52, 54+breathe)
    shaded_ellipse(d, body, color)
    # head bump
    head = (24, 18+breathe, 40, 32+breathe)
    shaded_ellipse(d, head, color)
    draw_eye(d, 28, 23+breathe)
    draw_eye(d, 36, 23+breathe)
    # legs (walk wiggle)
    leg_phase = math.sin(2*math.pi*t/total) if mode in ('walk',) else 0
    if mode == 'walk':
        d.line((18, 50, 14+leg_phase*3, 58), fill=INK, width=2)
        d.line((46, 50, 50-leg_phase*3, 58), fill=INK, width=2)
        d.line((22, 52, 18-leg_phase*3, 60), fill=INK, width=2)
        d.line((42, 52, 46+leg_phase*3, 60), fill=INK, width=2)
    elif mode == 'swim':
        s = math.sin(2*math.pi*t/total)*4
        # body wiggle = redraw with offset
        pass

def render_long(d, color, t, total, mode):
    """snake/alligator: chain of circles undulating"""
    n = 7
    amp = 4 if mode in ('walk','swim') else 1.5
    phase = 2*math.pi*t/total
    for i in range(n):
        x = 8 + i*8
        y = 32 + math.sin(phase + i*0.8) * amp
        r = 7 if i==0 else (6 if i<n-1 else 4)
        shaded_ellipse(d, (x-r,y-r,x+r,y+r), color)
    # eyes on head (last circle = head at right)
    hx, hy = 8 + (n-1)*8, 32 + math.sin(phase + (n-1)*0.8)*amp
    draw_eye(d, hx-1, hy-2)

def render_fish(d, color, t, total, mode):
    """elongated swim body; tail wags"""
    phase = 2*math.pi*t/total
    tail = math.sin(phase) * 5
    # body
    shaded_ellipse(d, (10, 24, 50, 42), color)
    # tail triangle
    d.polygon([(8,32),(0,28+tail),(0,36-tail)], fill=color, outline=INK)
    # eye
    draw_eye(d, 42, 30)
    # gill
    d.arc((30,28,38,38), 200, 340, fill=INK, width=1)

def render_bird_tall(d, color, t, total, mode):
    """heron/osprey/owl/vulture: oval body + neck + head + flight wings"""
    bob = math.sin(2*math.pi*t/total) * 1 if mode=='idle' else 0
    # body
    shaded_ellipse(d, (20, 32+bob, 44, 52+bob), color)
    if mode == 'flight':
        # wings up/down
        wing_y = 36 + math.sin(2*math.pi*t/total)*8
        d.polygon([(8,wing_y),(20,38),(20,44)], fill=color, outline=INK)
        d.polygon([(56,wing_y),(44,38),(44,44)], fill=color, outline=INK)
        # head extended forward
        d.line((32, 32+bob, 38, 16), fill=INK, width=2)
        shaded_ellipse(d, (34, 12, 46, 22), color)
        d.polygon([(46,15),(54,17),(46,19)], fill=PAL['accent'], outline=INK)  # beak
        draw_eye(d, 40, 16)
    else:
        # standing
        d.line((32, 32+bob, 32, 12), fill=INK, width=2)  # neck
        shaded_ellipse(d, (26, 6, 40, 18), color)
        d.polygon([(40,11),(50,13),(40,15)], fill=PAL['accent'], outline=INK)  # beak
        draw_eye(d, 33, 11)
        # legs
        leg_phase = math.sin(2*math.pi*t/total)*3 if mode=='walk' else 0
        d.line((28, 52+bob, 26-leg_phase, 62), fill=INK, width=2)
        d.line((36, 52+bob, 38+leg_phase, 62), fill=INK, width=2)

def render_insect(d, color, t, total, mode):
    """dragonfly/mosquito/firefly: small body, 4 wings flutter"""
    cx, cy = 32, 32
    # body
    shaded_ellipse(d, (28, 24, 36, 44), color)
    draw_eye(d, 30, 26)
    draw_eye(d, 34, 26)
    # wings — alpha changes with t
    flap = abs(math.sin(2*math.pi*t/total))
    wing_color = (200, 220, 240, int(120 + 100*flap))
    d.ellipse((10, 22 - flap*4, 30, 30 + flap*2), fill=wing_color, outline=INK)
    d.ellipse((34, 22 - flap*4, 54, 30 + flap*2), fill=wing_color, outline=INK)
    d.ellipse((12, 30 - flap*2, 28, 38 + flap*4), fill=wing_color, outline=INK)
    d.ellipse((36, 30 - flap*2, 52, 38 + flap*4), fill=wing_color, outline=INK)

def render_bat(d, color, t, total, mode):
    flap = math.sin(2*math.pi*t/total)
    # body
    shaded_ellipse(d, (28, 28, 36, 44), color)
    # wings: jagged
    d.polygon([(28,32),(8,24+flap*6),(4,34),(20,36),(28,38)], fill=color, outline=INK)
    d.polygon([(36,32),(56,24+flap*6),(60,34),(44,36),(36,38)], fill=color, outline=INK)
    # ears
    d.polygon([(28,28),(26,18),(31,24)], fill=color, outline=INK)
    d.polygon([(36,28),(38,18),(33,24)], fill=color, outline=INK)
    draw_eye(d, 30, 32)
    draw_eye(d, 34, 32)

def render_mammal(d, color, t, total, mode):
    """otter/beaver/deer/panther: 4-leg mammal walking left→right"""
    bob = math.sin(2*math.pi*t/total)*1 if mode=='idle' else 0
    leg_phase = math.sin(2*math.pi*t/total)*3 if mode=='walk' else 0
    # body
    shaded_ellipse(d, (12, 30+bob, 50, 48+bob), color)
    # head
    shaded_ellipse(d, (44, 22+bob, 60, 36+bob), color)
    # ear
    d.polygon([(50,22+bob),(52,16+bob),(56,22+bob)], fill=color, outline=INK)
    draw_eye(d, 52, 28+bob)
    # tail
    d.line((12, 36+bob, 4, 30+bob), fill=INK, width=2)
    # legs
    for lx, off in [(18,0),(26,1),(38,0),(46,1)]:
        d.line((lx, 48+bob, lx-leg_phase if off==0 else lx+leg_phase, 60), fill=INK, width=2)

def render_shell(d, color, t, total, mode):
    """turtle (overrides blob to add shell)"""
    bob = math.sin(2*math.pi*t/total)*1 if mode=='idle' else 0
    # shell
    shaded_ellipse(d, (10, 22+bob, 54, 50+bob), color)
    # shell pattern
    d.line((22, 30+bob, 22, 46+bob), fill=INK, width=1)
    d.line((42, 30+bob, 42, 46+bob), fill=INK, width=1)
    d.line((12, 36+bob, 52, 36+bob), fill=INK, width=1)
    # head
    shaded_ellipse(d, (48, 28+bob, 60, 38+bob), darker(color, 20))
    draw_eye(d, 54, 32+bob)
    # legs
    leg_phase = math.sin(2*math.pi*t/total)*2 if mode in ('walk','swim') else 0
    for lx in (18, 44):
        d.line((lx, 50+bob, lx-leg_phase, 58), fill=INK, width=2)

def render_crayfish(d, color, t, total, mode):
    bob = math.sin(2*math.pi*t/total)*2
    shaded_ellipse(d, (16, 24, 48, 44), color)
    # claws
    d.line([(48,30),(58,22+bob)], fill=INK, width=2); d.ellipse((54,18+bob,62,28+bob), fill=color, outline=INK)
    d.line([(48,38),(58,46-bob)], fill=INK, width=2); d.ellipse((54,42-bob,62,52-bob), fill=color, outline=INK)
    # tail segments
    for i,x in enumerate((14,8,2)):
        shaded_ellipse(d, (x, 28+i, x+10, 40-i), color)
    draw_eye(d, 28, 28); draw_eye(d, 36, 28)

def render_snail(d, color, t, total, mode):
    bob = math.sin(2*math.pi*t/total)*1 if mode=='idle' else 0
    # body foot
    shaded_ellipse(d, (10, 44+bob, 56, 56+bob), darker(color, 20))
    # shell spiral
    shaded_ellipse(d, (16, 18+bob, 48, 50+bob), color)
    d.arc((22,24+bob,42,44+bob), 0, 360, fill=INK, width=1)
    d.arc((28,30+bob,38,40+bob), 0, 360, fill=INK, width=1)
    # antennae
    d.line((50, 44+bob, 56, 36+bob), fill=INK, width=2)
    d.line((48, 44+bob, 52, 34+bob), fill=INK, width=2)
    draw_eye(d, 56, 36+bob, r=1)

# Plants (idle only — sway via patch.phase in renderer; here a single quiet sheet)
def render_cypress(d, color, t, total, mode):
    sway = math.sin(2*math.pi*t/total)*2
    # trunk
    d.rectangle((28, 36, 36, 60), fill=PAL['mud'], outline=INK)
    # 3 triangular tiers
    d.polygon([(32+sway, 8),(14, 28),(50, 28)], fill=color, outline=INK)
    d.polygon([(32+sway, 18),(10, 38),(54, 38)], fill=color, outline=INK)
    d.polygon([(32+sway, 28),(6, 50),(58, 50)], fill=color, outline=INK)

def render_lily(d, color, t, total, mode):
    bob = math.sin(2*math.pi*t/total)*1
    shaded_ellipse(d, (8, 24+bob, 56, 50+bob), color)
    # notch
    d.polygon([(32, 38+bob),(40, 28+bob),(36, 38+bob)], fill=PAL['water'])
    # flower
    for ang in range(0, 360, 60):
        x = 32 + math.cos(math.radians(ang))*6
        y = 36+bob + math.sin(math.radians(ang))*4
        d.ellipse((x-4, y-4, x+4, y+4), fill=(250,240,250,255), outline=INK)
    d.ellipse((28, 32+bob, 36, 40+bob), fill=PAL['accent'], outline=INK)

def render_algae(d, color, t, total, mode):
    drift = math.sin(2*math.pi*t/total)*2
    for i in range(8):
        x = 6 + (i%4)*14 + drift*(1 if i%2 else -1)
        y = 18 + (i//4)*18
        shaded_ellipse(d, (x, y, x+14, y+14), color)

def render_cattails(d, color, t, total, mode):
    sway = math.sin(2*math.pi*t/total)*2
    for i, sx in enumerate((18, 32, 46)):
        # stem
        d.line((sx, 60, sx + sway*(1 if i%2 else -1), 12 + i*2), fill=PAL['leaf'], width=2)
        # head (cattail)
        cx = sx + sway*(1 if i%2 else -1)
        d.rectangle((cx-3, 12+i*2, cx+3, 26+i*2), fill=PAL['cattail_brown'], outline=INK)

def render_duckweed(d, color, t, total, mode):
    drift = math.sin(2*math.pi*t/total)*1
    for i in range(12):
        x = 4 + (i%4)*15 + drift
        y = 12 + (i//4)*16
        d.ellipse((x, y, x+8, y+8), fill=color, outline=INK)

def render_sawgrass(d, color, t, total, mode):
    sway = math.sin(2*math.pi*t/total)*2
    for i, sx in enumerate((10, 20, 32, 44, 54)):
        d.line([(sx, 60), (sx + sway*(1 if i%2 else -1)*2, 4 + i)], fill=color, width=2)

def render_mangrove(d, color, t, total, mode):
    splay = math.sin(2*math.pi*t/total)*2
    # arching roots
    for i, (rx, ry) in enumerate([(20,50),(28,56),(36,56),(44,50)]):
        d.arc((rx-6+splay*(1 if i%2 else -1), ry-10, rx+6, ry+4), 180, 0, fill=PAL['mud'], width=2)
    # trunk
    d.rectangle((28, 28, 36, 55), fill=PAL['mud'], outline=INK)
    # crown
    shaded_ellipse(d, (10, 6, 54, 36), color)
    shaded_ellipse(d, (18, 2, 46, 28), PAL['leaf'] + (255,))

def render_hyacinth(d, color, t, total, mode):
    bob = math.sin(2*math.pi*t/total)*1.5
    # pad
    shaded_ellipse(d, (8, 32+bob, 56, 54+bob), PAL['leaf'] + (255,))
    # 3 purple blossoms
    for ang in (0, 120, 240):
        x = 32 + math.cos(math.radians(ang))*10
        y = 28+bob + math.sin(math.radians(ang))*6
        d.ellipse((x-5, y-8, x+5, y+2), fill=(160,90,200,255), outline=INK)
        d.ellipse((x-3, y-3, x+3, y+3), fill=(220,180,60,255))

def render_bladderwort(d, color, t, total, mode):
    bob = math.sin(2*math.pi*t/total)*2
    # submerged stem
    d.line([(32, 60), (32, 14+bob)], fill=PAL['leaf'], width=2)
    # bladders along stem
    for y in (48, 38, 28, 20):
        for dx in (-6, 6):
            d.ellipse((32+dx-4, y+bob-4, 32+dx+4, y+bob+4), fill=(200,220,60,220), outline=INK)
    # tiny flower tip
    d.ellipse((28, 10+bob, 36, 18+bob), fill=(250,220,50,255), outline=INK)

def render_arrowhead(d, color, t, total, mode):
    sway = math.sin(2*math.pi*t/total)*3
    # arrowhead leaf
    d.polygon([(32+sway, 6), (20, 36), (32, 30), (44, 36)], fill=color, outline=INK)
    # stem
    d.line([(32, 30), (32, 58)], fill=PAL['leaf'], width=3)
    # small side leaves
    d.polygon([(32+sway, 20), (14, 40), (24, 34)], fill=PAL['leaf'] + (255,), outline=INK)
    d.polygon([(32+sway, 20), (50, 40), (40, 34)], fill=PAL['leaf'] + (255,), outline=INK)

# ---------- plant sprite-sheet helpers (idle/seasonal-winter/harvest) ----------
PLANT_STATES = ['idle', 'seasonal-winter', 'harvest']
PLANT_FRAMES = {'idle': 4, 'seasonal-winter': 4, 'harvest': 4}
PLANT_FPS    = {'idle': 4, 'seasonal-winter': 2, 'harvest': 8}

def render_plant_winter(render_fn, d, color, t, total):
    """Desaturate and shrink: draw at 80% alpha, grey-shifted."""
    wcolor = tuple(max(0, c-60) for c in color[:3]) + (180,)
    render_fn(d, wcolor, t, total, 'idle')

def render_plant_harvest(d, color, t, total):
    """Shake-then-puff: frames 0-1 shake, frames 2-3 puff cloud."""
    if t < 2:
        shake = (t*4 - 4)
        d.ellipse((22+shake, 16, 42+shake, 52), fill=color, outline=INK)
    else:
        # puff cloud
        puff_r = 12 + (t-2)*8
        d.ellipse((32-puff_r, 32-puff_r, 32+puff_r, 32+puff_r), fill=(255,255,255,160), outline=INK)
        for angle in range(0, 360, 60):
            bx = 32 + math.cos(math.radians(angle))*(puff_r-4)
            by = 32 + math.sin(math.radians(angle))*(puff_r-4)
            d.ellipse((bx-5, by-5, bx+5, by+5), fill=(255,255,255,200))

def render_plant_sheet(spec, sid):
    """Generate plant-<sid>.png with idle / seasonal-winter / harvest rows."""
    rows = len(PLANT_STATES)
    cols = max(PLANT_FRAMES[s] for s in PLANT_STATES)
    sheet = Image.new('RGBA', (cols*FW, rows*FH), (0,0,0,0))
    color = PAL[spec['color']] + (255,)
    sheet_meta = {}
    for ri, st in enumerate(PLANT_STATES):
        n = PLANT_FRAMES[st]
        sheet_meta[st] = {'row': ri, 'frames': n, 'fps': PLANT_FPS[st]}
        for fi in range(n):
            f = new_frame()
            d = ImageDraw.Draw(f, 'RGBA')
            if st == 'idle':
                spec['render'](d, color, fi, n, 'idle')
            elif st == 'seasonal-winter':
                render_plant_winter(spec['render'], d, color, fi, n)
            else:  # harvest
                render_plant_harvest(d, color, fi, n)
            sheet.paste(f, (fi*FW, ri*FH), f)
    out_name = f'plant-{sid}.png'
    sheet.save(os.path.join(SPR, out_name))
    return {'url': f'./sprites/plant-{sid}.png', 'frameW': FW, 'frameH': FH,
            'states': sheet_meta, 'loco': None, 'type': 'plant'}

# --------- per-species spec ----------
SPECIES = {
    # animal
    'frog':         {'render': render_blob,   'color': 'frog',   'loco': ['walk','swim']},
    'tadpole':      {'render': render_fish,   'color': 'tadpole','loco': ['swim']},
    'alligator':    {'render': render_long,   'color': 'gator',  'loco': ['walk','swim']},
    'snake':        {'render': render_long,   'color': 'snake',  'loco': ['walk','swim']},
    'turtle':       {'render': render_shell,  'color': 'turtle', 'loco': ['walk','swim']},
    'otter':        {'render': render_mammal, 'color': 'otter',  'loco': ['walk','swim']},
    'beaver':       {'render': render_mammal, 'color': 'beaver', 'loco': ['walk','swim']},
    'crayfish':     {'render': render_crayfish,'color':'crayfish','loco':['walk','swim']},
    'snail':        {'render': render_snail,  'color': 'snail',  'loco': ['walk']},
    'bass':         {'render': render_fish,   'color': 'fish',   'loco': ['swim']},
    'mullet':       {'render': render_fish,   'color': 'mullet', 'loco': ['swim']},
    'mosquito_larva':{'render':render_fish,   'color':'mosquito','loco':['swim']},
    'heron':        {'render': render_bird_tall,'color':'heron', 'loco': ['walk','flight']},
    'osprey':       {'render': render_bird_tall,'color':'osprey','loco': ['walk','flight']},
    'owl':          {'render': render_bird_tall,'color':'owl',   'loco': ['walk','flight']},
    'vulture':      {'render': render_bird_tall,'color':'vulture','loco':['walk','flight']},
    'dragonfly':    {'render': render_insect, 'color':'dragonfly','loco':['flight']},
    'firefly':      {'render': render_insect, 'color':'firefly', 'loco':['flight']},
    'mosquito':     {'render': render_insect, 'color':'mosquito','loco':['flight']},
    'bat':          {'render': render_bat,    'color':'bat',     'loco':['flight']},
    'deer':         {'render': render_mammal, 'color':'deer',    'loco':['walk']},
    'panther':      {'render': render_mammal, 'color':'panther', 'loco':['walk']},
    # plants (sessile — idle only, also kept in SPECIES for portrait generation)
    'cypress':      {'render': render_cypress,   'color':'cypress',      'loco':[]},
    'lily':         {'render': render_lily,      'color':'lily',         'loco':[]},
    'algae':        {'render': render_algae,     'color':'algae_green',  'loco':[]},
    'cattails':     {'render': render_cattails,  'color':'leaf',         'loco':[]},
    'duckweed':     {'render': render_duckweed,  'color':'leaf',         'loco':[]},
    'sawgrass':     {'render': render_sawgrass,  'color':'sphagnum',     'loco':[]},
    'mangrove':     {'render': render_mangrove,  'color':'cypress',      'loco':[]},
    'hyacinth':     {'render': render_hyacinth,  'color':'leaf',         'loco':[]},
    'bladderwort':  {'render': render_bladderwort,'color':'algae_green', 'loco':[]},
    'arrowhead':    {'render': render_arrowhead, 'color':'leaf',         'loco':[]},
}

STATE_FRAMES = {'idle': 4, 'walk': 6, 'swim': 4, 'flight': 4}
STATE_FPS    = {'idle': 3, 'walk': 8, 'swim': 6, 'flight': 10}

def state_order(loco):
    """Always start with idle, then walk/swim/flight as available."""
    s = ['idle']
    for k in ('walk','swim','flight'):
        if k in loco: s.append(k)
    return s

def render_sheet(spec, sid):
    states = state_order(spec['loco'])
    rows = len(states)
    cols = max(STATE_FRAMES[s] for s in states)
    sheet = Image.new('RGBA', (cols*FW, rows*FH), (0,0,0,0))
    color = PAL[spec['color']] + (255,)
    sheet_meta = {}
    for ri, st in enumerate(states):
        n = STATE_FRAMES[st]
        sheet_meta[st] = {'row': ri, 'frames': n, 'fps': STATE_FPS[st]}
        for fi in range(n):
            f = new_frame()
            d = ImageDraw.Draw(f, 'RGBA')
            spec['render'](d, color, fi, n, st)
            sheet.paste(f, (fi*FW, ri*FH), f)
    sheet.save(os.path.join(SPR, f'{sid}.png'))
    return {'url': f'./sprites/{sid}.png', 'frameW': FW, 'frameH': FH, 'states': sheet_meta, 'loco': spec['loco']}

def render_portrait_svg(spec, sid):
    """Render to a temp 64x64 idle frame and embed as data-URL inside an SVG."""
    color = PAL[spec['color']] + (255,)
    f = new_frame()
    d = ImageDraw.Draw(f, 'RGBA')
    spec['render'](d, color, 0, 4, 'idle')
    import io, base64
    buf = io.BytesIO()
    f.save(buf, 'PNG')
    b64 = base64.b64encode(buf.getvalue()).decode('ascii')
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <image href="data:image/png;base64,{b64}" width="64" height="64"/>
</svg>'''
    with open(os.path.join(PORT, f'{sid}.svg'), 'w') as fp:
        fp.write(svg)

# --------- UI icons (24x24 SVGs hand-coded) ----------
def write_svg(path, body, vb='0 0 24 24', size=24):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{size}" height="{size}">{body}</svg>'
    with open(path, 'w') as fp: fp.write(svg)

def gen_ui_icons():
    INK_HEX = '#1c2429'
    A = '#c98b2c'
    G = '#2f6b3a'
    B = '#2d6a73'
    M = '#6b4a2b'
    R = '#b13a2c'
    SK= '#f5efd6'
    icons = {
        # nav
        'nav-canvas':    f'<ellipse cx="12" cy="13" rx="10" ry="6" fill="{B}" stroke="{INK_HEX}" stroke-width="1.5"/><ellipse cx="9" cy="11" rx="3" ry="2" fill="{G}" stroke="{INK_HEX}" stroke-width="1.5"/>',
        'nav-foodweb':   f'<circle cx="6" cy="6" r="3" fill="{G}" stroke="{INK_HEX}" stroke-width="1.5"/><circle cx="18" cy="6" r="3" fill="{A}" stroke="{INK_HEX}" stroke-width="1.5"/><circle cx="12" cy="18" r="3" fill="{R}" stroke="{INK_HEX}" stroke-width="1.5"/><line x1="6" y1="6" x2="12" y2="18" stroke="{INK_HEX}" stroke-width="1.5"/><line x1="18" y1="6" x2="12" y2="18" stroke="{INK_HEX}" stroke-width="1.5"/><line x1="6" y1="6" x2="18" y2="6" stroke="{INK_HEX}" stroke-width="1.5"/>',
        'nav-dashboard': f'<rect x="3" y="3" width="18" height="18" rx="3" fill="{SK}" stroke="{INK_HEX}" stroke-width="1.5"/><polyline points="5,17 9,12 13,15 19,7" fill="none" stroke="{G}" stroke-width="2"/><circle cx="9" cy="12" r="1.5" fill="{R}"/>',
        'nav-intervention': f'<path d="M4 14 L10 8 L14 12 L20 6" fill="none" stroke="{INK_HEX}" stroke-width="2"/><circle cx="10" cy="8" r="2" fill="{A}" stroke="{INK_HEX}" stroke-width="1.5"/>',
        'nav-scenarios': f'<rect x="3" y="6" width="18" height="12" rx="2" fill="{M}" stroke="{INK_HEX}" stroke-width="1.5"/><circle cx="6" cy="9" r="1" fill="{SK}"/><circle cx="6" cy="15" r="1" fill="{SK}"/><circle cx="18" cy="9" r="1" fill="{SK}"/><circle cx="18" cy="15" r="1" fill="{SK}"/>',
        'nav-saveload': f'<rect x="4" y="4" width="16" height="16" fill="{SK}" stroke="{INK_HEX}" stroke-width="1.5" rx="1"/><rect x="6" y="6" width="12" height="9" fill="{B}" stroke="{INK_HEX}" stroke-width="1"/>',
        # time
        'time-pause': f'<rect x="6" y="5" width="4" height="14" fill="{INK_HEX}"/><rect x="14" y="5" width="4" height="14" fill="{INK_HEX}"/>',
        'time-play':  f'<polygon points="7,5 19,12 7,19" fill="{G}" stroke="{INK_HEX}" stroke-width="1.5"/>',
        'time-x1':    f'<text x="6" y="17" font-family="sans-serif" font-weight="bold" font-size="13" fill="{INK_HEX}">×1</text>',
        'time-x5':    f'<text x="6" y="17" font-family="sans-serif" font-weight="bold" font-size="13" fill="{INK_HEX}">×5</text>',
        'time-x30':   f'<text x="3" y="17" font-family="sans-serif" font-weight="bold" font-size="11" fill="{INK_HEX}">×30</text>',
        'time-skip':  f'<polygon points="3,5 13,12 3,19" fill="{A}" stroke="{INK_HEX}" stroke-width="1.5"/><rect x="14" y="5" width="3" height="14" fill="{A}" stroke="{INK_HEX}" stroke-width="1.5"/>',
        # overlays
        'overlay-foodweb':  f'<circle cx="5" cy="6" r="2" fill="{G}" stroke="{INK_HEX}"/><circle cx="19" cy="6" r="2" fill="{A}"/><circle cx="12" cy="18" r="2" fill="{R}"/><line x1="5" y1="6" x2="12" y2="18" stroke="{INK_HEX}"/><line x1="19" y1="6" x2="12" y2="18" stroke="{INK_HEX}"/>',
        'overlay-nutrient': f'<rect x="3" y="3" width="18" height="18" fill="url(#nutg)"/><defs><linearGradient id="nutg"><stop offset="0%" stop-color="{SK}"/><stop offset="100%" stop-color="{G}"/></linearGradient></defs>',
        'overlay-oxygen':   f'<rect x="3" y="3" width="18" height="18" fill="url(#oxg)"/><defs><linearGradient id="oxg"><stop offset="0%" stop-color="{B}"/><stop offset="100%" stop-color="{R}"/></linearGradient></defs>',
        'overlay-density':  f'<rect x="3" y="3" width="6" height="6" fill="{R}"/><rect x="9" y="3" width="6" height="6" fill="{A}"/><rect x="15" y="3" width="6" height="6" fill="{G}"/><rect x="3" y="9" width="6" height="6" fill="{A}"/><rect x="9" y="9" width="6" height="6" fill="{R}"/><rect x="15" y="9" width="6" height="6" fill="{A}"/>',
        # events
        'event-drought': f'<circle cx="12" cy="9" r="5" fill="{A}" stroke="{INK_HEX}" stroke-width="1.5"/><path d="M3 19 Q6 16 9 19 T15 19 T21 19" fill="none" stroke="{M}" stroke-width="2"/>',
        'event-flood':   f'<path d="M3 7 Q6 4 9 7 T15 7 T21 7" fill="none" stroke="{B}" stroke-width="2"/><path d="M3 13 Q6 10 9 13 T15 13 T21 13" fill="none" stroke="{B}" stroke-width="2"/><path d="M3 19 Q6 16 9 19 T15 19 T21 19" fill="none" stroke="{B}" stroke-width="2"/>',
        'event-pollution': f'<rect x="7" y="6" width="10" height="14" fill="{INK_HEX}" stroke="{INK_HEX}"/><ellipse cx="12" cy="6" rx="5" ry="2" fill="{R}" stroke="{INK_HEX}"/><text x="10" y="16" font-size="8" fill="{A}">!</text>',
        'event-fire':    f'<path d="M12 4 Q8 10 9 14 Q10 18 12 20 Q14 18 15 14 Q16 10 12 4 Z" fill="{R}" stroke="{INK_HEX}" stroke-width="1.5"/><path d="M12 10 Q11 13 12 16 Q13 13 12 10 Z" fill="{A}"/>',
        'event-runoff':  f'<rect x="3" y="14" width="18" height="6" fill="{M}" stroke="{INK_HEX}"/><circle cx="6" cy="10" r="2" fill="{G}"/><circle cx="12" cy="8" r="2" fill="{G}"/><circle cx="18" cy="11" r="2" fill="{G}"/>',
        'event-coldsnap':f'<g stroke="{B}" stroke-width="1.5" fill="none"><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></g>',
    }
    for name, body in icons.items():
        write_svg(os.path.join(UI, f'{name}.svg'), body)

def gen_scenario_headers():
    INK_HEX='#1c2429'; G='#2f6b3a'; B='#2d6a73'; M='#6b4a2b'; R='#b13a2c'; A='#c98b2c'; SK='#f5efd6'
    scenarios = {
        'scenario-alligator-removed': f'''<rect width="240" height="140" fill="{B}"/>
            <ellipse cx="120" cy="120" rx="120" ry="20" fill="{M}"/>
            <g opacity="0.4"><path d="M40 80 Q90 70 140 80 Q170 86 200 80 L200 100 L40 100 Z" fill="{G}" stroke="{INK_HEX}" stroke-width="2"/></g>
            <text x="100" y="60" font-size="60" font-family="serif" fill="{R}">?</text>''',
        'scenario-mosquito-explosion': f'''<rect width="240" height="140" fill="{SK}"/>
            <g fill="{INK_HEX}">
              <ellipse cx="60" cy="50" rx="3" ry="2"/><ellipse cx="80" cy="40" rx="3" ry="2"/><ellipse cx="100" cy="60" rx="3" ry="2"/>
              <ellipse cx="120" cy="35" rx="3" ry="2"/><ellipse cx="140" cy="55" rx="3" ry="2"/><ellipse cx="160" cy="45" rx="3" ry="2"/>
              <ellipse cx="180" cy="65" rx="3" ry="2"/><ellipse cx="70" cy="80" rx="3" ry="2"/><ellipse cx="110" cy="90" rx="3" ry="2"/>
              <ellipse cx="150" cy="100" rx="3" ry="2"/><ellipse cx="190" cy="90" rx="3" ry="2"/><ellipse cx="50" cy="100" rx="3" ry="2"/>
            </g>''',
        'scenario-algae-bloom': f'''<rect width="240" height="140" fill="{B}"/>
            <g fill="{G}" opacity="0.85" stroke="{INK_HEX}" stroke-width="1">
              <circle cx="60" cy="60" r="22"/><circle cx="100" cy="80" r="28"/><circle cx="150" cy="50" r="24"/>
              <circle cx="180" cy="90" r="20"/><circle cx="120" cy="40" r="18"/>
            </g>''',
        'scenario-beaver-dam': f'''<rect width="240" height="140" fill="{B}"/>
            <ellipse cx="120" cy="120" rx="120" ry="20" fill="{M}"/>
            <g fill="{M}" stroke="{INK_HEX}" stroke-width="2">
              <rect x="40" y="60" width="160" height="14" rx="6"/>
              <rect x="60" y="46" width="120" height="14" rx="6"/>
              <rect x="80" y="32" width="80" height="14" rx="6"/>
            </g>''',
        'scenario-drought-year': f'''<rect width="240" height="140" fill="{SK}"/>
            <circle cx="200" cy="40" r="26" fill="{A}" stroke="{INK_HEX}" stroke-width="2"/>
            <g stroke="{M}" stroke-width="2" fill="none">
              <path d="M0 110 L240 110"/>
              <path d="M30 110 L40 130"/><path d="M70 110 L60 130"/><path d="M110 110 L120 130"/>
              <path d="M150 110 L140 130"/><path d="M190 110 L200 130"/>
            </g>''',
    }
    for name, body in scenarios.items():
        write_svg(os.path.join(UI, f'{name}.svg'), body, vb='0 0 240 140', size=240)

# --------- run ----------
def main():
    manifest = {}
    PLANT_IDS = {'cypress','lily','algae','cattails','duckweed','sawgrass','mangrove','hyacinth','bladderwort','arrowhead'}
    for sid, spec in SPECIES.items():
        manifest[sid] = render_sheet(spec, sid)
        render_portrait_svg(spec, sid)
        # also generate dedicated plant-<id>.png with idle/winter/harvest rows
        if sid in PLANT_IDS:
            manifest[f'plant-{sid}'] = render_plant_sheet(spec, sid)
        print(f'  sprite + portrait: {sid}')
    gen_ui_icons()
    gen_scenario_headers()
    # write manifest.js
    js = 'export const SPRITE_MANIFEST = ' + json.dumps(manifest, indent=2) + ';\n'
    with open(os.path.join(SPR, 'manifest.js'), 'w') as fp:
        fp.write(js)
    print(f'Wrote {len(manifest)} entries, portraits, UI icons, scenario headers, manifest.js')

if __name__ == '__main__':
    main()
