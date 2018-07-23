$(document).ready(function() {
	// update caption
	$('#btn-open').text(LANG_OPEN_FILE);
	$('#btn-save').text(LANG_SAVE_FILE);
	$('#btn-delete').text(LANG_DELETE_FILE);
	$('#btn-build').text(LANG_BUILD);
	$('#btn-setclock').text(LANG_SETCLOCK);
	$('#btn-update').text(LANG_UPDATE);
	$('#btn-wifi-config').text(LANG_WIFI_CONFIG);
	$('#btn-qrcode').text(LANG_QRCODE);
	// add title
	$('#btn-open').prop('title', LANG_OPEN_FILE_TITLE);
	$('#btn-save').prop('title', LANG_SAVE_FILE_TITLE);
	$('#btn-delete').prop('title', LANG_DELETE_FILE_TITLE);
	$('#btn-build').prop('title', LANG_BUILD_TITLE);
	$('#btn-setclock').prop('title', LANG_SETCLOCK_TITLE);
	$('#btn-update').prop('title', LANG_UPDATE_TITLE);
	$('.modal-wifi-config .modal-header h4').text(LANG_WIFI_CONFIG);
	$('.modal-qrcode .modal-header h4').text(LANG_QRCODE);
	// create home controller
	var hc = new HomeController();
});
