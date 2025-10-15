import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  Building2,
  Factory,
  Globe,
  Check,
  ArrowRight,
  Cpu,
  Cloud,
  Leaf,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const BusinessImpactPage = () => {
  const subscriptionPlans = [
    {
      name: "Pilot Zone",
      tier: "Starter",
      price: "₹1.5L / month",
      description:
        "Ideal for local urban bodies or smart city cells testing AI-driven sustainability systems.",
      features: [
        "Covers up to 1 administrative zone",
        "Live IoT monitoring dashboard",
        "Basic predictive analytics (24-hour)",
        "Email + in-app alerts",
        "Monthly insights report",
        "Technical onboarding support",
      ],
      highlight: false,
    },
    {
      name: "Smart City Integration",
      tier: "Professional",
      price: "₹5L / month",
      description:
        "Designed for full-city rollout with advanced intelligence and integrated infrastructure APIs.",
      features: [
        "City-wide data coverage",
        "AI-driven insights (48-hour predictive window)",
        "Anomaly detection & preventive alerts",
        "SMS + Email notifications",
        "Weekly analytics reports",
        "API access for city integration",
        "Priority support",
        "Hands-on training sessions",
      ],
      highlight: true,
    },
    {
      name: "Nation-Scale Partnership",
      tier: "Enterprise",
      price: "Custom",
      description:
        "Scalable collaboration with government or enterprises across multiple cities and states.",
      features: [
        "Multi-city deployment network",
        "Custom-trained AI models per geography",
        "Predictive maintenance automation",
        "Policy & ESG analytics dashboard",
        "Custom integration with data lakes",
        "Dedicated solution architect",
        "24/7 enterprise SLA support",
        "White-label options available",
      ],
      highlight: false,
    },
  ];

  const stakeholders = [
    {
      name: "Municipal Corporations",
      description:
        "Urban local bodies managing waste, water, and energy optimization under the Smart City Mission.",
      icon: Building2,
    },
    {
      name: "Industrial Parks & Utilities",
      description:
        "Factories and energy boards aiming to reduce operational overheads via AI forecasting.",
      icon: Factory,
    },
    {
      name: "Environmental Programs",
      description:
        "Central and state initiatives like AMRUT 2.0 and National Clean Air Mission integrating AI.",
      icon: Globe,
    },
  ];

  const impactMetrics = [
    { value: "₹120Cr+", label: "Projected Cost Savings (5 Years, Pan-India)" },
    { value: "18%", label: "Reduction in Energy Wastage" },
    { value: "95%", label: "Anomaly Detection Accuracy" },
    { value: "24/7", label: "Preventive AI Monitoring" },
  ];

  const indiaStats = [
    { value: "4,000+", label: "Smart City Projects Initiated" },
    { value: "₹2.05L Cr", label: "Govt. Smart Infra Budget (2024)" },
    { value: "₹65,000 Cr", label: "ESG-Focused Public Investments" },
  ];

  const aiCapabilities = [
    {
      title: "Predictive Maintenance",
      description:
        "Detects upcoming failures using real-time IoT and anomaly modeling — reducing downtime by 30%.",
      icon: Cpu,
    },
    {
      title: "Dynamic Forecasting",
      description:
        "Forecasts waste, water, and power demand using temporal-spatial satellite data fusion.",
      icon: Cloud,
    },
    {
      title: "Sustainability Optimization",
      description:
        "Advises carbon-efficient actions, automating grid energy balancing and emission reduction.",
      icon: Leaf,
    },
  ];

  const roadmap = [
    { phase: "Pilot", desc: "Initial deployment across 1–2 city zones", duration: "2 months" },
    { phase: "Evaluation", desc: "Model performance & ROI benchmarking", duration: "1 month" },
    { phase: "City Rollout", desc: "Full-scale expansion across all wards", duration: "6 months" },
    { phase: "State Integration", desc: "Connected network of cities & data sharing", duration: "Ongoing" },
  ];

  const energyData = [
    { year: "2021", value: 60 },
    { year: "2022", value: 80 },
    { year: "2023", value: 110 },
    { year: "2024", value: 140 },
    { year: "2025", value: 175 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#D7F3DE] pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] bg-cover bg-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B4332] mb-3 tracking-tight">
            Business Model & Impact
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Driving India’s Smart Infrastructure Revolution through AI, Data, and Sustainability.
          </p>
        </motion.div>

        {/* India Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {indiaStats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 text-center rounded-2xl shadow-md bg-gradient-to-br from-white to-[#F0FDF4]"
            >
              <div className="text-3xl font-bold text-[#2D6A4F] mb-1">{stat.value}</div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stakeholders */}
        <Card className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1B4332] mb-8 text-center">
            Key Stakeholders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stakeholders.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-gradient-to-br from-white to-[#E9F9EE] rounded-2xl shadow-md"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#2D6A4F] to-[#74C69D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B4332] mb-2">{s.name}</h3>
                <p className="text-sm text-gray-600">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Plans */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-[#1B4332] mb-8 text-center">
            Subscription Plans
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan, i) => (
              <motion.div key={i} whileHover={{ y: -6 }}>
                <Card
                  className={`h-full transition-all duration-300 ${
                    plan.highlight ? "ring-2 ring-[#52B788] shadow-lg" : ""
                  }`}
                >
                  {plan.highlight && (
                    <div className="mb-3 text-center">
                      <span className="bg-[#2D6A4F] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        RECOMMENDED
                      </span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-[#1B4332] mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{plan.tier} Plan</p>
                  <div className="text-3xl font-bold text-[#52B788] mb-2">{plan.price}</div>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#74C69D]" />
                        <span className="text-sm text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlight ? "primary" : "outline"}
                    className="w-full"
                  >
                    Contact Sales
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Capabilities */}
        <Card className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1B4332] mb-8 text-center">
            Preventive AI Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiCapabilities.map((cap, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-br from-[#E9F9EE] to-white rounded-xl shadow-sm"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#52B788] to-[#2D6A4F] rounded-full flex items-center justify-center mb-4">
                  <cap.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B4332] mb-2">{cap.title}</h3>
                <p className="text-sm text-gray-600">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Impact Metrics + Chart */}
        <Card className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1B4332] mb-8 text-center">
            Measured Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {impactMetrics.map((m, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08 }}
                className="p-6 bg-gradient-to-br from-white to-[#E9F9EE] text-center rounded-xl shadow"
              >
                <div className="text-3xl font-bold text-[#2D6A4F] mb-1">{m.value}</div>
                <p className="text-sm text-gray-600">{m.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Animated Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2D6A4F"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Roadmap */}
        <Card>
          <h2 className="text-2xl font-semibold text-[#1B4332] mb-8 text-center">
            Expansion Roadmap
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {roadmap.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#52B788] to-[#2D6A4F] rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-2xl font-bold text-white">{i + 1}</span>
                  </div>
                  <p className="text-lg font-semibold text-[#1B4332] mb-1">{step.phase}</p>
                  <p className="text-sm text-gray-600 max-w-[150px]">{step.desc}</p>
                  <p className="text-xs text-gray-500 mt-1">{step.duration}</p>
                </motion.div>
                {i < roadmap.length - 1 && <ArrowRight className="w-8 h-8 text-[#74C69D]" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Slogan Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#2D6A4F] to-[#74C69D] py-8 px-4 rounded-3xl shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Together, We’ll Make India Cleaner & Greener 🌱
            </h2>
            <p className="text-white/80 mt-3">
              Empowering sustainable cities through AI, innovation, and collaboration.
            </p>
          </div>
        </motion.div>
      </div>
      <footer className="mt-10 text-center text-gray-600 text-sm">
          <p>© 2025 CityShield | Built by Team Maverick</p>
      </footer>
    </div>
  );
};
