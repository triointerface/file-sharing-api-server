export default {
  isValidDate(date) {
    return (new Date(date) !== 'Invalid Date') && !Number.isNaN(new Date(date));
  },

  addMonth(date, months) {
    if (!this.isValidDate(date)) {
      return new Date().toISOString();
    }
    const now = new Date(date);
    return new Date(now.setMonth(now.getMonth() + months)).toISOString();
  }
};
