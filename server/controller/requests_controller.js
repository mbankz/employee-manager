const nodemailer = require('nodemailer')
const preset = require('./mailer_preset')

module.exports = {
 registerRequest: (req, res) => {
  
  let { first_name, last_name } = req.body.newObj;
  let { newKey, company } = req.body;
  let mailOptions = {
        from: '"Argos Visual" <support@argosvisual.com>',
        to: `hr@argosvisual.com`,
        subject: `Registration Key`,
        text: '',
        html: `<h2>${first_name} ${last_name} has just registered for ${company[0].company_name}, if this request is authentic, use the authentication key provided to activate employee's account and supply it to him upon login.</h2><br/>
        
        <h3>Key: ${newKey}</h3>`
  }
  // places in db immediately in order to send

  const db = req.app.get('db');
  let { work_phone, personal_phone, work_email, personal_email, address, city, state, zip, googleid } = req.body.newObj;
  db.create_request(newKey, first_name, last_name, work_phone, personal_phone, work_email, personal_email, address, city, state, zip, googleid).then( user => {
      preset.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                  res.status(500).send('failure');
                  return console.log(error);
            }
            console.log('Message sent: %s', info.messageId); 
      })
      res.status(200).send('success');
  }).catch(error=>res.status(500).send(error))
 },

 deny: (req, res) => {
      const db = req.app.get('db');
      let email;
      db.find_user_by_id(req.query.id).then (user => {
            console.log(user);
            email = user[0].work_email;
      }).catch((error)=>console.log(error))

      db.deny_request([req.query.id]).then( table => {
            let mailOptions = {
                  from: '"Argos Visual" <support@argosvisual.com>',
                  to: `${email}`,
                  subject: 'Registration Denial',
                  text: '',
                  html: `<h3>We're sorry, your request has been denied. Have a nice day.</h3>`
            }
            preset.transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                        return console.log(error)
                  }
                  console.log('Message sent: %s', info.messageId); 
            })
            res.status(200).send( table );
      }).catch((error)=>console.log(error))
 },
 approve: (req, res) => {

 },
 getRequest: (req, res) => {
      const db = req.app.get('db');
      console.log(req.query.id);
      db.find_user_by_id(req.query.id).then (user => {
           res.status(200).send( user );
      }).catch((error)=>console.log(error))
 }
}