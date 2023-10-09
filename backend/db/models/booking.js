'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot,{foreignKey:'spotId'}),
      Booking.belongsTo(models.User,{foreignKey:'userId'})
    }
  }
  Booking.init({
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    isSeederData: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Booking',
    scopes:{
      defaultScope:{
        attributes:{
          exclude:["isSeederData"]
        }
      }
    }
  });
  return Booking;
};
