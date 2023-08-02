#Include %A_LineFile%\..\get_app.ahk
#Include %A_LineFile%\..\util.ahk

execJavaScript(appBundleID, jsPath, argv) {
  app := getApp(appBundleID)
  if (!app) {
    msg := "Please start target application and try again."
    throw msg
  }
  
  res := app.DoJavaScriptFile(jsPath, arrayToComArray([argv]))
  return res
}