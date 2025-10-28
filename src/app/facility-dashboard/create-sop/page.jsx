// "use client"

// import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
// import { Plus, Trash2, Clock, Image, ChevronDown, ChevronRight, X, Camera, Minus } from 'lucide-react';

// const ImageAttachmentModal = ({ 
//   onClose, 
//   onSave, 
//   initialTitle = '', 
//   initialDescription = '', 
//   initialPhotos = [] 
// }) => {
//   const [title, setTitle] = useState(initialTitle);
//   const [description, setDescription] = useState(initialDescription);
//   const [photos, setPhotos] = useState(initialPhotos);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const uploadImageToCloudinary = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     try {
//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData
//       });
      
//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Upload error:', error);
//       throw error;
//     }
//   };

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     setIsUploading(true);
    
//     try {
//       const uploadPromises = files.map(async (file) => {
//         const tempPhoto = {
//           file,
//           name: file.name,
//           size: file.size,
//           url: URL.createObjectURL(file),
//           public_id: null,
//           isUploading: true
//         };
        
//         setPhotos(prev => [...prev, tempPhoto]);
        
//         const cloudinaryResult = await uploadImageToCloudinary(file);
//         return {
//           file,
//           name: file.name,
//           size: file.size,
//           url: cloudinaryResult.url,
//           public_id: cloudinaryResult.public_id,
//           isUploading: false
//         };
//       });

//       const newPhotos = await Promise.all(uploadPromises);
//       setPhotos(prev => [
//         ...prev.filter(p => !p.isUploading),
//         ...newPhotos
//       ]);
//     } catch (error) {
//       alert('Error uploading images. Please try again.');
//       setPhotos(prev => prev.filter(p => !p.isUploading));
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const removePhoto = (index) => {
//     const photoToRemove = photos[index];
//     if (photoToRemove.url && photoToRemove.url.startsWith('blob:')) {
//       URL.revokeObjectURL(photoToRemove.url);
//     }
//     setPhotos(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSave = () => {
//     if (photos.length === 0) {
//       alert('Please add at least one photo');
//       return;
//     }
    
//     const uploadedPhotos = photos.filter(photo => photo.public_id);
    
//     onSave({
//       title,
//       description,
//       photos: uploadedPhotos
//     });
//     onClose();
//   };

//   useEffect(() => {
//     return () => {
//       photos.forEach(photo => {
//         if (photo.url && photo.url.startsWith('blob:')) {
//           URL.revokeObjectURL(photo.url);
//         }
//       });
//     };
//   }, [photos]);

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 pb-20">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//         <div className="p-4 border-b flex justify-between items-center">
//           <h2 className="text-lg font-semibold text-gray-900">Attach Photos</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
//             disabled={isUploading}
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-4 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Photo title"
//               disabled={isUploading}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={2}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Photo description"
//               disabled={isUploading}
//             />
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <label className="block text-sm font-medium text-gray-700">Photos</label>
//               <button
//                 onClick={() => fileInputRef.current.click()}
//                 className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
//                 disabled={isUploading}
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Photos
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept="image/*"
//                 multiple
//                 className="hidden"
//                 disabled={isUploading}
//               />
//             </div>

//             {photos.length > 0 ? (
//               <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
//                 {photos.map((photo, index) => (
//                   <div key={index} className="relative group">
//                     <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
//                       <img
//                         src={photo.url}
//                         alt={`Preview ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                       {photo.isUploading && (
//                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         </div>
//                       )}
//                     </div>
//                     <button
//                       onClick={() => removePhoto(index)}
//                       className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
//                 <Camera className="w-6 h-6 mx-auto text-gray-400 mb-1" />
//                 <p className="text-xs text-gray-500">No photos selected</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="border-t p-4 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             disabled={isUploading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             disabled={isUploading || photos.length === 0 || photos.every(p => !p.public_id)}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DurationModal = ({ onClose, onSave, initialMin = { hours: 0, minutes: 10, seconds: 0 }, initialMax = { hours: 0, minutes: 30, seconds: 0 } }) => {
//   const [minTime, setMinTime] = useState(initialMin);
//   const [maxTime, setMaxTime] = useState(initialMax);

//   const adjustTime = (type, field, increment) => {
//     const setter = type === 'min' ? setMinTime : setMaxTime;
//     const current = type === 'min' ? minTime : maxTime;

//     setter(prev => {
//       let newValue = prev[field] + increment;

//       if (field === 'minutes' || field === 'seconds') {
//         if (newValue >= 60) newValue = 0;
//         else if (newValue < 0) newValue = 59;
//       } else if (field === 'hours' && newValue < 0) {
//         newValue = 0;
//       }

//       return { ...prev, [field]: newValue };
//     });
//   };

//   const handleSave = () => {
//     const minTotalMinutes = minTime.hours * 60 + minTime.minutes + Math.round(minTime.seconds / 60);
//     const maxTotalMinutes = maxTime.hours * 60 + maxTime.minutes + Math.round(maxTime.seconds / 60);
    
//     onSave({
//       minDuration: minTotalMinutes,
//       maxDuration: maxTotalMinutes,
//       minTime,
//       maxTime
//     });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 pb-20">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
//         <div className="p-4 border-b flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <Clock className="w-5 h-5 text-blue-600" />
//             <h2 className="text-lg font-semibold text-gray-900">Set Duration</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-4 space-y-4">
//           <div className="space-y-3">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
//               <h3 className="text-sm font-medium text-gray-700">Minimum Duration</h3>
//             </div>

//             <div className="flex justify-center gap-3">
//               {['hours', 'minutes', 'seconds'].map((field) => (
//                 <div key={field} className="flex flex-col items-center">
//                   <div className="relative">
//                     <button
//                       onClick={() => adjustTime('min', field, 1)}
//                       className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow hover:bg-emerald-600 active:scale-95"
//                     >
//                       <Plus className="w-2.5 h-2.5" />
//                     </button>

//                     <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
//                       <span className="text-lg font-medium text-gray-800">
//                         {String(minTime[field]).padStart(2, '0')}
//                       </span>
//                     </div>

//                     <button
//                       onClick={() => adjustTime('min', field, -1)}
//                       className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow hover:bg-emerald-600 active:scale-95"
//                     >
//                       <Minus className="w-2.5 h-2.5" />
//                     </button>
//                   </div>
//                   <span className="text-xs font-medium text-gray-500 mt-1 uppercase">
//                     {field.slice(0, 3)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-200"></div>
//             </div>
//             <div className="relative flex justify-center">
//               <span className="px-2 bg-white text-xs text-gray-500">to</span>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//               <h3 className="text-sm font-medium text-gray-700">Maximum Duration</h3>
//             </div>

//             <div className="flex justify-center gap-3">
//               {['hours', 'minutes', 'seconds'].map((field) => (
//                 <div key={field} className="flex flex-col items-center">
//                   <div className="relative">
//                     <button
//                       onClick={() => adjustTime('max', field, 1)}
//                       className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow hover:bg-blue-600 active:scale-95"
//                     >
//                       <Plus className="w-2.5 h-2.5" />
//                     </button>

//                     <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
//                       <span className="text-lg font-medium text-gray-800">
//                         {String(maxTime[field]).padStart(2, '0')}
//                       </span>
//                     </div>

//                     <button
//                       onClick={() => adjustTime('max', field, -1)}
//                       className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow hover:bg-blue-600 active:scale-95"
//                     >
//                       <Minus className="w-2.5 h-2.5" />
//                     </button>
//                   </div>
//                   <span className="text-xs font-medium text-gray-500 mt-1 uppercase">
//                     {field.slice(0, 3)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="border-t p-4 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TaskComponent = React.memo(({
//   task,
//   stageId,
//   level = 0,
//   parentPath = [],
//   onUpdateTask,
//   onAddSubtask,
//   onDeleteTask,
//   onToggleExpansion,
//   expandedItems
// }) => {
//   const hasSubtasks = task.subtasks && task.subtasks.length > 0;
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [showDurationModal, setShowDurationModal] = useState(false);
//   const [modalKey, setModalKey] = useState(0);

//   const depthStyles = useMemo(() => {
//     const colors = ['border-indigo-200', 'border-blue-200', 'border-emerald-200', 'border-purple-200', 'border-rose-200', 'border-amber-200'];
//     const bgColors = ['bg-white', 'bg-blue-50', 'bg-emerald-50', 'bg-purple-50', 'bg-rose-50', 'bg-amber-50'];
//     return {
//       border: colors[level % colors.length],
//       bg: bgColors[level % bgColors.length],
//     };
//   }, [level]);

//   const handleChange = (field, value) => {
//     onUpdateTask(stageId, task.id, field, value, parentPath);
//   };

//   const handleImageSave = (imageData) => {
//     onUpdateTask(stageId, task.id, 'attachedImages', imageData.photos, parentPath);
//     onUpdateTask(stageId, task.id, 'imageTitle', imageData.title, parentPath);
//     onUpdateTask(stageId, task.id, 'imageDescription', imageData.description, parentPath);
//   };

//   const handleDurationSave = (duration) => {
//     onUpdateTask(stageId, task.id, 'minDuration', duration.minDuration, parentPath);
//     onUpdateTask(stageId, task.id, 'maxDuration', duration.maxDuration, parentPath);
//     onUpdateTask(stageId, task.id, 'minTime', duration.minTime, parentPath);
//     onUpdateTask(stageId, task.id, 'maxTime', duration.maxTime, parentPath);
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes) return 'Not set';
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   };

//   const formatDetailedDuration = (timeObj) => {
//     if (!timeObj) return '';
//     const parts = [];
//     if (timeObj.hours > 0) parts.push(`${timeObj.hours}h`);
//     if (timeObj.minutes > 0) parts.push(`${timeObj.minutes}m`);
//     if (timeObj.seconds > 0) parts.push(`${timeObj.seconds}s`);
//     return parts.join(' ') || '0m';
//   };

//   const handleOpenImageModal = () => {
//     setModalKey(prev => prev + 1);
//     setShowImageModal(true);
//   };

//   const isExpanded = expandedItems[task.id] || false;

//   return (
//     <div
//       className={`border-2 ${depthStyles.border} ${depthStyles.bg} rounded-2xl p-4 sm:p-6 mb-4 shadow-md hover:shadow-lg transition-all duration-300`}
//       style={{
//         marginLeft: level > 0 ? `${level * 20}px` : '0',
//       }}
//     >
//       {showImageModal && (
//         <ImageAttachmentModal
//           key={modalKey}
//           onClose={() => setShowImageModal(false)}
//           onSave={handleImageSave}
//           initialTitle={task.imageTitle || ''}
//           initialDescription={task.imageDescription || ''}
//           initialPhotos={task.attachedImages || []}
//         />
//       )}

//       {showDurationModal && (
//         <DurationModal
//           onClose={() => setShowDurationModal(false)}
//           onSave={handleDurationSave}
//           initialMin={task.minTime || { hours: 0, minutes: 10, seconds: 0 }}
//           initialMax={task.maxTime || { hours: 0, minutes: 30, seconds: 0 }}
//         />
//       )}

//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           {hasSubtasks && (
//             <button onClick={() => onToggleExpansion(task.id)} className="text-gray-600 hover:text-gray-800 transition-colors">
//               {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
//             </button>
//           )}
//           <span className="font-semibold text-gray-900 text-base sm:text-lg tracking-tight">
//             {level === 0 ? 'Task' : `Subtask (Level ${level})`}
//           </span>
//         </div>
//         <button onClick={() => onDeleteTask(stageId, task.id, parentPath)} className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
//           <Trash2 size={18} />
//         </button>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-semibold text-gray-800 mb-2">Title</label>
//           <input
//             type="text"
//             value={task.title}
//             onChange={(e) => handleChange('title', e.target.value)}
//             className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
//             placeholder="Enter task title"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
//           <textarea
//             value={task.description}
//             onChange={(e) => handleChange('description', e.target.value)}
//             rows={3}
//             className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
//             placeholder="Enter task description"
//           />
//         </div>

//         {(task.minDuration || task.maxDuration) && (
//           <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
//             <div className="flex items-center gap-3 text-sm text-gray-700">
//               <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
//               <span className="font-semibold">Duration:</span>
//               <span className="font-medium">
//                 {task.minTime ? formatDetailedDuration(task.minTime) : formatDuration(task.minDuration)} 
//                 {' → '}
//                 {task.maxTime ? formatDetailedDuration(task.maxTime) : formatDuration(task.maxDuration)}
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => onAddSubtask(stageId, task.id, parentPath)}
//             className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
//           >
//             <Plus size={14} />
//             Create Subtask {level > 0 ? `(Level ${level + 1})` : ''}
//           </button>

//           <button
//             onClick={() => setShowDurationModal(true)}
//             className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
//           >
//             <Clock size={14} />
//             Set Duration
//           </button>

//           <button
//             onClick={handleOpenImageModal}
//             className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
//           >
//             <Image size={14} />
//             Attach Images
//           </button>
//         </div>

//         {task.attachedImages && task.attachedImages.length > 0 && (
//           <div className="mt-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {task.attachedImages.map((image, index) => (
//                 <div key={index} className="relative group">
//                   <img
//                     src={image.url}
//                     alt={`Attached ${index + 1}`}
//                     className="w-full h-32 sm:h-40 object-cover rounded-xl border border-gray-200 shadow-sm transition-transform duration-300 group-hover:scale-105"
//                   />
//                   {image.name && <p className="text-sm font-medium text-gray-800 mt-2 truncate">{image.name}</p>}
//                   {image.description && <p className="text-xs sm:text-sm text-gray-600">{image.description}</p>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {hasSubtasks && isExpanded && (
//         <div className="mt-4 sm:mt-6 space-y-4">
//           {task.subtasks.map(subtask => (
//             <TaskComponent
//               key={subtask.id}
//               task={subtask}
//               stageId={stageId}
//               level={level + 1}
//               parentPath={[...parentPath, task.id]}
//               onUpdateTask={onUpdateTask}
//               onAddSubtask={onAddSubtask}
//               onDeleteTask={onDeleteTask}
//               onToggleExpansion={onToggleExpansion}
//               expandedItems={expandedItems}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }, (prevProps, nextProps) => {
//   return (
//     prevProps.task === nextProps.task &&
//     prevProps.expandedItems === nextProps.expandedItems
//   );
// });

// TaskComponent.displayName = 'TaskComponent';

// const PrototypeManagementPage = () => {
//   const [prototypeName, setPrototypeName] = useState('');
//   const [stages, setStages] = useState([]);
//   const [expandedItems, setExpandedItems] = useState({});

//   const addStage = useCallback(() => {
//     const newStage = {
//       id: Date.now(),
//       name: `Stage ${stages.length + 1}`,
//       tasks: []
//     };
//     setStages(prev => [...prev, newStage]);
//   }, [stages.length]);

//   const updateStageName = useCallback((stageId, newName) => {
//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, name: newName }
//         : stage
//     ));
//   }, []);

//   const addTask = useCallback((stageId) => {
//     const newTask = {
//       id: Date.now(),
//       title: '',
//       description: '',
//       minDuration: '',
//       maxDuration: '',
//       minTime: { hours: 0, minutes: 10, seconds: 0 },
//       maxTime: { hours: 0, minutes: 30, seconds: 0 },
//       attachedImages: [],
//       imageTitle: '',
//       imageDescription: '',
//       imagePublicId: null,
//       subtasks: []
//     };
//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: [...stage.tasks, newTask] }
//         : stage
//     ));
//   }, []);

//   const addSubtask = useCallback((stageId, taskId, parentPath = []) => {
//     const newSubtask = {
//       id: Date.now(),
//       title: '',
//       description: '',
//       minDuration: '',
//       maxDuration: '',
//       minTime: { hours: 0, minutes: 10, seconds: 0 },
//       maxTime: { hours: 0, minutes: 30, seconds: 0 },
//       attachedImages: [],
//       imageTitle: '',
//       imageDescription: '',
//       imagePublicId: null,
//       subtasks: []
//     };

//     const updateTasks = (tasks) => {
//       return tasks.map(task => {
//         if (parentPath.length === 0 && task.id === taskId) {
//           return { ...task, subtasks: [...task.subtasks, newSubtask] };
//         }

//         if (parentPath.length > 0 && task.id === parentPath[0]) {
//           return {
//             ...task,
//             subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId)
//           };
//         }
//         return task;
//       });
//     };

//     const updateSubtasks = (subtasks, remainingPath, targetId = taskId) => {
//       if (remainingPath.length === 0) {
//         return subtasks.map(subtask =>
//           subtask.id === targetId
//             ? { ...subtask, subtasks: [...subtask.subtasks, newSubtask] }
//             : subtask
//         );
//       }

//       return subtasks.map(subtask => {
//         if (subtask.id === remainingPath[0]) {
//           return {
//             ...subtask,
//             subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId)
//           };
//         }
//         return subtask;
//       });
//     };

//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: updateTasks(stage.tasks) }
//         : stage
//     ));
//   }, []);

//   const updateTaskField = useCallback((stageId, taskId, field, value, parentPath = []) => {
//     const updateTasks = (tasks) => {
//       return tasks.map(task => {
//         if (parentPath.length === 0 && task.id === taskId) {
//           return { ...task, [field]: value };
//         }

//         if (parentPath.length > 0 && task.id === parentPath[0]) {
//           return {
//             ...task,
//             subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId, field, value)
//           };
//         }
//         return task;
//       });
//     };

//     const updateSubtasks = (subtasks, remainingPath, targetId = taskId, fieldToUpdate = field, newValue = value) => {
//       if (remainingPath.length === 0) {
//         return subtasks.map(subtask =>
//           subtask.id === targetId
//             ? { ...subtask, [fieldToUpdate]: newValue }
//             : subtask
//         );
//       }

//       return subtasks.map(subtask => {
//         if (subtask.id === remainingPath[0]) {
//           return {
//             ...subtask,
//             subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId, fieldToUpdate, newValue)
//           };
//         }
//         return subtask;
//       });
//     };

//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: updateTasks(stage.tasks) }
//         : stage
//     ));
//   }, []);

//   const deleteTask = useCallback((stageId, taskId, parentPath = []) => {
//     const updateTasks = (tasks) => {
//       if (parentPath.length === 0) {
//         return tasks.filter(task => task.id !== taskId);
//       }

//       return tasks.map(task => {
//         if (task.id === parentPath[0]) {
//           return {
//             ...task,
//             subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId)
//           };
//         }
//         return task;
//       });
//     };

//     const updateSubtasks = (subtasks, remainingPath, targetId) => {
//       if (remainingPath.length === 0) {
//         return subtasks.filter(subtask => subtask.id !== targetId);
//       }

//       return subtasks.map(subtask => {
//         if (subtask.id === remainingPath[0]) {
//           return {
//             ...subtask,
//             subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId)
//           };
//         }
//         return subtask;
//       });
//     };

//     setStages(prev => prev.map(stage =>
//       stage.id === stageId
//         ? { ...stage, tasks: updateTasks(stage.tasks) }
//         : stage
//     ));
//   }, []);

//   const deleteStage = useCallback((stageId) => {
//     setStages(prev => prev.filter(stage => stage.id !== stageId));
//   }, []);

//   const toggleExpansion = useCallback((id) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   }, []);

//   const handleSavePrototype = () => {
//     console.group("📝 Prototype Data Submitted");
//     console.log("Prototype Name:", prototypeName);
    
//     const stagesToSave = JSON.parse(JSON.stringify(stages, (key, value) => {
//       if (key === 'file') return undefined;
//       if (key === 'url' && value && value.startsWith('blob:')) return undefined;
//       return value;
//     }));
    
//     console.log("Stages:", stagesToSave);
//     console.groupEnd();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
//       <div className="max-w-full sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto">
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 tracking-tight">Prototype Management</h1>

//         <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 transition-all duration-300 hover:shadow-xl">
//           <div className="w-full">
//             <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-tight">Prototype Name</label>

//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
//               <input
//                 type="text"
//                 value={prototypeName}
//                 onChange={(e) => setPrototypeName(e.target.value)}
//                 className="w-full sm:flex-1 p-3 sm:p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300 text-gray-900"
//                 placeholder="Enter prototype name"
//               />

//               <button
//                 onClick={handleSavePrototype}
//                 className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
//               >
//                 Save Prototype
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
//           <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight mb-4 sm:mb-0">Stages</h2>
//             <button
//               onClick={addStage}
//               className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto"
//             >
//               <Plus size={20} />
//               Create Stage
//             </button>
//           </div>

//           <div className="space-y-6 sm:space-y-8">
//             {stages.map((stage) => (
//               <div key={stage.id} className="border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300">
//                 <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-4">
//                   <input
//                     type="text"
//                     value={stage.name}
//                     onChange={(e) => updateStageName(stage.id, e.target.value)}
//                     className="w-full sm:w-1/2 text-lg sm:text-xl font-semibold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
//                     placeholder="Stage name"
//                   />
//                   <div className="flex items-center gap-3 sm:gap-4">
//                     <button
//                       onClick={() => addTask(stage.id)}
//                       className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95"
//                     >
//                       <Plus size={18} />
//                       Add Task
//                     </button>
//                     <button
//                       onClick={() => deleteStage(stage.id)}
//                       className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
//                     >
//                       <Trash2 size={20} />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-4 sm:space-y-6">
//                   {stage.tasks.map((task) => (
//                     <TaskComponent
//                       key={task.id}
//                       task={task}
//                       stageId={stage.id}
//                       level={0}
//                       parentPath={[]}
//                       onUpdateTask={updateTaskField}
//                       onAddSubtask={addSubtask}
//                       onDeleteTask={deleteTask}
//                       onToggleExpansion={toggleExpansion}
//                       expandedItems={expandedItems}
//                     />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {stages.length === 0 && (
//             <div className="text-center py-12 sm:py-16 text-gray-500">
//               <p className="text-base sm:text-lg font-medium">No stages created yet. Click "Create Stage" to get started.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrototypeManagementPage;


"use client"

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, Clock, Image, ChevronDown, ChevronRight, X, Camera, Minus, ArrowBigLeftDash, ArrowBigLeft } from 'lucide-react';
import { ArrowLeft } from 'react-feather';
import Link from 'next/link';

// ... (keep all the previous component code for ImageAttachmentModal and DurationModal exactly the same)
const ImageAttachmentModal = ({ 
  onClose, 
  onSave, 
  initialTitle = '', 
  initialDescription = '', 
  initialPhotos = [] 
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [photos, setPhotos] = useState(initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const tempPhoto = {
          file,
          name: file.name,
          size: file.size,
          url: URL.createObjectURL(file),
          public_id: null,
          isUploading: true
        };
        
        setPhotos(prev => [...prev, tempPhoto]);
        
        const cloudinaryResult = await uploadImageToCloudinary(file);
        return {
          file,
          name: file.name,
          size: file.size,
          url: cloudinaryResult.url,
          public_id: cloudinaryResult.public_id,
          isUploading: false
        };
      });

      const newPhotos = await Promise.all(uploadPromises);
      setPhotos(prev => [
        ...prev.filter(p => !p.isUploading),
        ...newPhotos
      ]);
    } catch (error) {
      alert('Error uploading images. Please try again.');
      setPhotos(prev => prev.filter(p => !p.isUploading));
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index) => {
    const photoToRemove = photos[index];
    if (photoToRemove.url && photoToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (photos.length === 0) {
      alert('Please add at least one photo');
      return;
    }
    
    const uploadedPhotos = photos.filter(photo => photo.public_id);
    
    onSave({
      title,
      description,
      photos: uploadedPhotos
    });
    onClose();
  };

  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.url && photo.url.startsWith('blob:')) {
          URL.revokeObjectURL(photo.url);
        }
      });
    };
  }, [photos]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 pb-20">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Attach Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Photo title"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Photo description"
              disabled={isUploading}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Photos</label>
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                disabled={isUploading}
              >
                <Plus className="w-4 h-4" />
                Add Photos
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
                disabled={isUploading}
              />
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={photo.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {photo.isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                <Camera className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">No photos selected</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isUploading || photos.length === 0 || photos.every(p => !p.public_id)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const DurationModal = ({ onClose, onSave, initialMin = { hours: 0, minutes: 10, seconds: 0 }, initialMax = { hours: 0, minutes: 30, seconds: 0 } }) => {
  const [minTime, setMinTime] = useState(initialMin);
  const [maxTime, setMaxTime] = useState(initialMax);

  const adjustTime = (type, field, increment) => {
    const setter = type === 'min' ? setMinTime : setMaxTime;
    const current = type === 'min' ? minTime : maxTime;

    setter(prev => {
      let newValue = prev[field] + increment;

      if (field === 'minutes' || field === 'seconds') {
        if (newValue >= 60) newValue = 0;
        else if (newValue < 0) newValue = 59;
      } else if (field === 'hours' && newValue < 0) {
        newValue = 0;
      }

      return { ...prev, [field]: newValue };
    });
  };

  const handleSave = () => {
    const minTotalMinutes = minTime.hours * 60 + minTime.minutes + Math.round(minTime.seconds / 60);
    const maxTotalMinutes = maxTime.hours * 60 + maxTime.minutes + Math.round(maxTime.seconds / 60);
    
    onSave({
      minDuration: minTotalMinutes,
      maxDuration: maxTotalMinutes,
      minTime,
      maxTime
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 pb-20">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Set Duration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <h3 className="text-sm font-medium text-gray-700">Minimum Duration</h3>
            </div>

            <div className="flex justify-center gap-3">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <div key={field} className="flex flex-col items-center">
                  <div className="relative">
                    <button
                      onClick={() => adjustTime('min', field, 1)}
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow hover:bg-emerald-600 active:scale-95"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>

                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-800">
                        {String(minTime[field]).padStart(2, '0')}
                      </span>
                    </div>

                    <button
                      onClick={() => adjustTime('min', field, -1)}
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow hover:bg-emerald-600 active:scale-95"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <span className="text-xs font-medium text-gray-500 mt-1 uppercase">
                    {field.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-xs text-gray-500">to</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h3 className="text-sm font-medium text-gray-700">Maximum Duration</h3>
            </div>

            <div className="flex justify-center gap-3">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <div key={field} className="flex flex-col items-center">
                  <div className="relative">
                    <button
                      onClick={() => adjustTime('max', field, 1)}
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow hover:bg-blue-600 active:scale-95"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>

                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-800">
                        {String(maxTime[field]).padStart(2, '0')}
                      </span>
                    </div>

                    <button
                      onClick={() => adjustTime('max', field, -1)}
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow hover:bg-blue-600 active:scale-95"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <span className="text-xs font-medium text-gray-500 mt-1 uppercase">
                    {field.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
const TaskComponent = React.memo(({
  task,
  stageId,
  level = 0,
  parentPath = [],
  onUpdateTask,
  onAddSubtask,
  onDeleteTask,
  onToggleExpansion,
  expandedItems,
  taskNumber = '1' // Add taskNumber prop
}) => {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const depthStyles = useMemo(() => {
    const colors = ['border-indigo-200', 'border-blue-200', 'border-emerald-200', 'border-purple-200', 'border-rose-200', 'border-amber-200'];
    const bgColors = ['bg-white', 'bg-blue-50', 'bg-emerald-50', 'bg-purple-50', 'bg-rose-50', 'bg-amber-50'];
    return {
      border: colors[level % colors.length],
      bg: bgColors[level % bgColors.length],
    };
  }, [level]);

  const handleChange = (field, value) => {
    onUpdateTask(stageId, task.id, field, value, parentPath);
  };

  const handleImageSave = (imageData) => {
    onUpdateTask(stageId, task.id, 'attachedImages', imageData.photos, parentPath);
    onUpdateTask(stageId, task.id, 'imageTitle', imageData.title, parentPath);
    onUpdateTask(stageId, task.id, 'imageDescription', imageData.description, parentPath);
  };

  const handleDurationSave = (duration) => {
    onUpdateTask(stageId, task.id, 'minDuration', duration.minDuration, parentPath);
    onUpdateTask(stageId, task.id, 'maxDuration', duration.maxDuration, parentPath);
    onUpdateTask(stageId, task.id, 'minTime', duration.minTime, parentPath);
    onUpdateTask(stageId, task.id, 'maxTime', duration.maxTime, parentPath);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Not set';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDetailedDuration = (timeObj) => {
    if (!timeObj) return '';
    const parts = [];
    if (timeObj.hours > 0) parts.push(`${timeObj.hours}h`);
    if (timeObj.minutes > 0) parts.push(`${timeObj.minutes}m`);
    if (timeObj.seconds > 0) parts.push(`${timeObj.seconds}s`);
    return parts.join(' ') || '0m';
  };

  const handleOpenImageModal = () => {
    setModalKey(prev => prev + 1);
    setShowImageModal(true);
  };

  const isExpanded = expandedItems[task.id] || false;

  return (
    <div
      className={`border-2 ${depthStyles.border} ${depthStyles.bg} rounded-2xl p-4 sm:p-6 mb-4 shadow-md hover:shadow-lg transition-all duration-300`}
    >
      {showImageModal && (
        <ImageAttachmentModal
          key={modalKey}
          onClose={() => setShowImageModal(false)}
          onSave={handleImageSave}
          initialTitle={task.imageTitle || ''}
          initialDescription={task.imageDescription || ''}
          initialPhotos={task.attachedImages || []}
        />
      )}

      {showDurationModal && (
        <DurationModal
          onClose={() => setShowDurationModal(false)}
          onSave={handleDurationSave}
          initialMin={task.minTime || { hours: 0, minutes: 10, seconds: 0 }}
          initialMax={task.maxTime || { hours: 0, minutes: 30, seconds: 0 }}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {hasSubtasks && (
            <button onClick={() => onToggleExpansion(task.id)} className="text-gray-600 hover:text-gray-800 transition-colors">
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          )}
          <span className="font-semibold text-gray-900 text-base sm:text-lg tracking-tight">
            {taskNumber}. {level === 0 ? 'Task' : `Subtask`}
          </span>
        </div>
        <button onClick={() => onDeleteTask(stageId, task.id, parentPath)} className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
          <Trash2 size={18} />
        </button>
      </div>

      {/* ... (rest of the TaskComponent remains the same until the subtasks section) */}
 <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Title</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
          <textarea
            value={task.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
            placeholder="Enter task description"
          />
        </div>

        {(task.minDuration || task.maxDuration) && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
              <span className="font-semibold">Duration:</span>
              <span className="font-medium">
                {task.minTime ? formatDetailedDuration(task.minTime) : formatDuration(task.minDuration)} 
                {' → '}
                {task.maxTime ? formatDetailedDuration(task.maxTime) : formatDuration(task.maxDuration)}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onAddSubtask(stageId, task.id, parentPath)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
          >
            <Plus size={14} />
            Create Subtask {level > 0 ? `(Level ${level + 1})` : ''}
          </button>

          <button
            onClick={() => setShowDurationModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
          >
            <Clock size={14} />
            Set Duration
          </button>

          <button
            onClick={handleOpenImageModal}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
          >
            <Image size={14} />
            Attach Images
          </button>
        </div>

        {task.attachedImages && task.attachedImages.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {task.attachedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Attached ${index + 1}`}
                    className="w-full h-32 sm:h-40 object-cover rounded-xl border border-gray-200 shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                  {image.name && <p className="text-sm font-medium text-gray-800 mt-2 truncate">{image.name}</p>}
                  {image.description && <p className="text-xs sm:text-sm text-gray-600">{image.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {hasSubtasks && isExpanded && (
        <div className="mt-4 sm:mt-6 space-y-4">
          {task.subtasks.map((subtask, index) => (
            <TaskComponent
              key={subtask.id}
              task={subtask}
              stageId={stageId}
              level={level + 1}
              parentPath={[...parentPath, task.id]}
              onUpdateTask={onUpdateTask}
              onAddSubtask={onAddSubtask}
              onDeleteTask={onDeleteTask}
              onToggleExpansion={onToggleExpansion}
              expandedItems={expandedItems}
              taskNumber={`${taskNumber}.${index + 1}`} // Add numbering for subtasks
            />
          ))}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.task === nextProps.task &&
    prevProps.expandedItems === nextProps.expandedItems &&
    prevProps.taskNumber === nextProps.taskNumber
  );
});

TaskComponent.displayName = 'TaskComponent';

const PrototypeManagementPage = () => {
  const [prototypeName, setPrototypeName] = useState('');
  const [stages, setStages] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedStage, setSelectedStage] = useState(null);

  const addStage = useCallback(() => {
    const newStage = {
      id: Date.now(),
      name: `Stage ${stages.length + 1}`,
      tasks: []
    };
    setStages(prev => [...prev, newStage]);
    if (stages.length === 0) {
      setSelectedStage(newStage.id);
    }
  }, [stages.length]);

  const updateStageName = useCallback((stageId, newName) => {
    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, name: newName }
        : stage
    ));
  }, []);

  const addTask = useCallback((stageId) => {
    const newTask = {
      id: Date.now(),
      title: '',
      description: '',
      minDuration: '',
      maxDuration: '',
      minTime: { hours: 0, minutes: 10, seconds: 0 },
      maxTime: { hours: 0, minutes: 30, seconds: 0 },
      attachedImages: [],
      imageTitle: '',
      imageDescription: '',
      imagePublicId: null,
      subtasks: []
    };
    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, tasks: [...stage.tasks, newTask] }
        : stage
    ));
  }, []);

  // ... (keep all other utility functions the same)
  const addSubtask = useCallback((stageId, taskId, parentPath = []) => {
    const newSubtask = {
      id: Date.now(),
      title: '',
      description: '',
      minDuration: '',
      maxDuration: '',
      minTime: { hours: 0, minutes: 10, seconds: 0 },
      maxTime: { hours: 0, minutes: 30, seconds: 0 },
      attachedImages: [],
      imageTitle: '',
      imageDescription: '',
      imagePublicId: null,
      subtasks: []
    };

    const updateTasks = (tasks) => {
      return tasks.map(task => {
        if (parentPath.length === 0 && task.id === taskId) {
          return { ...task, subtasks: [...task.subtasks, newSubtask] };
        }

        if (parentPath.length > 0 && task.id === parentPath[0]) {
          return {
            ...task,
            subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId)
          };
        }
        return task;
      });
    };

    const updateSubtasks = (subtasks, remainingPath, targetId = taskId) => {
      if (remainingPath.length === 0) {
        return subtasks.map(subtask =>
          subtask.id === targetId
            ? { ...subtask, subtasks: [...subtask.subtasks, newSubtask] }
            : subtask
        );
      }

      return subtasks.map(subtask => {
        if (subtask.id === remainingPath[0]) {
          return {
            ...subtask,
            subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId)
          };
        }
        return subtask;
      });
    };

    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, tasks: updateTasks(stage.tasks) }
        : stage
    ));
  }, []);

  const updateTaskField = useCallback((stageId, taskId, field, value, parentPath = []) => {
    const updateTasks = (tasks) => {
      return tasks.map(task => {
        if (parentPath.length === 0 && task.id === taskId) {
          return { ...task, [field]: value };
        }

        if (parentPath.length > 0 && task.id === parentPath[0]) {
          return {
            ...task,
            subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId, field, value)
          };
        }
        return task;
      });
    };

    const updateSubtasks = (subtasks, remainingPath, targetId = taskId, fieldToUpdate = field, newValue = value) => {
      if (remainingPath.length === 0) {
        return subtasks.map(subtask =>
          subtask.id === targetId
            ? { ...subtask, [fieldToUpdate]: newValue }
            : subtask
        );
      }

      return subtasks.map(subtask => {
        if (subtask.id === remainingPath[0]) {
          return {
            ...subtask,
            subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId, fieldToUpdate, newValue)
          };
        }
        return subtask;
      });
    };

    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, tasks: updateTasks(stage.tasks) }
        : stage
    ));
  }, []);

  const deleteTask = useCallback((stageId, taskId, parentPath = []) => {
    const updateTasks = (tasks) => {
      if (parentPath.length === 0) {
        return tasks.filter(task => task.id !== taskId);
      }

      return tasks.map(task => {
        if (task.id === parentPath[0]) {
          return {
            ...task,
            subtasks: updateSubtasks(task.subtasks, parentPath.slice(1), taskId)
          };
        }
        return task;
      });
    };

    const updateSubtasks = (subtasks, remainingPath, targetId) => {
      if (remainingPath.length === 0) {
        return subtasks.filter(subtask => subtask.id !== targetId);
      }

      return subtasks.map(subtask => {
        if (subtask.id === remainingPath[0]) {
          return {
            ...subtask,
            subtasks: updateSubtasks(subtask.subtasks, remainingPath.slice(1), targetId)
          };
        }
        return subtask;
      });
    };

    setStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, tasks: updateTasks(stage.tasks) }
        : stage
    ));
  }, []);

  const deleteStage = useCallback((stageId) => {
    setStages(prev => prev.filter(stage => stage.id !== stageId));
  }, []);

  const toggleExpansion = useCallback((id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

//   const handleSavePrototype = () => {
//     console.group("📝 Prototype Data Submitted");
//     console.log("Prototype Name:", prototypeName);
    
//     const stagesToSave = JSON.parse(JSON.stringify(stages, (key, value) => {
//       if (key === 'file') return undefined;
//       if (key === 'url' && value && value.startsWith('blob:')) return undefined;
//       return value;
//     }));
    
//     console.log("Stages:", stagesToSave);
//   const  newData={
//         title:prototypeName,
//         stages:stagesToSave
//     }
//     console.log("Corrected Data",newData);
//     console.groupEnd();
//   };


const handleSavePrototype = async () => {
  try {
    console.group("📝 Prototype Data Submitted");
    console.log("Prototype Name:", prototypeName);
    
    // Prepare the data for API
    const stagesToSave = JSON.parse(JSON.stringify(stages, (key, value) => {
      if (key === 'file') return undefined;
      if (key === 'url' && value && value.startsWith('blob:')) return undefined;
      return value;
    }));
    
    const requestData = {
      name: prototypeName,  // Using 'name' instead of 'title' to match API schema
      stages: stagesToSave
    };

    console.log("Data being sent:", requestData);
    
    // Send data to API
    const response = await fetch('/api/task/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("API Response:", result);
    
    // Handle successful save (e.g., show notification, redirect, etc.)
    alert('Prototype saved successfully!');
    console.groupEnd();
    
    return result;
  } catch (error) {
    console.error("Error saving prototype:", error);
    alert('Failed to save prototype. Please try again.');
    console.groupEnd();
    throw error;
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-full mx-auto">
       <Link href="/facility-dashboard"  className="flex font-semibold text-gray-800 font-2xl cursor-pointer"> <ArrowLeft size={24}/> Homepage</Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 tracking-tight">Prototype Management</h1>

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-tight">Prototype Name</label>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <input
                type="text"
                value={prototypeName}
                onChange={(e) => setPrototypeName(e.target.value)}
                className="w-full sm:flex-1 p-3 sm:p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300 text-gray-900"
                placeholder="Enter prototype name"
              />
              <button
                onClick={handleSavePrototype}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Save Prototype
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Stages Sidebar - 20% width */}
          <div className="w-full md:w-1/5 bg-white rounded-2xl shadow-lg p-4 sm:p-6 h-fit">
            <div className="flex flex-col sm:flex-row md:flex-col items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">Stages</h2>
              <button
                onClick={addStage}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto md:w-full justify-center"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Create Stage</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            <div className="space-y-2">
              {stages.map((stage) => (
                <div 
                  key={stage.id} 
                  onClick={() => setSelectedStage(stage.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${selectedStage === stage.id ? 'bg-indigo-100 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">{stage.name}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStage(stage.id);
                        if (selectedStage === stage.id) {
                          setSelectedStage(stages.length > 1 ? stages[0].id : null);
                        }
                      }}
                      className="text-gray-500 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stage.tasks.length} task{stage.tasks.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>

            {stages.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No stages created yet</p>
              </div>
            )}
          </div>

          {/* Tasks Content - 80% width */}
          <div className="w-full md:w-4/5 bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            {selectedStage ? (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                    {stages.find(s => s.id === selectedStage)?.name || 'Tasks'}
                  </h2>
                  <button
                    onClick={() => addTask(selectedStage)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto justify-center"
                  >
                    <Plus size={20} />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {stages.find(s => s.id === selectedStage)?.tasks.map((task, index) => (
                    <TaskComponent
                      key={task.id}
                      task={task}
                      stageId={selectedStage}
                      level={0}
                      parentPath={[]}
                      onUpdateTask={updateTaskField}
                      onAddSubtask={addSubtask}
                      onDeleteTask={deleteTask}
                      onToggleExpansion={toggleExpansion}
                      expandedItems={expandedItems}
                      taskNumber={`${index + 1}`} // Add numbering for tasks
                    />
                  ))}
                </div>

                {stages.find(s => s.id === selectedStage)?.tasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-base sm:text-lg font-medium">No tasks created yet for this stage.</p>
                    <button
                      onClick={() => addTask(selectedStage)}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      Create First Task
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-base sm:text-lg font-medium">
                  {stages.length > 0 ? 'Select a stage from the sidebar' : 'Create your first stage to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypeManagementPage;