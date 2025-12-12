void setup() {
  Serial.begin(9600);   // Match this in Node.js
}

void loop() {
  // Send data to Node.js
  Serial.println("Hello from Arduino");
  delay(1000);

  // Receive data from Node.js
  if (Serial.available() > 0) {
    String msg = Serial.readStringUntil('\n');
    Serial.print("Received: ");
    Serial.println(msg);
  }
}
