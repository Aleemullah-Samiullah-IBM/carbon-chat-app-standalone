// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import React, {useEffect, useState} from 'react'
import {ChatProvider} from '../contexts/ChatContext'

/**
 * Shared test component patterns to reduce duplication across test files
 */

/**
 * Creates a test component that sets context values and renders them
 */
export const createContextTestComponent = (
  contextHook: () => any,
  setupFn: (context: any) => void,
  renderFn: (context: any) => React.ReactElement,
) => {
  return () => {
    const context = contextHook()

    useEffect(() => {
      setupFn(context)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return renderFn(context)
  }
}

/**
 * Creates a test component with async setup
 */
export const createAsyncTestComponent = (
  contextHook: () => any,
  setupFn: (context: any) => void,
  renderFn: (context: any) => React.ReactElement,
  delay: number = 0,
) => {
  return () => {
    const context = contextHook()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
      setupFn(context)
      setIsReady(true)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (!isReady) return

      const timer = setTimeout(() => {
        // Additional async operations can be triggered here
      }, delay)
      return () => clearTimeout(timer)
    }, [isReady])

    return renderFn(context)
  }
}

/**
 * Wraps a component with ChatProvider for testing
 */
export const withChatProvider = (Component: React.ComponentType) => {
  return (props: any) => (
    <ChatProvider>
      <Component {...props} />
    </ChatProvider>
  )
}

/**
 * Creates a simple test component that displays a single value
 */
export const createValueDisplayComponent = (
  contextHook: () => any,
  valueName: string,
  getValue: (context: any) => any,
  transform: (value: any) => string = v => String(v),
) => {
  return () => {
    const context = contextHook()
    const value = getValue(context)
    return <div data-testid={valueName}>{transform(value)}</div>
  }
}

/**
 * Creates a test component that sets a value and displays it
 */
export const createSetterTestComponent = (
  contextHook: () => any,
  setupFn: (context: any) => void,
  displays: Array<{
    testId: string
    getValue: (context: any) => any
    transform?: (value: any) => string
  }>,
) => {
  return () => {
    const context = contextHook()

    useEffect(() => {
      setupFn(context)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div>
        {displays.map(({testId, getValue, transform = v => String(v)}) => (
          <div
            key={testId}
            data-testid={testId}
          >
            {transform(getValue(context))}
          </div>
        ))}
      </div>
    )
  }
}

/**
 * Creates a test component for testing date/time logic
 */
export const createDateTestComponent = (
  contextHook: () => any,
  setDate: (context: any, date: string) => void,
  checkFn: (context: any) => boolean,
  dateValue: string,
) => {
  return () => {
    const context = contextHook()

    useEffect(() => {
      setDate(context, dateValue)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div data-testid='result'>{checkFn(context).toString()}</div>
  }
}

/**
 * Creates a test component for testing array/list operations
 */
export const createListTestComponent = (
  contextHook: () => any,
  setList: (context: any, items: any[]) => void,
  getList: (context: any) => any[],
  items: any[],
  renderItem: (item: any) => React.ReactElement,
) => {
  return () => {
    const context = contextHook()

    useEffect(() => {
      setList(context, items)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const list = getList(context)

    return (
      <div>
        <div data-testid='count'>{list.length}</div>
        {list.map(renderItem)}
      </div>
    )
  }
}

/**
 * Creates a test component with delayed action
 */
export const createDelayedActionComponent = (
  contextHook: () => any,
  initialSetup: (context: any) => void,
  delayedAction: (context: any) => void,
  renderFn: (context: any) => React.ReactElement,
  delay: number = 10,
) => {
  return () => {
    const context = contextHook()

    useEffect(() => {
      initialSetup(context)

      const timer = setTimeout(() => {
        delayedAction(context)
      }, delay)

      return () => clearTimeout(timer)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return renderFn(context)
  }
}

/**
 * Creates a test component that captures callback values
 */
export const createCallbackCaptureComponent = (
  contextHook: () => any,
  registerCallback: (context: any, callback: (value: any) => void) => void,
  triggerCallback: (context: any) => void,
) => {
  return () => {
    const context = contextHook()
    const [capturedValue, setCapturedValue] = useState('')
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
      registerCallback(context, (value: any) => {
        setCapturedValue(value)
      })
      setIsReady(true)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (!isReady) return

      const timer = setTimeout(() => {
        triggerCallback(context)
      }, 50)

      return () => clearTimeout(timer)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady])

    return <div data-testid='captured'>{capturedValue}</div>
  }
}

/**
 * Creates a test component with ref testing
 */
export const createRefTestComponent = (
  contextHook: () => any,
  getRef: (context: any) => React.RefObject<any>,
  checkRef: (
    ref: React.RefObject<any>,
    setStatus: (status: string) => void,
  ) => void,
  renderElement: (ref: React.RefObject<any>) => React.ReactElement,
) => {
  return () => {
    const context = contextHook()
    const ref = getRef(context)
    const [refStatus, setRefStatus] = useState('null')

    useEffect(() => {
      const timer = setTimeout(() => {
        checkRef(ref, setRefStatus)
      }, 0)

      return () => clearTimeout(timer)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div>
        {renderElement(ref)}
        <div data-testid='ref-status'>{refStatus}</div>
      </div>
    )
  }
}
