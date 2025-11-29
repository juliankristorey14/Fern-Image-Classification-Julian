"use client";

import Link from "next/link";
import { Leaf, Camera, Database, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { ImageWithFallback } from "@/components/fig/ImageWithFallback";
import { useEffect, useState } from "react";
import CardSwap, { Card as SwapCard } from "@/components/ui/card-swap";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fernImages = [
    "/imagesrc/fern1.jpg",
    "/imagesrc/fern2.jpg", 
    "/imagesrc/fern3.jpg"
  ];

  const features = [
    {
      icon: Camera,
      title: "Instant Recognition",
      description: "Upload or capture a photo to identify fern species in seconds",
    },
    {
      icon: Database,
      title: "Extensive Database",
      description: "Access detailed information about hundreds of fern species",
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Advanced machine learning for accurate classification",
    },
    {
      icon: Leaf,
      title: "Save History",
      description: "Keep track of all your fern discoveries in one place",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-neutral-100)] to-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10"></div>

        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <h2 className="text-[var(--color-primary)]">FernID</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Sign Up</Button>
              </Link>
            </div>
          </div>
        </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
                Identify Ferns with AI
              </h1>
              <p className="text-xl text-[var(--color-neutral-600)] mb-6 leading-relaxed">
                Discover and learn about fern species using advanced image recognition technology. Simply snap a photo and get instant identification.
              </p>
              <div className="flex flex-wrap gap-4 mt-2 pt-6 sm:pt-8 lg:pt-16">
                <Link href="/register">
                  <Button variant="primary" size="lg" className="relative overflow-hidden group">
                    <span className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></span>
                    <Camera className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Start Scanning</span>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="lg" className="relative overflow-hidden group border-2 border-green-600 hover:bg-green-50 transition-all duration-300 hover:scale-105">
                    <span className="relative z-10">Learn More</span>
                  </Button>
                </Link>
              </div>
            </div>
            <div className={`relative mt-8 lg:mt-16 transform transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <div className="relative w-full h-72 sm:h-80 flex justify-end items-end">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative z-10">
                  {/* CardSwap Hero Component */}
                  <CardSwap
                    width={400}
                    height={280}
                    cardDistance={40}
                    verticalDistance={50}
                    delay={4000}
                    pauseOnHover={true}
                    skewAmount={4}
                    easing="elastic"
                    className="scale-90 sm:scale-100 lg:translate-x-6"
                  >
                    {fernImages.map((image, index) => (
                      <SwapCard key={index} className="overflow-hidden rounded-xl">
                        <img
                          src={image}
                          alt={`Beautiful fern ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(`Failed to load image: ${image}`);
                          }}
                        />
                      </SwapCard>
                    ))}
                  </CardSwap>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <h2 className="mb-4 text-[var(--color-neutral-800)] max-w-2xl mx-auto text-center">
            Why Choose FernID?
          </h2>
          <p className="text-lg text-[var(--color-neutral-600)] max-w-2xl mx-auto text-center">
            Our platform combines cutting-edge AI technology with comprehensive botanical data to provide accurate fern identification.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              hover 
              padding="lg" 
              className={`transform transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center animate-bounce">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-[var(--color-neutral-800)]">{feature.title}</h4>
                <p className="text-[var(--color-neutral-600)]">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-8">
          <p className="text-[var(--color-neutral-600)]">Trusted by enthusiasts and educators</p>
        </div>
        
        {/* Remaining placeholder items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-[var(--color-neutral-100)]" />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4 h-full self-stretch">
            <h2 className="text-[var(--color-neutral-800)] uppercase tracking-wide font-semibold">
              Focus on results, not features
            </h2>
            <p className="text-[var(--color-neutral-600)] pt-5 sm:pt-8 lg:pt-16">
              Learn faster, identify better, and keep your discoveries organized. FernID is designed to help you reach outcomes, not just click buttons.
            </p>
            <ul className="space-y-3 text-[var(--color-neutral-700)] pt-6 sm:pt-8 lg:pt-16">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  ✓
                </span>
                Accurate species identification
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  ✓
                </span>
                Clear guidance and species details
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  ✓
                </span>
                History to track your progress
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-6 auto-rows-fr items-stretch h-full">
            {features.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="h-full">
                <Card padding="lg" hover className="h-full min-h-[140px]">
                  <div className="flex items-start gap-4 h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="text-[var(--color-neutral-800)]">{feature.title}</h5>
                      <p className="text-[var(--color-neutral-600)]">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-[var(--color-neutral-800)]">How it works</h2>
          <p className="text-[var(--color-neutral-600)] pt-6 sm:pt-8 lg:pt-16">Get started in 3 simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 pt-4 sm:pt-6 lg:pt-12">
          {[
            { t: "Upload a photo", d: "Capture or upload a clear fern image." },
            { t: "AI identification", d: "Our model analyzes and classifies the species." },
            { t: "Learn & save", d: "View details and save to your history." },
          ].map((s, i) => (
            <Card key={i} padding="lg" hover>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                  {i + 1}
                </div>
                <div>
                  <h5 className="text-[var(--color-neutral-800)]">{s.t}</h5>
                  <p className="text-[var(--color-neutral-600)]">{s.d}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-[var(--color-neutral-800)]">Loved by people worldwide</h2>
          <p className="text-[var(--color-neutral-600)] pt-4 sm:pt-6 lg:pt-12">What our users say</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 sm:pt-6 lg:pt-12">
          {[
            "A fantastic tool for field trips!",
            "So easy to use and very accurate.",
            "Helped my class learn faster.",
            "Beautiful UI and smooth experience.",
            "My go-to app for fern IDs.",
            "Great for hobbyists and students.",
          ].map((q, i) => (
            <Card key={i} padding="lg">
              <p className="text-[var(--color-neutral-700)]">“{q}”</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-neutral-200)]" />
                <div className="text-sm text-[var(--color-neutral-600)]">User {i + 1}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-[var(--color-neutral-800)]">Frequently Asked Questions</h2>
          <p className="text-[var(--color-neutral-600)] pt-4 sm:pt-6 lg:pt-12">Get answers to common questions</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 pt-4 sm:pt-6 lg:pt-12">
          {[
            {
              q: "How accurate is the model?",
              a: "We target high accuracy for common species and continuously improve with feedback.",
            },
            { q: "Is there a free plan?", a: "Yes, you can start for free and upgrade anytime." },
            { q: "Can I use it offline?", a: "The current app requires an internet connection for analysis." },
            { q: "How do I report a mistake?", a: "Use the feedback form in the app or contact support." },
          ].map((f, i) => (
            <Card key={i} padding="lg">
              <h5 className="text-[var(--color-neutral-800)] mb-2">{f.q}</h5>
              <p className="text-[var(--color-neutral-600)]">{f.a}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2>Ready to Explore the World of Ferns?</h2>
          <p className="text-xl opacity-90 pt-2 sm:pt-4 lg:pt-8 pb-6 sm:pb-8 lg:pb-16">
            Join thousands of plant enthusiasts using FernID to discover and learn about fern species.
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>

      <footer className="bg-white border-t border-[var(--color-neutral-200)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[var(--color-neutral-600)]">This project is developed by Julian Kristorey M. Berino III © 2024 Julian Kristorey M. Berino III. All rights reserved.</p>
            <div className="flex gap-6 text-[var(--color-neutral-600)]">
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

