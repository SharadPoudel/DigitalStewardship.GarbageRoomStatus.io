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
    

       # Calculate percentage for sensor 1
    if distance1 < 15:
        percentage1 = 100
    elif distance1 >= 150:
        percentage1 = 0
    else:
        percentage1 = 100 - ((distance1 - 50) / 150 * 100)
    percentage1 = round(percentage1)

    # Calculate percentage for sensor 2
    if distance2 < 15:
        percentage2 = 100
    elif distance2 >= 150:
        percentage2 = 0
    else:
        percentage2 = 100 - ((distance2 - 50) / 150 * 100)
    percentage2 = round(percentage2)
    
    print("Sensor 1 - Distance: {} cm".format(distance1))
    print("Sensor 1 - Percentage: {}%".format(percentage1))
    
    
    print("Sensor 2 - Distance: {} cm".format(distance2))
    print("Sensor 2 - Percentage: {}%".format(percentage2))

    # Publish distance and percentage to MQTT topics
    topic1 = "sensordata/sensor1"
    #message1 = "{} cm / {}%".format(distance1, percentage1)
    #topic1 = 1
    message1 = percentage1
    client.publish(topic1, message1)
    
    
    topic2 = "sensordata/sensor2"
    #message2 = "{} cm / {}%".format(distance2, percentage2)
    #topic2 = 2
    message2 = percentage2
    
    client.publish(topic2, message2)
    # just send the number of percentage decimal number zero - one or one to hundred.

    # Publish percentage to MQTT topics
     #topic1 = "sensordata/sensor1"
     #message1 = str(percentage1)
     #client.publish(topic1, message1)
     #topic2 = "sensordata/sensor2"
     #message2 = str(percentage2)
     #client.publish(topic2, message2)

    # Wait for 1 second
    time.sleep(1)