import type { TextEditor } from "vscode"
import { Selection, Position } from "vscode"
import { getLineText, isStartWithConsole } from "../../utils"

export function clear(editor: TextEditor) {
  const logsLines = getLogsLines(editor)

  clearUp(logsLines, editor)
}

function clearUp(logsLines: number[][], editor: TextEditor) {
  if (logsLines.length > 0) {
    editor.edit((editBuilder) => {
      logsLines.forEach((item) => {
        const selection = new Selection(
          new Position(item[0], 0),
          new Position(item[item.length - 1] + 1, 0)
        )
        editBuilder.delete(selection)
      })
    })
  }
}

function getLogsLines(editor: TextEditor): number[][] {
  const document = editor.document
  const totalLines = document.lineCount
  const logsLines: number[][] = []
  let cell: number[] = []
  for (let i = 0; i < totalLines; i++) {
    if (isStartWithConsole(getLineText(document, i))) {
      if (isNextLineConsole(cell, i)) {
        cell.push(i)
      } else {
        cell.length > 0 && logsLines.push(cell)
        cell = []
        cell.push(i)
      }
    }
  }
  if (cell.length > 0) {
    logsLines.push(cell)
  }
  return logsLines
}

function isNextLineConsole(cell: number[], line: number) {
  return cell.length > 0 && line === cell[cell.length - 1] + 1
}
