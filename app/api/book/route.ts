import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, date, time } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      console.log('Missing RESEND_API_KEY, logging instead:', { name, email, date, time });
      return Response.json({ success: true, mode: 'test' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Booking System <onboarding@resend.dev>',
      to: ['lu.bormann2012@yahoo.de'], // Update this to your email after verifying domain
      subject: `New Booking: ${name} on ${date}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">New Booking Received</h1>
          <p style="font-size: 16px; color: #555;">
            <strong>${name}</strong> (${email}) has booked a meeting with you.
          </p>
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold;">${date}</p>
            <p style="margin: 5px 0 0; color: #666;">at ${time}</p>
          </div>
        </div>
      `
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
