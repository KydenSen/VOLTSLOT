# VoltSlot: Plain English Business Logic Guide

This guide translates the technical code, state contexts, and smart grid automation algorithms of **VoltSlot** into simple, conversational, step-by-step English.

---

## 1. User Accounts, Login, & Security (`AuthContext.tsx`)

This section handles who can use the app and what they are allowed to see (Driver features vs. Admin Dashboard).

### 1.1 Creating a New Account (Sign Up)
1. **User Input**: A new user enters their full name, email address, and a secure password.
2. **Account Creation**: The system registers these credentials securely in Firebase Authentication.
3. **Database Profile**: The system automatically creates a profile card for the user in the database's `users` collection.
4. **Default Role**: Every new account is automatically labeled with the role of a standard **"user"** (a driver).

### 1.2 Accessing the App (Log In)
1. **User Input**: The user enters their registered email and password.
2. **Verification**: The system checks Firebase to see if the credentials are correct.
3. **Profile Lookup**: If valid, the system retrieves their profile document from the database to look up their assigned role.
4. **Permission Routing**:
   *   If their role is **"user"**, they are signed in to the standard Driver Dashboard to browse stations and book slots.
   *   If their role is **"admin"**, they are granted access to the restricted Admin Panel to manage grid loads, stations, and pricing.
5. **Access Denied**: If a standard "user" tries to manually type `/admin` in the browser URL, the system detects their role is not "admin" and immediately blocks them, showing an "Access Denied" page.

### 1.3 Signing Out (Log Out)
1. **Sign Out**: The user clicks the logout button.
2. **Session Cleanup**: The system signs them out of Firebase, clears all cached profiles, and redirects them to the login screen.

---

## 2. The Dynamic Booking Engine (`BookingContext.tsx`)

This engine is the "brain" of the app. It handles how time slots are calculated, priced, booked, and cancelled in real-time.

```
       [ User Selects Station, Date, & Charger Type ]
                             │
                             ▼
               Is Station under Maintenance?
               ├── YES ──► Mark all slots as UNAVAILABLE (Block Bookings)
               └── NO  ──► [ Generate 30-min Slots (6 AM - 10 PM) ]
                                     │
                                     ▼
                      Check Charger Availability
                      ├── Slot has already passed in time? ──► Mark as UNAVAILABLE
                      ├── All chargers already reserved? ──► Mark as BOOKED
                      └── At least one charger is free?   ──► Mark as AVAILABLE
                                                                  │
                                                                  ▼
                                                      [ Proceed to checkout ]
```

### 2.1 Displaying Available Time Slots
When a driver clicks a station and selects a date and charger type (Normal vs. Fast):
1. **Maintenance Check**: The system checks if the station is marked as "under maintenance".
   *   **If Yes**: It marks all time slots as "unavailable" and prevents any bookings.
   *   **If No**: It proceeds to calculate availability.
2. **Charger Filtering**: It finds all chargers at that station that match the selected type (Normal vs. Fast) and are not under maintenance.
3. **Slot Generation**: It creates a list of 30-minute intervals for the day, running from **6:00 AM to 10:00 PM** (32 slots per charger per day).
4. **Availability Rule**: For each 30-minute slot, it checks the database:
   *   **Time Check**: If the slot time is in the past (e.g., it is 2:00 PM and the slot is for 10:00 AM), it is marked as **"unavailable"**.
   *   **Overlap Check**: It checks how many active bookings exist for that specific time.
   *   **Result**: 
       *   If all eligible chargers at the station are already booked, the slot status is set to **"booked"**.
       *   If at least one charger is free, the slot is marked **"available"** and shows how many spots are left.

### 2.2 Calculating the Cost (Pricing)
The price is calculated based on the charger's speed and the length of time the driver wishes to book:
$$\text{Total Price} = \text{Rate per Minute} \times \text{Duration (minutes)}$$
*   **Normal Charger (7.4 kW AC)**: Costs **₹2** per minute (₹120/hour).
*   **Fast Charger (50 kW DC)**: Costs **₹5** per minute (₹300/hour).

### 2.3 Reserving a Slot (Check Out)
When a user selects an available time slot and completes the demo UPI payment:
1. **Safety Double-Check**: The system checks the database one more time to ensure the station is still active and that someone else didn't book the last charger a second earlier.
2. **Record Creation**:
   *   It generates a unique booking receipt ID.
   *   It creates a new document in the `bookings` collection containing the user's details, date, duration, charger, cost, and sets the status to **"active"**.
   *   It creates a corresponding receipt in the `payments` collection marked as **"paid"**.
3. **Real-Time Update**: The status of that time slot changes to **"booked"** in the database, instantly updating the screens of all other users viewing that station.

### 2.4 Cancelling a Booking
1. **Update Booking**: The system changes the reservation status to **"cancelled"**.
2. **Refund Process**: The system updates the payment record to **"refunded"** (simulating a refund).
3. **Free Up Slots**: The slots that were previously occupied are marked back to **"available"** so other drivers can reserve them.

---

## 3. Intelligent Automation Algorithms

These are the smart automated rules that protect the electrical grid and prevent scheduling conflicts.

### 3.1 Substation Safety Load Balancer (Grid Protection)
This automated background check protects the local power grid from overheating or short-circuiting during peak charging hours.

1. **Calculate Active Power**: The system checks all chargers at a station that are currently active and adds up their power consumption:
   $$\text{Total Grid Demand} = (\text{Active Normal Chargers} \times 7.4\text{ kW}) + (\text{Active Fast Chargers} \times 50\text{ kW})$$
2. **Compare Against Safety Cap**: It matches this total against the station's maximum safety threshold (e.g., 500 kW).
3. **Overload Warning**: If the grid demand exceeds the safety warning limit (e.g., 450 kW), the system sounds a visual warning alert in the Admin Panel.
4. **Dynamic Throttling**: To prevent a power outage, the system calculates a safety reduction ratio. It then automatically decreases the electricity flow of all **DC Fast Chargers** at that station (e.g., cutting them down to 35 kW instead of 50 kW) until the overall load drops back into the safe zone.
5. **Restore Normal Speeds**: As soon as users finish charging and the grid demand returns to normal, the system restores the default maximum charging rates.

### 3.2 Double-Booking Prevention (Time Collision Test)
To make sure two drivers do not book the exact same charger at the same time:
1. When a new booking is requested, the system compares the proposed start and end times against all existing active bookings for that specific charger.
2. **Collision Rule**: An overlap occurs if the **New Booking starts before the Existing Booking ends**, and the **New Booking ends after the Existing Booking starts**.
3. If this condition is met, the system blocks the request and prompts the user to select a different slot or charger.
