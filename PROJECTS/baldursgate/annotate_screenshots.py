#!/usr/bin/env python3
"""
Retroactively annotate test screenshots with a UC / BR banner above the image.
Usage: python3 annotate_screenshots.py <shot_dir> [shot_dir2 ...]
"""
from PIL import Image, ImageDraw, ImageFont
import os, sys

BANNER_H = 80   # pixels added above the image

UC_MAP = {
    'UC001': ('UC-001: Launch & Main Menu',          'BR-001 – BR-005'),
    'UC002': ('UC-002: Character Creation',          'BR-006 – BR-020'),
    'UC003': ('UC-003: Explore World (Isometric)',   'BR-021 – BR-026'),
    'UC004': ('UC-004: Combat',                      'BR-027 – BR-035'),
    'UC005': ('UC-005: Party Management',            'BR-036 – BR-041'),
    'UC006': ('UC-006: Inventory',                   'BR-042 – BR-048'),
    'UC007': ('UC-007: NPC Dialogue',                'BR-049 – BR-053'),
    'UC008': ('UC-008: Journal',                     'BR-054 – BR-058'),
    'UC009': ('UC-009: Spells & Abilities',          'BR-059 – BR-063'),
    'UC010': ('UC-010: Shop / Merchant',             'BR-064 – BR-068'),
    'UC011': ('UC-011: Rest & Recovery',             'BR-069 – BR-072'),
    'UC012': ('UC-012: World Map / Fog of War',      'BR-073 – BR-076'),
    'UC013': ('UC-013: Level Up',                    'BR-077'),
    'UC014': ('UC-014: Save / Load',                 'BR-078 – BR-079'),
    'UC015': ('UC-015: Options / Settings',          'BR-080'),
    'ZZ':    ('Final State',                         'All UCs / All BRs'),
}

GOLD  = (200, 169, 106, 255)
GREY  = (160, 160, 160, 255)
WHITE = (255, 255, 255, 255)
BLACK = (0, 0, 0, 255)
BG    = (10, 8, 5, 240)


def load_fonts():
    candidates_bold = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf',
        '/usr/share/fonts/truetype/freefont/FreeMono.ttf',
    ]
    candidates_reg = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf',
        '/usr/share/fonts/truetype/freefont/FreeMono.ttf',
    ]
    font_bold = font_reg = ImageFont.load_default()
    for p in candidates_bold:
        if os.path.exists(p):
            try:
                font_bold = ImageFont.truetype(p, 30)
                break
            except Exception:
                pass
    for p in candidates_reg:
        if os.path.exists(p):
            try:
                font_reg = ImageFont.truetype(p, 22)
                break
            except Exception:
                pass
    return font_bold, font_reg


def annotate(path, uc_label, br_label, font_bold, font_reg):
    img = Image.open(path).convert('RGB')
    w, h = img.size

    # Build banner
    banner = Image.new('RGB', (w, BANNER_H), (10, 8, 5))
    draw = ImageDraw.Draw(banner)

    # Gold left accent bar
    draw.rectangle([0, 0, 6, BANNER_H - 1], fill=(200, 169, 106))
    # Gold bottom border line
    draw.line([(0, BANNER_H - 3), (w, BANNER_H - 3)], fill=(200, 169, 106), width=3)

    draw.text((18,  8), uc_label, fill=(200, 169, 106), font=font_bold)
    draw.text((18, 46), br_label, fill=(200, 200, 200), font=font_reg)

    # Paste banner on top of original
    out = Image.new('RGB', (w, h + BANNER_H), (0, 0, 0))
    out.paste(banner, (0, 0))
    out.paste(img,    (0, BANNER_H))
    out.save(path, 'PNG')


def process_dir(shot_dir, font_bold, font_reg):
    files = sorted(f for f in os.listdir(shot_dir) if f.lower().endswith('.png'))
    annotated = 0
    for fname in files:
        upper = fname.upper()
        matched_key = None
        # Longest-first so UC011 beats UC01
        for key in sorted(UC_MAP, key=len, reverse=True):
            if key in upper:
                matched_key = key
                break
        if not matched_key:
            print(f'  (skip — no UC match): {fname}')
            continue
        uc_label, br_label = UC_MAP[matched_key]
        full = os.path.join(shot_dir, fname)
        annotate(full, uc_label, br_label, font_bold, font_reg)
        print(f'  ✓ {fname}  →  {uc_label}')
        annotated += 1
    print(f'  {annotated}/{len(files)} files annotated in {shot_dir}')


if __name__ == '__main__':
    dirs = sys.argv[1:]
    if not dirs:
        print('Usage: python3 annotate_screenshots.py <dir1> [dir2 ...]')
        sys.exit(1)
    font_bold, font_reg = load_fonts()
    for d in dirs:
        if not os.path.isdir(d):
            print(f'Not a directory: {d}'); continue
        print(f'\nAnnotating: {d}')
        process_dir(d, font_bold, font_reg)
    print('\nDone.')
