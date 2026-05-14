type SSEController = {
  close: () => void
}

/**
 * Creates a fetch-based SSE connection that supports custom headers
 * @param url URL to connect to
 * @param options config options including headers
 * @param onMessage Callback function for every time SSE data arrives
 * @param onError Callback function for error events
 * @param onOpen Callback function when connection is established
 * @returns Object with close function to terminate the connection
 */
export function createSSEConnection(
  url: string,
  options: any = {}, // anything type more specific not working,
  onMessage: (event: MessageEvent) => void,
  onError: (error: Event) => void,
  onOpen?: () => void,
  onClose?: () => void,
): SSEController {
  let abortController = new AbortController()
  let isClosed = false
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

  // use fetch to support custom headers
  const connectSSE = async () => {
    try {
      const response = await fetch(url, {
        method: options.method ?? 'GET',
        headers: options.headers,
        body: options.body,
        signal: abortController.signal,
      })

      // if server rejects the SSE request (e.g. 400/406), retry with
      // 'Accept: application/json' backward compatibility with
      // backends that only support JSON responses - postChat()
      if (
        !response.ok &&
        (response.status === 400 || response.status === 406)
      ) {
        console.log(
          `[SSE] Server returned ${response.status} for SSE request, retrying with Accept: application/json`,
        )
        const jsonResponse = await fetch(url, {
          method: options.method ?? 'GET',
          headers: {
            ...options.headers,
            Accept: 'application/json',
          },
          body: options.body,
          signal: abortController.signal,
        })

        if (!jsonResponse.ok) {
          // attempt extract error message from response body
          let errorMessage = `Request failed: ${jsonResponse.status}`
          try {
            const errorData = await jsonResponse.json()
            // check common error message fields
            if (errorData.error) {
              errorMessage = errorData.error
            } else if (errorData.message) {
              errorMessage = errorData.message
            } else if (errorData.detail) {
              errorMessage = errorData.detail
            } else {
              // include full error obj if no standard field found
              errorMessage = `Request failed: ${jsonResponse.status} - ${JSON.stringify(errorData)}`
            }
          } catch (parseError) {
            // If JSON parsing fails, try to get text
            try {
              const errorText = await jsonResponse.text()
              if (errorText) {
                errorMessage = `Request failed: ${jsonResponse.status} - ${errorText}`
              }
            } catch (textError) {
              // keep default error message
            }
          }
          throw new Error(errorMessage)
        }

        onOpen?.()

        const jsonData = await jsonResponse.json()
        onMessage(
          new MessageEvent('agent-event', {
            data: JSON.stringify(jsonData),
          }),
        )
        if (!isClosed) {
          onClose?.()
        }
        return
      }

      if (!response.ok || !response.body) {
        throw new Error(`SSE failed: ${response.status}`)
      }

      onOpen?.()

      const contentType = response.headers.get('Content-Type') ?? ''

      // If the server responded with JSON (backward compatibility fallback)
      if (contentType.includes('application/json')) {
        console.log(
          '[SSE] Server responded with JSON (SSE not supported), handling as fallback',
        )
        const jsonData = await response.json()
        onMessage(
          new MessageEvent('agent-event', {
            data: JSON.stringify(jsonData),
          }),
        )
        if (!isClosed) {
          onClose?.()
        }
        return
      }

      // access response stream (SSE)
      reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Response body is not readable')
      }

      let buffer = ''
      let eventType = 'message'
      let dataBuffer: string[] = []

      while (!isClosed) {
        const {value, done} = await reader.read()
        if (done) break

        buffer += decoder.decode(value, {stream: true})
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const rawLine of lines) {
          const line = rawLine.trimEnd()

          if (line === '') {
            if (dataBuffer.length > 0) {
              onMessage(
                new MessageEvent(eventType, {
                  data: dataBuffer.join('\n'),
                }),
              )
              dataBuffer = []
              eventType = 'message'
            }
            continue
          }

          if (line.startsWith(':')) {
            continue // comment / keepalive
          }

          if (line.startsWith('event:')) {
            eventType = line.slice(6).trim()
          } else if (line.startsWith('data:')) {
            dataBuffer.push(line.slice(5).trim())
          }
        }
      }

      // Notify that the stream has closed normally
      if (!isClosed) {
        onClose?.()
      }
    } catch (error: any) {
      if (!isClosed && error.name !== 'AbortError') {
        console.error('SSE connection error:', error)
        onError(error as Event)
      }
    } finally {
      // clean up reader
      if (reader) {
        try {
          reader.releaseLock()
        } catch (e) {
          // reader may be released alredy
        }
      }
    }
  }

  // start connection
  connectSSE()

  return {
    close: () => {
      isClosed = true
      abortController.abort()
      // cancel reader if it exists
      if (reader) {
        reader.cancel().catch(() => {
          // ignore errors during cancel
        })
      }
    },
  }
}
