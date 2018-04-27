import pandas as pd
import json

### DROPDOWNLIST MENU JSON
# see https://select2.org/data-sources/formats
data = pd.read_excel('Institutions_Final.xlsx',sheet_name='JEDNOTKA')

data.Predkladatel_long.unique()

d = {}
i = 1

s0 = 'var menudata = '
l = []

for predkl in data.Predkladatel_long.unique():
    d2 = {}
    d2['text'] = str(predkl)
    d2['id'] = str(data[data.Predkladatel_long == predkl].iloc[0,0])
    d2['children'] = []
    #d[predkl] = []#data[data.Predkladatel_long == predkl].to_dict(orient='index')
    for index,row in data[data.Predkladatel_long == predkl].iterrows():
        d3 = {}
        d3['id'] = str(row.ID)
        d3['text'] = str(row.JEDNOTKA)
        d3['included'] = str(row.Included)
        #d[predkl].append(inst)
        d2['children'].append(d3)
        i += 1

    l.append(d2)

with open('ddldata.js', 'w', encoding='utf-8') as f:
    f.write(s0 + str(json.dumps(l,ensure_ascii=False)))





### lIST OF INSTITUTIONS FOR D3 SCATTER.JS SCRIPT
data = pd.read_excel('Institutions_Final.xlsx',sheet_name='JEDNOTKA')
data = data[data.Included == True]
s0 = 'var institutions = '
s = data.to_json(orient='index',force_ascii=False)

with open('institutions.js','w',encoding='utf-8') as f:
    f.write(str(s0 + s))
