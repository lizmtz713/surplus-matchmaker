import React, { useState, useMemo } from 'react';
import { Database, Plus, Pencil, Trash2, X, Save, Search, Star, ChevronDown, ChevronUp, CheckCircle2, Crown, MapPin, Phone, Mail, Globe, User, UserPlus } from 'lucide-react';
import { Buyer, BuyerMatch } from '../types';

interface BuyerDatabaseProps {
  buyers: Buyer[];
  onUpdateBuyers: (buyers: Buyer[]) => void;
  matchedBuyers?: BuyerMatch[];
}

export const BuyerDatabase: React.FC<BuyerDatabaseProps> = ({ buyers, onUpdateBuyers, matchedBuyers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBuyer, setCurrentBuyer] = useState<Partial<Buyer>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const openAddModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentBuyer({
      name: '',
      preferences: '',
      location: '',
      address: '',
      budget: '',
      condition: '',
      brand: '',
      contact: '',
      featured: false
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (buyer: Buyer) => {
    setCurrentBuyer({ ...buyer });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this buyer?')) {
      onUpdateBuyers(buyers.filter(b => b.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBuyer.name || !currentBuyer.preferences) {
      alert("Name and Preferences are required.");
      return;
    }

    if (isEditing && currentBuyer.id) {
      onUpdateBuyers(buyers.map(b => b.id === currentBuyer.id ? currentBuyer as Buyer : b));
    } else {
      const newBuyer = {
        ...currentBuyer,
        id: (Date.now()).toString().slice(-4),
        preferences: currentBuyer.preferences || 'General Industrial'
      } as Buyer;
      onUpdateBuyers([...buyers, newBuyer]);
    }
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentBuyer(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentBuyer(prev => ({ ...prev, featured: e.target.checked }));
  };

  // --- New Feature: Email Request to Join Network ---
  const handleJoinRequest = () => {
    // UPDATED EMAIL
    const adminEmail = "lizmtz713@gmail.com"; 
    
    const subject = "Application: Add Company to Surplus Buyer Network";
    const body = `Hello,

I would like to have my company listed in your permanent Buyer Database.

--- COMPANY DETAILS ---
Company Name: 
Location (City, State): 
Full Address (Optional): 
Website: 

--- BUYING PREFERENCES ---
What do you buy? (e.g. Generators, Scrap Metal, CNC Machines): 
Specific Brands/Conditions: 

--- CONTACT INFO ---
Contact Name: 
Phone: 
Email: 

--- MEMBERSHIP TIER ---
[ ] Standard Listing (Free)
[ ] I am interested in "Highlighted / Exclusive" status for priority deal flow.

-----------------------
Please review and add us to the network.`;

    const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  // --- Intelligent Sorting & Matching Logic ---
  
  // 1. Enrich buyers with match data if available
  const enrichedBuyers = useMemo(() => {
    const matchesAvailable = matchedBuyers && matchedBuyers.length > 0;
    
    return buyers.map(b => {
      // Fuzzy match name from the AI Result if available
      const match = matchesAvailable ? matchedBuyers.find(m => 
        m.name.toLowerCase().includes(b.name.toLowerCase()) || 
        b.name.toLowerCase().includes(m.name.toLowerCase())
      ) : undefined;

      return {
        ...b,
        matchScore: match ? match.score : 0,
        isMatch: !!match,
        matchReason: match?.reason,
        matchData: match // Store full match data for display
      };
    }).sort((a, b) => {
      // Logic: Matches > Featured > Rest
      
      // 1. Matches always on top (if they exist)
      if (a.isMatch && !b.isMatch) return -1;
      if (!a.isMatch && b.isMatch) return 1;
      
      // 2. If both matched, sort by score
      if (a.isMatch && b.isMatch) return b.matchScore - a.matchScore;

      // 3. If neither matched, sort by Featured status
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // 4. Alphabetical fallback
      return a.name.localeCompare(b.name);
    });
  }, [buyers, matchedBuyers]);

  // 2. Filter based on Search
  const filteredBuyers = enrichedBuyers.filter(buyer => 
    buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    buyer.preferences.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (buyer.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (buyer.address || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Determine View List (Top 5 vs All)
  // If searching, show all matches. If not, show Top 5 (which will be matches if they exist) unless "Show All" is clicked.
  const displayList = searchQuery 
    ? filteredBuyers 
    : showAll 
      ? enrichedBuyers 
      : enrichedBuyers.slice(0, 5);

  const hasActiveMatches = matchedBuyers && matchedBuyers.length > 0;

  return (
    <>
      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="bg-slate-900/50 p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-500">
               <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200 text-sm">Buyer Network</h3>
              <p className="text-xs text-slate-500">{buyers.length} Total Connections</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
                onClick={handleJoinRequest}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors flex items-center gap-2 px-3 text-xs font-medium border border-slate-600"
                title="Request to be added to the permanent list via Email"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Join List</span>
            </button>
            <button 
                onClick={openAddModal}
                className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-md transition-colors"
                title="Add New Buyer (Local Session)"
              >
                <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          
          {/* Search Bar (Sticky Top) */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search companies, locations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
          </div>

          {/* Dynamic Header Status */}
          {!searchQuery && (
            <div className="flex items-center justify-between pt-2">
               <div className="text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                 {hasActiveMatches ? (
                    <>
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 
                      <span className="text-amber-500">Top Network Matches</span>
                    </>
                 ) : (
                    <>
                      <Crown className="w-3 h-3 text-amber-500" />
                      <span className="text-slate-400">Premium Buyer Network</span>
                    </>
                 )}
               </div>
            </div>
          )}

          {/* List */}
          <div className={`space-y-3 ${searchQuery ? 'max-h-[600px] overflow-y-auto custom-scrollbar' : ''}`}>
            {displayList.map((buyer) => {
              // Extract best available data
              // Prioritize: Match Address -> Static Address -> Location
              const displayAddress = buyer.matchData?.address || buyer.address || buyer.location || "Location not listed";
              const displayPhone = buyer.matchData?.phone; // Only from match
              const displayEmail = buyer.matchData?.email; // Only from match
              const displayWebsite = buyer.matchData?.website; // Only from match
              const rawContact = buyer.contact; // Fallback string from database

              return (
                <div 
                  key={buyer.id} 
                  className={`p-4 rounded-lg group relative transition-all border flex flex-col gap-2 ${
                    buyer.isMatch 
                      ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 shadow-sm shadow-amber-500/10' 
                      : buyer.featured 
                        ? 'bg-slate-800 border-slate-600/50 hover:bg-slate-750' 
                        : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
                  }`}
                >
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(buyer)}
                        className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-white"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(buyer.id, e)}
                        className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Header: Name & ID */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            {/* Icon Logic */}
                            {buyer.featured && !buyer.isMatch ? (
                               <div className="w-6 h-6 rounded flex items-center justify-center bg-amber-500/20 text-amber-500 shrink-0">
                                  <Crown className="w-3.5 h-3.5" />
                               </div>
                            ) : (
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                    buyer.isMatch ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-400'
                                }`}>
                                  {buyer.id.substring(0,2)}
                                </div>
                            )}
                            
                            <span className={`font-bold text-sm truncate pr-2 ${buyer.isMatch || buyer.featured ? 'text-white' : 'text-slate-200'}`}>
                                {buyer.name}
                            </span>
                        </div>
                        {buyer.isMatch && (
                            <div className="flex items-center gap-1 bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {buyer.matchScore}% <CheckCircle2 className="w-3 h-3" />
                            </div>
                        )}
                    </div>

                    {/* Address Line */}
                    <div className="flex items-start gap-1.5 text-xs text-slate-400 pl-8 -mt-1">
                      <MapPin className="w-3 h-3 mt-0.5 text-slate-500 shrink-0" />
                      <span>{displayAddress}</span>
                    </div>

                    {/* Description / Buying Preferences */}
                    <div className="pl-8 text-xs text-slate-300">
                       <span className="text-slate-500 font-medium text-[10px] uppercase tracking-wide block mb-0.5">Focus & Preferences</span>
                       <span className="italic opacity-90">{buyer.preferences}</span>
                    </div>
                    
                    {/* Match Reason (if match) */}
                    {buyer.isMatch && buyer.matchReason && (
                        <div className="pl-8 mt-1 text-[10px] text-amber-200/70 italic border-l-2 border-amber-500/30 pl-2">
                           "{buyer.matchReason}"
                        </div>
                    )}

                    {/* Contact Details Grid */}
                    <div className="pl-8 pt-3 mt-1 border-t border-slate-700/50 flex flex-col gap-1.5 text-xs">
                        {/* Dynamic Contact Display */}
                        {buyer.isMatch ? (
                            // Matched Buyer: Show Enriched Data Fields
                            <div className="space-y-1.5">
                                {displayPhone && (
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Phone className="w-3 h-3 text-slate-500" /> 
                                        <span className="hover:text-white select-all">{displayPhone}</span>
                                    </div>
                                )}
                                {displayEmail && (
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Mail className="w-3 h-3 text-slate-500" /> 
                                        <span className="hover:text-white select-all">{displayEmail}</span>
                                    </div>
                                )}
                                {displayWebsite && (
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Globe className="w-3 h-3 text-slate-500" /> 
                                        <a href={displayWebsite} target="_blank" rel="noreferrer" className="hover:text-blue-400 truncate">
                                           {displayWebsite.replace(/^https?:\/\/(www\.)?/, '')}
                                        </a>
                                    </div>
                                )}
                                {/* Fallback if structured data missing but raw contact exists */}
                                {(!displayPhone && !displayEmail && rawContact) && (
                                   <div className="flex items-start gap-2 text-slate-400 mt-1">
                                      <User className="w-3 h-3 text-slate-500 mt-0.5" />
                                      <span className="select-all">{rawContact}</span>
                                   </div>
                                )}
                            </div>
                        ) : (
                            // Standard/Featured Buyer: Show Raw Contact Data
                            <div className="space-y-1.5">
                               {rawContact ? (
                                   <div className="flex items-start gap-2 text-slate-400">
                                      <User className="w-3 h-3 text-slate-500 mt-0.5" />
                                      <span className="select-all leading-snug">{rawContact}</span>
                                   </div>
                               ) : (
                                   <span className="text-slate-600 italic text-[10px]">No direct contact info listed</span>
                               )}
                            </div>
                        )}
                    </div>
                </div>
              );
            })}
            
            {displayList.length === 0 && (
               <div className="text-center text-slate-500 text-xs py-4">
                 {searchQuery ? 'No buyers found matching search.' : 'Database empty.'}
               </div>
            )}
          </div>

          {/* Toggle Button */}
          {!searchQuery && (
             <button 
               onClick={() => setShowAll(!showAll)}
               className="w-full mt-2 py-2 text-xs text-slate-500 hover:text-slate-300 border border-dashed border-slate-700 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
             >
               {showAll ? (
                  <>Show Less <ChevronUp className="w-3 h-3" /></>
               ) : (
                  <>View All {buyers.length} Buyers <ChevronDown className="w-3 h-3" /></>
               )}
             </button>
          )}

        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 rounded-t-xl">
               <h3 className="font-bold text-white text-lg flex items-center gap-2">
                 {isEditing ? <Pencil className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-green-500" />}
                 {isEditing ? 'Edit Buyer Profile' : 'Add New Buyer'}
               </h3>
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Company / Buyer Name *</label>
                 <input 
                   type="text" 
                   name="name"
                   value={currentBuyer.name || ''} 
                   onChange={handleChange}
                   placeholder="e.g. MegaCorp Export"
                   className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                   required
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Buying Preferences *</label>
                 <textarea 
                   name="preferences"
                   value={currentBuyer.preferences || ''} 
                   onChange={handleChange}
                   placeholder="What do they buy? (e.g. Heavy Construction, Scrap Metals)"
                   className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-24 resize-none"
                   required
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Contact Details</label>
                 <input 
                   type="text" 
                   name="contact"
                   value={currentBuyer.contact || ''} 
                   onChange={handleChange}
                   placeholder="Phone, Email, Full Address"
                   className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Location (City, State)</label>
                   <input 
                     type="text" 
                     name="location"
                     value={currentBuyer.location || ''} 
                     onChange={handleChange}
                     placeholder="e.g. Texas, Global"
                     className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Full Address</label>
                   <input 
                     type="text" 
                     name="address"
                     value={currentBuyer.address || ''} 
                     onChange={handleChange}
                     placeholder="Street Address"
                     className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                   />
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Budget Range</label>
                   <input 
                     type="text" 
                     name="budget"
                     value={currentBuyer.budget || ''} 
                     onChange={handleChange}
                     placeholder="e.g. <$5k, High"
                     className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Specific Brands</label>
                   <input 
                     type="text" 
                     name="brand"
                     value={currentBuyer.brand || ''} 
                     onChange={handleChange}
                     placeholder="e.g. Toyota, Cat"
                     className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                   />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Condition</label>
                   <input 
                     type="text" 
                     name="condition"
                     value={currentBuyer.condition || ''} 
                     onChange={handleChange}
                     placeholder="e.g. Scrap, New"
                     className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                   />
                 </div>
               </div>

               <div className="flex items-center gap-2 pt-2 pb-2">
                 <input 
                    type="checkbox" 
                    id="featured"
                    name="featured"
                    checked={currentBuyer.featured || false}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
                 />
                 <label htmlFor="featured" className="text-sm text-slate-300 select-none cursor-pointer">
                    Mark as Premium / Featured Buyer (Top of List)
                 </label>
               </div>

               <div className="pt-4 flex gap-3">
                 <button 
                   type="button" 
                   onClick={() => setIsModalOpen(false)}
                   className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                 >
                   <Save className="w-4 h-4" />
                   Save Buyer
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};