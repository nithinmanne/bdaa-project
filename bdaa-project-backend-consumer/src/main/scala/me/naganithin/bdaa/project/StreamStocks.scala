package me.naganithin.bdaa.project

import java.text.SimpleDateFormat

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import org.apache.hadoop.conf.Configuration
import org.apache.hadoop.hbase.{HBaseConfiguration, TableName}
import org.apache.hadoop.hbase.client.{Connection, ConnectionFactory, Put, Table}
import org.apache.spark.SparkConf
import org.apache.hadoop.hbase.util.Bytes
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions.udf

object StreamStocks {
  val mapper = new ObjectMapper()
  mapper.registerModule(DefaultScalaModule)
  val hbaseConf: Configuration = HBaseConfiguration.create()
  hbaseConf.set("hbase.zookeeper.property.clientPort", "2181")
  hbaseConf.set("hbase.zookeeper.quorum", "localhost")

  val hbaseConnection: Connection = ConnectionFactory.createConnection(hbaseConf)
  val stocks_table: Table = hbaseConnection.getTable(TableName.valueOf("nithinmanne_project_stocks"))
  val latest_table: Table = hbaseConnection.getTable(TableName.valueOf("nithinmanne_project_stocks_latest"))

  def main(args: Array[String]): Unit = {
    if (args.length < 1) {
      System.err.println(s"""
                            |Usage: spark-submit <jar File> <brokers>
                            |  <brokers> is a list of one or more Kafka brokers
                            |  b-2.mpcs53014-kafka.fwx2ly.c4.kafka.us-east-2.amazonaws.com:9092,b-1.mpcs53014-kafka.fwx2ly.c4.kafka.us-east-2.amazonaws.com:9092
                            |
        """.stripMargin)
      System.exit(1)
    }

    val brokers = args(0)

    // Create context with 2 second batch interval
    val conf = new SparkConf().setMaster("local[*]").setAppName("nithinmanne_project_backend_consumer")
    val spark = (SparkSession.builder config conf).enableHiveSupport.getOrCreate
    import spark.implicits._
    spark.sparkContext.setLogLevel("WARN")

    val df = spark.readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", brokers)
      .option("startingOffsets", "latest")
      .option("subscribe", "nithinmanne_project_stock_reports")
      .load()

    val parseToHBase = udf((value: String) => {
      val sr = mapper.readValue(value, classOf[StockReport])
      val date = new SimpleDateFormat("MM/dd/yyyy")
                  .format(new SimpleDateFormat("yyyy-MM-dd").parse(sr.date))
      val latest_put = new Put(Bytes.toBytes(sr.stock))
      latest_put.addColumn(Bytes.toBytes("latest"), Bytes.toBytes("price"), Bytes.toBytes(sr.price))
      latest_put.addColumn(Bytes.toBytes("latest"), Bytes.toBytes("date"), Bytes.toBytes(date))
      latest_table.put(latest_put)

      val stocks_put = new Put(Bytes.toBytes(sr.stock + '_' + date))
      stocks_put.addColumn(Bytes.toBytes("price"), Bytes.toBytes("price"), Bytes.toBytes(sr.price))
      stocks_table.put(stocks_put)
      sr.stock
    })

    df.selectExpr("CAST(value AS STRING)")
      .withColumn("stock", parseToHBase($"value"))
      .writeStream
      .format("console")
      .option("truncate", "false")
      .start()
      .awaitTermination()

  }
}
