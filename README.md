<center>
  <img src="https://richardzhang.gallerycdn.vsassets.io/extensions/richardzhang/quickly-log/0.0.6/1701179475733/Microsoft.VisualStudio.Services.Icons.Default" />
</center>

# Quickly Log

A quickly generate console.log extension in vscode

<a href="https://marketplace.visualstudio.com/items?itemName=RichardZhang.quickly-log" target="_blank">
  <img src="https://img.shields.io/visual-studio-marketplace/v/RichardZhang.quickly-log.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" />
</a>

## Usage

### Quickly generate console.log

- Move the cursor near in variable.
- Press `Cmd + Shift + L` (Mac) or `Ctrl + Shift + L` (Windows).
- Next line will be:<br />
  console.log('variable:', variable)

### Quick clear all console.log

- Press `Cmd + Shift + K` (Mac) or `Ctrl + Shift + K` (Windows).

### Quick toggle all console.log's state of comment

- Press `Cmd + Shift + J` (Mac) or `Ctrl + Shift + J` (Windows).

## Configuration

| Property | Description | Default |
| :-: | :-: | :-: |
| consoleVariablesName | Whether to output variable name | true |
| consoleLineNumber | Whether to output line number | false |
| consoleFilename | Whether to output filename | false |

Example: 

```ts
console.log('Variables in Components/Card.tsx on line 17:', Variables)
```

Configure according to your preferences

✨ Happy hacking!

## License

[MIT](./LICENSE) License © 2022 [Richard Zhang](https://github.com/Richard-Zhang1019)
