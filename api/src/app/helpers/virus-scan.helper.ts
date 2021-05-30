var execSync = require('child_process').execSync;
var path = require('path');

export const scan = (filePath) => {
    if(process.env.ENABLE_SCAN === 'true'){
        try {
            const result = execSync('fsscan target ' + path.resolve(__dirname, filePath)).toString();
            var matches = /Harmful items: (.*)/g.exec(result);
            return matches?.[1] ? parseInt(matches[1]) === 0 : false
        } catch (error) {
            console.log(error);
            return false;
        }
    } else {
        return true;
    }         
}
