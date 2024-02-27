export function formatPercent(num: number, base: 1 | 100 = 100): string {
  return (num / base).toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export function formatInt(num: number) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatFloat(num: number, maxPrecision = 2) {
  const actualDecimals = num.toString().split('.')[1]?.length || 0;
  const minDecimals = Math.min(actualDecimals, maxPrecision);

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: minDecimals || 1,
  });
}
