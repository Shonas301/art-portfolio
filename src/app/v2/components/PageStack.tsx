'use client'

import { Page } from './Page'
import { useFlipBook } from '../context/FlipBookContext'
import { pageContent } from '../data/portfolio-content'
import { LandingPage } from './pages/LandingPage'
import { IntroPage } from './pages/IntroPage'
import { GalleryGridPage } from './pages/GalleryGridPage'
import { CodePage } from './pages/CodePage'
import { ContactPage } from './pages/ContactPage'
import type { LandingData, IntroData, GalleryData, CodeData, ContactData } from '../data/portfolio-content'

export function PageStack() {
  const { state } = useFlipBook()
  const { currentPageIndex } = state

  // render the correct page component based on type
  const renderPageContent = (pageIndex: number) => {
    const content = pageContent[pageIndex]

    switch (content.type) {
      case 'landing':
        return <LandingPage title={content.title} data={content.data as LandingData} />

      case 'intro':
        return <IntroPage title={content.title} data={content.data as IntroData} />

      case 'gallery':
        return <GalleryGridPage title={content.title} data={content.data as GalleryData} />

      case 'code':
        return <CodePage title={content.title} data={content.data as CodeData} />

      case 'contact':
        return <ContactPage title={content.title} data={content.data as ContactData} />

      default:
        return null
    }
  }

  return (
    <>
      {/* render pages behind current page (visible edges on right) */}
      {pageContent.map((_, index) => {
        if (index <= currentPageIndex) return null

        const distanceFromCurrent = index - currentPageIndex
        // increase spacing for better visual depth: 6px per page instead of 2px
        // this gives more visible "book thickness"
        const edgeOffset = distanceFromCurrent * 6
        return (
          <Page
            key={`page-${index}`}
            showEdge={true}
            edgeOffset={edgeOffset}
            zIndex={pageContent.length - index}
          >
            {renderPageContent(index)}
          </Page>
        )
      })}

      {/* current active page */}
      <Page
        key={`current-page-${currentPageIndex}`}
        isActive={true}
        zIndex={pageContent.length + 1}
      >
        {renderPageContent(currentPageIndex)}
      </Page>
    </>
  )
}
