Project
Naga Nithin Manne


This is a Stock Information Kafka Producer, which gets data from "https://marketstack.com/".
I choose the stock from my Hive table of the list of stocks. The information is the close stock
price for yesterday. So it wouldn't work on the days after holidays.

This producer writes to the kafka stream "nithinmanne_project_stock_reports", and
then the other program reads from the stream and pushes to HBase tables
"nithinmanne_project_stocks" and "nithinmanne_project_stocks_latest".

Both the Kafka stream, and the HBase table already has many entries and can be
verified. The entire pipeline can be run by simply executing both the jar files.
The only argument needed for both the programs is just the broker list.

Run Instructions:
spark-submit uber-project-backend-producer-1.0.jar <brokers>
N.B.: Since the main class is defined in the manifest, it need not be specified.
