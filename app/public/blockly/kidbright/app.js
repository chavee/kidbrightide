$(document).ready(function() {
	var onresize = function(e) {
		var div;
		if (div = document.getElementById('blockly')) {
			div.style.width = (div.parentNode.offsetWidth - 2) + 'px';
			div.style.height = (div.parentNode.offsetHeight - 2) + 'px';
		}
	}
	onresize();
	window.addEventListener('resize', onresize);

	// construct the toolbox XML.
	var toolboxText = document.getElementById('toolbox').outerHTML;
	var toolboxXml = Blockly.Xml.textToDom(toolboxText);

	// blockly render
	var workspace = Blockly.inject('blockly', {
		//collapse: false,
		grid: {
			spacing: 25,
			length: 3,
			colour: '#ccc',
			snap: true
		},
		media: 'blockly/media/',
		//rtl: rtl,
		toolbox: toolboxXml,
		zoom: {
			controls: true,
			wheel: true,
			startScale: 1,
			maxScale: 2,
			minScale: 0.3,
			scaleSpeed: 1.2
			//scrollbars: false
		}
	});

	Blockly.prompt = function(message, defaultValue, callback) {
		$('.modal-prompt #prompt-btn-ok').text(LANG_OK);
		$('.modal-prompt #prompt-btn-cancel').text(LANG_CANCEL);

		$('.modal-prompt .modal-header h4').text(message);
		$('.modal-prompt #prompt-text').val(defaultValue);
		$('.modal-prompt #prompt-btn-ok').unbind('click').click(function() {
			var new_val = $('#prompt-text').val();
			if ((new_val) && (new_val != '')) {
				callback(new_val);
			} else {
				callback(null);
			}
			$('.modal-prompt').modal('hide');
		})
		$('.modal-prompt').modal('show');
	};
});
