import { Button } from "@/components/ui/button";
import { Rocket, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Sección de Bienvenida */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Bienvenido a <span className="text-blue-600">Nuestra Plataforma</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
          La mejor solución para gestionar y optimizar tu trabajo de manera eficiente.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="default" className="px-6 py-3 flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Empezar Ahora
          </Button>
          <Button variant="outline" className="px-6 py-3 flex items-center gap-2">
            Más Información
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Sección de Características */}
      <section className="mt-16 grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
          <Sparkles className="w-10 h-10 mx-auto text-blue-500" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Innovador</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Utilizamos las últimas tecnologías para brindarte la mejor experiencia.
          </p>
        </div>
        <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
          <CheckCircle className="w-10 h-10 mx-auto text-green-500" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Eficiente</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Optimiza tus procesos y ahorra tiempo con nuestra plataforma.
          </p>
        </div>
        <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
          <Rocket className="w-10 h-10 mx-auto text-purple-500" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Escalable</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Diseñado para crecer contigo y adaptarse a tus necesidades.
          </p>
        </div>
      </section>
    </div>
  );
}
