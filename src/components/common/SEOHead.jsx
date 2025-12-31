/**
 * SEO Head Component
 * مكون لإدارة meta tags و SEO (بدون react-helmet-async)
 */

import { useEffect } from 'react'
import { getPageSEO, generateMetaTags, STRUCTURED_DATA } from '@/config/seo'
import { APP_INFO } from '@/config/constants'

/**
 * SEO Head Component
 * @param {Object} props
 * @param {string} props.pageKey - Key from PAGE_SEO config
 * @param {string} props.title - Custom title (overrides config)
 * @param {string} props.description - Custom description (overrides config)
 * @param {string} props.canonical - Canonical URL
 * @param {Object} props.structuredData - Custom structured data
 * @param {boolean} props.noIndex - Prevent indexing
 */
export default function SEOHead({
    pageKey,
    title: customTitle,
    description: customDescription,
    canonical,
    structuredData,
    noIndex = false,
}) {
    // Get SEO config for page
    const seo = pageKey ? getPageSEO(pageKey) : {}

    // Use custom values or fallback to config
    const title = customTitle || seo.title || APP_INFO.FULL_NAME
    const description = customDescription || seo.description || APP_INFO.DESCRIPTION
    const shouldNoIndex = noIndex || seo.noIndex || false

    // Generate meta tags
    const metaTags = pageKey ? generateMetaTags(pageKey) : []

    useEffect(() => {
        // Update document title
        document.title = title

        // Update or create meta tags
        const updateMetaTag = (selector, attribute, value) => {
            let element = document.querySelector(selector)
            if (!element) {
                element = document.createElement('meta')
                if (attribute === 'name') {
                    element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''))
                } else if (attribute === 'property') {
                    element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''))
                }
                document.head.appendChild(element)
            }
            element.setAttribute('content', value)
        }

        // Basic meta tags
        updateMetaTag('meta[name="description"]', 'name', description)

        // Language & Direction
        document.documentElement.setAttribute('lang', APP_INFO.LANGUAGE)
        document.documentElement.setAttribute('dir', APP_INFO.DIRECTION)

        // Robots
        if (shouldNoIndex) {
            updateMetaTag('meta[name="robots"]', 'name', 'noindex, nofollow')
        } else {
            const robotsMeta = document.querySelector('meta[name="robots"]')
            if (robotsMeta) {
                robotsMeta.remove()
            }
        }

        // Canonical URL
        if (canonical) {
            let linkElement = document.querySelector('link[rel="canonical"]')
            if (!linkElement) {
                linkElement = document.createElement('link')
                linkElement.setAttribute('rel', 'canonical')
                document.head.appendChild(linkElement)
            }
            linkElement.setAttribute('href', canonical)
        }

        // Apply all generated meta tags
        metaTags.forEach(tag => {
            if (tag.name) {
                updateMetaTag(`meta[name="${tag.name}"]`, 'name', tag.content)
            } else if (tag.property) {
                updateMetaTag(`meta[property="${tag.property}"]`, 'property', tag.content)
            }
        })

        // Structured Data
        if (structuredData || (pageKey === 'landing')) {
            const scriptId = 'structured-data-script'
            let scriptElement = document.getElementById(scriptId)

            if (!scriptElement) {
                scriptElement = document.createElement('script')
                scriptElement.id = scriptId
                scriptElement.type = 'application/ld+json'
                document.head.appendChild(scriptElement)
            }

            if (structuredData) {
                scriptElement.textContent = JSON.stringify(structuredData)
            } else if (pageKey === 'landing') {
                // Add all structured data for landing page
                const allStructuredData = [
                    STRUCTURED_DATA.organization,
                    STRUCTURED_DATA.website,
                    STRUCTURED_DATA.softwareApplication,
                ]
                scriptElement.textContent = JSON.stringify(allStructuredData)
            }
        }

        // Cleanup function
        return () => {
            // Reset to default title on unmount
            document.title = APP_INFO.FULL_NAME
        }
    }, [title, description, shouldNoIndex, canonical, metaTags, structuredData, pageKey])

    // This component doesn't render anything
    return null
}
