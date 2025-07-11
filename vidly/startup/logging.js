module.exports = function() {
    process.on('unhandledRejection', (err) => {
        throw err;
    });
}