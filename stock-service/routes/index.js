const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({})
});

router.get('/cotacao', async function (req, res, next) {
  const { user, password, code } = req.query; // Alteração aqui
  console.log({ user, password, code })
  if (!user || !password || !code) {
    return res.status(400).json({
      error: true,
      message: "É necessário informar todos os parâmetros da URL"
    });
  }
  
  try {
    const { data } = await axios.get(`http://localhost:3001/stock?user=${user}&password=${password}&q=${code}`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar dados de cotação"
    });
  }
});

module.exports = router;
