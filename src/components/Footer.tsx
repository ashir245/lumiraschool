import Link from 'next/link'
import { GraduationCap, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl text-white">
                Lumira<span className="text-blue-400">School</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Empowering the next generation of data scientists with cutting-edge education and practical skills.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.instagram.com/lumira_school"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/254759083260"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['/', 'Home'],
                ['/courses', 'Courses'],
                ['/fees', 'Fees Structure'],
                ['/apply', 'Apply Now'],
                ['/status', 'Check Status'],
                ['/contact', 'Contact'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                Eastleigh, Nairobi
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                0759 083 260
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:lumiraschool@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  lumiraschool@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
              <p className="font-medium text-gray-300 mb-1">📹 Classes via:</p>
              <p>Zoom & Google Meet — schedule sent upon acceptance</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} LumiraSchool. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
