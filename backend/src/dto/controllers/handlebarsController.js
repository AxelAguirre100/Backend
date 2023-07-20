export const sendLanding = async (req, res) => {
  try {
    res.render("landing");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const sendCart = async (req, res) => {
  try {
    res.render("carrito");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export const sendProductsView = async (req, res) => {
  try {
    res.render("products");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


export const sendLoginView = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const sendRegisterView = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};