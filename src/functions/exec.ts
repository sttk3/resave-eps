/**
  * @file exec
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

// tauri
import { join, resolveResource } from '@tauri-apps/api/path' ;
import { ChildProcess, Command } from '@tauri-apps/api/shell' ;

// sttk3
import { OS } from './constants' ;
const ResourceFolderName: string = '.resources' ;
const ExecFolderName: string = 'exec' ;
const JsFolderName: string = 'scripts' ;

/**
  * 起動している対象アプリのパスを返す。masOS専用
  * @param appID 対象アプリのbundle id。例: 'com.adobe.illustrator'
  * @returns 例: {result: 'Macintosh HD:Applications:Adobe Illustrator 2023:Adobe Illustrator.app:'}
*/
export const getAppPathMac = async (appID: string): Promise<ChildProcess> => {
  const scriptPath: string = await resolveResource( await join(ResourceFolderName, 'get_app_path.applescript') ) ;
  const osascript: Command = new Command('run-applescript', [scriptPath, appID]) ;
  const res: ChildProcess = await osascript.execute() ;
  return res ;
} ;

/**
  * 起動している対象アプリのパスを返す。masOS専用
  * @param appID 対象アプリのbundle id。例: 'com.adobe.illustrator'
  * @returns 例: {result: 'Macintosh HD:Applications:Adobe Illustrator 2023:Adobe Illustrator.app:'}
*/
export const getAppPathWin = async (appID: string): Promise<ChildProcess> => {
  // exec.exeのパスはtauri.conf.jsonに書き込むため，動的に取得しない
  const ahk: Command = new Command('run-ahk', ['getAppPath', appID]) ;
  const res: ChildProcess = await ahk.execute() ;
  return res ;
} ;

/**
  * 起動している対象アプリのパスを返す。masOS専用
  * @param appID 対象アプリのbundle id。例: 'com.adobe.illustrator'
  * @returns 例: {result: 'Macintosh HD:Applications:Adobe Illustrator 2023:Adobe Illustrator.app:'}
*/
export const getAppPath = async (appID: string): Promise<ChildProcess> => {
  let res: ChildProcess ;

  switch(OS.type) {
    case 'Darwin':
      res = await getAppPathMac(appID) ;
      break ;
    case 'Windows_NT':
      res = await getAppPathWin(appID) ;
      break ;
    default:
      res = {code: 1, signal: null, stdout: '', stderr: 'Only supported on macOS or Windows.'} ;
      break ;
  }

  return res ;
} ;

/**
  * ExtendScriptを引数つきで実行する。macOS専用
  * @param appID 対象アプリのbundle id。例: 'com.adobe.illustrator'
  * @param appPath 対象アプリのパス。例: 'Macintosh HD:Applications:Adobe Illustrator 2023:Adobe Illustrator.app:'
  * @param scriptName 実行するJavaScriptファイルの名前。例: 'sample.jsx'
  * @param argv 渡す引数。例: ['hello']
*/
const execJsMac = async (appID: string, appPath: string, scriptName: string, argv: Array<string> = ['']): Promise<ChildProcess> => {
  const applescriptName: string = `${appID}.applescript` ;

  /*
    AppleScriptとJavaScriptのファイルをそれぞれ取得し，実行する。
    エラーで止まることはなく，res.stderrにエラーメッセージが記録される
  */
  const runnerPath: string = await resolveResource( await join(ResourceFolderName, ExecFolderName, applescriptName) ) ;
  const jsPath: string = await resolveResource( await join(ResourceFolderName, JsFolderName, scriptName) ) ;
  const osascript: Command = new Command('run-applescript', [runnerPath, appPath, jsPath, ...argv]) ;
  const res: ChildProcess = await osascript.execute() ;

  return res ;
} ;

/**
  * ExtendScriptを引数つきで実行する。Windows専用
  * @param appID 対象アプリのbundle id。例: 'com.adobe.illustrator'
  * @param scriptName 実行するJavaScriptファイルの名前。例: 'sample.jsx'
  * @param argv 渡す引数。例: ['hello']
*/
const execJsWin = async (appID: string, scriptName: string, argv: Array<string> = ['']): Promise<ChildProcess> => {
  const applescriptName: string = `${appID}.applescript` ;

  /*
    JavaScriptのファイルを取得し実行する。
    エラーで止まることはなく，res.stderrにエラーメッセージが記録される
  */
  const jsPath: string = await resolveResource( await join(ResourceFolderName, JsFolderName, scriptName) ) ;
  const ahk: Command = new Command('run-ahk', ['execJavaScript', appID, jsPath, ...argv]) ;
  const res: ChildProcess = await ahk.execute() ;

  return res ;
} ;

/**
  * ExtendScriptを引数つきで実行する
  * @param appID 対象アプリのbundle id。例: 'com.adobe.illustrator'
  * @param scriptName 実行するExtendScriptファイルの名前。例: 'sample.jsx'
  * @param argv 渡す引数。例: ['hello']
*/
export const execJavaScript = async (appID: string, scriptName: string, argv: Array<string> = []): Promise<ChildProcess> => {
  let res: ChildProcess ;
  
  const appPathObj: ChildProcess = await getAppPath(appID) ;
  if(appPathObj.code) {return appPathObj ;}

  switch(OS.type) {
    case 'Darwin':
      res = await execJsMac(appID, appPathObj.stdout, scriptName, argv) ;
      break ;
    case 'Windows_NT':
      res = await execJsWin(appID, scriptName, argv) ;
      break ;
    default:
      res = {code: 1, signal: null, stdout: '', stderr: 'Only supported on macOS or Windows.'} ;
      break ;
  }

  return res ;
} ;