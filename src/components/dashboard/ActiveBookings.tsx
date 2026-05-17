/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBooking } from "@/contexts/BookingContext";
import { toast } from "sonner";
import { List, X, MapPin, Clock, CreditCard, CalendarCheck, History, Zap, Rocket } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const ActiveBookings = () => {
  const { bookings, cancelBooking, loading, stations, chargers } = useBooking();
  const [cancelling, setCancelling] = useState<string | null>(null);
  const today = format(new Date(), "yyyy-MM-dd");
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const isPastBooking = (date: string, startTime: string, endTime: string) => {
    if (date < today) return true;
    if (date > today) return false;
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    return endHours * 60 + endMinutes <= currentMinutes;
  };

  const upcoming = useMemo(
    () => bookings.filter((b) => b.status === "active" && !isPastBooking(b.date, b.start_time, b.end_time))
      .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)),
    [bookings, today, currentMinutes],
  );

  const past = useMemo(
    () => bookings.filter((b) => b.status !== "active" || isPastBooking(b.date, b.start_time, b.end_time))
      .sort((a, b) => b.date.localeCompare(a.date)),
    [bookings, today, currentMinutes],
  );

  const handleCancel = async (id: string) => {
    setCancelling(id);
    await cancelBooking(id);
    setCancelling(null);
    toast.info("Booking cancelled");
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-primary/15 text-primary border-primary/20",
      completed: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      cancelled: "bg-destructive/15 text-destructive border-destructive/20",
    };
    return colors[status] || "";
  };

  const paymentBadge = (status: string | undefined) => {
    const colors: Record<string, string> = {
      paid: "bg-primary/15 text-primary border-primary/20",
      pending: "bg-amber-500/15 text-amber-500 border-amber-500/20",
      refunded: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    };
    return colors[status || ""] || "";
  };

  const getBookingLocation = (b: typeof bookings[0]) => {
    if (b.stations?.name) return b.stations.name;
    const station = stations.find((item) => item.id === b.station_id);
    if (station) return station.name;
    const charger = chargers.find((item) => item.id === b.charger_id);
    return charger ? charger.name : "Station";
  };

  const renderBooking = (b: typeof bookings[0], showCancel: boolean, index: number) => (
    <motion.div
      key={b.id}
      className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm">{getBookingLocation(b)}</span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 + 0.1 }}
            >
              <Badge variant="outline" className={`text-[10px] font-semibold ${statusBadge(b.status)}`}>
                {b.status}
              </Badge>
            </motion.div>
            {b.payment_status && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.15 }}
              >
                <Badge variant="outline" className={`text-[10px] font-semibold ${paymentBadge(b.payment_status)}`}>
                  <CreditCard className="h-2.5 w-2.5 mr-1" />{b.payment_status}
                </Badge>
              </motion.div>
            )}
          </div>
          <motion.div 
            className="flex items-center gap-4 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.05 }}
          >
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />{b.date} • {b.start_time} – {b.end_time}
            </span>
            {b.duration_min > 0 && <span className="text-muted-foreground">{b.duration_min} min</span>}
            {b.amount > 0 && <span className="font-bold text-primary">₹{b.amount}</span>}
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.1 }}
          >
            {b.charger_type && (
              <Badge variant="outline" className={`text-[10px] font-semibold gap-1 ${b.charger_type === 'fast' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                {b.charger_type === 'fast' ? <Rocket className="h-2.5 w-2.5" /> : <Zap className="h-2.5 w-2.5" />}
                {b.charger_type === 'fast' ? 'Fast' : 'Normal'}
              </Badge>
            )}
            {b.chargers && (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                {b.chargers.name} • {b.chargers.power_kw}kW
              </span>
            )}
          </motion.div>
        </div>
        {showCancel && b.status === "active" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={cancelling === b.id} className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-xl">
                  <X className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cancel booking at <strong>{getBookingLocation(b)}</strong> on <strong>{b.date}</strong> at <strong>{b.start_time}</strong>?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Keep</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleCancel(b.id)} className="bg-destructive hover:bg-destructive/90 rounded-xl">Cancel Booking</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  const empty = (icon: React.ReactNode, msg: string) => (
    <motion.div 
      className="text-center py-12 space-y-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>
      <p className="text-muted-foreground text-sm">{msg}</p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <List className="h-5 w-5 text-primary" />
            </motion.div>
            My Bookings
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="secondary" className="ml-2 font-bold">{bookings.length}</Badge>
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <motion.div
                animate={{ 
                  rotate: 360,
                  opacity: [1, 0.5, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 2, repeat: Infinity }
                }}
              >
                <Zap className="h-8 w-8 text-primary mx-auto" />
              </motion.div>
              <p className="text-muted-foreground text-sm mt-2">Loading…</p>
            </div>
          ) : (
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="w-full mb-4 bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="upcoming" className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <CalendarCheck className="h-4 w-4" />Upcoming
                  {upcoming.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge variant="default" className="ml-1 h-5 px-1.5 text-[10px] bg-primary">{upcoming.length}</Badge>
                    </motion.div>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past" className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <History className="h-4 w-4" />Past Bookings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                {upcoming.length === 0
                  ? empty(<CalendarCheck className="h-6 w-6 text-muted-foreground" />, "No upcoming bookings")
                  : <motion.div 
                      className="space-y-2"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.05 },
                        },
                      }}
                    >
                      {upcoming.map((b, idx) => renderBooking(b, true, idx))}
                    </motion.div>}
              </TabsContent>
              <TabsContent value="past">
                {past.length === 0
                  ? empty(<History className="h-6 w-6 text-muted-foreground" />, "No past bookings")
                  : <motion.div 
                      className="space-y-2"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.05 },
                        },
                      }}
                    >
                      {past.map((b, idx) => renderBooking(b, false, idx))}
                    </motion.div>}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActiveBookings;
