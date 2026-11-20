# Activity 9a: Mapping Sensors

Using the ultrasonic sensor to control LED brightness, the closer your hand is, the brighter the LED.

What I did:
- Set up the LED on pin 9 (PWM) and used analogWrite() to control brightness
- Changed the distance to 5 to 30 cm since that range works better on a desk than the full range
- Used map() with the output flipped (255 to 0) so that closer = brighter, then constrain() to keep it within 0 to 255
- Printed both distance and brightness to the Serial Monitor to check it was working

Things I struggled with:
- Picking a good distance range, too wide and the LED barely changes, too small and it just snaps between on and off
- Sensor noise makes the LED flicker a bit when your hand is held still
