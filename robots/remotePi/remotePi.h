#ifndef remotePi_h
#define remotePi_h

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPUpdateServer.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <ESP8266mDNS.h>

class remotePi {
public:
    remotePi(const char* ssid = "", const char* password = "", const char* serverAddress = "http://xx.xx.xx.xx:5000");
    void begin();
    void handleClient();
    void sendLog(String message);
    void sendErrorLog(String errorMessage);
    void sendRegister();
    void sendUnregister();
    //void stop();
    void startCamera();
    void stopCamera();
    bool isRunning(); // Ajout d'une méthode pour vérifier si le programme est en cours d'exécution
    void stop(); // Modified stop function declaration

private:
    void setupWiFi();
    void setupServer();
    void requestRobotId();
    void sendToServer(String endpoint, StaticJsonDocument<200> jsonDocument);
    void handleRobotIdResponse(String response);

    int ROBOT_ID;
    bool running; // Ajout de la variable booléenne running


    const char* ssid;
    const char* password;
    const char* serverAddress;
    ESP8266WebServer httpServer{80};
    ESP8266HTTPUpdateServer httpUpdater;
};

#endif
