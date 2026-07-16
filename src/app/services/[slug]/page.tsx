import { redirect } from "next/navigation";
import { fetchServiceBySlug, fetchServices } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await fetchServices();
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceRedirectPage({ params }: Props) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);

  if (!service) {
    redirect("/services");
  }

  // Redirect to the canonical category-specific URL
  const categoryPath = service.category === "reconstructive" ? "reconstructive" : "cosmetic";
  redirect(`/services/${categoryPath}/${slug}`);
}