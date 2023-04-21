import paho.mqtt.client as mqtt
import time


import ssl


client = mqtt.Client("P1") #create new instance



# Connect to the MQTT broker

client.connect("10.204.0.70", 1883, 60)

while True:
    # Wait for 3 seconds
    time.sleep(3)
    
    
   # Publish the distance to the MQTT topic
    #client.publish("distance", str(distance))
    
    client.publish("house/bulbs/bulb1","OFF")
    
   