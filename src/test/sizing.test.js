import { describe, it, expect } from 'vitest';

describe('LOOM 3D Mannequin Parametric Scaling Math', () => {
  const calculateMannequinScale = (measurements) => {
    const heightScale = measurements.height / 180;
    const chestScale = measurements.chest / 40;
    const waistScale = measurements.waist / 32;
    const hipsScale = measurements.hips / 39;

    return {
      x: chestScale,
      y: heightScale,
      z: (waistScale + hipsScale) / 2
    };
  };

  it('calculates 1.0 baseline proportions for standard reference model', () => {
    const baseline = { height: 180, chest: 40, waist: 32, hips: 39 };
    const scale = calculateMannequinScale(baseline);

    expect(scale.x).toBeCloseTo(1.0);
    expect(scale.y).toBeCloseTo(1.0);
    expect(scale.z).toBeCloseTo(1.0);
  });

  it('scales X & Z axes when athletic proportions are applied', () => {
    const athletic = { height: 185, chest: 44, waist: 30, hips: 38 };
    const scale = calculateMannequinScale(athletic);

    expect(scale.x).toBeCloseTo(1.1); // 44 / 40
    expect(scale.y).toBeCloseTo(185 / 180);
    expect(scale.z).toBeCloseTo(((30 / 32) + (38 / 39)) / 2);
  });
});
