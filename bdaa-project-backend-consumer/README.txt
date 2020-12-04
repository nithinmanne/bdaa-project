Project
Naga Nithin Manne


This is a Stock Information Kafka Consumer. It reads the live stream from the broker
and inserts them into the tables. The information is the close stock price for yesterday.
So it wouldn't work on the days after holidays.

This producer writes to the latest details table "nithinmanne_project_stocks_latest",
and then also pushes to main HBase table "nithinmanne_project_stocks". The latest
details are used to see how my portfolio is values with the latest price.

Both the Kafka stream, and the HBase table already has many entries and can be
verified. The entire pipeline can be run by simply executing both the jar files.
The only argument needed for both the programs is just the broker list.

Run Instructions:
spark-submit uber-project-backend-producer-1.0.jar <brokers>
N.B.: Since the main class is defined in the manifest, it need not be specified.
