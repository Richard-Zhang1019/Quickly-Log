import type { TextEditor } from "vscode"
import { workspace, Position, Selection } from "vscode"
import { isObject, getLineText } from "../../utils"
import { resolveSelection } from "./resolveSelection"
import { resolveDefault } from "./resolveDefault"
import { getInsertLine } from "./getInsertLine"

export interface LogInfo {
  logs: string
  insertLine: number
  cursorPosition: {
    line: number
    character: number
  }
}

export interface Options {
  consoleVariablesName: boolean
}

const configuration = workspace.getConfiguration("quickConsole")
const consoleVariablesName: boolean | undefined = configuration.get("format.consoleVariablesName")
const options: Options = {
  consoleVariablesName: !!consoleVariablesName
}

let init = false
export function create(editor: TextEditor) {
  const { logs, insertLine, cursorPosition } = getLogInfo(editor)

  if (logs) {
    editor
      .edit((editBuilder) =>
        editBuilder.insert(new Position(insertLine, 0), logs)
      )
      .then(() => {
        setCursorPosition(editor, cursorPosition)
      })
    if (!init) {
      setCursorPosition(editor, cursorPosition)
      init = true
    }
  }
}

function getLogInfo(editor: TextEditor): LogInfo {
  const { line } = editor.selection.active

  const { logs, cursorPosition } = getLogsAndCursor(editor)
  const insertLine = getInsertLine(editor.document, line)

  if (isObject(getLineText(editor.document, line))) {
    cursorPosition.line = insertLine
  }

  return {
    logs,
    insertLine,
    cursorPosition,
  }
}

function getLogsAndCursor(editor: TextEditor): Omit<LogInfo, "insertLine"> {
  const selectedText = editor.document.getText(editor.selection)
  const { logs, cursorPosition } =
    selectedText.length > 0
      ? resolveSelection(editor, options)
      : resolveDefault(editor, options)

  return {
    logs,
    cursorPosition,
  }
}

function setCursorPosition(
  editor: TextEditor,
  cursorPosition: { line: number; character: number }
): Selection {
  const { line, character } = cursorPosition
  const position = new Position(line, character)

  editor.selection = new Selection(position, position)
  return editor.selection
}
