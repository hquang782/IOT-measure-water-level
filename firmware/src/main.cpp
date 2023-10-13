#include <Arduino.h>
// //

// #define TRIGGER_PIN 18
// #define ECHO_PIN 5
// float time_go = 0, distance = 0;

// void setup()
// {
//    pinMode(TRIGGER_PIN, OUTPUT);
//    pinMode(ECHO_PIN, INPUT);
//    Serial.begin(115200);
// }

// void loop()
// {
//    digitalWrite(TRIGGER_PIN, LOW);
//    delayMicroseconds(2);
//    digitalWrite(TRIGGER_PIN, HIGH);
//    delayMicroseconds(10);
//    digitalWrite(TRIGGER_PIN, LOW);
//    delayMicroseconds(2);
//    time_go = pulseIn(ECHO_PIN, HIGH);

//    distance = time_go * 364.5 * 100 / 1000000 / 2;
//    Serial.print("Khoang cach: ");
//    Serial.print(distance);
//    Serial.println("cm");
//    delay(1000);
// }

#include <Ultrasonic.h>

/*
 * Pass as a parameter the trigger and echo pin, respectively,
 * or only the signal pin (for sensors 3 pins), like:
 * Ultrasonic ultrasonic(13);
 */
Ultrasonic ultrasonic(12, 13); // trigger,echo
int distance;

void setup()
{
   Serial.begin(115200);
}

void loop()
{
   // Pass INC as a parameter to get the distance in inches
   distance = ultrasonic.read();

   Serial.print("Distance in CM: ");
   Serial.println(distance);
   delay(1000);
}