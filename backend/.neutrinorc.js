module.exports = {
  use: [
    ["neutrino-preset-airbnb-base", {
      eslint: {
        rules: {
           // publisherResolver and boardgameResolver functions need to call each other
          "no-use-before-define": ["error", { "functions": false, "variables": true, "classes": true }],
          "no-console": "off"
        }
      }
    }],
    "neutrino-preset-node",
  ],
};
