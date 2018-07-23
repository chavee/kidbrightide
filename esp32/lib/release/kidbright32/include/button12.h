#ifndef __BUTTON12_H__
#define __BUTTON12_H__

#include "Wire.h"
#include "device.h"

class BUTTON12 : public Device {
public:
	BUTTON12();
	void init(void); // override
	int error(void); // override
	int initialized(void); // override
	void process(void); // override
	int sw1_get(void);
	int sw2_get(void);
	void wait_sw1_pressed(void);
	void wait_sw1_released(void);
	void wait_sw2_pressed(void);
	void wait_sw2_released(void);
	int is_sw1_pressed(void);
	int is_sw1_released(void);
	int is_sw2_pressed(void);
	int is_sw2_released(void);
	int key_pressed(void);
	int key_released(void);
 private:
	 int value;
	 int temp_value;
	 enum {
	 	s_get,
	 	s_check
	 } state;
};

#endif
