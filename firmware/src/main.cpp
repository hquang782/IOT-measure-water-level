#include <WiFi.h>
#include <PubSubClient.h>
#include <Ultrasonic.h>
#include <Arduino.h>


// khai báo chân cảm biến khoảng cách, sử dụng thư viện ultrasonic cho tiện việc tính khoảng cách
Ultrasonic ultrasonic(13, 12); // trigger,echo

const char *ssid = "VDP";
const char *password = "12345678";
const char *mqtt_server = "mqtt-dashboard.com";

WiFiClient espClient;
PubSubClient client(espClient);


// topic setup
// topic 1 - infor send form devide:   "/WL_QP/p/water_level"
// topic 2 - controller status devide: "/C_QP/p/controller_status_devide/name"




unsigned long lastMsg = 0;

// khoảng cách 
float distance = 0;
// mực nước ngập
float water_level_high = 0;
// chiều cao thiết bị
float high_devide = 50;
//  trạng thái
String devideStatus = "active";
bool publishWaterLevel = true;  // Biến flag cho phép/ngừng publish cho topic "/WL_QP/p/water_level"

void setup_wifi()
{
    delay(10);
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

// Nhận controller từ webserver
void callback(char *topic, byte *payload, unsigned int length)
{
    String incomingMessage = "";
    for (int i = 0; i < length; i++)
        incomingMessage += (char)payload[i];

    Serial.println("Message arrived [" + String(topic) + "]" + incomingMessage);

    if (strcmp(topic, "/C_QP/p/controller_status_devide/Nguyen Trai") == 0)
    {
        Serial.println(incomingMessage);
        if (incomingMessage.equals("active"))
        {
            devideStatus = "active";
            publishWaterLevel = true;  // Bật lại khả năng publish cho topic "/WL_QP/p/water_level"
        }
        else
        {
            devideStatus = "inactive";
            publishWaterLevel = false;  // Tắt khả năng publish cho topic "/WL_QP/p/water_level"
        }
    }
}

void sendData()
{
    unsigned long now = millis();
    if (now - lastMsg > 2000)
    {
        lastMsg = now;
        distance = ultrasonic.read();
        water_level_high = high_devide - distance;

        if (publishWaterLevel)
        {
            String water_high_send_data = String(water_level_high, 2);
            String message = "{\"name\":\"Nguyen Trai\",\"high\": " + water_high_send_data + ",\"lat\":20.982378357449228,\"lng\":105.79034505069816,\"status\": \"" + String(devideStatus) + "\"}";
            client.publish("/WL_QP/p/water_level", message.c_str());

            Serial.print("Water level high in Nguyen Trai sysout: ");
            Serial.println(water_high_send_data);
        }
    }
}

void reconnect()
{
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);
        if (client.connect(clientId.c_str()))
        {
            Serial.println("Connected to " + clientId);
            client.publish("/WL_QP/p/mqtt", "QP_Test");
            client.subscribe("/WL_QP/p/water_level");
            client.subscribe("/C_QP/p/controller_status_devide/Nguyen Trai");
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void setup()
{
    Serial.begin(115200);
    setup_wifi();
    client.setServer(mqtt_server, 1883);
    client.setCallback(callback);
}

void loop()
{
    if (!client.connected())
    {
        reconnect();
    }
    client.loop();
    if (devideStatus.equals("active"))
    {
        sendData();
    }
    else
    {
        // Thiết lập cho trạng thái không publish khi thiết bị tắt
        publishWaterLevel = false;
    }
}

