import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/dpp';

const DashboardApp = () => {
  const [passports, setPassports] = useState([]);
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'detail', 'create', 'addRepair'
  const [searchTerm, setSearchTerm] = useState('');
  const [newPassport, setNewPassport] = useState({
    productName: '',
    manufacturer: '',
    serialNumber: '',
    manufacturingDate: '',
    productType: '',
    modelNumber: ''
  });
  const [newRepair, setNewRepair] = useState({
    repairDate: '',
    description: '',
    repairType: '',
    technician: ''
  });

  // Fetch all passports
  const fetchPassports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch passports');
      const data = await response.json();
      setPassports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch passport detail
  const fetchPassportDetails = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch passport details');
      const data = await response.json();
      setSelectedPassport(data);
      setView('detail');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new passport
  const createPassport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dateTimeString = newPassport.manufacturingDate 
        ? new Date(newPassport.manufacturingDate).toISOString() 
        : new Date().toISOString();
        
      const passportData = {
        ...newPassport,
        manufacturingDate: dateTimeString
      };
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passportData)
      });
      
      if (!response.ok) throw new Error('Failed to create passport');
      
      const createdPassport = await response.json();
      setPassports([...passports, createdPassport]);
      setSelectedPassport(createdPassport);
      setView('detail');
      setNewPassport({
        productName: '',
        manufacturer: '',
        serialNumber: '',
        manufacturingDate: '',
        productType: '',
        modelNumber: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add repair entry
  const addRepairEntry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dateTimeString = newRepair.repairDate 
        ? new Date(newRepair.repairDate).toISOString() 
        : new Date().toISOString();
        
      // Create repair data without passport reference to avoid circular JSON
      const repairData = {
        description: newRepair.description,
        repairType: newRepair.repairType,
        repairDate: dateTimeString,
        technician: newRepair.technician
        // Don't include passport here to avoid circular references
      };
      
      console.log('Sending repair data:', repairData);
      
      const response = await fetch(`${API_BASE_URL}/${selectedPassport.id}/repairs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repairData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Failed to add repair entry: ${response.status} ${response.statusText}`);
      }
      
      // Wait a moment before refreshing (to ensure the backend has processed the change)
      setTimeout(() => {
        // Refresh passport details to include the new repair entry
        fetchPassportDetails(selectedPassport.id);
        
        setNewRepair({
          repairDate: '',
          description: '',
          repairType: '',
          technician: ''
        });
        
        setView('detail');
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error adding repair:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Handle input change for new passport form
  const handlePassportInputChange = (e) => {
    const { name, value } = e.target;
    setNewPassport({
      ...newPassport,
      [name]: value
    });
  };

  // Handle input change for new repair form
  const handleRepairInputChange = (e) => {
    const { name, value } = e.target;
    setNewRepair({
      ...newRepair,
      [name]: value
    });
  };

  // Initial data load
  useEffect(() => {
    fetchPassports();
  }, []);

  // Filter passports based on search term
  const filteredPassports = passports.filter(passport => 
    passport.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passport.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passport.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Digital Product Passport Dashboard</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto p-4 overflow-auto">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div>
            <div className="mb-4 flex justify-between">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-2 pl-8 border rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button
                onClick={() => setView('create')}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manufacturer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manufacturing Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPassports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredPassports.map((passport) => (
                      <tr key={passport.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{passport.productName}</div>
                          <div className="text-sm text-gray-500">Model: {passport.modelNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passport.manufacturer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passport.serialNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passport.productType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(passport.manufacturingDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => fetchPassportDetails(passport.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FileText className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail View */}
        {view === 'detail' && selectedPassport && (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setView('list')}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Back to List
              </button>
              <h2 className="text-xl font-semibold flex-1">
                {selectedPassport.productName} - Details
              </h2>
              <button
                onClick={() => setView('addRepair')}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              >
                <span className="mr-2">🔧</span>
                Add Repair Entry
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Product Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Product Name</p>
                    <p className="font-medium">{selectedPassport.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Manufacturer</p>
                    <p className="font-medium">{selectedPassport.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Serial Number</p>
                    <p className="font-medium">{selectedPassport.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model Number</p>
                    <p className="font-medium">{selectedPassport.modelNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Product Type</p>
                    <p className="font-medium">{selectedPassport.productType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Manufacturing Date</p>
                    <p className="font-medium">{formatDate(selectedPassport.manufacturingDate)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Repair History</h3>
                {selectedPassport.repairHistory && selectedPassport.repairHistory.length > 0 ? (
                  <div className="space-y-4">
                    {selectedPassport.repairHistory.map((repair) => (
                      <div key={repair.id} className="border-l-4 border-blue-400 pl-4 py-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{repair.repairType}</span>
                          <span className="text-sm text-gray-500">{formatDate(repair.repairDate)}</span>
                        </div>
                        <p className="text-gray-700 mt-1">{repair.description}</p>
                        <p className="text-sm text-gray-500 mt-2">Technician: {repair.technician}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No repair history available.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create New Passport Form */}
        {view === 'create' && (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setView('list')}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <h2 className="text-xl font-semibold">Add New Product</h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      name="productName"
                      value={newPassport.productName}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={newPassport.manufacturer}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={newPassport.serialNumber}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturing Date</label>
                    <input
                      type="datetime-local"
                      name="manufacturingDate"
                      value={newPassport.manufacturingDate}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Type</label>
                    <input
                      type="text"
                      name="productType"
                      value={newPassport.productType}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model Number</label>
                    <input
                      type="text"
                      name="modelNumber"
                      value={newPassport.modelNumber}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={createPassport}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Product Passport'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Repair Entry Form */}
        {view === 'addRepair' && selectedPassport && (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setView('detail')}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <h2 className="text-xl font-semibold">
                Add Repair Entry for {selectedPassport.productName}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Repair Type</label>
                    <input
                      type="text"
                      name="repairType"
                      value={newRepair.repairType}
                      onChange={handleRepairInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Repair Date</label>
                    <input
                      type="datetime-local"
                      name="repairDate"
                      value={newRepair.repairDate}
                      onChange={handleRepairInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Technician</label>
                    <input
                      type="text"
                      name="technician"
                      value={newRepair.technician}
                      onChange={handleRepairInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={newRepair.description}
                      onChange={handleRepairInputChange}
                      rows="5"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={addRepairEntry}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Repair Entry'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Digital Product Passport System</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardApp;