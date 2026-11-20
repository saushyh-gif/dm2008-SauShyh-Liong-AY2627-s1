# Activity 8b: Sensor Check

Testing out the three sensors and reading their values in the Serial Monitor.

What I did:
- Phototransistor: reads light level on A0 (0 is dark, 1023 is bright)
- Force sensor: reads how hard it is pressed on A0
- Ultrasonic sensor: converts the raw reading into distance in cm and clamps it to 2 to 500 cm, printing it with a label

Things I struggled with:
- The readings jump around a lot, especially the ultrasonic one, so it was hard to tell what a "normal" value was
- Understanding the conversion from the raw 0 to 1023 value into actual centimetres
