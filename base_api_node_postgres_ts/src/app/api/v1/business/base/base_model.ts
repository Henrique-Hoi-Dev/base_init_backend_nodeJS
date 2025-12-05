import { DataTypes, Model, Sequelize } from 'sequelize';
import database from '../../../../config/database';

interface BaseAttributes {
    id?: number;
    params?: string;
    created_at?: Date;
    updated_at?: Date;
}

class Base extends Model<BaseAttributes> implements BaseAttributes {
    public id!: number;
    public params?: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

let BaseModel: typeof Base | null = null;

const getBaseModel = (): typeof Base => {
    if (!BaseModel) {
        const sequelize: Sequelize = database.getSequelize();
        BaseModel = Base.init(
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
                sequelize,
                tableName: 'bases',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        );
    }
    return BaseModel;
};

export default getBaseModel;

