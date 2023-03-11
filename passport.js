const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const user = require("./model/userModel");
const bcrypt = require("bcrypt");

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID ,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope:["profile","email"]
    },
    function (accessToken,refreshToken,profile,callback){
        callback(null,profile);
        console.log(profile);
        new user({
            name:profile.displayName,
            email:profile.emails[0].value,
            password:bcrypt.hashSync(profile.id,10)
        }).save();
    })
);

passport.serializeUser((user,done)=>{
    done(null,user);
});

passport.deserializeUser((user,done)=>{
    done(null,user);
})