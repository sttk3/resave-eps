/**
  * @file resaveEPS
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

// tauri
import { message } from '@tauri-apps/api/dialog' ;

// sttk3
import { AppID } from './constants' ;
import { execJavaScript } from './exec' ;

export const resaveEPS = async (dropPathList: Array<string>) => {
  const patternAi = /\.(?:eps|ai|tsx)$/i ;
  const targetFiles = dropPathList.filter((aPath) => {return patternAi.test(aPath) ;}) ;
  if(targetFiles.length <= 0) {
    await message(`There were no target files.`) ;
    return ;
  }

  const res = await execJavaScript(AppID.illustrator, 'resave.jsx', [targetFiles.join('\n')]) ;
  if(!res.code) {
    // succeed
    console.log(res) ;
  } else {
    // error
    await message(res.stderr) ;
  }
} ;