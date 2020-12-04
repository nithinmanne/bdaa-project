package me.naganithin.bdaa.project

import org.apache.spark.SparkConf
import org.apache.spark.sql.SparkSession

object Stocks {
  val conf: SparkConf = new SparkConf().setMaster("local[*]").setAppName("nithinmanne_project_backend_producer")
  val spark: SparkSession = (SparkSession.builder config conf).enableHiveSupport.getOrCreate
  import spark.implicits._
  spark.sparkContext.setLogLevel("WARN")

  def getStock: String = {
    val stock_symbols = spark table "nithinmanne_project_stock_symbols_csv"
    val tickers = stock_symbols select $"ticker"
    tickers.rdd.takeSample(withReplacement = false, 1)(0).getString(0)
  }
}
