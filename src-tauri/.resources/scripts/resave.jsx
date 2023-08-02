/**
  * @file Illustrator書類をバージョン10のepsで上書きする。saveAs（別名保存）を経由するのがポイント
  * @version 1.0.2
  * @author sttk3.com
  * @copyright (c) 2020 sttk3.com
*/

//#target 'illustrator'

(function(argv) {
  // argvには改行区切りのファイルパスがくる。URIエンコードされている場合もある
  var srcStr = decodeURIComponent(argv.toString()) ;
  var targetItems = srcStr.split(/[\r\n]+/) ;
  
  // eps保存オプションを指定する
  var epsOpts = new EPSSaveOptions() ;
  epsOpts.compatibility = Compatibility.ILLUSTRATOR10 ;
  epsOpts.preview = EPSPreview.None ;
  epsOpts.embedAllFonts = false ;
  epsOpts.embedLinkedFiles = false ;
  epsOpts.cmykPostScript = false ;
  epsOpts.includeDocumentThumbnails = false ;
  epsOpts.compatibleGradientPrinting = false ;
  epsOpts.postScript = EPSPostScriptLevelEnum.LEVEL2 ;
  epsOpts.saveMultipleArtboards = false ;

  var origLevel = app.userInteractionLevel ;
  
  var currentFile, doc ;
  for(var i = 0, len = targetItems.length ; i < len ; i++) {
    currentFile = new File(targetItems[i]) ;
    
    // ファイルを開く
    app.open(currentFile) ;
    doc = app.documents[0] ;
    
    // saveAs（別名保存）経由で上書きする。書類中に日本語名ブラシを適用したアイテムがあると，[CANT]みたいなダイアログが出る(エラーではない)ので無視する
    try {
      app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS ;
      doc.saveAs(currentFile, epsOpts) ;
      app.userInteractionLevel = origLevel ;
    } catch(e) {
      app.userInteractionLevel = origLevel ;
      alert(e) ;
    }
    
    doc.close(SaveOptions.DONOTSAVECHANGES) ;
  }

  app.userInteractionLevel = origLevel ;
  return i.toString() ;
})(arguments[0]) ;