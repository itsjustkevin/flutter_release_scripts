const transformLink = (line) => {
  return line.replace(/(https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/)(\d+)/, '[$2]($1$2)');
};

export default transformLink;
