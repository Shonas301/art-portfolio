import { describe, it, expect } from 'vitest'
import { getYouTubeVideoId, getYouTubeEmbedUrl } from '@/lib/youtube'

describe('getYouTubeVideoId', () => {
  it('extracts id from standard youtube.com/watch url', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=bdrST1IbN3k')).toBe('bdrST1IbN3k')
  })

  it('extracts id from youtube.com/watch without www', () => {
    expect(getYouTubeVideoId('https://youtube.com/watch?v=bdrST1IbN3k')).toBe('bdrST1IbN3k')
  })

  it('extracts id from short youtu.be url', () => {
    expect(getYouTubeVideoId('https://youtu.be/bdrST1IbN3k')).toBe('bdrST1IbN3k')
  })

  it('extracts id from embed url', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/embed/bdrST1IbN3k')).toBe('bdrST1IbN3k')
  })

  it('extracts id from url with timestamp parameter', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=bdrST1IbN3k&t=120')).toBe('bdrST1IbN3k')
  })

  it('extracts id from url with playlist parameter', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=bdrST1IbN3k&list=PLxyz')).toBe('bdrST1IbN3k')
  })

  it('extracts id from youtu.be with timestamp', () => {
    expect(getYouTubeVideoId('https://youtu.be/bdrST1IbN3k?t=30')).toBe('bdrST1IbN3k')
  })

  it('returns null for invalid url', () => {
    expect(getYouTubeVideoId('not-a-url')).toBeNull()
  })

  it('returns null for non-youtube url', () => {
    expect(getYouTubeVideoId('https://vimeo.com/12345')).toBeNull()
  })

  it('returns null for youtube url without video id', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/channel/UCxyz')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(getYouTubeVideoId('')).toBeNull()
  })
})

describe('getYouTubeEmbedUrl', () => {
  it('converts standard watch url to embed url', () => {
    expect(getYouTubeEmbedUrl('https://www.youtube.com/watch?v=bdrST1IbN3k'))
      .toBe('https://www.youtube.com/embed/bdrST1IbN3k')
  })

  it('converts short url to embed url', () => {
    expect(getYouTubeEmbedUrl('https://youtu.be/bdrST1IbN3k'))
      .toBe('https://www.youtube.com/embed/bdrST1IbN3k')
  })

  it('returns embed url unchanged (idempotent)', () => {
    expect(getYouTubeEmbedUrl('https://www.youtube.com/embed/bdrST1IbN3k'))
      .toBe('https://www.youtube.com/embed/bdrST1IbN3k')
  })

  it('returns null for invalid url', () => {
    expect(getYouTubeEmbedUrl('not-a-url')).toBeNull()
  })

  it('returns null for non-youtube url', () => {
    expect(getYouTubeEmbedUrl('https://vimeo.com/12345')).toBeNull()
  })
})
