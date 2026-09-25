function addInterval(date, interval) {
  const next = new Date(date)
  if (interval === 'WEEKLY') {
    next.setDate(next.getDate() + 7)
  } else {
    next.setMonth(next.getMonth() + 1)
  }
  return next
}

module.exports = { addInterval }
