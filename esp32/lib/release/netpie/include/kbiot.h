#ifdef __cplusplus
extern "C" {
#endif

#ifndef kbiot_h
#define kbiot_h

#include "microgear.h"
#include "esp_log.h"
#include "esp_system.h"

#define TAG "KBIOT"

// token bucket parameters
#define FEED_BUCKETSIZE 4
#define FEED_FILLRATE   0.135
#define PUB_BUCKETSIZE 6
#define PUB_FILLRATE   0.51

#define KBIOT_DEBUG 1 

typedef enum {
    KBIOT_BUTTON_RELEASED = 0,
    KBIOT_BUTTON_PRESSED = 1,
    KBIOT_BUTTON_CLICKED = 2,
} kbiot_button_state_t;

void kbiot_init(char* kbserial, char *clientid, char *username, char *password);
void kbiot_setValue_int(char *target, int value);
void kbiot_setValue_str(char *target, char *value);
void kbiot_writeFeed(char *feedid, char *key, float value);
void kbiot_setValue_float(char *target, float value);
void kbiot_setConfig(char *target, char *data);
bool toPublish(Microgear *mg, char *topic, char *payload, int len, int qos, int retain);
void toWriteFeed(Microgear *mg, char *topic, char *payload, int len, int qos, int retain);
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
