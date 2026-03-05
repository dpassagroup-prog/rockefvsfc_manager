import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string; // default can be set
}

export async function sendEmail({ to, subject, html, from = 'ROCKEFVSFC <notifications@rockefvsfc.co.za>' }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}