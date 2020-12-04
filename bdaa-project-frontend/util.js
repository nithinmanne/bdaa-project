
module.exports.rowToMap = function(row) {
    let data = {}
    row.forEach(item => {
        data[item['column']] = item['$']
    })
    return data
}
