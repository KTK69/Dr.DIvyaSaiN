"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { submitAppointment } from "@/lib/api";

const appointmentSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.email("Please enter a valid email address"),
  concern: z.string().min(10, "Please briefly describe your concern (min 10 characters)"),
  preferredTime: z.string().optional(),
  howDidYouHear: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormData) => {
    setSubmitError(null);
    const result = await submitAppointment(data);

    if (!result.ok) {
      setSubmitError(result.message || "Unable to submit appointment request.");
      return;
    }

    setSubmitted(true);
    reset();
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--accent-gold)] transition-colors";

  const labelClass =
    "block text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wide mb-2";

  const errorClass = "text-xs text-red-400 mt-1";

  if (submitted) {
    return (
      <div className="glass-card rounded-xl p-10 text-center">
        <CheckCircle size={40} className="text-[var(--accent-gold)] mx-auto mb-4" />
        <h3
          className="text-xl font-medium text-[var(--foreground)] mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Request Received
        </h3>
        <p className="text-sm text-[var(--foreground-muted)] max-w-sm mx-auto">
          Thank you for reaching out. Our team at CARE Hospitals will get in
          touch with you to confirm your appointment.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-xs text-[var(--foreground-subtle)] hover:text-[var(--accent-gold-light)] transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass-card rounded-xl p-8 space-y-6"
      noValidate
      aria-label="Appointment request form"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full Name <span className="text-[var(--accent-gold)]">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={inputClass}
            {...register("fullName")}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <p id="fullName-error" className={errorClass} role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number <span className="text-[var(--accent-gold)]">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            className={inputClass}
            {...register("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className={errorClass} role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email Address <span className="text-[var(--accent-gold)]">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          className={inputClass}
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className={errorClass} role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="concern" className={labelClass}>
          Your Concern <span className="text-[var(--accent-gold)]">*</span>
        </label>
        <textarea
          id="concern"
          rows={4}
          placeholder="Please briefly describe your concern or the procedure you're enquiring about…"
          className={`${inputClass} resize-none`}
          {...register("concern")}
          aria-invalid={!!errors.concern}
          aria-describedby={errors.concern ? "concern-error" : undefined}
        />
        {errors.concern && (
          <p id="concern-error" className={errorClass} role="alert">
            {errors.concern.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="preferredTime" className={labelClass}>
            Preferred Time (optional)
          </label>
          <select
            id="preferredTime"
            className={inputClass}
            {...register("preferredTime")}
          >
            <option value="">No preference</option>
            <option value="morning">Morning (9am – 12pm)</option>
            <option value="afternoon">Afternoon (12pm – 4pm)</option>
            <option value="evening">Evening (4pm – 7pm)</option>
          </select>
        </div>

        <div>
          <label htmlFor="howDidYouHear" className={labelClass}>
            How did you hear about us?
          </label>
          <select
            id="howDidYouHear"
            className={inputClass}
            {...register("howDidYouHear")}
          >
            <option value="">Prefer not to say</option>
            <option value="referral">Doctor referral</option>
            <option value="hospital">CARE Hospitals</option>
            <option value="search">Online search</option>
            <option value="word_of_mouth">Word of mouth</option>
            <option value="social">Social media</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        {submitError && (
          <p className="mb-3 text-xs text-red-400" role="alert">
            {submitError}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[var(--accent-gold)] text-[var(--background)] text-sm font-medium hover:bg-[var(--accent-gold-light)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSubmitting ? (
            "Sending…"
          ) : (
            <>
              Submit Request
              <Send size={15} />
            </>
          )}
        </button>
        <p className="mt-3 text-xs text-[var(--foreground-subtle)]">
          Your information is kept confidential and is used only to schedule
          your appointment.
        </p>
      </div>
    </form>
  );
}
