const { calculateLosses, buildTableRows } = require('../content');

test('weekly total is daily × 7', () => {
  expect(calculateLosses(10).week).toBe(70);
});

test('monthly total is daily × 30.4 rounded', () => {
  expect(calculateLosses(10).month).toBe(304);
});

test('yearly total is daily × 365', () => {
  expect(calculateLosses(10).year).toBe(3650);
});

test('all fields correct for £1/day', () => {
  expect(calculateLosses(1)).toEqual({ week: 7, month: 30, year: 365 });
});

test('all fields correct for £50/day (highest preset)', () => {
  expect(calculateLosses(50)).toEqual({ week: 350, month: 1520, year: 18250 });
});

test('buildTableRows returns 6 table rows (one per preset amount)', () => {
  const rows = buildTableRows();
  expect((rows.match(/<tr>/g) || []).length).toBe(6);
});

test('buildTableRows formats yearly figure for £50/day with thousands separator', () => {
  expect(buildTableRows()).toContain('£18,250');
});
