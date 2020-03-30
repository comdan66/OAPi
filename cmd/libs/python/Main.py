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
import MySQLdb
import os

# 溫度 濕度
DHT_PORT = 17

# 紅外線
PERSON_PORT = 27

# 溫度 氣壓
A77 = 0x77

# LCD 螢幕
A27 = 0x27

# 時間計數器
TimeCounter = 0


lastMinu  = None
lastHour = None
lastDate  = None

DB = None
DB_Connect = None

def genDB():
  path = os.path.dirname(os.path.dirname(__file__)).split(os.path.sep)
  path.pop()
  path.append('config')
  path.append('mysql.json')
  path = os.path.sep.join(path)

  with open(path) as file:
    data = json.load(file)
  
  if 'db1' in data: 
    return (data['db1']['host'], data['db1']['user'], data['db1']['password'], data['db1']['database'])
  else:
    return None

def log(dhtTemp, dhtHumidity, bmpTemp, bmpPress, cpuTemp, cpuVolt, pir):
  global DB
  global DB_Connect

  if DB_Connect != None and DB != None:
    now = datetime.datetime.now()
    sql = 'INSERT INTO `LogSecond`(`dhtTemp`, `dhtHumidity`, `bmpTemp`, `bmpPress`, `cpuTemp`, `cpuVolt`, `pir`, `timeIndex`, `timeValue`) VALUES ({:0.2f}, {:0.2f}, {:0.2f}, {:0.2f}, {:0.2f}, {:0.3f}, "{}", {:d}{:02d}{:02d}{:02d}{:02d}, {:02d});'.format(round(dhtTemp, 2), round(dhtHumidity, 2), round(bmpTemp, 2), round(bmpPress, 2), round(cpuTemp, 2), round(cpuVolt, 3), 'yes' if pir else 'no', now.year, now.month, now.day, now.hour, now.minute, now.second)
    try:
      DB_Connect.execute(sql)
      DB.commit()
    except:
      pass
    
  print(dhtTemp, dhtHumidity, bmpTemp, bmpPress, cpuTemp, cpuVolt, pir)

def setup():
  global DB
  global DB_Connect
  global Sensor2
  Sensor2 = BMP085.BMP085(2, A77)
  LCD1602.init(A27, 1)
  LCD1602.clear()
  GPIO.setmode(GPIO.BCM)
  GPIO.setup(PERSON_PORT, GPIO.IN)
  
  try:
    host, user, passwd, db = genDB()
    DB = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
    DB_Connect = DB.cursor()
  except Exception as e:
    DB = None

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
  global TimeCounter
  
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

    TimeCounter = (TimeCounter + 1) % 2
    if TimeCounter == 1:
      humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.DHT22, DHT_PORT)
      LCD1602.write(11, 0, '{0:0.1f}C'.format(temperature))
      LCD1602.write(11, 1, '{0:0.1f}%'.format(humidity))

    log(
      temperature, humidity,
      Sensor2.read_temperature(), Sensor2.read_pressure(),
      readCPUTemp(), readCPUVolts(),
      readPerson()
    )
    time.sleep(1)

def destroy():
  global DB
  if DB != None:
    DB.close()
  GPIO.cleanup()

if __name__ == "__main__":
  try:
    setup()
    loop()
  except KeyboardInterrupt:
    destroy()
