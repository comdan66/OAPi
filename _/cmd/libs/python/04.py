#!/usr/bin/env python3
import RPi.GPIO as GPIO
import time

DHTPIN = 17

GPIO.setmode(GPIO.BCM)
GPIO.setup(DHTPIN, GPIO.IN)

def main():
  while True:
    i = GPIO.input(DHTPIN)
    print(i)
    time.sleep(1)

def destroy():
  GPIO.cleanup()

if __name__ == '__main__':
  try:
    main()
  except KeyboardInterrupt:
    destroy() 
