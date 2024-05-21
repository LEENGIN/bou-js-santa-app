// server.js
// where your node app starts

// init project
const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const axios = require('axios');
const nodemailer = require('nodemailer');

app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(morgan());

let pendingRequests = [];
// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Fetch data from external sources
const fetchUserData = async () => {
    const userProfilesResponse = await axios.get('https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json');
    const usersResponse = await axios.get('https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json');
    return {
        userProfiles: userProfilesResponse.data,
        users: usersResponse.data
    };
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'hazle.mueller2@ethereal.email',
        pass: 'Wujbgq6rDd8EZ6Ck54'
    }
});

// メール送信関数
function sendPendingRequestsEmail() {
    if (pendingRequests.length > 0) {
        const mailOptions = {
            from: 'do_not_reply@northpole.com',
            to: 'santa@northpole.com',
            subject: 'Pending Requests',
            text: pendingRequests.map(req => `Username: ${req.username}, Address: ${req.address}, Message: ${req.message}`).join('\n\n')
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
                pendingRequests = []; // Clear pending requests after sending email
            }
        });
    }
}

// 15秒ごとにメール送信
setInterval(sendPendingRequestsEmail, 15000);

// Endpoint to handle form submission
app.post('/submit', async (req, res) => {
    const { id, message } = req.body;
    const data = await fetchUserData();

    // get user by username
    const user = data.users.find(u => u.username === id);
    if (!user) {
        // if have no user
        return res.status(400).render('error', 
                                      { username: id, error: 'your info is not found。' });
    }

    // get user profile by Uid
    const profile = data.userProfiles.find(p => p.userUid === user.uid);
    if (!profile) {
        // if get no profile
        return res.status(400).render('error', 
                                      { username: id, error: 'your info is not found。' });
    }

    const age = calculateAge(new Date(profile.birthdate));
    if (age >= 10) {
        // if user age is not matched
        return res.status(400).render('error', 
                                      { username: id, error: 'your age is 10 years old or older。' });
    }

    // cache for send mail
    pendingRequests.push({
        username: user.username,
        address: profile.address,
        message
    });

    res.render('result', {
          username: id,
          message: message
      });
});

// Helper function to calculate age
const calculateAge = (birthdate) => {
    const diff = Date.now() - birthdate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
