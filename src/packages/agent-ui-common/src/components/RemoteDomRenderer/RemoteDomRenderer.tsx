// @ts-nocheck

import React, {useState, useRef, useEffect, useCallback} from 'react'

import {UIResourceRenderer} from '@mcp-ui/client'

import './RemoteDomRenderer.scss'

interface RemoteDomRendererProps {
  url: string
  onUIAction?: (action: any) => void
  height?: string
  width?: string
  className?: string
  isDarkTheme?: boolean
  details?: any[]
}

export const RemoteDomRenderer: React.FC<RemoteDomRendererProps> = ({
  url,
  onUIAction,
  height = '100%',
  width = '100%',
  className = '',
  isDarkTheme,
  details = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState<string>(height)

  // Function to set a fixed height based on content type
  const determineHeight = useCallback(
    resource => {
      if (!resource) {
        return height
      }

      // Check if the resource contains chart data
      const isChart =
        resource.blob?.includes('chart') ||
        resource.blob?.includes('canvas') ||
        resource.blob?.includes('Chart.js')

      // Set appropriate height based on content type
      if (isChart) {
        return '400px' 
      }

      // Check if it's likely to be a table
      const isTable = resource.blob?.includes('table')
      if (isTable) {
        return '350px'
      }

      // Default height for other content
      return height
    },
    [height],
  )

  // Update container height when resource changes
  useEffect(() => {
    const mcpResource = details[0]?.extra_data?.html_resource
    if (mcpResource) {
      const newHeight = determineHeight(mcpResource)
      setContainerHeight(newHeight)
    }
  }, [details, determineHeight])

  // Add message listener for potential height messages from iframe
  useEffect(() => {
    const handleMessage = event => {
      // Check if the message is from our iframe
      if (event.data?.type === 'iframe-height') {
        setContainerHeight(`${event.data.height}px`)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const mcpResource = details[0]?.extra_data?.html_resource
  if (mcpResource?.uri?.startsWith('ui://')) {
    return (
      <div
        ref={containerRef}
        className='remote-dom-container'
        style={{width, height: containerHeight}}
      >
        <UIResourceRenderer
          htmlProps={{
            sandboxPermissions:
              'allow-scripts allow-downloads allow-downloads-without-user-activation',
          }}
          resource={mcpResource}
          onUIAction={result => {
            console.log('Action:', result)
            onUIAction?.(result)
          }}
        />
      </div>
    )
  }
  return <p>Unsupported resource</p>
}

export default RemoteDomRenderer
