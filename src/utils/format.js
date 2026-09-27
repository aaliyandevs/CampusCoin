const CURRENCY_STORAGE_KEY = 'campuscoin_currency'

// Fixed, approximate conversion rate for display only — all amounts are
// stored and calculated in USD; switching currency never touches data,
// it only changes how numbers are rendered.
const CURRENCIES = {
  USD: { locale: 'en-US', rateFromUsd: 1 },
  PKR: { locale: 'en-PK', rateFromUsd: 280 },
}

export function getStoredCurrency() {
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY)
    if (stored in CURRENCIES) return stored
  } catch {
    // ignore storage access errors
  }
  return 'USD'
}

export function setStoredCurrency(currency) {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency)
  } catch {
    // ignore storage access errors
  }
}

export function formatCurrency(amountInUsd, currency = getStoredCurrency()) {
  const { locale, rateFromUsd } = CURRENCIES[currency] ?? CURRENCIES.USD
  const converted = Number(amountInUsd) * rateFromUsd
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted)
}
