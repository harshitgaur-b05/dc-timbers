import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return Response.json(JSON.parse(JSON.stringify(settings)));
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings(body);
    await settings.save();
  } else {
    settings = await SiteSettings.findOneAndUpdate({}, { $set: body }, { new: true }).lean();
  }

  return Response.json(JSON.parse(JSON.stringify(settings)));
}
