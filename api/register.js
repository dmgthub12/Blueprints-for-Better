import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      parentName,
      parentEmail,
      parentPhone,
      childName,
      age,
      interests,
      program,
      emergencyName,
      emergencyPhone
    } = req.body;

    const { error } = await resend.emails.send({
      from: "Blueprints for Better <register@blueprintsforbetterfoundation.org>",
      to: [process.env.VOLUNTEER_TO_EMAIL],
      replyTo: parentEmail,
      subject: `New Youth Registration - ${childName}`,
      html: `
        <h2>New Youth Registration</h2>

        <h3>Parent / Guardian</h3>
        <p><strong>Name:</strong> ${parentName}</p>
        <p><strong>Email:</strong> ${parentEmail}</p>
        <p><strong>Phone:</strong> ${parentPhone}</p>

        <h3>Child</h3>
        <p><strong>Name:</strong> ${childName}</p>
        <p><strong>Age:</strong> ${age}</p>
        <p><strong>Interests:</strong> ${interests.join(", ") || "None selected"}</p>

        <h3>Program</h3>
        <p>${program}</p>

        <h3>Emergency Contact</h3>
        <p><strong>Name:</strong> ${emergencyName}</p>
        <p><strong>Phone:</strong> ${emergencyPhone}</p>
      `
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Email failed to send" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Registration failed" });
  }
}
