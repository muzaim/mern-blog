const register = (req, res, next) => {
  // console.log(req.body);
  const { name, email } = req.body;

  const result = {
    message: "Register Success",
    data: {
      uid: 1,
      name: name,
      email: email,
    },
  };

  res.status(201).json(result);
};

module.exports = { register };
