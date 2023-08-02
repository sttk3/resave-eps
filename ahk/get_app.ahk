; 起動していれば対象アプリを返す

global BundleIDs := Object()
BundleIDs["illustrator"] := "com.adobe.illustrator"
BundleIDs["indesign"] := "com.adobe.InDesign"
BundleIDs["photoshop"] := "com.adobe.Photoshop"

getAppPath(appBundleID) {
  Switch appBundleID {
    Case BundleIDs["illustrator"]:
      appExe := "Illustrator.exe"
    Case BundleIDs["indesign"]:
      appExe := "InDesign.exe"
    Case BundleIDs["photoshop"]:
      appExe := "Photoshop.exe"
  }

  ; 対象アプリのウインドウからアプリのパスを取得し，変数appPathに収める
  WinGet, appPath, ProcessPath, ahk_exe %appExe%
  
  return appPath
}

; アプリのパスからバージョンを取得する。[16, 0, 0, 682]みたいな形式になる
getVersion(appPath) {
  fs := ComObjCreate("Scripting.FileSystemObject")
  versionArray := StrSplit(fs.GetFileVersion(appPath), ".")
  return versionArray
}

getApp(appBundleID) {
  appPath := getAppPath(appBundleID)
  versionArray := getVersion(appPath)
  versionStr := versionArray[1]

  appIds := Object()
  Switch appBundleID {
    Case BundleIDs["illustrator"]:
      baseAppId := "Illustrator.Application."
      appIds[10] := baseAppId . "1"
      appIds[11] := baseAppId . "2"
      appIds[12] := baseAppId . "3"
      appIds[13] := "{743F09D0-5A60-472F-93A4-4C761F332103}"
      appIds[14] := baseAppId . "CS4"
      appIds[15] := baseAppId . "CS5"
      appIds[16] := "{63755935-C25A-42DF-87A1-51F144A0C216}"
      appIds[17] := baseAppId . "CC"
      appIds[18] := baseAppId . "CC.2014"
      appIds[19] := baseAppId . "CC.2015"
      appIds[20] := baseAppId . "CC.2015.3"
      appIds[21] := baseAppId . "CC.2017"
      appIds[22] := baseAppId . "CC.2018"
      appIds[23] := baseAppId . "CC.2019"
      appId := appIds[versionStr]
      if (appId == "") {
        appId := baseAppId . versionStr
      }
    Case BundleIDs["indesign"]:
      baseAppId := "InDesign.Application."
      appIds[2] := baseAppId . "2"
      appIds[3] := baseAppId . "CS"
      appIds[4] := baseAppId . "CS2_J"
      appIds[5] := baseAppId . "CS3_J"
      appIds[6] := baseAppId . "CS4_J"
      appIds[8] := baseAppId . "CS6_J"
      appIds[9] := baseAppId . "CC_J"
      appIds[10] := baseAppId . "CC.2014_J"
      appIds[11] := baseAppId . "CC.2015_J"
      appIds[12] := baseAppId . "CC.2017_J"
      appIds[13] := baseAppId . "CC.2018"
      appIds[14] := baseAppId . "CC.2019"

      if (versionStr == 7) {
        if (versionArray[2] < 5) {
          appId := baseAppId . "CS5_J"
        } else {
          appId := baseAppId . "CS5.5_J"
        }
      } else {
        appId := appIds[versionStr]
        if (appId == "") {
          appId := baseAppId . versionStr
        }
      }
    Case BundleIDs["photoshop"]:
      baseAppId := "Photoshop.Application."
      versionStrPS := (versionStr - 7) * 10
      if versionStr between 7 and 12
        appId := baseAppId . versionStr
      else if versionStr between 13 and 99
        appId := baseAppId . versionStrPS
      else
        appId := baseAppId
  }

  targetApp := false
  try {
    targetApp := ComObjActive(appId)
  }

  return targetApp
}