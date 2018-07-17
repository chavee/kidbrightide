const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = require('child_process').exec;
const moment = require('moment');
const SerialPort = require('serialport');

module.exports = function(app, Config, Log) {
	const server_dir = __dirname;
	const data_dir = Config.process_dir + '/' + Config.ide.data_dir;
	const toolchain_dir = Config.process_dir + '/xtensa-esp32-elf/bin';

	function is_null(val) {
		return ((val == null) || (typeof(val) == 'undefined'));
	}

	function is_not_null(val) {
		return (!((val == null) || (typeof(val) == 'undefined')));
	}

	function esptool() {
		if (process.platform == 'win32') {
			return Config.process_dir + '/esptool.exe';
		} else
		if (process.platform == 'darwin') {
			return Config.process_dir + '/esptool';
		}

		return Config.process_dir + '/esptool.py';
	}

	function ospath(p) {
		if (process.platform == 'win32') {
			return p.replace(/\//g, '\\');
		}

		return p;
	}

	function filelistSortAsc(a, b) {
		return a.filename.localeCompare(b.filename);
	}

	function filelistSortDesc(a, b) {
		return b.filename.localeCompare(a.filename);
	}

	// main login page
	app.get('/', function(req, res) {
		res.redirect('/home');
	});

	app.get('/home', function(req, res) {
		// render home
		res.render('home', {
			title: 'Control Panel',
			//countries: CT,
			//udata: req.session.user,
			ulang: req.cookies.lang
		});
	});

	app.get('/lang', function(req, res) {
		if (req.query.set) {
			res.cookie('lang', req.query.set, {
				expires: new Date(253402300000000)
			}).send('ok');
		} else {
			res.status(200).send(req.cookies.lang);
		}
	});

	// web page language file
	app.get('/js/lang.js', function(req, res) {
		var lang_fn = 'en.js';
		if (req.cookies.lang == 'th') {
			lang_fn = 'th.js';
		}
		lang_fn = server_dir + '/languages/' + lang_fn;
		res.download(lang_fn, function(err) {
			if (err) {
				res.status(404).send('Not Found');
			}
		});
	});

	// blockly language file
	app.get('/blockly/lang.js', function(req, res) {
		var lang_fn = 'en.js';
		if (req.cookies.lang == 'th') {
			lang_fn = 'th.js';
		}
		lang_fn = server_dir + '/languages/blockly/' + lang_fn;
		res.download(lang_fn, function(err) {
			if (err) {
				res.status(404).send('Not Found');
			}
		});
	});

	app.get('*', function(req, res) {
		res.render('404', {
			title: 'Page Not Found'
		});
	});

	app.post('/listfile', function(req, res) {
		var dir = data_dir;
		var filelist = [];
		try {
			var files = fs.readdirSync(dir);
			for (var i in files) {
				var name = dir + '/' + files[i];
				if (fs.statSync(name).isFile()) {
					filelist.push({
						filename: files[i]
					});
				}
			}
			filelist.sort(filelistSortAsc);
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(filelist));
		} catch (err) {
			console.error(err);
			res.status(400).send('0');
		}
	});

	app.post('/savefile', function(req, res) {
		try {
			fs.writeFileSync(data_dir + '/' + req.body['filename'], req.body['content'], 'utf8');
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(null));
		} catch (err) {
			console.error(err);
			res.status(400).send('0');
		}
	});

	app.post('/openfile', function(req, res) {
		try {
			fs.readFile(data_dir + '/' + req.body['filename'], 'utf8', function(err, contents) {
				//res.status(200).send(o);
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(contents));
			});
		} catch (err) {
			console.error(err);
			res.status(400).send('0');
		}
	});

	app.post('/deletefile', function(req, res) {
		try {
			fs.unlinkSync(data_dir + '/' + req.body['filename']);
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(null));
		} catch (err) {
			console.error(err);
			res.status(400).send('0');
		}
	});

	app.post('/setclock', function(req, res) {
		Log.i('setting board real time clock...');
		try {
			var port_name = req.body['port_name'];
			var tx_str = req.body['datetime'];
			var serialport = new SerialPort(port_name, {
				baudRate: 115200,
				dataBits: 8,
				stopBits: 1,
				parity: 'none',
				rtscts: false,
				xon: false,
				xoff: false,
				xany: false,
				autoOpen: false
			});

			serialport.open(function(err) {
				if (err) throw err;

				serialport.write('rtc set ' + tx_str + '\n', function(err) {
					if (err) {
						console.log('Error on write: ', err.message);
					}
					// delay close port
					setTimeout(function () {
						serialport.close();

						res.setHeader('Content-Type', 'application/json');
						res.status(200);
						res.send(JSON.stringify(null));
					}, 500);
				});
			});
		} catch (err) {
			console.log(err);
			// response with json format (ajax post dataType is json)
			res.setHeader('Content-Type', 'application/json');
			res.status(400);
			res.send(JSON.stringify({
				result: err
			}));
		}
	});

	app.post('/standalone', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({
			standalone: Config.standalone
		}));
	});

	app.post('/version', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({
			version: Config.version
		}));
	});

	app.post('/port_list', function(req, res) {
		try {
			require('serialport').list(function(err, ports) {
				if (err) throw err;

				var port_list_str = 'none';
				var port_list = [];
				for (var i in ports) {
					if (is_not_null(ports[i].comName) && is_not_null(ports[i].productId) && is_not_null(ports[i].vendorId)) {
						var uid = ports[i].vendorId + ':' + ports[i].productId;
						if (Config.ide.port_vid_pid.indexOf(uid.toLowerCase()) >= 0) {
							port_list.push(ports[i].comName);
							if (i == 0) {
								port_list_str = ports[i].comName;
							}
							else {
								port_list_str += ', ' + ports[i].comName;
							}
						}
					}
				}
				Log.i('serial port enumerated (' + port_list_str + ')');

				res.setHeader('Content-Type', 'application/json');
				res.status(200);
				res.send(JSON.stringify({
					result: port_list
				}));
			});
		} catch (err) {
			console.log(err);
			// response with json format (ajax post dataType is json)
			res.setHeader('Content-Type', 'application/json');
			res.status(400);
			res.send(JSON.stringify({
				result: err
			}));
		}
	});

	app.post('/read_mac', function(req, res) {
		var port_name = req.body['port_name'];
		try {
			var cmd = util.format(
				'"%s" --chip esp32 %s read_mac',
				esptool(),
				'--port "' + port_name + '" --baud 921600'
			);
			exec(ospath(cmd), (err, stdout, stderr) => {
				if (err) throw err;

				var board_id = '';
				var mac_addr = '';
				var strlst = String(stdout).split(/\r?\n/);
				for (var i in strlst) {
					var str = strlst[i];
					var chlst = str.split(':');
					if (chlst.length == 7) {
						board_id = chlst[4] + chlst[5] + chlst[6];
						mac_addr = (chlst[1] + ':' + chlst[2] + ':' + chlst[3] + ':' + chlst[4] + ':' + chlst[5] + ':' + chlst[6]).trim();
					}
				}
				Log.i('reading board mac address (' + mac_addr + ')');

				// response with json format (ajax post dataType is json)
				res.setHeader('Content-Type', 'application/json');
				res.status(200);
				res.send(JSON.stringify({
					board_id: board_id,
					mac_addr: mac_addr
				}));
			});
		} catch (err) {
			Log.i('board mac address (none)');
			console.log(err);
			// response with json format (ajax post dataType is json)
			res.setHeader('Content-Type', 'application/json');
			res.status(400);
			res.send(JSON.stringify({
				result: err
			}));
		}
	});

	app.post('/build', function(req, res) {
		var board_id = req.body['board_id'];
		var mac_addr = req.body['mac_addr'];

		Log.i('building board id ' + board_id + ' (' + mac_addr + ')');
		/*if ((board_id == '') || (board_id.length != 6)) {
			// response with json format (ajax post dataType is json)
			res.setHeader('Content-Type', 'application/json');
			res.status(400);
			res.send(JSON.stringify({
				result: 'no board id defined!'
			}));
		}
		else*/
		{
			var code = new Buffer(req.body['code'], 'base64').toString('utf8');
			// extract setup and task statements
			var var_str = '';
			var code_strlst = code.split('\n');
			var braces_cnt = 0;
			var task_code = '';
			var task_fn_name = [];
			var setup_code = '// setup\n';
			var in_func_flag = false;
			for (var code_str_index in code_strlst) {
				var line = code_strlst[code_str_index].replace('\n', '');

				// find variable line
				if (line.substring(0, 4) == 'var ') {
					var_str += line.replace('var', 'double').replace(new RegExp(',', 'g'), '=0,').replace(';', '=0;') + '\n';
					line = '';
				}

				if (line.length <= 0) {
					continue;
				}

				// task function
				if (line.substring(0, 10) == 'void vTask') {
					var tmp_line = line.replace('(', ' ');
					var tmp_linelst = tmp_line.split(' ');
					task_fn_name.push(tmp_linelst[1]);
					task_code += '\n';
					in_func_flag = true;
				}

				var open_brace_cnt = line.split('{').length - 1;
				var close_brace_cnt = line.split('}').length - 1;
				braces_cnt = braces_cnt + open_brace_cnt - close_brace_cnt;

				if (in_func_flag) {
					task_code += (line + '\n');
					if (braces_cnt == 0) {
						in_func_flag = false;
					}
				} else {
					setup_code += (line + '\n');
				}
			}

			// add setup code indent
			var setup_code_list = setup_code.split('\n');
			setup_code = '';
			for (var setup_code_index in setup_code_list) {
				setup_code += '  ' + setup_code_list[setup_code_index] + '\n';
			}

			var task_fn_code = '  // create tasks\n';
			for (var task_fn_index in task_fn_name) {
				var task_fn = task_fn_name[task_fn_index];
				//xTaskCreatePinnedToCore(vUserAppTask, "User App Task", USERAPP_STACK_SIZE_MIN, NULL, USERAPP_TASK_PRIORITY, NULL, ARDUINO_RUNNING_CORE);
				//task_fn_code += '  xTaskCreate(' + task_fn + ', "' + task_fn + '", USERAPP_STACK_SIZE_MIN, NULL, USERAPP_TASK_PRIORITY, NULL);\n'
				task_fn_code += '  xTaskCreatePinnedToCore(' + task_fn + ', "' + task_fn + '", USERAPP_STACK_SIZE_MIN, NULL, USERAPP_TASK_PRIORITY, NULL, ARDUINO_RUNNING_CORE);\n';
			}

			var user_app_code =
				'#include <stdio.h>\n' +
				'#include "freertos/FreeRTOS.h"\n' +
				'#include "freertos/task.h"\n' +
				'#include "esp_system.h"\n' +
				'#include "Arduino.h"\n' +
				'#include "Wire.h"\n' +
				'#include "kidbright32.h"\n' +
				'#include "ports.h"\n' +
				'#include "button12.h"\n' +
				'#include "ldr.h"\n' +
				'#include "sound.h"\n' +
				'#include "ht16k33.h"\n' +
				'#include "lm73.h"\n' +
				'#include "mcp7940n.h"\n\n' +
				'extern PORTS ports;\n' +
				'extern BUTTON12 button12;\n' +
				'extern LDR ldr;\n' +
				'extern SOUND sound;\n' +
				'extern HT16K33 ht16k33;\n' +
				'extern LM73 lm73_0;\n' +
				'extern LM73 lm73_1;\n' +
				'extern MCP7940N mcp7940n;\n\n' +
				var_str +
				task_code + '\n' +
				'void user_app(void) {\n' +
				setup_code +
				task_fn_code +
				'}\n';

			try {
				// create build directory
				var board_name = mac_addr.replace(/:/g, '-');
				var user_app_dir = Config.process_dir + '/esp32/build/' + board_name;

				if (!fs.existsSync(user_app_dir)) {
					fs.mkdirSync(user_app_dir);
				}
				// save to file
				fs.writeFile(user_app_dir + '/user_app.cpp', user_app_code, (err) => {
					if (err) throw err;
					// parse common.mk
					fs.readFile(Config.process_dir + '/esp32/lib/release/common.mk', 'utf8', (err, data) => {
						if (err) throw err;

						// extract RELEASE_DIR, CFLAG+=, LDFLAGS+=
						var release_dir = '';
						var cflags = '';
						var ldflags = '';
						var strlst = data.split('\n');
						for (var i in strlst) {
							var str = strlst[i];
							if (str != "") {
								if (str.indexOf('RELEASE_DIR=') == 0) {
									var lnlst = str.split('=');
									if (lnlst.length == 2) {
										release_dir = lnlst[1];
									}
								}
								if (str.indexOf('CFLAGS+=') == 0) {
									var lnlst = str.split('+=');
									if (lnlst.length == 2) {
										cflags = lnlst[1];
									}
								}
								if (str.indexOf('LDFLAGS+=') == 0) {
									var lnlst = str.split('+=');
									if (lnlst.length == 2) {
										ldflags = lnlst[1];
									}
								}
							}
						}
						cflags = cflags.replace(/\$\(RELEASE_DIR\)/g, 'esp32/' + release_dir);
						ldflags = ldflags.replace(/\$\(RELEASE_DIR\)/g, 'esp32/' + release_dir);

						// compile
						var cmd = util.format('"%s/xtensa-esp32-elf-c++" -std=gnu++11 -fno-rtti -Og -ggdb -ffunction-sections -fdata-sections -fstrict-volatile-bitfields -mlongcalls -nostdlib -Wall -Werror=all -Wno-error=unused-function -Wno-error=unused-but-set-variable -Wno-error=unused-variable -Wno-error=deprecated-declarations -Wextra -Wno-unused-parameter -Wno-sign-compare -fno-exceptions -DESP_PLATFORM -D IDF_VER=\'""\' -MMD -MP  -Wno-unused-variable -Wno-unused-value -DARDUINO=10800 -DESP32=1 -DARDUINO_ARCH_ESP32=1 -DWITH_POSIX -DMBEDTLS_CONFIG_FILE=\'"mbedtls/esp_config.h"\' -DHAVE_CONFIG_H %s -I"%s" -c "%s/user_app.cpp" -o "%s/user_app.o"', toolchain_dir, cflags, user_app_dir, user_app_dir, user_app_dir);
						exec(ospath(cmd), (err, stdout, stderr) => {
							if (err) throw err;

							// create libmain
							var cmd = util.format('"%s/xtensa-esp32-elf-ar" cru "%s/libmain.a" "%s/user_app.o"', toolchain_dir, user_app_dir, user_app_dir);
							exec(ospath(cmd), (err, stdout, stderr) => {
								if (err) throw err;

								// link
								var cmd = util.format('"%s/xtensa-esp32-elf-gcc" -nostdlib -u call_user_start_cpu0  -Wl,--gc-sections -Wl,-static -Wl,--start-group %s -L"%s" -lgcc -lstdc++ -lgcov -Wl,--end-group -Wl,-EL -o "%s/%s.elf"', toolchain_dir, ldflags, user_app_dir, user_app_dir, board_name);
								exec(ospath(cmd), (err, stdout, stderr) => {
									if (err) throw err;

									// create bin
									var cmd = util.format(
										'"%s" --chip esp32 elf2image --flash_mode "dio" --flash_freq "40m" --flash_size "4MB" -o "%s" "%s/%s.elf"',
										esptool(),
										user_app_dir + '/' + board_name + '.bin',
										user_app_dir,
										board_name
									);
									exec(ospath(cmd), (err, stdout, stderr) => {
										if (err) throw err;

										res.setHeader('Content-Type', 'application/json');
										res.status(200);
										res.send(JSON.stringify({
											result: 'ok'
										}));
									});
								});
							});
						});
					});
				});

			} catch (err) {
				console.log(err);
				// response with json format (ajax post dataType is json)
				res.setHeader('Content-Type', 'application/json');
				res.status(400);
				res.send(JSON.stringify({
					result: 'error'
				}));
			}
		}
	});

	app.post('/program', function(req, res) {
		var board_id = req.body['board_id'];
		var mac_addr = req.body['mac_addr'];
		var port_name = req.body['port_name'];

		Log.i('programing board id ' + board_id + ' (' + mac_addr + ')');
		try {
			var board_name = mac_addr.replace(/:/g, '-');
			var user_app_dir = Config.process_dir + '/esp32/build/' + board_name;
			var release_dir = Config.process_dir + '/esp32/lib/release';

			// program
			var cmd = util.format(
				'"%s" --chip esp32 %s --before "default_reset" --after "hard_reset" write_flash -z --flash_mode "dio" --flash_freq "40m" --flash_size detect 0x1000 "%s" 0xe000 "%s" 0x8000 "%s" 0x10000 "%s"',
				esptool(),
				'--port "' + port_name + '" --baud 921600',
				release_dir + '/bootloader.bin',
				release_dir + '/boot_app0.bin',
				release_dir + '/default.bin',
				user_app_dir + '/' + board_name + '.bin'
			);
			exec(ospath(cmd), (err, stdout, stderr) => {
				if (err) throw err;

				res.setHeader('Content-Type', 'application/json');
				res.status(200);
				res.send(JSON.stringify({
					result: 'ok'
				}));
			});
		} catch (err) {
			console.log(err);
			// response with json format (ajax post dataType is json)
			res.setHeader('Content-Type', 'application/json');
			res.status(400);
			res.send(JSON.stringify({
				result: 'error'
			}));
		}
	});
};
