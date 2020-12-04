package me.naganithin.bdaa.project;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import me.naganithin.bdaa.project.Stocks;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.glassfish.jersey.jackson.JacksonFeature;


public class CreateStockReports {
    private static final int jobDelaySeconds = 10;
    private static final String auth_token = "f20877e761e4c1e3d25305567edd448c";

    static class Task extends TimerTask {
        private final Client client;

        private String getYesterday() {
            final Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DATE, -1);
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            return dateFormat.format(cal.getTime());
        }

        public StockResponse getStockInfo(String stock, String date) {

            Invocation.Builder bldr
                    = client.target("http://api.marketstack.com/v1/tickers/" +
                                        stock + "/eod/" + date + "?access_key=" + auth_token)
                    .request("application/json");
            try {
                return bldr.get(StockResponse.class);
            } catch (Exception e) {
                System.err.println(e.getMessage());
            }
            return null;  // Sometimes the web service fails due to network problems. Just let it try again
        }

        Properties props = new Properties();
        String TOPIC = "nithinmanne_project_stock_reports";
        KafkaProducer<String, String> producer;

        public Task() {
            client = ClientBuilder.newClient();
            // enable POJO mapping using Jackson - see
            // https://jersey.java.net/documentation/latest/user-guide.html#json.jackson
            client.register(JacksonFeature.class);
            props.put("bootstrap.servers", bootstrapServers);
            props.put("acks", "all");
            props.put("retries", 0);
            props.put("batch.size", 16384);
            props.put("linger.ms", 1);
            props.put("buffer.memory", 33554432);
            props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
            props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

            producer = new KafkaProducer<>(props);
        }

        @Override
        public void run() {
            String stock = Stocks.getStock();
            String date = getYesterday();
            StockResponse response = getStockInfo(stock, date);

            if (response == null || response.getClose() == null)
                return;
            ObjectMapper mapper = new ObjectMapper();

            ProducerRecord<String, String> data;

            try {
                StockReport report = new StockReport(stock, date, response.getClose().toString());
                System.out.println(report);
                data = new ProducerRecord<>(TOPIC, mapper.writeValueAsString(report));
                producer.send(data);
                System.out.println("Sent " + mapper.writeValueAsString(report));
            } catch (JsonProcessingException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
    }

    static String bootstrapServers = "localhost:9092";

    public static void main(String[] args) {
        if (args.length < 1)  // This lets us run on the cluster with a different kafka
        {
            System.out.println("Usage: spark-submit <jar File> <brokers>");
            System.out.println("  <brokers> is a list of one or more Kafka brokers");
            System.out.println("  b-2.mpcs53014-kafka.fwx2ly.c4.kafka.us-east-2.amazonaws.com:9092,b-1.mpcs53014-kafka.fwx2ly.c4.kafka.us-east-2.amazonaws.com:9092");
            System.exit(1);

        }
        bootstrapServers = args[0];
        Timer timer = new Timer();
        timer.scheduleAtFixedRate(new Task(), 0, jobDelaySeconds * 1000);
    }

}
