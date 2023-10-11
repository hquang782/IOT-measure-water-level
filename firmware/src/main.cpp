// #include <Arduino.h>
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