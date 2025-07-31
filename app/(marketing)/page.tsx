import {
  CreditCardIcon,
  ArrowRightIcon,
  BookOpenIcon,
  PhoneIcon,
  BoltIcon,
  CpuChipIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Card, CardContent } from "@/components/card";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <Badge variant="secondary" className="w-fit">
                🎓 AI-Powered Learning
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Your Personal
                <span className="bg-gradient-hero bg-clip-text text-transparent block">
                  Knowledge Hub
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transform your reading into powerful study resources. Aggregate
                articles from anywhere, store them intelligently, and convert
                them into summaries, audiobooks, and flashcards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="xl" variant="hero" className="group">
                  <Link href="/app">
                    Start Learning Today
                    <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <Link href="/app">Try Demo</Link>
                </Button>
              </div>
            </div>
            {/* <div className="relative animate-float">
                <img
                  src={heroImage}
                  alt="superstudy Interface"
                  className="rounded-2xl shadow-elegant w-full"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-primary p-4 rounded-xl shadow-glow animate-glow">
                  <Bot className="h-8 w-8 text-white" />
                </div>
              </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="mx-auto">
              ✨ Powerful Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything you need to
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                master your studies
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI transforms your reading materials into personalized study
              experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-gradient-primary p-3 rounded-lg w-fit">
                      <FolderIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">AI Summaries</h3>
                    <p className="text-muted-foreground">
                      Get intelligent, context-aware summaries of any article or
                      document
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-gradient-secondary p-3 rounded-lg w-fit">
                      <PhoneIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Audio Learning</h3>
                    <p className="text-muted-foreground">
                      Convert any text into high-quality audiobook-style
                      narration
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-gradient-primary p-3 rounded-lg w-fit">
                      <CreditCardIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Smart Flashcards</h3>
                    <p className="text-muted-foreground">
                      Auto-generated flashcards with spaced repetition
                      algorithms
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-gradient-secondary p-3 rounded-lg w-fit">
                      <BookOpenIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Q&A Generation</h3>
                    <p className="text-muted-foreground">
                      Interactive questions and answers extracted from your
                      content
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* <div className="relative">
                <img
                  src={featuresImage}
                  alt="AI Features"
                  className="rounded-2xl shadow-elegant w-full animate-float"
                />
              </div> */}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="mx-auto">
              🚀 Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              How superstudy
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                {" "}
                transforms your learning
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-6 group">
              <div className="bg-gradient-primary p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <BoltIcon className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">1. Aggregate Content</h3>
                <p className="text-muted-foreground">
                  Import articles from Substack, RSS feeds, email digests, or
                  upload directly
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 group">
              <div className="bg-gradient-secondary p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <CpuChipIcon className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">2. Store & Organize</h3>
                <p className="text-muted-foreground">
                  Automatically categorize and store in your personal knowledge
                  database
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 group">
              <div className="bg-gradient-primary p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <FolderIcon className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">3. AI Enhancement</h3>
                <p className="text-muted-foreground">
                  Transform into summaries, audio, flashcards, and interactive
                  Q&A
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to revolutionize
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {" "}
              your learning?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of students already transforming their study
            experience with AI
          </p>
          <Button asChild size="xl" variant="hero" className="group">
            <Link href="/app">
              Start Your Journey
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
