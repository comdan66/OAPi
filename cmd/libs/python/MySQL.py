#!/usr/bin/python 
# -*- coding: utf-8 -*-

import MySQLdb

# 連接 MySQL 資料庫

try:
  db = MySQLdb.connect(host="localhost", user="", passwd="", db="test")
  cursor = db.cursor()

  cursor.execute('')
  db.commit()
  db.close()
except Exception as e:
  print("GG", e)

