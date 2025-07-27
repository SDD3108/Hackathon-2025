"use client";
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/src/ui/checkbox";
import { Label } from "@/src/ui/label";
import { Input } from "@/src/ui/input";
import { Button } from "@/src/ui/button";
import { ScrollArea } from "@/src/ui/scroll-area";
import { Separator } from "@/src/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/src/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/select";
import { toast } from "sonner";
import axios from "axios";

const AdminPageBuilder = () => {
  const [userForm, setUserForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    groupId: "",
    isAdmin: false,
    isStudent: false,
    isTeacher: false,
  })
  const [groupForm, setGroupForm] = useState({
    title: "",
    grade: "",
  })
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchGroups = async()=>{
      try{
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/`,{
          mode:"no-cors",
        })
        setGroups(response.data)
      }
      catch(error){
        toast.error(error.response?.data?.message || "Failed to fetch groups")
      }
      finally{
        setLoading(false)
      }
    }
    fetchGroups()
  }, [])

  const handleUserInputChange = (e)=>{
    const { name, value } = e.target
    setUserForm((prev) => ({...prev, [name]:value}))
  }
  const handleRoleChange = (role)=>{
    setUserForm((prev) => ({...prev,[role]: !prev[role]}))
  }
  const handleGroupInputChange = (e)=>{
    const { name, value } = e.target
    setGroupForm((prev) => ({...prev, [name]:value}))
  }
  const handleGradeChange = (value)=>{
    setGroupForm(prev => ({...prev, grade:value}))
  }
  const handleAddUser = async()=>{
    if(!userForm.name || !userForm.surname || !userForm.email || !userForm.password){
      toast.error("Please fill all required fields")
      return
    }
    try{
      setLoading(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/`,{
        name: userForm.name,
        surname: userForm.surname,
        email: userForm.email,
        password: userForm.password,
        is_admin: userForm.isAdmin,
        is_student: userForm.isStudent,
        is_teacher: userForm.isTeacher,
        classId: userForm.groupId,
        subjectId: "4"
      },{
        mode:"no-cors",
      })

      toast.success("User added successfully!")
      setUserForm({
        name: "",
        surname: "",
        email: "",
        password: "",
        groupId: "",
        isAdmin: false,
        isStudent: false,
        isTeacher: false,
      })
    }
    catch(error){
      toast.error(error.response?.data?.message || "Failed to add user")
    }
    finally{
      setLoading(false)
    }
}
  const handleAddGroup = async()=>{
    if(!groupForm.title || !groupForm.grade){
      toast.error("Please fill all required fields")
      return
    }
    try{
      setLoading(true)
      const group = {
        title: groupForm.title,
        grade: groupForm.grade,
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/`,group,{
        mode:"no-cors",
      })
      toast.success("Group added successfully!")
      const groupsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/groups/`,{
        mode:"no-cors",
      })
      setGroups(groupsResponse.data)
      setGroupForm({
        title: "",
        grade: "",
      })
      
    }
    catch(error){
      toast.error(error.response?.data?.message || "Failed to add group")
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className="bg-mainBlue w-full min-h-screen flex flex-col justify-center items-center relative py-8 sm:py-10 md:py-12">
      <div className="absolute w-full h-1/2 bg-bgSecondary bottom-0"></div>
      <div className="absolute top-4 left-4 flex items-center space-x-2 cursor-pointer z-10" onClick={() => window.history.back()}>
        <svg className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M34.0592 7.22587L30.6667 3.83337L11.5 23L30.6667 42.1667L34.0592 38.7742L18.285 23L34.0592 7.22587Z"
            fill="white"
          />
        </svg>
        <Label className="font-medium text-lg xs:text-xl sm:text-2xl text-white">back</Label>
      </div>
      <Carousel className="w-full max-w-4xl px-4">
        <CarouselContent>
          <CarouselItem className="flex justify-center">
            <div className="w-full max-w-3xl h-auto bg-white rounded-lg shadow-lg z-10 flex justify-center items-center p-4 sm:p-6 md:p-8">
              <div className="flex flex-col w-full">
                <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8 mb-4 md:mb-6">
                  <div className="flex flex-col w-full lg:w-1/2">
                    <div className="mb-4 sm:mb-6">
                      <Label className="text-lg sm:text-xl md:text-1.5xl pb-1">Users name *</Label>
                      <Input name="name" value={userForm.name} onChange={handleUserInputChange} type="text" className="w-full h-10 sm:h-12 md:h-13 bg-[#D3D3D3] rounded-sm" placeholder="Enter name"/>
                    </div>
                    <div className="mb-4 sm:mb-6">
                      <Label className="text-lg sm:text-xl md:text-1.5xl pb-1">Users surname *</Label>
                      <Input name="surname" value={userForm.surname} onChange={handleUserInputChange} type="text" className="w-full h-10 sm:h-12 md:h-13 bg-[#D3D3D3] rounded-sm" placeholder="Enter surname"/>
                    </div>
                    <div className="mb-4 sm:mb-6">
                      <Label className="text-lg sm:text-xl md:text-1.5xl pb-1">Users Email *</Label>
                      <Input name="email" value={userForm.email} onChange={handleUserInputChange} type="email" className="w-full h-10 sm:h-12 md:h-13 bg-[#D3D3D3] rounded-sm" placeholder="Enter email"/>
                    </div>
                    <div>
                      <Label className="text-lg sm:text-xl md:text-1.5xl pb-1">Users password *</Label>
                      <Input name="password" value={userForm.password} onChange={handleUserInputChange} type="password" className="w-full h-10 sm:h-12 md:h-13 bg-[#D3D3D3] rounded-sm" placeholder="Create password" />
                    </div>
                  </div>
                  <div className="flex flex-col w-full lg:w-1/2 mt-4 lg:mt-0">
                    <div className="mb-4 sm:mb-6">
                      <Label className="text-lg sm:text-xl md:text-1.5xl mb-2 sm:mb-4">Users group</Label>
                      <Select value={userForm.groupId} onValueChange={(value) => setUserForm((prev) => ({...prev, groupId: value}))}>
                        <SelectTrigger className="w-full h-10 sm:h-12 md:h-13 bg-[#D3D3D3] rounded-sm">
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          {loading ? (
                            <div className="py-2 text-center">Loading groups...</div>
                          ) : groups.length > 0 ? (
                            groups.map(group => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.title} - {group.grade}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="py-2 text-center">No groups available</div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-lg sm:text-xl md:text-1.5xl mb-2 sm:mb-4">Users role *</Label>
                      <div className="flex items-center mb-3 sm:mb-4">
                        <Checkbox checked={userForm.isAdmin} onCheckedChange={() => handleRoleChange("isAdmin")} className="w-5 h-5 sm:w-6 sm:h-6 rounded-none mr-3 sm:mr-4" />
                        <h1 className="text-lg sm:text-xl md:text-1.5xl">Admin</h1>
                      </div>
                      <div className="flex items-center mb-3 sm:mb-4">
                        <Checkbox checked={userForm.isStudent} onCheckedChange={() => handleRoleChange("isStudent")} className="w-5 h-5 sm:w-6 sm:h-6 rounded-none mr-3 sm:mr-4" 
                        />
                        <h1 className="text-lg sm:text-xl md:text-1.5xl">Student</h1>
                      </div>
                      <div className="flex items-center mb-3 sm:mb-4">
                        <Checkbox checked={userForm.isTeacher} onCheckedChange={() => handleRoleChange("isTeacher")} className="w-5 h-5 sm:w-6 sm:h-6 rounded-none mr-3 sm:mr-4" />
                        <h1 className="text-lg sm:text-xl md:text-1.5xl">Teacher</h1>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="w-full flex justify-end mt-4">
                  <Button onClick={handleAddUser} disabled={loading} className="rounded-full w-36 sm:w-44 h-10 sm:h-12 bg-buttonColor text-base sm:text-lg md:text-xl hover:bg-buttonColor/90 text-white">
                    {loading ? "Adding..." : "Add the user"}
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
          
          {/* Форма добавления группы */}
          <CarouselItem className="flex justify-center">
            <div className="bg-white w-full max-w-md h-auto rounded-lg shadow-lg z-10 flex flex-col justify-center items-center p-6 sm:p-8">
              <div className="space-y-6 w-full">
                <div>
                  <Label className="text-lg sm:text-xl md:text-1.5xl">Group name *</Label>
                  <Input
                    name="title"
                    value={groupForm.title}
                    onChange={handleGroupInputChange}
                    type="text"
                    className="w-full h-10 sm:h-12 md:h-13 bg-[#D3D3D3] rounded-sm mt-2"
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label className="text-lg sm:text-xl md:text-1.5xl">Group grade *</Label>
                  <Select 
                    value={groupForm.grade} 
                    onValueChange={handleGradeChange}
                  >
                    <SelectTrigger className="w-full h-10 sm:h-12 md:h-13 bg-[#D3D3D3] rounded-sm mt-2">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Foundation Year">Foundation Year</SelectItem>
                      <SelectItem value="1 Course">1 Course</SelectItem>
                      <SelectItem value="2 Course">2 Course</SelectItem>
                      <SelectItem value="3 Course">3 Course</SelectItem>
                      <SelectItem value="4 Course">4 Course</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
  
              <div className="w-full flex justify-end mt-6">
                <Button 
                  onClick={handleAddGroup}
                  disabled={loading}
                  className="rounded-full w-36 sm:w-44 h-10 sm:h-12 bg-buttonColor text-base sm:text-lg md:text-xl hover:bg-buttonColor/90 text-white"
                >
                  {loading ? "Adding..." : "Add the group"}
                </Button>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className="z-10 mt-6 w-full max-w-2xl px-4">
        <Dialog>
          <DialogTrigger className="w-full h-10 sm:h-12 cursor-pointer bg-[#D3D3D3] rounded-sm text-start text-sm sm:text-base text-[#A6A6A8] font-medium px-3 sm:px-4">
            Agreement & Policy
          </DialogTrigger>
          <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agreement & Policy</DialogTitle>
              <DialogDescription className="text-[#A6A6A8] text-sm sm:text-base">
                <p>1. General Provisions<br/>1.1. This User Agreement (hereinafter referred to as the "Agreement") governs the relationship between the administration of the website [Platform Name] (hereinafter referred to as the "Administration") and the user (hereinafter referred to as the "User") when using the educational platform.</p>
                <p>2. Terms of Use<br/>2.1. The platform provides access to educational materials, class schedules, lectures, and other learning resources.<br/>2.2. The User agrees to use the platform only for lawful purposes.</p>
                <p>3. Registration and Account<br/>3.1. Registration is required to access the platform's functionality.<br/>3.2. The User is responsible for keeping their account credentials secure.</p>
                <p>4. Privacy<br/>4.1. The Administration undertakes to protect the User’s personal data in accordance with our Privacy Policy.</p>
                <p>5. Intellectual Property<br/>5.1. All materials on the platform are the intellectual property of the Administration or rights holders.</p>
                <p>6. Limitation of Liability<br/>6.1. The Administration is not liable for any indirect losses arising from the use of the platform.</p>
                <div className="text-center italic py-4">
                  <p className="text-xs sm:text-sm opacity-70">
                    Please note that our website is not designed for use by individuals with visual impairments, 
                    as it does not support accessibility tools such as screen readers. 
                    We acknowledge this limitation and apologize for any inconvenience caused.
                  </p>
                </div>
                <p>7. Final Provisions<br/>7.1. The Administration reserves the right to amend this Agreement.<br/>7.2. Continued use of the platform after changes have been made constitutes acceptance of the updated Agreement.</p>
                <p>Effective Date: July 24, 2025</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPageBuilder;