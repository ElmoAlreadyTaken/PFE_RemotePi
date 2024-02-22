#include <remotePi.h>
#include <ESP8266mDNS.h>

remotePi config;  // Will use default values

const int trigPin = 12;
const int echoPin = 14;

#define SOUND_VELOCITY 0.034

long duration;
float distanceCm;

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("Booting Sketch...");

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  config.begin();
}

void loop() {

  config.handleClient();

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);

  distanceCm = duration * SOUND_VELOCITY / 2;

  if (distanceCm <= 10) {
    Serial.print("Distance (cm): ");
    Serial.println(distanceCm);
    config.sendLog("Distance (cm): " + String(distanceCm));
    digitalWrite(LED_BUILTIN, LOW);
    delay(5000);
    Serial.println("STOOOOOOOP");
    config.stop();
  } else {
    digitalWrite(LED_BUILTIN, HIGH);
  }
}
