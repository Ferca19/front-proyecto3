import type React from "react"
import { useEffect, type ReactNode } from "react"
import { Users, Code2, GraduationCap, LogIn } from "lucide-react"
import AuthForm from "../componentes/gestion-usuario/auth-form"
import { Badge } from "../componentes/ui/Badge"


interface LoginPageProps {
  children?: ReactNode
}

const teamMembers = [
  "Blanc, Lorenzo",
  "Cagliero, Fernando",
  "Ledo, Martin",
  "Gomez, Guadalupe",
  "Borgo, Kevin",
  "Mariño, Lautaro",
  "Chiesa, Emilio",
]

const LoginPage: React.FC<LoginPageProps> = () => {
  useEffect(() => {
    localStorage.removeItem("Token")
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-bold text-xl">
                5
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Grupo 5</h1>
                <p className="text-xs text-muted-foreground">Ingeniería y Calidad de Software</p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5" />
              Proyecto 3
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">Sistema de Gestión de Reclamos</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-balance">
                  Plataforma de Gestión de Reclamos <span className="text-primary">Grupo 5</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Sistema integral desarrollado para la gestión de reclamos en tiempo real.
                </p>
              </div>

              {/* Team Members Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Integrantes del Equipo</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {member.split(",")[0].charAt(0)}
                        {member.split(",")[1].trim().charAt(0)}
                      </div>
                      <span className="text-sm text-foreground">{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span>React + TypeScript</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>UTN FRVM</span>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl shadow-2xl border border-border p-8">
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-foreground">
                        <LogIn className="h-7 w-7" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Iniciar Sesión</h2>
                    <p className="text-sm text-muted-foreground">Accede al sistema de reclamos</p>
                  </div>

                  <AuthForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                5
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">Grupo 5 - Proyecto 3</p>
                <p className="text-xs text-muted-foreground">Ingeniería y Calidad de Software</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>UTN Facultad Regional de Villa María</p>
              <p className="text-xs mt-1">2025</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LoginPage
