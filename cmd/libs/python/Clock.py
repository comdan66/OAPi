#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import Adafruit_BMP.BMP085 as BMP085
import Adafruit_DHT
import RPi.GPIO as GPIO
import LCD1602
import time
import datetime
import json
import re, commands

# 溫度 濕度
DHT_PORT = 17

# 紅外線
PERSON_PORT = 27

# 溫度 氣壓
A77 = 0x77

# LCD 螢幕
A27 = 0x27


def setup():
  global Sensor2
  Sensor2 = BMP085.BMP085(2, A77)
  LCD1602.init(A27, 1)
  GPIO.setmode(GPIO.BCM)
  GPIO.setup(PERSON_PORT, GPIO.IN)


TimeI = 0

def readCPUTemp():
  temp = None
  err, msg = commands.getstatusoutput('vcgencmd measure_temp')
  if not err:
    m = re.search(r'-?\d\.?\d*', msg)
    try:
      temp = float(m.group())
    except:
      pass
  return temp

def readCPUVolts():
  volt = None
  err, msg = commands.getstatusoutput('vcgencmd measure_volts')
  if not err:
    m = re.search(r'-?\d\.?\d*', msg)
    try:
      volt = float(m.group())
    except:
      pass
  return volt

def readPerson():
  if GPIO.input(PERSON_PORT) == 1:
    return True
  else:
    return False

def loop():
  global TimeI
  
  while True:
    now = datetime.datetime.now()
    LCD1602.write(0, 0, '{}/{}/{}'.format(
      '{:02d}'.format(now.year),
      '{:02d}'.format(now.month),
      '{:02d}'.format(now.day)))
    LCD1602.write(2, 1, '{}:{}:{}'.format(
      '{:02d}'.format(now.hour % 12),
      '{:02d}'.format(now.minute),
      '{:02d}'.format(now.second)))

    TimeI = (TimeI + 1) % 2
    if TimeI == 1:
      humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.DHT22, DHT_PORT)
      LCD1602.write(11, 0, '{0:0.1f}C'.format(temperature))
      LCD1602.write(11, 1, '{0:0.1f}%'.format(humidity))
    
    
    print(json.dumps({
      'status': readPerson(),
      'device1': {
        'humidity': humidity,
        'temperature': temperature
      },
      'device2': {
        'temperature': Sensor2.read_temperature(),
        'pressure': Sensor2.read_pressure()
      },
      'cpu': {
        'temperature': readCPUTemp(),
        'voltage': readCPUVolts()
      }
    }))

    time.sleep(1)


def destroy():
  GPIO.cleanup()

if __name__ == "__main__":
  try:
    setup()
    loop()
    # while True:
      # pass
  except KeyboardInterrupt:
    destroy()
