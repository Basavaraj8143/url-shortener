import { useEffect } from 'react'

const DEFAULT_TITLE = 'Snip · Short links, simply managed'

// Sets document.title for the current page. Call with no argument for the default title.
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Snip` : DEFAULT_TITLE
  }, [title])
}
