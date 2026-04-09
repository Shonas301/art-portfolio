import { describe, it, expect } from 'vitest'
import {
  getPhysicalPageForSection,
  getSectionAtPage,
  getLastContentPage,
  sectionMappings,
  TOTAL_PAGES,
} from '@/app/v2/data/portfolio-content'

describe('sectionMappings data integrity', () => {
  it('has at least one section', () => {
    expect(sectionMappings.length).toBeGreaterThan(0)
  })

  it('all physical pages are within TOTAL_PAGES bounds', () => {
    for (const mapping of sectionMappings) {
      expect(mapping.physicalPage).toBeGreaterThanOrEqual(0)
      expect(mapping.physicalPage).toBeLessThan(TOTAL_PAGES)
    }
  })

  it('all sections have unique ids', () => {
    const ids = sectionMappings.map(s => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all sections have unique physical pages', () => {
    const pages = sectionMappings.map(s => s.physicalPage)
    expect(new Set(pages).size).toBe(pages.length)
  })

  it('physical pages are in ascending order', () => {
    for (let i = 1; i < sectionMappings.length; i++) {
      expect(sectionMappings[i].physicalPage).toBeGreaterThan(sectionMappings[i - 1].physicalPage)
    }
  })
})

describe('getPhysicalPageForSection', () => {
  it('returns correct page for known section', () => {
    expect(getPhysicalPageForSection('landing')).toBe(0)
  })

  it('returns correct page for last section', () => {
    expect(getPhysicalPageForSection('contact')).toBe(46)
  })

  it('returns correct page for mid-book section', () => {
    expect(getPhysicalPageForSection('3d-work')).toBe(14)
  })

  it('returns 0 for unknown section (fallback)', () => {
    expect(getPhysicalPageForSection('nonexistent')).toBe(0)
  })

  it('returns 0 for empty string', () => {
    expect(getPhysicalPageForSection('')).toBe(0)
  })

  it('returns valid page for every defined section', () => {
    for (const mapping of sectionMappings) {
      const page = getPhysicalPageForSection(mapping.id)
      expect(page).toBe(mapping.physicalPage)
    }
  })
})

describe('getSectionAtPage', () => {
  it('returns section for a page that has content', () => {
    const section = getSectionAtPage(0)
    expect(section).not.toBeNull()
    expect(section!.id).toBe('landing')
  })

  it('returns null for a blank page between sections', () => {
    // page 3 is between landing (0) and intro (7)
    expect(getSectionAtPage(3)).toBeNull()
  })

  it('returns null for a blank page mid-book', () => {
    // page 20 is between 3d-work (14) and 2d-work (22)
    expect(getSectionAtPage(20)).toBeNull()
  })

  it('returns null for page beyond TOTAL_PAGES', () => {
    expect(getSectionAtPage(999)).toBeNull()
  })

  it('returns null for negative page', () => {
    expect(getSectionAtPage(-1)).toBeNull()
  })

  it('finds every defined section by its physical page', () => {
    for (const mapping of sectionMappings) {
      const found = getSectionAtPage(mapping.physicalPage)
      expect(found).not.toBeNull()
      expect(found!.id).toBe(mapping.id)
    }
  })
})

describe('getLastContentPage', () => {
  it('returns the highest physical page among all sections', () => {
    const last = getLastContentPage()
    const maxPage = Math.max(...sectionMappings.map(s => s.physicalPage))
    expect(last).toBe(maxPage)
  })

  it('is within TOTAL_PAGES bounds', () => {
    expect(getLastContentPage()).toBeLessThan(TOTAL_PAGES)
  })
})
