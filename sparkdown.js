/**
 * jQuery SPARKDOWN Plugin
 * 
 * @author      David King
 * @url         http://oodavid.com
 * @license     MIT http://www.opensource.org/licenses/mit-license.php
 */
﻿(function($){
	$.fn.sparkdown = function(tools){
		// Default the tools
		tools = tools || 'bold italic | h1 h2 h3 | ol li | img url | code'
		tools = tools.split(' ');
		// Create a toolbar
		var toolbar = $('<div class="sparkdown-toolbar" />');
		// Add the tools
		$.each(tools, function(k,v){
			var tool = $('<span />').html(v).attr('data-sparkdown-action', v).addClass(v == '|' ? 'sparkdown-spacer' : 'sparkdown-tool');
			toolbar.append(tool);
		});
		// Add the click event
		toolbar.on("click", ".sparkdown-tool", function(e){
			// What's the "action"?
			var action = $(this).attr('data-sparkdown-action');
			// Find the textarea
			var te = $(this).closest('.sparkdown').find('textarea');
			// Do something here
			console.log(action, te.caret());

			// I want *something* to happen while I figure this out
			var caret = te.caret();
			// Wrap the selection in **
			te.val(caret.replace('**' + caret.text + '**'));
			// Re-select
			te.caret({ start: (caret.start+2) ,end: (caret.end+2) });
			return false;
			/*
				LOGIC
					I think I should do it in the old regex style of DFACE / DCODE / DLITE...

				3rd party... Not sure how much I like these methods TBH...
					Bold & Italic (toggle)
						See:	http://code.google.com/p/pagedown/source/browse/Markdown.Editor.js
									commandProto.doBold
				    				commandProto.doItalic
				    				commandProto.doBorI
			*/

		});
		// Loop the textarea / elements
    	return this.each(function(){
    		// Wrap this element
    		$(this).wrap('<div class="sparkdown" />');
    		// Clone the sparkdown toolbar and add it to the element
    		var toolbarclone = toolbar.clone(true);
    		$(this).parent().prepend(toolbarclone);
    	});
	};
})(jQuery);

/**
 * jQuery Caret Plugin
 * 
 * @author      C. F. Wong
 * @url         http://www.examplet.buss.hk/jquery/caret.php
 * @license     MIT http://www.opensource.org/licenses/mit-license.php
 */
﻿(function($,len,createRange,duplicate){
	$.fn.caret=function(options,opt2){
		var start,end,t=this[0],browser=$.browser.msie;
		if(typeof options==="object" && typeof options.start==="number" && typeof options.end==="number") {
			start=options.start;
			end=options.end;
		} else if(typeof options==="number" && typeof opt2==="number"){
			start=options;
			end=opt2;
		} else if(typeof options==="string"){
			if((start=t.value.indexOf(options))>-1) end=start+options[len];
			else start=null;
		} else if(Object.prototype.toString.call(options)==="[object RegExp]"){
			var re=options.exec(t.value);
			if(re != null) {
				start=re.index;
				end=start+re[0][len];
			}
		}
		if(typeof start!="undefined"){
			if(browser){
				var selRange = this[0].createTextRange();
				selRange.collapse(true);
				selRange.moveStart('character', start);
				selRange.moveEnd('character', end-start);
				selRange.select();
			} else {
				this[0].selectionStart=start;
				this[0].selectionEnd=end;
			}
			this[0].focus();
			return this
		} else {
			// Modification as suggested by Андрей Юткин
			if(browser){
				var selection=document.selection;
				if (this[0].tagName.toLowerCase() != "textarea") {
					var val = this.val(),
					range = selection[createRange]()[duplicate]();
					range.moveEnd("character", val[len]);
					var s = (range.text == "" ? val[len]:val.lastIndexOf(range.text));
					range = selection[createRange]()[duplicate]();
					range.moveStart("character", -val[len]);
					var e = range.text[len];
				} else {
					var range = selection[createRange](),
					stored_range = range[duplicate]();
					stored_range.moveToElementText(this[0]);
					stored_range.setEndPoint('EndToEnd', range);
					var s = stored_range.text[len] - range.text[len],
					e = s + range.text[len]
				}
			// End of Modification
			} else {
				var s=t.selectionStart,
					e=t.selectionEnd;
			}
			var te=t.value.substring(s,e);
			return {start:s,end:e,text:te,replace:function(st){
				return t.value.substring(0,s)+st+t.value.substring(e,t.value[len])
			}}
		}
	}
})(jQuery,"length","createRange","duplicate");