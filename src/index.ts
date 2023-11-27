import { commands } from "vscode"
import type { ExtensionContext } from "vscode"
import { createConsoleLog, clearConsoleLog, toggleConsoleLog } from "./core"

export function activate(context: ExtensionContext) {
  const createCommandId = "quickConsole.createConsoleLog"
  const clearCommandId = "quickConsole.clearConsoleLog"
  const toggleCommandId = "quickConsole.toggleConsoleLog"

  const create = commands.registerCommand(createCommandId, createConsoleLog)
  const clear = commands.registerCommand(clearCommandId, clearConsoleLog)
  const toggle = commands.registerCommand(toggleCommandId, toggleConsoleLog)

  context.subscriptions.push(create, clear, toggle)
}
