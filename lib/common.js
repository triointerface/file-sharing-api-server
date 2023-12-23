export default {
  isValidDate(date) {
    return (new Date(date) !== 'Invalid Date') && !Number.isNaN(new Date(date));
  },
};
