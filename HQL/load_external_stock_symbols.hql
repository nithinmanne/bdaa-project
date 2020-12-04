-- Data from NASDAQTrader.com
CREATE EXTERNAL TABLE nithinmanne_project_stock_symbols_csv
    (ticker string, name STRING)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES (
   "separatorChar" = "\,",
   "quoteChar"     = "\""
)
STORED AS TEXTFILE
  location '/tmp/nithinmanne/project/stock_symbols';
