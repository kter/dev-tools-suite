import { describe, it, expect } from 'vitest'
import { calculateIP, isValidIP, intToIP, ipToBinary, getNetworkClass } from '../../../tools/ip-calculator/utils/ip-utils'

describe('isValidIP', () => {
  it('returns true for valid IPv4 addresses', () => {
    expect(isValidIP('192.168.1.1')).toBe(true)
    expect(isValidIP('0.0.0.0')).toBe(true)
    expect(isValidIP('255.255.255.255')).toBe(true)
    expect(isValidIP('10.0.0.1')).toBe(true)
  })

  it('returns false for invalid IPv4 addresses', () => {
    expect(isValidIP('256.0.0.1')).toBe(false)
    expect(isValidIP('192.168.1')).toBe(false)
    expect(isValidIP('192.168.1.1.1')).toBe(false)
    expect(isValidIP('not.an.ip.addr')).toBe(false)
    expect(isValidIP('')).toBe(false)
  })
})

describe('intToIP', () => {
  it('converts integer to IP address string', () => {
    expect(intToIP(0xC0A80101)).toBe('192.168.1.1')
    expect(intToIP(0x00000000)).toBe('0.0.0.0')
    expect(intToIP(0xFFFFFFFF)).toBe('255.255.255.255')
  })
})

describe('getNetworkClass', () => {
  it('returns correct class for first octet ranges', () => {
    expect(getNetworkClass(10)).toBe('A')
    expect(getNetworkClass(172)).toBe('B')
    expect(getNetworkClass(192)).toBe('C')
    expect(getNetworkClass(224)).toBe('D (Multicast)')
    expect(getNetworkClass(240)).toBe('E (Reserved)')
    expect(getNetworkClass(127)).toBe('Unknown')
  })
})

describe('ipToBinary', () => {
  it('converts IP to binary representation', () => {
    expect(ipToBinary('192.168.1.1')).toBe('11000000.10101000.00000001.00000001')
    expect(ipToBinary('0.0.0.0')).toBe('00000000.00000000.00000000.00000000')
    expect(ipToBinary('255.255.255.255')).toBe('11111111.11111111.11111111.11111111')
  })
})

describe('calculateIP', () => {
  it('calculates subnet information for 192.168.1.1/24', () => {
    const result = calculateIP('192.168.1.1/24')
    expect(result.ipAddress).toBe('192.168.1.1')
    expect(result.subnetMask).toBe('255.255.255.0')
    expect(result.cidr).toBe(24)
    expect(result.networkAddress).toBe('192.168.1.0')
    expect(result.broadcastAddress).toBe('192.168.1.255')
    expect(result.firstHost).toBe('192.168.1.1')
    expect(result.lastHost).toBe('192.168.1.254')
    expect(result.totalHosts).toBe(256)
    expect(result.usableHosts).toBe(254)
    expect(result.networkClass).toBe('C')
  })

  it('calculates subnet information for 10.0.0.0/8', () => {
    const result = calculateIP('10.0.0.0/8')
    expect(result.subnetMask).toBe('255.0.0.0')
    expect(result.networkAddress).toBe('10.0.0.0')
    expect(result.broadcastAddress).toBe('10.255.255.255')
    expect(result.totalHosts).toBe(16777216)
    expect(result.usableHosts).toBe(16777214)
    expect(result.networkClass).toBe('A')
  })

  it('handles /32 (single host)', () => {
    const result = calculateIP('192.168.1.1/32')
    expect(result.totalHosts).toBe(1)
    expect(result.usableHosts).toBe(0)
    expect(result.networkAddress).toBe('192.168.1.1')
    expect(result.broadcastAddress).toBe('192.168.1.1')
  })

  it('throws for invalid CIDR notation', () => {
    expect(() => calculateIP('192.168.1.1')).toThrow()
    expect(() => calculateIP('192.168.1.1/33')).toThrow()
    expect(() => calculateIP('999.168.1.1/24')).toThrow()
  })
})
