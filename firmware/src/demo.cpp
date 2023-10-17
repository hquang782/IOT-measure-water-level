#include <WiFi.h>
#include <SocketIoClient.h>

const char *ssid = "KPQ";
const char *password = "honcairoicho";
const char *serverAddress = "192.168.0.10";

SocketIoClient client;

void setup()
{
   Serial.begin(115200);
   delay(4000);

   WiFi.begin(ssid, password);
   while (WiFi.status() != WL_CONNECTED)
   {
      delay(1000);
      Serial.println("Connecting to WiFi...");
   }

   Serial.println("Connected to WiFi network");

   client.begin(serverAddress, 3000, "/?transport=websocket");

   // Sending data to the server without the event handler
   client.emit("iotData", "{\"address\": \"example_address\", \"high\": 123}");
}

void loop()
{
   client.loop();
   delay(1000); // Wait for 1 second
}
