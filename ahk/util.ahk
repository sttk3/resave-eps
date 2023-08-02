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