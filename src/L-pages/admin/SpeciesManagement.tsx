import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Edit, Trash2, Plus, Eye, Upload } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import { getAllFernSpecies, addFernSpecies, updateFernSpecies, deleteFernSpecies } from '@/utils/species';
import { ImageWithFallback } from '../../components/fig/ImageWithFallback';

interface SpeciesManagementProps {
  onLogout: () => void;
}

interface FernSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  habitat: string;
  careRequirements: string;
  funFacts: string[];
  image?: string;
}

export default function SpeciesManagement({ onLogout }: SpeciesManagementProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<'delete' | 'edit' | 'add' | 'view' | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState({
    commonName: '',
    scientificName: '',
    description: '',
    habitat: '',
    careRequirements: '',
    funFacts: '',
    image: undefined as string | undefined
  });
  const imageInputRef = useRef<HTMLInputElement>(null);
  const handlePickImage = () => imageInputRef.current?.click();
  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Initialize species list from Supabase
  const [speciesList, setSpeciesList] = useState<FernSpecies[]>([]);

  useEffect(() => {
    getAllFernSpecies().then((data) => {
      setSpeciesList(
        Object.entries(data).map(([id, details]) => ({
          id,
          ...details,
        }))
      );
    });
  }, []);

  const selectedSpeciesData = speciesList.find(s => s.id === selectedSpecies);

  const filteredSpecies = speciesList.filter((species) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      species.commonName.toLowerCase().includes(query) ||
      species.scientificName.toLowerCase().includes(query)
    );
  });

  const handleLogoutClick = () => {
    onLogout();
  };

  const handleAddSpecies = () => {
    setFormData({
      commonName: '',
      scientificName: '',
      description: '',
      habitat: '',
      careRequirements: '',
      funFacts: '',
      image: undefined
    });
    setModalAction('add');
  };

  const handleEditSpecies = (speciesId: string) => {
    const species = speciesList.find((s) => s.id === speciesId);
    setFormData({
      commonName: species?.commonName ?? '',
      scientificName: species?.scientificName ?? '',
      description: species?.description ?? '',
      habitat: species?.habitat ?? '',
      careRequirements: species?.careRequirements ?? '',
      funFacts: species?.funFacts.join('\n') ?? '',
      image: species?.image
    });
    setSelectedSpecies(speciesId);
    setModalAction('edit');
  };

  const handleViewSpecies = (speciesId: string) => {
    setSelectedSpecies(speciesId);
    setModalAction('view');
  };

  const handleSubmit = async () => {
    if (modalAction === 'add') {
      const slug = formData.commonName.toLowerCase().replace(/\s+/g, '-');
      const details = {
        commonName: formData.commonName,
        scientificName: formData.scientificName,
        description: formData.description,
        habitat: formData.habitat,
        careRequirements: formData.careRequirements,
        funFacts: formData.funFacts.split('\n').filter((fact) => fact.trim() !== ''),
      };
      const ok = await addFernSpecies(slug, details);
      if (ok) {
        const refreshed = await getAllFernSpecies();
        setSpeciesList(
          Object.entries(refreshed).map(([id, details]) => ({ id, ...details }))
        );
        setAlertMessage('Species added successfully!');
      } else {
        setAlertMessage('Failed to add species.');
      }
    } else if (modalAction === 'edit' && selectedSpecies) {
      const details = {
        commonName: formData.commonName,
        scientificName: formData.scientificName,
        description: formData.description,
        habitat: formData.habitat,
        careRequirements: formData.careRequirements,
        funFacts: formData.funFacts.split('\n').filter((fact) => fact.trim() !== ''),
      };
      const ok = await updateFernSpecies(selectedSpecies, details);
      if (ok) {
        const refreshed = await getAllFernSpecies();
        setSpeciesList(
          Object.entries(refreshed).map(([id, details]) => ({ id, ...details }))
        );
        setAlertMessage('Species updated successfully!');
      } else {
        setAlertMessage('Failed to update species.');
      }
    }
    setShowSuccessAlert(true);
    setModalAction(null);
    setSelectedSpecies(null);
  };

  const handleDelete = async () => {
    if (selectedSpecies) {
      const ok = await deleteFernSpecies(selectedSpecies);
      if (ok) {
        const refreshed = await getAllFernSpecies();
        setSpeciesList(
          Object.entries(refreshed).map(([id, details]) => ({ id, ...details }))
        );
        setAlertMessage('Species deleted successfully!');
      } else {
        setAlertMessage('Failed to delete species.');
      }
      setShowSuccessAlert(true);
    }
    setModalAction(null);
    setSelectedSpecies(null);
  };

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
            <h2 className="text-[var(--color-neutral-800)]">Fern Species Management</h2>
            <div className="w-6 lg:w-0"></div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Success Alert */}
            {showSuccessAlert && (
              <Alert
                type="success"
                message={alertMessage}
                onClose={() => setShowSuccessAlert(false)}
              />
            )}

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-[var(--color-neutral-800)]">Fern Species Database</h3>
                <p className="text-[var(--color-neutral-600)]">
                  {speciesList.length} species registered
                </p>
              </div>
              <Button variant="primary" onClick={handleAddSpecies}>
                <Plus className="w-5 h-5" />
                Add Species
              </Button>
            </div>

            {/* Search */}
            <Card padding="md">
              <Input
                type="text"
                placeholder="Search by common or scientific name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </Card>

            {/* Species Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecies.map((species) => (
                <Card key={species.id} padding="none" hover>
                  <div className="relative aspect-video rounded-t-xl overflow-hidden">
                    {species.image ? (
                      <img src={species.image} alt={species.commonName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-6xl">
                        🌿
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="text-[var(--color-neutral-800)] mb-1">
                      {species.commonName}
                    </h4>
                    <p className="text-sm text-[var(--color-neutral-600)] italic mb-3">
                      {species.scientificName}
                    </p>
                    <p className="text-sm text-[var(--color-neutral-600)] line-clamp-2 mb-4">
                      {species.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        onClick={() => handleViewSpecies(species.id)}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        onClick={() => handleEditSpecies(species.id)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          setSelectedSpecies(species.id);
                          setModalAction('delete');
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredSpecies.length === 0 && (
              <Card padding="lg">
                <div className="text-center py-12">
                  <p className="text-[var(--color-neutral-600)]">
                    No species found matching "{searchQuery}"
                  </p>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* View Species Modal */}
      <Modal
        isOpen={modalAction === 'view'}
        onClose={() => {
          setModalAction(null);
          setSelectedSpecies(null);
        }}
        title={selectedSpeciesData?.commonName || 'Species Details'}
      >
        {selectedSpeciesData && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--color-neutral-600)] mb-1">Scientific Name</p>
              <p className="text-[var(--color-neutral-800)] italic">
                {selectedSpeciesData.scientificName}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-neutral-600)] mb-1">Description</p>
              <p className="text-[var(--color-neutral-800)]">
                {selectedSpeciesData.description}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-neutral-600)] mb-1">Habitat</p>
              <p className="text-[var(--color-neutral-800)]">
                {selectedSpeciesData.habitat}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-neutral-600)] mb-1">Care Requirements</p>
              <p className="text-[var(--color-neutral-800)]">
                {selectedSpeciesData.careRequirements}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-neutral-600)] mb-2">Fun Facts</p>
              <ul className="list-disc list-inside space-y-1">
                {selectedSpeciesData.funFacts.map((fact, index) => (
                  <li key={index} className="text-[var(--color-neutral-800)]">
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Species Modal */}
      <Modal
        isOpen={modalAction === 'add' || modalAction === 'edit'}
        onClose={() => {
          setModalAction(null);
          setSelectedSpecies(null);
        }}
        title={modalAction === 'add' ? 'Add New Species' : 'Edit Species'}
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setModalAction(null);
                setSelectedSpecies(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" fullWidth onClick={handleSubmit}>
              {modalAction === 'add' ? 'Add Species' : 'Save Changes'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
              Species Image (optional)
            </label>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handlePickImage}>
                <Upload className="w-4 h-4" />
                Upload Image
              </Button>
              {formData.image && (
                <Button variant="ghost" onClick={() => setFormData({ ...formData, image: undefined })}>
                  Remove
                </Button>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelected}
              />
            </div>
            {formData.image && (
              <div className="mt-3">
                <img src={formData.image} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
              Common Name
            </label>
            <Input
              type="text"
              value={formData.commonName}
              onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
              placeholder="e.g., Boston Fern"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
              Scientific Name
            </label>
            <Input
              type="text"
              value={formData.scientificName}
              onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
              placeholder="e.g., Nephrolepis exaltata"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 border border-[var(--color-neutral-300)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter species description..."
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
              Habitat
            </label>
            <Input
              type="text"
              value={formData.habitat}
              onChange={(e) => setFormData({ ...formData, habitat: e.target.value })}
              placeholder="e.g., Tropical rainforests"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
              Care Requirements
            </label>
            <textarea
              className="w-full px-4 py-3 border border-[var(--color-neutral-300)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
              rows={3}
              value={formData.careRequirements}
              onChange={(e) => setFormData({ ...formData, careRequirements: e.target.value })}
              placeholder="Enter care requirements..."
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
              Fun Facts (one per line)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-[var(--color-neutral-300)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
              rows={3}
              value={formData.funFacts}
              onChange={(e) => setFormData({ ...formData, funFacts: e.target.value })}
              placeholder="Enter fun facts, one per line..."
            />
          </div>
        </div>
      </Modal>

      {/* Delete Species Modal */}
      <Modal
        isOpen={modalAction === 'delete'}
        onClose={() => {
          setModalAction(null);
          setSelectedSpecies(null);
        }}
        title="Delete Species"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setModalAction(null);
                setSelectedSpecies(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={handleDelete}>
              Delete Species
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete this species from the database? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}