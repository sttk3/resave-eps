use scripting additions
use framework "Foundation"

script namespace
	property ObjC : a reference to current application
	
	on exec_js(app_path, js_path, script_args)
		set res to ""
		
		set undo_mode_str to "‌Entire Script" as text
		
		-- InDesignの場合ExtendScriptとUXPで実行方法が異なるので，拡張子を記録しておく
		set script_path_obj to my parse_path(js_path)
		set script_ext to name_extension of script_path_obj
		
		-- InDesignでdo scriptにてJavaScriptを実行する
		using terms from application id "com.adobe.InDesign"
			tell application app_path
				activate
				
				if (script_ext is in {"js", "jsx", "jsxbin"}) then
					set language_obj to javascript
				else if (script_ext is in {"idjs"}) then
					set version_str to version
					set version_array to my do_split(".", version_str)
					if (item 1 of version_array is greater than or equal to 18) then
						set language_obj to uxpscript
					else
						error "Adobe InDesign 2023 (18.0) or later required to execute UXP scripts."
					end if
				end if
				
				if (undo_mode_str is "Script Request") then
					set undo_mode_obj to script request
				else if (undo_mode_str is "‌Entire Script") then
					set undo_mode_obj to entire script
				else if (undo_mode_str is "Auto Undo") then
					set undo_mode_obj to auto undo
				else if (undo_mode_str is "‌Fast Entire Script") then
					set undo_mode_obj to fast entire script
				end if
				
				-- 24時間まで反応を待つ
				with timeout of ((60 * 60) * 24) seconds
					set res to do script (js_path as POSIX file) language language_obj with arguments (script_args as list) undo mode undo_mode_obj
				end timeout
			end tell
		end using terms from
		
		return res
	end exec_js
	
	on do_split(delim, orig_str)
		set orig_delim to AppleScript's text item delimiters
		try
			set AppleScript's text item delimiters to delim
			set new_list to every text item of orig_str
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
	
	on parse_path(path_str)
		set nsstr to ObjC's NSString's stringWithString:path_str
		set last_path_component to nsstr's lastPathComponent()
		
		-- ファイル名などの情報を取得する
		set filename to last_path_component as text
		set basename to (last_path_component's stringByDeletingPathExtension()) as text
		set name_extension to (last_path_component's pathExtension()) as text
		set dirname to (nsstr's stringByDeletingLastPathComponent()) as text
		set original_path to (nsstr's stringByExpandingTildeInPath()) as text
		
		-- UTIを確認する
		set path_url to ObjC's |NSURL|'s fileURLWithPath:original_path
		set resource_values to path_url's resourceValuesForKeys:{ObjC's NSURLTypeIdentifierKey} |error|:(missing value)
		if (resource_values is missing value) then
			set uti to "" as text
		else
			set uti to (resource_values's NSURLTypeIdentifierKey) as text
		end if
		
		-- エイリアスの場合はオリジナルのパスを取得する
		if (uti is "com.apple.alias-file") then
			set hfs_path to (ObjC's |NSURL|'s URLByResolvingAliasFileAtURL:path_url options:0 |error|:(missing value)) as text
			set original_path to POSIX path of hfs_path
		end if
		
		return {filename:filename, basename:basename, name_extension:name_extension, dirname:dirname, original_path:original_path, uti:uti}
	end parse_path
end script

on run {app_path, js_path, script_args}
	local lib
	set lib to namespace
	set res to lib's exec_js(app_path, js_path, {script_args})
	return res
end run