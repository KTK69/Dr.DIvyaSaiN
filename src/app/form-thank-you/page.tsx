import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import PageWrapper from "@/components/ui/PageWrapper";
import FormSubmissionConversion from "@/components/contact/FormSubmissionConversion";
import { consumeAppointmentConfirmation } from "@/lib/appointment-confirmation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

export default async function FormThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const confirmation = token
    ? await consumeAppointmentConfirmation(token, "native-form")
    : null;

  return (
    <PageWrapper className="min-h-[70vh] flex items-center justify-center px-4 py-32">
      <div className="glass-card max-w-2xl rounded-2xl p-10 md:p-16 text-center">
        {confirmation ? (
          <>
            <FormSubmissionConversion transactionId={confirmation.id} />
            <CheckCircle size={56} className="text-[var(--accent-gold)] mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl mb-5">Thank You for Reaching Out</h1>
            <p className="text-[var(--foreground-muted)] leading-relaxed">
              Your request has been received. Our team will get in touch with you soon.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-5xl mb-5">No Active Form Confirmation</h1>
            <p className="text-[var(--foreground-muted)] leading-relaxed mb-8">
              This confirmation link is missing, expired, or has already been used.
            </p>
            <Link href="/contactus" className="inline-flex px-8 py-4 rounded-xl bg-[var(--accent-gold)] text-[var(--background)] font-medium">
              Return to Contact
            </Link>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
