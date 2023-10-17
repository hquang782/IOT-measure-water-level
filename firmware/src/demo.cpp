#include <WiFi.h>
#include <SocketIoClient.h>

const char *ssid = "YourSSID";
const char *password = "YourPassword";
const char *serverAddress = "YourServerAddress";

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

   client.begin(serverAddress);

   // Sending data to the server without the event handler
   client.emit("iotData", "{\"address\": \"example_address\", \"high\": 123}");
}

void loop()
{
   client.loop();
   delay(1000); // Wait for 1 second
}
