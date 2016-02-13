#include <pebble.h>
#include "Demo.h"

static Window *window;
static TextLayer *s_messageLayer;

enum KEYS{
	READY,
	BACKGROUND,
	MESSAGE,
};

void in_received_handler(DictionaryIterator *received, void *context) {
  Tuple *message_tuple = dict_find(received, MESSAGE);
  Tuple *background_tuple = dict_find(received, BACKGROUND);
	
  if (message_tuple) {
	  text_layer_set_text(s_messageLayer, message_tuple->value->cstring);
	  printf("Text to display: %s",message_tuple->value->cstring);
  }

  if (background_tuple) {
	  window_set_background_color(window, GColorFromHEX(background_tuple->value->int32));
	  printf("Background Color: %d",(int)background_tuple->value->int32);
  }
}

static void out_sent_handler(DictionaryIterator *sent, void *context) {	
}

static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
	
  s_messageLayer = text_layer_create(GRect(0,65,144,100));
  layer_add_child(window_layer, text_layer_get_layer(s_messageLayer));
  text_layer_set_text(s_messageLayer, "");
  text_layer_set_text_alignment(s_messageLayer, GTextAlignmentCenter);
  text_layer_set_font(s_messageLayer, 	fonts_get_system_font(FONT_KEY_ROBOTO_CONDENSED_21));
  text_layer_set_text_color(s_messageLayer, GColorYellow);
  text_layer_set_background_color(s_messageLayer, GColorClear);
}

static void window_unload(Window *window){
  text_layer_destroy(s_messageLayer);
}

void handle_init(void) {
	printf("Handle init");
	window = window_create();
	
	window_set_window_handlers(window, (WindowHandlers) {
    	.load = window_load,
    	.unload = window_unload
  	});
  
	window_stack_push(window, true /* Animated */);
	
	app_message_register_inbox_received(in_received_handler);
  	app_message_register_outbox_sent(out_sent_handler);

  	const uint32_t inbound_size = 256;
  	const uint32_t outbound_size = 256;
  	app_message_open(inbound_size, outbound_size);
	
}
void handle_deinit(void){
	printf("Handle deinit");
	tick_timer_service_unsubscribe();
	app_message_deregister_callbacks();
	window_destroy(window);
}


int main(void) {
	handle_init();
	app_event_loop();
	handle_deinit();
}
