import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
const { Schema } = mongoose;
export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verificationCode:{
        type: String
    },
    role: {
        type: String,
        default:'user',
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
    },
    appleId: {
        type: String,
    },
    membershipId:
    {
       type: Schema.Types.ObjectId, ref: 'Price'
    }

}, { timestamps: true });

export const TokenVerifyEmailSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    tokenVerifyEmail: {
        type: String,
    }
}, { timestamps: true });

// NOTE: Arrow functions are not used here as we do not want to use lexical scope for 'this'
UserSchema.pre('save', function (next) {
    let user = this as any;
    // Make sure not to rehash the password if it is already hashed
    if (!user.isModified('password')) return next();
    // Generate a salt and use it to hash the user's password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.checkPassword = function (attempt, callback) {
    let user = this;
    bcrypt.compare(attempt, user.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

export interface User extends mongoose.Document {
    _id: string;
    email: string;
    password: string;
    role:string;
    emailVerified: Boolean;
    verificationCode:string;
}


export interface TokenVerifyEmail extends mongoose.Document {
    userId: string,
    tokenVerifyEmail: string;
}