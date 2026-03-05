import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Activity,
  Wind,
  Heart,
  Map,
  Leaf,
  Gauge,
  Factory,
  TreePine,
  Users,
  Target,
  LineChart,
  Globe2,
  ArrowRight,
  Sparkles,
  Cloud,
  Sun,
  CloudRain,
  Wind as WindIcon
} from 'lucide-react'
import { ResearchPapersSection } from '@/components/layout/ResearchPapersSection'

// Types
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
  trend?: 'up' | 'down' | 'neutral'
}

interface BenefitItemProps {
  icon: React.ReactNode
  text: string
}

// Reusable Components
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative">
      <div className="mb-4 inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </Card>
)

const StatCard = ({ icon, value, label, trend }: StatCardProps) => (
  <Card className="border-0 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm dark:from-gray-900/90 dark:to-emerald-900/20 p-6">
    <div className="flex items-start justify-between">
      <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
        {icon}
      </div>
      {trend && (
        <span className={`text-sm ${
          trend === 'up' ? 'text-amber-500' : 
          trend === 'down' ? 'text-emerald-500' : 
          'text-gray-500'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}
        </span>
      )}
    </div>
    <div className="mt-4">
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  </Card>
)

const BenefitItem = ({ icon, text }: BenefitItemProps) => (
  <div className="flex items-center gap-3">
    <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
      {icon}
    </div>
    <span className="text-gray-700 dark:text-gray-300">{text}</span>
  </div>
)

const SectionContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <section className={`relative py-20 ${className}`}>
    <div className="container mx-auto px-4">
      {children}
    </div>
  </section>
)

// Main Component
export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
      {/* Full-width background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ objectPosition: 'center' }}
      >
        <source src="/public/videos/hero-video.mp4" type="video/mp4" />
        {/* Optionally add a fallback message */}
        Your browser does not support the video tag.
      </video>
      {/* Optional overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/20 to-gray-950/40 z-0"></div>
      {/* Hero Section */}
      <SectionContainer className="pt-3">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center min-h-screen">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              <span>Environmental Intelligence Platform</span>
            </div>
            
            <h1 className="text-5xl font-bold leading-tight text-white dark:text-white lg:text-6xl">
              Air Quality Research 
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"> & Analytics</span>
              <br />Platform – Bihar
            </h1>
            
            <p className="text-xl text-gray-400 dark:text-gray-300 max-w-2xl">
              Advanced environmental intelligence platform analyzing air pollution trends, 
              pollutant concentrations, and health risk exposure across all 38 districts of Bihar.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                <Link to="/dashboard">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400">
                <Link to="/research">
                  View Research Insights
                </Link>
              </Button>
            </div>

            {/* Floating Stats */}
            <div className="flex gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-400 dark:text-gray-400">38 Districts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                <span className="text-sm text-gray-400 dark:text-gray-400">300+ Stations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-sky-500"></div>
                <span className="text-sm text-gray-400 dark:text-gray-400">5 Years Data</span>
              </div>
            </div>
          </div>

          {/* Right Content - Animated Icons */}
          <div className="relative h-[400px] lg:h-[500px]">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
            
            {/* Floating Icons */}
            <div className="relative h-full">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Central Icon */}
                  <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl">
                    <Leaf className="h-16 w-16 text-white" />
                  </div>
                  
                  {/* Orbiting Icons */}
                  <div className="absolute -left-16 -top-16 animate-pulse">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur dark:bg-gray-800/90">
                      <WindIcon className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>
                  
                  <div className="absolute -right-16 -top-16 animate-pulse delay-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur dark:bg-gray-800/90">
                      <Cloud className="h-8 w-8 text-teal-600" />
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 animate-pulse delay-200">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur dark:bg-gray-800/90">
                      <Factory className="h-8 w-8 text-sky-600" />
                    </div>
                  </div>
                  
                  <div className="absolute -left-20 top-1/2 -translate-y-1/2 animate-pulse delay-300">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur dark:bg-gray-800/90">
                      <Sun className="h-8 w-8 text-amber-600" />
                    </div>
                  </div>
                  
                  <div className="absolute -right-20 top-1/2 -translate-y-1/2 animate-pulse delay-500">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur dark:bg-gray-800/90">
                      <CloudRain className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Key Features Section */}
      <SectionContainer className="bg-gradient-to-b from-white to-emerald-50/50 dark:from-gray-900 dark:to-emerald-950/20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive Air Quality Intelligence
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Advanced tools and analytics for environmental research and policy making
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Activity className="h-6 w-6" />}
            title="AQI Analytics"
            description="Real-time AQI monitoring and historical trends across all districts with detailed breakdowns."
          />
          <FeatureCard
            icon={<Wind className="h-6 w-6" />}
            title="Pollutant Analysis"
            description="Comprehensive analysis of PM2.5, PM10, SO2, NO2, CO, and O3 concentrations."
          />
          <FeatureCard
            icon={<Heart className="h-6 w-6" />}
            title="Health Risk Modeling"
            description="Population exposure assessment and health risk scores for evidence-based policy."
          />
          <FeatureCard
            icon={<Map className="h-6 w-6" />}
            title="Interactive District Map"
            description="Geospatial visualization of air quality patterns across all 38 districts of Bihar."
          />
        </div>
      </SectionContainer>

      {/* Bihar AQI Snapshot */}
      <SectionContainer>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Bihar Air Quality at a Glance
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Key environmental indicators across the state
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Gauge className="h-6 w-6" />}
            value="156"
            label="Average AQI"
            trend="up"
          />
          <StatCard
            icon={<Factory className="h-6 w-6" />}
            value="Patna"
            label="Most Polluted District"
          />
          <StatCard
            icon={<TreePine className="h-6 w-6" />}
            value="Gaya"
            label="Cleanest District"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            value="284"
            label="Monitoring Stations"
          />
        </div>
      </SectionContainer>

    <ResearchPapersSection></ResearchPapersSection>

      {/* Research Platform Benefits */}
      <SectionContainer className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-emerald-100">
            Built for researchers, policymakers, and environmental analysts
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <BenefitItem
            icon={<Target className="h-5 w-5" />}
            text="Environmental Policy Support"
          />
          <BenefitItem
            icon={<LineChart className="h-5 w-5" />}
            text="Data Driven Insights"
          />
          <BenefitItem
            icon={<Globe2 className="h-5 w-5" />}
            text="Public Transparency"
          />
          <BenefitItem
            icon={<Heart className="h-5 w-5" />}
            text="Health Risk Awareness"
          />
        </div>
      </SectionContainer>

      {/* Interactive Map Preview */}
      <SectionContainer>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Explore Air Quality Across Bihar
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Interactive map visualization with district-level data, monitoring stations, 
              and real-time AQI updates.
            </p>
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link to="/map">
                Open Map Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="relative">
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 relative">
                {/* Map Placeholder with Districts */}
                <div className="absolute inset-0 p-6">
                  <div className="grid grid-cols-3 gap-2 h-full">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm p-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 mb-1"></div>
                        <div className="h-1 w-6 bg-gray-400/50 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Overlay Text */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Current AQI</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">156 • Unhealthy</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Patna</div>
                      <div className="text-xs text-emerald-600">+12 monitoring stations</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </SectionContainer>

      {/* Call to Action */}
      <SectionContainer className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Start Exploring Bihar's Air Quality Data
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Access comprehensive environmental intelligence for research, policy making, and public awareness.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50">
              <Link to="/dashboard">
                Open Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/analytics">
                Explore Analytics
              </Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}