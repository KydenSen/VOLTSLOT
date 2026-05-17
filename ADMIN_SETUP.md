# VoltSlot Admin Panel - Setup & Usage Guide

## 📋 Overview

A comprehensive admin dashboard for managing the VoltSlot EV charging network. Features include real-time monitoring, booking management, electrical load control, and analytics.

## 🚀 Quick Start

### Enable Admin Mode

To access the admin panel, you need to set the user role to "admin" in Firebase. Here's how:

#### Option 1: Manual Firebase Setup

1. Go to your Firebase Console
2. Navigate to Firestore Database > Collection "users"
3. Create or edit a user document with this structure:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "timestamp"
}
```

4. Sign in with that user's credentials
5. Navigate to `/admin`

#### Option 2: Using Firebase CLI (Recommended)

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set your project
firebase use your-project-id

# Run seed script with admin user
npm run seed:admin  # You can create this script
```

#### Option 3: Test Demo (Without Firebase)

The admin panel works with mock data if you're just testing locally. The system will:
- Show all mock stations from BookingContext
- Display mock chargers with their status
- Show mock bookings and analytics
- Use local state for configuration changes

### Access the Admin Panel

**URL:** `http://localhost:5173/admin`

**Note:** You'll be redirected to login if not authenticated, and to a "Access Denied" page if your account isn't an admin.

---

## 📊 Dashboard Sections

### 1. Dashboard (Home)
- **Real-time System Status**
  - Total EV Stations: 14
  - Active Charging Sessions
  - Current Power Load (kW)
  - Available Chargers
  - Revenue Statistics
  
- **Quick Cards**
  - Active Chargers count
  - Current Load percentage with visual gauge
  - Pending Bookings
  - Faulty/Offline Stations
  - Overload Alerts
  
- **System Health Monitoring**
  - Network Load visualization
  - Charger Utilization percentage
  - Last updated timestamp

- **Recent Bookings Table**
  - User ID, Station, Status, Amount

---

### 2. Station Management 🔌
**Manage all 14 EV charging stations across Mysore**

#### Features
- **Search & Filter** - Find stations by name or address
- **Station Overview Table**
  - Station name & address
  - Number of chargers (available/in-use)
  - Health status (Active/Idle/Maintenance)
  - Total power capacity
  - Edit, Power, Delete actions

- **Charger Details View**
  - Click any station to see all chargers
  - Individual charger status (Available/In-Use/Maintenance)
  - Power rating (7.4kW Normal / 50kW Fast)
  - Pricing per minute
  - Edit or remove chargers

#### Mock Stations
- VoltSlot Mysore Palace - 4 chargers
- VoltSlot Vijayanagar - 4 chargers
- VoltSlot Kuvempunagar - 3 chargers
- VoltSlot Hebbal - 4 chargers
- VoltSlot Saraswathipuram - 3 chargers
- VoltSlot Gokulam - 3 chargers
- VoltSlot JP Nagar - 4 chargers
- VoltSlot Infosys - 3 chargers
- VoltSlot Chamundi Hill - 3 chargers
- VoltSlot Jayalakshmipuram - 4 chargers
- VoltSlot Devaraja Market - 3 chargers
- VoltSlot Bogadi - 3 chargers
- VoltSlot Hootagalli - 4 chargers
- VoltSlot Siddarthanagar - 3 chargers

---

### 3. Booking Management 📅
**Monitor and manage all user bookings**

#### Features
- **Stats Cards**
  - Total Bookings
  - Active | Completed | Cancelled
  - Pending Payments
  
- **Advanced Filtering**
  - By Status (Active/Completed/Cancelled)
  - By Payment (Pending/Paid/Refunded)

- **Booking Table**
  - Booking ID
  - Station & Charger Type
  - Date, Time & Duration
  - Amount (₹)
  - Status badge (Green/Blue/Red)
  - Payment status badge
  - Quick actions: View, Cancel

#### Actions
- View full booking details
- Cancel active bookings
- Resend payment reminders
- Manual payment verification

---

### 4. Load Management ⚡ (Key Feature)
**Real-time electrical load monitoring and control**

#### Features
- **Real-Time Load Gauge**
  - Visual gauge showing current load percentage
  - Current load (kW) / Max threshold (kW)
  - Safety margin indicator
  - Color-coded status (Green/Yellow/Orange/Red)

- **Smart Load Controls**
  - Adjust max load threshold
  - Priority Mode (Balanced/Fast Charging/Normal Charging)
  - Auto-reduce load button
  - Increase capacity button

- **Station-Wise Load Breakdown**
  - Per-station load distribution
  - Load percentage per station
  - Visual progress bars
  - Alerts for overloaded stations
  - Station list with detailed breakdown

- **Overload Prevention**
  - Automatic alerts when threshold exceeded
  - Recommended load reduction actions
  - Station-specific alerts
  - Alert count and severity

#### Configuration
- **Max Load Threshold** - Default 500 kW
- **Auto Reduce Load At** - Default 450 kW
- **Priority Mode** - Select which chargers to prioritize during peak

#### Load Calculation
- Each charger contributes its power rating (kW) when active
- Normal chargers: 7.4 kW
- Fast chargers: 50 kW
- Total load = Sum of all active chargers' power

---

### 5. User Management 👥
**Manage user accounts and verify identities**

#### Features
- **User Statistics**
  - Total Users count
  - Active users
  - Verified users
  - Suspended users

- **Search & Filter**
  - By User ID or Email
  - By Status (Active/Suspended/Verified)

- **User Table**
  - User ID
  - Email
  - Account Status
  - Verification status
  - Join Date
  - Total Bookings
  - Total Spent (₹)
  - Quick Actions

#### User Actions
- **Shield Icon** - View user details & history
- **Ban Icon** - Suspend/Unsuspend user
- **Mail Icon** - Send notification

#### User Status
- **Active** - Account in good standing
- **Suspended** - Account restricted (can't book)
- **Verified** - Email/phone verified ✓

---

### 6. Analytics & Reports 📈
**Business intelligence and performance metrics**

#### KPI Cards
- **Total Revenue** - Sum of all paid bookings
- **Avg Booking Value** - Average revenue per booking
- **Total Bookings** - All-time booking count
- **Avg Duration** - Average booking length in minutes

#### Charts & Visualizations

**Peak Hours Demand (Bar Chart)**
- Shows which hours have highest demand
- Helps with maintenance scheduling
- Energy supply planning

**Revenue by Charger Type (Pie Chart)**
- Fast vs Normal charger revenue split
- Percentage breakdown
- Revenue allocation insights

**Top Performing Stations (Table)**
- Ranked by booking count
- Revenue per station
- Average rating
- Performance metrics

**Daily Booking Trends (Line Chart)**
- Last 7 days booking activity
- Trend identification
- Capacity planning insights

---

### 7. Alerts & Notifications 🚨
**Real-time system alerts and notifications**

#### Alert Types
- **Critical** (🔴)
  - System Overload Risk
  - Major service disruptions
  
- **Warnings** (🟠)
  - Charger Maintenance needed
  - High Utilization (>80%)
  - Charger faults
  
- **Information** (🔵)
  - Pending payments
  - Regular updates

#### Alert Management
- **Dismiss Alerts** - Hide individual alerts
- **Alert History** - View dismissed alerts
- **Clear All** - Reset notification state

#### Configuration
- **Alert Preferences** - Choose which alerts to receive
  - System Overload
  - Charger Maintenance
  - Payment Issues
  - High Utilization
  - Station Offline
  - Performance Degradation

- **Notification Channels**
  - In-App Notifications
  - Email Alerts
  - SMS Alerts (optional)
  - Dashboard Widget

---

### 8. Settings ⚙️
**System configuration and administration**

#### Load Configuration
- Max Load Threshold (kW)
- Auto Reduce Load Trigger Point
- Safety parameters

#### Pricing Configuration
- Normal Charger Rate (₹/min) - Default ₹2/min (₹120/hr)
- Fast Charger Rate (₹/min) - Default ₹5/min (₹300/hr)
- Price Per kWh (₹) - Default ₹12
- Enable Dynamic Pricing (Off by default)

#### Booking Configuration
- Booking Slot Duration (30 min default)
- Minimum booking interval
- Cancellation policy settings

#### Maintenance Configuration
- Maintenance Window Start (Default: 02:00 AM)
- Maintenance Window End (Default: 06:00 AM)
- Schedule when system performs maintenance
- No bookings allowed during maintenance window

#### Advanced Features
- **Energy Harvesting** - Integrate solar/wind power
- **Predictive Analytics** - AI demand forecasting
- **Dynamic Pricing** - Adjust prices based on demand

#### Security
- Change Admin Password
- View API Keys
- Audit Logs
- Session Management

---

## 📊 Data Models

### Station
```typescript
{
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  total_chargers: number;
}
```

### Charger
```typescript
{
  id: string;
  name: string;
  location: string;
  status: 'available' | 'in-use' | 'maintenance';
  power_kw: number;
  charger_type: 'normal' | 'fast';
  price_per_min: number;
  station_id: string;
}
```

### Booking
```typescript
{
  id: string;
  user_id: string;
  charger_id: string;
  station_id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_min: number;
  status: 'active' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  amount: number;
  charger_type: 'normal' | 'fast';
}
```

### User (Admin)
```typescript
{
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
}
```

---

## 🔌 Integration Points

### Firebase Collections
- `users` - User accounts with role field
- `stations` - Charging station data
- `chargers` - Individual charger information
- `bookings` - Booking records
- `payments` - Payment transactions

### Context Providers Used
- **AuthContext** - User authentication & admin verification
- **BookingContext** - Station, charger, booking data
- **ThemeContext** - Light/Dark theme support

---

## 🎨 Design Features

- **Dark Theme Aesthetic** - "Future-city energy grid" style
- **Neon Accents** - Cyan, Blue, Green colors for status
- **Live Animations**
  - Pulsing load gauge
  - Real-time updates
  - Smooth transitions
- **Responsive Design** - Works on desktop, tablet, mobile
- **Sidebar Navigation** - Collapsible navigation menu
- **Real-time Indicators**
  - Status dots (Green/Yellow/Red)
  - Loading spinners
  - Progress bars

---

## 🧪 Testing Tips

1. **Test Load Management**
   - Adjust the max load threshold
   - Watch alerts trigger at threshold
   - See per-station load distribution

2. **Test Booking Filtering**
   - Filter by Active/Completed/Cancelled
   - Filter by Paid/Pending/Refunded
   - Check calculations match

3. **Test Analytics**
   - Verify revenue calculations
   - Check peak hours accuracy
   - Review top stations ranking

4. **Test User Management**
   - Search by ID or email
   - Filter by status
   - Toggle user suspension status

---

## 🚀 Deployment Considerations

1. **Admin Role Assignment**
   - Only assign admin role to trusted staff
   - Use Firebase security rules to restrict access

2. **Load Limits**
   - Set realistic load thresholds for your grid
   - Configure safety margins (e.g., 10-20%)

3. **Pricing**
   - Consider local electricity costs
   - Factor in maintenance & infrastructure
   - Adjust for demand peaks

4. **Maintenance Windows**
   - Schedule during low-traffic hours
   - Communicate schedules to users
   - Plan for charger rotation

---

## 📞 Support

For issues or feature requests:
1. Check the component files in `/src/components/admin/`
2. Review context providers in `/src/contexts/`
3. Verify Firebase configuration in `/src/integrations/firebase/`

---

## 🎯 Future Enhancements

- [ ] Scheduled charging management
- [ ] Advanced predictive analytics
- [ ] Mobile app admin access
- [ ] Multi-language support
- [ ] Custom report generation
- [ ] API integration for third-party services
- [ ] AI-powered load optimization
- [ ] Real-time charger IoT integration
