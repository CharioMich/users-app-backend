const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

function generateAccessToken(user) {
  // console.log('Auth Service ', user);  // username,email,password,roles

  const payload = {
    username: user.username,
    email: user.email,
    roles: user.roles
  };

  const secret = process.env.TOKEN_SECRET;
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secret, options);
};


function verifyAccessToken(token) {
  const secret = process.env.TOKEN_SECRET;
  
  try {
    const decodedPayload = jwt.verify(token, secret);
    console.log("VerifyToken ", decodedPayload);
    return {verified: true, data: decodedPayload}; 
  } catch (err) {
    return { verified: false, data: err };
  }
};


async function googleAuth(code) {
  console.log("Google Login");

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  const oauth2client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  try {
    // Exchange code for tokens. 
    const { tokens } = await oauth2client.getToken(code);   
    oauth2client.setCredentials(tokens);

    const ticket = await oauth2client.verifyIdToken({   // Checks if token is issued by Google. 
      audience: CLIENT_ID
    });

    const userInfo = await ticket.getPayload();   // Get the google user data
    console.log("Google User: ", userInfo);
    return {user: userInfo, tokens};
  } catch (err) {
    console.log("Error in google authentication ", err);
    return { error: "Failed to authenticate with Google" };
  }
}

module.exports = { generateAccessToken, verifyAccessToken, googleAuth }