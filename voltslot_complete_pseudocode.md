# VoltSlot: EV Charging Slot Booking & Load Management
## High-Level Simplified Pseudocode Specification

This document provides a clean, concise, and high-level pseudo-code specification of the **VoltSlot** application architecture, state context orchestration, database structures, and smart grid algorithms.

---

## 1. Core Data Models & Database Schema

VoltSlot relies on a Google Cloud Firestore backend with 6 primary collections.

### 1.1 Core TypeScript Interfaces
```typescript
interface User    { id: string; fullName: string; email: string; role: 'user' | 'admin' }
interface Station { id: string; name: string; address: string; status: 'active' | 'maintenance' }
interface Charger { id: string; station_id: string; charger_type: 'normal' | 'fast'; status: 'available' | 'maintenance' }
interface Slot    { id: string; station_id: string; charger_id: string; date: string; start_time: string; end_time: string; status: 'available' | 'booked' }
interface Booking { id: string; user_id: string; charger_id: string; date: string; start_time: string; end_time: string; amount: number; status: 'active' | 'completed' | 'cancelled' }
interface Settings { maxLoadThreshold: number; normalChargerPricePerMin: number; fastChargerPricePerMin: number }
```

### 1.2 Firestore Collection Mappings
*   `/users/{userId}`: Profiles + Roles
*   `/stations/{stationId}`: Locations + Statuses
*   `/chargers/{chargerId}`: Power specs + Availability
*   `/slots/{slotId}`: Composite entries (date-chargerId-time)
*   `/bookings/{bookingId}`: Reservation logs
*   `/settings/global`: Single global config parameters

---

## 2. Core Context Providers

The application's reactive state is managed by two centralized context providers.

### 2.1 Authentication & Authorization (`AuthContext.tsx`)
```python
Class AuthProvider:
    Properties:
        user: User Profile | null, loading: boolean

    Function OnInit():
        Listen to Firebase.onAuthStateChanged:
            If user logged in:
                Fetch details from Firestore "/users/{uid}"
                Set user profile (role = 'admin' or 'user')
            Else:
                Clear user state

    Function login(email, password):
        Firebase.signInWithEmailAndPassword(email, password)

    Function signup(fullName, email, password):
        cred = Firebase.createUserWithEmailAndPassword(email, password)
        Create Firestore Document "/users/{cred.uid}" with name and role = "user"

    Function logout():
        Firebase.signOut()
```

### 2.2 Dynamic Booking Engine (`BookingContext.tsx`)
```python
Class BookingProvider:
    Properties:
        bookings: Booking[], chargers: Charger[], stations: Station[], settings: Settings, loading: boolean

    Function OnInit():
        # Setup live Firebase listeners for automatic UI updates
        Subscribe to "/stations", "/chargers", "/bookings", and "/settings/global"
        If connections fail: Fallback to local MOCK compilation data

    Function getStationSlots(date, stationId, chargerType, durationMin):
        If station.status == "maintenance":
            Return all slots as "unavailable"
            
        activeChargers = Filter chargers where station_id == stationId AND charger_type == chargerType AND status != "maintenance"
        slots = Generate 30-min intervals for target date (6:00 AM - 10:00 PM)
        
        For each slot in slots:
            # Check availability
            freeChargers = Filter activeChargers that do not overlap with any "active" bookings
            slotExpired = CheckIfTimePassed(date, slot.start_time)
            
            slot.status = (slotExpired) ? "unavailable" : (freeChargers is Empty) ? "booked" : "available"
            slot.remainingSlots = freeChargers.length
            slot.chargerId = freeChargers[0]?.id
        Return slots

    Function computePrice(chargerType, durationMin):
        rate = (chargerType == "fast") ? settings.fastChargerPricePerMin : settings.normalChargerPricePerMin
        Return rate * durationMin

    Function bookSlot(slot, durationMin, chargerType):
        If station.status == "maintenance":
            Return Error("Station is closed for maintenance")
            
        # Overlapping threshold check
        overlapping = Filter bookings where stationId == slot.stationId AND date == slot.date AND Overlaps(slot, booking)
        If overlapping.length >= station.totalChargers:
            Return Error("Substation capacity fully reserved")

        bookingId = GenerateUUID()
        amount = computePrice(chargerType, durationMin)
        
        # Save to Database
        Set Firestore "/bookings/{bookingId}" (status: 'active', amount: amount)
        Set Firestore "/payments/{txnId}" (status: 'paid')
        Return Success(bookingId, amount)

    Function cancelBooking(bookingId):
        Update Firestore "/bookings/{bookingId}" (status: 'cancelled', paymentStatus: 'refunded')
```

---

## 3. UI Application Flows

### 3.1 Driver Booking Portal (`Dashboard.tsx` & components)
*   **Station Map & Search**: Renders Leaflet Map. Filters stations based on text search and status. Click markers to select.
*   **Location Drawer**: Displays station info. Toggle between "Normal" (AC) and "Fast" (DC) chargers, select duration (30-180 min), select calendar date.
*   **Slot Selection**: Renders slot list dynamically. Clicking a slot triggers `PaymentDialog`.
*   **Payment Dialog**: Simulates UPI payment checkout. Calls `bookSlot()` upon success.
*   **Active Booking Panel**: Displays elapsed charging status, dynamic battery progress percentage, and an option to "Stop Charging" early.

### 3.2 Administrator Management Panel (`Admin.tsx` & components)
*   **Substation Load Graph**: Plots live grid load metrics vs safety threshold limits in real-time.
*   **Maintenance Status Control**: Toggles any station's status field between `'active'` and `'maintenance'` in one click. Immediately blocks users from scheduling reservations.
*   **Settings Editor**: Provides inputs to update electricity unit prices, charger speed rates, and overload threshold caps in `/settings/global`.

---

## 4. Intelligent Automation Algorithms

### 4.1 Substation Safety Load Balancer
```python
Function CalculateLiveLoadAndBalance(stationId, stationChargers, activeBookings, settings):
    activeSessions = Filter activeBookings where stationId == stationId AND status == "active"
    totalLoad = Sum (charger.powerKw for session in activeSessions)
    
    If totalLoad >= settings.autoReduceLoadThreshold:
        Trigger System Warning Alert ("Grid Peak Threshold Exceeded")
        reductionRatio = settings.autoReduceLoadThreshold / totalLoad
        
        # Throttle DC fast chargers dynamically to protect station transformers
        For each session in activeSessions:
            If chargerType == "fast":
                ThrottleChargerSpeed(charger.id, 50.0 * reductionRatio)
    Else:
        # Restore standard charging configurations
        RestoreDefaultRates(stationChargers)
```

### 4.2 Overlapping Duration Validation
```python
Function Overlaps(slotA, slotB):
    # Time Collision Test: (StartA < EndB) AND (EndA > StartB)
    Return slotA.startTime < slotB.endTime AND slotA.endTime > slotB.startTime
```
