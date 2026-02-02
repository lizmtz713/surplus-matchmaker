import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Search, FileText, Truck, MapPin, Scale, Ruler, ChevronDown, ChevronUp, Anchor, ShieldCheck, ArrowUpFromLine, Plus, FileSpreadsheet, Calendar, Clock, UserSquare2, AlertCircle, Link as LinkIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { MAX_IMAGE_SIZE_MB, SUPPORTED_IMAGE_TYPES } from '../constants.ts';

interface InputFormProps {
  onSubmit: (
    description: string, 
    condition: string,
    images: File[], 
    logistics: { 
      origin: string; 
      weight: string; 
      dimensions: string;
      truckType: string;
      requiresTarps: boolean;
      requiresChains: boolean;
      requiresLiftgate: boolean;
      pickupDate: string;
      pickupContact: string;
      loadingHours: string;
    },
    referenceUrl: string // Added referenceUrl
  ) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Unknown / Mixed');
  const [referenceUrl, setReferenceUrl] = useState(''); // New state for URL
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Logistics State
  const [showLogistics, setShowLogistics] = useState(false);
  const [origin, setOrigin] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [truckType, setTruckType] = useState('Any / Recommended');
  const [requiresTarps, setRequiresTarps] = useState(false);
  const [requiresChains, setRequiresChains] = useState(false);
  const [requiresLiftgate, setRequiresLiftgate] = useState(false);
  
  // Detailed Freight Info
  const [pickupDate, setPickupDate] = useState('');
  const [pickupContact, setPickupContact] = useState('');
  const [loadingHours, setLoadingHours] = useState('9:00am - 4:00pm');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        
        setDescription(prev => {
          const separator = prev ? '\n\n' : '';
          return `${prev}${separator}--- IMPORTED INVENTORY (${file.name}) ---\n${csv}`;
        });
      } catch (err) {
        console.error("Error parsing Excel:", err);
        alert(`Failed to parse ${file.name}. Please ensure it is a valid Excel or CSV file.`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      const validImages: File[] = [];
      const newUrls: string[] = [];
      
      const remainingSlots = 5 - selectedImages.length;
      let usedSlots = 0;

      files.forEach(file => {
        if (
          file.name.endsWith('.xlsx') || 
          file.name.endsWith('.xls') || 
          file.name.endsWith('.csv')
        ) {
          parseExcelFile(file);
          return;
        }

        if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
           if (usedSlots < remainingSlots) {
             if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
               alert(`Skipped ${file.name}: Too large (>5MB)`);
               return;
             }
             validImages.push(file);
             newUrls.push(URL.createObjectURL(file));
             usedSlots++;
           }
        }
      });

      if (files.length > remainingSlots && validImages.length === 0 && !files.some(f => f.name.endsWith('xls') || f.name.endsWith('csv') || f.name.endsWith('xlsx'))) {
         alert(`You can only add ${remainingSlots} more image(s).`);
      }

      if (validImages.length > 0) {
        setSelectedImages(prev => [...prev, ...validImages]);
        setPreviewUrls(prev => [...prev, ...newUrls]);
      }
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && selectedImages.length === 0 && !referenceUrl.trim()) {
      return;
    }
    onSubmit(description, condition, selectedImages, { 
      origin, 
      weight, 
      dimensions,
      truckType,
      requiresTarps,
      requiresChains,
      requiresLiftgate,
      pickupDate,
      pickupContact,
      loadingHours
    }, referenceUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center justify-between">
              <span>Item Description or Inventory List</span>
              <span className="text-xs text-amber-500 font-normal">Accepts Single Items, Bulk Lists, or Excel/CSV</span>
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Example Single: "2015 Nissan Forklift, 5k hours..."\nExample List: "3x Drills, 2x Jacks..."\n\nOr upload an Excel file to auto-populate this field.`}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none h-32 resize-none transition-all font-mono text-sm"
              />
              <FileText className="absolute top-3 right-3 w-5 h-5 text-slate-600 pointer-events-none" />
            </div>
          </div>
          
          {/* URL Input Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
               <LinkIcon className="w-4 h-4 text-blue-400" />
               <span>Link to Item / Auction (Optional)</span>
            </label>
            <input 
              type="url" 
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        <div className="md:col-span-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <span>Item Condition</span>
              <AlertCircle className="w-3 h-3 text-slate-500" />
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none cursor-pointer"
            >
              <option value="Unknown / Mixed">Unknown / Mixed Lot</option>
              <option value="New in Box (NIB)">New in Box (NIB)</option>
              <option value="New Surplus (No Box)">New Surplus (No Box)</option>
              <option value="Never Installed">Never Installed / Old Stock</option>
              <option value="Used (Working)">Used (Working)</option>
              <option value="Used (Unknown)">Used (Unknown Condition)</option>
              <option value="For Parts / Obsolete">For Parts / Obsolete</option>
              <option value="Scrap / Salvage">Scrap / Salvage</option>
            </select>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              *Condition heavily impacts valuation. "New in Box" commands retail premiums, while "Obsolete" may just be core value.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <span>Photos / Excel Manifest</span>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Max 5 Images + Excel</span>
        </label>
        
        <div className="mb-2">
          {previewUrls.length > 0 ? (
             <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
               {previewUrls.map((url, index) => (
                 <div key={index} className="relative rounded-lg overflow-hidden border border-slate-700 group bg-slate-950 aspect-square flex items-center justify-center">
                   <img 
                     src={url} 
                     alt={`Preview ${index + 1}`} 
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button
                       type="button"
                       onClick={() => removeImage(index)}
                       className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                       title="Remove Image"
                     >
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               ))}
               
               {previewUrls.length < 5 && (
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-slate-800 transition-all aspect-square"
                 >
                    <Plus className="w-6 h-6 text-slate-500" />
                    <span className="text-xs text-slate-500 mt-1">Add</span>
                 </div>
               )}
             </div>
          ) : (
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-slate-700/50 transition-all p-8 group"
             >
               <div className="bg-slate-700 p-3 rounded-full mb-3 group-hover:bg-slate-600 transition-colors flex gap-2">
                 <Upload className="w-6 h-6 text-slate-400 group-hover:text-amber-500" />
                 <FileSpreadsheet className="w-6 h-6 text-slate-400 group-hover:text-green-500" />
               </div>
               <p className="text-sm text-slate-300 font-medium text-center">Upload Photos or Excel Sheet</p>
               <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WebP, XLSX, CSV</p>
             </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={[...SUPPORTED_IMAGE_TYPES, '.xlsx', '.xls', '.csv'].join(',')}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>

      {/* Logistics Toggle */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowLogistics(!showLogistics)}
          className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-750 transition-colors text-sm font-medium text-slate-300"
        >
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-400" />
            <span>Logistics & Freight Details (Optional)</span>
          </div>
          {showLogistics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showLogistics && (
          <div className="p-4 bg-slate-800/50 border-t border-slate-700 space-y-4 animate-fade-in">
             
             {/* Origin Address */}
             <div>
               <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                 <MapPin className="w-3 h-3" /> Full Pickup Address
               </label>
               <input
                 type="text"
                 value={origin}
                 onChange={(e) => setOrigin(e.target.value)}
                 placeholder="e.g. 4400 Hwy 80 East, Mesquite, TX 75149"
                 className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none"
               />
             </div>
             
             {/* Contact & Hours */}
             <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <UserSquare2 className="w-3 h-3" /> Site Contact (Name & Phone)
                  </label>
                  <input
                    type="text"
                    value={pickupContact}
                    onChange={(e) => setPickupContact(e.target.value)}
                    placeholder="e.g. Steve Glaze 972-555-0199"
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none"
                  />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Loading Hours
                  </label>
                  <input
                    type="text"
                    value={loadingHours}
                    onChange={(e) => setLoadingHours(e.target.value)}
                    placeholder="e.g. M-F 9:00am - 4:00pm"
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none"
                  />
               </div>
             </div>

             {/* Date & Specs */}
             <div className="grid grid-cols-2 gap-3">
                <div>
                   <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                     <Calendar className="w-3 h-3" /> Pickup Date
                   </label>
                   <input
                     type="text"
                     value={pickupDate}
                     onChange={(e) => setPickupDate(e.target.value)}
                     placeholder="e.g. Thursday 11/15/2025"
                     className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none"
                   />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                     <Truck className="w-3 h-3" /> Truck Type
                   </label>
                   <select 
                      value={truckType}
                      onChange={(e) => setTruckType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none"
                   >
                      <option value="Any / Recommended">Any / Recommended</option>
                      <option value="Flatbed">Flatbed (Standard)</option>
                      <option value="Step Deck">Step Deck</option>
                      <option value="RGN / Lowboy">RGN / Lowboy</option>
                      <option value="Dry Van">Dry Van (Enclosed)</option>
                      <option value="Hotshot">Hotshot</option>
                      <option value="Box Truck">Box Truck (LTL)</option>
                   </select>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
               <div>
                 <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                   <Scale className="w-3 h-3" /> Weight
                 </label>
                 <input
                   type="text"
                   value={weight}
                   onChange={(e) => setWeight(e.target.value)}
                   placeholder="Blank = AI Research"
                   className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none placeholder-slate-600"
                 />
               </div>
               <div>
                 <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                   <Ruler className="w-3 h-3" /> Dimensions
                 </label>
                 <input
                   type="text"
                   value={dimensions}
                   onChange={(e) => setDimensions(e.target.value)}
                   placeholder="Blank = AI Research"
                   className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none placeholder-slate-600"
                 />
               </div>
             </div>
             
             <p className="text-[10px] text-amber-500/80 -mt-2 italic">
               *Provide detailed info for the most accurate freight quotes.
             </p>

             <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-700/50">
                <div className="flex flex-wrap gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={requiresTarps}
                        onChange={(e) => setRequiresTarps(e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="w-4 h-4 border border-slate-500 rounded bg-slate-900 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors"></div>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white flex items-center gap-1">
                       <ShieldCheck className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                       Tarps
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={requiresChains}
                        onChange={(e) => setRequiresChains(e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="w-4 h-4 border border-slate-500 rounded bg-slate-900 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors"></div>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white flex items-center gap-1">
                       <Anchor className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                       Chains
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={requiresLiftgate}
                        onChange={(e) => setRequiresLiftgate(e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="w-4 h-4 border border-slate-500 rounded bg-slate-900 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors"></div>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white flex items-center gap-1">
                       <ArrowUpFromLine className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                       Liftgate
                    </span>
                  </label>
                </div>
             </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || (!description && selectedImages.length === 0 && !referenceUrl)}
        className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
          isLoading || (!description && selectedImages.length === 0 && !referenceUrl)
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20'
        }`}
      >
        {isLoading ? (
          'Analyzing Market...'
        ) : (
          <>
            <Search className="w-5 h-5" />
            Analyze & Match Buyer
          </>
        )}
      </button>
    </form>
  );
};