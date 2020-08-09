const cluster = require('cluster');
const fs = require('fs');
const numCPUs = require('os').cpus().length;
var childScript = __dirname + '/child.js';

cluster.setupMaster({ exec: childScript });

const trainingData = fs.readdirSync('images/train');
const JOB_SIZE = 64;
const iterations = numCPUs * JOB_SIZE;
const dataChunkSize = Math.ceil(trainingData.length / iterations);
console.log(`length: ${trainingData.length} iterations: ${iterations} chunkSize: ${dataChunkSize}`);

(async function() {
    const busy = Array(numCPUs).fill(false);
    const procs = Array(numCPUs).fill(0);
    let i = 0;
    function iteration(current_i) {
        for(let j = 0; j < busy.length; j++) {
            if(!busy[j]) {
                let proc = cluster.fork();
                procs[j] = proc;
                const data = {
                    id: j,
                    start: i * dataChunkSize,
                    length: dataChunkSize
                }
                busy[j] = true;
                i++;
                proc.send(JSON.stringify(data));
                proc.on('message', function(message) {
                    const { id } = message;
                    busy[id] = false;
                    if(current_i < iterations) {
                        process.nextTick(() => iteration(i));
                    }
                });
            }
        }
    }
    iteration(i);
})()
