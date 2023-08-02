use scripting additions
use framework "Foundation"

script namespace
	property ObjC : a reference to current application
	
	on get_app_path(target_app_id)
		-- Tauriのshellがエラーハンドリングしやすいので，AppleScript側ではcatchせずに流したほうが楽
		
		set res to missing value
		
		-- idが一致する起動中のアプリを取得する。なければ終了する
		set app_record to my get_app(target_app_id as text)
		if (app_record is missing value) then
			return res
		end if
		
		-- Illustrator 25.1はAppleScriptが腐っているので即座に終了する
		if (target_app_id is "com.adobe.illustrator") then
			set v_list to version_list of app_record
			if (((item 1 of v_list) is 25) and ((item 2 of v_list) is 1)) then
				error "Adobe Illustrator 25.1 is not supported."
				return res
			end if
		end if
		
		set res to {(app_path of app_record) as text} as text
		return res
	end get_app_path
	
	on get_app(bundle_id)
		set res to missing value
		
		-- 起動しているIllustratorの一覧を取得する。なければ終了する
		set app_list to ObjC's NSRunningApplication's runningApplicationsWithBundleIdentifier:bundle_id
		if (((app_list) as list) is {}) then
			return res
		end if
		
		-- 最初の1つを対象とみなす
		set app_item to app_list's objectAtIndex:0
		
		-- アプリのパスを取得する。hfs形式
		set app_path to (app_item's bundleURL()) as text
		
		-- バージョンを取得する
		set bundle_item to ObjC's NSBundle's bundleWithURL:(app_item's bundleURL())
		set version_str to (bundle_item's objectForInfoDictionaryKey:("Adobe Product Version")) as text
		set version_list to my do_split(".", version_str)
		repeat with i from 1 to (length of version_list)
			set item i of version_list to (item i of version_list) as integer
		end repeat
		
		set res to {version_list:version_list, app_path:app_path}
		return res
	end get_app
	
	on do_split(delim, src_text)
		set orig_delim to AppleScript's text item delimiters
		try
			set AppleScript's text item delimiters to delim
			set new_list to every text item of src_text
			set AppleScript's text item delimiters to orig_delim
		on error
			set AppleScript's text item delimiters to orig_delim
		end try
		return new_list
	end do_split
	
	on json_parse(json_str)
		set nsstr to ObjC's NSString's stringWithString:json_str
		set nsdata to nsstr's dataUsingEncoding:(ObjC's NSUTF8StringEncoding)
		set dict to ObjC's NSJSONSerialization's JSONObjectWithData:nsdata options:0 |error|:(missing value)
		
		if (dict is missing value) then
			set res to dict
		else
			set res to dict as record
		end if
		return res
	end json_parse
end script

on run target_app_id
	local lib
	set lib to namespace
	set res to lib's get_app_path(target_app_id)
	return res
end run