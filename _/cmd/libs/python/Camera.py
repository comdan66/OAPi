#!/usr/bin/python 
# -*- coding: utf-8 -*-

import picamera
import time
from fractions import Fraction

# 相機
# camera = picamera.PiCamera()
# time.sleep(2)
# camera.capture('aa.jpg')

# 錄影
# camera.start_recording('a.h264')
# camera.wait_recording(3)
# camera.stop_recording()


# 低光源
camera = picamera.PiCamera()
camera.resolution = (640, 480)
camera.framerate = Fraction(1, 6)
camera.shutter_speed = 6000000
camera.iso = 800
time.sleep(30)
camera.exposure_mode = 'off'
camera.capture('aa.jpg')

print('OK')