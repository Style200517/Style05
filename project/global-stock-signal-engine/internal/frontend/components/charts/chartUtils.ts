export interface Range {
  min: number;
  max: number;
}

export function getRange(values: number[], paddingRatio = 0.08): Range {
  if (values.length === 0) {
    return { min: 0, max: 1 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || Math.max(Math.abs(max), 1);
  const padding = spread * paddingRatio;

  return {
    min: min - padding,
    max: max + padding
  };
}

export function scalePoint(
  value: number,
  range: Range,
  start: number,
  length: number,
  invert = true
) {
  const normalized = (value - range.min) / (range.max - range.min || 1);
  return start + (invert ? 1 - normalized : normalized) * length;
}

export function buildLinePath(
  data: number[],
  width: number,
  height: number,
  paddingX = 10,
  paddingY = 10,
  range?: Range
) {
  if (data.length === 0) {
    return "";
  }

  const resolvedRange = range ?? getRange(data);
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;
  const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;

  return data
    .map((value, index) => {
      const x = paddingX + index * step;
      const y = scalePoint(value, resolvedRange, paddingY, innerHeight, true);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function buildAreaPath(
  data: number[],
  width: number,
  height: number,
  paddingX = 10,
  paddingY = 10,
  range?: Range
) {
  const path = buildLinePath(data, width, height, paddingX, paddingY, range);
  if (!path) {
    return "";
  }

  return `${path} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;
}

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandleGeometry extends Candle {
  x: number;
  bodyY: number;
  bodyHeight: number;
  wickTop: number;
  wickBottom: number;
  isUp: boolean;
}

export function buildCandleGeometry(
  candles: Candle[],
  width: number,
  height: number,
  paddingX = 12,
  paddingY = 10
) {
  if (candles.length === 0) {
    return { geometries: [] as CandleGeometry[], range: { min: 0, max: 1 } };
  }

  const values = candles.flatMap((item) => [item.open, item.high, item.low, item.close]);
  const range = getRange(values, 0.04);
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;
  const step = candles.length > 1 ? innerWidth / candles.length : innerWidth;
  const bodyWidth = Math.max(4, Math.min(12, step * 0.52));

  const geometries = candles.map((candle, index) => {
    const centerX = paddingX + step * index + step / 2;
    const openY = scalePoint(candle.open, range, paddingY, innerHeight, true);
    const closeY = scalePoint(candle.close, range, paddingY, innerHeight, true);
    const highY = scalePoint(candle.high, range, paddingY, innerHeight, true);
    const lowY = scalePoint(candle.low, range, paddingY, innerHeight, true);
    const bodyTop = Math.min(openY, closeY);
    const bodyBottom = Math.max(openY, closeY);

    return {
      ...candle,
      x: centerX - bodyWidth / 2,
      bodyY: bodyTop,
      bodyHeight: Math.max(2, bodyBottom - bodyTop),
      wickTop: highY,
      wickBottom: lowY,
      isUp: candle.close >= candle.open
    };
  });

  return { geometries, range };
}
