import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaFileAlt, FaSignOutAlt, FaUser, FaBuilding } from 'react-icons/fa';

const RecruiterDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [offers] = useState([
    {
      id: 1,
      candidateName: 'Alice Johnson',
      candidateEmail: 'alice@email.com',
      position: 'Senior Software Engineer',
      dateCreated: '2025-01-15',
      status: 'Verified',
      hash: 'a1b2c3d4e5f6...'
    },
    {
      id: 2,
      candidateName: 'Bob Smith',
      candidateEmail: 'bob@email.com',
      position: 'Product Manager',
      dateCreated: '2025-01-14',
      status: 'Pending',
      hash: 'f6e5d4c3b2a1...'
    }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('recruiterData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('recruiterToken');
    localStorage.removeItem('recruiterData');
    navigate('/recruiter');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUser className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{userData.fullName}</p>
                <p className="text-sm text-gray-500">{userData.companyName}</p>
              </div>
            </div>
          </div>

          <nav className="mt-6">
            <Link to="/recruiter/generate" className="sidebar-item">
              <FaPlus className="h-5 w-5 mr-3" />
              Generate Offer
            </Link>
            <div className="sidebar-item active">
              <FaFileAlt className="h-5 w-5 mr-3" />
              My Offers
            </div>
            <button onClick={handleLogout} className="w-full sidebar-item text-left">
              <FaSignOutAlt className="h-5 w-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your offer letters and verifications</p>
              </div>
              <Link
                to="/recruiter/generate"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <FaPlus />
                <span>Generate New Offer</span>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
                    <p className="text-gray-600">Total Offers</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {offers.filter(offer => offer.status === 'Verified').length}
                    </p>
                    <p className="text-gray-600">Verified</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {offers.filter(offer => offer.status === 'Pending').length}
                    </p>
                    <p className="text-gray-600">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Offers Table */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Offers</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {offers.map((offer) => (
                      <tr key={offer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {offer.candidateName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {offer.candidateEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{offer.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{offer.dateCreated}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            offer.status === 'Verified'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {offer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-500">{offer.hash}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {offers.length === 0 && (
                <div className="text-center py-12">
                  <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No offers generated yet</p>
                  <Link
                    to="/recruiter/generate"
                    className="mt-4 btn-primary inline-flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Create Your First Offer</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;