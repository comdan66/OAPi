#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import Adafruit_DHT
import Adafruit_BMP.BMP085 as BMP085
import LCD1602
import time
import datetime
import threading

GPIO17 = 17
BMP085_Address = 0xA77
LCD1602_Address = 0x27

t = 0
h = 0
p = 0

def setup():
  global Sensor2
  Sensor2 = BMP085.BMP085(2, BMP085_Address)

  LCD1602.init(LCD1602_Address)
  LCD1602.clear()

def clock(event):
  while event.is_set():
    global h, t, p
    t = 0
    h = 0
    p = 0

    h, t = Adafruit_DHT.read_retry(Adafruit_DHT.DHT22, GPIO17)
    p = Sensor2.read_pressure()
    time.sleep(3)

def main():
  LCD1602.clear()

  running = threading.Event()
  running.set()

  thread = threading.Thread(target = clock, args = (running,))
  thread.start()

  try:

    while True:
      now = datetime.datetime.now()
      LCD1602.write(0, 0, '{}.{}.{}'.format('{:02d}'.format(now.year), '{:02d}'.format(now.month), '{:02d}'.format(now.day)))
      LCD1602.write(2, 1, '{} {} {}'.format('{:02d}'.format(now.hour % 12), '{:02d}'.format(now.minute), '{:02d}'.format(now.second)))
      
      LCD1602.write(11, 0, '{0:0.1f}C'.format(t) if t > 0 else '--.-C')
      LCD1602.write(11, 1, '{0:0.1f}%'.format(h) if h > 0 else '--.-%')

      time.sleep(0.5)
      LCD1602.write(4, 1, ':')
      LCD1602.write(7, 1, ':')
      time.sleep(0.5)

  except KeyboardInterrupt:
    running.clear()
    thread.join()

    LCD1602.clear()
    print('exit')

if __name__ =='__main__':
  try:
    setup()
    main()
  except:
    print("exit")
