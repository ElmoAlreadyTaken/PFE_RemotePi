#include <Servo.h>
#include <remotePi.h>

remotePi config;  // Will use default values

Servo myservo;  // create servo object to control a servo
// twelve servo objects can be created on most boards
int cpt = 0;

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("Booting Sketch...");
  myservo.attach(2);  // attaches the servo on GIO2 to the servo object

  config.begin();
}

void loop() {

  config.handleClient();
  int pos;

  for (pos = 0; pos <= 180; pos += 10) {  // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    myservo.write(pos);  // tell servo to go to position in variable 'pos'
    delay(10);           // waits 15ms for the servo to reach the position
  }
  delay(500);
  for (pos = 180; pos >= 0; pos -= 10) {  // goes from 180 degrees to 0 degrees
    myservo.write(pos);                   // tell servo to go to position in variable 'pos'
    delay(10);                            // waits 15ms for the servo to reach the position
  }
  config.sendLog("1 TOUR DE PLUS");
  cpt = cpt +1;
  delay(3000);

  if(cpt==5){
    config.stop();
  }

}