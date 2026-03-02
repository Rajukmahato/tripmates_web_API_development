'use client';

import React, { useState } from 'react';
import { Button } from '@/app/_components/ui/button';
import { Plus, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChecklistEditorProps {
  checklist: string[];
  onChange: (checklist: string[]) => void;
  onSave: () => Promise<void>;
  isSaving?: boolean;
  readOnly?: boolean;
}

export function ChecklistEditor({ checklist, onChange, onSave, isSaving, readOnly }: ChecklistEditorProps) {
  const [newItem, setNewItem] = useState('');
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());

  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error('Please enter a checklist item');
      return;
    }

    onChange([...checklist, newItem.trim()]);
    setNewItem('');
    toast.success('Item added');
  };

  const handleDeleteItem = (index: number) => {
    const updated = checklist.filter((_, i) => i !== index);
    onChange(updated);
    
    // Remove from completed if it was completed
    const newCompleted = new Set(completedItems);
    newCompleted.delete(index);
    setCompletedItems(newCompleted);
    
    toast.success('Item deleted');
  };

  const handleToggleComplete = (index: number) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedItems(newCompleted);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const completedCount = completedItems.size;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Travel Checklist
          </h2>
          {totalCount > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {completedCount} of {totalCount} items completed ({Math.round(progress)}%)
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!readOnly && (
            <Button
              onClick={onSave}
              disabled={isSaving}
              variant="default"
            >
              {isSaving ? 'Saving...' : 'Save Checklist'}
            </Button>
          )}
          {readOnly && (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              View only (Owner can edit)
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Add New Item */}
      {!readOnly && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new item (e.g., Pack passport, Book hotel)"
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
        <Button onClick={handleAddItem} variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
        </div>
      )}

      {/* Checklist Items */}
      <div className="space-y-2">
        {checklist.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No checklist items yet. Add your first item!
            </p>
          </div>
        ) : (
          checklist.map((item, index) => {
            const isCompleted = completedItems.has(index);
            
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg transition-all ${
                  isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleComplete(index)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                  }`}
                >
                  {isCompleted && <Check className="h-4 w-4 text-white" />}
                </button>

                {/* Item Text */}
                <span
                  className={`flex-1 ${
                    isCompleted
                      ? 'line-through text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {item}
                </span>

                {/* Delete Button */}
                {!readOnly && (
                  <Button
                    onClick={() => handleDeleteItem(index)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Add Suggestions */}
      {!readOnly && checklist.length === 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick Add Suggestions:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Passport',
              'Travel insurance',
              'Book accommodation',
              'Pack clothes',
              'Currency exchange',
              'Charge devices',
              'Download offline maps',
              'Notify bank',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  onChange([...checklist, suggestion]);
                  toast.success(`Added "${suggestion}"`);
                }}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
