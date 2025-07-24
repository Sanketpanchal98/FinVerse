import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputType from '../Partials/InputType';
import ArrowLoader from '../Animations/ArrowLoader';
import { dataUpdate } from '../API/User.api';
import { addUser, updateUser } from '../Slices/AuthSlice';
import { Link } from 'react-router-dom';

const SettingsProf = () => {
  const { theme } = useSelector(state => state.theme);
  const { user, isLoading } = useSelector(state => state.user);

  // Original values (to compare against)
  const originalValues = useMemo(() => ({
    avatar: user?.data?.avatar || '',
    name: user?.data?.name || '',
    gender: user?.data?.gender || '',
    dob: user?.data?.dob || '',
    phoneNo: user?.data?.phoneNo || '',
    address: user?.data?.address || 'Universe'
  }), [user]);

  // Current form values
  const [formValues, setFormValues] = useState(originalValues);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenOpt, setIsOpenOpt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIserror] = useState(false);

  const dispatch = useDispatch()

  // Profile picture options
  const proPicOpt = ['prof1', 'prof2', 'prof3', 'prof4', 'prof5', 'prof6', 'prof7', 'prof8', 'prof9', 'prof10', 'prof11', 'prof12'];

  // Calculate changed fields
  const changedFields = useMemo(() => {
    const changes = {};
    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== originalValues[key]) {
        changes[key] = formValues[key];
      }
    });
    return changes;
  }, [formValues, originalValues]);

  // Check if there are any changes
  const hasChanges = Object.keys(changedFields).length > 0;

  // Update form field
  const updateField = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save with only changed fields
  const handleSave = async () => {
    if (!hasChanges) {
      setIsEdit(false);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        changes: changedFields
      };      
      
      const response = await dataUpdate(payload.changes)
      
      dispatch(addUser(response.data))
      
      setIsEdit(false);
      
    } catch (error) {
      console.log(error);
      
      setIserror(true)
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel - reset to original values
  const handleCancel = () => {
    setFormValues(originalValues);
    setIsEdit(false);
    setIsOpenOpt(false);
    setIserror(false)
  };

  // Reset form values when user data changes
  useEffect(() => {
    setFormValues(originalValues);
  }, [originalValues]);

  if (isLoading) {
    return <ArrowLoader />;
  }

  return (
    <div className={`w-full flex flex-col gap-4 transition-all duration-500 lg:h-[640px] overflow-auto ${theme ? 'bg-light-background text-dark' : 'bg-dark-background text-light'}`}>
      {/* Add Expense Form */}
      <div className={`w-full rounded-xl shadow p-4 sm:p-6 ${theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>
        
        {/* Header with Edit Button */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <i className="ri-user-settings-line text-2xl"></i>
            <h2 className="text-xl sm:text-2xl font-semibold">Profile Settings</h2>
          </div>
          
          <div className="flex gap-2">
            {isEdit ? (
              <>
                <button
                  className="bg-gray-500 hover:bg-gray-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-white transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <i className="ri-close-line"></i>
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <button
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-white transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base ${
                    hasChanges && !isSaving
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                >
                  {isSaving ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span className="hidden sm:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line"></i>
                      <span className="hidden sm:inline">Save</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-white transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
                onClick={() => {
                  setIsEdit(true);
                  setIsOpenOpt(false);
                }}
              >
                <i className="ri-edit-line"></i>
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Changes Indicator */}
        {isEdit && hasChanges && (
          <div className={`w-full mb-4 p-3 rounded-lg border-l-4 ${
            theme ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-blue-900 border-blue-400 text-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              <i className="ri-information-line"></i>
              <span className="font-medium">Unsaved Changes</span>
            </div>
            <div className="mt-2 text-sm">
              Modified fields: {Object.keys(changedFields).join(', ')}
            </div>
          </div>
        )}

        {isError &&  (
          <div className={`w-full mb-4 p-3 rounded-lg border-l-4 ${
            theme ? 'bg-blue-50 border-red-500 text-red-800' : 'bg-red-900 border-red-400 text-red-200'
          }`}>
            <div className="flex items-center gap-2">
              <i className="ri-information-line"></i>
              <span className="font-medium">Error</span>
            </div>
            <div className="mt-2 text-sm">
              Modified fields: {Object.keys(changedFields).join(', ')}
            </div>
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="w-full flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 shadow-lg ${
              changedFields.avatar ? 'border-blue-500' : 'border-gray-200'
            }`}>
              <img 
                src={`/ProfilePhotos/${formValues.avatar}.png`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <button
              className={`absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isEdit 
                  ? "cursor-pointer hover:scale-110" 
                  : "cursor-not-allowed opacity-50"
              } ${
                theme 
                  ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50" 
                  : "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
              }`}
              onClick={() => isEdit && setIsOpenOpt(prev => !prev)}
              disabled={!isEdit}
            >
              <i className="ri-camera-line text-sm sm:text-base"></i>
            </button>
          </div>

          {/* Profile Picture Options */}
          {isOpenOpt && (
            <div className={`w-full max-w-md p-4 rounded-lg border-2 transition-all duration-300 ${
              theme ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-600'
            }`}>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <i className="ri-image-line"></i>
                Choose Profile Picture
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                {proPicOpt.map((src, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${
                      formValues.avatar === src ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      updateField('avatar', src);
                      setIsOpenOpt(false);
                    }}
                  >
                    <img 
                      src={`/ProfilePhotos/${src}.png`} 
                      alt={`Profile option ${index + 1}`}
                      className="w-full h-16 sm:h-20 object-cover"
                    />
                    {formValues.avatar === src && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <i className="ri-check-line text-blue-600 text-xl font-bold"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Information Form */}
        <div className="w-full max-w-2xl mx-auto">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <i className="ri-information-line"></i>
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <i className="ri-user-line"></i>
                  Full Name
                  {changedFields.name && <i className="ri-edit-circle-line text-blue-500"></i>}
                </label>
                <InputType 
                  value={formValues.name} 
                  isEdit={isEdit}
                  onChange={(value) => updateField('name', value)}
                  placeholder="Enter your full name"
                  theme={theme}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <i className="ri-genderless-line"></i>
                  Gender
                  {changedFields.gender && <i className="ri-edit-circle-line text-blue-500"></i>}
                </label>
                <InputType 
                  value={formValues.gender} 
                  isEdit={isEdit}
                  onChange={(value) => updateField('gender', value)}
                  placeholder="Select gender"
                  theme={theme}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <i className="ri-calendar-line"></i>
                  Date of Birth
                  {changedFields.dob && <i className="ri-edit-circle-line text-blue-500"></i>}
                </label>
                <InputType 
                  value={formValues.dob} 
                  type="date" 
                  isEdit={isEdit}
                  onChange={(value) => updateField('dob', value)}
                  theme={theme}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <i className="ri-phone-line"></i>
                  Phone Number
                  {changedFields.phoneNo && <i className="ri-edit-circle-line text-blue-500"></i>}
                </label>
                <InputType 
                  value={formValues.phoneNo} 
                  isEdit={isEdit}
                  onChange={(value) => updateField('phoneNo', value)}
                  placeholder="Enter phone number"
                  theme={theme}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <i className="ri-map-pin-line"></i>
                  Address
                  {changedFields.address && <i className="ri-edit-circle-line text-blue-500"></i>}
                </label>
                <InputType 
                  value={formValues.address} 
                  isEdit={isEdit}
                  onChange={(value) => updateField('address', value)}
                  placeholder="Enter your address"
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons for Mobile */}
        {isEdit && (
          <div className="w-full flex justify-center gap-4 mt-8 sm:hidden">
            <button
              className="bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-lg text-white transition-colors duration-200 flex items-center gap-2"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <i className="ri-close-line"></i>
              Cancel
            </button>
            <button
              className={`px-6 py-3 rounded-lg text-white transition-colors duration-200 flex items-center gap-2 ${
                hasChanges && !isSaving
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}

        <div className='flex flex-col gap-4 mt-10 md:ml-6 p-4 w-full'>
          <Link className='bg-red-600 text-white px-4 py-2 rounded-xl font-semibold w-40 text-center'
          to={'/dashboard/resetpassword'}
          >Reset Password</Link>
          <Link className='bg-red-600 text-white px-4 py-2 rounded-xl font-semibold text-center w-40 text-center'
          to={'/dashboard/resetemail'}
          >Reset Email</Link>
        </div>

      </div>
    </div>
  );
};

export default SettingsProf;