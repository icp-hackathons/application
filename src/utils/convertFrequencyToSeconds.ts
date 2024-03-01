export type Unit = 'day' | 'week' | 'month';
export const convertFrequencyToSeconds = (frequency: number, unit: Unit) => {
  let seconds = 30; // minimum 30 min
  switch (unit) {
    case 'day':
      seconds = Number(frequency) * 24 * 60 * 60;
      break;
    case 'week':
      seconds = Number(frequency) * 24 * 60 * 60 * 7;
      break;
    case 'month':
      seconds = Number(frequency) * 24 * 60 * 60 * 7 * 30.5; // 30.5 ~month
      break;
    default:
      seconds = Number(seconds) * 60;
  }
  return seconds;
};
