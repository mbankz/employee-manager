const express = require('express'),
      session = require('express-session'),
      massive = require('massive'),
      bodyParser = require('body-parser'),
      passport = require('passport'),
      Auth0Strategy = require('passport-auth0'),
      user = require('./controller/user_controller'),
      requests = require('./controller/requests_controller'),
      emp = require('./controller/employee_controller'),
      com = require('./controller/comment_controller'),
      Auth0Lock = require('auth0-lock')

require('dotenv').config()

let app = express();
// app.use( express.static( `${__dirname}/../build` ) );
app.use(bodyParser.json());

const {
 SERVER_PORT,
 CONNECTION_STRING,
 SESSION_SECRET,
 DOMAIN,
 CLIENT_ID,
 CLIENT_SECRET,
 CALLBACK_URL
} = process.env;

app.use(session( {
      resave: false,
      saveUninitialized: true,
      secret: SESSION_SECRET
}))


app.use(passport.initialize())
app.use(passport.session())

passport.use(new Auth0Strategy ({ 
      domain: DOMAIN,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: 'openid profile',
}, function(accessToken, refreshToken, extraParams, profile, done) {
      let profile_id = profile.id.split('|');
      const db = app.get('db');
      db.find_user_by_googleid([profile_id[1]]).then (user => { 
            if ( user[0] ) {
                  if (!user[0].img) {
                        user[0].img = 'https://s.gravatar.com/avatar/836deac78e49596a0c57b0dc245fdc63?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fsa.png'
                  }
                  return done(null, Object.assign({}, profile, user))
                 
            }
      })
      
}))

//puts info on session
passport.serializeUser((profile, done) => {
      return done(null, profile)
})
passport.deserializeUser((profile, done) => {

      return done(null, profile)
})

// app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/google', passport.authenticate('auth0', {connection: 'google-oauth2'}));
app.get('/auth/linkedin', passport.authenticate('auth0', {connection: 'linkedin'}));

app.get('/callback/auth', passport.authenticate('auth0', {
      successRedirect: process.env.SUCCESS_REDIRECT,
      failureRedirect: process.env.FAILURE_REDIRECT
}))

//user control
app.get('/user/auth', user.getUser)
app.post('/user/getcompany', user.getCompany)
app.put('/user/update', user.update)
app.get('/manager/notifications', user.getNotifications)
app.get('/logout', function(req, res) {
      req.logOut();
      res.redirect(process.env.HOME);
})
app.post('/user/login', user.login);

// registration control
app.get('/user/request', requests.getRequest)
app.post('/user/request', requests.registerRequest)
app.delete('/user/request', requests.deny)

// employee control
app.get('/employees', emp.getEmployees)
app.post('/employee/register', emp.registerEmployee)

// comment send
app.post('/comment/send', com.submit)

massive(CONNECTION_STRING).then( dbInstance => {
 app.set('db', dbInstance);
 app.listen(SERVER_PORT, ()=>console.log(`Terrazine found on world ${SERVER_PORT}`))
})