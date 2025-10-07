import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Brain, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

export const AIModelInsightsPage = () => {
  const models = [
    {
      name: 'LSTM Neural Network',
      purpose: 'Time-series forecasting',
      accuracy: '94.2%',
      description: 'Long Short-Term Memory networks for predicting energy demand patterns over 48-hour windows',
      features: ['Handles sequential data', 'Captures long-term dependencies', 'Adapts to seasonal patterns'],
    },
    {
      name: 'Prophet Model',
      purpose: 'Trend analysis',
      accuracy: '91.8%',
      description: 'Facebook Prophet for detecting trends and seasonality in resource consumption',
      features: ['Automated seasonality detection', 'Holiday effect modeling', 'Robust to missing data'],
    },
    {
      name: 'Autoencoder',
      purpose: 'Anomaly detection',
      accuracy: '96.5%',
      description: 'Deep learning model to identify unusual patterns in energy and water systems',
      features: ['Unsupervised learning', 'Real-time detection', 'Low false positive rate'],
    },
    {
      name: 'Isolation Forest',
      purpose: 'Outlier identification',
      accuracy: '92.3%',
      description: 'Ensemble method for detecting anomalies in multi-dimensional sensor data',
      features: ['Handles high-dimensional data', 'Fast computation', 'No labeled data required'],
    },
  ];

  const pipeline = [
    { step: 'Data Collection', description: 'Real-time sensors, weather APIs, historical records' },
    { step: 'Preprocessing', description: 'Cleaning, normalization, feature engineering' },
    { step: 'Model Training', description: 'LSTM, Prophet, Autoencoders trained on historical data' },
    { step: 'Prediction', description: 'Generate 48-hour forecasts and anomaly scores' },
    { step: 'Action', description: 'Alert generation, load balancing, maintenance scheduling' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#C7E8CA] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#326B5D] mb-2">AI Model Insights</h1>
          <p className="text-gray-600">Understanding the artificial intelligence powering smart city management</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7FC8A9] to-[#326B5D] rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#326B5D] mb-2">AI Pipeline Overview</h2>
                <p className="text-gray-600">
                  Our system uses a multi-model approach combining deep learning, time-series analysis, and anomaly detection to deliver accurate predictions and proactive maintenance.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
              {pipeline.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-full flex items-center justify-center mb-2">
                      <span className="text-xl font-bold text-[#326B5D]">{index + 1}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#326B5D] max-w-[120px]">{item.step}</p>
                    <p className="text-xs text-gray-500 max-w-[120px] mt-1">{item.description}</p>
                  </motion.div>
                  {index < pipeline.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-[#7FC8A9] hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {models.map((model, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card hover>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#326B5D] mb-1">{model.name}</h3>
                    <Badge variant="info">{model.purpose}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#7FC8A9]">{model.accuracy}</div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{model.description}</p>

                <div className="space-y-2">
                  {model.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-[#C7E8CA] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-[#326B5D] rounded-full"></div>
                      </div>
                      <p className="text-sm text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-[#326B5D] mb-4">Model Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-[#C7E8CA] to-[#F8F9FA] rounded-xl">
                <TrendingUp className="w-8 h-8 text-[#326B5D] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#326B5D] mb-1">93.7%</div>
                <p className="text-sm text-gray-600">Average Prediction Accuracy</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#C7E8CA] to-[#F8F9FA] rounded-xl">
                <AlertCircle className="w-8 h-8 text-[#326B5D] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#326B5D] mb-1">98.2%</div>
                <p className="text-sm text-gray-600">Anomaly Detection Rate</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#C7E8CA] to-[#F8F9FA] rounded-xl">
                <Brain className="w-8 h-8 text-[#326B5D] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#326B5D] mb-1">2.3%</div>
                <p className="text-sm text-gray-600">False Positive Rate</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-[#7FC8A9] to-[#326B5D] text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Continuous Learning</h3>
              <p className="text-white/90">
                Our models are continuously retrained with new data to improve accuracy and adapt to changing patterns in energy and water consumption.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
