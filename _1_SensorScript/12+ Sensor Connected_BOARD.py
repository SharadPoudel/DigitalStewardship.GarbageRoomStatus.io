import RPi.GPIO as GPIO
import time

# Define GPIO pin numbers for Trig and Echo pins
pin_mapping = {
    "Sensor 1": (2, 3),
    "Sensor 2": (4, 14),
    "Sensor 3": (17, 18),
    "Sensor 4": (27, 23),
    "Sensor 5": (22, 24),
    "Sensor 6": (10, 9),
    "Sensor 7": (11, 25),
    "Sensor 8": (5, 6),
    "Sensor 9": (6, 12),
    "Sensor 10": (13, 19),
    "Sensor 11": (19, 16),
    "Sensor 12": (26, 20),
    "Sensor 13": (14, 15)
}

# Set up GPIO mode and warnings
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Function to measure distance
def measure_distance(trig_pin, echo_pin):
    # Set the GPIO modes
    GPIO.setup(trig_pin, GPIO.OUT)
    GPIO.setup(echo_pin, GPIO.IN)

    # Trigger the sensor to send ultrasonic waves
    GPIO.output(trig_pin, True)
    time.sleep(0.00001)
    GPIO.output(trig_pin, False)

    # Measure the time it takes for the ultrasonic waves to return
    while GPIO.input(echo_pin) == 0:
        pulse_start = time.time()

    while GPIO.input(echo_pin) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start

    # Calculate distance in centimeters
    distance = pulse_duration * 17150
    distance = round(distance, 2)

    return distance

try:
    while True:
        for sensor, pins in pin_mapping.items():
            trig_pin, echo_pin = pins
            distance = measure_distance(trig_pin, echo_pin)
            print(f"{sensor}: {distance} cm")
        time.sleep(1) # sleep for 1 second. 

except KeyboardInterrupt:
    # Clean up GPIO on interruption
    GPIO.cleanup()

