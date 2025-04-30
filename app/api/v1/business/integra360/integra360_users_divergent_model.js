const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const UsersDivergentsSchema = new mongoose.Schema(
    {
        email: { type: String, trim: true, required: true, unique: true, index: true },
        cpf: { type: String, trim: true },
        giftcardVtexId: {
            type: String,
            trim: true
        },
        giftcardAsicsBackId: {
            type: String,
            trim: true
        },
        userId: { type: String },
        status: {
            type: String,
            trim: true,
            enum: ['CORRECTED', 'DIVERGENT'],
            default: undefined
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
);

UsersDivergentsSchema.plugin(mongoosePaginate);
UsersDivergentsSchema.plugin(mongooseAggregatePaginate);
UsersDivergentsSchema.index({ createdAt: 1 });

UsersDivergentsSchema.path('email').validate(async (email) => {
    const userWithEmailCount = await mongoose.models.UsersDivergents.countDocuments({
        email
    });
    return !userWithEmailCount;
}, 'CONFLICT_DUPLICATE_KEY_ERROR_EMAIL');

UsersDivergentsSchema.path('cpf').validate(async (cpf) => {
    const userWithCpfCount = await mongoose.models.UsersDivergents.countDocuments({
        cpf
    });
    return !userWithCpfCount;
}, 'CONFLICT_DUPLICATE_KEY_ERROR_CPF');

const UsersDivergentsModel = mongoose.model('UsersDivergents', UsersDivergentsSchema);
module.exports = UsersDivergentsModel;
