import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Database, Zap, CheckCircle, Code, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Card from '../components/Card';
import type { User } from '@/types';

interface JupyterInfoPageProps {
  user: User;
}

export default function JupyterInfoPage({ user }: JupyterInfoPageProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.replace('/login');
  };

  const workflowSteps = [
    {
      title: 'Image Preprocessing',
      description: 'Images are resized, normalized, and augmented to improve model accuracy',
      status: 'Active'
    },
    {
      title: 'Feature Extraction',
      description: 'Deep learning model extracts key features from fern fronds and leaflets',
      status: 'Active'
    },
    {
      title: 'Classification',
      description: 'Neural network classifies the fern species based on extracted features',
      status: 'Active'
    },
    {
      title: 'Data Enrichment',
      description: 'Species information fetched from botanical databases and online sources',
      status: 'Active'
    }
  ];

  const dataSources = [
    'GBIF (Global Biodiversity Information Facility)',
    'PlantNet Database',
    'Encyclopedia of Life (EOL)',
    'USDA Plants Database',
    'iNaturalist Research-grade Observations'
  ];

  const modelStats = [
    { label: 'Model Accuracy', value: '94.5%', icon: TrendingUp, color: 'green' },
    { label: 'Species Recognized', value: '150+', icon: Database, color: 'blue' },
    { label: 'Training Images', value: '50,000+', icon: Brain, color: 'purple' },
    { label: 'Avg. Response Time', value: '<3s', icon: Zap, color: 'orange' }
  ];

  return (
    <div className="flex h-screen bg-[var(--color-neutral-100)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar
              onLogout={handleLogout}
              onClose={() => setIsSidebarOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav username={user.username} profilePicture={user.profilePicture} onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-[var(--color-neutral-800)] mb-2">AI Model Information</h1>
              <p className="text-[var(--color-neutral-600)]">
                Learn about the technology powering FernID's classification system
              </p>
            </div>

            {/* Model Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {modelStats.map((stat, index) => (
                <Card key={index} padding="md" hover>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[var(--color-neutral-600)] mb-1">{stat.label}</p>
                      <h2 className="text-[var(--color-neutral-800)]">{stat.value}</h2>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* How It Works */}
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-[var(--color-neutral-800)]">How It Works</h2>
              </div>
              <p className="text-[var(--color-neutral-600)] mb-6 leading-relaxed">
                FernID uses a deep convolutional neural network trained on thousands of fern images. 
                The model has been fine-tuned to recognize intricate patterns in frond structure, 
                leaflet arrangement, and venation patterns that distinguish different fern species.
              </p>
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-[var(--color-neutral-100)] rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[var(--color-neutral-800)]">{step.title}</h4>
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {step.status}
                        </span>
                      </div>
                      <p className="text-[var(--color-neutral-600)]">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Data Sources */}
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-[var(--color-neutral-800)]">Data Sources</h2>
              </div>
              <p className="text-[var(--color-neutral-600)] mb-4 leading-relaxed">
                Species information is sourced from reputable botanical databases and scientific resources:
              </p>
              <ul className="space-y-3">
                {dataSources.map((source, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-[var(--color-neutral-700)]"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Technical Details */}
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-[var(--color-neutral-800)]">Technical Stack</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[var(--color-neutral-800)] mb-3">Machine Learning</h4>
                  <ul className="space-y-2 text-[var(--color-neutral-600)]">
                    <li>• TensorFlow / Keras framework</li>
                    <li>• ResNet50 base architecture</li>
                    <li>• Transfer learning approach</li>
                    <li>• Data augmentation techniques</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[var(--color-neutral-800)] mb-3">Data Processing</h4>
                  <ul className="space-y-2 text-[var(--color-neutral-600)]">
                    <li>• Python 3.10+ with Jupyter notebooks</li>
                    <li>• NumPy & Pandas for data manipulation</li>
                    <li>• OpenCV for image processing</li>
                    <li>• REST APIs for data fetching</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* System Status */}
            <Card padding="lg">
              <h3 className="text-[var(--color-neutral-800)] mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[var(--color-neutral-800)]">Model API</span>
                  </div>
                  <span className="text-green-700">Operational</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[var(--color-neutral-800)]">Data Fetching Service</span>
                  </div>
                  <span className="text-green-700">Operational</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[var(--color-neutral-800)]">Database Connection</span>
                  </div>
                  <span className="text-green-700">Operational</span>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
