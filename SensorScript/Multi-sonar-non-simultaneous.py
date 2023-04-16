import RPi.GPIO as GPIO
import time

# Set GPIO pins
GPIO.setmode(GPIO.BCM)

# Define GPIO pins for each sensor
trig_pins = [18, 15]
echo_pins = [16, 22]

# Set up GPIO pins
for i in range(2):
    GPIO.setup(trig_pins[i], GPIO.OUT)
    GPIO.setup(echo_pins[i], GPIO.IN)

# Function to measure distance
def measure_distance(trig_pin, echo_pin):
    # Set trigger pin to HIGH for 10 microseconds
    GPIO.output(trig_pin, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(trig_pin, GPIO.LOW)
    
    # Wait for echo pin to go HIGH
    while GPIO.input(echo_pin) == 0:
        pulse_start = time.time()
    
    # Wait for echo pin to go LOW
    while GPIO.input(echo_pin) == 1:
        pulse_end = time.time()
        
    # Calculate pulse duration and distance
    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    distance = round(distance, 2)
    
    return distance

# Loop to measure distances
while True:
    for i in range(2):
        distance = measure_distance(trig_pins[i], echo_pins[i])
        print("Distance from sensor {}: {} cm".format(i+1, distance))
    time.sleep(1)
