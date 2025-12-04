const { DataTypes } = require('sequelize');
const { getSequelize } = require('../../../../config/database');

let BaseModel = null;

const getBaseModel = () => {
    if (!BaseModel) {
        const sequelize = getSequelize();
        BaseModel = sequelize.define(
            'Base',
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                params: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            },
            {
                tableName: 'bases',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        );
    }
    return BaseModel;
};

module.exports = getBaseModel;
