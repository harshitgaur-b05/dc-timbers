import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
  return Response.json(enquiries);
}
