var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/contact', (res,req) => {
  res.send("Hello You can contact us...")
})

module.exports = router;
