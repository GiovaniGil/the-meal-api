var api = require('../api');

module.exports  = function(app) {
  app.route('/v1/meals').get(api.list);
  app.route('/v1/meals/:ingredient').get(api.findByIngredient);  
};