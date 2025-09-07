import React from 'react';
import OnboardingOverlay from './OnboardingOverlay';
import { Users, Briefcase, Star, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onGetJob: () => void;
  onPostJob: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetJob, onPostJob }) => {
  const [showOnboarding, setShowOnboarding] = React.useState(() => {
    return !localStorage.getItem('onboarding-completed');
  });

  const onboardingSteps = [
    {
      id: 'find-job',
      target: '[data-onboarding="find-job"]',
      title: 'Find Your Dream Job',
      description: 'Discover thousands of job opportunities tailored to your skills and experience.',
      position: 'bottom' as const
    },
    {
      id: 'post-job',
      target: '[data-onboarding="post-job"]',
      title: 'Hire Top Talent',
      description: 'Post job openings and connect with qualified candidates from around the world.',
      position: 'bottom' as const
    },
  ];

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {showOnboarding && (
        <OnboardingOverlay
          steps={onboardingSteps}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      
      {/* Header */}
      <header className="container mx-auto px-4 lg:px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TalentConnect
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-6 py-12 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Executive Recruiters
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700 mb-6 leading-tight">
            Connect Specialized Talent with 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Expert Opportunities
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 mb-8 lg:mb-12 leading-relaxed px-4">
            Specialized executive recruiting platform connecting top-tier professionals with leading companies 
            in actuarial sciences, data engineering, product management, and advanced analytics.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center mb-12 lg:mb-16 px-4">
            <button 
              data-onboarding="find-job"
              onClick={onGetJob}
              className="group px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Briefcase className="w-5 h-5 lg:w-6 lg:h-6" />
              <span>Find Your Dream Job</span>
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              data-onboarding="post-job"
              onClick={onPostJob}
              className="group px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5 lg:w-6 lg:h-6" />
              <span>Hire Top Talent</span>
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 px-4">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-sm lg:text-base text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-2">100K+</div>
              <div className="text-sm lg:text-base text-gray-600">Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">5K+</div>
              <div className="text-sm lg:text-base text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-sm lg:text-base text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Specialized recruitment services across high-demand technical and analytical fields
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4 mb-16">
            <div className="text-center p-6 lg:p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Actuarial & Underwriting</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Connect with certified actuaries, risk analysts, and underwriting professionals across insurance and financial services
              </p>
            </div>
            
            <div className="text-center p-6 lg:p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Star className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Data Science & Engineering</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Elite data scientists, engineers, and analytics professionals specializing in big data and advanced analytics
              </p>
            </div>
            
            <div className="text-center p-6 lg:p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Briefcase className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Product Management</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Strategic product leaders and managers with expertise in technical product development and market strategy
              </p>
            </div>
            
            <div className="text-center p-6 lg:p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Catastrophe Modeling</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Specialized professionals in catastrophe risk modeling, natural disaster analytics, and climate risk assessment
              </p>
            </div>
            
            <div className="text-center p-6 lg:p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100 md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Machine Learning & Predictive Modeling</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                AI/ML engineers, data scientists, and predictive modeling experts driving innovation in automated decision-making
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose TalentConnect?</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Advanced features designed to streamline your recruitment process and accelerate career growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 px-4">
            <div className="text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Star className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Executive-Level Matching</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Sophisticated matching algorithms designed for senior-level positions requiring specialized technical expertise
              </p>
            </div>
            
            <div className="text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Industry Expertise</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Deep understanding of technical requirements and market dynamics in specialized analytical fields
              </p>
            </div>
            
            <div className="text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Executive Network</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Exclusive access to a curated network of senior professionals and C-level executives in technical fields
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <span className="text-lg lg:text-xl font-bold">TalentConnect</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm lg:text-base text-gray-400 mb-2">© 2025 TalentConnect. All rights reserved.</p>
              <p className="text-sm lg:text-base text-gray-400">Connecting talent with opportunity, globally.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;