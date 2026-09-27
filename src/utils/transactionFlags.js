import toast from 'react-hot-toast'

export function notifyFlags(flags) {
  flags?.forEach((flag) => toast(flag, { icon: '⚠️', duration: 6000 }))
}
