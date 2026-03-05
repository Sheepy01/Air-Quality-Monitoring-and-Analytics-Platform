import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  BookOpen,
  Download,
  ExternalLink,
  Calendar,
  Users,
  FileText,
  Quote,
  Award,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react'

interface ResearchPaper {
  id: string
  title: string
  authors: string[]
  journal: string
  year: number
  citations: number
  doi: string
  abstract: string
  thumbnail: string
  tags: string[]
  readingTime: string
  impact: 'high' | 'medium' | 'low'
}

const researchPapers: ResearchPaper[] = [
  {
    id: '1',
    title: 'Long-term Trends of PM2.5 and Its Impact on Respiratory Health in Bihar',
    authors: ['Dr. Priya Singh', 'Dr. Rajesh Kumar', 'Prof. Anil Sharma'],
    journal: 'Environmental Research Letters',
    year: 2024,
    citations: 45,
    doi: '10.1088/1748-9326/acb123',
    abstract: 'This comprehensive study analyzes 7 years of PM2.5 data across 38 districts in Bihar, establishing correlation with respiratory disease incidence. The research reveals critical seasonal patterns and identifies districts with highest health risk exposure.',
    thumbnail: 'pm25-trends',
    tags: ['PM2.5', 'Health Impact', 'Long-term Study'],
    readingTime: '12 min read',
    impact: 'high'
  },
  {
    id: '2',
    title: 'Spatial Distribution of NO2 Concentrations in Urban Centers of Bihar',
    authors: ['Dr. Amit Kumar', 'Prof. Suman Gupta', 'Dr. Neha Pandey'],
    journal: 'Atmospheric Environment',
    year: 2023,
    citations: 28,
    doi: '10.1016/j.atmosenv.2023.119456',
    abstract: 'Mapping NO2 pollution across 15 major urban centers in Bihar using ground-based monitoring and satellite data. The study identifies traffic corridors and industrial zones as primary emission sources.',
    thumbnail: 'no2-distribution',
    tags: ['NO2', 'Urban Pollution', 'Spatial Analysis'],
    readingTime: '10 min read',
    impact: 'medium'
  },
  {
    id: '3',
    title: 'Health Risk Assessment of Multi-Pollutant Exposure in Rural Bihar',
    authors: ['Dr. Meera Reddy', 'Prof. Sanjay Mishra', 'Dr. Vikram Singh'],
    journal: 'The Lancet Planetary Health',
    year: 2024,
    citations: 67,
    doi: '10.1016/S2542-5196(24)00078-9',
    abstract: 'First comprehensive health risk assessment in rural Bihar examining combined exposure to PM2.5, PM10, and SO2. Study covers 200 villages and proposes intervention strategies.',
    thumbnail: 'health-risk',
    tags: ['Health Risk', 'Rural Areas', 'Policy Recommendations'],
    readingTime: '15 min read',
    impact: 'high'
  },
  {
    id: '4',
    title: 'Seasonal Variation of O3 and Its Precursors in Indo-Gangetic Plain',
    authors: ['Dr. Arjun Nair', 'Prof. Rashmi Singh', 'Dr. Divya Sharma'],
    journal: 'Science of the Total Environment',
    year: 2023,
    citations: 34,
    doi: '10.1016/j.scitotenv.2023.167890',
    abstract: 'Analysis of ground-level ozone formation and transport mechanisms in the Indo-Gangetic Plain region, with focus on agricultural residue burning periods.',
    thumbnail: 'ozone-study',
    tags: ['Ozone', 'Seasonal', 'Agricultural Burning'],
    readingTime: '14 min read',
    impact: 'medium'
  }
]

const getImpactColor = (impact: string) => {
  switch(impact) {
    case 'high': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'low': return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getThumbnailGradient = (type: string) => {
  const gradients: Record<string, string> = {
    'pm25-trends': 'from-emerald-500 to-teal-500',
    'no2-distribution': 'from-blue-500 to-cyan-500',
    'health-risk': 'from-amber-500 to-orange-500',
    'ozone-study': 'from-purple-500 to-pink-500'
  }
  return gradients[type] || 'from-emerald-500 to-teal-500'
}

export function ResearchPapersSection() {
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-950 dark:via-emerald-950/10 dark:to-gray-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mb-4">
            <BookOpen className="h-4 w-4" />
            <span>Latest Research</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Scientific Publications
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Peer-reviewed research on air quality, health impacts, and environmental policy in Bihar
          </p>
        </div>

        {/* Research Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {researchPapers.map((paper) => (
            <Card
              key={paper.id}
              className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 cursor-pointer"
              onClick={() => setSelectedPaper(paper)}
            >
              {/* Thumbnail with Gradient */}
              <div className={`relative h-48 bg-gradient-to-br ${getThumbnailGradient(paper.thumbnail)} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                
                {/* Abstract Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16" />
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20" />
                </div>

                {/* Paper Icon */}
                <div className="absolute bottom-4 right-4">
                  <div className="rounded-full bg-white/90 backdrop-blur p-3 shadow-lg">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>

                {/* Year Badge */}
                <div className="absolute top-4 left-4 rounded-full bg-black/50 backdrop-blur px-3 py-1 text-sm text-white">
                  {paper.year}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Impact Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(paper.impact)}`}>
                    Impact: {paper.impact}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {paper.readingTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {paper.title}
                </h3>

                {/* Authors */}
                <div className="flex items-start gap-2 mb-3">
                  <Users className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                    {paper.authors.join(', ')}
                  </p>
                </div>

                {/* Journal */}
                <div className="flex items-start gap-2 mb-4">
                  <BookOpen className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic line-clamp-1">
                    {paper.journal}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {paper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Citations and Read More */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Quote className="h-4 w-4" />
                    <span>{paper.citations} citations</span>
                  </div>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 group-hover:underline">
                    Read more →
                  </span>
                </div>
              </div>

              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 transition-all duration-500 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950"
          >
            View All Publications
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Detailed Paper Dialog */}
      <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPaper && (
            <>
              {/* Header with Gradient */}
              <div className={`-mx-6 -mt-6 px-6 pt-6 pb-8 bg-gradient-to-br ${getThumbnailGradient(selectedPaper.thumbnail)} relative overflow-hidden rounded-t-lg`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full bg-white/90 backdrop-blur ${getImpactColor(selectedPaper.impact)}`}>
                      Impact: {selectedPaper.impact}
                    </span>
                    <span className="text-xs text-white/90 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedPaper.readingTime}
                    </span>
                  </div>
                  
                  <DialogTitle className="text-2xl font-bold text-white mb-4">
                    {selectedPaper.title}
                  </DialogTitle>
                  
                  <DialogDescription className="text-white/90 text-lg mb-2">
                    {selectedPaper.journal} • {selectedPaper.year}
                  </DialogDescription>
                  
                  <div className="flex items-center gap-2 text-white/80">
                    <Users className="h-4 w-4" />
                    <span>{selectedPaper.authors.join(' • ')}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 py-6">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedPaper.citations}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Citations</div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-6 w-6 mx-auto" />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Altmetric</div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      <Eye className="h-6 w-6 mx-auto" />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">1.2k Views</div>
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    Abstract
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedPaper.abstract}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaper.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Published
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedPaper.year}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      DOI
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white font-mono text-sm">
                      {selectedPaper.doi}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Publisher
                  </Button>
                  <Button variant="ghost" className="text-gray-600">
                    <Quote className="mr-2 h-4 w-4" />
                    Cite
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}