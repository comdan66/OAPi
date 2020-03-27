#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

import time
import json
import sys
import random
import datetime
import os

logDir = '/Users/oa/www/log/'
nowTime = ''

def log(data):
  f = open('{}Sensor.log'.format(logDir), "w")
  f.write(json.dumps(data))
  f.close()

  global nowTime
  now = datetime.datetime.now()
  hourMin = '{}'.format('{:02d}'.format(now.minute), '{:02d}'.format(now.second))
  if nowTime != hourMin:
    f = open('{}{}{}{}.Sensor.log'.format(logDir, '{:02d}'.format(now.year), '{:02d}'.format(now.month), '{:02d}'.format(now.day)), "a")
    data['time'] = nowTime = hourMin
    data['now'] = int(time.time())
    f.write(json.dumps(data) + "\n")
    f.close()

def main():
  while True:
    log({
      'status': True if random.randint(0, 1) == 1 else False,
      'device1': {
        'humidity': 70.5 + random.uniform(0, 200) / 100,
        'temperature': 24.5 + random.uniform(0, 200) / 100,
      },
      'device2': {
        'pressure': 101238 + random.uniform(0, 100),
        'temperature': 24.5 + random.uniform(0, 200) / 100,
      },
      'cpu': {
        'temperature': 56 + random.uniform(0, 200) / 100,
        'voltage': 0.8438 + random.uniform(0, 100) / 1000
      }
    })
    time.sleep(1)

if __name__ == '__main__':
  try:
    main()

  except KeyboardInterrupt:
    print('destroy')