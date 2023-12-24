import * as yup from 'yup';

/**
 * Validation schema for user login using the Yup library.
 * @type {Object}
 */

const schema = yup.object({
  email: yup
    .string()
    .email('Email must be valid email address format')
    .required(),
  password: yup.string().min(5).required(),
});

export default schema;
