# Activity 8a:

First Arduino activity, getting LEDs to light up in different ways.

What I did:
- Type 2: on/off blinking on pin 13 using digitalWrite() and delay()
- Type 3: fading an LED on pin 9 using analogWrite(), flipping the fade direction when it hits 0 or 255
- Challenge: combined all three, one LED always on (wired straight to the 5V rail, no code), one blinking and one fading

Things I struggled with:
- The fade only works on PWM pins (the ones marked ~), so it didn't fade at first when I had it on the wrong pin
- In the challenge, the blink delays also slow down the fade since everything runs in the same loop, so the fade looks a bit choppy
- Getting the LED legs and resistor the right way round on the breadboard
