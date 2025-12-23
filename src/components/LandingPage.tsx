import React from 'react';
import OnboardingOverlay from './OnboardingOverlay';
import { Users, Briefcase, Star, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

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
      position: 'bottom' as const,
    },
    {
      id: 'post-job',
      target: '[data-onboarding="post-job"]',
      title: 'Hire Top Talent',
      description: 'Post job openings and connect with qualified candidates from around the world.',
      position: 'bottom' as const,
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
            <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
            <button onClick={onAbout} className="text-gray-600 hover:text-blue-600">About</button>
            <button onClick={onContact} className="text-gray-600 hover:text-blue-600">Contact</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-6 py-12 lg:py-20 text-center max-w-4xl">
        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm mb-6">
          Executive Recruiters
        </span>
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">
          Connect Talent with{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Opportunity
          </span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Specialized executive recruitment platform connecting top-tier professionals with leading companies.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button data-onboarding="find-job" onClick={onGetJob} className="btn-primary">
            <Briefcase /> Find Your Dream Job
          </button>
          <button data-onboarding="post-job" onClick={onPostJob} className="btn-secondary">
            <Users /> Hire Top Talent
          </button>
        </div>
      </section>

      {/* Areas of Expertise */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Areas of Expertise</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ExpertCard title="Actuarial & Underwriting" icon={<TrendingUp />} />
            <ExpertCard title="Data Science & Engineering" icon={<Star />} />
            <ExpertCard title="Product Management" icon={<Briefcase />} />
            <ExpertCard title="Catastrophe Modeling" icon={<TrendingUp />} />
            <ExpertCard title="Machine Learning & Predictive Modeling" icon={<Star />} />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose TalentConnect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard title="Smart Matching" icon={<Star />} />
            <FeatureCard title="Career Growth" icon={<TrendingUp />} />
            <FeatureCard title="Verified Quality" icon={<CheckCircle />} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <ol className="space-y-8">
            <li>Register with TalentConnect</li>
            <li>Build Your Professional Profile</li>
            <li>Submit Your Resume</li>
            <li>Get Connected with Opportunities</li>
          </ol>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="flex justify-center mb-6">
            {[1,2,3,4,5].map(i => <Star key={i} className="text-yellow-400" />)}
          </div>
          <p className="italic text-xl mb-6">
            “TalentConnect delivered exceptional actuarial and data candidates, saving us weeks of screening.”
          </p>
          <p className="font-semibold">Sarah</p>
          <p className="text-gray-600">Hiring Director, DataWorks Inc.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <p className="text-gray-400">© 2025 TalentConnect. All rights reserved.</p>
      </footer>
    </div>
  );
};

const ExpertCard = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <div className="p-6 bg-blue-50 rounded-xl text-center">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="font-bold text-xl">{title}</h3>
  </div>
);

const FeatureCard = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <div className="p-6 bg-purple-50 rounded-xl text-center">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="font-bold text-xl">{title}</h3>
  </div>
);

export default LandingPage;
