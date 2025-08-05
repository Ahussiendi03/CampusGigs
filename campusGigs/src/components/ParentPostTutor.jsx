import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const ParentPostTutor = () => {
  const location = useLocation();

  const [parentData, setParentData] = useState({ campusAddress: '' });
  const [tutorPosts, setTutorPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);

  const [postData, setPostData] = useState({
    tutorType: '',
    salary: '',
    quota: '',
    days: [],
    startTime: '',
    endTime: '',
  });

  const [showDismissModal, setShowDismissModal] = useState(false);
  const [selectedTutorPostId, setSelectedTutorPostId] = useState(null);
  const [dismissReason, setDismissReason] = useState('');
  const [showTutorMenu, setShowTutorMenu] = useState(false);

  // Days options
  const daysOfWeek = ['M', 'T', 'W', 'Th', 'F', 'Sat', 'Sun'];

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const parentId = localStorage.getItem('parentId');
        if (!parentId) {
          alert('Please log in as a parent.');
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/tutorPosts/parents/${parentId}`);
        setParentData(response.data);
      } catch (error) {
        console.error('Error fetching parent data:', error);
      }
    };

    const fetchTutorPosts = async () => {
      const parentId = localStorage.getItem('parentId');
      try {
        const response = await axios.get(`http://localhost:5000/api/tutorPosts/parent?parentId=${parentId}&status=approved`);
        setTutorPosts(response.data);
      } catch (error) {
        console.error('Error fetching tutor posts:', error);
      }
    };

    fetchParentData();
    fetchTutorPosts();
  }, []);

  const togglePostModal = () => setShowPostModal(!showPostModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setPostData(prev => {
      let newDays = [...prev.days];
      if (checked) {
        if (!newDays.includes(value)) newDays.push(value);
      } else {
        newDays = newDays.filter(day => day !== value);
      }
      return { ...prev, days: newDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parentId = localStorage.getItem('parentId');
    if (!parentId) {
      alert('Please log in as a parent.');
      return;
    }

    const schedule = `${postData.days.join(', ')} | ${postData.startTime} - ${postData.endTime}`;

    const payload = {
      parentId,
      tutorType: postData.tutorType,
      schedule,
      salary: postData.salary,
      quota: postData.quota,
      address: parentData.campusAddress,
    };

    if (!payload.tutorType || !postData.days.length || !postData.startTime || !postData.endTime || !payload.salary || !payload.quota || !payload.address) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/tutorPosts/create', payload);
      setTutorPosts(prev => [...prev, response.data]);
      setPostData({
        tutorType: '',
        salary: '',
        quota: '',
        days: [],
        startTime: '',
        endTime: '',
      });
      setShowPostModal(false);
      const updated = await axios.get(`http://localhost:5000/api/tutorPosts/parent?parentId=${parentId}&status=approved`);
      setTutorPosts(updated.data);
    } catch (error) {
      alert('Error posting tutor job: ' + (error.response?.data?.message || error.message));
      console.error('Error posting tutor job:', error);
    }
  };
  const openDismissModal = (postId) => {
    setSelectedTutorPostId(postId);
    setDismissReason('');
    setShowDismissModal(true);
  };

  const handleDismissReasonChange = (e) => {
    setDismissReason(e.target.value);
  };

  const handleDismiss = async () => {
    if (!dismissReason.trim()) {
      alert("Please provide a reason for dismissal.");
      return;
    }
  
    try {
      await axios.put(`http://localhost:5000/api/tutorPosts/dismiss/${selectedTutorPostId}`, {
        reason: dismissReason,
      });
  
      const parentId = localStorage.getItem('parentId');
      const response = await axios.get('http://localhost:5000/api/tutorPosts/parent', {
        params: { parentId, status: 'approved' },
      });
      setTutorPosts(response.data);
  
      setShowDismissModal(false);
      setSelectedTutorPostId(null);
      setDismissReason('');
    } catch (error) {
      console.error("Error dismissing tutor post:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="bg-gray-200 w-[290px] h-[950px] p-4 shadow-md">
  <Link
    to="/ParentDashboard"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentDashboard'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-home text-lg mr-2"></i>
    <span className="text-lg font-bold">Dashboard</span>
  </Link>

  <Link
    to="/ParentMyAcc"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentMyAcc'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-user text-lg mr-2"></i>
    <span className="text-lg font-bold">My Account</span>
  </Link>

  {/* Dropdown for Tutors */}
  <div className="mb-4">
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
      onClick={() => setShowTutorMenu(!showTutorMenu)}
    >
      <div className="flex items-center">
        <i className="fas fa-users text-lg mr-2"></i>
        <span className="text-lg font-bold">Tutors</span>
      </div>
      <i
        className={`fas fa-chevron-${showTutorMenu ? 'up' : 'down'} text-gray-700 transition-transform duration-200`}
      ></i>
    </div>

    {showTutorMenu && (
      <div className="ml-6 mt-2">
        <Link
          to="/ParentTutors"
          className={`flex items-center mb-2 px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ParentTutors'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-user-check text-base mr-2"></i>
          <span className="text-base font-bold">Current Hired Tutors</span>
        </Link>

        <Link
          to="/ParentAppList"
          className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
            location.pathname === '/ParentAppList'
              ? 'bg-gold shadow-md'
              : 'hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-user-clock text-base mr-2"></i>
          <span className="text-base font-bold">Applicant List</span>
        </Link>
      </div>
    )}
  </div>

  <Link
    to="/ParentPostTutor"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentPostTutor'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-briefcase text-lg mr-2"></i>
    <span className="text-lg font-bold">Post Tutor</span>
  </Link>

  <Link
    to="/ParentFeedback"
    className={`flex items-center mb-4 px-4 py-3 rounded-lg cursor-pointer ${
      location.pathname === '/ParentFeedback'
        ? 'bg-gold shadow-md'
        : 'hover:bg-gray-300'
    }`}
  >
    <i className="fas fa-comments text-lg mr-2"></i>
    <span className="text-lg font-bold">Feedbacks</span>
  </Link>
</div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mb-48 p-4">
        <div className="mt-6 w-full">
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-3xl font-bold ml-1">Jobs Posted</p>
            <button
              onClick={togglePostModal}
              className="py-2 px-4 bg-maroon-700 text-yellow-300 font-bold text-base rounded-lg w-[150px] mr-4 hover:bg-maroon-800"
            >
              + Post a Job
            </button>
          </div>

          {/* Tutor Posts Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-yellow-300 text-black font-bold text-base">
                  <th className="py-2 px-4 border-b">Tutor Type</th>
                  <th className="py-2 px-4 border-b">Address</th>
                  <th className="py-2 px-4 border-b">Schedule</th>
                  <th className="py-2 px-4 border-b">Salary</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tutorPosts.length > 0 ? (
                  tutorPosts.map(post => (
                    <tr key={post._id} className="text-center border-b hover:bg-gray-100">
                      <td className="py-2 px-4">{post.tutorType}</td>
                      <td className="py-2 px-4">{post.address}</td>
                      <td className="py-2 px-4">{post.schedule}</td>
                      <td className="py-2 px-4">{post.salary}</td>
                      <td className="py-2 px-4">{post.status}</td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                          onClick={() => openDismissModal(post._id)}
                        >
                          Dismiss
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      No tutor posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Post Tutor Modal */}
      {showPostModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-[450px] max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Post a Tutor Job</h2>
            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label htmlFor="tutorType" className="block font-semibold mb-1">
                  Tutor Type
                </label>
                <input
                  type="text"
                  id="tutorType"
                  name="tutorType"
                  value={postData.tutorType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-1">Schedule (Days)</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <label key={day} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        value={day}
                        checked={postData.days.includes(day)}
                        onChange={handleDayChange}
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4 flex gap-4">
                <div className="flex-1">
                  <label htmlFor="startTime" className="block font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={postData.startTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="endTime" className="block font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={postData.endTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="salary" className="block font-semibold mb-1">Salary</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={postData.salary}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                  min={0}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="quota" className="block font-semibold mb-1">Quota</label>
                <input
                  type="number"
                  id="quota"
                  name="quota"
                  value={postData.quota}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                  min={1}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="address" className="block font-semibold mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={parentData.campusAddress || ''}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={togglePostModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-maroon-700 text-yellow-300 rounded hover:bg-maroon-800"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dismiss Tutor Post Modal */}
      {showDismissModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Dismiss Tutor Post</h3>
            <textarea
              rows={4}
              placeholder="Enter reason for dismissal..."
              value={dismissReason}
              onChange={handleDismissReasonChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDismissModal(false);
                  setDismissReason('');
                  setSelectedTutorPostId(null);
                }}
                className="py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDismiss}
                className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentPostTutor;
