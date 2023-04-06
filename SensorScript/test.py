import paho.mqtt.client as mqtt

# Set the broker details
broker_address = "localhost"
broker_port = 1883

# Set the client details
client_name = "my-client"

# Create a new MQTT client instance
client = mqtt.Client(client_name)

# Connect to the broker
client.connect(broker_address, broker_port)

# Publish a message
topic = "my/topic"
message = "Hello, world!"
client.publish(topic, message)

# Disconnect from the broker
client.disconnect()
