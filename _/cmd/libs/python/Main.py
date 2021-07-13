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

DB = None
DB_Connect = None

def log(data):
  global DB
  global DB_Connect

  if DB_Connect != None and DB != None:
    now = datetime.datetime.now()
    sql = genInsertSQL('LogSecond', data)
    try:
      DB_Connect.execute(sql)
      DB.commit()
    except:
      pass
  print(data)

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

def genInsertSQL(table, json): 
  keylist = []
  valuelist = []
  for key, value in json.items():
    keylist.append('`' + key + '`')
    if type(value) in (str, unicode):
      valuelist.append("'" + value + "'")
    else:
      valuelist.append(str(value))
  return 'INSERT INTO `' + table + '` (' + ', '.join(keylist) + ') VALUES (' + ', '.join(valuelist)  + ');'

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

def readCPUTemp():
  err, msg = commands.getstatusoutput('vcgencmd measure_temp')
  if not err:
    m = re.search(r'-?\d\.?\d*', msg)
    try:
      return float(m.group())
    except:
      return None

def readCPUVolts():
  err, msg = commands.getstatusoutput('vcgencmd measure_volts')
  if not err:
    m = re.search(r'-?\d\.?\d*', msg)
    try:
      return float(m.group())
    except:
      return None

def readPerson():
  return True if GPIO.input(PERSON_PORT) == 1 else False

def loop():
  global TimeCounter
  
  while True:
    now = datetime.datetime.now()
    LCD1602.write(0, 0, '{}/{}/{}'.format('{:02d}'.format(now.year), '{:02d}'.format(now.month), '{:02d}'.format(now.day)))
    LCD1602.write(2, 1, '{}:{}:{}'.format('{:02d}'.format(now.hour % 12), '{:02d}'.format(now.minute), '{:02d}'.format(now.second)))

    TimeCounter = (TimeCounter + 1) % 2
    if TimeCounter == 1:
      humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.DHT22, DHT_PORT)
      LCD1602.write(11, 0, '{0:0.1f}C'.format(temperature))
      LCD1602.write(11, 1, '{0:0.1f}%'.format(humidity))

      log({
        'temperature': round(temperature * 100) / 100,
        'humidity': round(humidity * 100) / 100,
        'pressure': round(Sensor2.read_pressure() * 100) / 100,
        'cpuTemp': round(readCPUTemp() * 100) / 100,
        'cpuVolt': round(readCPUVolts() * 10000) / 10000,
        'pir': 'yes' if readPerson() else 'no',
        'timeIndex': long('{:d}{:02d}{:02d}{:02d}{:02d}'.format(now.year, now.month, now.day, now.hour, now.minute)),
        'timeValue': int('{:d}'.format(now.second))
      })
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
