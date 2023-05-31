import RPi.GPIO as GPIO
import time
import paho.mqtt.client as mqtt

# Set up the GPIO pins
GPIO.setmode(GPIO.BOARD)
TRIG = 18
ECHO = 16
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

#Add a client name # Set the client details
client_name = "my-client"

#connect# Create a new MQTT client instance
client = mqtt.Client(client_name)


# Connect to the MQTT broker
client = mqtt.Client()
client.connect("localhost", 1883, 60)

while True:
    GPIO.output(TRIG,True)
    time.sleep(0.00001)
    
    GPIO.output(TRIG,False)
    while GPIO.input(ECHO)==0:
        pulse_start=time.time()
    
    while GPIO.input(ECHO)==1:
        pulse_end=time.time()
        
    pulse_duration=pulse_end-pulse_start
    distance=(pulse_duration*34000)/2
    
    distance=round(distance,2)
    print("distance:",distance,"cm")

    time.sleep(2)
    
    # Publish a message
    topic = "sensordata/topic"
    message = str(distance)
    client.publish(topic, message)

    #Publish the distance to the MQTT topic
    #client.publish("distance", str(distance))

    # Wait for 2 seconds
    time.sleep(1)
