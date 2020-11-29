function ping(req, res) {
    res.json({
        success: true,
    });
}

module.exports = {
    ping,
};
