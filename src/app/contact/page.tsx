import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, Phone, MapPin, MessageCircle, Video } from 'lucide-react'

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="bg-gradient-to-r from-blue-700 to-indigo-800 py-20 text-white text-center">
          <h1 className="font-heading text-5xl mb-4">Contact Us</h1>
          <p className="text-blue-100 text-lg">We're here to answer your questions</p>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-heading text-3xl text-gray-900 mb-8">Get in Touch</h2>
                <div className="space-y-6">
                  {[
                    { icon: Mail, label: 'Email', value: 'lumiraschool@gmail.com', href: 'mailto:lumiraschool@gmail.com' },
                    { icon: Phone, label: 'Phone / WhatsApp', value: '0759 083 260', href: 'https://wa.me/254759083260' },
                    { icon: MapPin, label: 'Location', value: 'Eastleigh, Nairobi' },
                    { icon: MessageCircle, label: 'Instagram', value: '@lumira_school', href: 'https://www.instagram.com/lumira_school' },
                    { icon: Video, label: 'Classes via', value: 'Zoom & Google Meet' },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                        {href ? (
                          <a href={href} target="_blank" rel="noreferrer" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                            {value}
                          </a>
                        ) : (
                          <p className="text-gray-900 font-medium">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="font-heading text-2xl text-gray-900 mb-6">Frequently Asked</h3>
                <div className="space-y-5">
                  {[
                    { q: 'How are classes conducted?', a: 'All classes are held live via Zoom or Google Meet. Once accepted, you will receive a session schedule by email.' },
                    { q: 'How do I check my application status?', a: 'Visit the "Check Status" page and enter your email address to see real-time updates on your application.' },
                    { q: 'Can I apply for multiple courses?', a: 'Yes! You can submit separate applications for different courses using the same email.' },
                    { q: 'When will I hear back?', a: 'We review applications within a few days. You will receive an email once your status is updated.' },
                  ].map(({ q, a }) => (
                    <div key={q}>
                      <p className="font-semibold text-gray-900 mb-1">{q}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
