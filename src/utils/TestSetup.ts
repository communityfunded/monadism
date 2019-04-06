// Set the test environment
process.env.NODE_ENV = 'test'

const RealDate = Date

// Global date mock
class MockDate extends RealDate {
  static frozenTime = '2000-01-01T00:00:00z' // In the yeeeeeeaaaaar two thousaaaaaaand!

  // tslint:disable-next-line:no-any This has to be `any` to make any sense
  constructor (...args: any[]) {
    // @ts-ignore - test mock
    super(...args)

    if (args.length) {
      // @ts-ignore - test mock
      return new RealDate(...args)
    }

    return new RealDate(MockDate.frozenTime)
  }

  static now () {
    return new RealDate(MockDate.frozenTime).getTime()
  }
}

interface MockFile {
  parts: (string | Blob | ArrayBuffer | ArrayBufferView)[]
  filename: string
  properties: FilePropertyBag
}

// Global file mock
// tslint:disable-next-line:no-unnecessary-class
class MockFile implements MockFile {
  constructor (
    parts: MockFile['parts'],
    filename: MockFile['filename'],
    properties: MockFile['properties']
  ) {
    this.filename = filename
    this.properties = properties
    this.parts = parts
  }
}

// @ts-ignore - test mock
global.Date = MockDate

// @ts-ignore - test mock
global.File = MockFile

beforeEach(() => {
  jest.resetAllMocks()
})
