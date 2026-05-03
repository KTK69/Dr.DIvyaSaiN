import { NextResponse } from "next/server";
import { getBlogBySlug } from "@/lib/content-repository";

interface Context {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return NextResponse.json({ message: "Blog not found." }, { status: 404 });
  }

  return NextResponse.json(blog);
}