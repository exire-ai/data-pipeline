const _ = require('lodash');

const general = {
    convertData: (data, conversionDict) => {
        let newData = {}
        for (key in conversionDict) {
            if (conversionDict[key][0] == 'default') {
                newData[key] = conversionDict[key][1]
            } else {
                let val = _.get(data, conversionDict[key][0])
                newData[key] = conversionDict[key].length == 2 ? conversionDict[key][1](val) : val
            }
        }
        return newData
    }
}

module.exports.general = general;