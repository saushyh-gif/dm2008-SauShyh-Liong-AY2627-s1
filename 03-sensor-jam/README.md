# Sensor Jam (Activity 9b)

Builds on Activity 9a, using the ultrasonic sensor to control LED brightness.

What I did:
- Reused the 9a setup, ultrasonic sensor on A0 and LED on pin 9
- Refined the distance range to 5 to 30 cm so it reacts nicely to a hand moving above the sensor on a desk
- Mapped distance to brightness with map(), flipped so that moving closer makes the LED brighter
- Used constrain() and the Serial Monitor to check the values stay in range

Things I struggled with:
- The sensor sometimes picks up random readings, which makes the LED flicker
- Keeping the wiring neat when moving parts around on the breadboard
