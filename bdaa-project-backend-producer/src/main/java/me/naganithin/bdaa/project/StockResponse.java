
package me.naganithin.bdaa.project;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "open",
    "high",
    "low",
    "close",
    "volume",
    "adj_high",
    "adj_low",
    "adj_close",
    "adj_open",
    "adj_volume",
    "symbol",
    "exchange",
    "date"
})
public class StockResponse {

    @JsonProperty("open")
    private Double open;
    @JsonProperty("high")
    private Double high;
    @JsonProperty("low")
    private Double low;
    @JsonProperty("close")
    private Double close;
    @JsonProperty("volume")
    private Double volume;
    @JsonProperty("adj_high")
    private Double adjHigh;
    @JsonProperty("adj_low")
    private Double adjLow;
    @JsonProperty("adj_close")
    private Double adjClose;
    @JsonProperty("adj_open")
    private Double adjOpen;
    @JsonProperty("adj_volume")
    private Double adjVolume;
    @JsonProperty("symbol")
    private String symbol;
    @JsonProperty("exchange")
    private String exchange;
    @JsonProperty("date")
    private String date;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("open")
    public Double getOpen() {
        return open;
    }

    @JsonProperty("open")
    public void setOpen(Double open) {
        this.open = open;
    }

    @JsonProperty("high")
    public Double getHigh() {
        return high;
    }

    @JsonProperty("high")
    public void setHigh(Double high) {
        this.high = high;
    }

    @JsonProperty("low")
    public Double getLow() {
        return low;
    }

    @JsonProperty("low")
    public void setLow(Double low) {
        this.low = low;
    }

    @JsonProperty("close")
    public Double getClose() {
        return close;
    }

    @JsonProperty("close")
    public void setClose(Double close) {
        this.close = close;
    }

    @JsonProperty("volume")
    public Double getVolume() {
        return volume;
    }

    @JsonProperty("volume")
    public void setVolume(Double volume) {
        this.volume = volume;
    }

    @JsonProperty("adj_high")
    public Double getAdjHigh() {
        return adjHigh;
    }

    @JsonProperty("adj_high")
    public void setAdjHigh(Double adjHigh) {
        this.adjHigh = adjHigh;
    }

    @JsonProperty("adj_low")
    public Double getAdjLow() {
        return adjLow;
    }

    @JsonProperty("adj_low")
    public void setAdjLow(Double adjLow) {
        this.adjLow = adjLow;
    }

    @JsonProperty("adj_close")
    public Double getAdjClose() {
        return adjClose;
    }

    @JsonProperty("adj_close")
    public void setAdjClose(Double adjClose) {
        this.adjClose = adjClose;
    }

    @JsonProperty("adj_open")
    public Double getAdjOpen() {
        return adjOpen;
    }

    @JsonProperty("adj_open")
    public void setAdjOpen(Double adjOpen) {
        this.adjOpen = adjOpen;
    }

    @JsonProperty("adj_volume")
    public Double getAdjVolume() {
        return adjVolume;
    }

    @JsonProperty("adj_volume")
    public void setAdjVolume(Double adjVolume) {
        this.adjVolume = adjVolume;
    }

    @JsonProperty("symbol")
    public String getSymbol() {
        return symbol;
    }

    @JsonProperty("symbol")
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    @JsonProperty("exchange")
    public String getExchange() {
        return exchange;
    }

    @JsonProperty("exchange")
    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    @JsonProperty("date")
    public String getDate() {
        return date;
    }

    @JsonProperty("date")
    public void setDate(String date) {
        this.date = date;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

}
