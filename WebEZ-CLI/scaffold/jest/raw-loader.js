const rawloader=require('raw-loader');

module.exports = {
      process(src) {
        return {code:`module.exports = ${JSON.stringify(rawloader(src))};`};
      }
    }
