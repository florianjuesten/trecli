/* eslint-disable no-unused-vars */
import { injectable } from 'inversify'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const term = require('terminal-kit').terminal

export interface SingleColumnMenuResponse {
  selectedIndex: number // the user-selected menu item index
  selectedText: string // the user-selected menu item text
  key: string // the user-selected menu item key
  x: number // the x coordinate of the selected menu item (the first character)
  y: number // the y coordinate of the selected menu item
  unexpectedKey: string // when 'exitOnUnexpectedKey' option is set, this contains the key that produced the exit
  canceled: boolean // when 'cancelable' option is set, this is set to true
}

export interface ICliWrapper {
  startColumnMenu(items: string[]): Promise<SingleColumnMenuResponse>
}

// TODO: rename me!
@injectable()
export class CliWrapper implements ICliWrapper {
  constructor() {
    // TODO: reenable this in production
    // term.fullscreen(true)
  }

  public getTermWidth(): number {
    return term.width
  }

  public async readFromSTDIN(placeholder?: string): Promise<string> {
    term('Please enter your input: ')

    const input = await term.inputField({ default: placeholder }).promise

    term.green("\nInput is '%s'\n", input)
    return input
  }

  public startColumnMenu(items: string[]): Promise<SingleColumnMenuResponse> {
    return new Promise((resolve, reject) => {
      term.singleColumnMenu(
        items,
        {
          style: term.green,
          selectedStyle: term.dim.blue.bgBlack,
          leftPadding: ' > '
        },
        function (error: Error, response: SingleColumnMenuResponse) {
          if (error) {
            reject(error)
          }

          term.clear()
          resolve(response)
        }
      )
    })
  }

  public refresh(): void {
    term.clear()
    // TODO: restart loop
  }
}
