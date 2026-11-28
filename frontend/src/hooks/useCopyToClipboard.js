import { useCallback, useEffect, useRef, useState } from 'react'

// Copies text, tracks a short-lived `copied` flag, and reports failures
// (clipboard denied / insecure context) instead of throwing.
export default function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(async text => {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setCopyFailed(false)
      timer.current = setTimeout(() => setCopied(false), resetMs)
      return true
    } catch {
      setCopied(false)
      setCopyFailed(true)
      return false
    }
  }, [resetMs])

  return { copied, copyFailed, copy }
}
