import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Subscription = sequelize.define("Subscription", {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  plan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valid_till: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  credits_used: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  credits_remaining: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  average_daily_usage: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  last_Refreshed: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "subscriptions",
  timestamps: false,
});

export default Subscription;
