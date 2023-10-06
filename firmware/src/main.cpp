#include "BluetoothSerial.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to enable it
#endif

char dataBuffer[100];
float t;   // holds the temperature value
float h;   // holds the Humidity value
float t_f; // Nhiệt độ tính theo độ F

const char *openWeatherMapApiUrl = "http://api.openweathermap.org/data/2.5/weather?lat=20.9813695&lon=105.7803508&units=metric&appid=c04072091e7aaf8429080d6cb76364e0";
int interval = 1000; // virtual delay
unsigned long previousMillis = 0;
BluetoothSerial SerialBT;

void setup()
{
  Serial.begin(115200);
  SerialBT.begin("Quang"); // Bluetooth device name
  Serial.println("The device started, now you can pair it with Bluetooth!");
}

bool getWeatherData(const String &apiUrl, float &t, float &h)
{
  // Create an HTTP client object
  HTTPClient http;

  // Send the GET request to the API
  http.begin(apiUrl);

  // Check for a successful request
  int httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK)
  {
    String payload = http.getString();
    // Parse the JSON response
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);

    // Extract temperature and humidity data from the JSON
    t = doc["main"]["temp"].as<float>();
    h = doc["main"]["humidity"].as<float>();

    // Close the HTTP client
    http.end();

    return true;
  }
  else
  {
    // Handle error here
    http.end();
    return false;
  }
}

void update_temp_hum()
{
  t = random(10, 50);
  h = random(40, 100);
}
String msg = "";
char incomechar;
void loop()
{
  // unsigned long currentMillis = millis();  // Define currentMillis here

  // if (currentMillis - previousMillis >= interval) {
  update_temp_hum();
  // Format the data into the character array

  String temp = String(t, 3);
  String hum = String(h, 3);
  uint8_t buf1[temp.length()];
  uint8_t buf2[hum.length()];
  memcpy(buf1, temp.c_str(), temp.length());
  memcpy(buf2, hum.c_str(), hum.length());
  if (Serial.available())
  {
    char incomechar = SerialBT.read();
    if (incomechar != '\n')
    {
      msg += String(incomechar);
    }
    else
      msg = "";
    Serial.write(incomechar);
    if (msg == "hum")
    {
      SerialBT.write(buf2, hum.length());
    }
    else if (msg == "temp")
    {
      SerialBT.write(buf1, temp.length());
    }
  }
}
