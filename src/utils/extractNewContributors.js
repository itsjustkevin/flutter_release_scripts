const extractNewContributors = (notes) => {
  const newContributorSet = new Set();
  const newContributorRegex = /@(\w+) made their first contribution/g;
  let match;

  while ((match = newContributorRegex.exec(notes)) !== null) {
    newContributorSet.add(match[1]);
  }

  return newContributorSet;
};

export default extractNewContributors;
