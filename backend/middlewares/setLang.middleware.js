export const setLang = (req, res, next) => {
  const lang = req.query.lang || 'en';

  req.lang = lang.toLowerCase();
  next();
};
