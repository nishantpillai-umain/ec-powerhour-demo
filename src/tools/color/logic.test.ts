import { describe, expect, it } from 'vitest';
import { contrastRatio, hslToRgb, parseColor, rgbToHsl, toHex } from './logic';

describe('parseColor', () => {
  it('parses hex with and without #', () => {
    expect(parseColor('#ff5733')).toEqual({ r: 255, g: 87, b: 51 });
    expect(parseColor('ff5733')).toEqual({ r: 255, g: 87, b: 51 });
  });

  it('parses rgb() and rgba()', () => {
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30 });
    expect(parseColor('rgba(10,20,30,0.5)')).toEqual({ r: 10, g: 20, b: 30 });
  });

  it('parses hsl()', () => {
    expect(parseColor('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('rejects out-of-range and junk', () => {
    expect(parseColor('rgb(300, 0, 0)')).toBeNull();
    expect(parseColor('banana')).toBeNull();
  });
});

describe('conversions', () => {
  it('round-trips hex', () => {
    expect(toHex({ r: 255, g: 87, b: 51 })).toBe('#ff5733');
  });

  it('converts rgb to hsl', () => {
    expect(rgbToHsl({ r: 255, g: 87, b: 51 })).toEqual({ h: 11, s: 100, l: 60 });
    expect(rgbToHsl({ r: 128, g: 128, b: 128 })).toEqual({ h: 0, s: 0, l: 50 });
  });

  it('converts hsl to rgb', () => {
    expect(hslToRgb({ h: 120, s: 100, l: 25 })).toEqual({ r: 0, g: 128, b: 0 });
  });
});

describe('contrastRatio', () => {
  it('is 21 for black on white', () => {
    expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeCloseTo(21);
  });

  it('is 1 for identical colours', () => {
    expect(contrastRatio({ r: 50, g: 50, b: 50 }, { r: 50, g: 50, b: 50 })).toBe(1);
  });
});
