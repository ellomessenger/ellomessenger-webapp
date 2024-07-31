import i18n from 'i18next';

export function getMoneyFormat(
  value: number | string | null | undefined,
  minDecimals?: number,
  maxDecimals: number = 3,
  compact?: boolean
) {
  const regValue = String(value)
    .replace(/[^\d.]/g, '')
    .replace(/^([^.]*\.)|\./g, '$1');
  const dot = regValue.slice(-1) === '.';
  if (regValue) {
    const money = new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: minDecimals || 0,
      maximumFractionDigits: maxDecimals + 1,
      notation: compact ? 'compact' : 'standard',
      compactDisplay: compact ? 'short' : 'long',
    });

    const pow = Math.pow(10, maxDecimals + 1);
    const result = `${money.format(Math.floor(Number(regValue) * pow) / pow)}${
      dot ? '.' : ''
    }`;
    return String(value).split('.')[1]?.length! > maxDecimals
      ? result.slice(0, -1)
      : result;
  }
  return '';
}
