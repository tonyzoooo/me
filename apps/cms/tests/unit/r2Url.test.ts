import { describe, expect, it } from 'vitest'
import { r2FileUrl } from '@/r2Url'

describe('r2FileUrl', () => {
  it('keeps the separator between prefix and filename', () => {
    expect(r2FileUrl('https://media.example.com', 'media', 'a.jpg')).toBe(
      'https://media.example.com/media/a.jpg',
    )
  })

  it('handles a prefix that still carries its trailing slash', () => {
    expect(r2FileUrl('https://media.example.com', 'media/', 'a.jpg')).toBe(
      'https://media.example.com/media/a.jpg',
    )
  })

  it('omits the prefix segment when no prefix is configured', () => {
    expect(r2FileUrl('https://media.example.com', '', 'a.jpg')).toBe(
      'https://media.example.com/a.jpg',
    )
  })

  it('tolerates a trailing slash on the public url', () => {
    expect(r2FileUrl('https://media.example.com/', 'media', 'a.jpg')).toBe(
      'https://media.example.com/media/a.jpg',
    )
  })
})
