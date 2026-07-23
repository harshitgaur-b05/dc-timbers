import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { getAdminSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const { status } = await request.json();

  if (!["new", "contacted", "closed"].includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
  if (!enquiry) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(enquiry);
}
