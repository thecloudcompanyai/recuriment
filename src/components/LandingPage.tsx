import React from 'react';
import OnboardingOverlay from './OnboardingOverlay';
import { Users, Briefcase, Star, TrendingUp, ArrowRight, CheckCircle, Sparkles, Bot, FileText, DollarSign } from 'lucide-react';

interface LandingPageProps {
  onGetJob: () => void;
  onPostJob: () => void;
  onAbout: () => void;
  onContact: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetJob, onPostJob, onAbout, onContact }) => {
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
            <button onClick={onAbout} className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">About</button>
            <button onClick={onContact} className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Contact</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-6 py-12 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
              Executive Recruiters
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Platform
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Connect Talent with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Opportunity
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-4 leading-relaxed px-4">
            Specialized executive recruitment platform connecting top-tier professionals with leading companies in high-demand fields.
            Expert matching for actuarial, data science, product management, and advanced analytics roles.
          </p>
          <p className="text-base lg:text-lg text-purple-700 font-semibold mb-8 lg:mb-12 leading-relaxed px-4">
            ✨ Powered by AI: Resume building, job matching, career guidance, and salary insights—all automated for your success.
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

      {/* AI-Powered Features Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              AI-Powered Recruitment
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Platform</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Experience the future of recruitment with cutting-edge AI technology that streamlines every step of your career journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4 max-w-7xl mx-auto">
            {/* AI Resume Builder */}
            <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-2">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">AI Resume Builder</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">
                Create professional, ATS-optimized resumes in minutes. Our AI analyzes your experience and crafts compelling resumes tailored to your target roles.
              </p>
              <div className="flex items-center text-purple-600 font-semibold text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Powered by AI</span>
              </div>
            </div>

            {/* AI Resume Rating */}
            <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-2">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">AI Resume Rating</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">
                Get instant, personalized feedback on your resume. AI analyzes how well your resume matches specific job requirements and suggests improvements.
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>AI Analysis</span>
              </div>
            </div>

            {/* AI Career Assistant */}
            <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-2">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">AI Career Assistant</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">
                Your 24/7 career coach. Get personalized advice on job search strategies, skill development, interview prep, and career path planning.
              </p>
              <div className="flex items-center text-green-600 font-semibold text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>AI Chatbot</span>
              </div>
            </div>

            {/* AI Job Description Generator */}
            <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-2">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">AI Job Description Generator</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">
                Employers can instantly generate compelling, professional job descriptions tailored to their specific roles and requirements.
              </p>
              <div className="flex items-center text-orange-600 font-semibold text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>For Employers</span>
              </div>
            </div>

            {/* AI Salary Benchmark */}
            <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-2">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">AI Salary Benchmark</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">
                Get real-time salary insights. AI analyzes market data to provide competitive salary ratings and recommendations for your role and location.
              </p>
              <div className="flex items-center text-yellow-600 font-semibold text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Market Intelligence</span>
              </div>
            </div>

            {/* AI Smart Matching */}
            <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-2">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">AI Smart Matching</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">
                Advanced algorithms match candidates with opportunities based on skills, experience, culture fit, and career goals for perfect placements.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Intelligent Matching</span>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-16 text-center">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg">
              <span className="flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Experience the Power of AI-Driven Recruitment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Expertise Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Specialized recruitment in high-demand technical and analytical fields
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4">
            <div className="text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow border border-blue-200">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Actuarial & Underwriting</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Risk assessment professionals, actuaries, and underwriting specialists for insurance and financial services
              </p>
            </div>

            <div className="text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow border border-green-200">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Star className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Data Science & Engineering</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Data scientists, engineers, and analysts who transform complex data into actionable business insights
              </p>
            </div>

            <div className="text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 hover:shadow-lg transition-shadow border border-teal-200">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Briefcase className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Product Management</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Strategic product leaders who drive innovation and deliver exceptional user experiences
              </p>
            </div>

            <div className="text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow border border-orange-200">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Catastrophe Modeling</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Specialists in risk modeling, natural disaster analysis, and catastrophic event prediction
              </p>
            </div>

            <div className="text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 hover:shadow-lg transition-shadow border border-cyan-200 md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Star className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Machine Learning & Predictive Modeling</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                AI/ML engineers and predictive modeling experts building next-generation intelligent systems
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose TalentConnect Section */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 mr-2" />
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Why Choose TalentConnect?</h2>
              <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 ml-2" />
            </div>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              AI-powered features designed to streamline your recruitment process and accelerate career growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 px-4">
            <div data-onboarding="smart-matching" className="text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-shadow border-2 border-purple-200">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">AI Smart Matching</h3>
              <p className="text-xs text-purple-700 font-semibold mb-3">Powered by Advanced AI</p>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Intelligent algorithms analyze skills, experience, and culture fit to ensure perfect job-candidate matches with unprecedented accuracy
              </p>
            </div>

            <div data-onboarding="career-growth" className="text-center p-6 lg:p-8 rounded-2xl bg-white hover:shadow-lg transition-shadow border border-gray-200">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">AI Career Growth</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                AI-powered tools for skill development, personalized career guidance, portfolio building, and intelligent career advancement tracking
              </p>
            </div>

            <div className="text-center p-6 lg:p-8 rounded-2xl bg-white hover:shadow-lg transition-shadow border border-gray-200">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Verified Quality</h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                Rigorous verification process ensures authentic profiles and legitimate job opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg lg:text-xl text-gray-600">Simple steps to find your next opportunity</p>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <div className="flex gap-4 lg:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg lg:text-xl flex-shrink-0">
                    1
                  </div>
                  <div className="hidden lg:block w-1 bg-gray-200 flex-grow mt-2" style={{minHeight: '80px'}}></div>
                </div>
                <div className="pb-6 lg:pb-8 pt-1 lg:pt-2">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Register with TalentConnect</h3>
                  <p className="text-base lg:text-lg text-gray-600">Share basic details about your background and career goals when you join.</p>
                </div>
              </div>

              <div className="flex gap-4 lg:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg lg:text-xl flex-shrink-0">
                    2
                  </div>
                  <div className="hidden lg:block w-1 bg-gray-200 flex-grow mt-2" style={{minHeight: '80px'}}></div>
                </div>
                <div className="pb-6 lg:pb-8 pt-1 lg:pt-2">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Build Your Professional Profile</h3>
                  <p className="text-base lg:text-lg text-gray-600">Create a detailed profile so our team understands your skills, experience, and what you are looking for.</p>
                </div>
              </div>

              <div className="flex gap-4 lg:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg lg:text-xl flex-shrink-0">
                    3
                  </div>
                  <div className="hidden lg:block w-1 bg-gray-200 flex-grow mt-2" style={{minHeight: '80px'}}></div>
                </div>
                <div className="pb-6 lg:pb-8 pt-1 lg:pt-2">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Submit Your Resume</h3>
                  <p className="text-base lg:text-lg text-gray-600">Upload your resume for review by our recruitment consultants.</p>
                </div>
              </div>

              <div className="flex gap-4 lg:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg lg:text-xl flex-shrink-0">
                    4
                  </div>
                </div>
                <div className="pt-1 lg:pt-2">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Get Connected with Opportunities</h3>
                  <p className="text-base lg:text-lg text-gray-600">Our team connects you with suitable roles and keeps you informed throughout the hiring process.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:mt-16 p-6 lg:p-8 bg-blue-50 rounded-2xl border border-blue-200">
              <p className="text-center text-lg text-gray-800">Our team works behind the scenes to help you land the right opportunity faster.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Testimonial */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex justify-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-xl lg:text-2xl text-gray-800 leading-relaxed mb-8 italic">
              "TalentConnect understood our requirement for actuarial and data roles exceptionally well. The candidates shared had strong foundations in actuarial modeling and data analytics, which saved us significant screening time. The entire process was smooth and efficient from start to finish."
            </p>
            <p className="text-lg font-semibold text-gray-900">Sarah</p>
            <p className="text-gray-600">Hiring Director, DataWorks Inc., Austin TX</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-8 lg:mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <span className="text-lg lg:text-xl font-bold">TalentConnect</span>
              </div>
              <p className="text-gray-400 text-sm lg:text-base">Connecting professionals with opportunity across North America.</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Useful Links</h4>
              <nav className="space-y-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Home</a>
                <button onClick={onAbout} className="text-gray-400 hover:text-white transition-colors text-sm lg:text-base block bg-transparent border-0 cursor-pointer">About Us</button>
                <button onClick={onContact} className="text-gray-400 hover:text-white transition-colors text-sm lg:text-base block bg-transparent border-0 cursor-pointer">Contact</button>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm lg:text-base block">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm lg:text-base block">Terms</a>
              </nav>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 lg:pt-12">
            <div className="mb-4">
              <p className="text-gray-400 text-sm lg:text-base mb-4">We would love to hear from you. Share your feedback or let us know how we can help.</p>
            </div>
            <p className="text-gray-500 text-sm lg:text-base">© 2025 TalentConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
