import React from 'react';
import { Input } from '@/src/ui/input';
import { Label } from '@/src/ui/label';
import { Button } from '@/src/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/src/ui/popover";
import { Calendar } from "@/src/ui/calendar";
import { CalendarIcon, Upload, User, Lock, Mail, Check, X, GraduationCap } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";

export const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-gray-600">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
)

export const ProfileSection = ({ formData, handleChange, handleDateChange, fileInputRef, handleAvatarChange, user, avatarPreview }) => (
  <div>
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Profile Settings</h3>
        <p className="text-gray-500 mt-1">Update your personal information</p>
      </div>
      <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
        ) : user?.avatar ? (
          <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="text-gray-400" size={32} />
          </div>
        )}
      </div>
    </div>
    
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-4"
            />
          </div>
        </div>
        
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Birthdate</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4",
                  !formData.birthdate && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {formData.birthdate ? format(formData.birthdate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg">
              <Calendar
                mode="single"
                selected={formData.birthdate}
                onSelect={handleDateChange}
                initialFocus
                className="bg-white"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div>
        <Label className="block mb-2 text-sm font-medium text-gray-700">Avatar</Label>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Change Photo
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
            accept="image/*"
          />
          <span className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 5MB</span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">Education</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="course" className="block mb-2 text-sm font-medium text-gray-700">Course</Label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-700">Year</Label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
              <option value={5}>5th Year</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const SecuritySection = ({ formData, handleChange }) => (
  <div>
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-gray-900">Security Settings</h3>
      <p className="text-gray-500 mt-1">Manage your account security preferences</p>
    </div>
    
    <div className="space-y-8">
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">Password</h4>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="block mb-2 text-sm font-medium text-gray-700">Current Password</Label>
            <Input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              className="bg-white border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700">New Password</Label>
              <Input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                className="bg-white border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                className="bg-white border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button variant="outline" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
              Update Password
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">Two-Factor Authentication</h4>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-900 font-medium">2FA is currently disabled</p>
            <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
          </div>
          <Button variant="outline" className="bg-white border border-blue-500 text-blue-500 hover:bg-blue-50">
            Enable 2FA
          </Button>
        </div>
      </div>
    </div>
  </div>
)

export const EducationSection = ({ formData, handleChange }) => (
  <div>
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-gray-900">Education Settings</h3>
      <p className="text-gray-500 mt-1">Manage your academic information</p>
    </div>
    
    <div className="space-y-6">
      <div>
        <Label htmlFor="university" className="block mb-2 text-sm font-medium text-gray-700">University</Label>
        <Input
          id="university"
          name="university"
          value="Converty University"
          disabled
          className="bg-gray-50 border border-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="faculty" className="block mb-2 text-sm font-medium text-gray-700">Faculty</Label>
          <select
            id="faculty"
            name="faculty"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Engineering">Faculty of Engineering</option>
            <option value="Business">Faculty of Business</option>
            <option value="Design">Faculty of Design</option>
            <option value="Science">Faculty of Science</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="specialization" className="block mb-2 text-sm font-medium text-gray-700">Specialization</Label>
          <Input
            id="specialization"
            name="specialization"
            placeholder="Enter your specialization"
            className="bg-white border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Current Courses</h4>
          <Button variant="outline" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
            Add Course
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Advanced Algorithms', 'Data Structures', 'Web Development', 'Machine Learning', 'UI/UX Design', 'Database Systems'].map((course) => (
            <div key={course} className="p-4 bg-white border border-gray-200 rounded-lg flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <span className="text-gray-800">{course}</span>
              <button className="ml-auto text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)