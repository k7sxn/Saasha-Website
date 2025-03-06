import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';

type VolunteerRegistration = Database['public']['Tables']['volunteer_registrations']['Row'];

const VolunteerManager = () => {
  const [applications, setApplications] = useState<VolunteerRegistration[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<VolunteerRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<'approved' | 'rejected' | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteer_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      setUpdatingId(id);
      setUpdatingStatus(status as 'approved' | 'rejected');
      
      const { error } = await supabase
        .from('volunteer_registrations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status } : app
        )
      );
      
      if (selectedApplication?.id === id) {
        setSelectedApplication(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    } finally {
      setUpdatingId(null);
      setUpdatingStatus(null);
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text">
          Volunteer Applications
        </h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-700 dark:text-gray-300">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Loading applications...
                      </td>
                    </tr>
                  ) : filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((application) => (
                      <tr 
                        key={application.id}
                        className={selectedApplication?.id === application.id ? 
                          'bg-gray-50 dark:bg-gray-700/50' : ''}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {application.full_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {application.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(application.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[application.status]}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedApplication(application)}
                            className="text-saasha-rose hover:text-saasha-rose/80"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="lg:col-span-1">
          {selectedApplication ? (
            <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-8 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Application Details
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'approved')}
                    disabled={selectedApplication.status === 'approved' || updatingId === selectedApplication.id}
                    className="px-3 py-1 text-sm rounded-md bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingId === selectedApplication.id && updatingStatus === 'approved' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Approving...
                      </span>
                    ) : 'Approve'}
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                    disabled={selectedApplication.status === 'rejected' || updatingId === selectedApplication.id}
                    className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingId === selectedApplication.id && updatingStatus === 'rejected' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Rejecting...
                      </span>
                    ) : 'Reject'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Information</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedApplication.full_name}</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedApplication.email}</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedApplication.phone}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Areas of Interest</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedApplication.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Availability</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedApplication.availability.map((time, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Previous Experience</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {selectedApplication.experience}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Application Date</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {new Date(selectedApplication.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-8 text-center text-gray-500 dark:text-gray-400">
              Select an application to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerManager;
