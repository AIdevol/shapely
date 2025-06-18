import React, { createContext, useState, ReactNode } from 'react';

interface CallSchedulerContextType {
  step: string;
  setStep: React.Dispatch<React.SetStateAction<string>>;
  stateDate: any;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  selectedSlots: any;
  setSelectedSlots: React.Dispatch<React.SetStateAction<string>>;
  bookedAppointment: any;
  setBookedAppointment: React.Dispatch<React.SetStateAction<string>>
}

export const CallSchedulerContext = createContext<CallSchedulerContextType | undefined>(undefined);

interface CallSchedulerProviderProps {
  children: ReactNode;
}

export const CallSchedulerProvider: React.FC<CallSchedulerProviderProps> = ({ children }) => {
  const [step, setStep] = useState<string>("dateTime");
  const [stateDate, setStartDate] = useState<any>("");
  const [bookedAppointment, setBookedAppointment] = useState<any>();
  const [selectedSlots, setSelectedSlots] = useState<any>()

  return (
    <CallSchedulerContext.Provider value={{ step, setStep, stateDate, setStartDate, selectedSlots, setSelectedSlots, bookedAppointment, setBookedAppointment }}>
      {children}
    </CallSchedulerContext.Provider>
  );
};
