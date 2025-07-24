import React from "react";
import { Label } from "@/src/ui/label";
import { Input } from "@/src/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/ui/accordion";
import { Separator } from "@/src/ui/separator";
import { ScrollArea } from "@/src/ui/scroll-area";
import { Button } from "@/src/ui/button";

const ProfilePageBuilder = () => {
  return (
    <div className="bg-[#8FBFFA] w-screen h-screen flex justify-center items-center">
      <div className="absolute top-4 left-2 flex justify-center items-center">
        <svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M34.0592 7.22587L30.6667 3.83337L11.5 23L30.6667 42.1667L34.0592 38.7742L18.285 23L34.0592 7.22587Z"
            fill="white"
          />
        </svg>
        <Label className="font-[400] text-[32px] text-[#fff]">back</Label>
      </div>
      <div className="flex justify-center items-center">
        <div className="absolute w-screen h-[519px] bg-[#E0E0E0] bottom-0"></div>
        <div className="w-[426px] bg-[#fff] min-h-[790px] z-5 flex flex-col justify-center items-center">
          <div className="w-[339px] h-[339px] bg-[#D3D3D3] mb-[31px]"></div>
          <div>
            <Label className="text-[24px] text-[#333333] mb-[15px]">
              Your name
            </Label>
            <Input
              type="text"
              placeholder="value"
              className="w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px] mb-[31px]"
            />
          </div>
          <div>
            <Label className="text-[24px] text-[#333333] mb-[15px]">
              Your surname
            </Label>
            <Input
              type="text"
              placeholder="value"
              className="w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px] mb-[31px]"
            />
          </div>
          <div>
            <Label className="text-[24px] text-[#333333] mb-[15px]">
              Your password
            </Label>
            <Input
              type="password"
              placeholder="value"
              className="w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px]"
            />
          </div>
        </div>
        <div className="w-[708px] h-[790px] bg-[#fff] z-5 m-[64px] flex flex-col justify-center items-center">
          <Accordion
            type="single"
            collapsible
            className="rounded-[3px] w-[608px] min-h-auto bg-[#d3d3d3] text-[17px] px-[16px] mb-[30px]"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-[#666]">
                Agreement & Policy
              </AccordionTrigger>
              <AccordionContent className="text-[#a9a9a9]">
                текст для соглашения текст для соглашения текст для соглашения
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div>
            <Label className="text-[24px] mb-[38px]">My group members</Label>
            <ScrollArea className="w-[605px] h-[179px] bg-[#d3d3d3] rounded-[3px] p-[16px] text-[#3c3c434d] mb-[38px]">
              <h3 className="">Name Surname</h3>
              <Separator className="bg-[#a6a6a8]" />
            </ScrollArea>
          </div>
          <div>
            <Label className="text-[24px] mb-[38px]">Saved lectures</Label>
            <ScrollArea className="w-[605px] h-[179px] rounded-[3px] bg-[#d3d3d3] mb-[56px]"></ScrollArea>
          </div>
          <div className="w-[100%] flex justify-end">
            <Button className="rounded-[66px] w-[165px] h-[52px] bg-[#4a90e2] text-[24px] mr-[76px]">
              Change
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageBuilder;

// настройки (аватар,почта,пароль),пользовательское соглашение,поддержка,группа,сохраненные лекции
