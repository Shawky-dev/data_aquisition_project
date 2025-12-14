const int pirPin = 5;   // PIR sensor output pin
const int ledPina = 9;   // LED pin
const int ledPinb = 10;

const int trigPin = 7;
const int echoPin = 6;

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(ledPina, OUTPUT);
  pinMode(ledPinb, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int val = digitalRead(pirPin);

  if (val == HIGH) {
    digitalWrite(ledPinb, LOW);
    digitalWrite(ledPina, HIGH);
    Serial.println("Motion detected!");

    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);

    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH);

    long distance = duration * 0.034 / 2; // convert to cm  

    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");



  } else {
    digitalWrite(ledPina, LOW);
    digitalWrite(ledPinb, HIGH);
    Serial.println("No motion.");
  }

  delay(100);
}