import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageSquare, ChevronDown, ChevronUp, Send } from "lucide-react";
import { toast } from "sonner";

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! Your support message has been sent to Meerut Sports. We'll reply within 2 hours.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const faqs = [
    {
      q: "How do I pay using Paytm UPI and enter UTR / Transaction ID?",
      a: "After selecting products, proceed to Checkout step 3. Scan the merchant Paytm QR Code or send to UPI ID: 7417031520@pytes in Paytm, Google Pay, PhonePe, or BHIM. After making payment, copy the 12-digit UTR/Transaction ID from payment details and paste it into the UTR field. Admin will verify it promptly!"
    },
    {
      q: "How long does manual UPI payment verification take?",
      a: "Most UPI orders are verified within 15–30 minutes during business hours (9 AM - 9 PM IST). You can track order status live in the My Orders tab."
    },
    {
      q: "Are all cricket bats and shoes guaranteed genuine?",
      a: "Yes! All products are directly sourced from official manufacturer distributors in Meerut (SG, Nike, Adidas, Puma, Yonex). Every product carries brand hologram seals."
    },
    {
      q: "What is the return and replacement policy?",
      a: "We offer a 7-day hassle-free replacement guarantee for manufacturing defects, wrong size delivery, or transit damages."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase">Contact & Help Support</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Have questions about your UPI payment, order shipment, or equipment specs? Meerut Sports is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Support Details & Info Cards */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 border border-slate-800 shadow-xl">
            <h2 className="text-2xl font-black uppercase text-amber-400">Get In Touch</h2>
            
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Toll-Free Customer Care</p>
                  <p className="text-slate-300">+91 1800-890-MEERUT (9 AM - 8 PM)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Email Support</p>
                  <p className="text-slate-300">support@meerutsports.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Headquarters</p>
                  <p className="text-slate-300">Sports Goods Complex, Delhi Road, Meerut, UP - 250002</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expandable FAQs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-lg uppercase flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" /> Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-4 text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="h-4 w-4 text-amber-600" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <h2 className="text-2xl font-black text-slate-900 uppercase">Send Us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-700">Your Name</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="text-xs rounded-xl" placeholder="Full Name" />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-700">Email Address</Label>
                <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="text-xs rounded-xl" placeholder="email@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-700">Phone Number</Label>
                <Input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="text-xs rounded-xl" placeholder="+91..." />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-700">Subject</Label>
                <Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required className="text-xs rounded-xl" placeholder="Order / UPI Inquiry" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Your Message</Label>
              <Textarea
                rows={4}
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                required
                className="text-xs rounded-xl"
                placeholder="Write your query details or UTR verification question here..."
              />
            </div>

            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-6 rounded-2xl shadow-xl text-sm gap-2">
              <Send className="h-4 w-4 text-amber-400" /> Send Support Message
            </Button>
          </form>
        </div>

      </div>

    </div>
  );
};