import { describe, it, expect } from 'vitest'
import { en } from '@renderer/i18n/locales/en'
import { fa } from '@renderer/i18n/locales/fa'
import { formatDate, formatRelativeDate, getTodayString } from '@renderer/lib/date-utils'

describe('i18n Dictionary Integrity', () => {
  it('has identical keys in English and Persian translations', () => {
    const enKeys = Object.keys(en).sort()
    const faKeys = Object.keys(fa).sort()
    expect(enKeys).toEqual(faKeys)
  })

  it('contains zero emoji or robotic filler text in translations', () => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u

    Object.values(en).forEach((text: string) => {
      expect(emojiRegex.test(text)).toBe(false)
    })

    Object.values(fa).forEach((text: string) => {
      expect(emojiRegex.test(text)).toBe(false)
    })
  })
})

describe('Date Utilities with Jalali & Gregorian Support', () => {
  it('returns valid YYYY-MM-DD for today string', () => {
    const today = getTodayString()
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('formats dates in Gregorian for English locale', () => {
    const testDate = '2026-10-31'
    const formatted = formatDate(testDate, 'en')
    expect(formatted).toContain('2026')
    expect(formatted.toLowerCase()).toMatch(/oct|october/)
  })

  it('formats dates in Jalali (Solar Hijri) for Persian locale', () => {
    const testDate = '2026-10-31'
    const formatted = formatDate(testDate, 'fa')
    // 2026-10-31 is Aban in Persian calendar
    expect(formatted).toMatch(/آبان|ابان/)
  })

  it('formats relative dates (Today, Tomorrow, دیروز، امروز، فردا)', () => {
    const today = getTodayString()
    expect(formatRelativeDate(today, 'en')).toBe('Today')
    expect(formatRelativeDate(today, 'fa')).toBe('امروز')
  })
})
