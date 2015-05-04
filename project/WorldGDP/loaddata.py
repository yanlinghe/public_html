# -*- coding: utf-8 -*-
"""
Created on Fri May 01 16:07:37 2015

@author: yx1992
"""

import csv
import string
import sys

#GDP, PPP (current international $)
GDPstring="NY.GDP.MKTP.CD"
fout=open("GDP.txt",'w')
table=[]
with open("./WDI_csv/WDI_Data.csv",'r') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    head=None
    minj=2014
    for row in spamreader:
        if head==None:
            head=row
        else:
            if row[3]==GDPstring:
                line=row[0]+","+row[1]
                for j in range(size(row)-4):
                    entry=row[j+4]
                    if entry=="":
                        entry="0"
                    line=line+","+entry
                line=line+"\n"
                print row
                print line
                fout.write(line)
fout.close()
print minj
                
        