'use client';

import React, { useState } from 'react';
import { ItineraryItem } from '@/lib/types';
import { Button } from '@/app/_components/ui/button';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ItineraryEditorProps {
  itinerary: ItineraryItem[];
  onChange: (itinerary: ItineraryItem[]) => void;
  onSave: () => Promise<void>;
  isSaving?: boolean;
  readOnly?: boolean;
}

export function ItineraryEditor({ itinerary, onChange, onSave, isSaving, readOnly }: ItineraryEditorProps) {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  const handleAddDay = () => {
    const newDay = itinerary.length > 0 ? Math.max(...itinerary.map(item => item.day)) + 1 : 1;
    const newItem: ItineraryItem = {
      day: newDay,
      title: '',
      description: '',
      location: '',
    };
    setEditingDay(newDay);
    setEditingItem(newItem);
  };

  const handleEditItem = (item: ItineraryItem) => {
    setEditingDay(item.day);
    setEditingItem({ ...item });
  };

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.title.trim()) {
      toast.error('Please enter a title for the activity');
      return;
    }

    const existingIndex = itinerary.findIndex(item => item.day === editingItem.day);
    
    if (existingIndex >= 0) {
      const updated = [...itinerary];
      updated[existingIndex] = editingItem;
      onChange(updated);
    } else {
      onChange([...itinerary, editingItem]);
    }

    setEditingDay(null);
    setEditingItem(null);
    toast.success('Activity saved');
  };

  const handleCancelEdit = () => {
    setEditingDay(null);
    setEditingItem(null);
  };

  const handleDeleteItem = (day: number) => {
    const updated = itinerary.filter(item => item.day !== day);
    onChange(updated);
    toast.success('Activity deleted');
  };

  const groupedByDay = itinerary.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  const days = Object.keys(groupedByDay).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Trip Itinerary
        </h2>
        {!readOnly && (
          <div className="flex gap-2">
            <Button onClick={handleAddDay} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Day
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving}
              variant="default"
            >
              {isSaving ? 'Saving...' : 'Save Itinerary'}
            </Button>
          </div>
        )}
        {readOnly && (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            View only (Owner can edit)
          </div>
        )}
      </div>

      <div className="space-y-4">
        {days.length === 0 && !editingItem && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {readOnly ? 'No itinerary items yet.' : 'No itinerary items yet. Add your first day!'}
            </p>
            {!readOnly && (
              <Button onClick={handleAddDay} variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Add First Day
              </Button>
            )}
          </div>
        )}

        {days.map((day) => {
          const items = groupedByDay[day];
          const isEditing = editingDay === day;

          return (
            <div key={day} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Day {day}
                </h3>
                {!isEditing && !readOnly && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditItem(items[0])}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteItem(day)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                )}
              </div>

              {isEditing && editingItem ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Activity Title *
                    </label>
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., Visit Eiffel Tower"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingItem.description}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Describe the activity..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingItem.location || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, location: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., Champ de Mars, Paris"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveItem} variant="default" size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={idx} className="mb-2 last:mb-0">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    )}
                    {item.location && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        📍 {item.location}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          );
        })}

        {editingDay && !days.includes(editingDay) && editingItem && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Day {editingDay}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activity Title *
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., Visit Eiffel Tower"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Describe the activity..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editingItem.location || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., Champ de Mars, Paris"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveItem} variant="default" size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
