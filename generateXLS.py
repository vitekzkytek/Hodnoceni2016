import pandas as pd
instdata = pd.read_excel('Institutions_Final.xlsx',sheet_name='JEDNOTKA')

data = pd.read_excel('RIV.xlsx',sheet_name='Sheet1')
data = data.drop(['JEDNICKA','IsEasternJournal','JrnArts1115'],axis=1)


d = {}
l= []
for predkl in instdata.Predkladatel_long.unique():
    d[predkl] = []
    for jednotka in instdata[instdata.Predkladatel_long == predkl].JEDNOTKA.unique():
        d[predkl].append(jednotka)
        l.append(jednotka)

len(l)



for jednotka in instdata.JEDNOTKA.unique():
    #Local results
    results = data[(data.JEDNOTKA == jednotka) & (data.IsCzechJournal) == True]
    writer = pd.ExcelWriter('xls/' +jednotka + '_Local.xlsx',engine='xlsxwriter')
    results.drop(['IsCzechJournal','IsPredatoryJournal'],axis=1).to_excel(writer,sheet_name='RIV',index=False)
    worksheet = writer.sheets['RIV']
    worksheet.set_column('E:E',35,None)
    worksheet.set_column('F:F',60,None)
    worksheet.set_column('H:H',40,None)

    # Predatory results
    results = data[(data.JEDNOTKA == jednotka) & (data.IsPredatoryJournal) == True]
    writer = pd.ExcelWriter('xls/' +jednotka + '_Predatory.xlsx',engine='xlsxwriter')
    results.drop(['IsCzechJournal','IsPredatoryJournal'],axis=1).to_excel(writer,sheet_name='RIV',index=False)
    worksheet = writer.sheets['RIV']
    worksheet.set_column('E:E',35,None)
    worksheet.set_column('F:F',60,None)
    worksheet.set_column('H:H',40,None)

    # All results
    results = data[data.JEDNOTKA == jednotka]
    writer = pd.ExcelWriter('xls/' +jednotka + '_All.xlsx',engine='xlsxwriter')
    results.drop(['IsCzechJournal','IsPredatoryJournal'],axis=1).to_excel(writer,sheet_name='RIV',index=False)
    worksheet = writer.sheets['RIV']
    worksheet.set_column('E:E',35,None)
    worksheet.set_column('F:F',60,None)
    worksheet.set_column('H:H',40,None)
