// #include <WiFi.h>
// #include <ArduinoWebsockets.h>

// #define TRIGGER_PIN 18
// #define ECHO_PIN 5
// float time_go = 0, distance = 0;

// const char *ssid = "KPQ";
// const char *password = "honcairoicho";
// const char *serverHost = "192.168.0.10";
// const int serverPort = 3000;

// WebsocketsClient webSocket;

// void setup()
// {
//    pinMode(TRIGGER_PIN, OUTPUT);
//    pinMode(ECHO_PIN, INPUT);
//    Serial.begin(115200);

//    connectToWiFi();
//    connectToWebSocket();
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

//    sendDataToServer(distance);

//    webSocket.loop();
//    delay(1000);
// }

// void connectToWiFi()
// {
//    WiFi.begin(ssid, password);
//    while (WiFi.status() != WL_CONNECTED)
//    {
//       delay(1000);
//       Serial.println("Connecting to WiFi...");
//    }
//    Serial.println("Connected to WiFi");
// }

// void connectToWebSocket()
// {
//    webSocket.begin(serverHost, serverPort, "/");
// }

// void sendDataToServer(float data)
// {
//    if (webSocket.available())
//    {
//       String json = "{\"distance\": " + String(data) + "}";
//       webSocket.send(json);
//    }
// }
