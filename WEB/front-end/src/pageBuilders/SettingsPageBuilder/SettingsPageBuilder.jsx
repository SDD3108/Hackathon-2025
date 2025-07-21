"use client"
import React, { useState, useRef } from 'react';
import { Input } from '@/src/ui/input';
import { Label } from '@/src/ui/label';
import { Button } from '@/src/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/src/ui/popover";
import { Calendar } from "@/src/ui/calendar";
import { CalendarIcon, Upload, User, Lock, Mail, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from 'framer-motion';
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore';
import Image from 'next/image';

const SettingsPageBuilder = () => {
  const { user, updateUser } = useAuthenticationStore();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    avatar: user?.avatar || '',
    email: user?.email || '',
    password: '',
    birthdate: user?.birthdate || new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    if (date) {
      setFormData(prev => ({ ...prev, birthdate: date }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateUser({ ...user, ...formData });
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center border-b border-gray-300 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <div className="ml-auto">
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-900 hover:bg-gray-200"
              onClick={handleSave}
            >
              SAVE CHANGES
            </Button>
          </div>
        </div>
        
        <div className="bg-white shadow-lg border border-gray-300 rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-r border-gray-300 bg-gray-50">
              <div className="p-6">
                <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Navigation</h2>
                <ul className="space-y-2">
                  {[
                    { id: 'profile', label: 'Profile' },
                    { id: 'security', label: 'Security' },
                    { id: 'billing', label: 'Billing' }
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        className={`w-full text-left px-3 py-3 rounded transition-all flex items-center ${
                          activeSection === item.id 
                            ? 'bg-gray-200 text-gray-900 font-medium border-l-4 border-gray-900' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <span className="ml-2">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Account</h2>
                  <button className="w-full text-left px-3 py-3 rounded text-gray-700 hover:bg-gray-100 flex items-center">
                    <span className="ml-2">Logout</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeSection === 'profile' && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-8">Profile Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
                          <div 
                            className="relative group w-40 h-40 rounded-full bg-gray-200 border-2 border-gray-300 overflow-hidden mb-4"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {avatarPreview || user?.avatar ? (
                              <Image 
                                src={avatarPreview || user?.avatar || ''} 
                                alt="Avatar" 
                                width={160} 
                                height={160} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-16 h-16 text-gray-500" />
                              </div>
                            )}
                            
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Upload className="text-white w-8 h-8" />
                            </div>
                          </div>
                          
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                          
                          <Button 
                            variant="outline"
                            className="border-gray-700 text-gray-900 hover:bg-gray-100 w-full"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Change Avatar
                          </Button>
                        </div>
                        
                        <div className="md:col-span-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label className="block text-gray-700 mb-2 font-medium">First Name</Label>
                              <Input
                                className="bg-white border-gray-300 focus:border-gray-500"
                                placeholder="John"
                                value={user?.name || ''}
                                readOnly
                              />
                            </div>
                            
                            <div>
                              <Label className="block text-gray-700 mb-2 font-medium">Last Name</Label>
                              <Input
                                className="bg-white border-gray-300 focus:border-gray-500"
                                placeholder="Doe"
                                value={user?.surname || ''}
                                readOnly
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label className="block text-gray-700 mb-2 font-medium">Email</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <Input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="pl-10 bg-white border-gray-300 focus:border-gray-500"
                                  placeholder="your@email.com"
                                />
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label className="block text-gray-700 mb-2 font-medium">Date of Birth</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full bg-white border-gray-300 text-gray-800 hover:bg-gray-50 text-left font-normal justify-start pl-3",
                                      !formData.birthdate && "text-gray-500"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                                    {formData.birthdate ? (
                                      format(formData.birthdate, "PPP")
                                    ) : (
                                      <span>Select date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-lg">
                                  <Calendar
                                    mode="single"
                                    selected={formData.birthdate}
                                    onSelect={handleDateChange}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                    className="bg-white text-gray-800"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div className="md:col-span-2 mt-4">
                              <Label className="block text-gray-700 mb-2 font-medium">Position</Label>
                              <Input
                                className="bg-white border-gray-300 focus:border-gray-500"
                                placeholder="Senior Executive"
                                value="Senior Executive"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-12 pt-8 border-t border-gray-300">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Department Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <Label className="block text-gray-700 mb-2 font-medium">Department</Label>
                            <Input
                              className="bg-white border-gray-300 focus:border-gray-500"
                              value="Executive Management"
                              readOnly
                            />
                          </div>
                          
                          <div>
                            <Label className="block text-gray-700 mb-2 font-medium">Manager</Label>
                            <Input
                              className="bg-white border-gray-300 focus:border-gray-500"
                              value="Sarah Johnson"
                              readOnly
                            />
                          </div>
                          
                          <div>
                            <Label className="block text-gray-700 mb-2 font-medium">Employee ID</Label>
                            <Input
                              className="bg-white border-gray-300 focus:border-gray-500"
                              value="EXEC-7890"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeSection === 'security' && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-8">Security Settings</h2>
                      
                      <div className="grid grid-cols-1 gap-8">
                        <div className="border border-gray-300 rounded-lg p-6">
                          <h3 className="text-xl font-medium text-gray-900 mb-2">Password</h3>
                          <p className="text-gray-600 mb-6">Last changed: January 15, 2023</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label className="block text-gray-700 mb-2 font-medium">Current Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <Input
                                  type="password"
                                  className="pl-10 bg-white border-gray-300 focus:border-gray-500"
                                  placeholder="••••••••"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label className="block text-gray-700 mb-2 font-medium">New Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <Input
                                  type="password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  className="pl-10 bg-white border-gray-300 focus:border-gray-500"
                                  placeholder="••••••••"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label className="block text-gray-700 mb-2 font-medium">Confirm New Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <Input
                                  type="password"
                                  className="pl-10 bg-white border-gray-300 focus:border-gray-500"
                                  placeholder="••••••••"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-end">
                              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                                UPDATE PASSWORD
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border border-gray-300 rounded-lg p-6">
                          <h3 className="text-xl font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                          <p className="text-gray-600 mb-6">Add an extra layer of security to your account</p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Authenticator App</h4>
                              <p className="text-gray-600">Set up using an authenticator app</p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input type="checkbox" className="sr-only" id="toggle-auth" />
                              <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-gray-300 flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Security Keys</h4>
                              <p className="text-gray-600">Use physical security keys</p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input type="checkbox" className="sr-only" id="toggle-keys" />
                              <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeSection === 'billing' && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-8">Billing Information</h2>
                      
                      <div className="border border-gray-300 rounded-lg p-6 mb-8">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">Current Plan</h3>
                        
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">Enterprise Plan</h4>
                            <p className="text-gray-600">Unlimited access for your organization</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 text-lg">$299.99/month</div>
                            <div className="text-gray-600">Next billing: March 15, 2023</div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-4">
                          <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                            UPGRADE PLAN
                          </Button>
                          <Button variant="outline" className="border-gray-700 text-gray-900 hover:bg-gray-100">
                            DOWNGRADE
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border border-gray-300 rounded-lg p-6">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">Payment Methods</h3>
                        
                        <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
                          <table className="w-full">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-left py-3 px-4 text-gray-700 font-medium">Card</th>
                                <th className="text-left py-3 px-4 text-gray-700 font-medium">Expires</th>
                                <th className="text-left py-3 px-4 text-gray-700 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-300">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="bg-gray-200 border border-gray-300 rounded w-8 h-8 flex items-center justify-center mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">Visa ending in 4242</div>
                                      <div className="text-gray-600 text-sm">Primary payment method</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-700">08/2024</td>
                                <td className="py-3 px-4">
                                  <Button variant="outline" className="border-gray-700 text-gray-900 hover:bg-gray-100">
                                    Edit
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <Button variant="outline" className="border-gray-700 text-gray-900 hover:bg-gray-100">
                          + ADD PAYMENT METHOD
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Save Notification */}
        <AnimatePresence>
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-lg flex items-center"
            >
              <Check className="w-5 h-5 mr-2" />
              Settings saved successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SettingsPageBuilder;