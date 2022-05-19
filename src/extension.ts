import * as vscode from 'vscode'

export function activate({ subscriptions }: vscode.ExtensionContext) {
  const COMMAND_ID = 'formatter-button.run'

  const disposable = vscode.commands.registerCommand(COMMAND_ID, async () => {
    const documentUri = vscode.window.activeTextEditor?.document.uri
    const result = await vscode.commands.executeCommand<vscode.TextEdit[]>(
      'vscode.executeFormatDocumentProvider',
      documentUri,
    )

    if (result && documentUri) {
      const edit = new vscode.WorkspaceEdit()

      for (const textEdit of result) {
        edit.replace(documentUri, textEdit.range, textEdit.newText)
      }

      await vscode.workspace.applyEdit(edit)
    }
  })

  const prettierStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100,
  )
  prettierStatusBarItem.text = `$(chevron-right)$(chevron-right)$(chevron-right) RUN FORMATTING $(chevron-left)$(chevron-left)$(chevron-left)`
  prettierStatusBarItem.show()

  prettierStatusBarItem.command = COMMAND_ID

  subscriptions.push(disposable)
  subscriptions.push(prettierStatusBarItem)
}
