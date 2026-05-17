import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useBooking } from "@/contexts/BookingContext";
import { Station } from "@/types";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface StationSearchProps {
  onResults: (stations: Station[] | undefined) => void;
}

const StationSearch: React.FC<StationSearchProps> = ({ onResults }) => {
  const { searchStations, stations, chargers } = useBooking();
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const handleSearch = (value: string, filterAvailableOnly: boolean) => {
    setQuery(value);
    if (!value.trim() && !filterAvailableOnly) {
      onResults(undefined);
      return;
    }
    let results = value.trim() ? searchStations(value) : [...stations];
    if (filterAvailableOnly) {
      results = results.filter((s) => {
        const sChargers = chargers.filter((c) => c.station_id === s.id && c.status !== "maintenance");
        return sChargers.some((c) => c.status === "available");
      });
    }
    onResults(results);
  };

  const handleClear = () => { setQuery(""); setAvailableOnly(false); onResults(undefined); };

  return (
    <motion.div 
      className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="relative flex-1 w-full"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </motion.div>
        <Input
          id="station-search-input"
          placeholder="Search stations by name or city..."
          value={query}
          onChange={(e) => handleSearch(e.target.value, availableOnly)}
          className="pl-10 pr-10 h-11 rounded-xl bg-card border-border focus-visible:ring-primary/30"
        />
        {query && (
          <motion.button 
            onClick={handleClear} 
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </motion.button>
        )}
      </motion.div>
      
      <motion.div 
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-card border border-border"
        whileHover={{ scale: 1.02, borderColor: "hsl(var(--primary))" }}
        transition={{ duration: 0.2 }}
      >
        <Switch
          id="available-filter"
          checked={availableOnly}
          onCheckedChange={(checked) => { setAvailableOnly(checked); handleSearch(query, checked); }}
        />
        <motion.label 
          htmlFor="available-filter" 
          className="text-sm cursor-pointer whitespace-nowrap select-none"
          whileHover={{ color: "hsl(var(--primary))" }}
        >
          Available only
        </motion.label>
      </motion.div>
    </motion.div>
  );
};

export default StationSearch;
