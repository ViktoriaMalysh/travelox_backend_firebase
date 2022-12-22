const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("montanadb", "admin", "admin", {
 host: "localhost",
 dialect: "postgres",
});

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   }
// }    
// );
  
module.exports = sequelize;

const HotelRooms = sequelize.define("hotel_rooms", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  country: DataTypes.TEXT,
  address: DataTypes.TEXT,
  locality: DataTypes.TEXT,
  price: DataTypes.INTEGER,
  url: DataTypes.TEXT,
  status: DataTypes.TEXT,
  }, 
  { 
    timestamps: false
  }
);

const Team = sequelize.define("team", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userName: DataTypes.TEXT,
  avatar: DataTypes.TEXT,
  position: DataTypes.TEXT,
  email: DataTypes.TEXT,
  phoneNumber: DataTypes.TEXT,
  }, 
  { 
    timestamps: false
  }
);

const User = sequelize.define("users", { 
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }, 
  email: DataTypes.TEXT,
  phone_number: DataTypes.BIGINT,
  firstName: DataTypes.TEXT,
  lastName: DataTypes.TEXT,
  gender: DataTypes.TEXT,
  country: DataTypes.TEXT,
  dateOfBirth: DataTypes.TEXT,
  password: DataTypes.TEXT,
  isAdmin: DataTypes.BOOLEAN,
},     
{ 
  timestamps: false
});


const UserRooms = sequelize.define('UserRooms', {}, { timestamps: false });

User.belongsToMany(HotelRooms, { through: UserRooms });
HotelRooms.belongsToMany(User, { through: UserRooms });

const SaleRooms = sequelize.define("sale_rooms", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  country: DataTypes.TEXT,
  address: DataTypes.TEXT,
  locality: DataTypes.TEXT,
  priceBefore: DataTypes.INTEGER,
  priceAfter: DataTypes.INTEGER,
  discount: DataTypes.INTEGER,   
  url: DataTypes.TEXT,
  }, 
  {
    timestamps: false 
  }
);

const PaymentCards = sequelize.define("payment_cards", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  number: DataTypes.BIGINT,
  MM_YY: DataTypes.INTEGER,
  cnn: DataTypes.INTEGER,
  zip: DataTypes.INTEGER,
}, 
{   
  timestamps: false }
);     

const UserPaymentCards = sequelize.define('UserPaymentCards', {}, { timestamps: false });

User.belongsToMany(PaymentCards, { through: UserPaymentCards });
PaymentCards.belongsToMany(User, { through: UserPaymentCards });

// sequelize.sync({ alter: true })

module.exports = {
  User: User,   
  PaymentCards: PaymentCards,
  HotelRooms: HotelRooms,   
  SaleRooms: SaleRooms,
  UserRooms: UserRooms,
  UserPaymentCards: UserPaymentCards,
  Team: Team,
};
       