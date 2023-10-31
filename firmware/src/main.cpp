#include <WiFi.h>
#include <PubSubClient.h>
#include <Ultrasonic.h>
#include <Arduino.h>

// khai báo chân cảm biến khoảng cách, sử dụng thư viện ultrasonic cho tiện việc tính khoảng cách
Ultrasonic ultrasonic(13, 12); // trigger,echo

const char *ssid = "KPQ";
const char *password = "honcairoicho";
const char *mqtt_server = "mqtt-dashboard.com";

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;

// biến khoảng cách từ cảm biến đến phao
float distance = 0;
// biến độ cao của mực nước
float water_level_high = 0;
// biến độ cao thiết bị - giả lập
float high_devide = 50;

void setup_wifi()
{
    delay(10);
    // Kết nối wifi
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    randomSeed(micros());

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

// setup publisher điều khiển thiết bị - phát triển sau
//  sửa
// void callback(char* topic,byte* payload, unsigned int length) {
//   String incommingMessage = "";
//   for (int i = 0; i < length; i++) incommingMessage += (char)payload[i];

//   Serial.println("Message arrived [" + String(topic) + "]" + incommingMessage);

//   if (strcmp(topic, "/PTIT_Test/p/light") == 0) {
//     if (incommingMessage.equals("0") ) {

//       digitalWrite(14, LOW);
//     } else {

//       digitalWrite(14, HIGH);
//     }
//   }
// }

void reconnect()
{
    // Loop until we're reconnected
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);
        // Attempt to connect
        if (client.connect(clientId.c_str()))
        {
            Serial.println("Connected to " + clientId);
            // Once connected, publish an announcement...
            client.publish("/WL_QP/p/mqtt", "QP_Test");
            // ... and resubscribe

            client.subscribe("/WL_QP/p/water_level");
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            // Wait 5 seconds before retrying
            delay(5000);
        }
    }
}

void setup()
{
    Serial.begin(115200);
    setup_wifi();
    client.setServer(mqtt_server, 1883);
    // callback phát triển sau
    // client.setCallback(callback);
}

void loop()
{
    if (!client.connected())
    {
        reconnect();
    }
    client.loop();

    unsigned long now = millis();
    if (now - lastMsg > 2000)
    {
        lastMsg = now;
        // khoảng cách đến phao
        distance = ultrasonic.read();

        // chiều cao mực nước = chiều cao thiết bị - khoảng cách đo
        water_level_high = high_devide - distance;

        // send data to cloud
        String water_high_send_data = String(water_level_high, 2);

        String message = "Muc_nuoc_Nguyen_Trai : " + water_high_send_data;
        client.publish("/WL_QP/p/water_level", message.c_str());

        Serial.print("Water level high in Nguyen Trai sysout: ");
        Serial.println(water_high_send_data);
    }
}