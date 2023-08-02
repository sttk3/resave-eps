use scripting additions
use framework "Foundation"

script namespace
	property ObjC : a reference to current application
	
	on exec_js(app_path, js_path, script_args)
		try
			set res to my result_json(true, "null", "")
			
			-- Illustrator��do javascript�ɂ�JavaScript�����s����
			using terms from application "Adobe Illustrator"
				tell application app_path
					activate
					
					-- 24���Ԃ܂Ŕ�����҂�
					with timeout of ((60 * 60) * 24) seconds
						set retval to do javascript ((js_path as POSIX file) as alias) with arguments script_args
						set res to my result_json(true, retval, "")
					end timeout
				end tell
			end using terms from
		on error error_message number error_number
			display dialog error_message buttons {"OK"} default button 1
			set res to my result_json(false, "null", error_message)
		end try
		
		return res
	end exec_js
	
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
		
		-- �t�@�C�����Ȃǂ̏����擾����
		set filename to last_path_component as text
		set basename to (last_path_component's stringByDeletingPathExtension()) as text
		set name_extension to (last_path_component's pathExtension()) as text
		set dirname to (nsstr's stringByDeletingLastPathComponent()) as text
		set original_path to (nsstr's stringByExpandingTildeInPath()) as text
		
		-- UTI���m�F����
		set path_url to ObjC's |NSURL|'s fileURLWithPath:original_path
		set resource_values to path_url's resourceValuesForKeys:{ObjC's NSURLTypeIdentifierKey} |error|:(missing value)
		if (resource_values is missing value) then
			set uti to "" as text
		else
			set uti to (resource_values's NSURLTypeIdentifierKey) as text
		end if
		
		-- �G�C���A�X�̏ꍇ�̓I���W�i���̃p�X���擾����
		if (uti is "com.apple.alias-file") then
			set hfs_path to (ObjC's |NSURL|'s URLByResolvingAliasFileAtURL:path_url options:0 |error|:(missing value)) as text
			set original_path to POSIX path of hfs_path
		end if
		
		return {filename:filename, basename:basename, name_extension:name_extension, dirname:dirname, original_path:original_path, uti:uti}
	end parse_path
	
	on result_json(succeed_bool, result_text, error_text)
		if ((result_text is "undefined") or (result_text is "null")) then
			set temp_record to {|result|:missing value, succeed:succeed_bool, stderr:error_text} as record
		else
			set temp_record to {|result|:result_text, succeed:succeed_bool, stderr:error_text} as record
		end if
		
		set dict to ObjC's NSDictionary's dictionaryWithDictionary:temp_record
		set json_data to ObjC's NSJSONSerialization's dataWithJSONObject:dict options:0 |error|:(missing value)
		set nsstr to ObjC's NSString's alloc()'s initWithData:json_data encoding:(ObjC's NSUTF8StringEncoding)
		set res to nsstr as text
		return res
	end result_json
end script

on run {app_path, js_path, script_args}
	local lib
	set lib to namespace
	set res to lib's exec_js(app_path, js_path, {script_args})
	return res
end run