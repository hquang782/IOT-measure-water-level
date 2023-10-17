#include <WiFi.h>
#include <SocketIoClient.h>

/////////////////////////////////////
////// USER DEFINED VARIABLES //////
///////////////////////////////////
/// WIFI Settings ///
const char *ssid = "KPQ";
const char *password = "honcairoicho";

/// Socket.IO Settings ///
char host[] = "192.168.0.10";                    // Socket.IO Server Address
int port = 3000;                                 // Socket.IO Port Address
char path[] = "/socket.io/?transport=websocket"; // Socket.IO Base Path

/////////////////////////////////////
////// ESP32 Socket.IO Client //////
///////////////////////////////////

SocketIoClient webSocket;
WiFiClient client;

void socket_Connected(const char *payload, size_t length)
{
   Serial.println("Socket.IO Connected!");
   char *message = "ahiihi";
   webSocket.emit("status", message);
}

void socket_event(const char *payload, size_t length)
{
   Serial.print("got message: ");
   Serial.println(payload);
}



void setup()
{
   Serial.begin(115200);
   delay(10);

   // We start by connecting to a WiFi network

   Serial.println();
   Serial.println();
   Serial.print("Connecting to ");
   Serial.println(ssid);

   WiFi.begin(ssid, password);

   while (WiFi.status() != WL_CONNECTED)
   {
      delay(500);
      Serial.print(".");
   }

   Serial.println("");
   Serial.println("WiFi connected");
   Serial.println("IP address: ");
   Serial.println(WiFi.localIP());

   // Setup 'on' listen events
   webSocket.on("connect", socket_Connected);
   webSocket.on("event", socket_event);
   webSocket.begin(host, port);
}

void loop()
{
   webSocket.loop();
}