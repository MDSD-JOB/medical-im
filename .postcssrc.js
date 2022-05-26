const AutoPrefixer = require("autoprefixer");
const px2rem = require("postcss-px2rem-exclude");
module.exports = ({ file }) => {
  let remUnit;
  if (file && file.dirname && file.dirname.indexOf("vant") > -1) {
    remUnit = 37.5;
  } else {
    remUnit = 75;
  }
  return {
    plugins: [
      px2rem({ remUnit }),
      AutoPrefixer({ overrideBrowserslist: ["> 0.15% in CN"] })
    ]
  };
};
