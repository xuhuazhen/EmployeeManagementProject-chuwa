import nodemailer from 'nodemailer';

export async function sendEmail(templateParams, option, next) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true 表示使用 465 端口（SSL），587 用 false
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject =
      option === 'signup'
        ? 'Please create your account'
        : 'Notification from hr team';
        
    const htmlContent =
      option === 'signup'
        ? `<p>Hi ${templateParams.name},</p>
           <p>Please click the link below to complete your signup:</p>
           <a href="${templateParams.link}">${templateParams.link}</a>`
        : `<p>${templateParams.message}</p>`;
    
    await transporter.sendMail({
      from: `"HR System" <${process.env.EMAIL_USER}>`,
      to: templateParams.to,
      subject,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
