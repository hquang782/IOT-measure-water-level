// // #include <WiFi.h>
// // #include <SocketIoClient.h>

// <<<<<<< HEAD
// // const char *ssid = "YourSSID";
// // const char *password = "YourPassword";
// // const char *serverAddress = "YourServerAddress";
// =======
// const char *ssid = "KPQ";
// const char *password = "honcairoicho";
// const char *serverAddress = "192.168.0.10";
// >>>>>>> e9cf2302d2085abe5b005b943fe109be51db52b9

// // SocketIoClient client;

// // void setup()
// // {
// //    Serial.begin(115200);
// //    delay(4000);

// //    WiFi.begin(ssid, password);
// //    while (WiFi.status() != WL_CONNECTED)
// //    {
// //       delay(1000);
// //       Serial.println("Connecting to WiFi...");
// //    }

// //    Serial.println("Connected to WiFi network");

// <<<<<<< HEAD
// //    client.begin(serverAddress);
// =======
//    client.begin(serverAddress, 3000, "/?transport=websocket");
// >>>>>>> e9cf2302d2085abe5b005b943fe109be51db52b9

// //    // Sending data to the server without the event handler
// //    client.emit("iotData", "{\"address\": \"example_address\", \"high\": 123}");
// // }

// // void loop()
// // {
// //    client.loop();
// //    delay(1000); // Wait for 1 second
// // }
