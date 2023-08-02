; [GitHub-cocobelgica / AutoHotkey-JSON：AutoHotkey用のJSONモジュール](https://github.com/cocobelgica/AutoHotkey-JSON)
; ライセンス [WTFPL](http://wtfpl.net/)
#Include %A_LineFile%\..\JSON.ahk
#Include %A_LineFile%\..\get_app.ahk

main()

main() {
  res = 
(
{"succeed": false, "result": null}
)

  appPath := getAppPath("com.adobe.InDesign")
  appVersion := getVersion(appPath)
  majorVersion := appVersion[1]
  MsgBox, %majorVersion%

  ; 結果を標準出力に流す
  echo(res)
  return res
}

; 結果を標準出力に流す
echo(str) {
  FileAppend, %str%, *, UTF-8
}

; ahkの配列からComObjArrayを生成する
arrayToComArray(arr) {
  len := arr.MaxIndex()
  comArray :=  ComObjArray(VT_VARIANT := 12, len)
  for i, value in arr {
    comArray[i - 1] := value
  }
  return comArray
}