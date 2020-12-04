'use strict';
// const assert = require('assert') // Only For Debug
const express = require('express');
const app = express();
app.set('view engine', 'pug')
const cookieParser = require('cookie-parser');
app.use(cookieParser())
const mustache = require('mustache');
const filesystem = require('fs');
const port = Number(process.argv[2]);

const hbase = require('hbase')
const hclient = hbase({ host: process.argv[3], port: Number(process.argv[4])})

app.use(express.static('public'));

// Dynamically Create Index as well
app.get('/', (req, res) => {
    // Load list of carrier codes with names
    hclient.table('nithinmanne_hw6_carrier_map')
           .scan({}, (err, rows) => {
               // assert.ifError(err)
               if (err) {
                   res.send('Error\n' + err)
                   return
               }
               const carrier_list = []
               rows.forEach(row => {
                   carrier_list.push({
                       carrier: row['key'],
                       carrier_name: row['$']
                   })
               })
               carrier_list.sort((ele1, ele2) => ele1['carrier_name'].localeCompare(ele2['carrier_name']))
               const index_template = filesystem.readFileSync('index.mustache').toString()
               res.send(mustache.render(index_template, {carrier_list: carrier_list}))
           })
})

app.get('/results.html',function (req, res) {
    const carrier = req.query['carrier']
    if (carrier === '' || carrier === undefined) {
        res.send('')
        return
    }
    hclient.table('nithinmanne_hw6_carrier_map')
        .row(carrier)
        .get((err, rows) => {
            // assert.ifError(err)
            if (err) {
                res.send('Error\n' + err)
                return
            }
            if (rows.length !== 1) {
                res.send('Error Carrier: ' + carrier)
                return
            }
            const carrier_name = rows[0]['$']
            hclient.table('nithinmanne_hw7_ontime')
                .scan({
                    filter: {
                        op: 'EQUAL',
                        type: 'RowFilter',
                        comparator: {
                            value: carrier + '.+',
                            type: 'RegexStringComparator'
                        }
                    }
                }, (err, rows) => {
                    // assert.ifError(err)
                    if (err) {
                        res.send('Error\n' + err)
                        return
                    }
                    let data = {}
                    // Parse All Data
                    rows.forEach(row => {
                        const year = Number(row['key'].split('_')[1])
                        if (!(year in data)) data[year] = {}
                        data[year][row['column']] = Number(row['$'])
                    })

                    // Function to get the percentage by dividing
                    function ontime_perc(year, weather) {
                        let flights, ontime
                        if (weather) {
                            flights = data[year]["ontime:" + weather + "_flights"]
                            ontime = data[year]["ontime:" + weather + "_flights_ontime"];
                        } else {
                            flights = data[year]["ontime:flights"];
                            ontime = data[year]["ontime:flights_ontime"];
                        }
                        if (flights === 0)
                            return ' - '
                        return (100 * ontime / flights).toFixed(1).toString() + '%'; /* One decimal place */
                    }

                    // Create the table of results
                    let result_list = []
                    for (const year in data) {
                        result_list.push({
                            year: year,
                            total_dly: ontime_perc(year, ''),
                            clear_dly: ontime_perc(year, "clear"),
                            fog_dly: ontime_perc(year, "fog"),
                            rain_dly: ontime_perc(year, "rain"),
                            snow_dly: ontime_perc(year, "snow"),
                            hail_dly: ontime_perc(year, "hail"),
                            thunder_dly: ontime_perc(year, "thunder"),
                            tornado_dly: ontime_perc(year, "tornado")
                        })
                    }
                    result_list.sort((ele1, ele2) => ele1['year'] - ele2['year'])
                    const result_template = filesystem.readFileSync("result.mustache").toString()
                    res.send(mustache.render(result_template, {
                        carrier_name: carrier_name,
                        result_list: result_list
                    }))


                })
        })
})

app.listen(port);
