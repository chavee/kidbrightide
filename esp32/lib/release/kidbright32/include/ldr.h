#ifndef __LDR_H__
#define __LDR_H__

#include "Wire.h"
#include "device.h"

class LDR : public Device {
public:
	LDR();
	void init(void); // override
	int error(void); // override
	int initialized(void); // override
	void process(void); // override
	uint8_t get(void);
 private:
	 uint8_t flag;
	 uint32_t tickcnt;
	 int light;
	 enum {
	 	s_read,
	 	s_wait
	 } state;
};

#endif
