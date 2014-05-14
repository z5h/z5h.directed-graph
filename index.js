if (process.env.Z5H_COVERAGE){
  module.exports = require('./lib-cov/directed_graph.js');
  module.exports.Keys = require('./lib-cov/keys.js').Keys;
} else {
  module.exports = require('./lib/directed_graph.js');
  module.exports.Keys = require('./lib/keys.js').Keys;
}
