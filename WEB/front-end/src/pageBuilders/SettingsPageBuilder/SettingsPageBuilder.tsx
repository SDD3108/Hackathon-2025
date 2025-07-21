"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/src/ui/input'
import { Label } from '@/src/ui/label'
import { Button } from '@/src/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from "@/src/ui/popover"
import { Calendar } from "@/src/ui/calendar"
import { CalendarIcon, Upload, User, Lock, Mail, Check, ChevronLeft } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { format } from "date-fns"
import { motion, AnimatePresence } from 'framer-motion'
import useAuthenticationStore from '@/src/store/AuthenticationStore/AuthenticationStore'
import Image from 'next/image'

const SettingsPageBuilder = () => {
  const { user, updateUser } = useAuthenticationStore()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')
  const [hoverStates, setHoverStates] = useState({ avatar: false, save: false })
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Состояния формы
  const [formData, setFormData] = useState({
    avatar: user?.avatar || '',
    email: user?.email || '',
    password: '',
    birthdate: user?.birthdate || new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
  })

  // Обработка изменения аватарки
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
        setFormData(prev => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Обработка изменения формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Обработка изменения даты рождения
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, birthdate: date }))
    }
  }

  // Сохранение настроек
  const handleSave = async () => {
    setIsSaving(true)
    
    // Эмуляция запроса на сервер
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Обновление данных пользователя
    updateUser({
      ...user,
      ...formData
    })
    
    setIsSaving(false)
    setIsSaved(true)
    
    // Сброс состояния сохранения через 3 секунды
    setTimeout(() => setIsSaved(false), 3000)
  }

  // Эффект для анимации частиц
  useEffect(() => {
    if (isSaved) {
      const timeout = setTimeout(() => setIsSaved(false), 3000)
      return () => clearTimeout(timeout)
    }
  }, [isSaved])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative overflow-hidden">
      {/* Анимированные частицы */}
      <AnimatePresence>
        {isSaved && (
          <>
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full bg-cyan-500 z-20"
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
                  y: window.innerHeight / 2 + (Math.random() - 0.5) * 300
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeOut"
                }}
                style={{
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      
      <div className="max-w-6xl mx-auto">
        {/* Заголовок страницы */}
        <motion.div 
          className="mb-8 flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button variant="ghost" className="mr-4">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Боковая панель навигации */}
          <motion.div 
            className="w-full md:w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <ul className="space-y-2">
                {['profile', 'security', 'preferences', 'notifications'].map((item) => (
                  <li key={item}>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        activeSection === item 
                          ? 'bg-gray-100 text-gray-900 font-medium' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveSection(item)}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Основной контент */}
          <motion.div 
            className="flex-grow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Заголовок раздела */}
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeSection === 'profile' && 'Profile Information'}
                  {activeSection === 'security' && 'Security Settings'}
                  {activeSection === 'preferences' && 'Preferences'}
                  {activeSection === 'notifications' && 'Notification Settings'}
                </h2>
                <p className="text-gray-500 mt-1">
                  {activeSection === 'profile' && 'Update your personal details'}
                  {activeSection === 'security' && 'Manage your account security'}
                  {activeSection === 'preferences' && 'Customize your experience'}
                  {activeSection === 'notifications' && 'Control your notification preferences'}
                </p>
              </div>
              
              {/* Контент раздела */}
              <div className="p-6">
                {activeSection === 'profile' && (
                  <div className="space-y-8">
                    {/* Аватар */}
                    <motion.div 
                      className="flex flex-col md:flex-row items-start gap-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex-shrink-0">
                        <Label className="block text-gray-700 mb-3">Profile Picture</Label>
                        <div 
                          className="relative group w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden"
                          onMouseEnter={() => setHoverStates(prev => ({ ...prev, avatar: true }))}
                          onMouseLeave={() => setHoverStates(prev => ({ ...prev, avatar: false }))}
                        >
                          {avatarPreview || user?.avatar ? (
                            <Image 
                              src={avatarPreview || user?.avatar || ''} 
                              alt="Avatar" 
                              width={128} 
                              height={128} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          
                          <motion.div 
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0"
                            animate={{ opacity: hoverStates.avatar ? 1 : 0 }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="text-white w-6 h-6" />
                          </motion.div>
                        </div>
                        
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="block text-gray-700 mb-2">First Name</Label>
                            <Input
                              className="bg-gray-50 border-gray-200 focus:border-gray-400"
                              placeholder="John"
                              value={user?.name || ''}
                              readOnly
                            />
                          </div>
                          
                          <div>
                            <Label className="block text-gray-700 mb-2">Last Name</Label>
                            <Input
                              className="bg-gray-50 border-gray-200 focus:border-gray-400"
                              placeholder="Doe"
                              value={user?.surname || ''}
                              readOnly
                            />
                          </div>
                          
                          <div>
                            <Label className="block text-gray-700 mb-2">Email</Label>
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="bg-gray-50 border-gray-200 focus:border-gray-400"
                              placeholder="your@email.com"
                            />
                          </div>
                          
                          <div>
                            <Label className="block text-gray-700 mb-2">Date of Birth</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100 text-left font-normal justify-start",
                                    !formData.birthdate && "text-gray-500"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                  {formData.birthdate ? (
                                    format(formData.birthdate, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-white border border-gray-200">
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
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {activeSection === 'security' && (
                  <div className="space-y-6">
                    <motion.div 
                      className="bg-gray-50 p-5 rounded-xl border border-gray-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="font-medium text-gray-900 mb-3">Change Password</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="block text-gray-700 mb-2">Current Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <Input
                              type="password"
                              className="pl-10 bg-white border-gray-200 focus:border-gray-400"
                              placeholder="••••••••"
                              disabled
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="block text-gray-700 mb-2">New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <Input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="pl-10 bg-white border-gray-200 focus:border-gray-400"
                              placeholder="••••••••"
                            />
                          </div>
                          <p className="text-gray-500 text-sm mt-2">At least 8 characters</p>
                        </div>
                        
                        <div>
                          <Label className="block text-gray-700 mb-2">Confirm New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <Input
                              type="password"
                              className="pl-10 bg-white border-gray-200 focus:border-gray-400"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-50 p-5 rounded-xl border border-gray-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="font-medium text-gray-900 mb-3">Two-Factor Authentication</h3>
                      <p className="text-gray-600 mb-4">Add an extra layer of security to your account.</p>
                      <Button variant="outline" className="border-gray-300">
                        Enable 2FA
                      </Button>
                    </motion.div>
                  </div>
                )}
                
                {activeSection === 'preferences' && (
                  <div className="space-y-6">
                    <motion.div 
                      className="bg-gray-50 p-5 rounded-xl border border-gray-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="font-medium text-gray-900 mb-4">Theme Preferences</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: 'light', name: 'Light Theme' },
                          { id: 'dark', name: 'Dark Theme' },
                          { id: 'system', name: 'System Default' }
                        ].map((theme) => (
                          <div 
                            key={theme.id}
                            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full border mr-3 ${
                                theme.id === 'light' ? 'bg-gray-100 border-gray-300' : 
                                theme.id === 'dark' ? 'bg-gray-800 border-gray-700' : 
                                'bg-white border-gray-300'
                              }`} />
                              <span>{theme.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-50 p-5 rounded-xl border border-gray-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="font-medium text-gray-900 mb-4">Language & Region</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="block text-gray-700 mb-2">Language</Label>
                          <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 focus:border-gray-400 focus:outline-none">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label className="block text-gray-700 mb-2">Time Zone</Label>
                          <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 focus:border-gray-400 focus:outline-none">
                            <option>(GMT-12:00) International Date Line West</option>
                            <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                            <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                            <option>(GMT+00:00) Greenwich Mean Time</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <motion.div 
                      className="bg-gray-50 p-5 rounded-xl border border-gray-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="font-medium text-gray-900 mb-4">Email Notifications</h3>
                      
                      <div className="space-y-4">
                        {[
                          { id: 'product', label: 'Product updates', desc: 'New features and improvements' },
                          { id: 'security', label: 'Security alerts', desc: 'Important notifications about your account security' },
                          { id: 'newsletter', label: 'Newsletter', desc: 'Tips, news, and special offers' }
                        ].map((item) => (
                          <div key={item.id} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={item.id}
                                name={item.id}
                                type="checkbox"
                                className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={item.id} className="font-medium text-gray-700">
                                {item.label}
                              </label>
                              <p className="text-gray-500">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-50 p-5 rounded-xl border border-gray-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="font-medium text-gray-900 mb-4">Push Notifications</h3>
                      
                      <div className="space-y-4">
                        {[
                          { id: 'messages', label: 'New messages', desc: 'When someone sends you a message' },
                          { id: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
                          { id: 'reminders', label: 'Reminders', desc: 'Scheduled reminders and events' }
                        ].map((item) => (
                          <div key={item.id} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={item.id}
                                name={item.id}
                                type="checkbox"
                                className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={item.id} className="font-medium text-gray-700">
                                {item.label}
                              </label>
                              <p className="text-gray-500">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
              
              {/* Футер с кнопкой сохранения */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSave}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all relative overflow-hidden"
                    disabled={isSaving}
                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, save: true }))}
                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, save: false }))}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0"
                      animate={{ 
                        opacity: hoverStates.save ? 0.1 : 0,
                        width: hoverStates.save ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {isSaving ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="flex items-center justify-center"
                      >
                        <span className="mr-2">Saving</span>
                        <div className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                      </motion.div>
                    ) : isSaved ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Saved Successfully
                      </motion.div>
                    ) : (
                      <motion.span whileHover={{ scale: 1.05 }}>
                        Save Changes
                      </motion.span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPageBuilder