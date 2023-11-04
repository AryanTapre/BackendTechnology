// importing big promise from middlewares
const bigPromise = require('../middlewares/bigPromise');

exports.home = bigPromise(  // bigPromise accept a callback
    function(request,response) {
        response.status(200).json({
            success: true,
            greeting: "hello from api"
        })
    }
)


