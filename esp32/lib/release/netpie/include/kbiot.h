#ifdef __cplusplus
extern "C" {
#endif

#ifndef kbiot_h
#define kbiot_h

#include "microgear.h"
#include "esp_log.h"
#include "esp_system.h"

#define TAG "KBIOT"

typedef enum {
    KBIOT_BUTTON_RELEASED = 0,
    KBIOT_BUTTON_PRESSED = 1,
    KBIOT_BUTTON_CLICKED = 2,
} kbiot_button_state_t;

void kbiot_init(char* kbserial, char *clientid, char *username, char *password);
void kbiot_setValue_int(char *target, int value);
void kbiot_setValue_str(char *target, char *value);
void kbiot_writefeed_int(char *appid, char *feed, int value);
void kbiot_setConfig(char *target, char *data);
void set_B1release();
void set_B2release();
uint8_t get_B1state();
uint8_t get_B2state();
uint8_t get_B1stateClicked();
uint8_t get_B2stateClicked();
// uint8_t iot_button_mapped(char * text, int sw_num);
// uint8_t iot_button_read(int sw_num);
#endif

#ifdef __cplusplus
}
#endif
