create external table nithinmanne_project_stocks
    (id string, price DOUBLE)
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
WITH SERDEPROPERTIES ('hbase.columns.mapping' = ':key,price:price')
TBLPROPERTIES ('hbase.table.name' = 'nithinmanne_project_stocks');

insert overwrite table nithinmanne_project_stocks
select id, price from nithinmanne_project_stocks_csv;
