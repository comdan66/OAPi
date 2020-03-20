#!/usr/bin/env python3

import Adafruit_DHT
import time


sensor = Adafruit_DHT.DHT11

pin = 18

def destroy():
  pass

while True:
  try:
    hu, temp = Adafruit_DHT.read_retry(sensor, pin)
    print('temp:{0:0.1f} hu:{1}'.format(temp,hu))
    time.sleep(3)

  except RuntimeError as e:
    print("error\n{0}".format(e))

  except KeyboardInterrupt:
    destroy() 

