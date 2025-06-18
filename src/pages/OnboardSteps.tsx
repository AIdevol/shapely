import React, { useContext } from "react"
import { localStrings } from "../utils/Constants"
import { Card } from "react-bootstrap"
import ContactDetails from "../components/ContactDetails"
import { CallSchedulerContext } from "../context/callSchedulerContext";

function OnboardSteps() {
    const context = useContext(CallSchedulerContext);
    if (!context) {
        return;
    }
    const { bookedAppointment } = context;
      
    const date = new Date(bookedAppointment?.date);

    // Format date components
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short"
    };
    const formatter = new Intl.DateTimeFormat("en-US", options as any);
    const formatted = formatter.format(date);

    return (
        <>
            <h1 className="!text-3xl mb-3 flex gap-2 !font-bold">
                {localStrings.EXCITED_TO_MEET.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </h1>
            <Card className="p-3 mb-4">
                {localStrings.STEPS("April 19, 2025 at 4:20 PM PST").map((step, index) => (
                    <div className={`flex items-start ${step.LIST ? "flex-wrap" : "gap-3"}`}>
                        <span className={`w-6 h-6 text-white text-sm rounded-full flex items-center justify-center ${step.LIST ? "me-3" : ""}`}
                            style={{ background: "#ff769a", flexShrink: 0 }}
                        >{index + 1}</span>
                        <h4 className="!text-lg">
                            <b className="!font-semibold pe-2">
                                {step.HEADING}
                            </b>
                            {step.SUBHEADING}
                        </h4>
                        {step.LIST ?
                            <ul className="w-full">
                                <li className="list-disc text-lg">
                                    Your appointment is scheduled for {formatted}
                                </li>
                                <li className="list-disc text-lg">
                                    You'll receive a secure video link via email to join your video visit. Please join 5 minutes early to ensure everything is working properly.
                                </li>
                            </ul> : ""
                        }
                    </div>
                ))}
            </Card>
            <ContactDetails className="contactInfo" />
        </>
    )
}

export default OnboardSteps