const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../modules/users/users.schema");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${import.meta.env.VITE_API_URL}/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        user = await User.create({
          googleId: profile.id,
          name: profile.name.givenName || profile.displayName,
          surname: profile.name.familyName || "",
          email: profile.emails[0].value,
          height: 0, 
          weight: 0,
          birthdate: new Date(2000, 0, 1),
          diet: "Normale",
          goal: "Mantenimento"
        });

        return done(null, user);
      } catch (err) {
        console.error("Errore durante la strategia Google:", err);
        return done(err, null);
      }
    }
  )
);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});