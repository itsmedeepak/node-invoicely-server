import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const InvoiceConfiguration = sequelize.define(
  "InvoiceConfiguration",
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "invoice_configurations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default InvoiceConfiguration;
