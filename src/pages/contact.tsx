import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitContact } from '../hooks/use-contact';
import { Button, Input, Textarea } from '../components/ui';
import { useToast } from '../components/ui/toast';
import { SEO } from '../components/common';
import { contactPageContent } from '../content/site-content';
import { WHATSAPP_NUMBER, INSTAGRAM_URL } from '../content/site-config';
import { MessageSquare, Mail, Clock } from 'lucide-react';

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
        description: 'Thank you for reaching out. An artisan liaison will reply within 24 hours.',
      });
      reset();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to send your message. Please try WhatsApp for immediate assistance.',
      });
    }
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <SEO
        title="Contact Us | SANAAT"
        description="Connect with the SANAAT team for custom sizing, order updates, and styling enquiries."
      />

      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium">
          Concierge & Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif tracking-wide text-black mt-2 mb-3">
          {contactPageContent.heading}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-sans font-light leading-relaxed">
          {contactPageContent.intro}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="Ayesha Khan"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="ayesha@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="0300 1234567"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="Subject *"
                placeholder="Sizing or Order Enquiry"
                error={errors.subject?.message}
                {...register('subject')}
              />
            </div>

            <Textarea
              label="Message *"
              placeholder="How can we assist you today?"
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
              className="text-xs tracking-widest mt-4"
            >
              SEND MESSAGE
            </Button>
          </form>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-gray-50 p-6 sm:p-8">
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-black border-b border-gray-200 pb-3">
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
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black group-hover:text-plum transition-colors">
                  WhatsApp Concierge
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Instant sizing consultation & pre-order updates
                </p>
                <span className="text-xs font-mono text-black font-medium mt-1 block">
                  +{WHATSAPP_NUMBER}
                </span>
              </div>
            </a>

            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-white border border-gray-200">
              <div className="p-2 bg-gray-100 text-gray-700 rounded-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black">Email Inquiries</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  General inquiries, bridal appointments & press
                </p>
                <span className="text-xs text-black font-medium mt-1 block">
                  {contactPageContent.email}
                </span>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4 p-4 bg-white border border-gray-200">
              <div className="p-2 bg-gray-100 text-gray-700 rounded-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black">Operating Hours</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {contactPageContent.businessHours}
                </p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="border-t border-gray-200 pt-6">
            <span className="text-xs uppercase tracking-widest text-gray-400 block mb-3 font-sans">
              Follow SANAAT
            </span>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black hover:text-plum transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@sanaat.pk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
