import RPi.GPIO as GPIO
import time
#import paho.mqtt.client as mqtt


# Set up the GPIO pins
GPIO.setmode(GPIO.BOARD)


#trig_pins =[3,7,11,13,15,19,23,29,31,33,35,37]
#echo_pins =[5,8,10,16,18,21,24,26,32,36,38,40]
#Working sensors: S1,S2,S3,S4,S5..
trig_pins = [3,7,11,13,15]
echo_pins = [5,8,10,16,18]

def measure_distance(trig_pin, echo_pin):
    # Set the trigger pin as output and echo pin as input
    GPIO.setup(trig_pin, GPIO.OUT)
    GPIO.setup(echo_pin, GPIO.IN)
 
    # Set the trigger pin to LOW
    GPIO.output(trig_pin, GPIO.LOW)
    time.sleep(0.2)
 
    # Send a 10us pulse to the trigger pin
    GPIO.output(trig_pin, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(trig_pin, GPIO.LOW)
 
    # Wait for the echo pin to go high
    pulse_start = time.time()
    timestamp_start  = time.time()
    
    
    
    while GPIO.input(echo_pin) == GPIO.LOW:
        pulse_start = time.time()
        if (time.time()-timestamp_start) >= 0.5:
            return 0.01
    
    
    # Wait for the echo pin to go low
    pulse_end = time.time()
    timestamp_end  = time.time()
    while GPIO.input(echo_pin) == GPIO.HIGH:
        pulse_end = time.time()
        if (time.time()-timestamp_end) >= 0.5:
            return 0.01
 
    # Calculate the duration of the pulse
    pulse_duration = pulse_end - pulse_start
 
    # Speed of sound in air is approximately 343 meters/second
    # Divide by 2 to account for the round trip
    distance = (pulse_duration * 34300) / 2
    #why 34300 instead of 34000????
     
    time.sleep(0.2)
    return distance
"""
    # Calculate percentage for sensors
    if distance < 15:
        percentage = 100
    elif distance >= 150:
        percentage = 0
    else:
        percentage = 100 - ((distance - 50) / 150 * 100)
    percentage = round(percentage)

"""

 
try:
    while True:
        print("------------------------")
        for i in range(len(trig_pins)):
            distance = measure_distance(trig_pins[i], echo_pins[i])
            if distance <= 0.1:
                 print(f"Sensor {i+1}: Distance = FAILED")
            else:
                print(f"Sensor {i+1}: Distance = {distance:.2f} cm")
        time.sleep(1)

except KeyboardInterrupt:
    print("Measurement stopped by the user")
finally:
    GPIO.cleanup()
