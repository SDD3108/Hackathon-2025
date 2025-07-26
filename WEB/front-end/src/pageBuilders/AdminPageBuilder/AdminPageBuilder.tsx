"use client";
import React, { useState } from "react";
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
  CarouselNext,
  CarouselPrevious,
} from "@/src/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/ui/dialog";

const AdminPageBuilder = () => {
  return (
    <div className="bg-mainBlue w-screen min-h-screen flex flex-col justify-center items-center">
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
      <Carousel className="w-[100%]">
        <CarouselContent>
          <CarouselItem className="flex justify-center items-centet">
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
                      <Label className="text-[24px] pb-[5px]">
                        Users surname
                      </Label>
                      <Input
                        type="text"
                        className=" w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px]"
                        placeholder="value"
                      />
                    </div>
                    <div className="mb-[38px]">
                      <Label className="text-[24px] pb-[5px]">
                        Users Email
                      </Label>
                      <Input
                        type="email"
                        className=" w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px]"
                        placeholder="value"
                      />
                    </div>
                    <div>
                      <Label className="text-[24px] pb-[5px]">
                        Users password
                      </Label>
                      <Input
                        type="password"
                        className=" w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px]"
                        placeholder="value"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col ">
                    <div className="mb-[37px]">
                      <Label className="text-[24px] mb-[22px]">
                        Users group
                      </Label>
                      <ScrollArea className="h-[155px] w-[382px] rounded-3 bg-[#D3D3D3]">
                        <div className="p-4 text-fifthGray">
                          <div>Name Surname</div>
                          <Separator className="bg-[#A6A6A8]" />
                          <div>Name Surname</div>
                        </div>
                      </ScrollArea>
                    </div>
                    <div>
                      <Label className="text-[24px] mb-[31px]">
                        Users role
                      </Label>
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
          </CarouselItem>
          <CarouselItem className="flex justify-center items-centet">
            <div className="bg-[#FFFFFF] w-[485px] h-[674px] flex flex-col justify-center items-center space-y-25">
              <div className="space-y-25">
                <div>
                  <Label className="text-[24px]">Group name</Label>
                  <Input
                    type="text"
                    className="w-[339px] h-[52px] bg-[#D3D3D3] rounded-[3px]"
                    placeholder="value"
                  />
                </div>
                <div>
                  <Label className="text-[24px]">Group grade</Label>
                  <Input
                    type="text"
                    className="w-[339px] h-[200px] bg-[#D3D3D3] rounded-[3px]"
                    placeholder="value"
                  />
                </div>
              </div>
              <div className="w-[100%] flex justify-end">
                <Button className="rounded-full w-[202px] h-13 bg-buttonColor text-xl hover:bg-buttonColor/90 text-white mr-[86px]">
                  Add the group
                </Button>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="z-2 translate-y-[34px] w-[608px]">
        <Dialog>
          <DialogTrigger className="w-full h-13 cursor-pointer bg-placeholder rounded-sm text-start text-base text-textGray font-medium px-4 mb-7.5">
            Agreement & Policy
          </DialogTrigger>
          <DialogContent className="!w-1/2 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agreement & Policy</DialogTitle>
              <DialogDescription className="text-textLightgray">
                <p>
                  1. Общие положения
                  <br />
                  1.1. Настоящее Пользовательское соглашение (далее -
                  Соглашение) регулирует отношения между администрацией сайта
                  [Название платформы] (далее - Администрация) и пользователем
                  (далее - Пользователь) при использовании образовательной
                  платформы.
                </p>
                <p>
                  2. Условия использования
                  <br />
                  2.1. Платформа предоставляет доступ к образовательным
                  материалам, расписанию занятий, лекциям и другим учебным
                  ресурсам.
                  <br />
                  2.2. Пользователь обязуется использовать платформу только в
                  законных целях.
                </p>
                <p>
                  3. Регистрация и учетная запись
                  <br />
                  3.1. Для доступа к функционалу платформы требуется
                  регистрация.
                  <br />
                  3.2. Пользователь несет ответственность за сохранность своих
                  учетных данных.
                </p>
                <p>
                  4. Конфиденциальность
                  <br />
                  4.1. Администрация обязуется защищать персональные данные
                  Пользователя в соответствии с нашей Политикой
                  конфиденциальности.
                </p>
                <p>
                  5. Интеллектуальная собственность
                  <br />
                  5.1. Все материалы платформы являются интеллектуальной
                  собственностью Администрации или правообладателей.
                </p>
                <p>
                  6. Ограничения ответственности
                  <br />
                  6.1. Администрация не несет ответственности за любые косвенные
                  убытки, возникшие в результате использования платформы.
                </p>
                <div className="text-center italic py-4">
                  <p className="text-sm opacity-70">
                    Обращаем внимание, что наш сайт не предназначен для
                    использования людьми с нарушениями зрения, так как не имеет
                    поддержки специальных средств доступности (скринридеров и
                    т.п.). Мы осознаем это ограничение и приносим извинения за
                    возможные неудобства.
                  </p>
                </div>
                <p>
                  7. Заключительные положения
                  <br />
                  7.1. Администрация оставляет за собой право изменять данное
                  Соглашение.
                  <br />
                  7.2. Продолжение использования платформы после изменений
                  означает согласие с обновленным Соглашением.
                </p>
                <p>Дата вступления в силу: 24 июля 2025 года</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default AdminPageBuilder;