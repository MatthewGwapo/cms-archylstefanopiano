import { useNavigate } from "react-router-dom";
import { HardHat, ArrowRight, FolderKanban, Users, Wallet, Package, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-construction.jpg";

const features = [
  {
    title: "Project Management",
    description: "Create, track, and manage construction projects with milestones and progress tracking.",
    icon: FolderKanban,
  },
  {
    title: "Team Management",
    description: "Manage employee records, attendance, and project assignments.",
    icon: Users,
  },
  {
    title: "Finance Management",
    description: "Track expenses, process payroll, and generate financial reports.",
    icon: Wallet,
  },
  {
    title: "Inventory Management",
    description: "Monitor stock levels, record movements, and receive low-stock alerts.",
    icon: Package,
  },
  {
    title: "Material Management",
    description: "Maintain material catalog and supplier information.",
    icon: Boxes,
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Construction site at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30">
              <HardHat className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-accent-foreground">
                Construction Management System
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <span className="text-accent">METALIFT</span>
            <br />
            <span className="text-white/90">Construction CMS</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Streamline your construction operations with our integrated platform for projects, teams, finances, and inventory.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-orange hover:opacity-90 text-accent-foreground text-lg px-8 py-6 accent-glow"
            >
              Enter Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Five Integrated Subsystems
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete solution to digitize and streamline MetaLift Construction's operations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-300 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-lg bg-accent/10 p-3 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-orange hover:opacity-90 text-accent-foreground"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HardHat className="h-5 w-5 text-accent" />
            <span className="font-bold">METALIFT</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 MetaLift Construction Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
