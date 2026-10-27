import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitContact } from '../hooks/use-contact';
import { Button, Input, Textarea } from '../components/ui';
import { useToast } from '../components/ui/toast';
import { SEO } from '../components/common';
import {
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  CONTACT_EMAIL,
  CONTACT_INFO,
} from '../content/site-config';
import { Mail, Clock, MessageCircle } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactPage() {
  const { addToast } = useToast();
  const { mutateAsync: submitContact, isPending } = useSubmitContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContact({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      });

      addToast({
        type: 'success',
        title: 'Message Sent',
        description: 'Thank you for reaching out. We will get back to you shortly.',
      });
      reset();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to send your message. Please reach out via WhatsApp for immediate support.',
      });
    }
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <SEO
        title="Contact Us | SANAAT"
        description="Connect with SANAAT for sizing consultation, order inquiries, and modest fashion styling."
      />

      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-wide text-black mt-2 mb-3 font-normal">
          We&rsquo;d Love to Hear From You
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-sans font-light leading-relaxed">
          Whether you have a question about sizing, pre-orders, or a recently placed piece, we are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="e.g. Fatima Ali"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="fatima@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number (optional)"
                placeholder="0342 4786076"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="Subject *"
                placeholder="Sizing / Order enquiry"
                error={errors.subject?.message}
                {...register('subject')}
              />
            </div>

            <Textarea
              label="Your Message *"
              placeholder="How can we assist you?"
              rows={5}
              error={errors.message?.message}
              {...register('message')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isPending}
              className="py-3 text-xs tracking-widest font-sans font-medium"
            >
              SEND MESSAGE
            </Button>
          </form>
        </div>

        {/* Info Column strictly per Section 13 */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-gray-50 p-6 sm:p-8 border border-gray-200">
          <div className="space-y-5">
            <h2 className="text-base font-sans font-semibold uppercase tracking-wider text-black border-b border-gray-200 pb-3">
              Direct Channels
            </h2>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 bg-white border border-gray-200 hover:border-plum transition-colors group"
            >
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black group-hover:text-plum transition-colors font-sans">
                  WhatsApp
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 font-light font-sans">
                  Fastest response for sizing advice & orders
                </p>
                <span className="text-xs font-mono text-plum font-semibold mt-1 block">
                  {CONTACT_INFO.phoneDisplay}
                </span>
              </div>
            </a>

            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-white border border-gray-200">
              <div className="p-2 bg-gray-100 text-gray-700 rounded-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black font-sans">Email</h3>
                <p className="text-xs text-gray-500 mt-0.5 font-light font-sans">
                  Official correspondence & questions
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-xs text-black font-medium mt-1 block hover:text-plum font-sans"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            {/* Operating Location */}
            <div className="flex items-start gap-4 p-4 bg-white border border-gray-200">
              <div className="p-2 bg-gray-100 text-gray-700 rounded-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black font-sans">Hours</h3>
                <p className="text-xs text-gray-600 mt-0.5 font-light font-sans">
                  Mon — Sat, 11 AM – 8 PM (PKT) · Online orders accepted 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-gray-200 pt-5">
            <span className="text-[11px] uppercase tracking-widest text-gray-400 block mb-3 font-sans">
              Follow Sanaat
            </span>
            <div className="flex items-center gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-wider text-black hover:text-plum transition-colors font-sans"
              >
                Instagram (@sanaat.pk)
              </a>
              <span className="text-gray-300">·</span>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-wider text-black hover:text-plum transition-colors font-sans"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
