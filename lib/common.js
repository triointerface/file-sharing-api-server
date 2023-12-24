export default {
  /**
   * Checks if the given input is a valid date.
   * @param {string} date - The date to be checked for validity.
   * @returns {boolean} - A boolean indicating whether the input is a valid date.
   */
  isValidDate(date) {
    return new Date(date) !== 'Invalid Date' && !Number.isNaN(new Date(date));
  },

  /**
   * Adds the specified number of months to the given date.
   * @param {string} date - The date in ISO format to which months will be added.
   * @param {number} months - The number of months to add.
   * @returns {string} - The resulting date in ISO format after adding the specified months.
   */
  addMonth(date, months) {
    if (!this.isValidDate(date)) {
      return new Date().toISOString();
    }
    const now = new Date(date);
    return new Date(now.setMonth(now.getMonth() + months)).toISOString();
  },
};
