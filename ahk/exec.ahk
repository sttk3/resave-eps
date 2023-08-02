#Include %A_LineFile%\..\javascript.ahk
#Include %A_LineFile%\..\get_app.ahk
#Include %A_LineFile%\..\util.ahk

; @param {String} A_Args[1] 実行するコマンド名。例: 'execJavaScript'
commandName := A_Args[1]

; @param {String} A_Args[2] 対象のbundle id。例: 'com.adobe.illustrator'
appBundleID := A_Args[2]

Switch commandName {
  Case "getAppPath":
    ; 起動している対象アプリのパスを返す
    res := getAppPath(appBundleID)
    echo(res)
  Case "execJavaScript":
    ; JavaScriptファイルを実行する
    ; @param {String} A_Args[3] 実行するJavaScriptファイルのパス
    ; @param {String} A_Args[4] JavaScriptに渡す引数の文字列
    res := execJavaScript(appBundleID, A_Args[3], A_Args[4])
    echo(res)
}