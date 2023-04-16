import paho.mqtt.client as mqtt

# Create a new MQTT client instance
client = mqtt.Client()

# Set the username and password for the client
client.username_pw_set("your_username", "your_password")

# Connect to the MQTT broker with the specified host, port, and keepalive
client.connect("mqtt.example.com", 1883, 60)

# Start the MQTT client loop
client.loop_forever()
