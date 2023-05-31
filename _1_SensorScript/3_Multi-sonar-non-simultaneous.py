import RPi.GPIO as GPIO
import time
import paho.mqtt.client as mqtt

# Set up the GPIO pins
GPIO.setmode(GPIO.BOARD)
TRIG1 = 18
ECHO1 = 16
TRIG2 = 15
ECHO2 = 22
GPIO.setup(TRIG1, GPIO.OUT)
GPIO.setup(ECHO1, GPIO.IN)
GPIO.setup(TRIG2, GPIO.OUT)
GPIO.setup(ECHO2, GPIO.IN)

# Add a client name and set the client details
client_name = "my-client"
client = mqtt.Client(client_name)

# Connect to the MQTT broker
client.connect("localhost", 1883, 60)

while True:
    # Measure distance for sensor 1
    GPIO.output(TRIG1, True)
    time.sleep(0.00001)
    GPIO.output(TRIG1, False)
    while GPIO.input(ECHO1) == 0:
        pulse_start = time.time()
    while GPIO.input(ECHO1) == 1:
        pulse_end = time.time()
    pulse_duration = pulse_end - pulse_start
    distance1 = (pulse_duration * 34000) / 2
    distance1 = round(distance1, 2)
    print("Sensor 1 - Distance: {} cm".format(distance1))

    # Calculate percentage for sensor 1
    percentage1 = 100 - ((distance1 - 50) / (200 - 50)) * 100
    percentage1 = round(percentage1, 0)

    # Publish distance and percentage to MQTT topics for sensor 1
    topic1 = "sensordata/sensor1"
    message1 = "{} cm / {}%".format(distance1, percentage1)
    client.publish(topic1, message1)

    # Wait for 1 second
    time.sleep(3)

    # Measure distance for sensor 2
    GPIO.output(TRIG2, True)
    time.sleep(0.00001)
    GPIO.output(TRIG2, False)
    while GPIO.input(ECHO2) == 0:
        pulse_start = time.time()
    while GPIO.input(ECHO2) == 1:
        pulse_end = time.time()
    pulse_duration = pulse_end - pulse_start
    distance2 = (pulse_duration * 34000) / 2
    distance2 = round(distance2, 2)
    print("Sensor 2 - Distance: {} cm".format(distance2))

    # Calculate percentage for sensor 2
    percentage2 = 100 - ((distance2 - 50) / (200 - 50)) * 100
    percentage2 = round(percentage2, 0)

    # Publish distance and percentage to MQTT topics for sensor 2
    topic2 = "sensordata/sensor2"
    message2 = "{} cm / {}%".format(distance2, percentage2)
    client.publish(topic2, message2)

    # Wait for 1 second
    time.sleep(3)
#the code measures the distance for sensor 1,
#calculates the percentage, publishes the data to MQTT, and then
#repeats the same steps for sensor 2. The delay between measurements
#can be adjusted by changing the sleep duration in the code as per the need.