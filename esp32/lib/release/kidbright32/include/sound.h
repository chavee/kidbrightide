#ifndef __SOUND_H__
#define __SOUND_H__

#include "driver/mcpwm.h"
#include "Wire.h"
#include "device.h"

class SOUND : public Device {
public:
	SOUND();
	void init(void); // override
	int error(void); // override
	int initialized(void); // override
	void process(void); // override
	void on(uint32_t freq, uint8_t duty_in_percent);
	void off(void);
	void note(uint8_t note);
	void rest(uint8_t duration);
	uint32_t get_bpm(void);
	void set_bpm(uint32_t val);
	uint8_t get_volume(void);
	void set_volume(uint32_t val);
 private:
	 mcpwm_config_t pwm_config;
	 uint32_t bpm, duty_cycle, volume;
};

#endif
