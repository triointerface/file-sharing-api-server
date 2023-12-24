import * as yup from 'yup';

const schema = yup.object({
  email: yup
    .string()
    .email('Email must be valid email address format')
    .required(),
  password: yup.string().min(5).required(),
});

export default schema;
