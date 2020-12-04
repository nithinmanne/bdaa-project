create external table nithinmanne_project_stock_symbols
    (ticker string, name string)
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
WITH SERDEPROPERTIES ('hbase.columns.mapping' = ':key,stock:name')
TBLPROPERTIES ('hbase.table.name' = 'nithinmanne_project_stock_symbols');

insert overwrite table nithinmanne_project_stock_symbols
select ticker, name from nithinmanne_project_stock_symbols_csv;
