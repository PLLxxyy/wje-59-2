import { useEffect, useRef } from 'react'
import { useOSStore } from '@/store/useOSStore'
import OSWindow from './OSWindow'
import { getAppRenderers } from '@/apps/registry'

const appRenderers = getAppRenderers()

export default function WindowManager() {
  const { windows, maximizeWindow, restoreWindow } = useOSStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const handleMaximizeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ windowId: string }>
      maximizeWindow(customEvent.detail.windowId)
    }

    const handleRestoreEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ windowId: string }>
      restoreWindow(customEvent.detail.windowId)
    }

    window.addEventListener('maximize-window', handleMaximizeEvent)
    window.addEventListener('restore-window', handleRestoreEvent)

    return () => {
      window.removeEventListener('maximize-window', handleMaximizeEvent)
      window.removeEventListener('restore-window', handleRestoreEvent)
    }
  }, [maximizeWindow, restoreWindow])

  const sortedWindows = [...windows].sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className="absolute inset-0 overflow-hidden">
      {sortedWindows.map((windowState) => {
        const renderer = appRenderers[windowState.appId]
        const children = renderer ? renderer(windowState.id) : null

        return (
          <OSWindow key={windowState.id} windowState={windowState}>
            {children}
          </OSWindow>
        )
      })}
    </div>
  )
}
