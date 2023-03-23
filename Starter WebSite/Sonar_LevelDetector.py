import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BOARD)
TRIG=18
ECHO=16

GPIO.setup(TRIG,GPIO.OUT)
GPIO.setup(ECHO,GPIO.IN)

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
    
    if distance <=5:
        print("Full.")
        
    if distance >= 10 and distance <=25:
        print("Mid-Full")
    
    if distance >25:
        print("Empty")
        
        
        