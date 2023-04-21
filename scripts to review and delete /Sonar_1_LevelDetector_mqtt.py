import RPi.GPIO as GPIO
import time
import paho.mqtt.client as mqtt

# GPIO pin configuration
TRIG_PIN = 18
ECHO_PIN = 16

# MQTT broker configuration
mqtt_broker_ip = "localhost"
mqtt_broker_port = 1883

# Initialize GPIO pins
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG_PIN, GPIO.OUT)
GPIO.setup(ECHO_PIN, GPIO.IN)
GPIO.setwarnings(False) 

# Initialize MQTT client
client = mqtt.Client()
client.connect(mqtt_broker_ip, mqtt_broker_port)

# Function to calculate distance
def calculate_distance():
    # Send ultrasonic pulse
    GPIO.output(TRIG_PIN, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIG_PIN, GPIO.LOW)
    
    # Wait for echo to be received
    pulse_start_time = time.time()
    while GPIO.input(ECHO_PIN) == 0:
        pulse_start_time = time.time()
        
    pulse_end_time = time.time()
    while GPIO.input(ECHO_PIN) == 1:
        pulse_end_time = time.time()
    
    # Calculate distance in cm
    pulse_duration = pulse_end_time - pulse_start_time
    distance = pulse_duration * 17150
    distance = round(distance, 2)
    
    return distance

# Read distance data and publish to MQTT broker
try:
    while True:
        distance_data = calculate_distance()
        client.publish("distance", str(distance_data))
except KeyboardInterrupt:
    print("Keyboard interrupt detected. Stopping the script.")

finally:
    GPIO.cleanup()
