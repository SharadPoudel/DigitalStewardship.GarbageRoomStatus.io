import RPi.GPIO as GPIO
import time
import os
#import paho.mqtt as mqtt
import paho.mqtt.client as mqtt

# Code for Communication to Database 5-13, 88-..
client_name = "my-client"
client = mqtt.Client(client_name)

# Connect to the MQTT broker
client.connect("localhost", 1883, 60)

# Set up the GPIO pins
GPIO.setmode(GPIO.BOARD)

trig_pins = [3, 7, 11, 13, 15, 19, 23, 29, 31, 33, 35]
echo_pins = [5, 8, 10, 16, 18, 21, 24, 26, 32, 36, 38]



# Initialize percentage variables
percentage12 = 0
percentage13 = 0
percentage14 = 0
percentage15 = 0
percentage16 = 0
percentage17= 0
percentage18 = 0
percentage19 = 0
percentage20= 0
percentage21 = 0
percentage22 = 0

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
    timestamp_start = time.time()

    while GPIO.input(echo_pin) == GPIO.LOW:
        pulse_start = time.time()
        if (time.time() - timestamp_start) >= 0.5:
            return 0.01

    # Wait for the echo pin to go low
    pulse_end = time.time()
    timestamp_end = time.time()
    while GPIO.input(echo_pin) == GPIO.HIGH:
        pulse_end = time.time()
        if (time.time() - timestamp_end) >= 0.5:
            return 0.01

    # Calculate the duration of the pulse
    pulse_duration = pulse_end - pulse_start

    # Speed of sound in air is approximately 343 meters/second
    # Divide by 2 to account for the round trip
    distance = (pulse_duration * 34300) / 2

    time.sleep(0.2)
    return distance

try:
    while True:
        print("------------------------")

        for i in range(len(trig_pins)):
            distance = measure_distance(trig_pins[i], echo_pins[i])
            sensorID = i + 12

            if i == 9:
                distance = distance + 8
                sensorID = 21

            if distance <= 0.1:
                print(f"{sensorID}: Distance = FAILED")
            else:
                # Calculate percentage for sensors
                if distance < 45:
                    percentage = 100
                elif distance >= 115:
                    percentage = 0
                else:
                    percentage = 100 - ((distance - 26) / 150 * 100)
                percentage = round(percentage)
                print(f"{sensorID}: Distance = {distance:.2f} cm Percentage = {percentage:.2f}")

                # Assign percentage values to respective variables
                if sensorID == 12:
                    percentage12 = percentage
                elif sensorID == 13:
                    percentage13 = percentage
                elif sensorID == 14:
                    percentage14 = percentage
                elif sensorID == 15:
                    percentage15 = percentage
                elif sensorID == 16:
                    percentage16 = percentage
                elif sensorID == 17:
                    percentage17 = percentage
                elif sensorID == 18:
                    percentage18 = percentage
                elif sensorID == 19:
                    percentage19 = percentage
                elif sensorID == 20:
                    percentage20 = percentage
                elif sensorID == 21:
                    percentage21 = percentage
                elif sensorID == 22:
                    percentage22 = percentage

        time.sleep(10)

        # Publish data for 11 sensors
        sensor_data = {
            "sensor12": percentage12,
            "sensor13": percentage13,
            "sensor14": percentage14,
            "sensor15": percentage15,
            "sensor16": percentage16,
            "sensor17": percentage17,
            "sensor18": percentage18,
            "sensor19": percentage19,
            "sensor20": percentage20,
            "sensor21": percentage21,
            "sensor22": percentage22
        }

        for sensor, percentage in sensor_data.items():
            topic = "sensordata/" + sensor
            message = str(percentage)  # Convert percentage to string if necessary
            client.publish(topic, message)
            client.loop()

except KeyboardInterrupt:
    print("Measurement stopped by the user")
finally:
    GPIO.cleanup()