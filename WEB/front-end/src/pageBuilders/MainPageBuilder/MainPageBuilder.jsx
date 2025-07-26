"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/src/ui/skeleton";
import useAuthenticationStore from "@/src/store/AuthenticationStore/AuthenticationStore";
import { User } from "lucide-react";
import { Label } from "@/src/ui/label";

const MainPageBuilder = () => {
  const { user } = useAuthenticationStore();
  const router = useRouter();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeSlots = Array.from({ length: 9 }, (_, i) => `${8 + i}:00`);
  const isAuthenticated = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (user !== "") {
      return token && user;
    }
    return "Error";
  };
  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    const mockSchedule = [
      {
        day: "Monday",
        lessons: [
          {
            id: "101",
            title: "Математика",
            startTime: "9:00",
            subject: { typeOfSubject: 2 },
          },
          {
            id: "102",
            title: "Физика",
            startTime: "11:00",
            subject: { typeOfSubject: 1 },
          },
        ],
      },
      {
        day: "Tuesday",
        lessons: [
          {
            id: "201",
            title: "Программирование",
            startTime: "10:00",
            subject: { typeOfSubject: 2 },
          },
        ],
      },
    ];
    const timer = setTimeout(() => {
      setSchedule(mockSchedule);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  const getLessonDuration = (type) => {
    return type == 1 ? 40 : 80;
  };
  // const calculateEndTime = (startTime,duration)=>{
  //   const [hours, minutes] = startTime.split(':').map(Number)
  //   const totalMinutes = hours * 60 + minutes + duration
  //   const endHours = Math.floor(totalMinutes / 60)
  //   const endMinutes = totalMinutes % 60
  //   return `${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`
  // }
  const findLesson = (day, timeSlot) => {
    const daySchedule = schedule.find((d) => d.day == day);
    if (!daySchedule) {
      return null;
    }

    return daySchedule.lessons.find((lesson) => {
      const lessonHour = parseInt(lesson.startTime.split(":")[0]);
      const slotHour = parseInt(timeSlot.split(":")[0]);
      return lessonHour == slotHour;
    });
  };
  const renderSkeleton = () => (
    <div className="w-full max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
        </h2>

        <div className="grid grid-cols-8 gap-1">
          <div className="col-span-1"></div>
          {daysOfWeek.map((_, index) => (
            <div key={index} className="col-span-1 text-center py-2">
              <Skeleton className="h-6 w-full mx-1" />
            </div>
          ))}

          {timeSlots.map((_, timeIndex) => (
            <React.Fragment key={timeIndex}>
              <div className="col-span-1 text-right pr-2 py-3">
                <Skeleton className="h-4 w-12 float-right" />
              </div>

              {daysOfWeek.map((_, dayIndex) => {
                const heightClass = timeIndex % 3 === 0 ? "h-24" : "h-16";
                return (
                  <div
                    key={dayIndex}
                    className={`col-span-1 p-2 ${heightClass}`}
                  >
                    <Skeleton className="w-full h-full rounded-md" />
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
  // if not authenticated
  if (!isAuthenticated() && !loading) {
    return (
      <div className="w-full min-h-screen bg-white">
        <svg
          width="287"
          height="234"
          viewBox="0 0 287 234"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M-287.903 -56.1253C-291.412 -127.008 -224.53 -175.125 -179.056 -229.612C-123.581 -296.084 -85.1098 -396.309 1.24159 -402.582C89.4872 -408.992 156.825 -327.409 211.692 -257.997C260.73 -195.961 286.822 -121.328 286.067 -42.2548C285.299 38.1621 267.362 122.383 207.547 176.138C148.942 228.805 63.1472 243.495 -13.9823 227.393C-80.6926 213.465 -115.446 147.831 -162.797 98.8201C-210.747 49.1908 -284.491 12.799 -287.903 -56.1253Z"
            fill="#2363B2"
          />
        </svg>
        <svg
          width="309"
          height="256"
          viewBox="0 0 309 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-0"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M278.926 -306.672C337.408 -302.06 366.174 -234.495 415.044 -202.041C467.277 -167.353 539.681 -162.992 574.151 -110.615C612.864 -51.7903 631.121 25.7027 608.901 92.5255C586.726 159.211 522.663 202.99 459.574 233.952C403.805 261.321 341.047 254.966 278.926 254.463C217.4 253.966 152.086 264.408 100.388 231.046C47.4591 196.889 11.412 137.656 1.52053 75.4443C-7.68274 17.5612 26.9763 -35.1221 49.4619 -89.2474C69.8872 -138.413 87.6137 -188.198 126.26 -224.816C169.226 -265.528 219.918 -311.326 278.926 -306.672Z"
            fill="#4A90E2"
          />
        </svg>
        <svg
          width="499"
          height="575"
          viewBox="0 0 499 575"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-[564px]"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M144.647 0.292982C215.424 -4.92738 265.143 60.7728 320.713 104.917C388.505 158.77 489.631 194.808 497.988 280.983C506.528 369.048 426.595 438.337 358.529 494.865C297.696 545.387 223.716 573.275 144.647 574.43C64.235 575.605 -20.3948 559.708 -75.579 501.209C-129.646 443.894 -146.405 358.479 -132.171 280.983C-119.859 213.956 -55.0833 177.627 -7.23082 129.105C41.2256 79.9709 75.8252 5.3691 144.647 0.292982Z"
            fill="#4A90E2"
          />
        </svg>
        <svg
          width="456"
          height="637"
          viewBox="0 0 456 637"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-0 top-[534px]"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.09718 346.875C-2.41176 275.992 64.4704 227.875 109.944 173.388C165.419 106.916 203.89 6.69083 290.242 0.4181C378.487 -5.9922 445.825 75.5914 500.692 145.003C549.73 207.039 575.822 281.672 575.067 360.745C574.299 441.162 556.362 525.383 496.547 579.138C437.942 631.805 352.147 646.495 275.018 630.393C208.307 616.465 173.554 550.831 126.203 501.82C78.2533 452.191 4.50916 415.799 1.09718 346.875Z"
            fill="#2363B2"
          />
        </svg>
        <div className=" flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center w-[100%] text-center">
            <h1 className="text-[96px] font-[590] mt-[203px] bg-gradient-to-r from-[#000] to-textGradient bg-clip-text text-transparent">
              Turn lectures into action.
            </h1>
            <h2 className="text-[40px] font-[500] w-[946px] text-[#333] mb-[57px] leading-[90%] tracking-[-0.03em]">
              our unique project unites innovative technologies for educational
              purposes, especially in a everyday life of university students
            </h2>
            <Button className="w-[171px] h-[55px] rounded-[46px] text-[28px] font-normal tracking-[-0.04em] bg-gradient-to-r from-[#4a90e2] to-[#77b6ff] cursor-pointer" onClick={() => router.push("/signin")}>
              sign in{" "}
              <svg
                width="40"
                height="40"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.9998 6.66663L17.6498 9.01663L26.9498 18.3333H6.6665V21.6666H26.9498L17.6498 30.9833L19.9998 33.3333L33.3332 20L19.9998 6.66663Z"
                  fill="white"
                />
              </svg>
            </Button>
          </div>
          <div className="w-[1254px] h-[795px] bg-[#fff] z-2 rounded-[11px] mt-[154px] flex flex-col justify-center items-center capitalize">
            <div className="w-[100%] ">
              <h1 className="text-[48px] tracking-[-0.02em] font-[500] ml-[74px]">
                Our{" "}
                <span className="font-[700] bg-gradient-to-r from-[#4a90e2] to-[#84b5ee] bg-clip-text text-transparent">
                  innovative
                </span>{" "}
                technologies
              </h1>
            </div>
            <div className="mt-[126px] flex justify-evenly items-center w-[100%] px-[40px]">
              <div className="w-[350px] h-[414px] flex flex-col justify-center items-center bg-[#2363b2] rounded-[60px] text-center">
                <div className="w-[175px] h-[175px] bg-[#fff] rounded-[7px]"></div>
                <h1 className="text-[#fff] text-[32px] font-[590] tracking-[-0.03em] mt-[17px]">
                  AI transcription
                </h1>
                <p className="text-[24px] text-[#fff] tracking-[-0.04em] mb-[16px]">
                  {" "}
                  <span className="text-[#6dadf9]">Deepseek AI</span>{" "}
                  video-to-text transcription of lectures
                </p>
              </div>
              <div className="w-[350px] h-[414px] flex flex-col justify-center items-center bg-[#4a90e2] rounded-[60px] text-center">
                <svg
                  width="175"
                  height="175"
                  viewBox="0 0 175 175"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="87.5" cy="87.5" r="87.5" fill="white" />
                </svg>
                <h1 className="text-[#fff] text-[32px] font-[590] tracking-[-0.03em] mt-[17px]">
                  Document Sharing
                </h1>
                <p className="text-[24px] text-[#fff] tracking-[-0.04em] mb-[16px]">
                  Sharing text documents to a group for{" "}
                  <span className="text-[#2363b2]">Teamwork</span>
                </p>
              </div>
              <div className="w-[350px] h-[414px] flex flex-col justify-center items-center bg-[#6dadf9] rounded-[60px] text-center">
                <svg
                  width="174"
                  height="150"
                  viewBox="0 0 174 150"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M87 0L173.603 150H0.397461L87 0Z" fill="white" />
                </svg>
                <h1 className="text-[#fff] text-[32px] font-[590] tracking-[-0.03em] mt-[17px]">
                  Real-time Change
                </h1>
                <p className="text-[24px] text-[#fff] tracking-[-0.04em] mb-[16px]">
                  Change of documents in{" "}
                  <span className="text-[#2363b2]">Real-Time</span> For
                  immediate progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-mainBlue">
      <header className="flex justify-between min-h-16 text-white p-8 border-b bg-white shadow-xl">
        <div className="flex space-x-3">
          <div></div>
          <Label className="text-mainBlue text-3xl font-semibold flex gap-0">
            Lec<span className="text-black">Sure</span>
          </Label>
        </div>
        <div
          className="w-16 h-16 bg-newWhite rounded-full cursor-pointer flex justify-center items-center"
          onClick={() => router.push("/profile")}
        >
          <User
            width={40}
            color="#000000"
            className="h-[2.5rem]"
            strokeWidth="1"
          />
        </div>
      </header>

      <div className="flex-1 flex justify-center items-start pt-18 px-4">
        {loading ? (
          renderSkeleton()
        ) : (
          <div className="w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-t-sm shadow-lg p-6 h-screen"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">
                Расписание занятий
              </h2>

              <div className="grid grid-cols-8 gap-1">
                <div className="col-span-1"></div>
                {daysOfWeek.map((day, index) => (
                  <div
                    key={index}
                    className="col-span-1 text-center font-semibold py-2 bg-gray-100"
                  >
                    {day}
                  </div>
                ))}

                {timeSlots.map((timeSlot, timeIndex) => (
                  <React.Fragment key={timeIndex}>
                    <div className="col-span-1 text-right pr-2 py-3 text-sm text-gray-500">
                      {timeSlot}
                      {/* тут должно быть написано начало и конец занятия типо во сколько начинается и во сколько заканчивается */}
                      {/* {lesson.startTime} - {calculateEndTime(lesson.startTime, duration)} */}
                    </div>

                    {daysOfWeek.map((day, dayIndex) => {
                      const lesson = findLesson(day, timeSlot);
                      if (lesson && timeIndex > 0) {
                        const prevTimeSlot = timeSlots[timeIndex - 1];
                        const prevLesson = findLesson(day, prevTimeSlot);
                        if (prevLesson && prevLesson.id == lesson.id) {
                          return null;
                        }
                      }

                      const duration = lesson
                        ? getLessonDuration(lesson.subject.typeOfSubject)
                        : 0;
                      const heightClass = duration == 80 ? "h-24" : "h-16";
                      const bgClass = lesson
                        ? duration == 80
                          ? "bg-blue-100"
                          : "bg-blue-50"
                        : "bg-gray-50";

                      return (
                        <div
                          key={dayIndex}
                          className={`col-span-1 p-2 ${bgClass} ${heightClass} border rounded-md`}
                        >
                          {lesson && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="h-full flex flex-col"
                            >
                              <Button
                                variant="ghost"
                                className="h-full text-left flex flex-col justify-center cursor-pointer"
                                onClick={() =>
                                  router.push(`/lecture/${lesson.id}`)
                                }
                              >
                                <span className="font-medium">
                                  {lesson.title}
                                </span>
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPageBuilder;