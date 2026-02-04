import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#14161a] text-white selection:bg-[#1e3f86] selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-[#1e3f86] p-1.5 rounded-l-3xl rounded-r-xs shadow-xl">
            <Image
              src="/Tasker.svg"
              alt="Tasker logo"
              className="shadow-2xl"
              width={28}
              height={28}
            />
          </div>
          <span className="text-xl font-bold tracking-tight">Tasker</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/signin" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-[#1e3f86] hover:bg-[#2a56b4] text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-900/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next Generation Automation Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Automate Everything <br /> with <span className="text-[#1e3f86]">Tasker</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
          Connect your favorite apps and automate complex workflows with our powerful,
          next-generation automation engine. Built for speed, security, and scale.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href="/auth/signin"
            className="px-8 py-4 bg-[#c2410c] hover:bg-[#ea580c] text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-xl shadow-orange-900/20 flex items-center gap-2"
          >
            Start Building for Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
          >
            View Documentation
          </Link>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 bg-[#1e3f86]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-400 leading-relaxed">Execute complex workflows in milliseconds with our optimized node engine.</p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-orange-500/50 transition-all group">
            <div className="w-12 h-12 bg-[#c2410c]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
            <p className="text-gray-400 leading-relaxed">Your data is safe with us. We use industry-standard encryption and protocols.</p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold mb-3">Modular Design</h3>
            <p className="text-gray-400 leading-relaxed">Extend functionality with custom nodes or choose from hundreds of integrations.</p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="bg-gray-600 p-1 rounded-l-2xl rounded-r-xs">
              <Image
                src="/Tasker.svg"
                alt="Tasker logo"
                width={20}
                height={20}
              />
            </div>
            <span className="font-bold">Tasker</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 Tasker Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
