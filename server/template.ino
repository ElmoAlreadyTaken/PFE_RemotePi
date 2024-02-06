#include <remotePi.h>
remotePi config;
void setup() {
  Serial.begin(115200);
  config.begin();
}
    
void loop() {
  config.handleClient();
}