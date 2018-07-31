#ifndef __MCP7940N_H__
#define __MCP7940N_H__

#include "Wire.h"
#include "device.h"

#define MCP7940N_BUFFER_SIZE				16
#define DATETIME_STR_LEN					31
#define DATE_STR_LEN						15
#define TIME_STR_LEN						15

class MCP7940N : public Device {
public:
	MCP7940N(TwoWire *i2c, int8_t _i2c_addr);
	void init(void); // override
	int error(void); // override
	int initialized(void); // override
	void process(void); // override
	char *get_datetime(void);
	char *get_date(void);
	char *get_time(void);
	int get(int index);
	void write(char *str);
	bool write_flag(void);
	void cal(int val);
	void cal_coarse(int val);
 private:
	 TwoWire *i2c;
	 int8_t i2c_addr;
	 uint8_t flag;
	 uint32_t tickcnt;
	 uint8_t read_buffer[MCP7940N_BUFFER_SIZE], write_buffer[MCP7940N_BUFFER_SIZE];
	 uint8_t cal_value, cal_coarse_value;
	 char datetime_str[DATETIME_STR_LEN + 1], date_str[DATE_STR_LEN + 1], time_str[TIME_STR_LEN + 1];
	 enum {
	 	s_detect,
	 	s_read,
	 	s_wait,
	 	s_write,
	 	s_cal,
	 	s_cal_coarse,
	 	s_error
	 } state;
};

#endif
