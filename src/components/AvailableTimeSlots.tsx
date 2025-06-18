import { Card } from "react-bootstrap";
import { localStrings } from "../utils/Constants";
import ButtonComponent from "./Button";
import { CallSchedulerContext } from "../context/CallSchedulerContext";
import { useContext } from "react";
import {
    useQuery,
    gql
}
    from "@apollo/client";
import { format, parse, addDays } from 'date-fns'
import useAppointmentTypes from "../hooks/useAppointmentTypes";
import { useLocation } from "react-router-dom";

export const toDate = (date: string) => {

    return parse(date, 'yyyy-MM-dd HH:mm:ss xx', new Date())
}

const AVAILABLE_SLOTS_FOR_RANGE = gql`
  query availableSlotsForRange(
  $provider_id: String
  $start_date: String
  $end_date: String
  $org_level: Boolean
  $contact_type: String
  $timezone: String
  $provider_ids: [String]
  $appt_type_id: String
  $appt_loc_id: String
  $clients_can_join_waitlist: Boolean,
  $appointment_to_reschedule_id: ID,
) {
  availableSlotsForRange(
    provider_id: $provider_id
    start_date: $start_date
    end_date: $end_date
    contact_type: $contact_type
    timezone: $timezone
    org_level: $org_level
    provider_ids: $provider_ids
    appt_type_id: $appt_type_id
    appt_loc_id: $appt_loc_id
    clients_can_join_waitlist: $clients_can_join_waitlist,
    appointment_to_reschedule_id: $appointment_to_reschedule_id
  ) {
    user_id
    date
    appointment_id
    is_fully_booked
    has_waitlist_enabled
  }
}`;

function AvailableSlots() {
    const context = useContext(CallSchedulerContext);
    const searchParams = new URLSearchParams(useLocation().search);
    const provider_id = searchParams.get("dietitian_id");
  const { appointmentType } = useAppointmentTypes(provider_id as any);
    if (!context) {
        return;
    }

    const { setStep, stateDate, selectedSlots, setSelectedSlots } = context;
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    const { loading, data } = useQuery(AVAILABLE_SLOTS_FOR_RANGE, {
        variables: {
            org_level: false,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
            appointment_type_id: appointmentType?.id,
            clients_can_join_waitlist: true,
            appt_type_id: appointmentType?.id,
            provider_id: provider_id,
            end_date: stateDate ? stateDate?.toLocaleDateString('en-US', options) : "",
            start_date: stateDate ? stateDate?.toLocaleDateString('en-US', options) : "",
            contact_type: appointmentType?.available_contact_types[0],
        }
    });
    
    function availableSlot(slot: any, index: number) {
        return (
            <span
                key={index}
                onClick={() => setSelectedSlots(slot)}
                className={`cursor-pointer w-[92px] max-h-[36px] px-3 py-2 text-sm flex items-center justify-center ${selectedSlots === slot ? "text-white" : ""}`} style={{ borderRadius: "100px", flexShrink: 0, background: selectedSlots === slot ? "#0b3250" : "#fff"  }}
            >
                {format(toDate(slot.date), 'h:mm a')}
            </span>
        );
    }


    return (
        stateDate && <Card className="card text-center availableTimeSlotsCard relative !h-full !rounded-lg !border-0 !p-4" style={{ background: "#f2f0f1" }}>
            {loading && <div className="text-xl font-semibold">Loading...</div>}
            {!loading && <>
                <h4 className="mb-0 !font-semibold">
                    {format(stateDate, "MMMM d, yyyy")}
                </h4>
                <span className="text-sm mb-5" style={{ color: "#999" }}>{localStrings.TIMEZONE} {Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'}</span>
                {data?.availableSlotsForRange?.length > 0 &&
                    <div className="flex items-start mb-5">
                        <div className="flex flex-wrap timeContainer overflow-scroll gap-3 mb-5">
                            {data?.availableSlotsForRange?.map((slot:any, index:number) => availableSlot(slot, index))}
                        </div>
                    </div>}
                {data?.availableSlotsForRange?.length === 0 ? <>
                    <h4 className="!font-semibold mb-2">{localStrings.NO_AVAILABLE_SLOTS}</h4>
                    <p className="text-base" style={{ color: "#999" }}>{localStrings.SELECT_ANOTHER_DATE}</p>
                    <h6>{localStrings.GO_TO_NEXT_AVAILABILITY} ({format(addDays(stateDate, 1), "MMMM d, yyyy")})</h6>
                </> :
                    <ButtonComponent disabled={!selectedSlots} buttonText={localStrings.CONFIRM_DATE_TIME} handleButtonClick={() => setStep("userInfo")} className="absolute bottom-4 left-1/2" style={{ transform: "translateX(-50%)" }} />
                }
            </>}
        </Card>
    );

}

export default AvailableSlots;
