#!/usr/bin/env python3

import re, commands

def check_CPU_temp():
    temp = None
    err, msg = commands.getstatusoutput('vcgencmd measure_temp')
    if not err:
        m = re.search(r'-?\d\.?\d*', msg)   # https://stackoverflow.com/a/49563120/3904031
        try:
            temp = float(m.group())
        except:
            pass
    return temp

def check_CPU_volts():
    volt = None
    err, msg = commands.getstatusoutput('vcgencmd measure_volts')
    if not err:
        m = re.search(r'-?\d\.?\d*', msg)   # https://stackoverflow.com/a/49563120/3904031
        try:
            volt = float(m.group())
        except:
            pass
    return volt

temp = check_CPU_temp()
volt = check_CPU_volts()
print temp, volt
