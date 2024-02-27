export function divideBigIntWithPrecision(numerator: number | bigint, denominator: number | bigint, precision = 2) {
  const scaledNumerator = BigInt(numerator) * BigInt(10 ** precision);
  const result = scaledNumerator / BigInt(denominator);
  const resultString = result.toString();
  const decimalIndex = resultString.length - precision;
  const formattedResult = resultString.slice(0, decimalIndex) + "." + resultString.slice(decimalIndex);

  return parseFloat(formattedResult);
}
