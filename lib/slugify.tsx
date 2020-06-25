const spaceRegex = /\s+/g;
const nonAllowedRegex = /[^가-힇a-z\d\s\.\-]/gi;

const slugify = (name: string, delimeter = '-') => {
  let result = name;
  result = result
    .toLowerCase()
    .replace(nonAllowedRegex, '')
    .trim()
    .replace(spaceRegex, delimeter);

  return result;
};

export { slugify };
