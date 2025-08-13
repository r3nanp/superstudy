import Link from "next/link";

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Seu hub
                <span className="bg-gradient-hero bg-clip-text text-transparent block">
                  de conhecimento
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transforme suas leituras em recursos de estudo poderosos. Agrupe
                artigos de qualquer lugar, armazene-os inteligentemente e
                converta-os em resumos, audiobooks e flashcards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="xl" variant="hero" className="group">
                  <Link href="/app">
                    Comece a estudar hoje
                    <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <Link href="/signup">Crie uma conta</Link>
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

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="mx-auto">
              ✨ Funcionalidades poderosas
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Tudo que você precisa para{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                dominar seus estudos
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transforme suas leituras em recursos de estudo poderosos. Agrupe
              artigos de qualquer lugar, armazene-os inteligentemente e
              converta-os em resumos, audiobooks e flashcards.
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
                    <h3 className="text-lg font-semibold">
                      Resumos inteligentes
                    </h3>
                    <p className="text-muted-foreground">
                      Obtenha resumos inteligentes e contextuais de qualquer
                      artigo ou documento
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-gradient-secondary p-3 rounded-lg w-fit">
                      <PhoneIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      Aprendizado de áudio
                    </h3>
                    <p className="text-muted-foreground">
                      Converta qualquer texto em narração de audiobook de alta
                      qualidade
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-gradient-primary p-3 rounded-lg w-fit">
                      <CreditCardIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      Flashcards inteligentes
                    </h3>
                    <p className="text-muted-foreground">
                      Crie flashcards inteligentes com algoritmos de repetição
                      espaçada
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-gradient-secondary p-3 rounded-lg w-fit">
                      <BookOpenIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      Perguntas e respostas interativas
                    </h3>
                    <p className="text-muted-foreground">
                      Perguntas e respostas interativas extraídas do seu
                      conteúdo
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

      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="mx-auto">
              🚀 Processo simples
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Como o superstudy
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                {" "}
                transforma seu aprendizado
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-6 group">
              <div className="bg-gradient-primary p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <BoltIcon className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">1. Agrupe conteúdo</h3>
                <p className="text-muted-foreground">
                  Importe artigos de Substack, emails, conecte com seu Notion,
                  ou faça upload direto
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 group">
              <div className="bg-gradient-secondary p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <CpuChipIcon className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  2. Armazene e organize
                </h3>
                <p className="text-muted-foreground">
                  Categorize e armazene em seu banco de dados de conhecimento
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 group">
              <div className="bg-gradient-primary p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <CpuChipIcon className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">3. Melhore seu estudo</h3>
                <p className="text-muted-foreground">
                  Converta em resumos, audiobooks, flashcards e perguntas e
                  respostas interativas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Pronto para revolucionar
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {" "}
              seu aprendizado?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a milhares de estudantes que já estão transformando sua
            experiência de estudo com IA
          </p>
          <Button asChild size="xl" variant="hero" className="group">
            <Link href="/app">
              Comece sua jornada
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
