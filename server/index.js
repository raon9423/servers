import express from 'express';
import dotenv from 'dotenv';
import db from './models';
import os from 'os';
import cors from 'cors';
import session from 'express-session'; 
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

const app = express();

app.use(express.static('test'));
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import { AppRoute } from './AppRoute';

app.use(cors());
// Đang thử nghiệm
app.use(
  session({
    secret: 'sOZL78/md9BukQ+CzYMLYDZko5gQT3z/yT2odZS0E7w=',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID: '1065301207599-7fect1c119c61e3b5r3aobovn9ui3pn6.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// app.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('http://localhost:4200/user-profile');
//   }
// );
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Successful authentication, redirect to frontend with user data
  const user = {
    name: req.user.displayName, // Use displayName for name
    email: req.user.emails[0].value, // Access the first email
    avatar: req.user.photos[0].value // Access the first photo
  };
  res.redirect(`http://localhost:4200/user-profile?user=${encodeURIComponent(JSON.stringify(user))}`);
});
// Đang thử nghiệm
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET, POST, PUT, DELETE',
  optionsSuccessStatus: 200,
};

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  next();
});

app.get('/api/healthcheck', async (req, res) => {
  try {
    await db.sequelize.authenticate();

    const cpuLoad = os.loadavg();
    const memoryUsage = process.memoryUsage();
    const cpus = os.cpus();
    const cpuPercentage = (cpuLoad[0] / cpus.length) * 100;

    res.status(200).json({
      status: 'OK',
      database: 'Connected',
      cpuLoad: {
        '1min': cpuLoad[0],
        '5min': cpuLoad[1],
        '15min': cpuLoad[2],
        percentage: cpuPercentage.toFixed(2) + '%',
      },
      memoryUsage: {
        rss: (memoryUsage.rss / (1024 * 1024)).toFixed(2) + ' MB',
        heapTotal: (memoryUsage.heapTotal / (1024 * 1024)).toFixed(2) + ' MB',
        heapUsed: (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2) + ' MB',
        external: (memoryUsage.external / (1024 * 1024)).toFixed(2) + ' MB',
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
      timestamp: new Date(),
    });
  }
});

const port = process?.env?.PORT ?? 3000;
AppRoute(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});