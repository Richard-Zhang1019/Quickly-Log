import type { TextEditor, TextDocument } from "vscode"
import { LogInfo, Options } from "."
import { createLogInfo } from "../helper"
import {
  getLineText,
  getStartSpace,
  generateLog,
  isObject,
  isInObject,
} from "../../utils"
import { getLineOfObjectOpenBrace } from "./getInsertLine"

export function resolveDefault(editor: TextEditor, options: Options) {
  const logInfo = createLogInfo()
  getLogsAndCursor(editor, logInfo, options)

  return logInfo
}

function getLogsAndCursor(
  editor: TextEditor,
  logInfo: LogInfo & { push: (log: string) => void },
  options: Options
): void {
  const document = editor.document
  const { line, character } = editor.selection.active
  const lineText = getLineText(document, line)
  const word = getWord(lineText, character)
  const { cursorPosition, push } = logInfo
  const { consoleVariablesName } = options
  const text = isObject(lineText)
    ? getLineTextOfObject(document, line)
    : lineText

  // isInObject(word, getStartSpace(text), consoleVariablesName)
  push(
    generateLog(word, getStartSpace(text), consoleVariablesName)
  )

  cursorPosition.line = line + 1
  cursorPosition.character = logInfo.logs.length - 1
}

function getLineTextOfObject(document: TextDocument, line: number) {
  return getLineText(document, getLineOfObjectOpenBrace(document, line))
}

function getWord(lineText: string, character: number): string {
  const keyWords = [
    "const",
    "let",
    "var",
    "function",
    "class",
    "typeof",
    "import",
    "export",
  ]
  const words = lineText.split("")
  const target = isLetter(words[character]) ? [words[character]] : []
  let left = character - 1,
    right = character + 1
  while (left >= 0 && isLetter(words[left])) {
    target.unshift(words[left])
    left--
  }
  while (
    isLetter(words[character]) &&
    right < words.length &&
    isLetter(words[right])
  ) {
    target.push(words[right])
    right++
  }
  const targetStr = target.join("")
  if (keyWords.includes(targetStr)) {
    return ""
  }
  return targetStr
}

function isLetter(char: string) {
  return /[a-zA-Z0-9_\.]/.test(char)
}
