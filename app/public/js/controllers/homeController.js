function HomeController() {
	var that = this;
	var deletingBoardId = null;
	var standalone = false;

	$('#home-lang-en').click(function() {
		homeSetLanguage('en');
	});

	$('#home-lang-th').click(function() {
		homeSetLanguage('th');
	});

	// KidBrightOS, enable build button and set clock button
	$('#btn-build').prop('disabled', false);
	$('#btn-setclock').prop('disabled', false);
	$('#btn-update').prop('disabled', false);
	$('#btn-wifi-config').prop('disable', false);

	// check standalone flag
	$.ajax({
		url: '/standalone',
		type: 'POST',
		error: function(e) {
			//
		},
		success: function(reply) {
			standalone = reply.standalone;
		}
	});

	// get kidbrightide version
	$.ajax({
		type: 'POST',
		url: '/version',
		error: function(e) {
			//
		},
		success: function(res) {
			$('#version-text').html('ver. ' + res.version);
		}
	});

	// =========================================================================
	// save file browser modal form
	// =========================================================================
	$('.modal-save-file-browser').on('shown.bs.modal', function() {
		$(this).find('[autofocus]').focus();
	});

	$('.modal-save-file-browser #btn-ok').click(function() {
		var fn = $('.modal-save-file-browser #file-text').val();
		if (fn == '') return;
		// check file exists
		var dup_flag = false;
		var list_items = $('.modal-save-file-browser .modal-body .list-group .list-group-item');
		for (var i = 0; i < list_items.length; i++) {
			if (list_items[i].text == fn) {
				dup_flag = true;
			}
		}

		if (dup_flag) {
			$('.modal-save-overwrite-confirm .modal-header h4').text(LANG_FILE_OVERWRITE);
			$('.modal-save-overwrite-confirm .modal-footer #btn-ok').text(LANG_OK);
			$('.modal-save-overwrite-confirm .modal-footer #btn-cancel').text(LANG_CANCEL);
			$('.modal-save-overwrite-confirm').modal({
				show: true,
				keyboard: false,
				backdrop: 'static'
			});
		} else {
			saveFile(fn);
		}
	});

	$('.modal-save-overwrite-confirm #btn-ok').click(function() {
		saveFile($('.modal-save-file-browser #file-text').val());
		$('.modal-save-overwrite-confirm').modal('hide');
	});

	// =========================================================================
	// open file browser modal form
	// =========================================================================
	$('.modal-open-file-browser #btn-ok').click(function() {
		var fn = null;
		var items = $('.modal-open-file-browser .modal-body .list-group .list-group-item');
		for (var i = 0; i < items.length; i++) {
			if ($(items[i]).hasClass('active')) {
				fn = $(items[i]).text();
			}
		}

		if (fn) {
			$.ajax({
				type: 'POST',
				url: '/openfile',
				data: {
					filename: fn
				},
				dataType: 'json',
				error: function(e) {
					alertError(e);
					$('.modal-open-file-browser').modal('hide');
				},
				success: function(msg) {
					// if not insert mode
					if (!($('.modal-open-file-browser #insert-checkbox').is(":checked"))) {
						// clear old workspace
						Blockly.mainWorkspace.clear();
					}

					// load with new file
					$('.modal-open-file-browser').modal('hide');
					var xml = Blockly.Xml.textToDom(b64DecodeUnicode(msg));
					Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
				}
			});
		}
	});

	// =========================================================================
	// delete file browser modal form
	// =========================================================================
	$('.modal-delete-file-browser').on('shown.bs.modal', function() {
		$(this).find('[autofocus]').focus();
	});

	$('.modal-delete-file-browser #btn-ok').click(function() {
		var fn = $('.modal-delete-file-browser #file-text').val();
		if (fn == '') return;

		$('.modal-delete-confirm .modal-header h4').text(LANG_FILE_DELETE_CONFIRM);
		$('.modal-delete-confirm').modal({
			show: true,
			keyboard: false,
			backdrop: 'static'
		});
	});

	$('.modal-delete-confirm #btn-ok').click(function() {
		deleteFile($('.modal-delete-file-browser #file-text').val());
	});

	function alertError(e) {
		if (parseInt(e.responseText) < LANG_ERROR_CODE.length) {
			alert(LANG_ERROR_CODE[parseInt(e.responseText)]);
		} else {
			alert(LANG_ERROR_CODE_DEFAULT);
		}
	}

	// helper for modal autofocus (jade autofocus works only on first time opens)
	$('.modal').on('shown.bs.modal', function() {
		$(this).find('[autofocus]').focus();
	});

	function saveFile(fn) {
		var dom = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
		$.ajax({
			type: 'POST',
			url: '/savefile',
			data: {
				filename: fn,
				content: b64EncodeUnicode(dom)
			},
			dataType: 'json',
			error: function(e) {
				if (e.status != 200) {
					alertError(e);
				}
			},
			success: function(file_list) {
				$('.modal-save-file-browser').modal('hide');
			}
		});
	}

	function deleteFile(fn) {
		$.ajax({
			type: 'POST',
			url: '/deletefile',
			data: {
				filename: fn
			},
			dataType: 'json',
			error: function(e) {
				if (e.status != 200) {
					alertError(e);
				}
			},
			success: function() {
				$('.modal-delete-confirm').modal('hide');
				$('.modal-delete-file-browser').modal('hide');
			}
		});
	}

	$('#btn-save').click(function() {
		// save file browser modal form
		$('.modal-save-file-browser .modal-header h4').text(LANG_SAVE_FILE);
		$('.modal-save-file-browser .modal-footer #btn-ok').text(LANG_OK);
		$('.modal-save-file-browser .modal-footer #btn-cancel').text(LANG_CANCEL);

		$('.modal-save-file-browser #file-list').empty();
		$('.modal-save-file-browser #file-text').text('');

		$.ajax({
			type: 'POST',
			url: '/listfile',
			error: function(e) {
				if (e.status != 200) {
					alertError(e);
				}
			},
			success: function(file_list) {
				// render file list
				for (var i in file_list) {
					var item = file_list[i];
					$('.modal-save-file-browser #file-list').append('<a class="list-group-item">' + item.filename + '</a>');
				}

				$('.modal-save-file-browser .modal-body .list-group .list-group-item').click(function(e) {
					$('.modal-save-file-browser #file-text').val($(e.target).text());
				});

				$('.modal-save-file-browser').modal({
					show: true,
					keyboard: false,
					backdrop: 'static'
				});
			}
		});
	});

	function updateOpenFileButtons() {
		var open_flag = false;
		var items = $('.modal-open-file-browser .modal-body .list-group .list-group-item');

		for (var i = 0; i < items.length; i++) {
			if ($(items[i]).hasClass('active')) {
				open_flag = true;
			}
		}
		$('.modal-open-file-browser #btn-ok').prop('disabled', !open_flag);
	}

	$('#btn-open').click(function() {
		// open file browser modal form
		$('.modal-open-file-browser .modal-header h4').text(LANG_OPEN_FILE);
		$('.modal-open-file-browser .modal-footer #btn-ok').text(LANG_OK);
		$('.modal-open-file-browser .modal-footer #btn-cancel').text(LANG_CANCEL);
		$('.modal-open-file-browser #insert-text').text(LANG_INSERT_MODE);
		$('.modal-open-file-browser #insert-checkbox').prop('checked', false);

		$('.modal-open-file-browser #file-list').empty();
		$.ajax({
			type: 'POST',
			url: '/listfile',
			error: function(e) {
				if (e.status != 200) {
					alertError(e);
				}
			},
			success: function(file_list) {
				// render file list
				for (var i in file_list) {
					var item = file_list[i];
					$('.modal-open-file-browser #file-list').append('<a class="list-group-item">' + item.filename + '</a>');
				}

				$('.modal-open-file-browser .modal-body .list-group .list-group-item').click(function(e) {
					if ($(e.target).hasClass('disabled')) {
						// disable ok button
						$('.modal-open-file-browser #btn-ok').prop('disabled', true);
					} else {
						// enable ok button
						$('.modal-open-file-browser #btn-ok').prop('disabled', false);
					}
					$('.modal-open-file-browser .modal-body .list-group .list-group-item').removeClass('active');
					$(e.target).addClass('active');
				});

				updateOpenFileButtons();
				$('.modal-open-file-browser').modal({
					show: true,
					keyboard: false,
					backdrop: 'static'
				});
			}
		});
	});

	$('#btn-delete').click(function() {
		$('.modal-delete-file-browser .modal-header h4').text(LANG_DELETE_FILE);
		$('.modal-delete-file-browser .modal-footer #btn-ok').text(LANG_OK);
		$('.modal-delete-file-browser .modal-footer #btn-cancel').text(LANG_CANCEL);

		$('.modal-delete-file-browser #file-list').empty();
		$('.modal-delete-file-browser #file-text').text('');

		$.ajax({
			type: 'POST',
			url: '/listfile',
			error: function(e) {
				if (e.status != 200) {
					alertError(e);
				}
			},
			success: function(file_list) {
				// render file list
				for (var i in file_list) {
					var item = file_list[i];
					$('.modal-delete-file-browser #file-list').append('<a class="list-group-item">' + item.filename + '</a>');
				}

				$('.modal-delete-file-browser .modal-body .list-group .list-group-item').click(function(e) {
					$('.modal-delete-file-browser #file-text').val($(e.target).text());
				});

				// show modal
				$('.modal-delete-file-browser').modal({
					show: true,
					keyboard: false,
					backdrop: 'static'
				});
			}
		});
	});

	$('#btn-build').click(function() {
		$('.modal-build .modal-header h4').text(LANG_BUILD);
		$('#build-ok').text(LANG_OK);
		$('.modal-build .modal-body ul').text('');
		$('.modal-build .modal-body ul').append('<li id="port_checking_li">' + LANG_PORT_CHECKING + '...</li>');

		// reset function number in current project
		Blockly.JavaScript.resetTaskNumber();
		var code_str = Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace);

		//$('.modal-build.modal').modal('show'); // $('.modal-build.modal').modal('hide');
		$('.modal-build.modal').modal({
			backdrop: 'static', // protect background click
			keyboard: false,
			show: true
		});
		$('#build-ok').prop('disabled', true);

		//testbug
		console.log(code_str);
		//return;

		$.ajax({
			url: '/port_list',
			type: 'POST',
			error: function(e) {
				$('#port_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_FAILED);
				$('#build-ok').prop('disabled', false);
			},
			success: function(reply) {
				// check port list
				if (reply.result.length <= 0) {
					$('#port_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_FAILED);
					$('#build-ok').prop('disabled', false);
				}
				else {
					var port_name = reply.result[0];
					$('#port_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_PASSED + ' (' + port_name + ')');
					$('.modal-build .modal-body ul').append('<li id="board_checking_li">' + LANG_BOARD_CHECKING + '...</li>');

					var wifi_ssid = sessionStorage.getItem('wifi-ssid');
					var wifi_password = sessionStorage.getItem('wifi-password');
					var enable_iot = sessionStorage.getItem('enable-iot');

					$('.modal-wifi-config input#sta-ssid').val(wifi_ssid);
					$('.modal-wifi-config input#sta-password').val(wifi_password);
					$('.modal-wifi-config #wifi-iot-checkbox').val(enable_iot);
					$.ajax({
						url: '/read_mac',
						type: 'POST',
						data: {
							port_name: port_name
						},
						error: function(e) {
							$('#board_checking_li').text(LANG_BOARD_CHECKING + '... ' + LANG_FAILED);
							$('#build-ok').prop('disabled', false);
						},
						success: function(reply) {
							var board_id = reply.board_id;
							var mac_addr = reply.mac_addr;
							$('#board_checking_li').text(LANG_BOARD_CHECKING + '... ' + LANG_PASSED + ' (' + mac_addr + ')');
							$('.modal-build .modal-body ul').append('<li id="build_li">' + LANG_BUILD + '...</li>');
							$.ajax({
								url: '/build',
								type: 'POST',
								data: {
									board_id: board_id,
									mac_addr: mac_addr,
									code: b64EncodeUnicode(code_str),
									// NETPIE Config Data
									sta_ssid: wifi_ssid,
									sta_password: wifi_password,
									enable_iot: enable_iot,
								},
								dataType: 'json',
								error: function(e) {
									$('#build_li').text(LANG_BUILD + '... ' + LANG_FAILED);
									$('#build-ok').prop('disabled', false);
								},
								success: function(reply) {
									$('#build_li').text(LANG_BUILD + '... ' + LANG_PASSED);
									$('.modal-build .modal-body ul').append('<li id="program_li">' + LANG_BOARD_FLASHING + '...</li>');

									$.ajax({
										url: '/program',
										type: 'POST',
										data: {
											board_id: board_id,
											mac_addr: mac_addr,
											port_name: port_name
										},
										dataType: 'json',
										error: function(e) {
											$('#program_li').text(LANG_BOARD_FLASHING + '... ' + LANG_FAILED);
											$('#build-ok').prop('disabled', false);
										},
										success: function(reply) {
											$('#program_li').text(LANG_BOARD_FLASHING + '... ' + LANG_PASSED);
											$('#build-ok').prop('disabled', false);
										}
									});

								}
							});

						}
					});
				}

			}
		});
	});

	function setting_clock(clock_str) {
		$('.modal-setting-clock .modal-header h4').text(LANG_SETCLOCK);
		$('.modal-setting-clock #setting-clock-ok').text(LANG_OK);
		$('.modal-setting-clock .modal-body ul').text('');
		$('.modal-setting-clock .modal-body ul').append('<li id="port_checking_li">' + LANG_PORT_CHECKING + '...</li>');

		$('.modal-setting-clock.modal').modal({
			backdrop: 'static', // protect background click
			keyboard: false,
			show: true
		});
		$('.modal-setting-clock #setting-clock-ok').prop('disabled', true);

		$.ajax({
			url: '/port_list',
			type: 'POST',
			error: function(e) {
				$('.modal-setting-clock #port_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_FAILED);
				$('.modal-setting-clock #setting-clock-ok').prop('disabled', false);
			},
			success: function(reply) {
				// check port list
				if (reply.result.length <= 0) {
					$('.modal-setting-clock #port_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_FAILED);
					$('.modal-setting-clock #setting-clock-ok').prop('disabled', false);
				}
				else {
					var port_name = reply.result[0];
					$('.modal-setting-clock #port_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_PASSED + ' (' + port_name + ')');
					$('.modal-setting-clock .modal-body ul').append('<li id="setting_clock_li">' + LANG_SETTING_CLOCK + '...</li>');

					$.ajax({
						url: '/setclock',
						type: 'POST',
						data: {
							port_name: port_name,
							datetime: clock_str
						},
						dataType: 'json',
						error: function(e) {
							$('.modal-setting-clock #setting_clock_li').text(LANG_SETTING_CLOCK + '... ' + LANG_FAILED);
							$('.modal-setting-clock #setting-clock-ok').prop('disabled', false);
							$('.modal-set-clock').modal('hide');
						},
						success: function(reply) {
							$('.modal-setting-clock #setting_clock_li').text(LANG_SETTING_CLOCK + '... ' + LANG_PASSED);
							$('.modal-setting-clock #setting-clock-ok').prop('disabled', false);
							$('.modal-set-clock').modal('hide');
						}
					});

				}
			}
		});
	}

	$('#btn-setclock').click(function() {
		// open file browser modal form
		$('.modal-set-clock .modal-header h4').text(LANG_SETCLOCK);
		$('.modal-set-clock .modal-footer #btn-ok').text(LANG_OK);
		$('.modal-set-clock .modal-footer #btn-cancel').text(LANG_CANCEL);

		// sub7 available only on KidBrightOS version
		if (!standalone) {
			var dttm_sub7 = moment().subtract(7, 'hours');
			$('.modal-set-clock #button-sub7').text(dttm_sub7.format('DD/MM/YYYY HH:mm:ss'));
			$('#div-sub7').css('display', 'block');
		}
		else {
			$('#div-sub7').css('display', 'none');
		}

		var dttm_zero = moment();
		$('.modal-set-clock #button-zero').text(dttm_zero.format('DD/MM/YYYY HH:mm:ss'));

		// show set-clock modal
		$('.modal-set-clock').modal({
			show: true,
			keyboard: false,
			backdrop: 'static'
		});
	});

	$('.modal-set-clock #button-sub7').click(function() {
		var dttm_sub7 = moment($('.modal-set-clock #button-sub7').text(), 'DD/MM/YYYY HH:mm:ss');
		var dttm_sub7_serial = dttm_sub7.format('YYMMDD0eHHmmss');
		setting_clock(dttm_sub7_serial);
	});

	$('.modal-set-clock #button-zero').click(function() {
		var dttm_zero = moment($('.modal-set-clock #button-zero').text(), 'DD/MM/YYYY HH:mm:ss');
		var dttm_zero_serial = dttm_zero.format('YYMMDD0eHHmmss');
		setting_clock(dttm_zero_serial);
	});
	// =========================================================================
	// set wifi connection modal form
	// =========================================================================
	$('#wifi-build-ok').click(function(){
		if (typeof(sessionStorage.getItem('wifi-ssid')) !== 'undefined'){
			sessionStorage.setItem('wifi-ssid', $('.modal-wifi-config input#sta-ssid').val());
		}
		if (typeof(sessionStorage.getItem('wifi-password')) !== 'undefined'){
			sessionStorage.setItem('wifi-password', $('.modal-wifi-config input#sta-password').val());
		}
		if (typeof(sessionStorage.getItem('enable-iot')) !== 'undefined'){
			if ($('.modal-wifi-config #wifi-iot-checkbox').prop('checked') == false){
				sessionStorage.setItem('enable-iot', false);
			}
			else{
				sessionStorage.setItem('enable-iot', true);
			}
		}
	});
	$('#btn-wifi-config').click(function() {
		$('.modal-wifi-config #wifi-iot-text').text(LANG_IOT_MODE);
		$('.modal-wifi-config input#sta-ssid').val(sessionStorage.getItem('wifi-ssid'));
		$('.modal-wifi-config input#sta-password').val(sessionStorage.getItem('wifi-password'));
		if (sessionStorage.getItem('enable-iot') == false){
			$('.modal-wifi-config #wifi-iot-checkbox').prop('checked', false);
		}
		else{
			$('.modal-wifi-config #wifi-iot-checkbox').prop('checked', true);
		}
		$('.modal-wifi-config.modal').modal({
			show: true,
			keyboard: false,
			backdrop: 'static'
		});
	});
	// =========================================================================
	// read serial to generate QR code modal form
	// =========================================================================
	$('#btn-qrcode').click(function(){
		Blockly.JavaScript.resetTaskNumber();
		$('.modal-qrcode .modal-body').text('');
		$('img #qrcode-img').remove();
		$('.modal-qrcode .modal-body').append('<li id="board_checking_li">' + LANG_QR_CHECKING + '</li>');
		$.ajax({
			url: '/port_list',
			type: 'POST',
			error: function(e) {
				$('#board_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_FAILED);
			},
			success: function(reply) {
				// check port list
				if (reply.result.length <= 0) {
					$('#board_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_FAILED);
				}
				else {
					var port_name = reply.result[0];
					var request = $.ajax({
						url: '/read_mac',
						method: 'POST',
						data: {
							port_name: port_name
						},
						error: function(e) {
							$('#board_checking_li').text(LANG_BOARD_CHECKING + '... ' + LANG_FAILED);
						},
						success: function(reply) {
							var mac_addr = reply.mac_addr.replace(/[:]/g, '-');

							var request = $.ajax({
								url: '/gen_qr',
								method: 'POST',
								data: {
									mac_addr: mac_addr,
								},
								dataType: 'json',
								error: function(e) {
									$('#board_checking_li').text(LANG_BOARD_CHECKING + '... ' + LANG_FAILED);
								},
								success: function(reply) {
									// $('#board_checking_li').text(LANG_BOARD_CHECKING + '... ' + LANG_PASSED + ' (' + mac_addr + ')');
									$('.modal-qrcode .modal-body').append('<img id="qrcode-img" src="/images/qrcode.png" style="display: block;margin-left: auto;margin-right: auto;width: 50%;">');
								}
							});
						}
					});
				}
			}
		});
		$('.modal-qrcode.modal').modal('show');
	});

}

HomeController.prototype.onUpdateSuccess = function() {
	$('.modal-alert').modal({
		show: false,
		keyboard: true,
		backdrop: true
	});
	$('.modal-alert .modal-header h4').text('Success!');
	$('.modal-alert .modal-body p').html('Your account has been updated.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}

function homeSetLanguage(lang) {
	$.ajax({
		type: 'GET',
		url: '/lang?set=' + lang,
		error: function(e) {
			window.location.href = '/home';
		},
		success: function() {
			window.location.href = '/home';
		},
	});
}

// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings#answer-30106551
function b64EncodeUnicode(str) {
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
		return String.fromCharCode(parseInt(p1, 16))
	}))
}

function b64DecodeUnicode(str) {
	return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''))
}
