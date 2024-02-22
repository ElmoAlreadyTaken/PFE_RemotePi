#include "remotePi.h"

unsigned long startTime; // Variable to store the start time


const int ROBOT_ID = -1;
String BOARD_TYPE = "Esp32";


remotePi::remotePi(const char* ssid, const char* password, const char* serverAddress) 
    : ssid(ssid), password(password), serverAddress(serverAddress), ROBOT_ID(-1) {}  // Initialize ROBOT_ID in constructor

void remotePi::begin() {
    startTime = millis(); // Record the start time
    setupWiFi();
    setupServer();
    requestRobotId();  
    startCamera();
}

void remotePi::stop() {
    
    running = false; // Mettre à jour la variable running pour arrêter le programme
    stopCamera();
    sendUnregister();   
    unsigned long currentTime = millis(); // Get the current time
    Serial.print("Execution time: ");
    Serial.print(currentTime); // Print the execution time
    Serial.println(" milliseconds");
  
    while (true) {
        handleClient();
    }
}

void remotePi::setupWiFi() {
    WiFi.mode(WIFI_AP_STA);
    WiFi.begin(ssid, password);
    while (WiFi.waitForConnectResult() != WL_CONNECTED) {
        Serial.println("WiFi failed, retrying.");
        delay(500);
    }
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void remotePi::setupServer() {
    httpUpdater.setup(&httpServer);
    httpServer.begin();
    Serial.println("HTTP Server started");
}


void remotePi::handleClient() {
    httpServer.handleClient();
    MDNS.update();
}

void remotePi::sendLog(String message) {
    if (WiFi.status() == WL_CONNECTED) {
        StaticJsonDocument<200> jsonDocument;
        jsonDocument["id"] = ROBOT_ID;
        jsonDocument["message"] = message;
        sendToServer("/log", jsonDocument); // Specify endpoint for logging
    }
}

void remotePi::startCamera() {
    if (WiFi.status() == WL_CONNECTED) {
        StaticJsonDocument<200> jsonDocument;
        jsonDocument["command"] = "start";
        sendToServer("/camera", jsonDocument); // Specify endpoint for logging
    }
}

void remotePi::stopCamera() {
    if (WiFi.status() == WL_CONNECTED) {
        StaticJsonDocument<200> jsonDocument;
        jsonDocument["command"] = "stop";
        sendToServer("/camera", jsonDocument); // Specify endpoint for logging
    }
}

void remotePi::sendErrorLog(String errorMessage) {
    if (WiFi.status() == WL_CONNECTED) {
        StaticJsonDocument<200> jsonDocument;
        jsonDocument["error"] = errorMessage;
        sendToServer("/log", jsonDocument); // Specify endpoint for error logging
    }
}

void remotePi::requestRobotId() {
    if (WiFi.status() == WL_CONNECTED) {
        StaticJsonDocument<200> jsonDocument;
        jsonDocument["board"] = BOARD_TYPE;
        jsonDocument["ip"] = WiFi.localIP();
        jsonDocument["reserved"] = true;
        sendToServer("/register", jsonDocument); // Specify endpoint for requesting robot ID
    }
}

void remotePi::sendUnregister() {
    if (WiFi.status() == WL_CONNECTED) {
        StaticJsonDocument<200> jsonDocument;
        jsonDocument["id"] = ROBOT_ID;
        sendToServer("/unregister", jsonDocument); // Specify endpoint for logging
    }
}

void remotePi::sendToServer(String endpoint, StaticJsonDocument<200> jsonDocument) {
    HTTPClient http;
    WiFiClient client;
    Serial.print("Connecting to server: ");
    Serial.println(serverAddress + endpoint);
    http.begin(client, serverAddress + endpoint); // Construct full URL with endpoint
    http.addHeader("Content-Type", "application/json");  // Set content type to JSON

    // Serialize JSON to a string
    String jsonString;
    serializeJson(jsonDocument, jsonString);

    int httpResponseCode = http.POST(jsonString);

    if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        if (endpoint == "/register") {
            String payload = http.getString();
            handleRobotIdResponse(payload);
        }
    } else {
        Serial.print("HTTP POST failed, error: ");
        Serial.println(httpResponseCode);
    }

    http.end();
}

void remotePi::handleRobotIdResponse(String response) {
    
    DynamicJsonDocument doc(200);
    deserializeJson(doc, response);
    ROBOT_ID = doc["id"];  // Assign new value to ROBOT_ID
    Serial.print("Robot ID received: ");
    Serial.println(ROBOT_ID);
}
