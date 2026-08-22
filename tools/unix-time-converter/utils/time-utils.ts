export interface UnixToHumanResult {
  local: string
  utc: string
}

export interface HumanToUnixResult {
  local: string
  utc: string
}

export function convertUnixToHuman(unixTimestamp: number): UnixToHumanResult {
  if (isNaN(unixTimestamp)) {
    return { local: 'Invalid timestamp', utc: 'Invalid timestamp' }
  }

  const date = new Date(unixTimestamp * 1000)
  return {
    local: date.toLocaleString(),
    utc: date.toUTCString(),
  }
}

export function convertHumanToUnix(dateStr: string, timeStr: string): HumanToUnixResult {
  if (!dateStr || !timeStr) {
    return { local: '', utc: '' }
  }

  const localDate = new Date(`${dateStr}T${timeStr}`)
  const utcDate = new Date(`${dateStr}T${timeStr}Z`)

  if (isNaN(localDate.getTime()) || isNaN(utcDate.getTime())) {
    return { local: 'Invalid date/time', utc: 'Invalid date/time' }
  }

  return {
    local: Math.floor(localDate.getTime() / 1000).toString(),
    utc: Math.floor(utcDate.getTime() / 1000).toString(),
  }
}
