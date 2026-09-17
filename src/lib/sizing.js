export const measurementRules = {
  height: [120, 220, 'cm'], weight: [30, 250, 'kg'],
  chest: [60, 180, 'cm'], waist: [45, 180, 'cm'], hip: [60, 190, 'cm'],
};

export function validateMeasurements(values) {
  return Object.fromEntries(Object.entries(measurementRules).flatMap(([key, [min, max, unit]]) => {
    const value = Number(values[key]);
    return String(values[key] ?? '').trim() && Number.isFinite(value) && value >= min && value <= max
      ? [] : [[key, `Enter ${min}–${max} ${unit}.`]];
  }));
}

export function getProportions(values) {
  if (Object.keys(validateMeasurements(values)).length) return null;
  return { height: Number(values.height) / 176, chest: Number(values.chest) / 94,
    waist: Number(values.waist) / 78, hip: Number(values.hip) / 96 };
}
