import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Building2, Users, Globe, Check, ArrowRight } from 'lucide-react';

export const BusinessImpactPage = () => {
  const subscriptionPlans = [
    {
      name: 'Pilot Test',
      tier: 'Basic',
      price: 'Custom',
      description: 'Perfect for municipalities testing smart city solutions in a single zone',
      features: [
        '1 city zone coverage',
        'Real-time monitoring dashboard',
        'Basic AI predictions (24-hour)',
        'Email alerts',
        'Monthly reports',
        'Email support',
      ],
      highlight: false,
    },
    {
      name: 'City Integration',
      tier: 'Pro',
      price: 'Custom',
      description: 'Full-scale deployment for smart city infrastructure across all zones',
      features: [
        'Full city coverage (all zones)',
        'Advanced AI predictions (48-hour)',
        'Real-time anomaly detection',
        'SMS + Email alerts',
        'Weekly detailed reports',
        'API access for integration',
        'Priority support',
        'On-site training',
      ],
      highlight: true,
    },
    {
      name: 'Multi-City',
      tier: 'Enterprise',
      price: 'Custom',
      description: 'Scalable solution for state-level or multi-city deployments',
      features: [
        'Multiple city deployments',
        'Custom AI model training',
        'Predictive maintenance',
        'Advanced analytics & insights',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 priority support',
        'White-label options',
      ],
      highlight: false,
    },
  ];

  const stakeholders = [
    {
      name: 'Municipal Corporations',
      description: 'City governments seeking to optimize resource management and reduce operational costs',
      icon: Building2,
    },
    {
      name: 'Smart City Missions',
      description: 'National and state-level programs implementing smart city initiatives',
      icon: Globe,
    },
    {
      name: 'Utility Providers',
      description: 'Energy and water distribution companies looking to improve efficiency',
      icon: Users,
    },
  ];

  const impactMetrics = [
    { value: '15%', label: 'Reduced Resource Wastage' },
    { value: '12%', label: 'Load Balancing Improvement' },
    { value: '98%', label: 'Anomaly Detection Rate' },
    { value: '24/7', label: 'Real-time Monitoring' },
  ];

  const expansionSteps = [
    { phase: 'Pilot', description: 'Single zone deployment', duration: '2-3 months' },
    { phase: 'Evaluation', description: 'Performance assessment', duration: '1 month' },
    { phase: 'Subscription', description: 'Full city rollout', duration: '6-12 months' },
    { phase: 'Expansion', description: 'Multi-city scaling', duration: 'Ongoing' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#C7E8CA] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-[#326B5D] mb-2">Business Model & Impact</h1>
          <p className="text-gray-600">Sustainable solutions for smart cities with measurable results</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card>
            <h2 className="text-2xl font-semibold text-[#326B5D] mb-6 text-center">Key Stakeholders</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stakeholders.map((stakeholder, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center p-6 bg-gradient-to-br from-[#C7E8CA] to-[#F8F9FA] rounded-xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7FC8A9] to-[#326B5D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <stakeholder.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#326B5D] mb-2">{stakeholder.name}</h3>
                  <p className="text-sm text-gray-600">{stakeholder.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-[#326B5D] mb-6 text-center">Subscription Plans</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  className={`h-full ${
                    plan.highlight
                      ? 'ring-2 ring-[#7FC8A9] shadow-xl'
                      : ''
                  }`}
                >
                  {plan.highlight && (
                    <div className="mb-4">
                      <span className="bg-gradient-to-r from-[#7FC8A9] to-[#326B5D] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        RECOMMENDED
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-[#326B5D] mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{plan.tier} Plan</p>
                    <div className="text-3xl font-bold text-[#7FC8A9] mb-2">{plan.price}</div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#7FC8A9] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant={plan.highlight ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Contact Sales
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <Card>
            <h2 className="text-2xl font-semibold text-[#326B5D] mb-6 text-center">Proven Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, type: 'spring' }}
                  className="text-center p-6 bg-gradient-to-br from-[#C7E8CA] to-[#F8F9FA] rounded-xl"
                >
                  <div className="text-4xl font-bold text-[#326B5D] mb-2">{metric.value}</div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card>
            <h2 className="text-2xl font-semibold text-[#326B5D] mb-6 text-center">Expansion Roadmap</h2>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {expansionSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-[#7FC8A9] to-[#326B5D] rounded-full flex items-center justify-center mb-2 mx-auto">
                      <span className="text-2xl font-bold text-white">{index + 1}</span>
                    </div>
                    <p className="text-lg font-semibold text-[#326B5D] mb-1">{step.phase}</p>
                    <p className="text-sm text-gray-600 max-w-[150px]">{step.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{step.duration}</p>
                  </motion.div>
                  {index < expansionSteps.length - 1 && (
                    <ArrowRight className="w-8 h-8 text-[#7FC8A9] hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
