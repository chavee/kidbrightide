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
    KBIOT_BUTTON_PRESSED,
    KBIOT_BUTTON_CLICKED,
} kbiot_button_state_t;


void kbiot_init(char* kbserial, char *clientid, char *username, char *password);
void kbiot_setValue_int(char *target, int value);
void kbiot_setValue_str(char *target, char *value);
void kbiot_setConfig(char *target, char *data);


#endif

#ifdef __cplusplus
}
#endif
