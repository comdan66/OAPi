#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import Adafruit_BMP.BMP085 as BMP085
import Adafruit_DHT
import RPi.GPIO as GPIO
import time
import json
import sys
import re, commands

# 溫濕度
P27 = 27

# 紅外線
P17 = 17

sensor1 = Adafruit_DHT.DHT22
sensor2 = BMP085.BMP085(2)

GPIO.setmode(GPIO.BCM)
GPIO.setup(P17, GPIO.IN)

def read_dht22_dat():
  humidity, temperature = Adafruit_DHT.read_retry(sensor1, P27)

  return {
    'humidity': humidity,
    'temperature': temperature
  }

def read_i2c_BMP():
  return {
    'temperature': sensor2.read_temperature(),
    'pressure': sensor2.read_pressure()
  }

def check_CPU_temp():
    temp = None
    err, msg = commands.getstatusoutput('vcgencmd measure_temp')
    if not err:
        m = re.search(r'-?\d\.?\d*', msg)   # https://stackoverflow.com/a/49563120/3904031
        try:
            temp = float(m.group())
        except:
            pass
    return temp

def check_CPU_volts():
    volt = None
    err, msg = commands.getstatusoutput('vcgencmd measure_volts')
    if not err:
        m = re.search(r'-?\d\.?\d*', msg)   # https://stackoverflow.com/a/49563120/3904031
        try:
            volt = float(m.group())
        except:
            pass
    return volt

def read_has_person():
  if GPIO.input(P17) == 1:
    return True
  else:
    return False

def main():
  while True:
    device1 = read_dht22_dat()
    device2 = read_i2c_BMP()
    print(json.dumps({
      'status': read_has_person(),
      'device1': device1,
      'device2': device2,
      'cpu': {
        'temperature': check_CPU_temp(),
        'voltage': check_CPU_volts()
      }
    }))
    time.sleep(2.1)

def destroy():
  GPIO.cleanup()

if __name__ == '__main__':
  try:
    main()
  except KeyboardInterrupt:
    destroy() 
