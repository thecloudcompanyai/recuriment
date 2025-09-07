import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import JobSeekerDashboard from './components/JobSeekerDashboard';
import EmployerDashboard from './components/EmployerDashboard';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
  tags: string[];
  category: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'job-seeker' | 'employer'>('landing');
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Chief Actuary',
      company: 'Global Insurance Group',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$200k - $280k',
      posted: '2 days ago',
      description: 'Lead our actuarial team in developing sophisticated risk models and pricing strategies for our global insurance portfolio. Drive strategic initiatives and provide executive-level insights.',
      requirements: ['FSA/FCAS certification', 'Executive leadership', '15+ years experience', 'Advanced analytics'],
      tags: ['Executive', 'Insurance', 'Leadership'],
      category: 'Actuarial & Underwriting'
    },
    {
      id: '2',
      title: 'VP of Data Science',
      company: 'FinTech Innovations',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$180k - $250k',
      posted: '1 week ago',
      description: 'Lead our data science organization in building next-generation ML models for financial risk assessment and customer analytics. Manage a team of 20+ data scientists.',
      requirements: ['PhD in Data Science/Statistics', 'Team leadership', 'MLOps expertise', '10+ years experience'],
      tags: ['Executive', 'FinTech', 'Machine Learning'],
      category: 'Data Science & Data Engineering'
    },
    {
      id: '3',
      title: 'Senior Product Manager - Catastrophe Models',
      company: 'RiskTech Solutions',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$140k - $180k',
      posted: '3 days ago',
      description: 'Drive product strategy for our catastrophe modeling platform used by major reinsurers globally. Work with climate scientists and actuaries to enhance model accuracy.',
      requirements: ['Product management', 'Catastrophe modeling', 'Insurance domain', '8+ years experience'],
      tags: ['Product', 'Insurance', 'Climate Risk'],
      category: 'Product Management'
    },
    {
      id: '4',
      title: 'Principal ML Engineer - Predictive Analytics',
      company: 'InsurTech Dynamics',
      location: 'Remote',
      type: 'Full-time',
      salary: '$160k - $220k',
      posted: '5 days ago',
      description: 'Build and deploy large-scale machine learning systems for insurance pricing and claims prediction. Lead technical architecture for our predictive modeling platform.',
      requirements: ['ML Engineering', 'Python/Scala', 'Cloud platforms', 'Insurance analytics'],
      tags: ['Remote', 'ML Engineering', 'Senior Level'],
      category: 'Machine Learning & Predictive Modeling'
    },
    {
      id: '5',
      title: 'Senior Underwriter - Specialty Lines',
      company: 'Premier Risk Partners',
      location: 'Chicago, IL',
      type: 'Full-time',
      salary: '$120k - $160k',
      posted: '1 week ago',
      description: 'Underwrite complex specialty insurance risks using advanced analytics and catastrophe models. Collaborate with actuarial teams on pricing strategies.',
      requirements: ['Underwriting experience', 'Specialty lines', 'Risk assessment', 'Analytics tools'],
      tags: ['Insurance', 'Risk Management', 'Analytics'],
      category: 'Actuarial & Underwriting'
    }
  ]);

  const addJob = (newJob: Omit<Job, 'id' | 'posted'>) => {
    const job: Job = {
      ...newJob,
      id: Date.now().toString(),
      posted: 'Just now',
      category: newJob.category || 'General'
    };
    setJobs(prev => [job, ...prev]);
  };

  return (
    <div className="min-h-screen">
      {currentView === 'landing' && (
        <LandingPage 
          onGetJob={() => setCurrentView('job-seeker')}
          onPostJob={() => setCurrentView('employer')}
        />
      )}
      {currentView === 'job-seeker' && (
        <JobSeekerDashboard 
          onBack={() => setCurrentView('landing')} 
          jobs={jobs}
        />
      )}
      {currentView === 'employer' && (
        <EmployerDashboard 
          onBack={() => setCurrentView('landing')} 
          onAddJob={addJob}
        />
      )}
    </div>
  );
}

export default App;