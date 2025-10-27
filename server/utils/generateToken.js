import jwt from 'jsonwebtoken';

const generateToken = (id, username, role) => {
  const token = jwt.sign(
    { id, username, role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '3h',
    }
  );
  return token;
};

const generateSignupToken = (email) => {
  const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '3h',
  });
  return token;
};

export { generateToken, generateSignupToken };
 
// signup@email.com
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNpZ251cEBlbWFpbC5jb20iLCJpYXQiOjE3MDg2NTU5NjQsImV4cCI6MTcxMTI0Nzk2NH0.A2teQ6YpiM7WV0qy7wO6lYhm-DTmG-43sHm9prvK-eg
