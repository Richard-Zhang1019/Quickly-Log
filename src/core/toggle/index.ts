import type { TextEditor } from "vscode"
import { Position, Selection } from "vscode"
import {
  getLineText,
  getStartSpace,
  isStartWithCommentConsole,
  isStartWithConsole,
} from "../../utils"

interface LogLine {
  i: number
  start: number
}

export function toggle(editor: TextEditor) {
  const { logsLines, commentLogsLines } = getLogsLines(editor)

  if (logsLines.length > commentLogsLines.length) {
    toggleUp(logsLines, editor)
  } else {
    toggleDown(commentLogsLines, editor)
  }
}

function toggleUp(logsLines: LogLine[], editor: TextEditor) {
  if (logsLines.length > 0) {
    editor.edit((editBuilder) => {
      logsLines.forEach((item) => {
        const logPosition = new Position(item.i, item.start)
        editBuilder.insert(logPosition, "// ")
      })
    })
  }
}

function toggleDown(commentLogsLines: LogLine[], editor: TextEditor) {
  if (commentLogsLines.length > 0) {
    editor.edit((editBuilder) => {
      commentLogsLines.forEach((item) => {
        const selection = new Selection(
          new Position(item.i, item.start),
          new Position(item.i, item.start + 3)
        )
        editBuilder.replace(selection, "")
      })
    })
  }
}

function getLogsLines(editor: TextEditor): {
  logsLines: LogLine[]
  commentLogsLines: LogLine[]
} {
  const document = editor.document
  const totalLines = document.lineCount
  const logsLines: LogLine[] = []
  const commentLogsLines: LogLine[] = []
  for (let i = 0; i < totalLines; i++) {
    const line = getLineText(document, i)
    if (isStartWithConsole(line)) {
      const start = getStartSpace(line).length
      logsLines.push({ i, start })
    } else if (isStartWithCommentConsole(line)) {
      const start = getStartSpace(line).length
      commentLogsLines.push({ i, start })
    }
  }
  return { logsLines, commentLogsLines }
}
