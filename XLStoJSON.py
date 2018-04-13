import pandas as pd
import json
data = pd.read_excel('Institutions_Final.xlsx',sheet_name='JEDNOTKA')


### DROPDOWNLIST MENU JSON
# see https://select2.org/data-sources/formats

d = {}
i = 1

s0 = 'var menudata = '
l = []

for predkl in data.Predkladatel_long.unique():
    d2 = {}
    d2['text'] = predkl
    d2['id'] = data[data.Predkladatel_long == predkl].iloc[0,0]
    d2['children'] = []
    #d[predkl] = []#data[data.Predkladatel_long == predkl].to_dict(orient='index')
    for inst in data[data.Predkladatel_long == predkl].JEDNOTKA:
        d3 = {}
        d3['id'] = i
        d3['text'] = inst
        #d[predkl].append(inst)
        d2['children'].append(d3)
        i += 1

    l.append(d2)

with open('ddl.js', 'w', encoding='utf-8') as f:
    f.write(s0 + str(json.dumps(l,ensure_ascii=False)))





### lIST OF INSTITUTIONS FOR D3 SCATTER.JS SCRIPT
data = pd.read_excel('Institutions_Final.xlsx',sheet_name='JEDNOTKA')

s0 = 'var institutions = '
s = data.to_json(orient='index',force_ascii=False)

with open('institutions.js','w',encoding='utf-8') as f:
    f.write(str(s0 + s))
