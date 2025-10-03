import httpStatus from 'http-status';

export function validate(schema) {
  return (req, res, next) => {
    const toValidate = {
      body: req.body,
      query: req.query,
      params: req.params
    };
    const { error, value } = schema.validate(toValidate, { abortEarly: false, allowUnknown: true, stripUnknown: true });
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'Validation failed', details: error.details.map(d => d.message) });
    }
    // Only replace body; Express 5 exposes read-only getters for query/params
    req.body = value.body || req.body;
    next();
  };
}


