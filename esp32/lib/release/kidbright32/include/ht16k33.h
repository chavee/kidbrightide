#ifndef __HT16K33_H__
#define __HT16K33_H__

#include "Wire.h"
#include "device.h"

#define SCROLLING_STRING_LEN			31
#define LED16x8_MAX_CHARS				2

class HT16K33 : public Device {
public:
	HT16K33(TwoWire *i2c, int8_t _i2c_addr);
	void init(void); // override
	int error(void); // override
	int initialized(void); // override
	void process(void); // override
	int busy(void);
	int idle(void);
	void wait_idle(void);
	void show(uint8_t *buf);
	void scroll(char *buf, bool scroll_flag);
	void scroll(int val, bool scroll_flag);
	void scroll(double val, bool scroll_flag);
	void scroll(double val, bool scroll_flag, int precision);
 private:
	 TwoWire *i2c;
	 int8_t i2c_addr;
	 uint8_t buffer[16], temp_buffer[16];
	 uint8_t scrolling_buffer[16];
	 char scrolling_string[SCROLLING_STRING_LEN + 1], scrolling_temp_string[SCROLLING_STRING_LEN + 1];;
	 uint8_t curr_char_index, start_strip_index, display_width, font_width, curr_heading_width, cmd_index;
	 uint8_t flag, set_flag, clr_flag;
	 enum {
		 s_detect, s_clrscr, s_cmd_init, s_show, s_scrolling_init, s_scrolling, s_idle, s_error
	 } state;
};

#endif
