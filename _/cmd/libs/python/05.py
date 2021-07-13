#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import time
import os
import argparse
import picamera


parser = argparse.ArgumentParser()
parser.add_argument('--count', action='store', dest='count', help='Number of pictures to be taken. if not specified, set to 150 pictures.')
parser.add_argument('--timelapse', action='store', dest='timelapse', help='Takes a picture every <tl>ms. If not specified, set to 3 seconds.')
parser.add_argument('--output', action='store', dest='output', help="Output directory. If not specified, set to current directory.")
parser.add_argument('--width', action='store', dest='width', help='Set image width <size>. If not specified, set to 320.')
parser.add_argument('--height', action='store', dest='height', help='Set image height <size>. If not specified, set to 240.')
args = parser.parse_args()


count = 150
timelapse = 3000
output = '.'
width = 320
height = 240

if args.count:
  count = int(args.count)
if args.timelapse:
  timelapse = int(args.timelapse)
if args.output:
  output = args.output
if args.width:
  width = int(args.width)
if args.height:
  height = int(args.height)

print(count, timelapse, output, width, height)


current_count=1
 
camera = picamera.PiCamera()
time.sleep(2)
try:
  while current_count <= count:
    camera.resolution = (width, height)
    camera.capture('{}/{:012d}.jpg'.format(output, current_count))

    # command = 'fswebcam -r {}x{} --save {}/{:012d}.jpg'.format(width, height, output, current_count)
    print('create pic({}/{})'.format(current_count, count))
    # os.system(command)
    current_count += 1
    time.sleep(timelapse / 1000)
except KeyboardInterrupt:
    print('停止抓取畫面')
 
# command = 'gst-launch-1.0 multifilesrc location={}/%012d.jpg index=1 caps="image/jpeg,framerate=30/1" ! jpegdec ! omxh264enc ! avimux ! filesink location={}/timelapse.h264'.format(output, output)
# os.system(command)
