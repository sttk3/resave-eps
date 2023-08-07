/**
  * @file resaveEPS
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

// tauri
import { message } from '@tauri-apps/api/dialog' ;
import { getName } from '@tauri-apps/api/app' ;
import { ChildProcess } from '@tauri-apps/api/shell' ;

// sttk3
import { AppID } from './constants' ;
import { execJavaScript } from './exec' ;
import { notify } from './notification' ;

/**
  * Illustrator書類をバージョン10のepsで別名保存する。同名ファイルは上書きするので注意
  * @param pathList 処理対象のファイルパスの配列
*/
export const resaveEPS = async (pathList: Array<string>): Promise<ChildProcess> => {
  let res: ChildProcess ;
  res = {code: 0, signal: null, stdout: '', stderr: ''} ;

  const patternAi = /\.(?:eps|ai)$/i ;
  const targetFiles = pathList.filter((aPath) => {return patternAi.test(aPath) ;}) ;
  if(targetFiles.length <= 0) {
    const msg = 'There were no target files.' ;
    res.stdout = msg ;
    await message(msg) ;
    return res ;
  }

  // スクリプトを実行する
  res = await execJavaScript(AppID.illustrator, 'resave.jsx', [targetFiles.join('\n')]) ;
  if(!res.code) {
    // succeed
    const appName = await getName() ;
    let bodyText: string ;
    if(res.stdout === '') {
      bodyText = 'Nothing happend.' ;
    } else {
      bodyText = `Processed count: ${res.stdout}` ;
    }
    await notify({title: appName, body: bodyText}) ;
  } else {
    // error
    await message(res.stderr) ;
  }

  return res ;
} ;