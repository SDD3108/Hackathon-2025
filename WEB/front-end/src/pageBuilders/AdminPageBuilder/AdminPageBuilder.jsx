"use client";
import React, { useState } from "react";
import { Checkbox } from "@/src/ui/checkbox";
import { Label } from "@/src/ui/label";
import { Input } from "@/src/ui/input";
import { Button } from "@/src/ui/button";
import { cn } from "@/src/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "@/src/ui/scroll-area";
import { Separator } from "@/src/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/ui/popover";

const AdminPageBuilder = () => {
  return (
    <div className="bg-mainBlue w-screen h-screen flex flex-col justify-center items-center">
      <div className="absolute w-screen h-1/2 bg-bgSecondary bottom-0"></div>
      <div
        className="absolute top-7.5 left-5 flex items-center space-x-2 cursor-pointer"
        onClick={() => window.history.back()}
      >
        <svg
          className="w-10 h-10"
          viewBox="0 0 46 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M34.0592 7.22587L30.6667 3.83337L11.5 23L30.6667 42.1667L34.0592 38.7742L18.285 23L34.0592 7.22587Z"
            fill="white"
          />
        </svg>
        <Label className="font-medium text-3xl text-white">back</Label>
      </div>

      <div className="w-[871px] h-[674px] bg-[#FFFFFF] z-2 flex justify-center items-center px-[30px]">
        <div className="flex flex-col w-[100%]">
          <div className="flex justify-around items-center mb-[25px]">
            <div className="flex flex-col translate-y-[-15px]">
              <div className="mb-[38px]">
                <Label className="text-[24px] pb-[5px]">Users name</Label>
                <Input
                  type="text"
                  className=" w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px]"
                  placeholder="value"
                />
              </div>
              <div className="mb-[38px]">
                <Label className="text-[24px] pb-[5px]">Users surname</Label>
                <Input
                  type="text"
                  className=" w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px]"
                  placeholder="value"
                />
              </div>
              <div className="mb-[38px]">
                <Label className="text-[24px] pb-[5px]">Users Email</Label>
                <Input
                  type="email"
                  className=" w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px]"
                  placeholder="value"
                />
              </div>
              <div>
                <Label className="text-[24px] pb-[5px]">Users password</Label>
                <Input
                  type="password"
                  className=" w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px]"
                  placeholder="value"
                />
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="mb-[37px]">
                <Label className="text-[24px] mb-[22px]">Users group</Label>
                <ScrollArea className="h-[155px] w-[382px] rounded-3 bg-[#D3D3D3]">
                  <div className="p-4 text-fifthGray">
                    <div>Name Surname</div>
                    <Separator className="bg-[#A6A6A8]" />
                    <div>Name Surname</div>
                  </div>
                </ScrollArea>
              </div>
              <div>
                <Label className="text-[24px] mb-[31px]">Users role</Label>
                <div className="flex items-center mb-[31px]">
                  <Checkbox className=" w-[22px] h-[22px] rounded-none mr-[27px]" />
                  <h1 className="text-[24px]">Admin</h1>
                </div>
                <div className="flex items-center mb-[31px]">
                  <Checkbox className=" w-[22px] h-[22px] rounded-none mr-[27px]" />
                  <h1 className="text-[24px]">Student</h1>
                </div>
                <div className="flex items-center mb-[31px]">
                  <Checkbox className=" w-[22px] h-[22px] rounded-none mr-[27px]" />
                  <h1 className="text-[24px]">Teacher</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[100%] flex justify-end">
            <Button className="rounded-full w-[202px] h-13 bg-buttonColor text-xl hover:bg-buttonColor/90 text-white mr-[86px]">
              Add the user
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminPageBuilder;
