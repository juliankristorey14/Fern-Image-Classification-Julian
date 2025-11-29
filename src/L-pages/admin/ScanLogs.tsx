import { useState, useEffect } from 'react';
import { Menu, Search, Filter, Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import { getAllScans } from '@/utils/scans';
import { getAllUsers } from '@/utils/admin';
import { ImageWithFallback } from '../../components/fig/ImageWithFallback';

interface ScanLogsProps {
  onLogout: () => void;
}

export default function ScanLogs({ onLogout }: ScanLogsProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ferns' | 'non-ferns' | 'plants'>('all');
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [showExportAlert, setShowExportAlert] = useState(false);

  const [scans, setScans] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Promise.all([getAllScans(), getAllUsers()]).then(([scansData, usersData]) => {
      setScans(scansData);
      setUsers(usersData);
    });
  }, []);

  const filteredScans = scans.filter((scan) => {
    // Apply type filter
    if (filterType === 'ferns' && !scan.isFern) return false;
    if (filterType === 'non-ferns' && scan.isFern) return false;
    if (filterType === 'plants' && !scan.isPlant) return false;

    // Apply search filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const user = users.find(u => u.id === scan.userId);
    return (
      user?.username.toLowerCase().includes(query) ||
      user?.email.toLowerCase().includes(query) ||
      scan.species?.toLowerCase().includes(query) ||
      scan.details?.commonName.toLowerCase().includes(query)
    );
  });

  const handleLogoutClick = () => {
    onLogout();
  };

  const handleExportLogs = () => {
    // In real app, would generate CSV/Excel export
    console.log('Exporting scan logs...');
    setShowExportAlert(true);
  };

  const viewScanDetails = (scanId: string) => {
    setSelectedScan(scanId);
  };

  const selectedScanData = selectedScan ? scans.find(s => s.id === selectedScan) : null;
  const selectedScanUser = selectedScanData ? users.find(u => u.id === selectedScanData.userId) : null;

  return (
    <div className="flex h-screen bg-[var(--color-neutral-100)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar onLogout={handleLogoutClick} />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <AdminSidebar
              onLogout={handleLogoutClick}
              onClose={() => setIsSidebarOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav */}
        <div className="bg-white border-b border-[var(--color-neutral-200)] px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-[var(--color-neutral-700)] hover:text-[var(--color-neutral-900)]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-[var(--color-neutral-800)]">Scan Logs</h2>
            <div className="w-6 lg:w-0"></div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-[var(--color-neutral-800)]">All Scan Logs</h3>
                <p className="text-[var(--color-neutral-600)]">
                  {filteredScans.length} scans {filterType !== 'all' && `(filtered)`}
                </p>
              </div>
              <Button variant="primary" onClick={handleExportLogs}>
                <Download className="w-5 h-5" />
                Export Logs
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card padding="md">
                <Input
                  type="text"
                  placeholder="Search by user, species, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </Card>
              <Card padding="md">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[var(--color-neutral-600)]" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="flex-1 bg-transparent text-[var(--color-neutral-800)] focus:outline-none"
                  >
                    <option value="all">All Scans</option>
                    <option value="ferns">Ferns Only</option>
                    <option value="non-ferns">Non-Ferns</option>
                    <option value="plants">Plants Only</option>
                  </select>
                </div>
              </Card>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card padding="md">
                <p className="text-[var(--color-neutral-600)] mb-1">Total Scans</p>
                <h3 className="text-[var(--color-neutral-800)]">{scans.length}</h3>
              </Card>
              <Card padding="md">
                <p className="text-[var(--color-neutral-600)] mb-1">Fern Detections</p>
                <h3 className="text-[var(--color-neutral-800)]">
                  {scans.filter(s => s.isFern).length}
                </h3>
              </Card>
              <Card padding="md">
                <p className="text-[var(--color-neutral-600)] mb-1">Plant Detections</p>
                <h3 className="text-[var(--color-neutral-800)]">
                  {scans.filter(s => s.isPlant).length}
                </h3>
              </Card>
              <Card padding="md">
                <p className="text-[var(--color-neutral-600)] mb-1">Average Confidence</p>
                <h3 className="text-[var(--color-neutral-800)]">
                  {(scans.reduce((sum, s) => sum + s.confidence, 0) / scans.length).toFixed(1)}%
                </h3>
              </Card>
            </div>

            {/* Scans Table */}
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-neutral-100)] border-b border-[var(--color-neutral-200)]">
                    <tr>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        Image
                      </th>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        User
                      </th>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        Result
                      </th>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        Species
                      </th>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        Confidence
                      </th>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        Date
                      </th>
                      <th className="text-right px-6 py-4 text-[var(--color-neutral-700)]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-neutral-200)]">
                    {filteredScans.map((scan) => {
                      const user = users.find(u => u.id === scan.userId);
                      return (
                        <tr
                          key={scan.id}
                          className="hover:bg-[var(--color-neutral-50)] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <ImageWithFallback
                              src={scan.image}
                              alt="Scan"
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          </td>
                          <td className="px-6 py-4 text-[var(--color-neutral-800)]">
                            {user?.username || 'Unknown'}
                          </td>
                          <td className="px-6 py-4">
                            {scan.isFern ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3" />
                                Fern
                              </span>
                            ) : scan.isPlant ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm bg-blue-100 text-blue-700">
                                <CheckCircle className="w-3 h-3" />
                                Plant
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm bg-gray-100 text-gray-700">
                                <XCircle className="w-3 h-3" />
                                Not Plant
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-[var(--color-neutral-600)]">
                            {scan.details?.commonName || '-'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-[var(--color-neutral-200)] rounded-full overflow-hidden max-w-[80px]">
                                <div
                                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
                                  style={{ width: `${scan.confidence}%` }}
                                />
                              </div>
                              <span className="text-sm text-[var(--color-neutral-600)]">
                                {scan.confidence}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[var(--color-neutral-600)]">
                            {new Date(scan.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end">
                              <button
                                onClick={() => viewScanDetails(scan.id)}
                                className="p-2 text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-100)] rounded-lg transition-colors"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {filteredScans.length === 0 && (
              <Card padding="lg">
                <div className="text-center py-12">
                  <p className="text-[var(--color-neutral-600)]">
                    No scans found matching your filters
                  </p>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Scan Details Modal */}
      <Modal
        isOpen={selectedScan !== null}
        onClose={() => setSelectedScan(null)}
        title="Scan Details"
      >
        {selectedScanData && (
          <div className="space-y-4">
            <div>
              <ImageWithFallback
                src={selectedScanData.image}
                alt="Scanned image"
                className="w-full rounded-xl object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--color-neutral-600)] mb-1">User</p>
                <p className="text-[var(--color-neutral-800)]">
                  {selectedScanUser?.username || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-neutral-600)] mb-1">Email</p>
                <p className="text-[var(--color-neutral-800)]">
                  {selectedScanUser?.email || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-neutral-600)] mb-1">Is Plant</p>
                <p className="text-[var(--color-neutral-800)]">
                  {selectedScanData.isPlant ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-neutral-600)] mb-1">Is Fern</p>
                <p className="text-[var(--color-neutral-800)]">
                  {selectedScanData.isFern ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-neutral-600)] mb-1">Confidence</p>
                <p className="text-[var(--color-neutral-800)]">
                  {selectedScanData.confidence}%
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-neutral-600)] mb-1">Scan Date</p>
                <p className="text-[var(--color-neutral-800)]">
                  {new Date(selectedScanData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            {selectedScanData.details && (
              <div>
                <p className="text-sm text-[var(--color-neutral-600)] mb-1">Species</p>
                <p className="text-[var(--color-neutral-800)]">
                  {selectedScanData.details.commonName}
                </p>
                <p className="text-sm text-[var(--color-neutral-600)] italic">
                  {selectedScanData.details.scientificName}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Export Alert */}
      <Alert
        isOpen={showExportAlert}
        onClose={() => setShowExportAlert(false)}
        type="success"
        title="Export Successful"
        message="Scan logs have been exported successfully."
      />
    </div>
  );
}