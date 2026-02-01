'use client';

import { useState, useId, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { CheckCircle, Send, Loader2, Mail, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { GradientMesh } from '@/components/GradientMesh';

const SceneWrapper = dynamic(
  () => import('@/components/3d/SceneWrapper').then((m) => m.SceneWrapper),
  { ssr: false }
);
const Globe = dynamic(
  () => import('@/components/3d/Globe').then((m) => m.Globe),
  { ssr: false }
);

interface ContactSectionProps {
  showInfo?: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(data: { name: string; email: string; message: string }): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Name is required.';
  if (!data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.message.trim()) {
    errors.message = 'Message is required.';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }
  return errors;
}

export function ContactSection({ showInfo = false }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const messageId = `${formId}-message`;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Honeypot check
    if (honeypot) return;

    const formData = { name, email, message };
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus('submitting');

    // Simulated submission - will be replaced with API call in Phase 3
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <motion.section
      id="contact"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <GradientMesh variant="contact" />

      {/* Decorative globe */}
      {!isMobile && !prefersReduced && (
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-40 hidden lg:block"
          aria-hidden="true"
        >
          <SceneWrapper className="h-full w-full">
            <ambientLight intensity={0.5} />
            <Globe />
          </SceneWrapper>
        </div>
      )}

      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Get in Touch
      </h2>
      <p className="mt-2 max-w-lg text-muted-foreground">
        Have a project in mind or just want to say hello? I would love to hear
        from you.
      </p>

      <div
        className={cn(
          'mt-10',
          showInfo && 'grid gap-12 lg:grid-cols-[1fr_auto]'
        )}
      >
        {/* Form */}
        <div className="max-w-xl">
          {status === 'success' ? (
            <motion.div
              className="flex flex-col items-center rounded-xl border border-border bg-card p-10 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              role="status"
            >
              <CheckCircle className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Message sent!</h3>
              <p className="mt-2 text-muted-foreground">
                Thanks for reaching out. I will get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-6 text-sm font-medium text-primary underline underline-offset-4 hover:opacity-80"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Honeypot - hidden from real users */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor={`${formId}-hp`}>Do not fill this out</label>
                <input
                  id={`${formId}-hp`}
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor={nameId}
                  className="text-sm font-medium text-foreground"
                >
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  id={nameId}
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  aria-invalid={errors.name ? 'true' : undefined}
                  aria-describedby={errors.name ? `${nameId}-error` : undefined}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm input-focus-glow',
                    'placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    errors.name &&
                      'border-destructive focus-visible:ring-destructive'
                  )}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p
                    id={`${nameId}-error`}
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor={emailId}
                  className="text-sm font-medium text-foreground"
                >
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  id={emailId}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={
                    errors.email ? `${emailId}-error` : undefined
                  }
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm input-focus-glow',
                    'placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    errors.email &&
                      'border-destructive focus-visible:ring-destructive'
                  )}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p
                    id={`${emailId}-error`}
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label
                  htmlFor={messageId}
                  className="text-sm font-medium text-foreground"
                >
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id={messageId}
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message)
                      setErrors((p) => ({ ...p, message: undefined }));
                  }}
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={
                    errors.message ? `${messageId}-error` : undefined
                  }
                  className={cn(
                    'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm input-focus-glow',
                    'placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'resize-y min-h-[120px]',
                    errors.message &&
                      'border-destructive focus-visible:ring-destructive'
                  )}
                  placeholder="Tell me about your project or just say hello..."
                />
                {errors.message && (
                  <p
                    id={`${messageId}-error`}
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Error banner */}
              {status === 'error' && (
                <div
                  className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
                  role="alert"
                >
                  Something went wrong. Please try again.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className={cn(
                  'inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground',
                  'transition-colors hover:bg-primary/90',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  'disabled:pointer-events-none disabled:opacity-50'
                )}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Contact info sidebar (shown on /contact page) */}
        {showInfo && (
          <div className="space-y-6 lg:pt-2">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a
                  href="mailto:hello@krishnap.dev"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@krishnap.dev
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
