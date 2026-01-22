import React, { useState } from 'react';
import OnboardingOverlay from './OnboardingOverlay';
import { GoogleGenerativeAI } from '@google/generative-ai';
import SalaryBenchmark from './SalaryBenchmark';
import type { Job, SalaryRating } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Sparkles,
  Loader2,
  Save,
  Eye,
  Users,
  Briefcase,
  CheckCircle,
  Plus,
  Menu,
  X,
  TrendingUp,
  Plane,
  Award,
  Landmark,
  Upload,
  Phone,
  Mail,
  Paperclip
} from 'lucide-react';

interface EmployerDashboardProps {
  onBack: () => void;
  onAddJob: (job: Omit<Job, 'id' | 'posted'>) => void;
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  description: string;
  type: string;
  posted: string;
  status: 'active' | 'draft' | 'closed';
  salaryRating?: SalaryRating;
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onBack, onAddJob }) => {
  const [activeTab, setActiveTab] = useState('post-job');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('employer-onboarding-completed');
  });
  const [salaryRating, setSalaryRating] = useState<SalaryRating | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientLogin, setClientLogin] = useState({
    email: '',
    password: ''
  });
  const [currentStep, setCurrentStep] = useState(1); // 1 = Job Posting Form, 2 = Search Type Selection
  const [selectedSearchType, setSelectedSearchType] = useState<string>('');
  const [isParsingDocument, setIsParsingDocument] = useState(false);
  const [showRecruiterContact, setShowRecruiterContact] = useState(false);

  const onboardingSteps = [
    {
      id: 'post-job',
      target: '[data-onboarding="post-job"]',
      title: 'Post New Job',
      description: 'Create attractive job postings to find the perfect candidates for your company.',
      position: 'left' as const
    },
    {
      id: 'manage-jobs',
      target: '[data-onboarding="manage-jobs"]',
      title: 'Manage Jobs',
      description: 'View and manage all your job postings, track applications, and monitor performance.',
      position: 'left' as const
    }
  ];

  const handleOnboardingComplete = () => {
    localStorage.setItem('employer-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('employer-onboarding-completed', 'true');
    setShowOnboarding(false);
  };
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    country: 'United States',
    city: '',
    state: '',
    locationType: 'On-site',
    daysInOffice: '',
    travelPercentage: '',
    salary: '',
    currency: 'USD',
    customCurrency: '',
    baseSalaryMin: '',
    baseSalaryMax: '',
    bonusTarget: '',
    bonusMax: '',
    bonusType: 'amount',
    benefits: {
      pension: false,
      health: false,
      dental: false,
      vacation: ''
    },
    perks: {
      rsuOrStockOptions: '',
      equityOrProfitSharing: '',
      signOnBonus: '',
      relocationAssistance: '',
      temporaryHousing: '',
      otherPerks: '',
      visaSponsorship: ''
    },
    seniorityLevel: '',
    directReports: '',
    indirectReports: '',
    reportsToName: '',
    reportsToTitle: '',
    dottedLineToName: '',
    dottedLineToTitle: '',
    jobCategory: '',
    requirements: '',
    description: '',
    type: 'Full-time',
    confidentialSearch: false,
    sellingPoints: '',
    applicationProcess: '',
    targetStartDate: '',
    searchType: ''
  });
  const [postedJobs, setPostedJobs] = useState<JobPosting[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
      description: 'We are looking for a talented Senior Frontend Developer...',
      type: 'Full-time',
      posted: '2 days ago',
      status: 'active'
    }
  ]);

  const genAI = new GoogleGenerativeAI('AIzaSyDeuDXluDkLSNaaJBzsR30uilQ4kRXVaAw');

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' },
    { code: 'SGD', name: 'Singapore Dollar (S$)' },
    { code: 'CHF', name: 'Swiss Franc (CHF)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'NZD', name: 'New Zealand Dollar (NZ$)' },
    { code: 'OTHER', name: 'Other (Custom)' }
  ];

  const countries = [
    // North America
    'United States',
    'Canada',
    'Mexico',
    'Bermuda',
    'Cayman Islands',
    'Barbados',
    // Europe
    'England',
    'Scotland',
    'Ireland',
    'Northern Ireland',
    'Switzerland',
    'Germany',
    'Austria',
    'Luxembourg',
    'Netherlands',
    'Belgium',
    'France',
    'Spain',
    'Portugal',
    'Czech Republic',
    'Gibraltar',
    // Asia Pacific
    'Australia',
    'New Zealand',
    'India',
    'China',
    'Hong Kong',
    'Singapore',
    'Malaysia',
    'Thailand',
    // Middle East
    'UAE',
    'Kuwait',
    'Saudi Arabia',
    // Latin America
    'Colombia',
    'Brazil',
    'Argentina',
    'Peru',
    // Africa
    'South Africa',
    // Other
    'Other'
  ];

  const usStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'];

  const canadianProvinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

  const locationTypes = ['On-site', 'Remote', 'Hybrid'];
  const seniorityLevels = ['Individual Contributor', 'Manager', 'Senior Manager', 'Director', 'Senior Director', 'VP', 'Senior VP', 'C-Level'];
  const jobCategories = [
    { group: 'Life Insurance', options: ['Life - Actuarial', 'Life - Other', 'Life - Data Science', 'Life - Underwriting', 'Life - Data Engineering', 'Life - Business Intelligence', 'Life - ILS', 'Life - Pension', 'Life - Retirement', 'Life - AI', 'Life - Machine Learning'] },
    { group: 'Non-Life Insurance', options: ['Non-Life - Actuarial', 'Non-Life - Cat Modeling', 'Non-Life - Risk', 'Non-Life - Data Science', 'Non-Life - Underwriting', 'Non-Life - Other', 'Non-Life - Investment', 'Non-Life - Product Management', 'Non-Life - Data Engineer', 'Non-Life - Business Intelligence', 'Non-Life - Climate Risk', 'Non-Life - ESG', 'Non-Life - AI', 'Non-Life - Machine Learning'] },
    { group: 'Health Insurance', options: ['Health - Actuarial', 'Health - Underwriting', 'Health - Data Science'] },
    { group: 'Pension', options: ['Pension - Actuarial', 'Pension - Retirement'] },
    { group: 'Technology (Non-Insurance)', options: ['Tech - Artificial Intelligence', 'Tech - Machine Learning', 'Tech - Data Science', 'Tech - Data Engineering', 'Tech - Product Management', 'Tech - Software Engineering'] },
    { group: 'Cross-Domain', options: ['Cross-Domain - Business Intelligence', 'Cross-Domain - Data Engineering'] }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('benefits.')) {
      const benefitField = field.split('.')[1];
      setJobForm(prev => ({
        ...prev,
        benefits: { ...prev.benefits, [benefitField]: value }
      }));
    } else if (field.startsWith('perks.')) {
      const perkField = field.split('.')[1];
      setJobForm(prev => ({
        ...prev,
        perks: { ...prev.perks, [perkField]: value }
      }));
    } else {
      setJobForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, Word document (.doc, .docx), or text file.');
      return;
    }

    setIsParsingDocument(true);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const text = e.target?.result as string;

        const prompt = `
          Analyze the following job description document and extract all relevant information. Return the response in JSON format with the exact structure shown below:

          Document Content:
          ${text}

          Please extract:
          1. Job title
          2. Company name
          3. Location (city, state/province, country)
          4. Job type (Full-time, Part-time, Contract, etc.)
          5. Location type (On-site, Remote, Hybrid)
          6. Salary range (min and max)
          7. Currency (USD, CAD, EUR, etc.)
          8. Required skills and qualifications
          9. Full job description
          10. Seniority level
          11. Travel percentage
          12. Benefits mentioned
          13. Any bonus information

          Return ONLY valid JSON in this exact format:
          {
            "title": "string",
            "company": "string",
            "city": "string",
            "state": "string",
            "country": "string",
            "locationType": "string",
            "type": "string",
            "baseSalaryMin": "string",
            "baseSalaryMax": "string",
            "currency": "string",
            "requirements": "string (comma-separated)",
            "description": "string",
            "seniorityLevel": "string",
            "travelPercentage": "string",
            "benefits": {
              "pension": boolean,
              "health": boolean,
              "dental": boolean,
              "vacation": "string"
            },
            "bonusTarget": "string",
            "bonusMax": "string"
          }

          If any field is not found in the document, use empty string or false for booleans.
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);

          setJobForm(prev => ({
            ...prev,
            title: parsedData.title || prev.title,
            company: parsedData.company || prev.company,
            city: parsedData.city || prev.city,
            state: parsedData.state || prev.state,
            country: parsedData.country || prev.country,
            locationType: parsedData.locationType || prev.locationType,
            type: parsedData.type || prev.type,
            baseSalaryMin: parsedData.baseSalaryMin || prev.baseSalaryMin,
            baseSalaryMax: parsedData.baseSalaryMax || prev.baseSalaryMax,
            currency: parsedData.currency || prev.currency,
            requirements: parsedData.requirements || prev.requirements,
            description: parsedData.description || prev.description,
            seniorityLevel: parsedData.seniorityLevel || prev.seniorityLevel,
            travelPercentage: parsedData.travelPercentage || prev.travelPercentage,
            benefits: {
              pension: parsedData.benefits?.pension || prev.benefits.pension,
              health: parsedData.benefits?.health || prev.benefits.health,
              dental: parsedData.benefits?.dental || prev.benefits.dental,
              vacation: parsedData.benefits?.vacation || prev.benefits.vacation
            },
            bonusTarget: parsedData.bonusTarget || prev.bonusTarget,
            bonusMax: parsedData.bonusMax || prev.bonusMax
          }));

          alert('Document parsed successfully! Please review and complete any missing fields.');
        } else {
          throw new Error('Invalid response format');
        }
      };

      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsText(file);
      }

    } catch (error) {
      console.error('Error parsing document:', error);
      let errorMessage = 'Failed to parse document. Please try again or fill the form manually.';

      if (error instanceof Error) {
        if (error.message.includes('503') || error.message.includes('overloaded')) {
          errorMessage = 'The AI service is currently busy. Please try again in a few moments.';
        }
      }

      alert(errorMessage);
    } finally {
      setIsParsingDocument(false);
      event.target.value = '';
    }
  };

  const generateJobDescription = async () => {
    if (!jobForm.title || !jobForm.company) {
      alert('Please fill in at least the job title and company name to generate a description.');
      return;
    }

    setIsGenerating(true);
    try {
      // Get the actual currency to use
      const actualCurrency = jobForm.currency === 'OTHER' ? jobForm.customCurrency : jobForm.currency;

      const salaryInfo = jobForm.baseSalaryMin && jobForm.baseSalaryMax
        ? `${actualCurrency} ${jobForm.baseSalaryMin} - ${jobForm.baseSalaryMax}`
        : 'Competitive';

      const bonusInfo = jobForm.bonusTarget && jobForm.bonusMax
        ? jobForm.bonusType === 'percentage'
          ? ` + Bonus (${jobForm.bonusTarget}% - ${jobForm.bonusMax}%)`
          : ` + Bonus (${actualCurrency} ${jobForm.bonusTarget} - ${jobForm.bonusMax})`
        : '';

      const fullLocation = jobForm.city && jobForm.state
        ? `${jobForm.city}, ${jobForm.state}`
        : 'Not specified';

      const prompt = `
        Generate a comprehensive and professional job description for the following position:

        Job Title: ${jobForm.title}
        Company: ${jobForm.company}
        Job Category: ${jobForm.jobCategory || 'Not specified'}
        Location: ${fullLocation} (${jobForm.locationType})
        Travel: ${jobForm.travelPercentage || 'None'}
        Seniority Level: ${jobForm.seniorityLevel || 'Not specified'}
        Salary Range: ${salaryInfo}${bonusInfo}
        Requirements: ${jobForm.requirements || 'Standard requirements for this role'}
        Benefits: ${jobForm.benefits.health ? 'Health Insurance, ' : ''}${jobForm.benefits.dental ? 'Dental, ' : ''}${jobForm.benefits.pension ? 'Pension/401k, ' : ''}${jobForm.benefits.vacation ? `${jobForm.benefits.vacation} vacation` : ''}

        Please create a detailed job description that includes:
        1. A compelling overview of the role and company
        2. Key responsibilities and duties
        3. Required qualifications and skills
        4. Preferred qualifications
        5. Benefits and what makes this opportunity attractive
        6. Company culture highlights

        Make it professional, engaging, and tailored to attract top talent in the ${jobForm.jobCategory || 'insurance and financial services'} sector. The description should be 3-4 paragraphs long and highlight why candidates would want to work for this company.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Add timeout and better error handling
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
      ]);
      
      const response = await result.response;
      let generatedDescription = response.text();
      
      // Clean up the response text
      generatedDescription = generatedDescription.replace(/^\*\*.*?\*\*\s*/gm, '');
      generatedDescription = generatedDescription.replace(/^#+\s*/gm, '');
      generatedDescription = generatedDescription.trim();

      setJobForm(prev => ({ ...prev, description: generatedDescription }));
    } catch (error) {
      console.error('Error generating job description:', error);
      
      let errorMessage = 'Failed to generate job description. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again with a shorter prompt.';
        } else if (error.message.includes('503') || error.message.includes('overloaded')) {
          errorMessage = 'The AI service is currently busy. Please try again in a few moments.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'API quota exceeded. Please check your API key limits.';
        } else if (error.message.includes('invalid') || error.message.includes('key')) {
          errorMessage = 'Invalid API key. Please check your configuration.';
        }
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextStep = () => {
    // Validation
    if (!jobForm.title || !jobForm.company || !jobForm.description) {
      alert('Please fill in all required fields (Title, Company, Description).');
      return;
    }

    // Validate new required fields
    if (!jobForm.sellingPoints) {
      alert('Please provide selling points (Why this role?). This helps recruiters attract candidates.');
      return;
    }

    if (!jobForm.applicationProcess) {
      alert('Please provide application process instructions. Recruiters need to know how to submit candidates.');
      return;
    }

    if (!jobForm.targetStartDate) {
      alert('Please select a target start date. This helps prioritize the search urgency.');
      return;
    }

    // Location validation based on location type
    if (jobForm.locationType !== 'Remote') {
      if (!jobForm.city) {
        alert('Please enter a city for on-site or hybrid positions.');
        return;
      }
      if ((jobForm.country === 'United States' || jobForm.country === 'Canada') && !jobForm.state) {
        alert('Please select a state/province.');
        return;
      }
    }

    // Check if custom currency is required
    if (jobForm.currency === 'OTHER' && !jobForm.customCurrency) {
      alert('Please enter a custom currency.');
      return;
    }

    // Move to step 2 (Search Type Selection)
    setCurrentStep(2);
  };

 const handleFinalSubmit = () => {
  // Validate search type is selected
  if (!selectedSearchType) {
    alert('Please select a search type to proceed.');
    return;
  }

  // Merge selected search type into job form
  const finalJobForm = { ...jobForm, searchType: selectedSearchType };

  // Determine currency
  const actualCurrency =
    finalJobForm.currency === 'OTHER'
      ? finalJobForm.customCurrency
      : finalJobForm.currency;

  // Build salary string
  let salaryString = 'Competitive';

  if (finalJobForm.baseSalaryMin && finalJobForm.baseSalaryMax) {
    salaryString = `${actualCurrency} ${finalJobForm.baseSalaryMin} - ${finalJobForm.baseSalaryMax}`;
  }

  if (finalJobForm.bonusTarget && finalJobForm.bonusMax) {
    if (finalJobForm.bonusType === 'percentage') {
      salaryString += ` + Bonus (${finalJobForm.bonusTarget}% - ${finalJobForm.bonusMax}%)`;
    } else {
      salaryString += ` + Bonus (${actualCurrency} ${finalJobForm.bonusTarget} - ${finalJobForm.bonusMax})`;
    }
  }

  // Build location string
  let locationString = '';

  if (finalJobForm.locationType === 'Remote') {
    locationString = finalJobForm.state
      ? `${finalJobForm.state}, ${finalJobForm.country} (Remote)`
      : `${finalJobForm.country} (Remote - Work from anywhere)`;
  } else {
    if (
      finalJobForm.country === 'United States' ||
      finalJobForm.country === 'Canada'
    ) {
      locationString = `${finalJobForm.city}, ${finalJobForm.state} (${finalJobForm.locationType})`;
    } else {
      locationString = `${finalJobForm.city}, ${finalJobForm.country} (${finalJobForm.locationType})`;
    }
  }

  // Job for job seekers
  const jobForJobSeekers: Omit<Job, 'id' | 'posted'> = {
    title: finalJobForm.title,
    company: finalJobForm.company,
    location: locationString,
    type: finalJobForm.type,
    salary: salaryString,
    description: finalJobForm.description,
    requirements: finalJobForm.requirements
      .split(',')
      .map(req => req.trim())
      .filter(Boolean),
    tags: [
      finalJobForm.type,
      finalJobForm.locationType,
      finalJobForm.jobCategory,
      finalJobForm.seniorityLevel,
      salaryString.includes(actualCurrency)
        ? 'Competitive Salary'
        : 'Salary Negotiable'
    ].filter(Boolean)
  };

  onAddJob(jobForJobSeekers);

  // Employer job record
  const newJob: JobPosting = {
    id: Date.now().toString(),
    title: finalJobForm.title,
    company: finalJobForm.company,
    location: locationString,
    salary: salaryString,
    requirements: finalJobForm.requirements
      .split(',')
      .map(req => req.trim())
      .filter(Boolean),
    description: finalJobForm.description,
    type: finalJobForm.type,
    posted: 'Just now',
    status: 'active',
    salaryRating
  };

  setPostedJobs(prev => [newJob, ...prev]);

  // Reset form
  setJobForm({
    title: '',
    company: '',
    country: 'United States',
    city: '',
    state: '',
    locationType: 'On-site',
    daysInOffice: '',
    travelPercentage: '',
    salary: '',
    currency: 'USD',
    customCurrency: '',
    baseSalaryMin: '',
    baseSalaryMax: '',
    bonusTarget: '',
    bonusMax: '',
    bonusType: 'amount',
    benefits: {
      pension: false,
      health: false,
      dental: false,
      vacation: ''
    },
    perks: {
      rsuOrStockOptions: '',
      equityOrProfitSharing: '',
      signOnBonus: '',
      relocationAssistance: '',
      temporaryHousing: '',
      otherPerks: '',
      visaSponsorship: ''
    },
    seniorityLevel: '',
    directReports: '',
    indirectReports: '',
    reportsToName: '',
    reportsToTitle: '',
    dottedLineToName: '',
    dottedLineToTitle: '',
    jobCategory: '',
    requirements: '',
    description: '',
    type: 'Full-time',
    confidentialSearch: false,
    sellingPoints: '',
    applicationProcess: '',
    targetStartDate: '',
    searchType: ''
  });

  setSelectedSearchType('');
  setCurrentStep(1);
  setActiveTab('manage-jobs');

  alert('Job posted successfully!');
};

  const renderPostJob = () => (
    <div className="max-w-4xl mx-auto px-4 lg:px-0">
      <div className="mb-8">
        <div className="text-center">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Post a New Job</h1>
          <p className="text-sm lg:text-base text-gray-600 mb-6">Create an attractive job posting to find the perfect candidate</p>

          {/* Contact Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.location.href = 'mailto:inquire@nasearchg.com'}
              className="inline-flex items-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Paperclip className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base">Send Resume</span>
            </button>
            <button
              onClick={() => window.location.href = 'tel:+18772228431'}
              className="inline-flex items-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base">Call Us</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {/* Upload Job Description */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Job Description</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have an existing job description? Upload it and we'll automatically fill in most fields for you.
              </p>
              <label className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={isParsingDocument}
                />
                {isParsingDocument ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Parsing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Document</span>
                  </>
                )}
              </label>
              <p className="text-xs text-gray-500 mt-2">Supports PDF, Word, and text files</p>
            </div>
          </div>
        </div>

        {/* Speak with a Recruiter */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Speak with a Recruiter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Need help or have questions? Our recruitment team is ready to assist you.
              </p>
              <button
                onClick={() => setShowRecruiterContact(!showRecruiterContact)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Recruiter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Contact Details (Expandable) */}
      {showRecruiterContact && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Contact Our Recruiters</h3>
            <button
              onClick={() => setShowRecruiterContact(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* General Contact */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">General Inquiries</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <a href="tel:+18772228431" className="text-sm text-blue-600 hover:text-blue-700">
                      (+1) 877-222-8431
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a href="mailto:inquire@nasearchg.com" className="text-sm text-blue-600 hover:text-blue-700">
                      inquire@nasearchg.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialized Agents */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Recruitment Specialists</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Denny Antony, MBA</p>
                  <p className="text-xs text-gray-600 mb-1">Americas, Middle East, Caribbean, Europe</p>
                  <a href="tel:+19054772962" className="text-sm text-blue-600 hover:text-blue-700 block">
                    (+1) 905-477-2962 ext. 28
                  </a>
                  <a href="mailto:denny@nasearchg.com" className="text-sm text-blue-600 hover:text-blue-700">
                    denny@nasearchg.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Note:</span> Our recruitment specialists can help you craft the perfect job description, determine competitive salary ranges, and provide guidance on attracting top talent in your industry.
            </p>
          </div>
        </div>
      )}

      {/* Client Login Section */}
      {!isLoggedIn && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Client Login</h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={clientLogin.email}
                  onChange={(e) => setClientLogin(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={clientLogin.password}
                  onChange={(e) => setClientLogin(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (clientLogin.email && clientLogin.password) {
                    setIsLoggedIn(true);
                  } else {
                    alert('Please enter both email and password');
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <>
          {currentStep === 1 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-8">
              {/* Logged In Header */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Logged in as</p>
                    <p className="text-sm text-gray-600">{clientLogin.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setClientLogin({ email: '', password: '' });
                    setCurrentStep(1);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Step 1 of 2</span>
                  <span className="text-sm font-medium text-gray-600">Job Details</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Senior Actuarial Analyst"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={jobForm.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Insurance Corp"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Category *
                  </label>
                  <select
                    value={jobForm.jobCategory}
                    onChange={(e) => handleInputChange('jobCategory', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {jobCategories.map((category) => (
                      <optgroup key={category.group} label={category.group}>
                        {category.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type *
                  </label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Location Details</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type *
                  </label>
                  <select
                    value={jobForm.locationType}
                    onChange={(e) => handleInputChange('locationType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {locationTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    value={jobForm.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditional location fields based on location type */}
              {jobForm.locationType !== 'Remote' && (
                <>
                  {/* Show city for on-site and hybrid */}
                  {(jobForm.country === 'United States' || jobForm.country === 'Canada') ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {jobForm.country === 'Canada' ? 'Province' : 'State'} *
                        </label>
                        <select
                          value={jobForm.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select {jobForm.country === 'Canada' ? 'Province' : 'State'}</option>
                          {(jobForm.country === 'United States' ? usStates : canadianProvinces).map((region) => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={jobForm.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., New York"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={jobForm.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., London"
                      />
                    </div>
                  )}
                </>
              )}

              {/* For Remote, show state/province or work from anywhere */}
              {jobForm.locationType === 'Remote' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Requirement
                  </label>
                  {(jobForm.country === 'United States' || jobForm.country === 'Canada') ? (
                    <select
                      value={jobForm.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Work from anywhere</option>
                      <option value="" disabled>──────────</option>
                      {(jobForm.country === 'United States' ? usStates : canadianProvinces).map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={jobForm.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Work from anywhere or specify region"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">Leave empty for "Work from anywhere"</p>
                </div>
              )}

              {/* Days in office for all location types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {jobForm.locationType === 'Remote' ? 'Days in Office (if any)' : 'Days in Office per Week'}
                </label>
                <input
                  type="text"
                  value={jobForm.daysInOffice}
                  onChange={(e) => handleInputChange('daysInOffice', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={jobForm.locationType === 'Remote' ? 'e.g., 0 or None' : 'e.g., 5 or 3-4'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Percentage
                </label>
                <input
                  type="text"
                  value={jobForm.travelPercentage}
                  onChange={(e) => handleInputChange('travelPercentage', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 10-20% or None"
                />
              </div>
            </div>
          </div>

          {/* Role Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Role Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seniority Level *
                </label>
                <select
                  value={jobForm.seniorityLevel}
                  onChange={(e) => handleInputChange('seniorityLevel', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select seniority level</option>
                  {seniorityLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Direct Reports
                  </label>
                  <input
                    type="text"
                    value={jobForm.directReports}
                    onChange={(e) => handleInputChange('directReports', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 3-5 or None"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indirect Reports
                  </label>
                  <input
                    type="text"
                    value={jobForm.indirectReports}
                    onChange={(e) => handleInputChange('indirectReports', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 10-15 or None"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-800 mb-3">Reporting Structure</h4>
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reports To - Name
                      </label>
                      <input
                        type="text"
                        value={jobForm.reportsToName}
                        onChange={(e) => handleInputChange('reportsToName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reports To - Title
                      </label>
                      <input
                        type="text"
                        value={jobForm.reportsToTitle}
                        onChange={(e) => handleInputChange('reportsToTitle', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., VP of Engineering"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dotted-line Relationship - Name
                      </label>
                      <input
                        type="text"
                        value={jobForm.dottedLineToName}
                        onChange={(e) => handleInputChange('dottedLineToName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dotted-line Relationship - Title
                      </label>
                      <input
                        type="text"
                        value={jobForm.dottedLineToTitle}
                        onChange={(e) => handleInputChange('dottedLineToTitle', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Chief Product Officer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Required Skills Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Required Skills</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills & Requirements *
              </label>
              <textarea
                rows={4}
                value={jobForm.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., ACAS/FCAS, Python, R, SQL, 5+ years actuarial experience (separate with commas)"
              />
            </div>
          </div>

          {/* Compensation Package Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Compensation Package</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  value={jobForm.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>{curr.name}</option>
                  ))}
                </select>
              </div>

              {jobForm.currency === 'OTHER' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Currency *
                  </label>
                  <input
                    type="text"
                    value={jobForm.customCurrency}
                    onChange={(e) => handleInputChange('customCurrency', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., BTC, USDT, INR, etc."
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your preferred currency code or symbol</p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-800 mb-3">Base Salary Range</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum ({jobForm.currency === 'OTHER' ? jobForm.customCurrency || 'Currency' : jobForm.currency})
                    </label>
                    <input
                      type="number"
                      value={jobForm.baseSalaryMin}
                      onChange={(e) => handleInputChange('baseSalaryMin', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 80000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum ({jobForm.currency === 'OTHER' ? jobForm.customCurrency || 'Currency' : jobForm.currency})
                    </label>
                    <input
                      type="number"
                      value={jobForm.baseSalaryMax}
                      onChange={(e) => handleInputChange('baseSalaryMax', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 120000"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-gray-800 mb-3">Bonus Structure</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bonus Type
                    </label>
                    <select
                      value={jobForm.bonusType}
                      onChange={(e) => handleInputChange('bonusType', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="amount">Amount ({jobForm.currency === 'OTHER' ? jobForm.customCurrency || 'Currency' : jobForm.currency})</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Bonus {jobForm.bonusType === 'percentage' ? '(%)' : `(${jobForm.currency === 'OTHER' ? jobForm.customCurrency || 'Currency' : jobForm.currency})`}
                      </label>
                      <input
                        type="number"
                        value={jobForm.bonusTarget}
                        onChange={(e) => handleInputChange('bonusTarget', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={jobForm.bonusType === 'percentage' ? 'e.g., 15' : 'e.g., 20000'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Bonus {jobForm.bonusType === 'percentage' ? '(%)' : `(${jobForm.currency === 'OTHER' ? jobForm.customCurrency || 'Currency' : jobForm.currency})`}
                      </label>
                      <input
                        type="number"
                        value={jobForm.bonusMax}
                        onChange={(e) => handleInputChange('bonusMax', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={jobForm.bonusType === 'percentage' ? 'e.g., 30' : 'e.g., 40000'}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-gray-800 mb-3">Benefits</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="pension"
                      checked={jobForm.benefits.pension}
                      onChange={(e) => handleInputChange('benefits.pension', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="pension" className="text-sm font-medium text-gray-700">
                      Pension / 401(k)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="health"
                      checked={jobForm.benefits.health}
                      onChange={(e) => handleInputChange('benefits.health', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="health" className="text-sm font-medium text-gray-700">
                      Health Insurance
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="dental"
                      checked={jobForm.benefits.dental}
                      onChange={(e) => handleInputChange('benefits.dental', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="dental" className="text-sm font-medium text-gray-700">
                      Dental Insurance
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vacation / Holidays (days per year)
                    </label>
                    <input
                      type="text"
                      value={jobForm.benefits.vacation}
                      onChange={(e) => handleInputChange('benefits.vacation', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 20 days + 10 holidays"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-gray-800 mb-3">Perks (Optional)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RSU / Stock Options / Other
                    </label>
                    <input
                      type="text"
                      value={jobForm.perks.rsuOrStockOptions}
                      onChange={(e) => handleInputChange('perks.rsuOrStockOptions', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., annual RSU grant or stock options"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Equity Share / Profit Sharing
                    </label>
                    <input
                      type="text"
                      value={jobForm.perks.equityOrProfitSharing}
                      onChange={(e) => handleInputChange('perks.equityOrProfitSharing', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., profit sharing, equity %, carried interest"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sign-on Bonus
                    </label>
                    <input
                      type="text"
                      value={jobForm.perks.signOnBonus}
                      onChange={(e) => handleInputChange('perks.signOnBonus', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., one-time bonus amount or range"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relocation Assistance
                    </label>
                    <input
                      type="text"
                      value={jobForm.perks.relocationAssistance}
                      onChange={(e) => handleInputChange('perks.relocationAssistance', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., relocation package, moving expenses"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temporary Housing
                    </label>
                    <input
                      type="text"
                      value={jobForm.perks.temporaryHousing}
                      onChange={(e) => handleInputChange('perks.temporaryHousing', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 3 months corporate housing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Others
                    </label>
                    <textarea
                      rows={2}
                      value={jobForm.perks.otherPerks}
                      onChange={(e) => handleInputChange('perks.otherPerks', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., wellness stipend, learning budget, flexible hours"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visa Sponsorship (e.g., H1B transfers?)
                    </label>
                    <input
                      type="text"
                      value={jobForm.perks.visaSponsorship}
                      onChange={(e) => handleInputChange('perks.visaSponsorship', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., H1B transfers supported, TN, no sponsorship, etc."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description with AI Generation */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Description *
              </label>
              <button
                onClick={generateJobDescription}
                disabled={isGenerating || !jobForm.title || !jobForm.company}
                className="px-3 py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2 text-xs lg:text-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                    <span className="sm:hidden">Gen...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">AI Generate</span>
                    <span className="sm:hidden">AI</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={6}
              value={jobForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe the role, responsibilities, company culture, and what makes this opportunity attractive..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Tip: Use the AI Generate button to create a professional job description based on your inputs
            </p>
          </div>

          {/* Recruitment Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Recruitment Details</h3>
            <div className="space-y-4">
              {/* Confidential Search */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="confidentialSearch"
                    checked={jobForm.confidentialSearch}
                    onChange={(e) => handleInputChange('confidentialSearch', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="confidentialSearch" className="text-sm font-medium text-gray-700 block mb-1">
                      Confidential Search
                    </label>
                    <p className="text-xs text-gray-600">
                      If checked, recruiters cannot use the company name in their outreach. This is important for confidential searches where the company identity must remain private.
                    </p>
                  </div>
                </div>
              </div>

              {/* Selling Points */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why This Role? (Selling Points) *
                </label>
                <textarea
                  rows={3}
                  value={jobForm.sellingPoints}
                  onChange={(e) => handleInputChange('sellingPoints', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Equity available, Rapid growth, New department, Cutting-edge technology, Strong leadership team, Work-life balance, etc. These are the 'hooks' recruiters use to attract passive candidates."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide compelling reasons why candidates should be interested in this role. These selling points help recruiters attract passive candidates.
                </p>
              </div>

              {/* Application Process */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Process / Submission Instructions *
                </label>
                <textarea
                  rows={3}
                  value={jobForm.applicationProcess}
                  onChange={(e) => handleInputChange('applicationProcess', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Submit through our ATS at [link], or email applications to [email]. Include: resume, cover letter, and portfolio. OR Submit directly through this TalentConnect portal."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Specify whether recruiters should submit candidates through this portal, an external ATS, or provide a submissions link/email. Include any specific instructions or requirements.
                </p>
              </div>

              {/* Target Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Start Date *
                </label>
                <input
                  type="date"
                  value={jobForm.targetStartDate}
                  onChange={(e) => handleInputChange('targetStartDate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The desired start date for the candidate. This helps recruiters prioritize the urgency of the search and manage candidate expectations.
                </p>
              </div>
            </div>
          </div>

          {/* Salary Benchmark */}
          {jobForm.baseSalaryMin && jobForm.baseSalaryMax && jobForm.title && jobForm.city && jobForm.state && (
            <div>
              <SalaryBenchmark
                jobTitle={jobForm.title}
                location={`${jobForm.city}, ${jobForm.state}`}
                salary={`${jobForm.currency === 'OTHER' ? jobForm.customCurrency : jobForm.currency} ${jobForm.baseSalaryMin} - ${jobForm.baseSalaryMax}`}
                jobType={jobForm.type}
                requirements={jobForm.requirements}
                onRatingReceived={setSalaryRating}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="px-4 py-2 lg:px-6 lg:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
            >
              Back to Home
            </button>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => {
                  // Save as draft functionality
                  alert('Job saved as draft!');
                }}
                className="px-4 py-2 lg:px-6 lg:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm lg:text-base"
              >
                <Save className="w-5 h-5" />
                <span className="hidden sm:inline">Save Draft</span>
                <span className="sm:hidden">Save</span>
              </button>
              <button
                onClick={handleNextStep}
                className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center space-x-2 text-sm lg:text-base"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Continue to Search Type</span>
              </button>
            </div>
          </div>
        </div>
      </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-8">
              {/* Logged In Header */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Logged in as</p>
                    <p className="text-sm text-gray-600">{clientLogin.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setClientLogin({ email: '', password: '' });
                    setCurrentStep(1);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Step 2 of 2</span>
                  <span className="text-sm font-medium text-gray-600">Search Type Selection</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Job Summary */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Job Summary</h3>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div><span className="font-medium">Title:</span> {jobForm.title}</div>
                  <div><span className="font-medium">Company:</span> {jobForm.company}</div>
                  <div><span className="font-medium">Location:</span> {jobForm.city && jobForm.state ? `${jobForm.city}, ${jobForm.state}` : jobForm.country}</div>
                  <div><span className="font-medium">Type:</span> {jobForm.type}</div>
                </div>
              </div>

              {/* Search Type Selection */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Choose Your Search Type</h2>
                <p className="text-gray-600 mb-6">Select the recruitment model that best fits your hiring needs</p>

                <div className="space-y-4">
                  {/* Contingency */}
                  <div
                    onClick={() => setSelectedSearchType('Contingency')}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSearchType === 'Contingency'
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="searchType"
                          value="Contingency"
                          checked={selectedSearchType === 'Contingency'}
                          onChange={() => setSelectedSearchType('Contingency')}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <h3 className="text-xl font-bold text-gray-900">Contingency</h3>
                      </div>
                      {selectedSearchType === 'Contingency' && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <p className="text-gray-700 mb-3 ml-8">
                      "No Win, No Fee." Multiple agencies might compete to fill the position. You only pay when a candidate is successfully placed.
                    </p>
                    <div className="ml-8 p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-800 mb-1">Fee Structure:</p>
                      <p className="text-sm text-gray-600">Percentage of salary (e.g., 15-25% of first-year compensation)</p>
                    </div>
                  </div>

                  {/* Retained */}
                  <div
                    onClick={() => setSelectedSearchType('Retained')}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSearchType === 'Retained'
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="searchType"
                          value="Retained"
                          checked={selectedSearchType === 'Retained'}
                          onChange={() => setSelectedSearchType('Retained')}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <h3 className="text-xl font-bold text-gray-900">Retained</h3>
                      </div>
                      {selectedSearchType === 'Retained' && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <p className="text-gray-700 mb-3 ml-8">
                      Exclusive, high-level search with upfront payment. Best for senior executive roles requiring dedicated, focused recruitment efforts.
                    </p>
                    <div className="ml-8 p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-800 mb-1">Fee Structure:</p>
                      <p className="text-sm text-gray-600">Total fee split into milestones (e.g., 1/3 upfront, 1/3 at midpoint, 1/3 on placement)</p>
                    </div>
                  </div>

                  {/* Exclusive */}
                  <div
                    onClick={() => setSelectedSearchType('Exclusive')}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSearchType === 'Exclusive'
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="searchType"
                          value="Exclusive"
                          checked={selectedSearchType === 'Exclusive'}
                          onChange={() => setSelectedSearchType('Exclusive')}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <h3 className="text-xl font-bold text-gray-900">Exclusive</h3>
                      </div>
                      {selectedSearchType === 'Exclusive' && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <p className="text-gray-700 mb-3 ml-8">
                      Only one agency has the right to fill the position for a set period. Lower risk than contingency with dedicated focus.
                    </p>
                    <div className="ml-8 p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-800 mb-1">Fee Structure:</p>
                      <p className="text-sm text-gray-600">Percentage (typically lower than contingency, e.g., 12-20% of first-year compensation)</p>
                    </div>
                  </div>

                  {/* Contract */}
                  <div
                    onClick={() => setSelectedSearchType('Contract')}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSearchType === 'Contract'
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="searchType"
                          value="Contract"
                          checked={selectedSearchType === 'Contract'}
                          onChange={() => setSelectedSearchType('Contract')}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <h3 className="text-xl font-bold text-gray-900">Contract</h3>
                      </div>
                      {selectedSearchType === 'Contract' && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <p className="text-gray-700 mb-3 ml-8">
                      Temporary roles or fixed-term projects. Ideal for project-based work, seasonal needs, or interim positions.
                    </p>
                    <div className="ml-8 p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-800 mb-1">Fee Structure:</p>
                      <p className="text-sm text-gray-600">Hourly rate markup or percentage of contract value (e.g., 15-30% markup on hourly rate)</p>
                    </div>
                  </div>

                  {/* Contract-to-Hire */}
                  <div
                    onClick={() => setSelectedSearchType('Contract-to-Hire')}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSearchType === 'Contract-to-Hire'
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="searchType"
                          value="Contract-to-Hire"
                          checked={selectedSearchType === 'Contract-to-Hire'}
                          onChange={() => setSelectedSearchType('Contract-to-Hire')}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <h3 className="text-xl font-bold text-gray-900">Contract-to-Hire</h3>
                      </div>
                      {selectedSearchType === 'Contract-to-Hire' && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <p className="text-gray-700 mb-3 ml-8">
                      Starts as a contract position, moves to permanent after a specified period (typically 3-6 months). Allows you to evaluate fit before permanent commitment.
                    </p>
                    <div className="ml-8 p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-800 mb-1">Fee Structure:</p>
                      <p className="text-sm text-gray-600">Contract markup during contract period + conversion fee upon permanent hire (e.g., $5,000-$15,000 conversion fee)</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 lg:px-6 lg:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Job Details</span>
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={!selectedSearchType}
                    className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm lg:text-base"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Post Job</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderManageJobs = () => (
    <div className="max-w-6xl mx-auto px-4 lg:px-0">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Manage Job Postings</h1>
            <p className="text-sm lg:text-base text-gray-600">View and manage your active job listings</p>
          </div>
          <button
            onClick={() => {
              setActiveTab('post-job');
              setCurrentStep(1);
              setSelectedSearchType('');
            }}
            className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2 text-sm lg:text-base"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Post New Job</span>
            <span className="sm:hidden">Post Job</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {postedJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2 pr-2">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-sm lg:text-base text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                  {job.salaryRating && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">{job.salaryRating.score}/10</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {job.salaryRating.score >= 8 ? 'Excellent' : 
                         job.salaryRating.score >= 6 ? 'Competitive' : 
                         job.salaryRating.score >= 4 ? 'Average' : 'Below Market'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' :
                    job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">Posted {job.posted}</span>
                </div>
              </div>
              <div className="flex space-x-1 lg:space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Salary Rating Details */}
            {job.salaryRating && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Salary Analysis</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{job.salaryRating.feedback}</p>
                    <p className="text-xs text-gray-500">Market Range: {job.salaryRating.marketRange}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{job.salaryRating.score}/10</div>
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {job.salaryRating.score >= 8 ? 'Excellent' : 
                       job.salaryRating.score >= 6 ? 'Competitive' : 
                       job.salaryRating.score >= 4 ? 'Average' : 'Below Market'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm lg:text-base text-gray-700 line-clamp-3">{job.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements.map((req, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {req}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>24 Applications</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>156 Views</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
                  <span className="hidden sm:inline">View Applications</span>
                  <span className="sm:hidden">Applications</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {showOnboarding && (
        <OnboardingOverlay
          steps={onboardingSteps}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
            
            <button
              onClick={onBack}
              className="hidden lg:flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <span className="text-lg lg:text-xl font-bold text-gray-800">Employer Dashboard</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                data-onboarding="post-job"
                onClick={() => {
                  setActiveTab('post-job');
                  setCurrentStep(1);
                  setSelectedSearchType('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'post-job' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Post Job
              </button>
              <button
                data-onboarding="manage-jobs"
                onClick={() => setActiveTab('manage-jobs')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'manage-jobs' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Manage Jobs
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Overlay */}
          {isMobileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="fixed top-0 left-0 right-0 bg-white z-50 p-4 shadow-lg lg:hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Navigation</h3>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={onBack}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('post-job');
                      setCurrentStep(1);
                      setSelectedSearchType('');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'post-job' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Post Job</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('manage-jobs');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'manage-jobs' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Manage Jobs</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="h-screen flex bg-gray-50">
        {activeTab === 'post-job' && renderPostJob()}
        {activeTab === 'manage-jobs' && renderManageJobs()}
      </main>
    </div>
  );

};

export default EmployerDashboard;
