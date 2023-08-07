use scripting additions
use framework "Foundation"

script namespace
	property ObjC : a reference to current application
	
	on exec_js(app_path, js_path, script_args)
		set res to ""
		
		-- Photoshop��do javascript�ɂ�JavaScript�����s����
		using terms from application id "com.adobe.Photoshop"
			tell application app_path
				activate
				
				-- 24���Ԃ܂Ŕ�����҂�
				with timeout of ((60 * 60) * 24) seconds
					set res to do javascript file (((js_path as POSIX file) as alias) as text) with arguments script_args
				end timeout
			end tell
		end using terms from
		
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
end script

on run {app_path, js_path, script_args}
	local lib
	set lib to namespace
	set res to lib's exec_js(app_path, js_path, {script_args})
	return res
end run