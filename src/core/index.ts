import { window } from "vscode"
import { create } from "./create"
import { clear } from "./clear"
import { toggle } from "./toggle"

export function createConsoleLog() {
  const editor = window.activeTextEditor
  if (!editor) {
    return
  }

  create(editor)
}

export function clearConsoleLog() {
  const editor = window.activeTextEditor
  if (!editor) {
    return
  }

  clear(editor)
}

export function toggleConsoleLog() {
  const editor = window.activeTextEditor
  if (!editor) {
    return
  }

  toggle(editor)
}
