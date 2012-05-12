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
		tools = tools || 'bold italic | h1 h2 h3 | ul ol | img url | code | hr | help | preview'
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
			//
			// Break up the selection into parts
			//
				var parts = {
					before:		te.val().substring(0, te.caret().start),
					selection:	te.caret().text,
					after:		te.val().substring(te.caret().end)
				};
			//
			// Do something to the parts
			//
				var marks = false;
				switch(action){
					//
					// Bold and italic just deal with the immediate selection
					//
					case 'bold':
						// Bold marks
						marks = '**';
					case 'italic':
						// Italic marks
						marks = marks || '*';
						// We can either wrap, or unwrap, check before and after for the marks string
						var wrapbefore	= parts.before.substr(-marks.length)	== marks;
						var wrapafter	= parts.after.substr(0, marks.length)	== marks;
						if(wrapbefore && wrapafter){
							// Unwrap
							parts.before	= parts.before.substr(0, (parts.before.length-marks.length));
							parts.after		= parts.after.substr(marks.length);
						} else {
							// Wrap
							parts.before += marks;
							parts.after   = marks + parts.after;
						}
						// Done
						break;
					//
					// Headings, Lists and Code deal with the immediate selection and (possibly) the line-break beforehand
					//
					case 'h1':
						// h1 marks
						marks = '# ';
					case 'h2':
						// h2 marks
						marks = marks || '## ';
					case 'h3':
						// h3 marks
						marks = marks || '### ';
					case 'ul':
						// ul marks
						marks = marks || '* ';
					case 'ol':
						// ol marks
						marks = marks || '1. ';
					case 'code':
						// code marks
						marks = marks || '    ';
						// Prefix the selection with one of: # ## ### * 1.
						console.log('TODO\n\nIn the selection, replace all \\n with \\n' + marks + '\nIf the selection DOESNT begin with a \\n...\n    Replace the last \\n before the selection with a \\n' + marks);
						// Done
						break;
					//
					// Images and URLs replace the immediate selection
					//
					case 'img':
						// Grab a URL
						if(url=prompt('Image URL', 'http://')){
							parts.selection = '![' + parts.selection + '](' + url + ')';
						}
						// Done
						break;
					case 'url':
						// Grab a URL
						if(url=prompt('Link URL', 'http://')){
							parts.selection = '[' + parts.selection + '](' + url + ')';
						}
						// Done
						break;
					//
					// Insert a horizontal rule...
					//
					case 'hr':
						// Simples
						parts.selection = '\n\n------\n\n';
						// Done
						break;
					//
					// Help just opens the documentation page
					//
					case 'help':
						// Simples
						window.open('http://daringfireball.net/projects/markdown/syntax');
						// Done
						break;
					//
					// Preview should swap out the textarea for a preview box
					//
					case 'preview':
						console.log('Check for showdown... if it\'s there then use it, otherwise we must alert and exit');
						// Find the preview
						var preview = $(this).closest('.sparkdown').find('.sparkdown-preview');
						// Is it visible?
						if(preview.css('display') == 'block'){
							// Hide it
							preview.hide();
							// Re-focus the textarea
							te.focus();
						} else {
							// Convert the markdown and inject it
							converter = new Showdown.converter();
							html = converter.makeHtml(te.val());
							preview.html(html);
							// Show it
							preview.show();
						}
						// Really Done
						return false;
				}
			//
			// Updating the textarea
			//
				// Set the value
				te.val(parts.before + parts.selection + parts.after);
				// Re-select
				var start = parts.before.length;
				var end   = start + parts.selection.length;
				te.caret({ start: start, end: end });
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
    		// Add a preview DIV (hidden)
    		$(this).parent().append($('<div class="sparkdown-preview" />').css('display', 'none'));
    	});
	};
})(jQuery);