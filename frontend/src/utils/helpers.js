export const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export const getMonthName = (month) => {
  return new Date(2000, month - 1, 1).toLocaleString('en-US', { month: 'long' })
}

export const getAttendanceBadge = (status) => {
  const map = {
    PRESENT: 'badge-green',
    ABSENT: 'badge-red',
    LATE: 'badge-yellow'
  }
  return map[status] || 'badge-blue'
}

export const getRoleBadge = (role) => {
  const map = {
    ADMIN: 'badge-purple',
    STAFF: 'badge-blue',
    STUDENT: 'badge-green'
  }
  return map[role] || 'badge-blue'
}

export const getInitials = (firstName, lastName) => {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase()
}

export const truncate = (str, n = 50) => str?.length > n ? str.slice(0, n) + '...' : str

export const currentYear = new Date().getFullYear()
export const currentMonth = new Date().getMonth() + 1

export const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: getMonthName(i + 1)
}))

export const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)
