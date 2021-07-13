#!/usr/bin/python 
# -*- coding: utf-8 -*-

import cv2
import sys

imagePath = sys.argv[1]
image = cv2.imread(imagePath)

cv2.imshow('preview', image)
cv2.waitkey(0)
cv2.destroyAllwindows(0)