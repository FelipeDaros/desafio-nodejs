var express = require('express');
var router = express.Router();

const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({})
});

router.get('/stock', async function(req, res, next) {
  try {
    const param = req.query.q;
    const { data } = await axios.get(`https://stooq.com/q/l/?s=${param}&f=sd2t2ohlcvn&h&e=csv`);
    
    const stream = Readable.from(data);
    
    let stocks = null;
    stream.pipe(csv())
      .on('data', (row) => {
        const { Symbol, Name, Close } = row;
        stocks = {
          simbolo: Symbol,
          nome_da_empresa: Name,
          cotacao: Close
        }
      })
      .on('end', () => {
        if(stocks.cotacao === "N/D"){
          return res.status(401).json({ error: 'Not found' });
        }
        res.json({ stocks });
      });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

module.exports = router;
