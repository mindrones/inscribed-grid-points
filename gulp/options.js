import minimist from 'minimist';

const opts = minimist(process.argv.slice(2), {
    string: [
        'm' // message, for deploying
    ]
});

export default opts
