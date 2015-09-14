var router = require('express').Router();
var passport = require('passport');


router.route('/test')

    .get(passport.authenticate('bearer', { session: false }), function (req, res) {
        res.json({success: true});
    });


module.exports = router;
