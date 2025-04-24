const extractContributors = (notes) => {
  const contributorSet = new Set();
  const contributorRegex = /by @(\w+)/g;
  let match;

  while ((match = contributorRegex.exec(notes)) !== null) {
    contributorSet.add(match[1]);
  }

  return Array.from(contributorSet);
};

export default extractContributors;
