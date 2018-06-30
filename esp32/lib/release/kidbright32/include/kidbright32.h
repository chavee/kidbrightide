#ifndef __KIDBRIGHT32_H__
#define __KIDBRIGHT32_H__

#define BT_LED_GPIO						23
#define WIFI_LED_GPIO					2
#define NTP_LED_GPIO					15
#define IOT_LED_GPIO					12
#define LED_ON							0
#define LED_OFF							1

#define DISPLAY_I2CBUS_SPEED			300000
#define DISPLAY_SDA_GPIO				21
#define DISPLAY_SCL_GPIO				22
#define CHAIN_I2CBUS_SPEED				300000
#define CHAIN_SDA_GPIO					4
#define CHAIN_SCL_GPIO					5

#if CONFIG_FREERTOS_UNICORE
#define ARDUINO_RUNNING_CORE			0
#else
#define ARDUINO_RUNNING_CORE			1
#endif

#define IODEV_STACK_SIZE_MIN			1024
#define I2CDEV_STACK_SIZE_MIN			2048
#define SERIAL_STACK_SIZE_MIN			4096
#define USERAPP_STACK_SIZE_MIN			4096

#ifdef SMALL_TEST
// configMAX_PRIORITIES = 7
#define	IODEV_TASK_PRIORITY             6
#define	I2CDEV_TASK_PRIORITY			5
#define	SERIAL_TASK_PRIORITY			4
#define	USERAPP_TASK_PRIORITY			2
#else
// configMAX_PRIORITIES = 25 (default)
#define	IODEV_TASK_PRIORITY             22
#define	I2CDEV_TASK_PRIORITY			20
#define	SERIAL_TASK_PRIORITY			18
#define	USERAPP_TASK_PRIORITY			8
#endif
//#define	USERAPP_TASK_DELAY_MS		50
//#define MAIN_TIMER_INTERVAL_IN_MS		20

/*
#define STR(x)							#x
#define XSTR(x)							STR(x)
#pragma message "configMAX_PRIORITIES = " XSTR(configMAX_PRIORITIES)
#pragma message "IODEV_TASK_PRIORITY = " XSTR(IODEV_TASK_PRIORITY)
#pragma message "I2CDEV_TASK_PRIORITY = " XSTR(I2CDEV_TASK_PRIORITY)
#pragma message "USERAPP_TASK_PRIORITY = " XSTR(USERAPP_TASK_PRIORITY)
#pragma message "ARDUINO_RUNNING_CORE = " XSTR(ARDUINO_RUNNING_CORE)
*/

#define I2C_TICK_MS						25
#define I2C_CNT_MS(x)					(x / I2C_TICK_MS)
#define IO_TICK_MS                      50
#define IO_CNT_MS(x)                    (x / IO_TICK_MS)
//#define DEVICE_DATA_STRING_SIZE		32
// 100 = 2 decimal digits
#define DEVICE_DATA_PREC_COEF			100

#define LDR_POLLING_MS					1000
#define LM73_POLLING_MS					1000
#define MCP7940N_POLLING_MS				250
/*#define SENSOR_HUB_POLLING_MS			250
#define SWLED_POLLING_MS				50
#define RELAY_POLLING_MS				250
#define PCA9632_POLLING_MS				250
#define PCA9685_POLLING_MS				250
#define PCA9548_POLLING_MS				250*/

#define HT16K33_ONBOARD_ADDR			0x70
#define LM73_0_ONBOARD_ADDR				0x49
#define LM73_1_ONBOARD_ADDR				0x4d
#define MCP7940N_ONBOARD_ADDR			0x6f

#define MCP7940N_DEFAULT_DATETIME       "18043001000000"

#endif
