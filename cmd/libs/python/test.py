#!/usr/bin/env python3

import time
import json
import sys

i = 0
def main():
  global i

  while True:
    i = i + 1
    print(json.dumps({
      'device1': {
        'humidity': 70.5,
        'temperature': 24.5,
      },
      'device2': {
        'pressure': 101238,
        'temperature': 24.5,
      }
    }))
    time.sleep(1)


if __name__ == '__main__':
  try:

    main()

  except KeyboardInterrupt:
    print('destroy')