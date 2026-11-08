import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { UpdateMapDto } from './update-map.dto';

const IMAGE = { type: 'image', id: 'image-1', fileId: 'e4a5f6b7-3d4e-4f50-b162-4d5e6f708192', x: -0.5, y: 0, width: 2, height: 1 };
const PIN = { type: 'pin', id: 'pin-1', label: 'Entrance', description: '', x: 0.5, y: 0.5 };
const ZONE = { type: 'zone', id: 'zone-1', label: 'Lobby', description: '', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }] };
const VALUE = { layers: [IMAGE, ZONE, PIN], viewport: { transform: null } };

async function errorsOf(body: object) {
  return validate(plainToInstance(UpdateMapDto, body), { whitelist: true });
}

describe('UpdateMapDto', () => {
  it('accepts image, zone and pin layers with a fitted or moved viewport', async () => {
    expect(await errorsOf({ value: VALUE })).toHaveLength(0);
    expect(await errorsOf({ value: { ...VALUE, viewport: { transform: { x: -10, y: 20, scale: 1.5 } } } })).toHaveLength(0);
    expect(await errorsOf({ value: { layers: [], viewport: { transform: null } } })).toHaveLength(0);
    expect(await errorsOf({ name: 'Floor 1' })).toHaveLength(0);
  });

  it('accepts a frame and locked layers', async () => {
    const layers = [{ ...IMAGE, isLocked: true }, { ...PIN, isLocked: false }];
    expect(await errorsOf({ value: { ...VALUE, frame: { width: 1080, height: 1080 }, layers } })).toHaveLength(0);
  });

  it.each([
    ['a missing viewport', { layers: [] }],
    ['missing layers', { viewport: { transform: null } }],
    ['duplicate layer ids', { ...VALUE, layers: [PIN, PIN] }],
    ['an unknown layer type', { ...VALUE, layers: [{ ...PIN, type: 'text' }] }],
    ['an image layer without a file', { ...VALUE, layers: [{ type: 'image', id: 'image-1' }] }],
    ['a pin layer without a position', { ...VALUE, layers: [{ type: 'pin', id: 'pin-1', label: 'A', description: '' }] }],
    ['a pin outside the frame', { ...VALUE, layers: [{ ...PIN, x: 1.5 }] }],
    ['an image layer without a size', { ...VALUE, layers: [{ ...IMAGE, width: undefined }] }],
    ['an image with a zero size', { ...VALUE, layers: [{ ...IMAGE, height: 0 }] }],
    ['an image too large', { ...VALUE, layers: [{ ...IMAGE, width: 5 }] }],
    ['an image outside the frame', { ...VALUE, layers: [{ ...IMAGE, x: 1.5 }] }],
    ['a zone with fewer than 3 points', { ...VALUE, layers: [{ ...ZONE, points: ZONE.points.slice(0, 2) }] }],
    ['a zone point outside the frame', { ...VALUE, layers: [{ ...ZONE, points: [...ZONE.points, { x: 1.2, y: 0 }] }] }],
    ['an empty zone label', { ...VALUE, layers: [{ ...ZONE, label: ' ' }] }],
    ['an empty pin label', { ...VALUE, layers: [{ ...PIN, label: ' ' }] }],
    ['a non-uuid image', { ...VALUE, layers: [{ ...IMAGE, fileId: 'x' }] }],
    ['a frame too small', { ...VALUE, frame: { width: 99, height: 1080 } }],
    ['a frame too large', { ...VALUE, frame: { width: 1920, height: 10001 } }],
    ['a fractional frame', { ...VALUE, frame: { width: 1920.5, height: 1080 } }],
    ['a non-boolean lock', { ...VALUE, layers: [{ ...PIN, isLocked: 'yes' }] }],
    ['a zero scale', { ...VALUE, viewport: { transform: { x: 0, y: 0, scale: 0 } } }],
  ])('rejects %s', async (_, value) => {
    expect(await errorsOf({ value })).not.toHaveLength(0);
  });
});
