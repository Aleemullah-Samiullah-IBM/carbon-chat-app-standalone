import '@testing-library/jest-dom'
import '../i18n/config'

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock DataTransfer for tests
class DataTransferItemMock {
  private file: File

  constructor(file: File) {
    this.file = file
  }
}

class DataTransferItemListMock {
  private items: DataTransferItemMock[] = []
  private parent: any

  constructor(parent: any) {
    this.parent = parent
  }

  add(file: File) {
    this.items.push(new DataTransferItemMock(file))
    // Update the parent's files array when items are added
    this.parent._updateFiles()
  }

  get length() {
    return this.items.length
  }

  getFiles() {
    return this.items.map((item: any) => item.file)
  }
}

global.DataTransfer = class DataTransfer {
  items: DataTransferItemListMock
  files: File[]

  constructor() {
    this.files = []
    this.items = new DataTransferItemListMock(this)
  }

  _updateFiles() {
    this.files = (this.items as any).getFiles()
  }
} as any

// Patch HTMLInputElement to make 'files' property configurable
// This allows tests and component code to redefine the property
const originalCreateElement = document.createElement.bind(document)
document.createElement = function (tagName: string, options?: any) {
  const element = originalCreateElement(tagName, options)
  
  if (tagName.toLowerCase() === 'input') {
    // Define files property as configurable so it can be redefined in tests
    Object.defineProperty(element, 'files', {
      value: null,
      writable: true,
      configurable: true,
    })
  }
  
  return element
} as any
