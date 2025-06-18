import DatePicker from 'react-datepicker';
import {
  useQuery,
  gql
}
  from "@apollo/client";
import { useContext, useEffect, useMemo } from 'react';
import { parse } from 'date-fns'
import { CallSchedulerContext } from '../context/CallSchedulerContext';
import useAppointmentTypes from '../hooks/useAppointmentTypes';
import { useLocation } from 'react-router-dom';

const ALL_ORG_MEMBER = gql`query {
  organizationMembers(page_size: 100) {
    id
    first_name
    last_name
    email
  }
}
`;

const DAYS_AVAILABLE_FOR_RANGE = gql`
query daysAvailableForRange(
      $provider_id: String
      $date_from_month: String
      $org_level: Boolean
      $contact_type: String
      $timezone: String
      $provider_ids: [String]
      $appt_type_id: String
      $appt_loc_id: String
      $clients_can_join_waitlist: Boolean,
      $appointment_to_reschedule_id: ID,
    ) {
      daysAvailableForRange(
        provider_id: $provider_id
        date_from_month: $date_from_month
        org_level: $org_level
        contact_type: $contact_type
        timezone: $timezone
        provider_ids: $provider_ids
        appt_type_id: $appt_type_id
        appt_loc_id: $appt_loc_id
        clients_can_join_waitlist: $clients_can_join_waitlist,
        appointment_to_reschedule_id: $appointment_to_reschedule_id,
      )
    }`;

const NEXT_AVAILABLE_SLOT = gql`query nextAvailableSlot(
    $provider_id: String
    $org_level: Boolean
    $timezone: String
    $appt_type_id: String
  ) {
    nextAvailableSlot(
      provider_id: $provider_id
      org_level: $org_level
      timezone: $timezone
      appt_type_id: $appt_type_id
    )
  }`


function DayPicker() {
  const context = useContext(CallSchedulerContext);
  if (!context) {
    return;
  }
  const searchParams = new URLSearchParams(useLocation().search);
  const provider_id = searchParams.get("dietitian_id");
                                                                                                      
  const { appointmentType } = useAppointmentTypes(provider_id as any);

  const { stateDate, setStartDate } = context;
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  const { data } = useQuery(DAYS_AVAILABLE_FOR_RANGE, {
    variables: {
      org_level: false,
      clients_can_join_waitlist: true,
      date_from_month: stateDate.toString() ? stateDate.toString() : new Date().toLocaleDateString('en-US', options),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
      appt_type_id: appointmentType?.id,
      provider_id: provider_id,
      contact_type: appointmentType?.available_contact_types[0]
    }
  });

  const { data: nextAvailableSlot } = useQuery(NEXT_AVAILABLE_SLOT, {
    variables: {
      provider_id: provider_id,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
      org_level: false,
      appt_type_id: appointmentType?.id,
    }
  })

  useEffect(() => {
    if (nextAvailableSlot?.nextAvailableSlot) {
      const dateObj = new Date(nextAvailableSlot.nextAvailableSlot);

      if (!isNaN(dateObj.getTime())) {
        setStartDate(dateObj as any); // keep it as Date object
      }
    }
  }, [nextAvailableSlot?.nextAvailableSlot]);

  const { data: allData }: any = useQuery(ALL_ORG_MEMBER)

  const highlightDates = useMemo(() => {
    return data?.daysAvailableForRange?.map((day: string) =>
      parse(day, "yyyy-MM-dd", new Date())
    ) || [];
  }, [data]);
//  hh
  if (!stateDate) {
    return 
  }

  return (
    <div className="book-cal-container">
      {stateDate ? (
        <DatePicker
          inline
          onChange={(date: any) => setStartDate(date)}
          useWeekdaysShort={true}
          selected={stateDate}
          highlightDates={highlightDates}
        />
      ) : null}
    </div>
  );

}

export default DayPicker;


///////////////////////////////////////////////////////////////////////////////////
// {
//   "data": {
//       "appointmentTypes": [
//           {
//               "id": "221777",
//               "name": "Initial Consultation",
//               "__typename": "AppointmentType"
//           },
//           {
//               "id": "221778",
//               "name": "Follow-up Session",
//               "__typename": "AppointmentType"
//           },
//           {
//               "id": "221779",
//               "name": "Group Session",
//               "__typename": "AppointmentType"
//           }
//       ]
//   }
// }




// {
//   "data": {
//       "organizationMembers": [
//           {
//               "id": "1857881",
//               "first_name": "Deepak",
//               "last_name": "Kumar",
//               "email": "deepak.kumar@getshapely.com",
//               "__typename": "User"
//           },
//           {
//               "id": "2612119",
//               "first_name": "Sujit",
//               "last_name": "Kumar",
//               "email": "sujit.kumar@getshapely.com",
//               "__typename": "User"
//           },
//           {
//               "id": "2612119",
//               "first_name": "Inderjeet",
//               "last_name": "Singh",
//               "email": "inderjeet.singh@getshapely.com",
//               "__typename": "User"
//           },
//           {
//               "id": "1857865",
//               "first_name": "Justin",
//               "last_name": "Zaghi",
//               "email": "justin@getshapely.com",
//               "__typename": "User"
//           }
//       ]
//   }
// }
