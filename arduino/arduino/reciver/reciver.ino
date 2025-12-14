String Mymessage;

void setup() {
  Serial.begin(9600);
}

void loop() {
  if (Serial.available()) {
    Mymessage = Serial.readStringUntil('\n');
    Serial.println(Mymessage);
  }
}
