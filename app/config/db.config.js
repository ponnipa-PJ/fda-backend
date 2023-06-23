module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "excisedb",
    dialect: "mysql",
    // HOST: "localhost:3306",
    // USER: "aqua_tipfarm",
    // PASSWORD: "gdN2d6?4",
    // DB: "tipfarm",
    // dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };