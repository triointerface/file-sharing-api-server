import * as yup from 'yup';

const schema = yup.object({
  first_name: yup.string().min(2).max(30).required(),
  last_name: yup.string().min(2).max(30).required(),
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
  confirm_password: yup
    .string()
    .min(5)
    .required()
    .oneOf([yup.ref('password')], 'Your passwords doesn\'t match.'),
});

export default schema;
