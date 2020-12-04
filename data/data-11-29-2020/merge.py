import glob
import csv

merged = {}
from collections import defaultdict as ddict
dates = ddict(int)
for f in glob.glob('*.csv'):
    s = f[:-4]
    with open(f) as fp:
        reader = csv.DictReader(fp, skipinitialspace=True)
        for row in reader:
            merged[f'{s}_{row["Date"]}'] = float(row['Close/Last'][1:])
            dates[row['Date']] += 1
with open('out/merged.csv', 'w', newline='') as fp:
    writer = csv.writer(fp)
    for i in merged:
        writer.writerow([i, merged[i]])

