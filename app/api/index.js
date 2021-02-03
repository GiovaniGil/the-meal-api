const dbConfig = require('../../config/database');
const connection = require('../../helpers/connection');
const query = require('../../helpers/query');

var api = {}
const defaultLimit = 6;

api.list = async (req, res) => {
  const conn = await connection(dbConfig).catch((e) => {
    console.log('Conexão não realizada');
  });
  const offset =
    ((parseInt(req.query.currentPage) || 1) - 1) *
    (parseInt(req.query.limit) || defaultLimit);
  const rowCount = req.query.limit || defaultLimit;

  const resultTotal = await query(
        conn, `SELECT count(*) total FROM meals`
    ).catch(console.log);
  
  const total = JSON.parse(JSON.stringify(resultTotal))[0].total;
  
  const data = await query(
    conn,
    `SELECT idMeal, strMeal, strArea, strCategory, strInstructions, strMealThumb FROM meals
          ORDER BY idMeal ASC
          LIMIT ${offset}, ${rowCount};`
  ).catch(console.log);
  
  prepareReturn(data, req, res, total);
}

api.findByIngredient = async (req, res) => {
  const conn = await connection(dbConfig).catch((e) => {
    console.log('Conexão não realizada');
  });
  const offset =
    ((parseInt(req.query.currentPage) || 1) - 1) *
    (parseInt(req.query.limit) || defaultLimit);
  const rowCount = req.query.limit || defaultLimit;
  const resultTotal = await query(
    conn,
    `SELECT count(*) total FROM meals where 
          strMeal like '%${req.params.ingredient}%'
          OR strCategory like '%${req.params.ingredient}%'
          OR strInstructions  like '%${req.params.ingredient}%'`
  ).catch(console.log);
  
  const total = JSON.parse(JSON.stringify(resultTotal))[0].total;

  const data = await query(
    conn,
    `SELECT idMeal, strMeal, strArea, strCategory, strInstructions, strMealThumb FROM meals where 
          strMeal like '%${req.params.ingredient}%'
          OR strCategory like '%${req.params.ingredient}%'
          OR strInstructions  like '%${req.params.ingredient}%'
      ORDER BY idMeal ASC
      LIMIT ${offset}, ${rowCount};`
  ).catch(console.log);

  prepareReturn(data, req, res, total);
}

function prepareReturn(data, req, res, total) {
  let meals = data.map((el) => ({
    idMeal: el.idMeal,
    strMeal: el.strMeal,
    strArea: el.strArea,
    strCategory: el.strCategory,
    strInstructions: el.strInstructions,
    strMealThumb: el.strMealThumb,
  }));

  res.json({
    meals,
    currentPage: parseInt(req.query.currentPage) || 1,
    total,
    pages: Math.ceil(total / (parseInt(req.query.limit) || defaultLimit)),
    limit: (parseInt(req.query.limit) || defaultLimit)
  });
}
module.exports = api;