import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, phone, email, projectType, message, productName } = body;

    // Server-side validation
    const errors: Record<string, string> = {};
    if (!name?.trim()) errors.name = "Name is required";
    if (!phone?.trim()) errors.phone = "Phone is required";
    if (!email?.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email";
    if (!message?.trim()) errors.message = "Message is required";

    if (Object.keys(errors).length) {
      return Response.json({ errors }, { status: 400 });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      projectType: projectType || undefined,
      message: message.trim(),
      productName: productName?.trim() || undefined,
      status: "new",
    });

    // TODO: Send notification email via Resend/Nodemailer when configured
    // await sendEnquiryNotification(enquiry);

    return Response.json({ id: enquiry._id.toString() }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to save enquiry" }, { status: 500 });
  }
}
