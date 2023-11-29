import type { TextDocument } from "vscode"
import { window, Position } from "vscode"
import type { Options } from "../core/create"

export function isVariable(lineText: string): boolean {
  return (
    lineText.includes("const") ||
    lineText.includes("let") ||
    lineText.includes("var")
  )
}

export function isFunction(lineText: string): boolean {
  return lineText.includes("function") || lineText.includes("=>")
}

export function isObject(lineText: string): boolean {
  return (
    lineText.replace(/\s/g, "").includes("={") ||
    (!isVariable(lineText) && lineText.includes(":") && !isFunction(lineText))
  )
}

export const isInObject = (
  log: string,
  space: string,
  options: Options
) => {
  const { } = options
  const editor = window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const cursorPosition = editor.selection.active;

    let isInBraces = false;
    let openBracesCount = 0;
    let closeBracesCount = 0;
    let bracesEndLine = cursorPosition.line;

    // 遍历文档中的每一行，直到光标所在行
    for (let line = 0; line <= cursorPosition.line; line++) {
      const lineText = document.lineAt(line).text;
      const endCharacter = line === cursorPosition.line ? cursorPosition.character : lineText.length;

      // 遍历直到行尾或光标位置
      for (let character = 0; character < endCharacter; character++) {
        const char = lineText[character];
        if (char === '{') {
          openBracesCount++;
        } else if (char === '}') {
          closeBracesCount++;
        }
      }
    }

    // 如果打开花括号的数量多于关闭花括号的数量，则光标在花括号内
    if (openBracesCount > closeBracesCount) {
      isInBraces = true;
    }

    // 如果确定光标在花括号内，接下来确保在光标位置之后没有未匹配的 '}'
    if (isInBraces) {
      for (let line = cursorPosition.line; line < document.lineCount; line++) {
        const lineText = document.lineAt(line).text;
        const startCharacter = line === cursorPosition.line ? cursorPosition.character : 0;

        for (let character = startCharacter; character < lineText.length; character++) {
          const char = lineText[character];
          if (char === '}') {
            closeBracesCount++;
          }

          // 当找到匹配的闭合大括号时，记录行号
          if (openBracesCount === closeBracesCount) {
            bracesEndLine = line;
            break;
          }
        }

        // 如果关闭花括号的数量等于打开花括号的数量，则光标不在花括号内
        if (closeBracesCount === openBracesCount) {
          isInBraces = false;
          break;
        }
      }

      const insertPosition = new Position(bracesEndLine + 1, 0);
      editor.edit((editBuilder) => {
        editBuilder.insert(insertPosition, generateLog(log, space, options, document, cursorPosition.line));
      });
    }
  }
}

export function getLineText(
  document: TextDocument,
  line: number,
  clearSpace = false
): string {
  const text = document.lineAt(line).text
  return clearSpace ? text.replace(/\s/g, "") : text
}

export function getStartSpace(lineText: string): string {
  let spaceNumber = 0,
    tabNumber = 0
  for (let i = 0; i < lineText.length; i++) {
    if (lineText[i] === " ") {
      spaceNumber++
    } else if (lineText[i] === "\t") {
      tabNumber++
    } else {
      break
    }
  }

  tabNumber += isFunction(lineText) ? 1 : 0
  return " ".repeat(spaceNumber) + "\t".repeat(tabNumber)
}

export function generateLog(
  log: string,
  space: string,
  options: Options,
  document: TextDocument,
  lineNumber: number
): string {
  const { consoleVariablesName, consoleFilename, consoleLineNumber } = options
  if (Object.values(options).filter(item => item === true).length === 0) {
    return `${space}console.log(${log})\n`
  }
  let res = ''
  if (consoleVariablesName) {
    res += log
  }
  if (consoleFilename) {
    res += `${res ? ' ': ''}in ${document.fileName.split('/').at(-2)}/${document.fileName.split('/').at(-1)}`
  }
  if (consoleLineNumber) {
    res += `${res ? ' ': ''}on line ${lineNumber}`
  }
  return `${space}console.log('${res}:', ${log})\n`
}

export function isStartWithConsole(line: string) {
  return line.trim().startsWith("console.log(")
}

export function isStartWithCommentConsole(line: string) {
  return line.trim().replace(/\s/g, "").startsWith("//console.log(")
}
