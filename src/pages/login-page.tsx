import type React from "react"
import { useEffect, type ReactNode } from "react"
import { Users, Code2, GraduationCap, LogIn, Layers, Sparkles } from "lucide-react"
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
    <div className="relative flex flex-col min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* 🎨 Background Gradients for Modern Aesthetic */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-secondary/60 blur-[100px] opacity-60" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-white/40 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary shadow-lg shadow-primary/20 text-onPrimary font-bold text-xl transform hover:scale-105 transition-transform duration-200">
                5
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Grupo 5</h1>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ingeniería y Calidad de Software</p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex items-center gap-2 border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              Proyecto 3 - Ingeniería y Calidad de Software
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 lg:py-0 relative z-10">
        <div className="w-full max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Info */}
            <div className="space-y-10 animate-fade-in-up order-2 lg:order-1">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Sistema Online v2.0
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-balance tracking-tight">
                  Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">Reclamos</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Plataforma integral optimizada para el seguimiento, resolución y análisis de reclamos en tiempo real.
                </p>
              </div>

              {/* Team Members Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground/80 uppercase tracking-widest">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Equipo de Desarrollo</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-4 p-3 rounded-xl bg-white/40 border border-white/50 shadow-sm hover:shadow-md hover:bg-white/60 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary text-sm font-bold group-hover:scale-110 transition-transform">
                        {member.split(",")[0].charAt(0)}
                        {member.split(",")[1].trim().charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors">{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies / Features */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-border/50">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 text-sm font-medium text-muted-foreground">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span>React + TS</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 text-sm font-medium text-muted-foreground">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Tailwind CSS</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 text-sm font-medium text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>UTN FRVM</span>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center items-center order-1 lg:order-2 perspective-1000">
              <div className="w-full max-w-md transform transition-all hover:scale-[1.01] duration-500">
                <div className="relative bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-primary/10 border border-white/50 p-1">
                  
                  {/* Decorative line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-b-full"></div>

                  <div className="px-8 py-10 rounded-[1.9rem] bg-gradient-to-b from-white/50 to-transparent">
                    <div className="text-center mb-10">
                      <div className="inline-flex justify-center mb-6 p-4 rounded-2xl bg-primary/5 ring-1 ring-primary/10">
                        <LogIn className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Bienvenido</h2>
                      <p className="text-base text-muted-foreground">Ingresa tus credenciales para acceder</p>
                    </div>

                    <AuthForm />
                  </div>
                </div>
                
                {/* Floating Elements behind card */}
                <div className="absolute -z-10 top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -z-10 -bottom-5 -left-5 w-32 h-32 bg-secondary rounded-full blur-2xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/20 backdrop-blur-sm py-6 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">Grupo 5 &copy; 2025</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center md:text-right">
              <p>UTN Facultad Regional de Villa María</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LoginPage
