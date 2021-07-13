#!/usr/bin/python 
# -*- coding: utf-8 -*-

import MySQLdb
import datetime

def genInsertSQL(table, json): 
  keylist = []
  valuelist = []
  for key, value in jsondata.items():
    keylist.append('`' + key + '`')
    if type(value) in (str, unicode):
      valuelist.append("'" + value + "'")
    else:
      valuelist.append(str(value))
  return 'INSERT INTO `' + table + '` (' + ', '.join(keylist) + ') VALUES (' + ', '.join(valuelist)  + ');'



now = datetime.datetime.now()
jsondata = {
      'temperature': 10.2,
      'humidity': 11,
      'pressure': 12.3,
      'cpuTemp': 12,
      'cpuVolt': 0.32,
      'pir': 'yes' if True else 'no',
      'timeIndex': long('{:d}{:02d}{:02d}{:02d}{:02d}'.format(now.year, now.month, now.day, now.hour, now.minute)),
      'timeValue': '{:d}'.format(now.second)
    }

print(genInsertSQL('a', jsondata))



# 連接 MySQL 資料庫

# try:
#   db = MySQLdb.connect(host="localhost", user="", passwd="", db="test")
#   cursor = db.cursor()

#   cursor.execute('')
#   db.commit()
#   db.close()
# except Exception as e:
#   print("GG", e)

