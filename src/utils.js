const checkIsRun = (parseData, key, title) => {
  return (
    !parseData[key] ||
    parseData[key].title !== title ||
    !parseData[key].date ||
    new Date().toDateString() === parseData[key].date
  );
};

module.exports = { checkIsRun };
