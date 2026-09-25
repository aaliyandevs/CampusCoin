export function getChartColors(theme) {
  return theme === 'dark'
    ? { income: '#2fa571', expense: '#d97706', single: '#2fa571', grid: '#3a3a38' }
    : { income: '#21855b', expense: '#b45309', single: '#21855b', grid: '#e7e5e4' }
}
