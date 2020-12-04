package me.naganithin.bdaa.project

import scala.beans.BeanProperty


case class StockReport(@BeanProperty stock: String, @BeanProperty date: String, @BeanProperty price: String)
