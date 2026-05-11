import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BookOpen, Users, Video, Award, ArrowRight, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-blue-800/50 text-blue-200 text-sm px-4 py-2 rounded-full mb-6 border border-blue-700/50">
                <Video className="w-4 h-4" />
                Live classes via Zoom & Google Meet
              </div>
              <h1 className="font-heading text-5xl md:text-6xl text-white leading-tight mb-6">
                Master Data Science <span className="text-blue-300 italic">With Us</span>
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
                A comprehensive program to take you from beginner to job-ready data scientist — with personal guidance, live sessions, and real projects.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/apply"
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-blue-500/30 flex items-center gap-2"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/courses"
                  className="px-8 py-4 border border-blue-400/50 text-blue-100 hover:bg-blue-800/40 font-semibold rounded-full transition-all duration-300"
                >
                  View Courses
                </Link>
              </div>
            </div>

            {/* Stats card */}
            <div className="animate-fade-up delay-200 grid grid-cols-2 gap-4">
              {[
                { label: 'Live sessions', value: 'Zoom & Meet', icon: Video },
                { label: 'Support', value: 'WhatsApp', icon: Users },
                { label: 'Projects', value: 'Hands-on', icon: BookOpen },
                { label: 'Guidance', value: 'Personal', icon: Award },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-white">
                  <Icon className="w-6 h-6 text-blue-300 mb-3" />
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-blue-200 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="font-heading text-4xl text-gray-900 mb-4">Why LumiraSchool?</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                We combine structured curriculum with live instruction and personal mentorship.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Video,
                  title: 'Live Online Classes',
                  desc: 'Interactive sessions via Zoom or Google Meet. Ask questions in real time and learn alongside peers.',
                  color: 'blue',
                },
                {
                  icon: BookOpen,
                  title: 'Project-Based Learning',
                  desc: 'Build real data science projects with personal guidance and code reviews from instructors.',
                  color: 'indigo',
                },
                {
                  icon: Users,
                  title: 'Community Support',
                  desc: 'Get help via WhatsApp, peer study groups, and office hours with our instructors.',
                  color: 'violet',
                },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div
                  key={title}
                  className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 bg-${color}-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-${color}-100 transition-colors`}>
                    <Icon className={`w-7 h-7 text-${color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="font-heading text-4xl text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg mb-16">Simple steps to start your data science journey</p>
            <div className="grid md:grid-cols-4 gap-6 relative">
              {[
                { step: '01', title: 'Browse Courses', desc: 'Explore our data science programs and find the right fit.' },
                { step: '02', title: 'Apply Online', desc: 'Fill out the application form. No fees to apply.' },
                { step: '03', title: 'Get Accepted', desc: "We'll review and email you with your status." },
                { step: '04', title: 'Attend Live', desc: 'Join live sessions on Zoom or Google Meet.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="relative">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-4">
                    {step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-3xl mx-auto px-4 text-center text-white">
            <h2 className="font-heading text-4xl mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Applications are open. Check the fees structure and apply today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/fees"
                className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-colors"
              >
                View Fees
              </Link>
              <Link
                href="/apply"
                className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-full border border-blue-400 hover:bg-blue-400 transition-colors flex items-center gap-2"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
