-- Data from NASDAQ
CREATE EXTERNAL TABLE nithinmanne_project_stocks_csv
    (id string, price DOUBLE)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES (
   "separatorChar" = "\,",
   "quoteChar"     = "\""
)
STORED AS TEXTFILE
  location '/tmp/nithinmanne/project/stocks';
