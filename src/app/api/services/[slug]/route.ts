import { NextResponse } from "next/server";
import { getServiceBySlug } from "@/lib/content-repository";

interface Context {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return NextResponse.json({ message: "Service not found." }, { status: 404 });
  }

  return NextResponse.json(service);
}