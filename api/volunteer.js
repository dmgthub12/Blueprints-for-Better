import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, event, interests } = req.body;

    const { error } = await resend.emails.send({
      from: "Blueprints for Better <onboarding@resend.dev>",
      to: [process.env.VOLUNTEER_TO_EMAIL],
      replyTo: email,
      subject: `New Volunteer Application - ${name}`,
      html: `
        <h2>New Volunteer Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Event:</strong> ${event}</p>
        <p><strong>Skills & Interests:</strong> ${
          Array.isArray(interests) ? interests.join(", ") : interests || "None"
        }</p>
      `,
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Email failed to send" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
