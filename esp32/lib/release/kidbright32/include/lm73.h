#ifndef __LM73_H__
#define __LM73_H__

#include "Wire.h"
#include "device.h"

class LM73 : public Device {
public:
	LM73(TwoWire *i2c, int8_t _i2c_addr);
	void init(void); // override
	int error(void); // override
	int initialized(void); // override
	void process(void); // override
	double get(void);
 private:
	 TwoWire *i2c;
	 int8_t i2c_addr;
	 uint8_t flag;
	 uint32_t tickcnt;
	 double temperature;
	 enum {
		 s_detect, s_read, s_wait, s_error
	 } state;
	 void read_temp(void);
};

#endif
