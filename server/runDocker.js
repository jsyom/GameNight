const Docker = require('dockerode');

const streamBuffers = require('stream-buffers');
const Bluebird = require('bluebird');

function createDocker () {
    this.docker = new Docker();
}



createDocker.prototype.runCommand = function (userCode, testCode, scenario) {

   	//const userCodeEdited = userCode.replace(/'/gm, '"');

    const runUserCodeCommand = `node -p  '${userCode}' && exit`;
    //console.log(runUserCodeCommand);
//     commands = [`node -p 'var testFunc = function(num){
// 	return num * 2;
// }

// testFunc(5);'`, 'exit'].join(' && ');


    const stdoutStream = new streamBuffers.WritableStreamBuffer();

    const finishedPromise = new Bluebird((resolve, reject) => {
        this.docker.run('node:5-slim', ['bash', '-c', runUserCodeCommand], stdoutStream, function(err, data, container) {
            if (err) return reject(err);

            const results = stdoutStream.getContentsAsString('utf8');

            container.remove(function (error, response) {
                if (error) console.log(error);
            });

            resolve(results);
        });
    });

    return finishedPromise;

};

module.exports = createDocker;