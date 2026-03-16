export interface IPCalculation {
  ipAddress: string
  subnetMask: string
  cidr: number
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  totalHosts: number
  usableHosts: number
  networkClass: string
  ipBinary: string
  subnetMaskBinary: string
}

export function isValidIP(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false

  return parts.every(part => {
    const num = parseInt(part)
    return !isNaN(num) && num >= 0 && num <= 255
  })
}

export function intToIP(int: number): string {
  return [
    (int >>> 24) & 0xFF,
    (int >>> 16) & 0xFF,
    (int >>> 8) & 0xFF,
    int & 0xFF
  ].join('.')
}

export function getNetworkClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return 'A'
  if (firstOctet >= 128 && firstOctet <= 191) return 'B'
  if (firstOctet >= 192 && firstOctet <= 223) return 'C'
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)'
  if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)'
  return 'Unknown'
}

export function ipToBinary(ip: string): string {
  return ip.split('.')
    .map(octet => parseInt(octet).toString(2).padStart(8, '0'))
    .join('.')
}

export function calculateIP(input: string): IPCalculation {
  const parts = input.trim().split('/')
  if (parts.length !== 2) {
    throw new Error('Please enter IP address in CIDR notation (e.g., 192.168.1.1/24)')
  }

  const ipAddress = parts[0]
  const cidr = parseInt(parts[1])

  if (!isValidIP(ipAddress)) {
    throw new Error('Invalid IP address format')
  }

  if (cidr < 0 || cidr > 32) {
    throw new Error('CIDR must be between 0 and 32')
  }

  const ipParts = ipAddress.split('.').map(part => parseInt(part))
  const ipInt = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3]

  const subnetMaskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0
  const networkInt = (ipInt & subnetMaskInt) >>> 0
  // Note: JavaScript's >>> is limited to 32-bit, so special-case /32 and /0
  const broadcastInt = cidr === 32
    ? networkInt
    : cidr === 0
      ? 0xFFFFFFFF >>> 0
      : (networkInt | (0xFFFFFFFF >>> cidr)) >>> 0

  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0

  return {
    ipAddress,
    subnetMask: intToIP(subnetMaskInt),
    cidr,
    networkAddress: intToIP(networkInt),
    broadcastAddress: intToIP(broadcastInt),
    firstHost: intToIP(networkInt + 1),
    lastHost: intToIP(broadcastInt - 1),
    totalHosts,
    usableHosts,
    networkClass: getNetworkClass(ipParts[0]),
    ipBinary: ipToBinary(ipAddress),
    subnetMaskBinary: ipToBinary(intToIP(subnetMaskInt))
  }
}
