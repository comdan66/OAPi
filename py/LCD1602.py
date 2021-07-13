#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import time
import smbus

BUS = smbus.SMBus(1)

def __write(buf):
  BUS.write_byte(LCD_ADDR, buf)
  time.sleep(0.002)
  BUS.write_byte(LCD_ADDR, buf & 0xFB)

def __command(comm, sec = 0, setting = 0x0C):
  __write((comm & 0xF0)      | setting)
  __write((comm & 0x0F) << 4 | setting)
  if sec > 0: time.sleep(sec)

def init(addr = 0x27):
  global LCD_ADDR
  LCD_ADDR = addr

  try:
    # 初始指令
    __command(0x33, 0.005)
    __command(0x32, 0.005)
    __command(0x28, 0.005)
    __command(0x0C, 0.005)
    clear() # 清除畫面
    BUS.write_byte(LCD_ADDR, 0x07) # 關閉背光
    BUS.write_byte(LCD_ADDR, 0x08) # 開啟背光

  except: return False
  else:   return True

def clear():
  __command(0x01)

def close():
  BUS.close()

def write(x, y, str, light = True):
  if x <  0: x = 0
  if x > 15: x = 15
  if y <  0: y = 0
  if y >  1: y = 1

  __command(0x80 + 0x40 * y + x) # 移動游標

  for  chr  in  str:
    __command(ord(chr), 0, 0x0D if light else 0x05)